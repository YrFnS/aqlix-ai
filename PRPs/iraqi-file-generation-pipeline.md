# PRP: Iraqi File Generation Pipeline

**Generated**: January 9, 2025  
**Feature**: File Generation Pipeline with Arabic RTL Support and Iraqi Cultural Compliance  
**Status**: Ready for Implementation  
**Confidence Score**: 9/10 (One-pass implementation expected)

## Context & Background

This PRP implements a comprehensive file generation pipeline for creating PDF, Word, and Excel documents from chat conversations with full Arabic RTL support and Iraqi cultural compliance. The feature is based on patterns from LibreChat's file handling capabilities but enhanced with Iraqi AI agent integration and professional document templates.

### Existing Codebase Patterns

**Primary Reference**: `examples/agent-zero-extracted/services/iraqi_document_processor.py`
- Contains `IraqiDocumentProcessor` class with Arabic OCR and cultural validation
- Implements Arabic text enhancement with `arabic_reshaper` and `python-bidi`
- Provides cultural validation integration patterns
- Uses `CulturalValidator` and `ArabicProcessingMeta` structures

**Key Integration Points**:
- FastAPI + Supabase architecture (existing in project)
- Iraqi AI agent system (21 specialized agents available)
- Cultural validation middleware patterns
- Arabic RTL processing utilities

## Technical Implementation

### Core Architecture

```python
# Primary Service Structure
from typing import Dict, List, Any, Optional, Union
from enum import Enum
from pathlib import Path
import asyncio
from datetime import datetime

class DocumentType(Enum):
    PDF = "pdf"
    WORD = "docx" 
    EXCEL = "xlsx"

class IraqiFileGenerationService:
    """Main orchestrator for Iraqi-compliant document generation"""
    
    def __init__(
        self,
        cultural_validator: CulturalValidator,
        arabic_processor: ArabicRTLProcessor,
        template_manager: DocumentTemplateManager
    ):
        self.cultural_validator = cultural_validator
        self.arabic_processor = arabic_processor
        self.template_manager = template_manager
        
    async def generate_document(
        self,
        content: Dict[str, Any],
        document_type: DocumentType,
        template: str,
        cultural_context: Dict[str, Any]
    ) -> DocumentGenerationResult:
        """Generate culturally-compliant document with Iraqi standards"""
        # MANDATORY: Cultural validation before generation
        validation = await self.cultural_validator.validate_content(content)
        if validation.score < 0.95:  # 95% cultural appropriateness required
            raise CulturalComplianceError(validation.issues)
            
        # Process Arabic RTL text
        processed_content = await self.arabic_processor.process_text(content)
        
        # Generate document with cultural compliance
        return await self._create_document(processed_content, document_type, template)
```

### Library Integration (2025)

**PDF Generation - ReportLab 4.4.0+**:
```python
# ReportLab with experimental RTL support + fallback
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph
import arabic_reshaper
from bidi.algorithm import get_display

def create_arabic_pdf(content: str, output_path: str):
    """Create PDF with Arabic RTL support - 2025 approach"""
    doc = SimpleDocTemplate(output_path, pagesize=letter)
    
    # Try ReportLab's experimental RTL (April 2025+)
    try:
        rtl_style = ParagraphStyle(
            'ArabicRTL',
            parent=getSampleStyleSheet()['Normal'],
            wordWrap='RTL',
            alignment=2,  # Right align
            fontName='Amiri'  # Arabic-compatible font
        )
        story = [Paragraph(content, rtl_style)]
    except:
        # Fallback to arabic-reshaper + python-bidi
        reshaped_text = arabic_reshaper.reshape(content)
        bidi_text = get_display(reshaped_text)
        story = [Paragraph(bidi_text, getSampleStyleSheet()['Normal'])]
    
    doc.build(story)
```

**Word Generation - python-docx-template**:
```bash
pip install "fastapi[standard]" docx docxtpl pydantic requests arabic-reshaper python-bidi
```

```python
from docxtpl import DocxTemplate
import arabic_reshaper
from bidi.algorithm import get_display

def create_arabic_word_document(template_path: str, content: Dict[str, Any], output_path: str):
    """Generate Word document with Arabic RTL support"""
    doc = DocxTemplate(template_path)
    
    # Process Arabic content
    processed_content = {}
    for key, value in content.items():
        if isinstance(value, str) and any('\u0600' <= char <= '\u06FF' for char in value):
            # Arabic text detected
            reshaped = arabic_reshaper.reshape(value)
            processed_content[key] = get_display(reshaped)
        else:
            processed_content[key] = value
    
    doc.render(processed_content)
    doc.save(output_path)
```

