"""
Iraqi Knowledge Base - Comprehensive knowledge management for Iraqi domains

Manages Iraqi legal documents, regulatory frameworks, professional standards,
and cultural knowledge with Arabic language support and Islamic compliance.
"""

from typing import Dict, List, Optional, Any, Union, Tuple
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
import json
import asyncio
from pathlib import Path

from pydantic import BaseModel, Field
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS
from langchain.schema import Document


class IraqiDomain(Enum):
    """Iraqi professional and governmental domains"""
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    BUSINESS = "business"
    RELIGIOUS = "religious"
    CULTURAL = "cultural"
    TECHNICAL = "technical"
    FINANCIAL = "financial"
    SOCIAL = "social"


class DocumentType(Enum):
    """Types of Iraqi documents"""
    LAW = "law"
    REGULATION = "regulation"
    POLICY = "policy"
    GUIDELINE = "guideline"
    STANDARD = "standard"
    PROCEDURE = "procedure"
    TEMPLATE = "template"
    REFERENCE = "reference"
    CASE_STUDY = "case_study"
    FATWA = "fatwa"


class LanguageVariant(Enum):
    """Arabic language variants supported"""
    STANDARD_ARABIC = "standard_arabic"
    IRAQI_ARABIC = "iraqi_arabic"
    FORMAL_ARABIC = "formal_arabic"
    LEGAL_ARABIC = "legal_arabic"
    MEDICAL_ARABIC = "medical_arabic"
    BUSINESS_ARABIC = "business_arabic"


@dataclass
class IraqiDocument:
    """Represents an Iraqi document in the knowledge base"""
    
    # Document identification
    doc_id: str
    title: str
    content: str
    domain: IraqiDomain
    doc_type: DocumentType
    
    # Language and cultural info
    language: str = "arabic"
    language_variant: LanguageVariant = LanguageVariant.STANDARD_ARABIC
    arabic_text: bool = True
    rtl_formatted: bool = True
    
    # Metadata
    source: Optional[str] = None
    author: Optional[str] = None
    organization: Optional[str] = None
    date_created: Optional[datetime] = None
    date_updated: Optional[datetime] = None
    version: str = "1.0"
    
    # Iraqi-specific metadata
    government_agency: Optional[str] = None
    legal_framework: Optional[str] = None
    islamic_compliance: bool = True
    cultural_sensitivity: bool = True
    
    # Document relationships
    references: List[str] = field(default_factory=list)
    related_documents: List[str] = field(default_factory=list)
    superseded_by: Optional[str] = None
    
    # Processing metadata
    processed_at: Optional[datetime] = None
    embedding_model: Optional[str] = None
    chunk_count: int = 0
    
    # Validation status
    validated: bool = False
    validation_errors: List[str] = field(default_factory=list)


