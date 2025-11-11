"""
Professional Domain Expert Tools

Tool functions for Iraqi professional domain expertise.
"""

from typing import List, Dict, Any, Optional
from apps.api.agents.professional.domain_expert.models import (
    ProfessionalTerminology,
    ProfessionalReference,
)


class DomainExpertTools:
    """Tools for Iraqi professional domain expertise."""

    # Professional domain terminology databases
    LEGAL_TERMINOLOGY = {
        "contract": {
            "arabic": "عقد",
            "definition": "A legally binding agreement between two or more parties",
            "definition_arabic": "اتفاق ملزم قانونيًا بين طرفين أو أكثر",
        },
        "litigation": {
            "arabic": "التقاضي",
            "definition": "The process of taking legal action through courts",
            "definition_arabic": "عملية اتخاذ إجراءات قانونية من خلال المحاكم",
        },
        "plaintiff": {
            "arabic": "المدعي",
            "definition": "The party who initiates a lawsuit",
            "definition_arabic": "الطرف الذي يبدأ دعوى قضائية",
        },
        "defendant": {
            "arabic": "المدعى عليه",
            "definition": "The party against whom a lawsuit is filed",
            "definition_arabic": "الطرف المرفوع ضده الدعوى القضائية",
        },
    }

    MEDICAL_TERMINOLOGY = {
        "diagnosis": {
            "arabic": "التشخيص",
            "definition": "The identification of a disease or condition",
            "definition_arabic": "تحديد المرض أو الحالة الصحية",
        },
        "prescription": {
            "arabic": "الوصفة الطبية",
            "definition": "A written order for medication by a physician",
            "definition_arabic": "أمر مكتوب للدواء من قبل الطبيب",
        },
        "treatment": {
            "arabic": "العلاج",
            "definition": "Medical care given to a patient",
            "definition_arabic": "الرعاية الطبية المقدمة للمريض",
        },
    }

    EDUCATIONAL_TERMINOLOGY = {
        "curriculum": {
            "arabic": "المنهج الدراسي",
            "definition": "The subjects comprising a course of study",
            "definition_arabic": "المواد الدراسية التي تشكل برنامج الدراسة",
        },
        "assessment": {
            "arabic": "التقييم",
            "definition": "The evaluation of student learning",
            "definition_arabic": "تقييم تعلم الطالب",
        },
    }

    ENGINEERING_TERMINOLOGY = {
        "specification": {
            "arabic": "المواصفات",
            "definition": "Detailed technical requirements for a project",
            "definition_arabic": "المتطلبات الفنية التفصيلية للمشروع",
        },
        "blueprint": {
            "arabic": "المخطط",
            "definition": "Technical drawing showing design plans",
            "definition_arabic": "رسم تقني يوضح خطط التصميم",
        },
    }

    @staticmethod
    async def get_domain_terminology(
        domain: str, term: str
    ) -> Optional[ProfessionalTerminology]:
        """
        Get professional terminology for a domain.

        Args:
            domain: Professional domain
            term: English term to look up

        Returns:
            Professional terminology object
        """
        terminology_db = {
            "legal": DomainExpertTools.LEGAL_TERMINOLOGY,
            "medical": DomainExpertTools.MEDICAL_TERMINOLOGY,
            "educational": DomainExpertTools.EDUCATIONAL_TERMINOLOGY,
            "engineering": DomainExpertTools.ENGINEERING_TERMINOLOGY,
        }

        db = terminology_db.get(domain, {})
        term_data = db.get(term.lower())

        if term_data:
            return ProfessionalTerminology(
                term_english=term.title(),
                term_arabic=term_data["arabic"],
                domain=domain,
                definition_english=term_data["definition"],
                definition_arabic=term_data.get("definition_arabic"),
                usage_context=f"Used in Iraqi {domain} professional practice",
                related_terms=[],
            )

        return None

    @staticmethod
    async def get_iraqi_legal_references(
        topic: str,
    ) -> List[ProfessionalReference]:
        """
        Get Iraqi legal references for a topic.

        Args:
            topic: Legal topic

        Returns:
            List of Iraqi legal references
        """
        # TODO: Integrate with Iraqi legal database
        # This is a placeholder with common Iraqi legal references

        references = [
            ProfessionalReference(
                reference_id="Iraqi_Civil_Code",
                reference_type="iraqi_law",
                title="Iraqi Civil Code No. 40 of 1951",
                title_arabic="القانون المدني العراقي رقم 40 لسنة 1951",
                issuing_authority="Iraqi Parliament",
                year=1951,
                summary="The primary source of civil law in Iraq, covering contracts, obligations, and property rights",
            ),
            ProfessionalReference(
                reference_id="Iraqi_Commercial_Code",
                reference_type="iraqi_law",
                title="Iraqi Commercial Code No. 30 of 1984",
                title_arabic="قانون التجارة العراقي رقم 30 لسنة 1984",
                issuing_authority="Iraqi Parliament",
                year=1984,
                summary="Governs commercial transactions, companies, and business operations in Iraq",
            ),
        ]

        return references

    @staticmethod
    async def get_professional_disclaimer(domain: str) -> str:
        """
        Get professional liability disclaimer for domain.

        Args:
            domain: Professional domain

        Returns:
            Disclaimer text
        """
        disclaimers = {
            "legal": """
⚖️ LEGAL DISCLAIMER (إخلاء المسؤولية القانونية):
This information is for educational purposes only and does not constitute legal advice.
Iraqi law is complex and fact-specific. For legal matters, please consult a licensed
Iraqi attorney (محامي مرخص) authorized to practice before Iraqi courts.

هذه المعلومات لأغراض تعليمية فقط ولا تشكل استشارة قانونية. القانون العراقي معقد ويعتمد
على الحقائق المحددة. للمسائل القانونية، يرجى استشارة محامٍ عراقي مرخص مخول بالمثول أمام
المحاكم العراقية.
""",
            "medical": """
🏥 MEDICAL DISCLAIMER (إخلاء المسؤولية الطبية):
This information is for educational purposes only and does not constitute medical advice.
For medical concerns, please consult a licensed Iraqi physician (طبيب مرخص) or visit
an Iraqi healthcare facility.

هذه المعلومات لأغراض تعليمية فقط ولا تشكل استشارة طبية. للمخاوف الطبية، يرجى استشارة
طبيب عراقي مرخص أو زيارة منشأة رعاية صحية عراقية.
""",
            "educational": """
📚 EDUCATIONAL DISCLAIMER:
This information is general in nature. Iraqi educational requirements vary by level
and institution. Please verify with the Iraqi Ministry of Education or relevant
educational authority.

هذه المعلومات ذات طبيعة عامة. تختلف المتطلبات التعليمية العراقية حسب المستوى والمؤسسة.
يرجى التحقق مع وزارة التربية العراقية أو الجهة التعليمية ذات الصلة.
""",
            "engineering": """
🏗️ ENGINEERING DISCLAIMER:
This information is general in nature. Engineering work in Iraq must comply with
Iraqi building codes and standards. Consult a licensed Iraqi engineer (مهندس مرخص)
for professional engineering services.

هذه المعلومات ذات طبيعة عامة. يجب أن تمتثل الأعمال الهندسية في العراق لقوانين ومعايير
البناء العراقية. استشر مهندسًا عراقيًا مرخصًا للخدمات الهندسية المهنية.
""",
        }

        return disclaimers.get(domain, "Professional disclaimer not available.")

    @staticmethod
    async def get_iraqi_professional_context(
        domain: str,
    ) -> List[str]:
        """
        Get Iraqi-specific professional context for domain.

        Args:
            domain: Professional domain

        Returns:
            List of Iraqi context considerations
        """
        contexts = {
            "legal": [
                "Iraqi legal system is based on civil law (Napoleonic code)",
                "Sharia law influences personal status matters (family, inheritance)",
                "Federal courts operate alongside Kurdistan Regional Government courts",
                "Legal proceedings conducted primarily in Arabic",
                "Professional titles: المحامي (attorney), القاضي (judge)",
                "Iraqi Bar Association (نقابة المحامين العراقيين) regulates legal practice",
            ],
            "medical": [
                "Iraqi healthcare system includes public and private sectors",
                "Ministry of Health oversees medical licensing and standards",
                "Medical education primarily at Iraqi universities (Baghdad, Mosul, Basra)",
                "Professional titles: الدكتور (doctor), الطبيب (physician)",
                "Prescription medications regulated by Iraqi Pharmacopoeia",
                "Arabic is primary language for medical records and consultations",
            ],
            "educational": [
                "Ministry of Education sets national curriculum standards",
                "Education structure: Primary (6 years), Intermediate (3 years), Secondary (3 years)",
                "Higher education overseen by Ministry of Higher Education",
                "Academic year typically September to June",
                "Professional titles: الأستاذ (professor), المعلم (teacher)",
                "Bilingual education common in Kurdistan Region",
            ],
            "engineering": [
                "Iraqi Engineers Syndicate (نقابة المهندسين العراقيين) regulates practice",
                "Engineering disciplines: civil, electrical, mechanical, petroleum, software",
                "Professional title: المهندس (engineer)",
                "Projects must comply with Iraqi building codes and standards",
                "Professional licensing required for engineering practice",
                "Arabic technical documentation required for official projects",
            ],
        }

        return contexts.get(domain, [])

    @staticmethod
    async def validate_professional_query(query: str, domain: str) -> Dict[str, Any]:
        """
        Validate if query is appropriate for professional domain.

        Args:
            query: User query
            domain: Professional domain

        Returns:
            Validation result
        """
        # Check if query requires licensed professional
        requires_licensed = False
        keywords = {
            "legal": ["lawsuit", "sue", "contract dispute", "legal action", "court"],
            "medical": [
                "diagnosis",
                "medication",
                "treatment",
                "surgery",
                "medical condition",
            ],
            "educational": ["certification", "accreditation", "degree recognition"],
            "engineering": [
                "building permit",
                "structural design",
                "safety certification",
            ],
        }

        domain_keywords = keywords.get(domain, [])
        query_lower = query.lower()

        for keyword in domain_keywords:
            if keyword in query_lower:
                requires_licensed = True
                break

        return {
            "appropriate": True,  # Basic appropriateness check
            "requires_licensed_professional": requires_licensed,
            "domain_relevant": True,
            "cultural_compliance": True,  # Would check for cultural appropriateness
            "recommendations": [
                f"For detailed {domain} matters, consult a licensed Iraqi professional",
                "Verify information with Iraqi regulatory authorities",
                "Consider cultural and Islamic compliance requirements",
            ],
        }