**Excel Generation - openpyxl**:
```python
from openpyxl import Workbook
from openpyxl.styles import Alignment
import arabic_reshaper
from bidi.algorithm import get_display

def create_arabic_excel(data: List[Dict[str, Any]], output_path: str):
    """Generate Excel with Arabic RTL support"""
    wb = Workbook()
    ws = wb.active
    
    # Set RTL worksheet direction
    ws.sheet_view.rightToLeft = True
    
    for row_idx, row_data in enumerate(data, 1):
        for col_idx, (key, value) in enumerate(row_data.items(), 1):
            if isinstance(value, str) and any('\u0600' <= char <= '\u06FF' for char in value):
                reshaped = arabic_reshaper.reshape(value)
                cell_value = get_display(reshaped)
            else:
                cell_value = value
                
            cell = ws.cell(row=row_idx, column=col_idx, value=cell_value)
            cell.alignment = Alignment(horizontal='right')  # RTL alignment
    
    wb.save(output_path)
```

### Iraqi AI Agent Integration

**MANDATORY Agent Workflow**:
```python
async def generate_with_cultural_compliance(content: str, document_type: DocumentType):
    """Required workflow with Iraqi AI agents"""
    
    # 1. Cultural Validation (NON-NEGOTIABLE)
    cultural_result = await task_agent(
        'iraqi-cultural-validator',
        f"Validate content for Iraqi cultural appropriateness: {content}"
    )
    if cultural_result.score < 0.95:
        raise CulturalComplianceError("Content requires cultural revision")
    
    # 2. Arabic RTL Processing (MANDATORY for Arabic text)
    if detect_arabic_text(content):
        rtl_result = await task_agent(
            'arabic-rtl-processor', 
            f"Process Arabic RTL text for document generation: {content}"
        )
        content = rtl_result.processed_text
    
    # 3. Professional Domain Validation
    if document_type in ['legal', 'medical', 'educational']:
        domain_result = await task_agent(
            'iraqi-professional-domain-expert',
            f"Validate {document_type} document for Iraqi professional standards"
        )
    
    # 4. Generate Document
    return await _generate_document(content, document_type)
```

### Database Schema

```sql
-- File Generation Tracking (Enhanced from feature requirements)
CREATE TABLE file_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    conversation_id UUID REFERENCES conversations(id),
    document_type TEXT NOT NULL CHECK (document_type IN ('pdf', 'docx', 'xlsx')),
    template_name TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    
    -- Iraqi Cultural Compliance Tracking
    cultural_validation_score DECIMAL(3,2) NOT NULL CHECK (cultural_validation_score >= 0.95),
    arabic_content_percentage DECIMAL(3,2),
    professional_domain TEXT,
    islamic_compliance_level TEXT CHECK (islamic_compliance_level IN ('appropriate', 'review', 'inappropriate')),
    
    -- File Management
    file_path TEXT,
    file_size BIGINT,
    storage_url TEXT,
    
    -- Performance Tracking
    generation_time_seconds DECIMAL(5,2),
    agent_processing_time_seconds DECIMAL(5,2),
    
    -- Metadata
    generation_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document Templates (Professional Iraqi Standards)
CREATE TABLE document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    document_type TEXT NOT NULL CHECK (document_type IN ('pdf', 'docx', 'xlsx')),
    
    -- Professional Domain Classification
    professional_domain TEXT CHECK (professional_domain IN ('legal', 'medical', 'educational', 'business', 'general')),
    
    -- Cultural Compliance Levels
    cultural_compliance_level TEXT NOT NULL CHECK (cultural_compliance_level IN ('basic', 'standard', 'strict')) DEFAULT 'standard',
    arabic_support_level TEXT NOT NULL CHECK (arabic_support_level IN ('none', 'basic', 'full')) DEFAULT 'full',
    
    -- Template Data
    template_data JSONB NOT NULL,
    template_file_path TEXT,
    
    -- Approval System
    is_officially_approved BOOLEAN DEFAULT FALSE,
    approved_by_domain_expert BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance and Security Indexes
CREATE INDEX idx_file_generations_user_created ON file_generations(user_id, created_at DESC);
CREATE INDEX idx_file_generations_cultural_score ON file_generations(cultural_validation_score);
CREATE INDEX idx_document_templates_domain ON document_templates(professional_domain, arabic_support_level);
```

