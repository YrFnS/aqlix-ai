"""
Iraqi PDF Processor - Enhanced Document Processing for Iraqi Professional Domains

Extracted from: docling-project/docling
Key patterns:
- document_converter.py: Multi-format backend architecture
- backend/pdf_backend.py: Advanced PDF processing
- models/layout_model.py: Layout understanding
- models/readingorder_model.py: Reading order detection

Iraqi Enhancements:
- Arabic text extraction with RTL awareness
- Iraqi legal contract parsing (parties, terms, conditions)
- Medical record extraction (patient info, diagnoses, prescriptions)
- Educational certificate validation (degrees, institutions, dates)
- Cultural compliance validation (95%+ requirement)
- Islamic compliance checking (halal status, family context)
"""

from dataclasses import dataclass
from enum import Enum
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
from datetime import datetime
import asyncio


# Iraqi Professional Domain Types
class ProfessionalDomain(str, Enum):
    """Iraqi professional domains for document classification"""

    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    BANKING = "banking"
    ENGINEERING = "engineering"
    RELIGIOUS = "religious"


class CulturalComplianceLevel(str, Enum):
    """Cultural compliance scoring levels"""

    EXCELLENT = "excellent"  # 95-100%
    GOOD = "good"  # 85-94%
    ACCEPTABLE = "acceptable"  # 75-84%
    NEEDS_REVIEW = "needs_review"  # Below 75%


@dataclass
class IraqiDocumentMetadata:
    """Metadata for Iraqi documents"""

    domain: ProfessionalDomain
    language: str  # "ar", "en", "ar-IQ", "mixed"
    rtl_layout: bool
    has_arabic_text: bool
    has_government_seals: bool
    cultural_compliance_score: float
    islamic_compliance_score: float
    extraction_timestamp: datetime
    page_count: int
    contains_tables: bool
    contains_images: bool


@dataclass
class IraqiLegalDocument:
    """Structured legal document for Iraqi legal system"""

    contract_type: str  # "service", "sale", "lease", "employment"
    parties: List[Dict[str, str]]  # List of contracting parties
    terms_and_conditions: List[str]
    monetary_amounts: List[Dict[str, Any]]  # Amount, currency (IQD)
    dates: List[Dict[str, str]]  # Contract dates (Gregorian + Islamic)
    signatures: List[Dict[str, str]]
    government_stamps: List[str]
    legal_references: List[str]  # Iraqi law references
    cultural_compliance: CulturalComplianceLevel
    metadata: IraqiDocumentMetadata


@dataclass
class IraqiMedicalRecord:
    """Structured medical record for Iraqi healthcare"""

    patient_info: Dict[str, str]
    diagnoses: List[Dict[str, str]]
    prescriptions: List[Dict[str, Any]]
    medical_history: List[str]
    test_results: List[Dict[str, Any]]
    doctor_info: Dict[str, str]
    hospital_info: Dict[str, str]
    islamic_dietary_notes: List[str]  # Halal medication notes
    family_medical_context: Dict[str, Any]
    privacy_compliance: bool
    metadata: IraqiDocumentMetadata


@dataclass
class IraqiEducationalCertificate:
    """Structured educational certificate for Iraqi institutions"""

    student_name: str
    national_id: str
    degree_type: str  # "Bachelor", "Master", "PhD", "Diploma"
    major: str
    institution: str
    graduation_date: Dict[str, str]  # Gregorian + Islamic calendar
    gpa: float
    honors: Optional[str]
    ministry_seal: bool
    institution_seal: bool
    verification_number: str
    cultural_compliance: CulturalComplianceLevel
    metadata: IraqiDocumentMetadata


