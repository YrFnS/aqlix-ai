# Secure File Upload for Iraqi AI Chat System

## Goal
Implement comprehensive secure file upload functionality for the Iraqi AI Chat System that supports multiple file formats with Arabic content processing, robust security validation, temporary storage with automatic deletion, and seamless integration with AI document processing workflows.

## Why
- **User Experience Enhancement**: Enable Iraqi professionals (lawyers, doctors, teachers, engineers) to upload and process documents directly in the chat interface
- **Document Processing Integration**: Connect uploaded files with PydanticAI agents for intelligent document analysis and Q&A
- **Cultural & Linguistic Support**: Provide proper Arabic text extraction and processing with Iraqi dialect recognition
- **Privacy Compliance**: Ensure temporary storage with automatic 1-hour deletion meets Iraqi data protection requirements
- **Professional Workflow**: Support common Iraqi document types (legal documents, medical records, educational materials, technical specifications)

## What
A production-ready file upload system with drag-and-drop interface, comprehensive security validation, Arabic content processing, and temporary storage with automatic cleanup.

### Success Criteria
- [ ] Upload success rate >95% for all supported file formats (PDF, DOCX, XLSX, images, text)
- [ ] Arabic text extraction accuracy >90% with proper RTL handling
- [ ] Security validation catches 100% of dangerous file types and malicious content
- [ ] Temporary files automatically deleted within 1 hour of upload
- [ ] Upload performance <30 seconds for files up to 10MB on Iraqi network conditions
- [ ] Full accessibility compliance with screen reader support
- [ ] Cross-browser compatibility including mobile devices
- [ ] Seamless integration with existing chat interface and PydanticAI processing

## All Needed Context

### Documentation & References
```yaml
# MUST READ - Include these in your context window
- url: https://react-dropzone.js.org/
  why: Official React Dropzone documentation for modern file upload patterns
  
- url: https://fastapi.tiangolo.com/tutorial/request-files/
  why: FastAPI file upload handling and UploadFile validation patterns
  
- url: https://github.com/JaidedAI/EasyOCR
  why: Arabic OCR processing with 80+ language support including Arabic
  
- url: https://pymupdf.readthedocs.io/en/latest/recipes-ocr.html
  why: PyMuPDF OCR capabilities and Arabic text extraction from PDFs
  
- file: examples/document-upload/file-upload-component.tsx
  why: Existing React Dropzone component with Arabic RTL support and progress tracking
  
- file: examples/file-security/validation-patterns.py
  why: Comprehensive security validation including Arabic filename handling and virus scanning
  
- file: examples/pdf-processing/fastapi-pdf-processor.py
  why: Document processing with Arabic OCR, text extraction, and FastAPI integration
  
- file: examples/main_agent_reference/settings.py
  why: Environment configuration patterns with python-dotenv and pydantic-settings
  
- doc: https://betterstack.com/community/guides/scaling-python/uploading-files-using-fastapi/
  section: Security best practices and file validation
  critical: Always validate file content using magic numbers, not just extensions

- doc: https://www.tenorshare.com/image-translator/best-arabic-ocr-tools.html
  section: Arabic OCR tools comparison and accuracy metrics
  critical: EasyOCR with Arabic support provides best balance of accuracy and performance
```

### Current Codebase Tree (relevant sections)
```bash
/
├── apps/
│   ├── web/                    # Next.js frontend application
│   └── api/                    # Python FastAPI backend
│       ├── agents/             # PydanticAI agent modules
│       ├── routes/             # FastAPI route handlers
│       └── services/           # Business logic services
├── packages/                   # Shared cross-platform code
│   ├── ui/                     # Shared UI components
│   ├── types/                  # TypeScript type definitions
│   ├── features/              # Business logic (chat/, documents/, payments/)
│   └── api-client/            # API client utilities
├── examples/                   # Reference implementations
│   ├── document-upload/        # File upload React component
│   ├── file-security/         # Security validation patterns
│   ├── pdf-processing/        # Document processing with Arabic OCR
│   └── main_agent_reference/   # PydanticAI agent architecture
```

