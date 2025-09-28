"""
Iraqi Legal System Agents
=========================

Specialized AI agents for Iraqi legal system with Islamic jurisprudence integration.
Covers Iraqi Civil Code, Commercial Law, Sharia compliance, and legal procedures.

Features:
- Iraqi Civil Code expertise
- Islamic jurisprudence (Fiqh) integration
- Sharia compliance validation
- Contract law with Islamic principles
- Court procedure guidance
- Legal document generation
"""

from typing import Dict, Any, List, Optional
from dataclasses import dataclass
import json


@dataclass
class IraqiLegalAgent:
    """Base class for Iraqi legal system agents."""

    name: str
    specialization: str
    jurisdiction: str = "Iraq"
    islamic_compliance: bool = True
    arabic_support: bool = True


class IraqiCivilLawSpecialist(IraqiLegalAgent):
    """
    Iraqi Civil Code Specialist Agent

    Expertise Areas:
    - Iraqi Civil Code (Law No. 40 of 1951)
    - Personal Status Law
    - Property Rights under Islamic Law
    - Obligations and Contracts
    - Tort Law with Islamic principles
    """

    def __init__(self):
        super().__init__(
            name="Iraqi Civil Law Specialist",
            specialization="Civil Law and Personal Status",
        )

        self.knowledge_base = {
            "civil_code_sections": {
                "personal_rights": {
                    "articles": "1-87",
                    "topics": [
                        "Legal capacity",
                        "Domicile",
                        "Missing persons",
                        "Legal personality",
                    ],
                    "islamic_basis": "Sharia principles on legal capacity (Ahliyya)",
                },
                "property_rights": {
                    "articles": "1048-1318",
                    "topics": [
                        "Ownership",
                        "Possession",
                        "Real rights",
                        "Islamic endowments (Waqf)",
                    ],
                    "islamic_basis": "Islamic property law and Waqf regulations",
                },
                "obligations": {
                    "articles": "146-655",
                    "topics": [
                        "Contracts",
                        "Delicts",
                        "Unjust enrichment",
                        "Islamic commercial principles",
                    ],
                    "islamic_basis": "Islamic contract law (Aqd) and commercial transactions",
                },
            },
            "personal_status_law": {
                "marriage_law": {
                    "basis": "Islamic marriage (Nikah) principles",
                    "requirements": [
                        "Legal capacity",
                        "Consent",
                        "Mahr (dower)",
                        "Witnesses",
                    ],
                    "procedures": "Iraqi Personal Status Law No. 188 of 1959",
                },
                "inheritance_law": {
                    "basis": "Islamic inheritance law (Mirath)",
                    "shares": "Quranic inheritance shares and Asbaba",
                    "procedures": "Succession court procedures in Iraq",
                },
                "family_disputes": {
                    "basis": "Islamic family law principles",
                    "mediation": "Family reconciliation procedures",
                    "court_procedures": "Iraqi family court system",
                },
            },
        }

        self.legal_tools = [
            "iraqi_civil_code_search",
            "sharia_compliance_checker",
            "legal_precedent_finder",
            "document_template_generator",
        ]

    def analyze_civil_case(self, case_details: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze a civil law case under Iraqi law with Islamic principles."""

        case_type = case_details.get("type", "")
        facts = case_details.get("facts", "")

        analysis = {
            "applicable_law": self._determine_applicable_law(case_type),
            "islamic_considerations": self._assess_islamic_compliance(case_details),
            "legal_precedents": self._find_relevant_precedents(case_type),
            "procedural_requirements": self._get_court_procedures(case_type),
            "recommendation": self._generate_legal_recommendation(case_details),
        }

        return analysis

    def _determine_applicable_law(self, case_type: str) -> List[str]:
        """Determine applicable Iraqi laws and Islamic principles."""

        law_mapping = {
            "property_dispute": [
                "Iraqi Civil Code Articles 1048-1318",
                "Islamic property law principles",
                "Law of Registration of Real Estate No. 43 of 1971",
            ],
            "contract_dispute": [
                "Iraqi Civil Code Articles 146-246",
                "Islamic contract law (Aqd)",
                "Commercial Code provisions",
            ],
            "family_matter": [
                "Personal Status Law No. 188 of 1959",
                "Islamic family law (Ahwal Shakhsiyya)",
                "Court procedures for family disputes",
            ],
        }

        return law_mapping.get(case_type, ["Iraqi Civil Code (General Provisions)"])

    def _assess_islamic_compliance(
        self, case_details: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Assess Islamic law compliance for the case."""

        return {
            "sharia_compatible": True,  # Placeholder assessment
            "islamic_principles": ["Justice (Adl)", "Public interest (Maslaha)"],
            "potential_conflicts": [],
            "recommendations": ["Ensure compliance with Islamic commercial principles"],
        }


class ShariaComplianceAdvisor(IraqiLegalAgent):
    """
    Islamic Legal Compliance Advisor

    Expertise Areas:
    - Sharia law principles and application
    - Islamic jurisprudence (Fiqh) schools
    - Religious legal opinions (Fatwa)
    - Compliance validation for contracts and transactions
    - Integration with Iraqi secular law
    """

    def __init__(self):
        super().__init__(
            name="Sharia Compliance Advisor",
            specialization="Islamic Jurisprudence and Compliance",
        )

        self.fiqh_schools = {
            "hanafi": {
                "prevalence": "Majority in Iraq",
                "characteristics": "Emphasis on reason (Ra'y) and analogy (Qiyas)",
                "application": "Personal status and commercial law",
            },
            "jafari": {
                "prevalence": "Shia majority areas",
                "characteristics": "Emphasis on Imams' teachings",
                "application": "Personal status for Shia Muslims",
            },
        }

        self.compliance_framework = {
            "contracts": {
                "prohibited_elements": [
                    "Riba (interest)",
                    "Gharar (excessive uncertainty)",
                    "Haram activities",
                ],
                "required_elements": [
                    "Mutual consent",
                    "Valid consideration",
                    "Lawful purpose",
                ],
                "validation_criteria": [
                    "Sharia board approval",
                    "Islamic finance principles",
                ],
            },
            "business_transactions": {
                "halal_activities": [
                    "Trade",
                    "Manufacturing",
                    "Services",
                    "Islamic banking",
                ],
                "haram_activities": [
                    "Alcohol",
                    "Gambling",
                    "Pork products",
                    "Interest-based lending",
                ],
                "compliance_requirements": [
                    "Halal certification",
                    "Sharia audit",
                    "Religious oversight",
                ],
            },
        }

    def validate_sharia_compliance(self, document: Dict[str, Any]) -> Dict[str, Any]:
        """Validate document or transaction for Sharia compliance."""

        compliance_result = {
            "overall_status": "compliant",  # compliant, non_compliant, requires_review
            "detailed_analysis": {},
            "issues": [],
            "recommendations": [],
            "approval_requirements": [],
        }

        # Check for prohibited elements
        if self._contains_riba(document):
            compliance_result["issues"].append("Contains interest (Riba) elements")
            compliance_result["overall_status"] = "non_compliant"

        if self._contains_gharar(document):
            compliance_result["issues"].append(
                "Excessive uncertainty (Gharar) detected"
            )
            compliance_result["recommendations"].append("Clarify ambiguous terms")

        # Check for required Islamic elements
        if not self._has_mutual_consent(document):
            compliance_result["issues"].append("Mutual consent not clearly established")

        return compliance_result

    def _contains_riba(self, document: Dict[str, Any]) -> bool:
        """Check if document contains interest (Riba) elements."""
        content = str(document).lower()
        riba_indicators = ["interest", "usury", "فائدة", "ربا"]
        return any(indicator in content for indicator in riba_indicators)

    def _contains_gharar(self, document: Dict[str, Any]) -> bool:
        """Check for excessive uncertainty (Gharar)."""
        # Placeholder implementation
        return False

    def _has_mutual_consent(self, document: Dict[str, Any]) -> bool:
        """Check if mutual consent is established."""
        # Placeholder implementation
        return True


class IraqiContractSpecialist(IraqiLegalAgent):
    """
    Iraqi Contract Law Specialist

    Expertise Areas:
    - Contract formation under Iraqi law
    - Islamic commercial principles
    - International contract law
    - Dispute resolution mechanisms
    - Contract templates and drafting
    """

    def __init__(self):
        super().__init__(
            name="Iraqi Contract Specialist",
            specialization="Contract Law and Islamic Commercial Principles",
        )

        self.contract_types = {
            "sale_contracts": {
                "islamic_basis": "Bay' (Islamic sale contract)",
                "requirements": [
                    "Offer (Ijab)",
                    "Acceptance (Qabul)",
                    "Consideration (Thaman)",
                    "Delivery (Taslim)",
                ],
                "prohibited": ["Sale of non-existent goods", "Excessive uncertainty"],
            },
            "service_contracts": {
                "islamic_basis": "Ijara (Islamic lease/service contract)",
                "requirements": [
                    "Clear service definition",
                    "Fair compensation",
                    "Specified duration",
                ],
                "considerations": [
                    "Service provider qualifications",
                    "Quality standards",
                ],
            },
            "partnership_contracts": {
                "islamic_basis": "Musharaka (Islamic partnership)",
                "types": [
                    "Diminishing Musharaka",
                    "Permanent Musharaka",
                    "Project-based",
                ],
                "profit_sharing": "Based on Islamic partnership principles",
            },
        }

    def draft_islamic_compliant_contract(
        self, contract_type: str, parties: Dict, terms: Dict
    ) -> Dict[str, Any]:
        """Draft an Islamic-compliant contract under Iraqi law."""

        contract_template = {
            "header": self._generate_contract_header(contract_type, parties),
            "islamic_preamble": self._generate_islamic_preamble(),
            "definitions": self._generate_definitions(contract_type),
            "main_terms": self._generate_main_terms(contract_type, terms),
            "islamic_clauses": self._generate_islamic_clauses(contract_type),
            "governing_law": "Republic of Iraq laws and Islamic Sharia principles",
            "dispute_resolution": self._generate_dispute_resolution_clause(),
            "signatures": self._generate_signature_block(parties),
        }

        return contract_template

    def _generate_islamic_preamble(self) -> str:
        """Generate Islamic preamble for contracts."""
        return """
        بسم الله الرحمن الرحيم
        In the Name of Allah, the Most Gracious, the Most Merciful
        
        This contract is entered into in accordance with Islamic principles and Iraqi law,
        seeking Allah's blessings and adhering to justice and fairness in all dealings.
        """

    def _generate_islamic_clauses(self, contract_type: str) -> List[str]:
        """Generate Islamic compliance clauses."""

        standard_clauses = [
            "This contract shall be interpreted and performed in accordance with Islamic Sharia principles",
            "Any provision found to be contrary to Islamic law shall be void and replaced with Sharia-compliant alternatives",
            "Disputes shall be resolved through Islamic arbitration methods before resorting to civil courts",
        ]

        if contract_type == "financial":
            standard_clauses.extend(
                [
                    "No interest (Riba) shall be charged or received under this contract",
                    "All transactions shall be asset-backed and comply with Islamic finance principles",
                ]
            )

        return standard_clauses


# Agent coordination and integration
class IraqiLegalAgentCoordinator:
    """Coordinates multiple Iraqi legal agents for complex cases."""

    def __init__(self):
        self.agents = {
            "civil_law": IraqiCivilLawSpecialist(),
            "sharia_compliance": ShariaComplianceAdvisor(),
            "contracts": IraqiContractSpecialist(),
        }

    def analyze_complex_legal_matter(
        self, case_details: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Coordinate multiple agents for complex legal analysis."""

        case_type = case_details.get("type", "")

        # Determine which agents are needed
        required_agents = self._determine_required_agents(case_type)

        # Coordinate analysis from multiple agents
        coordinated_analysis = {
            "case_summary": case_details,
            "agent_analyses": {},
            "integrated_recommendation": {},
            "next_steps": [],
        }

        for agent_type in required_agents:
            if agent_type in self.agents:
                agent = self.agents[agent_type]
                if hasattr(agent, "analyze_civil_case"):
                    coordinated_analysis["agent_analyses"][agent_type] = (
                        agent.analyze_civil_case(case_details)
                    )

        # Generate integrated recommendation
        coordinated_analysis["integrated_recommendation"] = (
            self._integrate_recommendations(coordinated_analysis["agent_analyses"])
        )

        return coordinated_analysis

    def _determine_required_agents(self, case_type: str) -> List[str]:
        """Determine which agents are needed for the case type."""

        agent_mapping = {
            "commercial_dispute": ["civil_law", "contracts", "sharia_compliance"],
            "family_matter": ["civil_law", "sharia_compliance"],
            "property_dispute": ["civil_law", "sharia_compliance"],
            "contract_review": ["contracts", "sharia_compliance"],
        }

        return agent_mapping.get(case_type, ["civil_law", "sharia_compliance"])

    def _integrate_recommendations(self, analyses: Dict[str, Any]) -> Dict[str, Any]:
        """Integrate recommendations from multiple agents."""

        integrated = {
            "primary_recommendation": "Coordinate legal strategy across Islamic and civil law principles",
            "legal_basis": [],
            "procedural_steps": [],
            "compliance_requirements": [],
            "risk_assessment": "Medium - requires careful integration of Islamic and civil law",
        }

        # Aggregate recommendations from all agents
        for agent_type, analysis in analyses.items():
            if "recommendation" in analysis:
                integrated["legal_basis"].append(
                    f"{agent_type}: {analysis['recommendation']}"
                )

        return integrated


# Export main classes
__all__ = [
    "IraqiCivilLawSpecialist",
    "ShariaComplianceAdvisor",
    "IraqiContractSpecialist",
    "IraqiLegalAgentCoordinator",
]
