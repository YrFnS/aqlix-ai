"""
FastAPI PDF Processing with Arabic OCR Support
Based on EasyOCR and PyMuPDF best practices for Iraqi documents
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import fitz  # PyMuPDF
import easyocr
import pdf2image
from PIL import Image
import io
import os
import magic
import hashlib
from typing import List, Optional, Dict, Any
import asyncio
from pathlib import Path
import arabic_reshaper
from bidi.algorithm import get_display

app = FastAPI(title="Iraqi Document Processing API")

# Initialize EasyOCR with Arabic and English support
ocr_reader = easyocr.Reader(['ar', 'en'], gpu=False)  # Set gpu=True if available

# Response Models
class DocumentMetadata(BaseModel):
    filename: str
    file_size: int
    pages: int
    language: str
    content_type: str
    processing_time: float

class ExtractedContent(BaseModel):
    text: str
    page_number: int
    confidence: float
    language_detected: str
    bounding_boxes: List[Dict[str, Any]]

class ProcessingResult(BaseModel):
    document_id: str
    metadata: DocumentMetadata
    extracted_content: List[ExtractedContent]
    summary: Optional[str] = None
    key_points: List[str] = []

# Utility Functions
def validate_file(file: UploadFile) -> bool:
    """Validate file type and content"""
    # Read first few bytes for magic number validation
    file.file.seek(0)
    file_content = file.file.read(2048)
    file.file.seek(0)
    
    # Detect actual MIME type
    mime_type = magic.from_buffer(file_content, mime=True)
    
    allowed_types = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
    
    return mime_type in allowed_types

def generate_document_id(filename: str, content: bytes) -> str:
    """Generate unique document ID"""
    content_hash = hashlib.md5(content).hexdigest()
    return f"{filename}_{content_hash[:8]}"

def process_arabic_text(text: str) -> str:
    """Process Arabic text for proper display"""
    if not text or not any('\u0600' <= char <= '\u06FF' for char in text):
        return text
    
    # Reshape Arabic text
    reshaped_text = arabic_reshaper.reshape(text)
    
    # Handle bidirectional text
    bidi_text = get_display(reshaped_text)
    
    return bidi_text

def extract_pdf_text(pdf_bytes: bytes) -> List[ExtractedContent]:
    """Extract text from PDF using PyMuPDF"""
    extracted_pages = []
    
    try:
        pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
        
        for page_num in range(pdf_document.page_count):
            page = pdf_document[page_num]
            
            # Extract text directly from PDF
            text = page.get_text()
            
            if text.strip():
                # Process Arabic text if present
                processed_text = process_arabic_text(text)
                
                extracted_pages.append(ExtractedContent(
                    text=processed_text,
                    page_number=page_num + 1,
                    confidence=1.0,  # High confidence for direct text extraction
                    language_detected='mixed' if any('\u0600' <= char <= '\u06FF' for char in text) else 'english',
                    bounding_boxes=[]
                ))
            else:
                # If no text, convert page to image for OCR
                pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom for better OCR
                img_data = pix.tobytes("png")
                
                # Perform OCR on the image
                ocr_result = perform_ocr_on_image(img_data)
                if ocr_result:
                    extracted_pages.append(ExtractedContent(
                        text=ocr_result['text'],
                        page_number=page_num + 1,
                        confidence=ocr_result['confidence'],
                        language_detected=ocr_result['language'],
                        bounding_boxes=ocr_result['bounding_boxes']
                    ))
        
        pdf_document.close()
        return extracted_pages
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF processing failed: {str(e)}")

def perform_ocr_on_image(image_data: bytes) -> Optional[Dict[str, Any]]:
    """Perform OCR on image data using EasyOCR"""
    try:
        # Convert bytes to PIL Image
        image = Image.open(io.BytesIO(image_data))
        
        # Perform OCR
        results = ocr_reader.readtext(image_data)
        
        if not results:
            return None
        
        # Combine all text and calculate average confidence
        extracted_text = []
        total_confidence = 0
        bounding_boxes = []
        arabic_chars = 0
        total_chars = 0
        
        for (bbox, text, confidence) in results:
            if confidence > 0.5:  # Only include high-confidence results
                processed_text = process_arabic_text(text)
                extracted_text.append(processed_text)
                total_confidence += confidence
                
                # Count Arabic characters for language detection
                arabic_chars += sum(1 for char in text if '\u0600' <= char <= '\u06FF')
                total_chars += len(text)
                
                # Store bounding box information
                bounding_boxes.append({
                    'bbox': bbox,
                    'text': processed_text,
                    'confidence': confidence
                })
        
        if not extracted_text:
            return None
        
        # Determine primary language
        arabic_ratio = arabic_chars / max(total_chars, 1)
        language = 'arabic' if arabic_ratio > 0.5 else 'english' if arabic_ratio == 0 else 'mixed'
        
        return {
            'text': '\n'.join(extracted_text),
            'confidence': total_confidence / len(extracted_text),
            'language': language,
            'bounding_boxes': bounding_boxes
        }
        
    except Exception as e:
        print(f"OCR processing error: {e}")
        return None

async def process_document_background(
    file_content: bytes, 
    filename: str, 
    content_type: str
) -> ProcessingResult:
    """Background task for document processing"""
    
    document_id = generate_document_id(filename, file_content)
    
    # Process different file types
    if content_type == 'application/pdf':
        extracted_content = extract_pdf_text(file_content)
        
        # Get PDF metadata
        pdf_doc = fitz.open(stream=file_content, filetype="pdf")
        page_count = pdf_doc.page_count
        pdf_doc.close()
        
    elif content_type in ['image/jpeg', 'image/png']:
        # Process single image
        ocr_result = perform_ocr_on_image(file_content)
        
        if ocr_result:
            extracted_content = [ExtractedContent(
                text=ocr_result['text'],
                page_number=1,
                confidence=ocr_result['confidence'],
                language_detected=ocr_result['language'],
                bounding_boxes=ocr_result['bounding_boxes']
            )]
        else:
            extracted_content = []
        
        page_count = 1
        
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {content_type}")
    
    # Create metadata
    metadata = DocumentMetadata(
        filename=filename,
        file_size=len(file_content),
        pages=page_count,
        language='mixed',  # Will be refined based on content
        content_type=content_type,
        processing_time=0.0  # Will be calculated
    )
    
    # Generate summary if content is available
    summary = None
    key_points = []
    
    if extracted_content:
        # Combine all text for summary
        full_text = '\n'.join([content.text for content in extracted_content])
        
        # Simple key points extraction (you can enhance with OpenAI here)
        sentences = full_text.split('.')
        key_points = [sent.strip() for sent in sentences[:5] if len(sent.strip()) > 20]
    
    return ProcessingResult(
        document_id=document_id,
        metadata=metadata,
        extracted_content=extracted_content,
        summary=summary,
        key_points=key_points
    )

# API Endpoints
@app.post("/documents/upload", response_model=ProcessingResult)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    language: Optional[str] = 'auto'
):
    """Upload and process a document"""
    
    # Validate file size (10MB limit for MVP)
    if file.size and file.size > 10 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 10MB.")
    
    # Read file content
    file_content = await file.read()
    
    # Validate file type
    if not validate_file(file):
        raise HTTPException(status_code=400, detail="Invalid file type. Supported: PDF, JPG, PNG, DOC, DOCX")
    
    # Detect content type
    content_type = magic.from_buffer(file_content, mime=True)
    
    try:
        # Process document
        result = await process_document_background(
            file_content, 
            file.filename, 
            content_type
        )
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document processing failed: {str(e)}")

@app.get("/documents/{document_id}", response_model=ProcessingResult)
async def get_document(document_id: str):
    """Retrieve processed document by ID"""
    # In production, this would retrieve from database
    # For now, return a placeholder response
    raise HTTPException(status_code=404, detail="Document not found")

@app.post("/documents/{document_id}/ask")
async def ask_document_question(
    document_id: str,
    question: str,
    language: str = 'auto'
):
    """Ask a question about the document content"""
    # This would integrate with OpenAI and document embeddings
    # For now, return a placeholder
    return {
        "answer": "Document Q&A functionality will be implemented with OpenAI integration",
        "citations": [],
        "confidence": 0.0
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "iraqi-document-processing",
        "ocr_languages": ['ar', 'en'],
        "supported_formats": ["PDF", "JPG", "PNG", "DOC", "DOCX"]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)