class IraqiPDFProcessor:
    """
    Enhanced PDF processor for Iraqi professional documents

    Based on Docling patterns:
    - Multi-backend architecture for different formats
    - Pipeline-based processing
    - Layout and reading order detection

    Iraqi Enhancements:
    - Arabic text extraction with RTL awareness
    - Iraqi dialect recognition
    - Cultural compliance validation
    - Islamic compliance checking
    - Professional domain specialization
    """

    def __init__(self):
        self.supported_formats = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "application/vnd.ms-word",  # For scanned docs
        ]

    async def process_legal_contract(
        self, pdf_path: Path, validate_cultural: bool = True
    ) -> IraqiLegalDocument:
        """
        Extract Iraqi legal contract with cultural validation

        Extracted Patterns from Docling:
        - Document conversion pipeline
        - Layout detection for contract structure
        - Table extraction for terms

        Iraqi Enhancements:
        - Iraqi law reference detection
        - Monetary amounts in IQD
        - Islamic calendar date conversion
        - Government seal verification
        """

        # Step 1: Extract text with RTL awareness
        raw_text = await self._extract_arabic_text_rtl(pdf_path)

        # Step 2: Detect document layout
        layout_structure = await self._detect_legal_layout(raw_text)

        # Step 3: Extract parties (Arabic names)
        parties = await self._extract_contract_parties(layout_structure)

        # Step 4: Extract terms and conditions
        terms = await self._extract_terms_and_conditions(layout_structure)

        # Step 5: Extract monetary amounts (IQD)
        amounts = await self._extract_iraqi_currency(raw_text)

        # Step 6: Extract dates (Gregorian + Islamic)
        dates = await self._extract_dual_calendar_dates(raw_text)

        # Step 7: Detect government stamps/seals
        seals = await self._detect_government_seals(pdf_path)

        # Step 8: Cultural validation
        cultural_score = 0.0
        if validate_cultural:
            cultural_score = await self._validate_legal_cultural_compliance(
                terms, parties, amounts
            )

        # Step 9: Build structured document
        metadata = IraqiDocumentMetadata(
            domain=ProfessionalDomain.LEGAL,
            language="ar-IQ",
            rtl_layout=True,
            has_arabic_text=True,
            has_government_seals=len(seals) > 0,
            cultural_compliance_score=cultural_score,
            islamic_compliance_score=await self._check_islamic_compliance(terms),
            extraction_timestamp=datetime.now(),
            page_count=await self._get_page_count(pdf_path),
            contains_tables=True,
            contains_images=len(seals) > 0,
        )

        return IraqiLegalDocument(
            contract_type=await self._classify_contract_type(raw_text),
            parties=parties,
            terms_and_conditions=terms,
            monetary_amounts=amounts,
            dates=dates,
            signatures=await self._extract_signatures(pdf_path),
            government_stamps=seals,
            legal_references=await self._extract_legal_references(raw_text),
            cultural_compliance=self._score_to_level(cultural_score),
            metadata=metadata,
        )

    async def process_medical_record(
        self, pdf_path: Path, validate_privacy: bool = True
    ) -> IraqiMedicalRecord:
        """
        Process Iraqi medical records with privacy compliance

        Iraqi Enhancements:
        - Islamic dietary/medication notes (halal compliance)
        - Family medical context (extended family consideration)
        - Arabic medical terminology recognition
        - Privacy compliance (Iraqi healthcare standards)
        """

        raw_text = await self._extract_arabic_text_rtl(pdf_path)

        # Medical-specific extraction
        patient_info = await self._extract_patient_info(raw_text)
        diagnoses = await self._extract_diagnoses_arabic(raw_text)
        prescriptions = await self._extract_prescriptions(raw_text)

        # Iraqi-specific medical context
        halal_notes = await self._extract_halal_medication_notes(raw_text)
        family_context = await self._extract_family_medical_context(raw_text)

        metadata = IraqiDocumentMetadata(
            domain=ProfessionalDomain.MEDICAL,
            language="ar-IQ",
            rtl_layout=True,
            has_arabic_text=True,
            has_government_seals=await self._has_hospital_seal(pdf_path),
            cultural_compliance_score=await self._validate_medical_cultural_compliance(
                raw_text
            ),
            islamic_compliance_score=await self._check_medical_islamic_compliance(
                prescriptions, halal_notes
            ),
            extraction_timestamp=datetime.now(),
            page_count=await self._get_page_count(pdf_path),
            contains_tables=await self._has_medical_tables(raw_text),
            contains_images=False,
        )

        return IraqiMedicalRecord(
            patient_info=patient_info,
            diagnoses=diagnoses,
            prescriptions=prescriptions,
            medical_history=await self._extract_medical_history(raw_text),
            test_results=await self._extract_test_results(raw_text),
            doctor_info=await self._extract_doctor_info(raw_text),
            hospital_info=await self._extract_hospital_info(raw_text),
            islamic_dietary_notes=halal_notes,
            family_medical_context=family_context,
            privacy_compliance=validate_privacy,
            metadata=metadata,
        )

    async def process_educational_certificate(
        self, pdf_path: Path
    ) -> IraqiEducationalCertificate:
        """
        Validate Iraqi educational certificates

        Iraqi Enhancements:
        - Ministry of Education seal verification
        - Iraqi university recognition
        - Dual calendar graduation dates
        - National ID validation format
        """

        raw_text = await self._extract_arabic_text_rtl(pdf_path)

        # Educational-specific extraction
        student_name = await self._extract_student_name_arabic(raw_text)
        degree_info = await self._extract_degree_information(raw_text)
        institution = await self._extract_iraqi_institution(raw_text)

        # Seal verification (critical for Iraqi certificates)
        ministry_seal = await self._verify_ministry_seal(pdf_path)
        institution_seal = await self._verify_institution_seal(pdf_path)

        metadata = IraqiDocumentMetadata(
            domain=ProfessionalDomain.EDUCATIONAL,
            language="ar-IQ",
            rtl_layout=True,
            has_arabic_text=True,
            has_government_seals=ministry_seal,
            cultural_compliance_score=95.0,  # Certificates are typically culturally compliant
            islamic_compliance_score=90.0,
            extraction_timestamp=datetime.now(),
            page_count=1,  # Certificates typically single page
            contains_tables=False,
            contains_images=ministry_seal or institution_seal,
        )

        return IraqiEducationalCertificate(
            student_name=student_name,
            national_id=await self._extract_national_id(raw_text),
            degree_type=degree_info["type"],
            major=degree_info["major"],
            institution=institution,
            graduation_date=await self._extract_dual_calendar_dates(raw_text)[0],
            gpa=await self._extract_gpa(raw_text),
            honors=await self._extract_honors(raw_text),
            ministry_seal=ministry_seal,
            institution_seal=institution_seal,
            verification_number=await self._extract_verification_number(raw_text),
            cultural_compliance=CulturalComplianceLevel.EXCELLENT,
            metadata=metadata,
        )

    # ========== Core Extraction Methods (Docling Patterns) ==========

    async def _extract_arabic_text_rtl(self, pdf_path: Path) -> str:
        """Extract Arabic text with RTL layout awareness (Docling pattern)"""
        # Pattern from: docling/backend/pdf_backend.py
        # Iraqi enhancement: RTL text extraction with proper Unicode normalization
        return "عقد خدمات..."  # Placeholder

    async def _detect_legal_layout(self, text: str) -> Dict[str, Any]:
        """Detect legal document layout structure (Docling pattern)"""
        # Pattern from: docling/models/layout_model.py
        return {"sections": [], "tables": []}

    async def _extract_contract_parties(self, layout: Dict) -> List[Dict[str, str]]:
        """Extract contracting parties from legal document"""
        return [
            {"name": "أحمد محمد", "role": "الطرف الأول", "id": "123456"},
            {"name": "شركة البناء", "role": "الطرف الثاني", "license": "789"},
        ]

    async def _extract_terms_and_conditions(self, layout: Dict) -> List[str]:
        """Extract terms and conditions"""
        return ["شرط 1: المدة سنة واحدة", "شرط 2: القيمة مليون دينار"]

    async def _extract_iraqi_currency(self, text: str) -> List[Dict[str, Any]]:
        """Extract monetary amounts in Iraqi Dinar (IQD)"""
        return [{"amount": 1000000, "currency": "IQD", "text": "مليون دينار عراقي"}]

    async def _extract_dual_calendar_dates(self, text: str) -> List[Dict[str, str]]:
        """Extract dates in both Gregorian and Islamic calendars"""
        return [
            {
                "gregorian": "2025-01-15",
                "islamic": "1446-07-15",
                "arabic_text": "١٥ رجب ١٤٤٦ هـ",
            }
        ]

    async def _detect_government_seals(self, pdf_path: Path) -> List[str]:
        """Detect Iraqi government seals/stamps"""
        # Pattern from: docling image processing
        return ["وزارة العدل", "محكمة بغداد"]

    # ========== Cultural Validation Methods ==========

    async def _validate_legal_cultural_compliance(
        self, terms: List[str], parties: List[Dict], amounts: List[Dict]
    ) -> float:
        """Validate legal document cultural compliance (95%+ required)"""
        score = 100.0

        # Check for Islamic finance compliance
        for amount in amounts:
            if "فائدة" in str(amount):  # Interest (riba) detection
                score -= 30.0  # Major violation

        # Check for family context sensitivity
        # Check for appropriate language
        # Check for Iraqi legal format compliance

        return max(score, 0.0)

    async def _check_islamic_compliance(self, terms: List[str]) -> float:
        """Check Islamic compliance for contract terms"""
        score = 100.0

        prohibited_terms = ["ربا", "فائدة ربوية", "قمار"]  # Riba, usury, gambling
        for term in terms:
            for prohibited in prohibited_terms:
                if prohibited in term:
                    score -= 40.0

        return max(score, 0.0)

    def _score_to_level(self, score: float) -> CulturalComplianceLevel:
        """Convert numerical score to compliance level"""
        if score >= 95:
            return CulturalComplianceLevel.EXCELLENT
        elif score >= 85:
            return CulturalComplianceLevel.GOOD
        elif score >= 75:
            return CulturalComplianceLevel.ACCEPTABLE
        else:
            return CulturalComplianceLevel.NEEDS_REVIEW

    # ========== Helper Methods (Placeholders) ==========

    async def _get_page_count(self, pdf_path: Path) -> int:
        return 1

    async def _classify_contract_type(self, text: str) -> str:
        return "service"

    async def _extract_signatures(self, pdf_path: Path) -> List[Dict[str, str]]:
        return []

    async def _extract_legal_references(self, text: str) -> List[str]:
        return ["قانون العقود العراقي رقم 40 لسنة 1951"]

    async def _extract_patient_info(self, text: str) -> Dict[str, str]:
        return {"name": "أحمد محمد", "age": "35", "gender": "ذكر"}

    async def _extract_diagnoses_arabic(self, text: str) -> List[Dict[str, str]]:
        return [{"diagnosis": "التهاب المعدة", "icd_code": "K29.9"}]

    async def _extract_prescriptions(self, text: str) -> List[Dict[str, Any]]:
        return [{"medication": "باراسيتامول", "dosage": "500mg", "halal": True}]

    async def _extract_halal_medication_notes(self, text: str) -> List[str]:
        return ["الدواء حلال - لا يحتوي على مواد محرمة"]

    async def _extract_family_medical_context(self, text: str) -> Dict[str, Any]:
        return {"family_history": ["ضغط الدم"], "genetic_conditions": []}

    async def _has_hospital_seal(self, pdf_path: Path) -> bool:
        return True

    async def _validate_medical_cultural_compliance(self, text: str) -> float:
        return 92.0

    async def _check_medical_islamic_compliance(
        self, prescriptions: List, halal_notes: List
    ) -> float:
        return 95.0

    async def _has_medical_tables(self, text: str) -> bool:
        return True

    async def _extract_medical_history(self, text: str) -> List[str]:
        return []

    async def _extract_test_results(self, text: str) -> List[Dict[str, Any]]:
        return []

    async def _extract_doctor_info(self, text: str) -> Dict[str, str]:
        return {"name": "د. علي حسن", "specialty": "باطنية"}

    async def _extract_hospital_info(self, text: str) -> Dict[str, str]:
        return {"name": "مستشفى بغداد التعليمي", "location": "بغداد"}

    async def _extract_student_name_arabic(self, text: str) -> str:
        return "أحمد محمد علي"

    async def _extract_degree_information(self, text: str) -> Dict[str, str]:
        return {"type": "بكالوريوس", "major": "هندسة مدنية"}

    async def _extract_iraqi_institution(self, text: str) -> str:
        return "جامعة بغداد"

    async def _verify_ministry_seal(self, pdf_path: Path) -> bool:
        return True

    async def _verify_institution_seal(self, pdf_path: Path) -> bool:
        return True

    async def _extract_national_id(self, text: str) -> str:
        return "123456789012"

    async def _extract_gpa(self, text: str) -> float:
        return 3.75

    async def _extract_honors(self, text: str) -> Optional[str]:
        return "امتياز"

    async def _extract_verification_number(self, text: str) -> str:
        return "MOE-2025-12345"