class IraqiKnowledgeBase:
    """
    Comprehensive knowledge management system for Iraqi domains
    
    Manages Iraqi legal documents, regulatory frameworks, professional standards,
    and cultural knowledge with Arabic language support and Islamic compliance.
    """
    
    def __init__(
        self,
        base_path: str = "./iraqi_knowledge_base",
        embedding_model: str = "text-embedding-ada-002",
        chunk_size: int = 1000,
        chunk_overlap: int = 200
    ):
        self.base_path = Path(base_path)
        self.embedding_model = embedding_model
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        
        # Initialize components
        self.embeddings = OpenAIEmbeddings(model=embedding_model)
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", ".", "؟", "!", "؛", " "]  # Arabic separators
        )
        
        # Storage
        self.documents: Dict[str, IraqiDocument] = {}
        self.vector_stores: Dict[IraqiDomain, FAISS] = {}
        self.domain_indexes: Dict[IraqiDomain, Dict[str, Any]] = {}
        
        # Cultural context
        self.cultural_validators = {}
        self.islamic_compliance_checkers = {}
        
        # Initialize directories
        self._initialize_directories()
    
    def _initialize_directories(self):
        """Initialize knowledge base directory structure"""
        
        # Create main directories
        domains = [
            "legal", "medical", "educational", "government", 
            "business", "religious", "cultural", "technical", 
            "financial", "social"
        ]
        
        for domain in domains:
            domain_path = self.base_path / domain
            domain_path.mkdir(parents=True, exist_ok=True)
            
            # Create subdirectories
            for subdir in ["documents", "embeddings", "indexes", "metadata"]:
                (domain_path / subdir).mkdir(exist_ok=True)
    
    async def add_document(
        self,
        document: IraqiDocument,
        validate_compliance: bool = True,
        generate_embeddings: bool = True
    ) -> bool:
        """Add document to knowledge base with validation"""
        
        try:
            # Validate document
            if validate_compliance:
                validation_result = await self._validate_document(document)
                if not validation_result["valid"]:
                    document.validation_errors = validation_result["errors"]
                    return False
            
            # Process document content
            chunks = await self._process_document_content(document)
            document.chunk_count = len(chunks)
            
            # Generate embeddings if requested
            if generate_embeddings:
                await self._generate_document_embeddings(document, chunks)
            
            # Store document
            self.documents[document.doc_id] = document
            
            # Update domain index
            await self._update_domain_index(document)
            
            # Mark as processed
            document.processed_at = datetime.now(timezone.utc)
            document.validated = True
            
            # Save to disk
            await self._save_document_metadata(document)
            
            return True
            
        except Exception as e:
            document.validation_errors.append(f"Processing error: {str(e)}")
            return False
    
    async def search_documents(
        self,
        query: str,
        domain: Optional[IraqiDomain] = None,
        doc_type: Optional[DocumentType] = None,
        language: str = "arabic",
        top_k: int = 10,
        similarity_threshold: float = 0.7
    ) -> List[Tuple[IraqiDocument, float]]:
        """Search documents with cultural and linguistic context"""
        
        # Prepare search query with cultural context
        processed_query = await self._process_search_query(query, language)
        
        results = []
        
        # Search specific domain or all domains
        domains_to_search = [domain] if domain else list(IraqiDomain)
        
        for search_domain in domains_to_search:
            if search_domain not in self.vector_stores:
                continue
            
            # Perform vector search
            vector_store = self.vector_stores[search_domain]
            search_results = await vector_store.asimilarity_search_with_score(
                processed_query,
                k=top_k
            )
            
            # Filter and format results
            for doc, score in search_results:
                if score >= similarity_threshold:
                    doc_id = doc.metadata.get("doc_id")
                    if doc_id in self.documents:
                        iraqi_doc = self.documents[doc_id]
                        
                        # Apply filters
                        if doc_type and iraqi_doc.doc_type != doc_type:
                            continue
                        
                        results.append((iraqi_doc, score))
        
        # Sort by relevance score
        results.sort(key=lambda x: x[1], reverse=True)
        
        return results[:top_k]
    
    async def get_domain_statistics(self, domain: IraqiDomain) -> Dict[str, Any]:
        """Get statistics for specific domain"""
        
        domain_docs = [
            doc for doc in self.documents.values() 
            if doc.domain == domain
        ]
        
        stats = {
            "total_documents": len(domain_docs),
            "document_types": {},
            "languages": {},
            "arabic_documents": 0,
            "islamic_compliant": 0,
            "culturally_sensitive": 0,
            "average_chunk_count": 0,
            "last_updated": None,
            "government_agencies": set(),
            "legal_frameworks": set()
        }
        
        if not domain_docs:
            return stats
        
        # Calculate statistics
        for doc in domain_docs:
            # Document types
            doc_type = doc.doc_type.value
            stats["document_types"][doc_type] = stats["document_types"].get(doc_type, 0) + 1
            
            # Languages
            stats["languages"][doc.language] = stats["languages"].get(doc.language, 0) + 1
            
            # Arabic documents
            if doc.arabic_text:
                stats["arabic_documents"] += 1
            
            # Islamic compliance
            if doc.islamic_compliance:
                stats["islamic_compliant"] += 1
            
            # Cultural sensitivity
            if doc.cultural_sensitivity:
                stats["culturally_sensitive"] += 1
            
            # Chunk count
            stats["average_chunk_count"] += doc.chunk_count
            
            # Last updated
            if doc.date_updated:
                if not stats["last_updated"] or doc.date_updated > stats["last_updated"]:
                    stats["last_updated"] = doc.date_updated
            
            # Government agencies
            if doc.government_agency:
                stats["government_agencies"].add(doc.government_agency)
            
            # Legal frameworks
            if doc.legal_framework:
                stats["legal_frameworks"].add(doc.legal_framework)
        
        # Calculate averages
        stats["average_chunk_count"] = stats["average_chunk_count"] / len(domain_docs)
        stats["government_agencies"] = list(stats["government_agencies"])
        stats["legal_frameworks"] = list(stats["legal_frameworks"])
        
        return stats
    
    async def validate_islamic_compliance(self, doc_id: str) -> Dict[str, Any]:
        """Validate Islamic compliance for document"""
        
        if doc_id not in self.documents:
            return {"valid": False, "error": "Document not found"}
        
        document = self.documents[doc_id]
        
        compliance_checks = {
            "halal_content": await self._check_halal_content(document),
            "appropriate_language": await self._check_appropriate_language(document),
            "gender_sensitivity": await self._check_gender_sensitivity(document),
            "religious_respect": await self._check_religious_respect(document),
            "cultural_appropriateness": await self._check_cultural_appropriateness(document)
        }
        
        overall_compliant = all(compliance_checks.values())
        
        return {
            "valid": overall_compliant,
            "checks": compliance_checks,
            "document_id": doc_id,
            "validated_at": datetime.now(timezone.utc).isoformat()
        }
    
    async def get_related_documents(
        self,
        doc_id: str,
        relationship_types: List[str] = None,
        max_results: int = 10
    ) -> List[Tuple[IraqiDocument, str]]:
        """Get documents related to specified document"""
        
        if doc_id not in self.documents:
            return []
        
        source_doc = self.documents[doc_id]
        related = []
        
        # Get explicitly related documents
        for related_id in source_doc.related_documents:
            if related_id in self.documents:
                related.append((self.documents[related_id], "explicit_relation"))
        
        # Get referenced documents
        for ref_id in source_doc.references:
            if ref_id in self.documents:
                related.append((self.documents[ref_id], "reference"))
        
        # Find semantically similar documents
        if len(related) < max_results:
            similarity_results = await self.search_documents(
                source_doc.title + " " + source_doc.content[:500],
                domain=source_doc.domain,
                top_k=max_results - len(related) + 1  # +1 to exclude self
            )
            
            for similar_doc, score in similarity_results:
                if similar_doc.doc_id != doc_id and score > 0.8:
                    related.append((similar_doc, f"semantic_similarity_{score:.2f}"))
        
        return related[:max_results]
    
    async def update_document(
        self,
        doc_id: str,
        updates: Dict[str, Any],
        reprocess: bool = True
    ) -> bool:
        """Update existing document"""
        
        if doc_id not in self.documents:
            return False
        
        document = self.documents[doc_id]
        
        # Apply updates
        for key, value in updates.items():
            if hasattr(document, key):
                setattr(document, key, value)
        
        # Update timestamp
        document.date_updated = datetime.now(timezone.utc)
        document.version = str(float(document.version) + 0.1)
        
        # Reprocess if needed
        if reprocess:
            chunks = await self._process_document_content(document)
            document.chunk_count = len(chunks)
            await self._generate_document_embeddings(document, chunks)
        
        # Update indexes
        await self._update_domain_index(document)
        
        # Save metadata
        await self._save_document_metadata(document)
        
        return True
    
    async def _validate_document(self, document: IraqiDocument) -> Dict[str, Any]:
        """Validate document for compliance and quality"""
        
        errors = []
        
        # Basic validation
        if not document.title.strip():
            errors.append("Document title is required")
        
        if not document.content.strip():
            errors.append("Document content is required")
        
        # Language validation
        if document.arabic_text and document.language not in ["arabic", "mixed"]:
            errors.append("Arabic text flag set but language is not Arabic")
        
        # Islamic compliance validation
        if document.islamic_compliance:
            compliance_result = await self._check_islamic_compliance(document)
            if not compliance_result:
                errors.append("Document fails Islamic compliance check")
        
        # Cultural sensitivity validation
        if document.cultural_sensitivity:
            sensitivity_result = await self._check_cultural_sensitivity(document)
            if not sensitivity_result:
                errors.append("Document fails cultural sensitivity check")
        
        return {
            "valid": len(errors) == 0,
            "errors": errors
        }
    
    async def _process_document_content(self, document: IraqiDocument) -> List[str]:
        """Process document content into chunks"""
        
        # Handle Arabic text processing
        if document.arabic_text:
            # Use Arabic-aware text splitting
            chunks = self._split_arabic_text(document.content)
        else:
            chunks = self.text_splitter.split_text(document.content)
        
        return chunks
    
    def _split_arabic_text(self, text: str) -> List[str]:
        """Split Arabic text with RTL awareness"""
        
        # Arabic-specific splitting logic
        arabic_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            separators=["\n\n", "\n", ".", "؟", "!", "؛", "،", " "]
        )
        
        return arabic_splitter.split_text(text)
    
    async def _generate_document_embeddings(
        self,
        document: IraqiDocument,
        chunks: List[str]
    ) -> None:
        """Generate embeddings for document chunks"""
        
        # Create documents for vector store
        docs = []
        for i, chunk in enumerate(chunks):
            doc = Document(
                page_content=chunk,
                metadata={
                    "doc_id": document.doc_id,
                    "chunk_id": i,
                    "domain": document.domain.value,
                    "doc_type": document.doc_type.value,
                    "language": document.language,
                    "arabic_text": document.arabic_text,
                    "islamic_compliance": document.islamic_compliance
                }
            )
            docs.append(doc)
        
        # Create or update vector store for domain
        if document.domain not in self.vector_stores:
            self.vector_stores[document.domain] = FAISS.from_documents(docs, self.embeddings)
        else:
            self.vector_stores[document.domain].add_documents(docs)
    
    async def _update_domain_index(self, document: IraqiDocument) -> None:
        """Update domain index with document information"""
        
        if document.domain not in self.domain_indexes:
            self.domain_indexes[document.domain] = {
                "documents": {},
                "document_types": set(),
                "languages": set(),
                "government_agencies": set(),
                "legal_frameworks": set()
            }
        
        index = self.domain_indexes[document.domain]
        index["documents"][document.doc_id] = {
            "title": document.title,
            "doc_type": document.doc_type.value,
            "language": document.language,
            "date_updated": document.date_updated
        }
        
        index["document_types"].add(document.doc_type.value)
        index["languages"].add(document.language)
        
        if document.government_agency:
            index["government_agencies"].add(document.government_agency)
        
        if document.legal_framework:
            index["legal_frameworks"].add(document.legal_framework)
    
    async def _process_search_query(self, query: str, language: str) -> str:
        """Process search query with cultural context"""
        
        # Handle Arabic query processing
        if language == "arabic":
            # Apply Arabic text normalization
            processed_query = self._normalize_arabic_text(query)
        else:
            processed_query = query
        
        return processed_query
    
    def _normalize_arabic_text(self, text: str) -> str:
        """Normalize Arabic text for better search"""
        
        # Arabic text normalization logic
        # Remove diacritics, normalize characters, etc.
        normalized = text
        
        # Character normalization
        char_replacements = {
            'ي': 'ي',  # Normalize ya
            'ة': 'ه',  # Taa marbuta normalization
            'أ': 'ا',  # Hamza normalization
            'إ': 'ا',
            'آ': 'ا'
        }
        
        for old_char, new_char in char_replacements.items():
            normalized = normalized.replace(old_char, new_char)
        
        return normalized
    
    async def _check_islamic_compliance(self, document: IraqiDocument) -> bool:
        """Check Islamic compliance of document"""
        # Implementation would check content against Islamic guidelines
        return True  # Placeholder
    
    async def _check_cultural_sensitivity(self, document: IraqiDocument) -> bool:
        """Check cultural sensitivity of document"""
        # Implementation would check cultural appropriateness
        return True  # Placeholder
    
    async def _check_halal_content(self, document: IraqiDocument) -> bool:
        """Check if content is halal"""
        # Implementation would validate halal compliance
        return True  # Placeholder
    
    async def _check_appropriate_language(self, document: IraqiDocument) -> bool:
        """Check if language is appropriate"""
        # Implementation would validate language appropriateness
        return True  # Placeholder
    
    async def _check_gender_sensitivity(self, document: IraqiDocument) -> bool:
        """Check gender sensitivity compliance"""
        # Implementation would validate gender considerations
        return True  # Placeholder
    
    async def _check_religious_respect(self, document: IraqiDocument) -> bool:
        """Check religious respect in content"""
        # Implementation would validate religious respect
        return True  # Placeholder
    
    async def _check_cultural_appropriateness(self, document: IraqiDocument) -> bool:
        """Check cultural appropriateness"""
        # Implementation would validate cultural appropriateness
        return True  # Placeholder
    
    async def _save_document_metadata(self, document: IraqiDocument) -> None:
        """Save document metadata to disk"""
        
        metadata_path = self.base_path / document.domain.value / "metadata" / f"{document.doc_id}.json"
        
        # Convert document to dictionary
        metadata = {
            "doc_id": document.doc_id,
            "title": document.title,
            "domain": document.domain.value,
            "doc_type": document.doc_type.value,
            "language": document.language,
            "language_variant": document.language_variant.value,
            "arabic_text": document.arabic_text,
            "rtl_formatted": document.rtl_formatted,
            "source": document.source,
            "author": document.author,
            "organization": document.organization,
            "date_created": document.date_created.isoformat() if document.date_created else None,
            "date_updated": document.date_updated.isoformat() if document.date_updated else None,
            "version": document.version,
            "government_agency": document.government_agency,
            "legal_framework": document.legal_framework,
            "islamic_compliance": document.islamic_compliance,
            "cultural_sensitivity": document.cultural_sensitivity,
            "references": document.references,
            "related_documents": document.related_documents,
            "superseded_by": document.superseded_by,
            "processed_at": document.processed_at.isoformat() if document.processed_at else None,
            "embedding_model": document.embedding_model,
            "chunk_count": document.chunk_count,
            "validated": document.validated,
            "validation_errors": document.validation_errors
        }
        
        # Save to file
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(metadata, f, ensure_ascii=False, indent=2)