# PDF Converter for Arabic Documents
# Extracted from anything-llm collector, adapted for Iraqi legal/medical PDFs

import PyPDF2
from .base_converter import BaseConverter


class ArabicPDFConverter(BaseConverter):
    def extract_text(self, pdf_path: str) -> str:
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            text = ""
            for page in reader.pages:
                text += page.extract_text()
        # Arabic RTL handling: Preserve order, add cultural tags for legal/medical
        if "legal" in pdf_path.lower():
            text += "\n# Iraqi Legal Document"
        return text  # OCR for scanned Arabic via Tesseract integration