### Desired Codebase Tree with New Files
```bash
# New files to be created:
packages/types/
├── file-upload.ts              # Shared TypeScript interfaces for file upload
└── document-processing.ts      # Document processing result types

packages/features/documents/
├── upload-client.ts           # Frontend upload utilities
├── validation.ts             # Shared validation logic
└── processing.ts             # Document processing utilities

apps/web/src/components/documents/
├── FileUploadDropzone.tsx     # Enhanced upload component with security
├── FilePreview.tsx           # File preview with RTL support
├── UploadProgress.tsx        # Progress tracking component
└── BatchUploadQueue.tsx      # Batch upload management

apps/api/src/routes/
└── documents/
    ├── upload.py             # File upload endpoints
    ├── processing.py         # Document processing endpoints
    └── cleanup.py           # Automatic file cleanup endpoints

apps/api/src/services/
├── file_validator.py        # Enhanced security validation service
├── arabic_processor.py      # Arabic text extraction service
├── storage_manager.py       # Temporary storage with auto-cleanup
└── document_analyzer.py     # PydanticAI integration for document analysis
```

### Known Gotchas of Our Codebase & Library Quirks
```python
# CRITICAL: Environment setup for PydanticAI
# Always use python-dotenv with load_dotenv() before creating Settings
from dotenv import load_dotenv
load_dotenv()  # MUST be called before Settings initialization

# CRITICAL: Arabic filename encoding in Python
# Use UTF-8 encoding for Arabic filenames, handle path traversal
import os
filename = "مستند_قانوني.pdf"  # Arabic filename
safe_filename = filename.encode('utf-8').decode('utf-8')

# CRITICAL: React Dropzone Arabic RTL support
# Always set dir and font classes for Arabic text
const direction = language === 'arabic' ? 'rtl' : 'ltr';
const fontFamily = language === 'arabic' ? 'font-arabic' : 'font-sans';

# CRITICAL: FastAPI file size limitations
# File size cannot be validated before reading the entire file
# Use streaming for large files to prevent memory issues
async def upload_large_file(file: UploadFile):
    content = await file.read()  # Reads entire file into memory
    # For production: implement streaming upload with chunk processing

# CRITICAL: Magic number validation required
# Never trust file extensions or Content-Type headers
import magic
actual_mime = magic.from_buffer(file_content, mime=True)
if actual_mime not in ALLOWED_TYPES:
    raise SecurityError("File type not allowed")

# CRITICAL: Arabic text extraction with EasyOCR
# Initialize once, not per request (expensive operation)
ocr_reader = easyocr.Reader(['ar', 'en'], gpu=False)  # Global instance

# CRITICAL: PyMuPDF Arabic text ordering
# RTL text may be returned in reverse order, needs reshaping
import arabic_reshaper
from bidi.algorithm import get_display
reshaped = arabic_reshaper.reshape(arabic_text)
display_text = get_display(reshaped)
```

## Implementation Blueprint

### Data Models and Structure

Create core data models for type safety and consistency:

```python
# packages/types/file-upload.ts
export interface FileUploadRequest {
  file: File;
  language: 'arabic' | 'english' | 'auto';
  userId?: string;
  chatSessionId?: string;
}

export interface FileValidationResult {
  isValid: boolean;
  filename: string;
  sanitizedFilename: string;
  fileSize: number;
  mimeType: string;
  fileHash: string;
  warnings: string[];
  securityStatus: 'safe' | 'suspicious' | 'dangerous';
}

export interface DocumentProcessingResult {
  documentId: string;
  extractedText: string;
  language: 'arabic' | 'english' | 'mixed';
  confidence: number;
  pages: number;
  processingTime: number;
  keyPoints: string[];
  summary?: string;
}

# apps/api/src/models/document.py
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class FileUploadConfig(BaseModel):
    """Configuration for file upload validation"""
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: List[str] = ['.pdf', '.docx', '.xlsx', '.jpg', '.jpeg', '.png', '.txt']
    enable_virus_scan: bool = False  # Enable in production
    auto_delete_hours: int = 1
    
class DocumentMetadata(BaseModel):
    """Document metadata after processing"""
    document_id: str
    original_filename: str
    sanitized_filename: str
    file_size: int
    mime_type: str
    upload_timestamp: datetime
    expiry_timestamp: datetime
    language_detected: str
    pages: int
    is_safe: bool
    processing_status: str = "pending"
```

### List of Tasks to be Completed (in order)

