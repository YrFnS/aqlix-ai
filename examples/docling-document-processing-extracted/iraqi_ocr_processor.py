"""
Iraqi OCR (Optical Character Recognition) Processor
Extracted from: docling-project/docling (models/tesseract_ocr_model.py, utils/ocr_utils.py)

Enhanced with Iraqi-specific features:
- Arabic OCR with Iraqi dialect support
- Handwritten Arabic recognition (common in Iraqi government documents)
- Mixed Arabic-English document processing
- Iraqi government seal detection and verification
- Signature region identification
- Cultural compliance validation for scanned documents
- Document authenticity verification

Usage:
    from examples.docling_document_processing_extracted.iraqi_ocr_processor import IraqiOCRProcessor

    processor = IraqiOCRProcessor()
    contract = await processor.ocr_scanned_contract("scanned_contract.jpg")
    prescription = await processor.ocr_medical_prescription("prescription.jpg")
"""

from typing import List, Dict, Optional, Tuple
from pathlib import Path
from enum import Enum
from pydantic import BaseModel, Field
from datetime import datetime


class DocumentType(str, Enum):
    """Iraqi document types for OCR"""

    LEGAL_CONTRACT = "legal_contract"
    MEDICAL_PRESCRIPTION = "medical_prescription"
    GOVERNMENT_CERTIFICATE = "government_certificate"
    EDUCATIONAL_DIPLOMA = "educational_diploma"
    IDENTITY_DOCUMENT = "identity_document"


class OCRConfidenceLevel(str, Enum):
    """OCR confidence levels"""

    HIGH = "high"  # >90%
    MEDIUM = "medium"  # 70-90%
    LOW = "low"  # <70%


class GovernmentSeal(BaseModel):
    """Iraqi government seal detection result"""

    seal_type: str  # "وزارة", "ديوان", "مديرية"
    organization: str  # Organization name in Arabic
    location: Tuple[int, int, int, int]  # Bounding box (x, y, width, height)
    confidence: float
    is_authentic: bool = False
    verification_notes: Optional[str] = None


class SignatureRegion(BaseModel):
    """Signature detection result"""

    location: Tuple[int, int, int, int]
    signature_type: str  # "handwritten", "stamp", "digital"
    party: Optional[str] = None  # "الطرف الأول", "الطرف الثاني"
    confidence: float


class OCRTextBlock(BaseModel):
    """OCR text block with metadata"""

    text: str
    language: str  # "ar", "en"
    location: Tuple[int, int, int, int]
    confidence: float
    is_handwritten: bool = False
    text_type: str = "paragraph"  # "heading", "paragraph", "signature", "stamp"


class OCRResult(BaseModel):
    """Complete OCR result"""

    document_type: DocumentType
    text_blocks: List[OCRTextBlock] = Field(default_factory=list)
    seals: List[GovernmentSeal] = Field(default_factory=list)
    signatures: List[SignatureRegion] = Field(default_factory=list)
    overall_confidence: float
    is_culturally_compliant: bool = True
    is_authentic: bool = True
    metadata: Dict = Field(default_factory=dict)


class IraqiPrescription(BaseModel):
    """Iraqi medical prescription OCR result"""

    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    date: Optional[str] = None
    medications: List[Dict] = Field(default_factory=list)
    diagnosis: Optional[str] = None
    is_handwritten: bool = False
    is_halal_compliant: bool = True
    clinic_seal: Optional[GovernmentSeal] = None


