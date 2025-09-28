"""
Iraqi Medical System Agents
===========================

Specialized AI agents for Iraqi healthcare system with Islamic medical ethics integration.
Covers medical consultation, healthcare navigation, and Islamic medical principles.

Features:
- Iraqi healthcare system navigation
- Islamic medical ethics compliance
- Patient consultation with cultural sensitivity
- Medical record management
- Healthcare provider coordination
- Traditional and modern medicine integration
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass
import json
from datetime import datetime


@dataclass
class IraqiMedicalAgent:
    """Base class for Iraqi medical system agents."""

    name: str
    specialization: str
    medical_ethics: str = "Islamic Medical Ethics"
    language_support: List[str] = None
    cultural_sensitivity: bool = True

    def __post_init__(self):
        if self.language_support is None:
            self.language_support = ["Arabic", "Kurdish", "English"]


class IraqiMedicalConsultationAdvisor(IraqiMedicalAgent):
    """
    Iraqi Medical Consultation Advisor

    Expertise Areas:
    - Medical consultation with Islamic ethics
    - Patient care guidance
    - Symptom assessment and triage
    - Treatment recommendations within Islamic framework
    - Medication guidance with Halal considerations
    - Preventive care education
    """

    def __init__(self):
        super().__init__(
            name="Iraqi Medical Consultation Advisor",
            specialization="General Medical Consultation with Islamic Ethics",
        )

        self.islamic_medical_principles = {
            "preservation_of_life": {
                "principle": "Hifz al-Nafs (Preservation of Life)",
                "application": "Life preservation takes precedence over other considerations",
                "quranic_basis": "And whoever saves a life, it is as if he has saved all of mankind (Quran 5:32)",
            },
            "patient_dignity": {
                "principle": "Preservation of Human Dignity",
                "application": "Maintain patient privacy and respect cultural sensitivities",
                "considerations": [
                    "Gender-appropriate care",
                    "Modesty preservation",
                    "Family involvement",
                ],
            },
            "informed_consent": {
                "principle": "Patient Autonomy within Islamic Framework",
                "application": "Obtain informed consent while respecting Islamic decision-making",
                "family_role": "Family consultation in major medical decisions",
            },
            "halal_medications": {
                "principle": "Use of Permissible Medications",
                "application": "Prefer Halal medications and treatments",
                "exceptions": "Life-threatening situations may permit otherwise forbidden substances",
            },
        }

        self.consultation_framework = {
            "initial_assessment": [
                "Greeting with Islamic salutation (if appropriate)",
                "Patient privacy and modesty considerations",
                "Cultural and religious background assessment",
                "Chief complaint and medical history",
            ],
            "examination_guidelines": [
                "Gender-appropriate examination procedures",
                "Modesty preservation during examination",
                "Family member presence if required",
                "Cultural sensitivity in physical examination",
            ],
            "treatment_planning": [
                "Islamic ethics integration in treatment options",
                "Halal medication preferences",
                "Family consultation for major decisions",
                "Prayer and spiritual support consideration",
            ],
        }

        self.common_conditions = {
            "diabetes_management": {
                "prevalence": "High in Iraqi population",
                "islamic_considerations": [
                    "Ramadan fasting modifications",
                    "Halal dietary guidelines",
                ],
                "cultural_factors": [
                    "Traditional diet integration",
                    "Family meal patterns",
                ],
                "treatment_approach": "Holistic approach combining modern medicine with Islamic lifestyle",
            },
            "cardiovascular_disease": {
                "prevalence": "Increasing due to lifestyle changes",
                "islamic_considerations": [
                    "Stress management through prayer",
                    "Halal dietary modifications",
                ],
                "cultural_factors": [
                    "Social support systems",
                    "Traditional remedies integration",
                ],
                "prevention": "Islamic lifestyle principles for heart health",
            },
            "mental_health": {
                "cultural_stigma": "Addressing mental health stigma in Iraqi society",
                "islamic_approach": [
                    "Spiritual counseling integration",
                    "Community support",
                ],
                "treatment_methods": [
                    "Islamic psychology principles",
                    "Cultural therapy approaches",
                ],
                "family_involvement": "Family-centered mental health care",
            },
        }

    def conduct_medical_consultation(
        self, patient_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Conduct medical consultation with Islamic medical ethics."""

        consultation_result = {
            "patient_assessment": self._assess_patient(patient_info),
            "islamic_considerations": self._evaluate_islamic_factors(patient_info),
            "treatment_recommendations": self._generate_treatment_plan(patient_info),
            "cultural_adaptations": self._suggest_cultural_adaptations(patient_info),
            "follow_up_plan": self._create_follow_up_plan(patient_info),
            "family_guidance": self._provide_family_guidance(patient_info),
        }

        return consultation_result

    def _assess_patient(self, patient_info: Dict[str, Any]) -> Dict[str, Any]:
        """Assess patient with cultural and religious considerations."""

        assessment = {
            "chief_complaint": patient_info.get("symptoms", ""),
            "medical_history": patient_info.get("medical_history", {}),
            "cultural_background": patient_info.get("cultural_background", "Iraqi"),
            "religious_observance": patient_info.get("religious_observance", "Muslim"),
            "family_history": patient_info.get("family_history", {}),
            "social_factors": self._assess_social_factors(patient_info),
        }

        return assessment

    def _evaluate_islamic_factors(self, patient_info: Dict[str, Any]) -> Dict[str, Any]:
        """Evaluate Islamic factors affecting medical care."""

        islamic_factors = {
            "prayer_schedule_impact": self._assess_prayer_schedule_impact(patient_info),
            "fasting_considerations": self._assess_fasting_impact(patient_info),
            "halal_medication_needs": self._assess_halal_medication_needs(patient_info),
            "gender_care_preferences": self._assess_gender_care_preferences(
                patient_info
            ),
            "family_decision_making": self._assess_family_involvement_needs(
                patient_info
            ),
        }

        return islamic_factors

    def _generate_treatment_plan(self, patient_info: Dict[str, Any]) -> Dict[str, Any]:
        """Generate treatment plan with Islamic medical ethics integration."""

        treatment_plan = {
            "primary_treatment": self._recommend_primary_treatment(patient_info),
            "halal_medications": self._select_halal_medications(patient_info),
            "lifestyle_modifications": self._suggest_islamic_lifestyle_changes(
                patient_info
            ),
            "spiritual_support": self._recommend_spiritual_support(patient_info),
            "traditional_medicine_integration": self._assess_traditional_medicine_options(
                patient_info
            ),
        }

        return treatment_plan

    def _assess_prayer_schedule_impact(
        self, patient_info: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Assess how medical condition affects prayer schedule."""
        return {
            "prayer_modifications_needed": False,  # Placeholder
            "sitting_prayer_options": True,
            "timing_considerations": "No special considerations needed",
        }

    def _assess_fasting_impact(self, patient_info: Dict[str, Any]) -> Dict[str, Any]:
        """Assess impact of medical condition on Ramadan fasting."""
        return {
            "fasting_permissible": True,  # Placeholder assessment
            "modifications_needed": [],
            "religious_ruling_consultation": "Consult with Islamic scholar if needed",
        }


class IraqiHealthcareNavigator(IraqiMedicalAgent):
    """
    Iraqi Healthcare System Navigator

    Expertise Areas:
    - Healthcare system navigation in Iraq
    - Hospital and clinic directory
    - Insurance and payment systems
    - Appointment scheduling assistance
    - Medical record management
    - Referral coordination
    """

    def __init__(self):
        super().__init__(
            name="Iraqi Healthcare Navigator",
            specialization="Healthcare System Navigation and Coordination",
        )

        self.healthcare_system = {
            "public_hospitals": {
                "baghdad": [
                    {
                        "name": "Baghdad Medical City",
                        "specialties": ["Cardiology", "Oncology", "Neurology"],
                        "location": "Baghdad, Medical City Complex",
                        "contact": "+964-1-XXX-XXXX",
                        "islamic_facilities": True,
                    },
                    {
                        "name": "Al-Yarmouk Teaching Hospital",
                        "specialties": ["Emergency", "Surgery", "Internal Medicine"],
                        "location": "Baghdad, Al-Yarmouk",
                        "contact": "+964-1-XXX-XXXX",
                        "prayer_facilities": True,
                    },
                ],
                "basra": [
                    {
                        "name": "Basra General Hospital",
                        "specialties": ["General Medicine", "Surgery", "Pediatrics"],
                        "location": "Basra City Center",
                        "islamic_facilities": True,
                    }
                ],
                "mosul": [
                    {
                        "name": "Mosul General Hospital",
                        "specialties": ["Trauma", "Surgery", "Emergency Medicine"],
                        "location": "Mosul, Right Side",
                        "reconstruction_status": "Partially operational",
                    }
                ],
            },
            "private_clinics": {
                "categories": [
                    "General Practice",
                    "Specialist Clinics",
                    "Diagnostic Centers",
                ],
                "payment_methods": ["Cash", "Insurance", "Installment Plans"],
                "islamic_compliant_facilities": True,
            },
            "insurance_systems": {
                "public_insurance": {
                    "name": "Iraqi National Health Insurance",
                    "coverage": "Basic medical services",
                    "eligibility": "Iraqi citizens",
                },
                "private_insurance": {
                    "providers": ["Iraqi Insurance Company", "Al-Watani Insurance"],
                    "coverage_options": ["Basic", "Comprehensive", "Family Plans"],
                },
            },
        }

        self.navigation_services = [
            "hospital_finder",
            "appointment_scheduler",
            "insurance_navigator",
            "medical_record_coordinator",
            "referral_facilitator",
            "cultural_liaison",
        ]

    def navigate_healthcare_system(
        self, patient_request: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Navigate Iraqi healthcare system for patient needs."""

        navigation_result = {
            "recommended_facilities": self._find_appropriate_facilities(
                patient_request
            ),
            "appointment_guidance": self._provide_appointment_guidance(patient_request),
            "insurance_information": self._provide_insurance_guidance(patient_request),
            "cultural_considerations": self._address_cultural_needs(patient_request),
            "transportation_assistance": self._suggest_transportation_options(
                patient_request
            ),
            "follow_up_coordination": self._coordinate_follow_up_care(patient_request),
        }

        return navigation_result

    def _find_appropriate_facilities(
        self, patient_request: Dict[str, Any]
    ) -> List[Dict[str, Any]]:
        """Find appropriate healthcare facilities based on patient needs."""

        location = patient_request.get("location", "Baghdad")
        specialty_needed = patient_request.get("specialty", "General")
        islamic_requirements = patient_request.get("islamic_requirements", True)

        # Filter facilities based on requirements
        recommended_facilities = []

        if location.lower() == "baghdad":
            for hospital in self.healthcare_system["public_hospitals"]["baghdad"]:
                if specialty_needed.lower() in [
                    s.lower() for s in hospital["specialties"]
                ]:
                    if not islamic_requirements or hospital.get(
                        "islamic_facilities", False
                    ):
                        recommended_facilities.append(hospital)

        return recommended_facilities

    def _provide_appointment_guidance(
        self, patient_request: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Provide guidance for scheduling appointments."""

        return {
            "booking_methods": ["Phone", "In-person", "Online (limited)"],
            "required_documents": ["National ID", "Medical Records", "Insurance Card"],
            "typical_wait_times": {
                "emergency": "Immediate",
                "urgent": "Same day to 3 days",
                "routine": "1-2 weeks",
                "specialist": "2-4 weeks",
            },
            "cultural_considerations": [
                "Prayer time accommodations available",
                "Gender-specific appointment slots",
                "Family consultation rooms",
            ],
        }

    def _address_cultural_needs(
        self, patient_request: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Address cultural and religious needs in healthcare navigation."""

        return {
            "prayer_facilities": "Most hospitals have designated prayer areas",
            "halal_food": "Halal meals available in major hospitals",
            "gender_specific_care": "Female doctors available for women patients",
            "family_involvement": "Family consultation areas and overnight stays",
            "religious_support": "Hospital chaplains and Islamic counselors available",
            "language_support": "Arabic and Kurdish interpreters available",
        }


class IraqiMedicalCoordinator:
    """Coordinates multiple Iraqi medical agents for comprehensive healthcare."""

    def __init__(self):
        self.agents = {
            "consultation": IraqiMedicalConsultationAdvisor(),
            "navigation": IraqiHealthcareNavigator(),
        }

    def provide_comprehensive_medical_support(
        self, patient_request: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Provide comprehensive medical support using multiple agents."""

        request_type = patient_request.get("type", "general")

        comprehensive_support = {
            "patient_request": patient_request,
            "consultation_analysis": {},
            "navigation_guidance": {},
            "integrated_care_plan": {},
            "cultural_adaptations": {},
        }

        # Medical consultation analysis
        if request_type in ["consultation", "symptoms", "treatment"]:
            comprehensive_support["consultation_analysis"] = self.agents[
                "consultation"
            ].conduct_medical_consultation(patient_request)

        # Healthcare navigation guidance
        if request_type in ["navigation", "appointment", "facility"]:
            comprehensive_support["navigation_guidance"] = self.agents[
                "navigation"
            ].navigate_healthcare_system(patient_request)

        # Generate integrated care plan
        comprehensive_support["integrated_care_plan"] = (
            self._create_integrated_care_plan(comprehensive_support)
        )

        return comprehensive_support

    def _create_integrated_care_plan(
        self, support_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Create integrated care plan from multiple agent inputs."""

        integrated_plan = {
            "immediate_actions": [],
            "short_term_plan": [],
            "long_term_management": [],
            "cultural_accommodations": [],
            "family_involvement": [],
            "spiritual_support": [],
        }

        # Extract recommendations from consultation analysis
        if "consultation_analysis" in support_data:
            consultation = support_data["consultation_analysis"]
            if "treatment_recommendations" in consultation:
                integrated_plan["immediate_actions"].extend(
                    consultation["treatment_recommendations"].get(
                        "primary_treatment", []
                    )
                )

        # Extract guidance from navigation support
        if "navigation_guidance" in support_data:
            navigation = support_data["navigation_guidance"]
            if "recommended_facilities" in navigation:
                integrated_plan["immediate_actions"].append(
                    f"Contact recommended facility: {navigation['recommended_facilities'][0]['name'] if navigation['recommended_facilities'] else 'Local hospital'}"
                )

        return integrated_plan


# Export main classes
__all__ = [
    "IraqiMedicalConsultationAdvisor",
    "IraqiHealthcareNavigator",
    "IraqiMedicalCoordinator",
]