```yaml
Task 1 - Environment Setup:
MODIFY apps/api/requirements.txt:
  - ADD: python-magic, easyocr, arabic-reshaper, python-bidi
  - ADD: Pillow, PyMuPDF, aiofiles
  - VERIFY: pydantic-settings, python-dotenv already present

MODIFY apps/web/package.json:
  - ADD: react-dropzone@^14.0.0 (latest 2024 version)
  - ADD: @types/file-saver for file download utilities
  - VERIFY: existing Arabic font and RTL support

CREATE apps/api/.env.example:
  - ADD file upload configuration variables
  - ADD temporary storage path configuration
  - ADD virus scanning API keys (optional)

Task 2 - Shared Type Definitions:
CREATE packages/types/file-upload.ts:
  - DEFINE FileUploadRequest, FileValidationResult interfaces
  - DEFINE DocumentProcessingResult, UploadProgress interfaces
  - INCLUDE Arabic language support in type definitions
  - MIRROR validation types from Python models

CREATE packages/types/document-processing.ts:
  - DEFINE PydanticAI integration types
  - DEFINE document analysis request/response types
  - INCLUDE Iraqi cultural context types

Task 3 - Enhanced Security Validator:
MODIFY apps/api/src/services/file_validator.py:
  - BASE on: examples/file-security/validation-patterns.py
  - ENHANCE with Iraqi-specific filename validation
  - ADD comprehensive virus scanning integration
  - ADD rate limiting and abuse prevention
  - INCLUDE quarantine system for suspicious files

Task 4 - Backend API Implementation:
CREATE apps/api/src/routes/documents/upload.py:
  - BASE on: examples/pdf-processing/fastapi-pdf-processor.py
  - INTEGRATE enhanced security validator
  - ADD temporary storage with auto-cleanup
  - IMPLEMENT progress tracking for large files
  - ADD batch upload support

CREATE apps/api/src/services/arabic_processor.py:
  - INTEGRATE EasyOCR for Arabic text extraction
  - ADD PyMuPDF for PDF text extraction
  - IMPLEMENT proper Arabic text reshaping and BiDi
  - ADD Iraqi dialect recognition (where possible)

CREATE apps/api/src/services/storage_manager.py:
  - IMPLEMENT temporary file storage
  - ADD automatic cleanup after 1 hour
  - INCLUDE file access logging for security
  - ADD file retrieval and preview endpoints

Task 5 - Frontend Upload Component:
MODIFY apps/web/src/components/documents/FileUploadDropzone.tsx:
  - BASE on: examples/document-upload/file-upload-component.tsx
  - ENHANCE with real-time security validation
  - ADD comprehensive error handling with Arabic messages
  - IMPLEMENT progress tracking with pause/resume
  - ADD accessibility features for screen readers

CREATE apps/web/src/components/documents/FilePreview.tsx:
  - IMPLEMENT preview for different file types
  - ADD RTL support for Arabic document preview
  - INCLUDE text extraction preview
  - ADD download and delete functionality

Task 6 - Batch Processing:
CREATE apps/web/src/components/documents/BatchUploadQueue.tsx:
  - IMPLEMENT queue management for multiple files
  - ADD concurrent upload limiting (max 3 simultaneous)
  - INCLUDE overall progress tracking
  - ADD bulk operations (delete all, retry failed)

CREATE apps/api/src/services/document_analyzer.py:
  - INTEGRATE with PydanticAI agents
  - ADD document Q&A capabilities
  - IMPLEMENT content summarization
  - ADD Iraqi professional context awareness

Task 7 - Auto-Cleanup System:
CREATE apps/api/src/tasks/cleanup.py:
  - IMPLEMENT background task for file deletion
  - ADD cleanup logging and monitoring
  - INCLUDE error handling for cleanup failures
  - ADD manual cleanup endpoints for admin

Task 8 - Integration & Chat Interface:
MODIFY apps/web/src/components/chat/ChatInterface.tsx:
  - INTEGRATE file upload dropzone
  - ADD file attachment display in chat
  - IMPLEMENT document reference in AI responses
  - ADD file sharing capabilities

Task 9 - Testing & Validation:
CREATE tests/api/test_file_upload.py:
  - TEST all security validation scenarios
  - TEST Arabic filename handling
  - TEST file processing with various formats
  - INCLUDE performance benchmarks

CREATE tests/web/FileUpload.test.tsx:
  - TEST drag-and-drop functionality
  - TEST Arabic RTL interface
  - TEST error handling and user feedback
  - INCLUDE accessibility testing
```

