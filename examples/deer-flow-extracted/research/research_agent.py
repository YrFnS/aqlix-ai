"""
Iraqi Research Agent - Advanced research automation for Iraqi academic institutions

Conducts comprehensive research with Arabic language support, Islamic compliance,
and Iraqi academic standards integration.
"""

from typing import Dict, List, Optional, Any, Union, Tuple
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum
import json
import asyncio
from pathlib import Path
import hashlib

from pydantic import BaseModel, Field
from langchain.agents import AgentExecutor
from langchain.tools import Tool
from langchain.schema import Document


class ResearchType(Enum):
    """Types of research for Iraqi academic context"""

    LITERATURE_REVIEW = "literature_review"
    SYSTEMATIC_REVIEW = "systematic_review"
    META_ANALYSIS = "meta_analysis"
    CASE_STUDY = "case_study"
    EXPERIMENTAL = "experimental"
    SURVEY = "survey"
    THEORETICAL = "theoretical"
    APPLIED = "applied"
    COMPARATIVE = "comparative"
    HISTORICAL = "historical"


class AcademicDomain(Enum):
    """Academic domains in Iraqi universities"""

    ISLAMIC_STUDIES = "islamic_studies"
    ARABIC_LITERATURE = "arabic_literature"
    LAW = "law"
    MEDICINE = "medicine"
    ENGINEERING = "engineering"
    EDUCATION = "education"
    ECONOMICS = "economics"
    POLITICAL_SCIENCE = "political_science"
    HISTORY = "history"
    GEOGRAPHY = "geography"
    PSYCHOLOGY = "psychology"
    SOCIOLOGY = "sociology"
    COMPUTER_SCIENCE = "computer_science"
    AGRICULTURE = "agriculture"
    PHARMACY = "pharmacy"


class ResearchPhase(Enum):
    """Research phases in Iraqi academic workflow"""

    PLANNING = "planning"
    LITERATURE_SEARCH = "literature_search"
    DATA_COLLECTION = "data_collection"
    ANALYSIS = "analysis"
    WRITING = "writing"
    REVIEW = "review"
    SUBMISSION = "submission"
    REVISION = "revision"
    PUBLICATION = "publication"


@dataclass
class ResearchProject:
    """Represents a research project in Iraqi academic context"""

    # Project identification
    project_id: str
    title: str
    description: str
    research_type: ResearchType
    academic_domain: AcademicDomain

    # Iraqi academic context
    institution: str
    department: str
    supervisor: Optional[str] = None
    language: str = "arabic"
    degree_level: str = "masters"  # bachelors, masters, phd

    # Research parameters
    research_questions: List[str] = field(default_factory=list)
    keywords: List[str] = field(default_factory=list)
    methodology: Optional[str] = None
    timeline: Optional[Dict[str, datetime]] = None

    # Cultural and compliance
    islamic_compliance_required: bool = True
    cultural_sensitivity: bool = True
    arabic_sources_required: bool = True

    # Status and progress
    current_phase: ResearchPhase = ResearchPhase.PLANNING
    progress_percentage: float = 0.0
    completed_tasks: List[str] = field(default_factory=list)

    # Results and outputs
    sources_found: List[Dict] = field(default_factory=list)
    literature_review: Optional[str] = None
    findings: Optional[str] = None
    conclusions: Optional[str] = None

    # Metadata
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    # Validation
    validated: bool = False
    validation_errors: List[str] = field(default_factory=list)


@dataclass
class ResearchSource:
    """Represents a research source with Iraqi academic standards"""

    source_id: str
    title: str
    authors: List[str]
    publication_type: str  # journal, book, conference, thesis, report

    # Publication details
    journal_name: Optional[str] = None
    publisher: Optional[str] = None
    publication_date: Optional[datetime] = None
    volume: Optional[str] = None
    issue: Optional[str] = None
    pages: Optional[str] = None

    # Identifiers
    doi: Optional[str] = None
    isbn: Optional[str] = None
    url: Optional[str] = None

    # Content
    abstract: Optional[str] = None
    keywords: List[str] = field(default_factory=list)
    language: str = "arabic"

    # Iraqi academic context
    iraqi_author: bool = False
    iraqi_institution: bool = False
    regional_relevance: str = "high"  # high, medium, low

    # Quality metrics
    citation_count: int = 0
    quality_score: float = 0.0
    relevance_score: float = 0.0

    # Islamic compliance
    islamic_perspective: bool = False
    culturally_appropriate: bool = True

    # Access and availability
    open_access: bool = False
    library_available: bool = False
    pdf_path: Optional[str] = None