### FastAPI Routes

```python
from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from fastapi.responses import FileResponse
from pydantic import BaseModel, validator
from typing import Optional, Dict, Any

router = APIRouter(prefix="/api/documents", tags=["Iraqi Document Generation"])

class DocumentGenerationRequest(BaseModel):
    content: Dict[str, Any]
    document_type: DocumentType
    template_name: str
    professional_domain: Optional[str] = "general"
    cultural_sensitivity: str = "standard"  # basic, standard, strict
    
    @validator('content')
    def validate_content_structure(cls, v):
        required_fields = ['title', 'body']
        for field in required_fields:
            if field not in v:
                raise ValueError(f"Missing required field: {field}")
        return v

@router.post("/generate/{document_type}")
async def generate_document(
    document_type: DocumentType,
    request: DocumentGenerationRequest,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user)
) -> Dict[str, Any]:
    """Generate document with Iraqi cultural compliance
    
    MANDATORY Requirements:
    - 95%+ cultural appropriateness score
    - 99%+ Arabic RTL accuracy (if Arabic content detected)
    - Professional domain validation for legal/medical/educational
    """
    
    try:
        # Cultural validation BEFORE generation
        cultural_score = await validate_cultural_content(
            request.content, 
            request.professional_domain
        )
        
        if cultural_score < 0.95:
            raise HTTPException(
                status_code=400,
                detail="Content does not meet Iraqi cultural standards (95%+ required)"
            )
        
        # Generate document
        result = await generate_culturally_compliant_document(
            request.content,
            document_type,
            request.template_name,
            current_user.id
        )
        
        # Background: Cleanup temporary files after 1 hour
        background_tasks.add_task(cleanup_temp_file, result.file_path, delay_hours=1)
        
        return {
            "success": True,
            "download_url": result.download_url,
            "cultural_score": cultural_score,
            "generation_time": result.processing_time,
            "file_size": result.file_size
        }
        
    except CulturalComplianceError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document generation failed: {str(e)}")

@router.get("/templates/{professional_domain}")
async def get_templates(
    professional_domain: str,
    arabic_support: bool = True,
    current_user: User = Depends(get_current_user)
) -> List[DocumentTemplate]:
    """Get available templates for professional domain"""
    
    return await get_approved_templates(
        professional_domain=professional_domain,
        arabic_support_level="full" if arabic_support else "none",
        user_permissions=current_user.permissions
    )
```

### Security & Privacy Implementation

**Temporary File Management**:
```python
import tempfile
import os
from datetime import datetime, timedelta
import asyncio

class SecureFileManager:
    """Manage temporary file lifecycle with Iraqi data protection compliance"""
    
    def __init__(self, retention_hours: int = 1):
        self.retention_hours = retention_hours
        self.temp_files = {}
    
    async def create_secure_temp_file(self, user_id: str, content_hash: str) -> str:
        """Create encrypted temporary file"""
        temp_dir = tempfile.mkdtemp(prefix=f"iraqi_doc_{user_id}_")
        temp_file = os.path.join(temp_dir, f"{content_hash}.tmp")
        
        # Schedule cleanup
        cleanup_time = datetime.now() + timedelta(hours=self.retention_hours)
        self.temp_files[temp_file] = cleanup_time
        
        return temp_file
    
    async def cleanup_expired_files(self):
        """Background task to cleanup expired temporary files"""
        current_time = datetime.now()
        expired_files = [
            file_path for file_path, cleanup_time in self.temp_files.items() 
            if current_time >= cleanup_time
        ]
        
        for file_path in expired_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    # Remove parent directory if empty
                    parent_dir = os.path.dirname(file_path)
                    if not os.listdir(parent_dir):
                        os.rmdir(parent_dir)
                del self.temp_files[file_path]
            except Exception as e:
                logger.error(f"Failed to cleanup temp file {file_path}: {e}")
```

## Implementation Tasks (12-Day Schedule)

### Phase 1: Infrastructure Setup (Days 1-2)
```bash
# Day 1: Database and Core Setup
bun run db:migrate  # Apply file generation tables
pip install reportlab==4.4.0 python-docx-template openpyxl arabic-reshaper python-bidi

# Day 2: FastAPI Routes and Agent Integration
# - Implement document generation routes
# - Connect Iraqi AI agent system
# - Set up cultural validation workflow
```