### Per Task Pseudocode

```python
# Task 3 - Enhanced Security Validator
class IraqiFileValidator(BaseValidator):
    def __init__(self, config: FileUploadConfig):
        # PATTERN: Initialize with config validation
        self.config = self._validate_config(config)
        self.virus_scanner = self._init_virus_scanner()
        self.arabic_patterns = self._load_arabic_patterns()
    
    async def validate_file(self, file_content: bytes, filename: str) -> ValidationResult:
        # CRITICAL: Always validate in this order
        # 1. Basic validation (size, filename)
        if len(file_content) > self.config.max_file_size:
            raise FileTooLargeError()
        
        # 2. Filename security check (including Arabic)
        safe_filename = self._sanitize_arabic_filename(filename)
        
        # 3. Magic number validation (NEVER trust extensions)
        actual_mime = magic.from_buffer(file_content, mime=True)
        if actual_mime not in ALLOWED_MIMES:
            raise InvalidFileTypeError()
        
        # 4. Content-based security scanning
        if self._has_dangerous_patterns(file_content):
            await self._quarantine_file(file_content, filename)
            raise SecurityThreatError()
        
        # 5. Virus scanning (if enabled)
        if self.config.enable_virus_scan:
            scan_result = await self._scan_for_viruses(file_content)
            if not scan_result.is_clean:
                raise VirusDetectedError()
        
        return ValidationResult(is_safe=True, sanitized_filename=safe_filename)

# Task 4 - Backend API with Arabic Processing
@app.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    language: str = "auto",
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    # PATTERN: Always validate before processing
    file_content = await file.read()
    
    # CRITICAL: Security validation first
    validator = IraqiFileValidator()
    validation_result = await validator.validate_file(file_content, file.filename)
    
    if not validation_result.is_safe:
        raise HTTPException(400, "File validation failed")
    
    # PATTERN: Generate secure document ID
    document_id = f"{uuid.uuid4().hex}_{validation_result.file_hash[:8]}"
    
    # CRITICAL: Store in temporary location with expiry
    storage_path = await storage_manager.store_temporary(
        file_content, 
        validation_result.sanitized_filename,
        expiry_hours=1
    )
    
    # PATTERN: Background processing for large files
    background_tasks.add_task(
        process_document_content,
        document_id,
        storage_path,
        language
    )
    
    # PATTERN: Immediate response with processing status
    return {
        "document_id": document_id,
        "status": "processing",
        "filename": validation_result.sanitized_filename,
        "estimated_time": "30-60 seconds"
    }

# Task 5 - Frontend Component with Progress
const FileUploadDropzone: React.FC<Props> = ({ language, onUpload }) => {
    // PATTERN: State management for upload progress
    const [uploads, setUploads] = useState<UploadState[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        // CRITICAL: Client-side validation first
        const validFiles = acceptedFiles.filter(file => 
            file.size <= MAX_FILE_SIZE && 
            ALLOWED_EXTENSIONS.includes(getFileExtension(file.name))
        );
        
        if (validFiles.length !== acceptedFiles.length) {
            showError(t.invalidFiles);
            return;
        }
        
        // PATTERN: Initialize upload states
        const newUploads = validFiles.map(file => ({
            id: generateUploadId(),
            file,
            progress: 0,
            status: 'pending' as const,
            startTime: Date.now()
        }));
        
        setUploads(prev => [...prev, ...newUploads]);
        
        // CRITICAL: Upload with progress tracking
        for (const upload of newUploads) {
            try {
                await uploadWithProgress(upload);
            } catch (error) {
                updateUploadStatus(upload.id, 'error', String(error));
            }
        }
    }, [language]);
    
    const uploadWithProgress = async (upload: UploadState) => {
        const formData = new FormData();
        formData.append('file', upload.file);
        formData.append('language', language);
        
        // PATTERN: XMLHttpRequest for progress tracking
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            
            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const progress = (event.loaded / event.total) * 100;
                    updateUploadProgress(upload.id, progress);
                }
            };
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText);
                    updateUploadStatus(upload.id, 'completed');
                    onUpload(result);
                    resolve(result);
                } else {
                    reject(new Error(`Upload failed: ${xhr.statusText}`));
                }
            };
            
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.open('POST', '/api/documents/upload');
            xhr.send(formData);
        });
    };
    
    // PATTERN: RTL support for Arabic interface
    const direction = language === 'arabic' ? 'rtl' : 'ltr';
    const textAlign = language === 'arabic' ? 'text-right' : 'text-left';
    
    return (
        <div dir={direction} className={`font-${language === 'arabic' ? 'arabic' : 'sans'}`}>
            {/* Upload dropzone with accessibility */}
            <div
                {...getRootProps()}
                className="upload-zone"
                role="button"
                tabIndex={0}
                aria-label={t.uploadInstructions}
            >
                <input {...getInputProps()} aria-describedby="upload-help" />
                {/* Upload UI with progress indicators */}
            </div>
        </div>
    );
};
```