class IraqiResearchAgent:
    """
    Advanced research automation agent for Iraqi academic institutions

    Conducts comprehensive research with Arabic language support,
    Islamic compliance, and Iraqi academic standards integration.
    """

    def __init__(
        self,
        institution: str = "Iraqi University",
        default_language: str = "arabic",
        academic_standards: str = "iraqi_ministry_higher_education",
    ):
        self.institution = institution
        self.default_language = default_language
        self.academic_standards = academic_standards

        # Storage
        self.projects: Dict[str, ResearchProject] = {}
        self.sources_database: Dict[str, ResearchSource] = {}
        self.search_history: List[Dict] = []

        # Research tools
        self.search_engines = {
            "google_scholar": None,
            "pubmed": None,
            "jstor": None,
            "arabic_databases": None,
            "iraqi_academic_db": None,
        }

        # Cultural validators
        self.islamic_compliance_checker = None
        self.cultural_validator = None

        # Academic standards
        self.citation_standards = {
            "apa": "APA Style",
            "mla": "MLA Style",
            "chicago": "Chicago Style",
            "arabic_academic": "Arabic Academic Style",
        }

    async def create_research_project(
        self,
        title: str,
        description: str,
        research_type: ResearchType,
        academic_domain: AcademicDomain,
        institution: str,
        department: str,
        research_questions: List[str] = None,
        supervisor: str = None,
        degree_level: str = "masters",
    ) -> str:
        """Create new research project"""

        project_id = f"research_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        project = ResearchProject(
            project_id=project_id,
            title=title,
            description=description,
            research_type=research_type,
            academic_domain=academic_domain,
            institution=institution,
            department=department,
            supervisor=supervisor,
            degree_level=degree_level,
            research_questions=research_questions or [],
            language=self.default_language,
        )

        # Validate project
        validation_result = await self._validate_research_project(project)
        if validation_result["valid"]:
            project.validated = True
        else:
            project.validation_errors = validation_result["errors"]

        # Store project
        self.projects[project_id] = project

        return project_id

    async def conduct_literature_search(
        self,
        project_id: str,
        search_terms: List[str] = None,
        date_range: Tuple[datetime, datetime] = None,
        languages: List[str] = ["arabic", "english"],
        max_sources: int = 100,
    ) -> Dict[str, Any]:
        """Conduct comprehensive literature search"""

        if project_id not in self.projects:
            return {"success": False, "error": "Project not found"}

        project = self.projects[project_id]
        project.current_phase = ResearchPhase.LITERATURE_SEARCH

        # Prepare search terms
        if not search_terms:
            search_terms = project.keywords + project.research_questions

        # Enhanced search terms for Iraqi context
        enhanced_terms = await self._enhance_search_terms(
            search_terms, project.academic_domain, languages
        )

        found_sources = []

        try:
            # Search multiple databases
            for database, config in self.search_engines.items():
                if config:  # If database is configured
                    db_results = await self._search_database(
                        database,
                        enhanced_terms,
                        date_range,
                        languages,
                        max_sources // len(self.search_engines),
                    )
                    found_sources.extend(db_results)

            # Deduplicate sources
            unique_sources = await self._deduplicate_sources(found_sources)

            # Score and rank sources
            ranked_sources = await self._rank_sources(unique_sources, project)

            # Store sources
            for source in ranked_sources:
                self.sources_database[source.source_id] = source
                project.sources_found.append(
                    {
                        "source_id": source.source_id,
                        "title": source.title,
                        "relevance_score": source.relevance_score,
                        "quality_score": source.quality_score,
                    }
                )

            # Update project progress
            project.progress_percentage = 25.0  # Literature search complete
            project.completed_tasks.append("literature_search")
            project.updated_at = datetime.now(timezone.utc)

            return {
                "success": True,
                "project_id": project_id,
                "sources_found": len(ranked_sources),
                "top_sources": ranked_sources[:10],
                "search_terms_used": enhanced_terms,
                "databases_searched": list(self.search_engines.keys()),
            }

        except Exception as e:
            return {"success": False, "error": f"Literature search failed: {str(e)}"}

    async def generate_literature_review(
        self,
        project_id: str,
        review_structure: str = "thematic",
        include_arabic_sources: bool = True,
        islamic_perspective: bool = True,
        max_length: int = 5000,
    ) -> Dict[str, Any]:
        """Generate comprehensive literature review"""

        if project_id not in self.projects:
            return {"success": False, "error": "Project not found"}

        project = self.projects[project_id]

        if not project.sources_found:
            return {
                "success": False,
                "error": "No sources found. Conduct literature search first.",
            }

        try:
            # Get sources for review
            review_sources = []
            for source_ref in project.sources_found:
                source_id = source_ref["source_id"]
                if source_id in self.sources_database:
                    source = self.sources_database[source_id]

                    # Filter based on preferences
                    if include_arabic_sources or source.language != "arabic":
                        if not islamic_perspective or source.culturally_appropriate:
                            review_sources.append(source)

            # Structure literature review
            if review_structure == "thematic":
                review_content = await self._generate_thematic_review(
                    review_sources, project, max_length
                )
            elif review_structure == "chronological":
                review_content = await self._generate_chronological_review(
                    review_sources, project, max_length
                )
            else:  # methodological
                review_content = await self._generate_methodological_review(
                    review_sources, project, max_length
                )

            # Validate for Islamic compliance if required
            if project.islamic_compliance_required:
                compliance_result = await self._validate_islamic_compliance(
                    review_content
                )
                if not compliance_result["compliant"]:
                    return {
                        "success": False,
                        "error": "Literature review fails Islamic compliance check",
                        "violations": compliance_result["violations"],
                    }

            # Store literature review
            project.literature_review = review_content
            project.progress_percentage = 50.0
            project.completed_tasks.append("literature_review")
            project.current_phase = ResearchPhase.ANALYSIS
            project.updated_at = datetime.now(timezone.utc)

            return {
                "success": True,
                "project_id": project_id,
                "literature_review": review_content,
                "sources_included": len(review_sources),
                "word_count": len(review_content.split()),
                "structure": review_structure,
            }

        except Exception as e:
            return {
                "success": False,
                "error": f"Literature review generation failed: {str(e)}",
            }

    async def analyze_research_gaps(
        self, project_id: str, analysis_depth: str = "comprehensive"
    ) -> Dict[str, Any]:
        """Analyze research gaps in the literature"""

        if project_id not in self.projects:
            return {"success": False, "error": "Project not found"}

        project = self.projects[project_id]

        if not project.literature_review:
            return {"success": False, "error": "Literature review not available"}

        try:
            # Analyze existing research
            coverage_analysis = await self._analyze_topic_coverage(project)
            methodology_gaps = await self._identify_methodology_gaps(project)
            regional_gaps = await self._identify_regional_gaps(project)
            temporal_gaps = await self._identify_temporal_gaps(project)

            # Iraqi-specific gap analysis
            arabic_research_gaps = await self._analyze_arabic_research_gaps(project)
            islamic_perspective_gaps = await self._analyze_islamic_perspective_gaps(
                project
            )

            gaps_analysis = {
                "topic_coverage_gaps": coverage_analysis,
                "methodology_gaps": methodology_gaps,
                "regional_gaps": regional_gaps,
                "temporal_gaps": temporal_gaps,
                "arabic_research_gaps": arabic_research_gaps,
                "islamic_perspective_gaps": islamic_perspective_gaps,
                "recommended_research_directions": [],
            }

            # Generate research recommendations
            recommendations = await self._generate_research_recommendations(
                gaps_analysis, project
            )
            gaps_analysis["recommended_research_directions"] = recommendations

            return {
                "success": True,
                "project_id": project_id,
                "gaps_analysis": gaps_analysis,
                "priority_gaps": recommendations[:5],
                "analysis_depth": analysis_depth,
            }

        except Exception as e:
            return {"success": False, "error": f"Gap analysis failed: {str(e)}"}

    async def generate_research_proposal(
        self,
        project_id: str,
        proposal_type: str = "thesis",
        include_budget: bool = False,
        target_audience: str = "academic_committee",
    ) -> Dict[str, Any]:
        """Generate research proposal document"""

        if project_id not in self.projects:
            return {"success": False, "error": "Project not found"}

        project = self.projects[project_id]

        try:
            # Generate proposal sections
            proposal_sections = {
                "title": await self._generate_proposal_title(project),
                "abstract": await self._generate_proposal_abstract(project),
                "introduction": await self._generate_proposal_introduction(project),
                "literature_review": project.literature_review
                or await self._generate_brief_literature_review(project),
                "methodology": await self._generate_methodology_section(project),
                "timeline": await self._generate_research_timeline(project),
                "expected_outcomes": await self._generate_expected_outcomes(project),
                "references": await self._generate_references_section(project),
            }

            # Add budget if requested
            if include_budget:
                proposal_sections["budget"] = await self._generate_budget_section(
                    project
                )

            # Add Iraqi-specific sections
            if project.islamic_compliance_required:
                proposal_sections[
                    "islamic_considerations"
                ] = await self._generate_islamic_considerations(project)

            if project.arabic_sources_required:
                proposal_sections[
                    "arabic_sources_justification"
                ] = await self._generate_arabic_sources_justification(project)

            # Combine sections into full proposal
            full_proposal = await self._combine_proposal_sections(
                proposal_sections, proposal_type
            )

            # Validate proposal
            validation_result = await self._validate_research_proposal(
                full_proposal, project
            )

            return {
                "success": True,
                "project_id": project_id,
                "proposal": full_proposal,
                "sections": list(proposal_sections.keys()),
                "word_count": len(full_proposal.split()),
                "validation": validation_result,
                "proposal_type": proposal_type,
            }

        except Exception as e:
            return {"success": False, "error": f"Proposal generation failed: {str(e)}"}

    async def _validate_research_project(
        self, project: ResearchProject
    ) -> Dict[str, Any]:
        """Validate research project for Iraqi academic standards"""

        errors = []

        # Basic validation
        if not project.title.strip():
            errors.append("عنوان البحث مطلوب")

        if not project.description.strip():
            errors.append("وصف البحث مطلوب")

        if not project.research_questions:
            errors.append("أسئلة البحث مطلوبة")

        # Iraqi academic validation
        if not project.institution:
            errors.append("اسم المؤسسة الأكاديمية مطلوب")

        if not project.department:
            errors.append("اسم القسم مطلوب")

        # Islamic compliance validation
        if project.islamic_compliance_required:
            islamic_validation = await self._check_islamic_compliance_project(project)
            if not islamic_validation:
                errors.append("المشروع لا يتوافق مع التعاليم الإسلامية")

        return {"valid": len(errors) == 0, "errors": errors}

    async def _enhance_search_terms(
        self, base_terms: List[str], domain: AcademicDomain, languages: List[str]
    ) -> List[str]:
        """Enhance search terms for Iraqi academic context"""

        enhanced = base_terms.copy()

        # Add domain-specific terms
        domain_terms = {
            AcademicDomain.ISLAMIC_STUDIES: ["الدراسات الإسلامية", "الشريعة", "الفقه"],
            AcademicDomain.ARABIC_LITERATURE: [
                "الأدب العربي",
                "الشعر العربي",
                "النثر العربي",
            ],
            AcademicDomain.LAW: ["القانون العراقي", "التشريع", "القضاء"],
            AcademicDomain.MEDICINE: ["الطب", "الصحة", "العلاج"],
            AcademicDomain.ENGINEERING: ["الهندسة", "التقنية", "التكنولوجيا"],
        }

        if domain in domain_terms:
            enhanced.extend(domain_terms[domain])

        # Add Iraqi context terms
        enhanced.extend(["العراق", "بغداد", "الجامعات العراقية"])

        return enhanced

    async def _search_database(
        self,
        database: str,
        terms: List[str],
        date_range: Tuple[datetime, datetime],
        languages: List[str],
        max_results: int,
    ) -> List[ResearchSource]:
        """Search specific database for sources"""

        # Placeholder implementation
        # In real implementation, would connect to actual databases
        sources = []

        for i in range(min(max_results, 10)):  # Demo: return up to 10 sources
            source = ResearchSource(
                source_id=f"{database}_{hashlib.md5(f'{terms[0]}_{i}'.encode()).hexdigest()[:8]}",
                title=f"دراسة في {terms[0]} - المصدر {i + 1}",
                authors=[f"د. محمد أحمد {i + 1}", "د. فاطمة علي"],
                publication_type="journal",
                journal_name="مجلة الجامعة العراقية",
                publication_date=datetime.now(timezone.utc),
                language="arabic" if "arabic" in languages else "english",
                iraqi_author=True,
                iraqi_institution=True,
                regional_relevance="high",
                quality_score=0.7 + (i * 0.03),
                relevance_score=0.8 + (i * 0.02),
                islamic_perspective=True,
                culturally_appropriate=True,
            )
            sources.append(source)

        return sources

    async def _deduplicate_sources(
        self, sources: List[ResearchSource]
    ) -> List[ResearchSource]:
        """Remove duplicate sources"""

        seen_titles = set()
        unique_sources = []

        for source in sources:
            title_key = source.title.lower().strip()
            if title_key not in seen_titles:
                seen_titles.add(title_key)
                unique_sources.append(source)

        return unique_sources

    async def _rank_sources(
        self, sources: List[ResearchSource], project: ResearchProject
    ) -> List[ResearchSource]:
        """Rank sources by relevance and quality"""

        # Calculate composite scores
        for source in sources:
            # Base score from quality and relevance
            base_score = (source.quality_score * 0.4) + (source.relevance_score * 0.6)

            # Bonus for Iraqi context
            if source.iraqi_author:
                base_score += 0.1
            if source.iraqi_institution:
                base_score += 0.1

            # Bonus for Islamic perspective if required
            if project.islamic_compliance_required and source.islamic_perspective:
                base_score += 0.1

            # Bonus for Arabic language if preferred
            if project.arabic_sources_required and source.language == "arabic":
                base_score += 0.15

            # Update relevance score
            source.relevance_score = min(base_score, 1.0)

        # Sort by relevance score
        return sorted(sources, key=lambda s: s.relevance_score, reverse=True)

    async def _generate_thematic_review(
        self, sources: List[ResearchSource], project: ResearchProject, max_length: int
    ) -> str:
        """Generate thematic literature review"""

        # Group sources by themes
        themes = await self._identify_research_themes(sources, project)

        review_sections = []

        # Introduction
        intro = f"""
        مراجعة الأدبيات حول {project.title}
        
        تهدف هذه المراجعة إلى استعراض الأدبيات المتاحة حول موضوع {project.title}.
        تم تحليل {len(sources)} مصدر أكاديمي من مختلف قواعد البيانات العلمية.
        """
        review_sections.append(intro)

        # Thematic sections
        for theme, theme_sources in themes.items():
            section = f"""
            {theme}
            
            تناولت {len(theme_sources)} دراسة موضوع {theme}.
            """

            for source in theme_sources[:5]:  # Limit to top 5 per theme
                section += f"- {source.title} ({', '.join(source.authors)})\n"

            review_sections.append(section)

        # Conclusion
        conclusion = f"""
        الخلاصة
        
        من خلال مراجعة الأدبيات، يتضح أن هناك {len(themes)} محاور رئيسية في البحث حول {project.title}.
        هناك حاجة لمزيد من البحث في هذا المجال، خاصة من المنظور العراقي والإسلامي.
        """
        review_sections.append(conclusion)

        full_review = "\n\n".join(review_sections)

        # Truncate if too long
        if len(full_review.split()) > max_length:
            words = full_review.split()[:max_length]
            full_review = " ".join(words) + "..."

        return full_review

    async def _generate_chronological_review(
        self, sources: List[ResearchSource], project: ResearchProject, max_length: int
    ) -> str:
        """Generate chronological literature review"""

        # Sort sources by publication date
        dated_sources = [s for s in sources if s.publication_date]
        dated_sources.sort(key=lambda s: s.publication_date)

        review = f"""
        مراجعة زمنية للأدبيات حول {project.title}
        
        يستعرض هذا القسم تطور البحث في موضوع {project.title} عبر الزمن.
        """

        # Group by time periods
        current_year = datetime.now().year
        periods = {
            f"{current_year - 10}-{current_year - 5}": [],
            f"{current_year - 5}-{current_year}": [],
        }

        for source in dated_sources:
            year = source.publication_date.year
            if year >= current_year - 5:
                periods[f"{current_year - 5}-{current_year}"].append(source)
            elif year >= current_year - 10:
                periods[f"{current_year - 10}-{current_year - 5}"].append(source)

        for period, period_sources in periods.items():
            if period_sources:
                review += f"\n\nالفترة {period}:\n"
                for source in period_sources[:10]:
                    review += f"- {source.title} ({source.publication_date.year})\n"

        return review

    async def _generate_methodological_review(
        self, sources: List[ResearchSource], project: ResearchProject, max_length: int
    ) -> str:
        """Generate methodological literature review"""

        review = f"""
        مراجعة منهجية للأدبيات حول {project.title}
        
        تركز هذه المراجعة على المناهج البحثية المستخدمة في دراسة {project.title}.
        """

        # Group by methodology (simplified)
        methodologies = {"كمي": [], "نوعي": [], "مختلط": []}

        # Simplified classification
        for source in sources:
            if (
                "survey" in source.title.lower()
                or "questionnaire" in source.title.lower()
            ):
                methodologies["كمي"].append(source)
            elif (
                "interview" in source.title.lower()
                or "case study" in source.title.lower()
            ):
                methodologies["نوعي"].append(source)
            else:
                methodologies["مختلط"].append(source)

        for method, method_sources in methodologies.items():
            if method_sources:
                review += f"\n\nالمنهج {method}:\n"
                review += f"استخدم {len(method_sources)} دراسة المنهج {method}.\n"

        return review

    async def _identify_research_themes(
        self, sources: List[ResearchSource], project: ResearchProject
    ) -> Dict[str, List[ResearchSource]]:
        """Identify research themes from sources"""

        # Simplified theme identification based on keywords
        themes = {
            "الجوانب النظرية": [],
            "الدراسات التطبيقية": [],
            "المنظور الإسلامي": [],
            "السياق العراقي": [],
        }

        for source in sources:
            # Classify based on keywords and content
            if source.islamic_perspective:
                themes["المنظور الإسلامي"].append(source)
            if source.iraqi_author or source.iraqi_institution:
                themes["السياق العراقي"].append(source)
            if "theory" in source.title.lower() or "نظري" in source.title:
                themes["الجوانب النظرية"].append(source)
            else:
                themes["الدراسات التطبيقية"].append(source)

        return themes

    async def _analyze_topic_coverage(self, project: ResearchProject) -> Dict[str, Any]:
        """Analyze topic coverage in literature"""

        return {
            "well_covered_areas": ["الجوانب النظرية", "المنهجية"],
            "under_researched_areas": ["التطبيق العملي", "السياق العراقي"],
            "coverage_percentage": 65.0,
        }

    async def _identify_methodology_gaps(self, project: ResearchProject) -> List[str]:
        """Identify methodology gaps"""

        return [
            "قلة الدراسات الكمية الطولية",
            "نقص في الدراسات المقارنة",
            "حاجة لدراسات حالة أكثر تفصيلاً",
        ]

    async def _identify_regional_gaps(self, project: ResearchProject) -> List[str]:
        """Identify regional research gaps"""

        return [
            "قلة البحوث في السياق العراقي",
            "نقص الدراسات المقارنة مع البلدان العربية",
            "حاجة لبحوث محلية أكثر",
        ]

    async def _identify_temporal_gaps(self, project: ResearchProject) -> List[str]:
        """Identify temporal gaps in research"""

        return [
            "نقص البحوث الحديثة (آخر 5 سنوات)",
            "قلة الدراسات الطولية",
            "حاجة لبيانات أكثر حداثة",
        ]

    async def _analyze_arabic_research_gaps(
        self, project: ResearchProject
    ) -> List[str]:
        """Analyze gaps in Arabic research"""

        return [
            "قلة المصادر باللغة العربية",
            "نقص البحوث من منظور عربي إسلامي",
            "حاجة لترجمة البحوث الغربية",
        ]

    async def _analyze_islamic_perspective_gaps(
        self, project: ResearchProject
    ) -> List[str]:
        """Analyze gaps in Islamic perspective research"""

        return [
            "قلة البحوث من المنظور الإسلامي",
            "نقص في تطبيق المبادئ الإسلامية",
            "حاجة لمزيد من الفقه التطبيقي",
        ]

    async def _generate_research_recommendations(
        self, gaps_analysis: Dict[str, Any], project: ResearchProject
    ) -> List[str]:
        """Generate research recommendations based on gaps"""

        return [
            f"إجراء دراسة تطبيقية حول {project.title} في السياق العراقي",
            "تطوير أدوات قياس مناسبة للبيئة العربية",
            "إجراء دراسة مقارنة مع البلدان العربية المجاورة",
            "تطبيق المنهج المختلط (كمي ونوعي)",
            "دراسة الموضوع من المنظور الإسلامي",
        ]

    async def _check_islamic_compliance_project(self, project: ResearchProject) -> bool:
        """Check Islamic compliance of research project"""
        # Implementation would check Islamic guidelines
        return True  # Placeholder

    async def _validate_islamic_compliance(self, content: str) -> Dict[str, Any]:
        """Validate Islamic compliance of content"""
        # Implementation would check Islamic compliance
        return {"compliant": True, "violations": []}  # Placeholder

    async def _generate_proposal_title(self, project: ResearchProject) -> str:
        """Generate research proposal title"""
        return project.title

    async def _generate_proposal_abstract(self, project: ResearchProject) -> str:
        """Generate research proposal abstract"""
        return (
            f"ملخص البحث حول {project.title}. يهدف هذا البحث إلى {project.description}."
        )

    async def _generate_proposal_introduction(self, project: ResearchProject) -> str:
        """Generate research proposal introduction"""
        return f"مقدمة البحث: يتناول هذا البحث موضوع {project.title} في السياق العراقي."

    async def _generate_brief_literature_review(self, project: ResearchProject) -> str:
        """Generate brief literature review for proposal"""
        return "مراجعة مختصرة للأدبيات ذات الصلة بموضوع البحث."

    async def _generate_methodology_section(self, project: ResearchProject) -> str:
        """Generate methodology section"""
        return f"سيتم استخدام المنهج {project.research_type.value} في هذا البحث."

    async def _generate_research_timeline(self, project: ResearchProject) -> str:
        """Generate research timeline"""
        return "الجدول الزمني للبحث: 6-12 شهر حسب نوع البحث ومستوى الدراسة."

    async def _generate_expected_outcomes(self, project: ResearchProject) -> str:
        """Generate expected outcomes section"""
        return "النتائج المتوقعة من البحث ومساهمته في المعرفة العلمية."

    async def _generate_references_section(self, project: ResearchProject) -> str:
        """Generate references section"""
        return "قائمة المراجع والمصادر المستخدمة في البحث."

    async def _generate_budget_section(self, project: ResearchProject) -> str:
        """Generate budget section"""
        return "الميزانية المطلوبة لتنفيذ البحث."

    async def _generate_islamic_considerations(self, project: ResearchProject) -> str:
        """Generate Islamic considerations section"""
        return "الاعتبارات الإسلامية في البحث والالتزام بالأخلاقيات الإسلامية."

    async def _generate_arabic_sources_justification(
        self, project: ResearchProject
    ) -> str:
        """Generate justification for Arabic sources"""
        return "مبررات استخدام المصادر العربية وأهميتها في البحث."

    async def _combine_proposal_sections(
        self, sections: Dict[str, str], proposal_type: str
    ) -> str:
        """Combine proposal sections into full document"""

        proposal_parts = []

        # Standard structure
        section_order = [
            "title",
            "abstract",
            "introduction",
            "literature_review",
            "methodology",
            "timeline",
            "expected_outcomes",
            "budget",
            "islamic_considerations",
            "arabic_sources_justification",
            "references",
        ]

        for section_name in section_order:
            if section_name in sections and sections[section_name]:
                if section_name == "title":
                    proposal_parts.append(f"# {sections[section_name]}\n")
                else:
                    proposal_parts.append(
                        f"## {section_name.replace('_', ' ').title()}\n\n{sections[section_name]}\n"
                    )

        return "\n".join(proposal_parts)

    async def _validate_research_proposal(
        self, proposal: str, project: ResearchProject
    ) -> Dict[str, Any]:
        """Validate research proposal"""

        validation_results = {
            "structure_complete": len(proposal.split("##")) >= 6,
            "word_count_adequate": len(proposal.split()) >= 1000,
            "islamic_compliant": project.islamic_compliance_required,
            "culturally_appropriate": True,
        }

        return {"valid": all(validation_results.values()), "checks": validation_results}

    async def get_project_status(self, project_id: str) -> Dict[str, Any]:
        """Get comprehensive project status"""

        if project_id not in self.projects:
            return {"error": "Project not found"}

        project = self.projects[project_id]

        return {
            "project_id": project_id,
            "title": project.title,
            "research_type": project.research_type.value,
            "academic_domain": project.academic_domain.value,
            "current_phase": project.current_phase.value,
            "progress_percentage": project.progress_percentage,
            "completed_tasks": project.completed_tasks,
            "sources_found": len(project.sources_found),
            "has_literature_review": bool(project.literature_review),
            "validated": project.validated,
            "validation_errors": project.validation_errors,
            "created_at": project.created_at.isoformat(),
            "updated_at": project.updated_at.isoformat(),
        }
