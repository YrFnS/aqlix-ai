"""
Iraqi Document Processing - Extracted from Docling

Provides Iraqi-enhanced document processing capabilities:
- PDF processing with Arabic support
- Table extraction with IQD currency
- OCR for scanned Iraqi documents
- Format conversion (PDF→Markdown→JSON)
- Cultural compliance validation
"""

from .iraqi_pdf_processor import IraqiPDFProcessor, IraqiLegalDocument
from .iraqi_table_extractor import (
    IraqiTableExtractor,
    LegalTerm,
    MedicalDataTable,
    IraqiTransaction,
)
from .iraqi_ocr_processor import IraqiOCRProcessor, OCRResult, IraqiPrescription
from .iraqi_document_converter import IraqiDocumentConverter
from .pydanticai_integration import (
    process_iraqi_legal_document,
    extract_document_tables,
    ocr_scanned_document,
)

__all__ = [
    "IraqiPDFProcessor",
    "IraqiLegalDocument",
    "IraqiTableExtractor",
    "LegalTerm",
    "MedicalDataTable",
    "IraqiTransaction",
    "IraqiOCRProcessor",
    "OCRResult",
    "IraqiPrescription",
    "IraqiDocumentConverter",
    "process_iraqi_legal_document",
    "extract_document_tables",
    "ocr_scanned_document",
]