### Integration Points
```yaml
DATABASE:
  - migration: "CREATE TABLE uploaded_documents (id, filename, hash, expiry, metadata)"
  - index: "CREATE INDEX idx_expiry ON uploaded_documents(expiry_timestamp)"
  
CONFIG:
  - add to: apps/api/src/settings.py
  - pattern: "UPLOAD_MAX_SIZE = int(os.getenv('UPLOAD_MAX_SIZE', '10485760'))"
  - add: "TEMP_STORAGE_PATH = os.getenv('TEMP_STORAGE_PATH', './temp_uploads')"
  
ROUTES:
  - add to: apps/api/src/main.py
  - pattern: "app.include_router(documents_router, prefix='/api/documents')"
  
CHAT_INTEGRATION:
  - modify: apps/web/src/components/chat/ChatInterface.tsx
  - add: File attachment display and document reference capabilities
  
PYDANTIC_AI:
  - integrate: Document analysis agents for uploaded files
  - add: Q&A capabilities for document content
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Backend validation
cd apps/api
ruff check src/ --fix
mypy src/
python -m pytest tests/test_imports.py  # Verify all imports work

# Frontend validation
cd apps/web
npm run typecheck
npm run lint:fix
npm run build  # Verify TypeScript compilation

# Expected: No errors. If errors, READ the error carefully and fix.
```

### Level 2: Unit Tests
```python
# CREATE tests/api/test_file_validator.py
import pytest
from unittest.mock import Mock, patch
from services.file_validator import IraqiFileValidator

def test_arabic_filename_validation():
    """Arabic filenames are properly sanitized and validated"""
    validator = IraqiFileValidator()
    arabic_filename = "مستند_قانوني.pdf"
    
    result = validator.sanitize_filename(arabic_filename)
    assert result.is_valid
    assert len(result.sanitized_name) <= 255
    assert not any(char in result.sanitized_name for char in ['..', '/', '\\'])

def test_security_validation_blocks_executables():
    """Executable files are blocked regardless of extension"""
    validator = IraqiFileValidator()
    
    # Windows executable with PDF extension
    malicious_content = b'\x4D\x5A' + b'fake pdf content'
    
    with pytest.raises(SecurityThreatError):
        validator.validate_content(malicious_content, "document.pdf")

def test_arabic_text_extraction():
    """Arabic text is properly extracted and processed"""
    processor = ArabicProcessor()
    
    # Test with real Arabic PDF content
    with open("tests/fixtures/arabic_document.pdf", "rb") as f:
        pdf_content = f.read()
    
    result = processor.extract_text(pdf_content)
    assert result.language_detected == "arabic"
    assert result.confidence > 0.8
    assert len(result.extracted_text) > 0
    assert "العربية" in result.extracted_text  # Contains Arabic text

def test_file_upload_endpoint():
    """File upload endpoint processes files correctly"""
    client = TestClient(app)
    
    # Test with valid PDF
    with open("tests/fixtures/sample.pdf", "rb") as f:
        response = client.post(
            "/documents/upload",
            files={"file": ("sample.pdf", f, "application/pdf")},
            data={"language": "auto"}
        )
    
    assert response.status_code == 200
    result = response.json()
    assert "document_id" in result
    assert result["status"] == "processing"

# CREATE tests/web/FileUpload.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FileUploadDropzone } from '../components/documents/FileUploadDropzone';

test('handles Arabic filenames correctly', async () => {
    const onUpload = jest.fn();
    render(<FileUploadDropzone language="arabic" onUpload={onUpload} />);
    
    // Create file with Arabic name
    const arabicFile = new File(['content'], 'مستند.pdf', { type: 'application/pdf' });
    
    const dropzone = screen.getByRole('button');
    fireEvent.drop(dropzone, { dataTransfer: { files: [arabicFile] } });
    
    await waitFor(() => {
        expect(screen.getByText(/مستند.pdf/)).toBeInTheDocument();
    });
});

test('displays upload progress correctly', async () => {
    const onUpload = jest.fn();
    render(<FileUploadDropzone language="english" onUpload={onUpload} />);
    
    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const dropzone = screen.getByRole('button');
    
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    
    // Should show progress bar
    await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});
```