class IraqiOCRProcessor:
    """
    Enhanced OCR processor for scanned Iraqi documents

    Based on Docling's Tesseract OCR Model with Iraqi enhancements:
    - Arabic OCR with Iraqi dialect recognition
    - Handwritten Arabic text extraction (common in Iraq)
    - Mixed Arabic-English processing
    - Government seal detection (وزارة، ديوان، مديرية)
    - Signature verification regions
    - Document authenticity validation
    - Cultural compliance checking

    Supports:
    - Legal contracts (printed + handwritten)
    - Medical prescriptions (doctor handwriting)
    - Government certificates
    - Educational diplomas
    - Identity documents
    """

    def __init__(self, tesseract_lang: str = "ara+eng"):
        """
        Initialize Iraqi OCR processor

        Args:
            tesseract_lang: Tesseract language (default: Arabic + English)
        """
        self.tesseract_lang = tesseract_lang
        self.seal_patterns = self._load_seal_patterns()
        self.signature_patterns = self._load_signature_patterns()

    def _load_seal_patterns(self) -> Dict[str, List[str]]:
        """Load Iraqi government seal patterns"""
        return {
            "ministry": ["وزارة", "الوزارة", "Ministry"],
            "directorate": ["مديرية", "المديرية", "Directorate"],
            "office": ["ديوان", "الديوان", "Office"],
            "republic": ["جمهورية العراق", "Republic of Iraq"],
        }

    def _load_signature_patterns(self) -> List[str]:
        """Load signature detection patterns"""
        return [
            "توقيع",
            "الإمضاء",
            "Signature",
            "الطرف الأول",
            "الطرف الثاني",
            "الموقع أدناه",
        ]

    async def ocr_scanned_contract(
        self, image_path: Path, validate_authenticity: bool = True
    ) -> OCRResult:
        """
        OCR Iraqi legal contract with seal detection

        Features:
        - Full contract text extraction (Arabic + English)
        - Government seal detection and verification
        - Signature region identification
        - Party identification (الطرف الأول، الطرف الثاني)
        - Authenticity validation
        - Cultural compliance checking

        Args:
            image_path: Path to scanned contract image
            validate_authenticity: Check document authenticity

        Returns:
            OCR result with detected text, seals, and signatures
        """
        # TODO: Integrate actual Tesseract OCR
        # Placeholder implementation

        # Extract text blocks
        text_blocks = await self._extract_text_blocks(
            image_path, DocumentType.LEGAL_CONTRACT
        )

        # Detect government seals
        seals = await self._detect_government_seals(image_path)

        # Detect signatures
        signatures = await self._detect_signatures(image_path)

        # Validate authenticity
        is_authentic = True
        if validate_authenticity:
            is_authentic = await self._validate_document_authenticity(
                text_blocks, seals, signatures
            )

        # Calculate overall confidence
        overall_confidence = (
            sum(block.confidence for block in text_blocks) / len(text_blocks)
            if text_blocks
            else 0.0
        )

        # Cultural compliance
        is_culturally_compliant = await self._validate_ocr_cultural_compliance(
            text_blocks
        )

        return OCRResult(
            document_type=DocumentType.LEGAL_CONTRACT,
            text_blocks=text_blocks,
            seals=seals,
            signatures=signatures,
            overall_confidence=overall_confidence,
            is_culturally_compliant=is_culturally_compliant,
            is_authentic=is_authentic,
            metadata={
                "source": str(image_path),
                "timestamp": datetime.now().isoformat(),
            },
        )

    async def ocr_medical_prescription(self, image_path: Path) -> IraqiPrescription:
        """
        OCR Iraqi medical prescription (handwritten + printed)

        Features:
        - Handwritten doctor text recognition
        - Medication extraction with dosage
        - Patient information extraction
        - Diagnosis identification
        - Halal medication validation
        - Clinic seal detection

        Args:
            image_path: Path to prescription image

        Returns:
            Iraqi prescription data
        """
        # Extract text blocks (focus on handwritten recognition)
        text_blocks = await self._extract_text_blocks(
            image_path, DocumentType.MEDICAL_PRESCRIPTION, detect_handwriting=True
        )

        # Extract structured data
        patient_name = await self._extract_patient_name(text_blocks)
        doctor_name = await self._extract_doctor_name(text_blocks)
        date = await self._extract_prescription_date(text_blocks)
        medications = await self._extract_medications(text_blocks)
        diagnosis = await self._extract_diagnosis(text_blocks)

        # Detect clinic seal
        seals = await self._detect_government_seals(image_path)
        clinic_seal = seals[0] if seals else None

        # Check if prescription is handwritten
        handwritten_ratio = (
            sum(1 for block in text_blocks if block.is_handwritten) / len(text_blocks)
            if text_blocks
            else 0
        )
        is_handwritten = handwritten_ratio > 0.5

        # Validate halal compliance
        is_halal = await self._check_prescription_halal(medications)

        return IraqiPrescription(
            patient_name=patient_name,
            doctor_name=doctor_name,
            date=date,
            medications=medications,
            diagnosis=diagnosis,
            is_handwritten=is_handwritten,
            is_halal_compliant=is_halal,
            clinic_seal=clinic_seal,
        )

    async def detect_government_seals(self, image_path: Path) -> List[GovernmentSeal]:
        """
        Detect and verify Iraqi government seals

        Features:
        - Circular seal detection
        - Organization text extraction (وزارة، ديوان، مديرية)
        - Authenticity verification
        - Seal type classification

        Args:
            image_path: Path to document image

        Returns:
            List of detected government seals
        """
        # TODO: Integrate computer vision for seal detection
        # Placeholder implementation

        seals = []

        # Simulate seal detection
        # In production, use OpenCV/PIL for circular pattern detection
        seal_regions = await self._find_circular_patterns(image_path)

        for region in seal_regions:
            # Extract text from seal region
            seal_text = await self._extract_text_from_region(image_path, region)

            # Classify seal type
            seal_type = self._classify_seal_type(seal_text)

            # Extract organization name
            organization = self._extract_organization_name(seal_text)

            # Verify authenticity (pattern matching + known seals database)
            is_authentic = await self._verify_seal_authenticity(
                seal_type, organization, seal_text
            )

            seals.append(
                GovernmentSeal(
                    seal_type=seal_type,
                    organization=organization,
                    location=region,
                    confidence=0.85,
                    is_authentic=is_authentic,
                )
            )

        return seals

    async def _extract_text_blocks(
        self, image_path: Path, doc_type: DocumentType, detect_handwriting: bool = False
    ) -> List[OCRTextBlock]:
        """Extract text blocks with OCR"""
        # TODO: Integrate Tesseract/EasyOCR
        # Placeholder: simulate text extraction
        return [
            OCRTextBlock(
                text="نص عربي من المستند",
                language="ar",
                location=(100, 100, 500, 50),
                confidence=0.92,
                is_handwritten=False,
            )
        ]

    async def _detect_government_seals(self, image_path: Path) -> List[GovernmentSeal]:
        """Detect government seals in document"""
        # TODO: Integrate seal detection
        return []

    async def _detect_signatures(self, image_path: Path) -> List[SignatureRegion]:
        """Detect signature regions"""
        # TODO: Integrate signature detection
        return []

    async def _validate_document_authenticity(
        self,
        text_blocks: List[OCRTextBlock],
        seals: List[GovernmentSeal],
        signatures: List[SignatureRegion],
    ) -> bool:
        """Validate document authenticity"""
        # Check for required seals
        has_valid_seal = any(seal.is_authentic for seal in seals)

        # Check for signatures
        has_signatures = len(signatures) > 0

        # Check text quality
        avg_confidence = (
            sum(block.confidence for block in text_blocks) / len(text_blocks)
            if text_blocks
            else 0
        )

        return has_valid_seal and has_signatures and avg_confidence > 0.7

    async def _validate_ocr_cultural_compliance(
        self, text_blocks: List[OCRTextBlock]
    ) -> bool:
        """Validate OCR content for cultural compliance"""
        # TODO: Integrate iraqi-cultural-validator agent
        return True

    async def _extract_patient_name(
        self, text_blocks: List[OCRTextBlock]
    ) -> Optional[str]:
        """Extract patient name from prescription"""
        for block in text_blocks:
            if "اسم المريض" in block.text or "Patient Name" in block.text:
                # Extract name after label
                parts = block.text.split(":")
                if len(parts) > 1:
                    return parts[1].strip()
        return None

    async def _extract_doctor_name(
        self, text_blocks: List[OCRTextBlock]
    ) -> Optional[str]:
        """Extract doctor name from prescription"""
        for block in text_blocks:
            if (
                "اسم الطبيب" in block.text
                or "Doctor Name" in block.text
                or "د." in block.text
            ):
                parts = block.text.split(":")
                if len(parts) > 1:
                    return parts[1].strip()
        return None

    async def _extract_prescription_date(
        self, text_blocks: List[OCRTextBlock]
    ) -> Optional[str]:
        """Extract prescription date"""
        import re

        date_patterns = [r"\d{1,2}/\d{1,2}/\d{4}", r"\d{4}-\d{1,2}-\d{1,2}"]

        for block in text_blocks:
            for pattern in date_patterns:
                match = re.search(pattern, block.text)
                if match:
                    return match.group(0)
        return None

    async def _extract_medications(self, text_blocks: List[OCRTextBlock]) -> List[Dict]:
        """Extract medications with dosage"""
        medications = []

        # Look for medication indicators
        for block in text_blocks:
            if any(
                keyword in block.text
                for keyword in ["دواء", "علاج", "Rx", "Medication"]
            ):
                medications.append(
                    {
                        "name": block.text,
                        "dosage": "unknown",
                        "is_handwritten": block.is_handwritten,
                    }
                )

        return medications

    async def _extract_diagnosis(
        self, text_blocks: List[OCRTextBlock]
    ) -> Optional[str]:
        """Extract diagnosis from prescription"""
        for block in text_blocks:
            if "تشخيص" in block.text or "Diagnosis" in block.text:
                return block.text
        return None

    async def _check_prescription_halal(self, medications: List[Dict]) -> bool:
        """Check if all medications are halal"""
        # TODO: Integrate halal medication database
        haram_indicators = ["alcohol", "gelatin", "pork"]

        for med in medications:
            med_name = med.get("name", "").lower()
            if any(indicator in med_name for indicator in haram_indicators):
                return False
        return True

    async def _find_circular_patterns(
        self, image_path: Path
    ) -> List[Tuple[int, int, int, int]]:
        """Find circular patterns (potential seals)"""
        # TODO: Use OpenCV Hough Circle Transform
        return []

    async def _extract_text_from_region(
        self, image_path: Path, region: Tuple[int, int, int, int]
    ) -> str:
        """Extract text from specific image region"""
        # TODO: Crop region and OCR
        return "نص من المنطقة"

    def _classify_seal_type(self, text: str) -> str:
        """Classify seal type from text"""
        if "وزارة" in text:
            return "وزارة"
        elif "ديوان" in text:
            return "ديوان"
        elif "مديرية" in text:
            return "مديرية"
        return "unknown"

    def _extract_organization_name(self, text: str) -> str:
        """Extract organization name from seal text"""
        # Remove common words and extract main organization
        text = text.replace("جمهورية العراق", "").strip()
        return text

    async def _verify_seal_authenticity(
        self, seal_type: str, organization: str, seal_text: str
    ) -> bool:
        """Verify seal authenticity against database"""
        # TODO: Check against known Iraqi government seals database
        return True
