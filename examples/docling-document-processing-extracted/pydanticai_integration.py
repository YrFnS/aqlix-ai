"""
PydanticAI Integration for Iraqi Document Processing
Provides agent tools for document processing capabilities

Usage:
    from examples.docling_document_processing_extracted.pydanticai_integration import (
        process_iraqi_legal_document,
        process_iraqi_medical_record
    )
"""

from pydantic_ai import Agent, RunContext
from pydantic import BaseModel
from pathlib import Path
from typing import Optional, List, Dict
from .iraqi_pdf_processor import IraqiPDFProcessor, IraqiLegalDocument
from .iraqi_table_extractor import IraqiTableExtractor
from .iraqi_ocr_processor import IraqiOCRProcessor


class IraqiDeps(BaseModel):
    """Dependencies for Iraqi document processing agents"""

    pdf_processor: IraqiPDFProcessor
    table_extractor: IraqiTableExtractor
    ocr_processor: IraqiOCRProcessor


# Create agent instance
iraqi_document_agent = Agent("openai:gpt-4", deps_type=IraqiDeps)


@iraqi_document_agent.tool
async def process_iraqi_legal_document(
    ctx: RunContext[IraqiDeps], file_path: str
) -> Dict:
    """Process Iraqi legal document with cultural validation"""
    processor = ctx.deps.pdf_processor
    doc = await processor.process_legal_contract(
        Path(file_path), validate_cultural=True
    )
    return doc.model_dump()


@iraqi_document_agent.tool
async def extract_document_tables(ctx: RunContext[IraqiDeps], file_path: str) -> Dict:
    """Extract tables from Iraqi documents"""
    extractor = ctx.deps.table_extractor
    result = await extractor.extract_table_structure(Path(file_path))
    return result.model_dump()


@iraqi_document_agent.tool
async def ocr_scanned_document(ctx: RunContext[IraqiDeps], image_path: str) -> Dict:
    """OCR scanned Iraqi document"""
    ocr = ctx.deps.ocr_processor
    result = await ocr.ocr_scanned_contract(Path(image_path))
    return result.model_dump()