### Phase 2: Arabic RTL Processing (Days 3-4)
```bash
# Day 3: Core Arabic Processing
# - Implement ArabicRTLProcessor service
# - Test arabic-reshaper + python-bidi integration
# - Create fallback mechanisms for RTL failures

# Day 4: Document Format RTL Support
# - PDF: ReportLab experimental RTL + fallback
# - Word: RTL paragraph styles and text direction
# - Excel: RTL worksheet and cell alignment
```

### Phase 3: Cultural Validation (Days 5-6)
```bash
# Day 5: Agent Integration
# - Connect iraqi-cultural-validator agent
# - Implement 95%+ cultural score requirement
# - Create cultural validation error handling

# Day 6: Professional Domain Validation
# - Legal document compliance checking
# - Medical report format validation
# - Educational certificate standards
```

### Phase 4: Document Generation Services (Days 7-10)
```bash
# Day 7-8: PDF Generation
# - ReportLab 4.4.0 experimental RTL implementation
# - Arabic font integration (Amiri, Noto Naskh Arabic)
# - Professional template system for PDFs

# Day 9: Word Document Generation  
# - python-docx-template integration
# - Iraqi professional document headers/footers
# - Arabic text processing in templates

# Day 10: Excel Generation
# - openpyxl with RTL worksheet support
# - Arabic number formatting and date systems
# - Cultural data presentation standards
```

### Phase 5: Templates & Security (Days 11-12)
```bash
# Day 11: Professional Templates
# - Legal contract templates with Iraqi standards
# - Medical report formats with Arabic terminology
# - Educational certificate templates

# Day 12: Security & Performance
# - Implement secure temporary file management
# - Add audit logging and access controls
# - Performance optimization and caching
```

## Validation Gates (MUST PASS)

### Cultural Compliance Testing
```bash
# MANDATORY: 95%+ cultural appropriateness
bun run test:cultural
# Expected: All tests pass, cultural validation scores ≥ 0.95

# MANDATORY: 99%+ Arabic RTL accuracy  
bun run test:arabic
# Expected: RTL text rendering accurate across all formats

# Islamic compliance validation
bun run test:islamic-compliance
# Expected: Content appropriate for Iraqi Islamic values
```

### Technical Validation
```bash
# Code quality and standards
bun run lint
bun run typecheck

# Unit and integration tests
bun test
# Expected: >90% test coverage, all tests pass

# Document generation end-to-end testing
bun run test:document-generation
# Expected: PDF, Word, Excel generation <5 seconds each

# Agent integration testing
bun run test:agent-integration  
# Expected: All Iraqi AI agents respond <200ms
```

### Performance Benchmarks
```bash
# Generation speed requirements
# - Standard document: <5 seconds
# - API response: <200ms  
# - Cultural validation: <500ms
# - Concurrent users: 100+ simultaneous generations

# Security validation
bun run test:security
# Expected: No sensitive data leakage, proper access controls
```

## Critical Dependencies & Gotchas

### Library-Specific Issues

**ReportLab 4.4.0 RTL Support**:
- ⚠️ **EXPERIMENTAL FEATURE** - May be unstable
- 🔧 **Fallback Required**: Always implement arabic-reshaper + python-bidi fallback
- 📚 **Documentation**: https://docs.reportlab.com/rl-arabic/
- 🎯 **Font Requirements**: Amiri, Noto Naskh Arabic, or Tahoma fonts needed

**FastAPI PDF Response Pattern**:
- 📖 **Reference**: https://stackoverflow.com/questions/76195784/how-to-generate-and-return-a-pdf-file-from-in-memory-buffer-using-fastapi
- 🔧 **Implementation**: Use Response with proper headers and media_type
- ⚡ **Performance**: Stream large files to avoid memory issues

**Arabic Text Processing**:
- 📚 **Latest Guide**: https://medium.com/@yahdi/properly-rendering-arabic-text-in-python-and-pdf-with-arabic-reshaper-and-bidi-dosensibuk-com-3ce79499dff8  
- 🛠️ **Required Libraries**: `arabic-reshaper` + `python-bidi`
- 🎨 **Font Issues**: Arial gives reasonable Arabic results but proper Arabic fonts preferred

### Iraqi AI Agent Requirements

