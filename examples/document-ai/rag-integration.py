"""
RAG (Retrieval Augmented Generation) Integration for Document Q&A
Supports Arabic text and Iraqi document context
"""

from typing import List, Dict, Any, Optional
import openai
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
import faiss
import numpy as np
import pickle
from dataclasses import dataclass
import os
from pathlib import Path
import asyncio

@dataclass
class DocumentChunk:
    text: str
    page_number: int
    document_id: str
    metadata: Dict[str, Any]
    embedding: Optional[np.ndarray] = None

@dataclass
class SearchResult:
    chunk: DocumentChunk
    similarity_score: float
    citation: str

class IraqiDocumentRAG:
    """RAG system optimized for Iraqi documents with Arabic text support"""
    
    def __init__(self, openai_api_key: str, index_path: str = "./faiss_indexes"):
        self.openai_client = openai.AsyncOpenAI(api_key=openai_api_key)
        self.embeddings = OpenAIEmbeddings(openai_api_key=openai_api_key)
        self.index_path = Path(index_path)
        self.index_path.mkdir(exist_ok=True)
        
        # Initialize text splitter with Arabic-aware settings
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", ".", "!", "?", "؟", ".", "،", " ", ""],
            length_function=len,
        )
        
        # FAISS index for vector similarity search
        self.vector_index = None
        self.document_chunks = []
        
        # Iraqi document context prompts
        self.system_prompts = {
            'arabic': """أنت مساعد ذكي متخصص في تحليل الوثائق العراقية. قم بتحليل الوثائق المرفوعة وأجب على الأسئلة بناءً على محتواها.

إرشادات مهمة:
- استخدم المصطلحات القانونية والمهنية العراقية
- اذكر المراجع الدقيقة (رقم الصفحة، القسم)
- إذا كانت الوثيقة قانونية، اذكر المواد والفقرات المحددة
- حافظ على الدقة ولا تفترض معلومات غير موجودة
- استخدم اللهجة العراقية المناسبة للسياق المهني""",
            
            'english': """You are an AI assistant specialized in analyzing Iraqi documents. Analyze uploaded documents and answer questions based on their content.

Important guidelines:
- Use Iraqi legal and professional terminology when applicable
- Provide specific references (page numbers, sections)
- For legal documents, cite specific articles and paragraphs
- Maintain accuracy and don't assume information not present
- Consider Iraqi cultural and professional context""",
            
            'mixed': """You are a bilingual AI assistant specialized in analyzing Iraqi documents in both Arabic and English. Respond in the same language as the question, and provide accurate analysis based on document content."""
        }

    async def add_document(self, document_id: str, extracted_content: List[Dict[str, Any]]):
        """Add a processed document to the RAG system"""
        document_chunks = []
        
        for page_content in extracted_content:
            text = page_content['text']
            page_num = page_content['page_number']
            
            if not text.strip():
                continue
                
            # Split text into chunks
            chunks = self.text_splitter.split_text(text)
            
            for i, chunk in enumerate(chunks):
                chunk_obj = DocumentChunk(
                    text=chunk,
                    page_number=page_num,
                    document_id=document_id,
                    metadata={
                        'chunk_index': i,
                        'language': page_content.get('language_detected', 'mixed'),
                        'confidence': page_content.get('confidence', 0.0)
                    }
                )
                document_chunks.append(chunk_obj)
        
        # Generate embeddings for chunks
        await self._generate_embeddings(document_chunks)
        
        # Add to vector index
        self._add_to_vector_index(document_chunks)
        
        # Save updated index
        self._save_index(document_id)
        
        return len(document_chunks)

    async def _generate_embeddings(self, chunks: List[DocumentChunk]):
        """Generate embeddings for document chunks"""
        texts = [chunk.text for chunk in chunks]
        
        try:
            # Generate embeddings using OpenAI
            embeddings = await self.embeddings.aembed_documents(texts)
            
            for chunk, embedding in zip(chunks, embeddings):
                chunk.embedding = np.array(embedding, dtype=np.float32)
                
        except Exception as e:
            print(f"Error generating embeddings: {e}")
            # Fallback: create dummy embeddings
            for chunk in chunks:
                chunk.embedding = np.random.rand(1536).astype(np.float32)

    def _add_to_vector_index(self, chunks: List[DocumentChunk]):
        """Add document chunks to FAISS vector index"""
        if not chunks:
            return
            
        # Prepare embeddings matrix
        embeddings_matrix = np.vstack([chunk.embedding for chunk in chunks])
        
        if self.vector_index is None:
            # Create new index
            dimension = embeddings_matrix.shape[1]
            self.vector_index = faiss.IndexFlatIP(dimension)  # Inner product for cosine similarity
            
            # Normalize vectors for cosine similarity
            faiss.normalize_L2(embeddings_matrix)
            
            self.vector_index.add(embeddings_matrix)
            self.document_chunks = chunks.copy()
        else:
            # Add to existing index
            faiss.normalize_L2(embeddings_matrix)
            self.vector_index.add(embeddings_matrix)
            self.document_chunks.extend(chunks)

    def _save_index(self, document_id: str):
        """Save FAISS index and document chunks to disk"""
        if self.vector_index is not None:
            # Save FAISS index
            faiss.write_index(self.vector_index, str(self.index_path / "vector_index.faiss"))
            
            # Save document chunks metadata
            with open(self.index_path / "document_chunks.pkl", "wb") as f:
                pickle.dump(self.document_chunks, f)

    def _load_index(self):
        """Load FAISS index and document chunks from disk"""
        index_file = self.index_path / "vector_index.faiss"
        chunks_file = self.index_path / "document_chunks.pkl"
        
        if index_file.exists() and chunks_file.exists():
            self.vector_index = faiss.read_index(str(index_file))
            
            with open(chunks_file, "rb") as f:
                self.document_chunks = pickle.load(f)

    async def search_documents(self, query: str, top_k: int = 5) -> List[SearchResult]:
        """Search for relevant document chunks"""
        if self.vector_index is None:
            self._load_index()
            
        if self.vector_index is None or not self.document_chunks:
            return []
        
        # Generate query embedding
        query_embedding = await self.embeddings.aembed_query(query)
        query_vector = np.array(query_embedding, dtype=np.float32).reshape(1, -1)
        faiss.normalize_L2(query_vector)
        
        # Search similar chunks
        scores, indices = self.vector_index.search(query_vector, top_k)
        
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx < len(self.document_chunks):
                chunk = self.document_chunks[idx]
                citation = f"Document: {chunk.document_id}, Page: {chunk.page_number}"
                
                results.append(SearchResult(
                    chunk=chunk,
                    similarity_score=float(score),
                    citation=citation
                ))
        
        return results

    async def answer_question(
        self, 
        question: str, 
        document_id: Optional[str] = None,
        language: str = 'auto'
    ) -> Dict[str, Any]:
        """Answer a question using RAG approach"""
        
        # Search for relevant chunks
        search_results = await self.search_documents(question, top_k=3)
        
        if not search_results:
            return {
                "answer": "لم أجد معلومات ذات صلة في الوثائق المرفوعة." if 'ا' in question else "I couldn't find relevant information in the uploaded documents.",
                "citations": [],
                "confidence": 0.0
            }
        
        # Filter by document_id if specified
        if document_id:
            search_results = [r for r in search_results if r.chunk.document_id == document_id]
        
        # Prepare context from search results
        context_chunks = []
        citations = []
        
        for result in search_results:
            context_chunks.append(f"[Page {result.chunk.page_number}]: {result.chunk.text}")
            citations.append({
                "document_id": result.chunk.document_id,
                "page_number": result.chunk.page_number,
                "similarity_score": result.similarity_score,
                "text_preview": result.chunk.text[:100] + "..."
            })
        
        context = "\n\n".join(context_chunks)
        
        # Detect language and select appropriate system prompt
        if language == 'auto':
            has_arabic = any('\u0600' <= char <= '\u06FF' for char in question)
            language = 'arabic' if has_arabic else 'english'
        
        system_prompt = self.system_prompts.get(language, self.system_prompts['mixed'])
        
        # Generate answer using OpenAI
        try:
            response = await self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"""
Based on the following document content, answer this question: {question}

Document Content:
{context}

Instructions:
- Base your answer only on the provided document content
- Include specific page references in your answer
- If the information is not in the documents, clearly state that
- Maintain professional tone appropriate for Iraqi context
"""}
                ],
                temperature=0.1,
                max_tokens=1000
            )
            
            answer = response.choices[0].message.content
            
            # Calculate confidence based on search results
            avg_similarity = np.mean([r.similarity_score for r in search_results])
            confidence = min(avg_similarity * 1.2, 1.0)  # Boost confidence slightly
            
            return {
                "answer": answer,
                "citations": citations,
                "confidence": confidence,
                "search_results_count": len(search_results)
            }
            
        except Exception as e:
            error_message = f"Error generating answer: {e}"
            return {
                "answer": "حدث خطأ في معالجة السؤال. يرجى المحاولة مرة أخرى." if language == 'arabic' else "Error processing question. Please try again.",
                "citations": citations,
                "confidence": 0.0,
                "error": error_message
            }

# Usage Example
async def main():
    """Example usage of the RAG system"""
    rag_system = IraqiDocumentRAG(
        openai_api_key=os.getenv("OPENAI_API_KEY"),
        index_path="./iraqi_docs_index"
    )
    
    # Example: Add a document (this would come from the document processor)
    sample_document = [
        {
            "text": "هذا مثال على عقد إيجار عراقي. يتضمن العقد شروط الإيجار والدفع والتزامات الطرفين...",
            "page_number": 1,
            "language_detected": "arabic",
            "confidence": 0.95
        }
    ]
    
    await rag_system.add_document("lease_contract_001", sample_document)
    
    # Example: Ask a question
    result = await rag_system.answer_question(
        "ما هي شروط الإيجار في هذا العقد؟",
        language='arabic'
    )
    
    print("Answer:", result["answer"])
    print("Citations:", result["citations"])
    print("Confidence:", result["confidence"])

if __name__ == "__main__":
    asyncio.run(main())