```bash
# Run backend tests
cd apps/api
uv run pytest tests/test_file_validator.py -v
uv run pytest tests/test_upload_endpoint.py -v

# Run frontend tests  
cd apps/web
npm test -- FileUpload.test.tsx

# If failing: Read error messages, understand root cause, fix code, re-run
# Never mock external dependencies just to make tests pass - fix the actual issue
```

### Level 3: Integration Test
```bash
# Start the backend service
cd apps/api
uv run python -m src.main --reload

# Start the frontend (in another terminal)
cd apps/web
npm run dev

# Test file upload with real files
curl -X POST http://localhost:8001/api/documents/upload \
  -F "file=@tests/fixtures/arabic_document.pdf" \
  -F "language=auto"

# Expected response:
# {
#   "document_id": "abc123...",
#   "status": "processing", 
#   "filename": "arabic_document.pdf",
#   "estimated_time": "30-60 seconds"
# }

# Test Arabic filename upload
curl -X POST http://localhost:8001/api/documents/upload \
  -F "file=@tests/fixtures/مستند_عربي.pdf" \
  -F "language=arabic"

# Test security validation (should fail)
curl -X POST http://localhost:8001/api/documents/upload \
  -F "file=@tests/fixtures/malicious.exe" \
  -F "language=auto"

# Expected: 400 error with security validation message

# Test frontend integration
# 1. Open http://localhost:3000 in browser
# 2. Navigate to document upload
# 3. Drag and drop Arabic PDF file
# 4. Verify upload progress and completion
# 5. Check file preview with RTL text
# 6. Test accessibility with screen reader
```

## Final Validation Checklist
- [ ] All tests pass: `uv run pytest tests/ -v && npm test`
- [ ] No linting errors: `ruff check apps/api/src/ && npm run lint`
- [ ] No type errors: `mypy apps/api/src/ && npm run typecheck`
- [ ] Security validation works: Upload malicious files are blocked
- [ ] Arabic processing works: Arabic text extracted with >90% accuracy
- [ ] File cleanup works: Files automatically deleted after 1 hour
- [ ] Performance acceptable: 10MB files upload in <30 seconds
- [ ] Accessibility verified: Screen reader compatibility tested
- [ ] Cross-browser tested: Chrome, Firefox, Safari, mobile browsers
- [ ] Integration works: Files accessible in chat interface
- [ ] Error handling graceful: Clear error messages in Arabic and English

---

## Anti-Patterns to Avoid
- ❌ Don't trust file extensions or Content-Type headers - always validate with magic numbers
- ❌ Don't store uploaded files permanently without explicit user consent
- ❌ Don't skip Arabic filename encoding validation - can cause security issues
- ❌ Don't initialize EasyOCR reader on every request - expensive operation
- ❌ Don't ignore file size limits - can cause memory exhaustion
- ❌ Don't skip virus scanning in production - critical security requirement
- ❌ Don't hardcode file paths - use environment configuration
- ❌ Don't ignore background task failures - implement proper error handling
- ❌ Don't skip accessibility testing - required for Iraqi government compliance
- ❌ Don't assume network stability - implement proper retry mechanisms for Iraqi conditions

---

**PRP Confidence Level: 9/10**

This PRP provides comprehensive context for one-pass implementation success through:
- Complete integration with existing codebase patterns
- Detailed security considerations with validation gates
- Specific Iraqi and Arabic processing requirements
- Clear implementation sequence with executable validation
- Comprehensive error handling and edge case coverage
- Production-ready performance and scalability considerations