**Cultural Validation Agent**:
- 🚨 **MANDATORY**: 95%+ cultural appropriateness score
- ⏱️ **Timeout**: Agent must respond within 500ms
- 🔄 **Fallback**: Basic pattern matching if agent unavailable

**Arabic RTL Processor Agent**:  
- 🎯 **Accuracy**: 99%+ RTL rendering accuracy required
- 📏 **Performance**: <200ms processing time for standard documents
- 🔧 **Fallback**: Local arabic-reshaper processing if agent fails

**Professional Domain Expert**:
- 📋 **Domains**: Legal, medical, educational validation
- 🏛️ **Standards**: Iraqi professional document requirements
- ⚖️ **Compliance**: Professional ethics and terminology validation

### Security & Performance Considerations

**Temporary File Management**:
- ⏰ **Retention**: Maximum 1 hour for sensitive documents
- 🔐 **Encryption**: Implement at-rest encryption for sensitive content
- 🧹 **Cleanup**: Background task for automatic file removal

**Concurrent Generation Limits**:
- 👥 **Users**: Support 100+ simultaneous document generations
- 💾 **Memory**: Implement streaming for documents >10MB
- ⚡ **Performance**: Use connection pooling for database operations

## Error Handling Strategy

### Cultural Validation Failures
```python
class CulturalComplianceError(Exception):
    def __init__(self, issues: List[str], score: float):
        self.issues = issues
        self.score = score
        super().__init__(f"Cultural validation failed (score: {score:.2f}): {', '.join(issues)}")

# Usage in document generation
try:
    cultural_result = await validate_cultural_content(content)
    if cultural_result.score < 0.95:
        raise CulturalComplianceError(cultural_result.issues, cultural_result.score)
except CulturalComplianceError:
    # Return specific feedback for content revision
    return {"error": "cultural_validation", "suggestions": cultural_result.suggestions}
```

### Arabic Processing Failures
```python
def process_arabic_text_with_fallback(text: str) -> str:
    """Process Arabic text with multiple fallback strategies"""
    try:
        # Primary: ReportLab experimental RTL (2025)
        return process_with_reportlab_rtl(text)
    except Exception as e1:
        try:
            # Fallback 1: arabic-reshaper + python-bidi
            reshaped = arabic_reshaper.reshape(text)
            return get_display(reshaped)
        except Exception as e2:
            try:
                # Fallback 2: Basic RTL character reversal
                return text[::-1] if detect_arabic_text(text) else text
            except Exception as e3:
                # Final fallback: Return original text
                logger.error(f"All Arabic processing failed: {e1}, {e2}, {e3}")
                return text
```

## Success Metrics & Validation

### Functional Requirements
- ✅ **Cultural Compliance**: 95%+ appropriateness score (MANDATORY)
- ✅ **Arabic RTL Accuracy**: 99%+ proper rendering (MANDATORY)  
- ✅ **Generation Speed**: <5 seconds for standard documents
- ✅ **API Response**: <200ms for template requests
- ✅ **Template Usage**: 80%+ documents use professional templates

### Technical Requirements  
- ✅ **Agent Integration**: All Iraqi AI agents respond <500ms
- ✅ **Concurrent Users**: Handle 100+ simultaneous generations
- ✅ **File Support**: Documents up to 50MB
- ✅ **Error Rate**: <1% generation failure rate
- ✅ **Security Compliance**: Iraqi data protection standards

## Quality Assessment

**PRP Confidence Score: 9/10**

**Justification for High Confidence**:
✅ **Comprehensive Context**: Existing IraqiDocumentProcessor patterns provide proven foundation  
✅ **Latest Libraries**: 2025 ReportLab RTL support + established fallback mechanisms  
✅ **Clear Dependencies**: Specific Iraqi AI agent integration requirements documented  
✅ **Executable Validation**: All test commands are actionable with expected outcomes  
✅ **Risk Mitigation**: Fallback strategies for all critical failure points  
✅ **Performance Benchmarks**: Specific, measurable success criteria  

**Minor Risk Factors (-1 point)**:
⚠️ ReportLab experimental RTL features may require additional debugging
⚠️ Iraqi AI agent response times dependent on system load

**Mitigation Strategies**:
🛡️ Multiple fallback mechanisms for Arabic text processing
🛡️ Comprehensive error handling with graceful degradation
🛡️ Agent timeout handling with local processing fallbacks

This PRP provides complete implementation context for successful one-pass development of the Iraqi File Generation Pipeline with cultural compliance and Arabic RTL support.