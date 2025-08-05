"""
Iraqi Academic Templates - Cultural adaptations and domain-specific templates

Provides pre-configured templates for Iraqi academic institutions, professional
domains, and government organizations with Islamic compliance and Arabic RTL support.
"""

from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum

from ..graph.workflow_engine import IraqiProcessType, IraqiWorkflowNode
from ..content.podcast_generator import PodcastType, VoiceStyle
from ..research.research_agent import ResearchType, AcademicDomain


class TemplateCategory(Enum):
    """Template categories for Iraqi context"""
    ACADEMIC = "academic"
    GOVERNMENT = "government"
    LEGAL = "legal"
    MEDICAL = "medical"
    BUSINESS = "business"
    RELIGIOUS = "religious"
    CULTURAL = "cultural"


@dataclass
class IraqiTemplate:
    """Base template for Iraqi contexts"""
    
    template_id: str
    name: str
    description: str
    category: TemplateCategory
    
    # Iraqi context
    language: str = "arabic"
    cultural_context: str = "iraqi"
    islamic_compliance: bool = True
    rtl_support: bool = True
    
    # Template content
    structure: Dict[str, Any] = field(default_factory=dict)
    placeholders: List[str] = field(default_factory=list)
    validation_rules: List[str] = field(default_factory=list)
    
    # Metadata
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    author: Optional[str] = None
    institution: Optional[str] = None


class IraqiAcademicTemplates:
    """
    Cultural adaptations and domain-specific templates
    
    Provides pre-configured templates for Iraqi academic institutions,
    professional domains, and government organizations.
    """
    
    def __init__(self):
        self.templates: Dict[str, IraqiTemplate] = {}
        self._initialize_academic_templates()
        self._initialize_government_templates()
        self._initialize_legal_templates()
        self._initialize_medical_templates()
        self._initialize_business_templates()
        self._initialize_cultural_templates()
    
    def _initialize_academic_templates(self):
        """Initialize academic research templates"""
        
        # Master's Thesis Template
        masters_thesis = IraqiTemplate(
            template_id="masters_thesis_iraqi",
            name="قالب رسالة الماجستير العراقية",
            description="قالب شامل لكتابة رسالة الماجستير وفق المعايير العراقية",
            category=TemplateCategory.ACADEMIC,
            structure={
                "title_page": {
                    "arabic_title": "عنوان الرسالة باللغة العربية",
                    "english_title": "Thesis Title in English",
                    "student_name": "اسم الطالب",
                    "supervisor_name": "اسم المشرف",
                    "university": "اسم الجامعة",
                    "college": "اسم الكلية",
                    "department": "اسم القسم",
                    "degree": "درجة الماجستير في...",
                    "year": "السنة الدراسية"
                },
                "dedication": "الإهداء - وفق التقاليد الإسلامية",
                "acknowledgments": "الشكر والتقدير",
                "abstract_arabic": {
                    "introduction": "المقدمة",
                    "objectives": "أهداف الدراسة",
                    "methodology": "منهجية البحث",
                    "results": "النتائج",
                    "conclusions": "الخلاصة",
                    "keywords": "الكلمات المفتاحية"
                },
                "abstract_english": {
                    "introduction": "Introduction",
                    "objectives": "Objectives",
                    "methodology": "Methodology", 
                    "results": "Results",
                    "conclusions": "Conclusions",
                    "keywords": "Keywords"
                },
                "table_of_contents": "فهرس المحتويات",
                "list_of_tables": "فهرس الجداول",
                "list_of_figures": "فهرس الأشكال",
                "chapters": {
                    "chapter1": {
                        "title": "الفصل الأول: الإطار العام للدراسة",
                        "sections": [
                            "مقدمة الدراسة",
                            "مشكلة الدراسة",
                            "أهداف الدراسة",
                            "أهمية الدراسة",
                            "حدود الدراسة",
                            "منهجية الدراسة",
                            "هيكل الدراسة"
                        ]
                    },
                    "chapter2": {
                        "title": "الفصل الثاني: الإطار النظري ومراجعة الأدبيات",
                        "sections": [
                            "المفاهيم الأساسية",
                            "النظريات ذات الصلة",
                            "الدراسات السابقة",
                            "المنظور الإسلامي (إن وجد)",
                            "الفجوة البحثية"
                        ]
                    },
                    "chapter3": {
                        "title": "الفصل الثالث: منهجية البحث",
                        "sections": [
                            "مدخل إلى منهجية البحث",
                            "منهج الدراسة",
                            "مجتمع وعينة الدراسة",
                            "أدوات جمع البيانات",
                            "صدق وثبات الأدوات",
                            "الأساليب الإحصائية",
                            "الاعتبارات الأخلاقية"
                        ]
                    },
                    "chapter4": {
                        "title": "الفصل الرابع: عرض وتحليل النتائج",
                        "sections": [
                            "وصف العينة",
                            "نتائج الدراسة",
                            "تحليل النتائج",
                            "مناقشة النتائج"
                        ]
                    },
                    "chapter5": {
                        "title": "الفصل الخامس: الخلاصة والتوصيات",
                        "sections": [
                            "ملخص الدراسة",
                            "النتائج الرئيسية",
                            "التوصيات",
                            "المقترحات للبحوث المستقبلية"
                        ]
                    }
                },
                "references": "قائمة المراجع - وفق النمط العربي الأكاديمي",
                "appendices": "الملاحق"
            },
            placeholders=[
                "عنوان_الرسالة", "اسم_الطالب", "اسم_المشرف", "اسم_الجامعة",
                "اسم_الكلية", "اسم_القسم", "السنة_الدراسية", "مشكلة_البحث",
                "أهداف_البحث", "منهجية_البحث", "النتائج_الرئيسية"
            ],
            validation_rules=[
                "يجب أن يكون العنوان باللغة العربية والإنجليزية",
                "يجب تضمين المنظور الإسلامي إذا كان ذا صلة",
                "يجب اتباع معايير الجامعات العراقية",
                "يجب مراجعة الأدبيات العربية والإنجليزية",
                "يجب مراعاة الأخلاقيات الإسلامية في البحث"
            ]
        )
        self.templates[masters_thesis.template_id] = masters_thesis
        
        # PhD Dissertation Template
        phd_dissertation = IraqiTemplate(
            template_id="phd_dissertation_iraqi",
            name="قالب أطروحة الدكتوراه العراقية",
            description="قالب شامل لكتابة أطروحة الدكتوراه وفق المعايير العراقية",
            category=TemplateCategory.ACADEMIC,
            structure={
                # Similar to masters but with additional chapters
                "additional_chapters": {
                    "chapter6": {
                        "title": "الفصل السادس: النموذج المقترح",
                        "sections": [
                            "أسس بناء النموذج",
                            "مكونات النموذج",
                            "تطبيق النموذج",
                            "تقييم النموذج"
                        ]
                    },
                    "chapter7": {
                        "title": "الفصل السابع: التطبيق العملي",
                        "sections": [
                            "البيئة التطبيقية",
                            "تنفيذ النموذج",
                            "النتائج التطبيقية",
                            "التحقق من الفرضيات"
                        ]
                    }
                },
                "original_contribution": "المساهمة العلمية الأصيلة",
                "publications": "قائمة المنشورات المستخرجة من الأطروحة"
            }
        )
        self.templates[phd_dissertation.template_id] = phd_dissertation
        
        # Research Paper Template
        research_paper = IraqiTemplate(
            template_id="research_paper_iraqi",
            name="قالب البحث العلمي العراقي",
            description="قالب للبحوث العلمية المنشورة في المجلات العراقية",
            category=TemplateCategory.ACADEMIC,
            structure={
                "title": "عنوان البحث (عربي وإنجليزي)",
                "authors": "أسماء الباحثين والانتماءات",
                "abstract_arabic": "الملخص باللغة العربية",
                "abstract_english": "Abstract in English",
                "keywords": "الكلمات المفتاحية",
                "introduction": "المقدمة",
                "literature_review": "مراجعة الأدبيات",
                "methodology": "منهجية البحث",
                "results": "النتائج",
                "discussion": "مناقشة النتائج",
                "conclusion": "الخلاصة",
                "references": "المراجع",
                "appendices": "الملاحق (إن وجدت)"
            }
        )
        self.templates[research_paper.template_id] = research_paper
    
    def _initialize_government_templates(self):
        """Initialize government document templates"""
        
        # Government Report Template
        gov_report = IraqiTemplate(
            template_id="government_report_iraqi",
            name="قالب التقرير الحكومي العراقي",
            description="قالب للتقارير الرسمية للوزارات والمؤسسات الحكومية",
            category=TemplateCategory.GOVERNMENT,
            structure={
                "header": {
                    "republic_emblem": "شعار الجمهورية العراقية",
                    "ministry_name": "اسم الوزارة",
                    "department_name": "اسم الدائرة",
                    "document_number": "رقم الوثيقة",
                    "date": "التاريخ بالهجري والميلادي"
                },
                "title": "عنوان التقرير",
                "executive_summary": "الملخص التنفيذي",
                "introduction": "المقدمة",
                "current_situation": "الوضع الراهن",
                "analysis": "التحليل والدراسة",
                "recommendations": "التوصيات",
                "implementation_plan": "خطة التنفيذ",
                "budget_requirements": "المتطلبات المالية",
                "conclusion": "الخاتمة",
                "approval_signatures": "توقيعات الموافقة"
            },
            validation_rules=[
                "يجب استخدام الأسلوب الرسمي",
                "يجب تضمين شعار الجمهورية",
                "يجب كتابة التاريخ بالهجري والميلادي",
                "يجب الالتزام بالمصطلحات الرسمية"
            ]
        )
        self.templates[gov_report.template_id] = gov_report
        
        # Policy Document Template
        policy_doc = IraqiTemplate(
            template_id="policy_document_iraqi",
            name="قالب الوثيقة السياساتية العراقية",
            description="قالب لوثائق السياسات والاستراتيجيات الحكومية",
            category=TemplateCategory.GOVERNMENT,
            structure={
                "policy_title": "عنوان السياسة",
                "vision": "الرؤية",
                "mission": "الرسالة",
                "objectives": "الأهداف الاستراتيجية",
                "principles": "المبادئ الأساسية",
                "islamic_foundations": "الأسس الإسلامية",
                "implementation_strategy": "استراتيجية التنفيذ",
                "performance_indicators": "مؤشرات الأداء",
                "monitoring_evaluation": "المتابعة والتقييم",
                "stakeholders": "الجهات المعنية",
                "timeline": "الإطار الزمني",
                "budget_allocation": "التخصيصات المالية"
            }
        )
        self.templates[policy_doc.template_id] = policy_doc
    
    def _initialize_legal_templates(self):
        """Initialize legal document templates"""
        
        # Legal Brief Template
        legal_brief = IraqiTemplate(
            template_id="legal_brief_iraqi",
            name="قالب المذكرة القانونية العراقية",
            description="قالب للمذكرات القانونية وفق القانون العراقي",
            category=TemplateCategory.LEGAL,
            structure={
                "case_title": "عنوان القضية",
                "case_number": "رقم الدعوى",
                "court_name": "اسم المحكمة",
                "parties": {
                    "plaintiff": "المدعي",
                    "defendant": "المدعى عليه",
                    "legal_representatives": "الممثلون القانونيون"
                },
                "legal_framework": "الإطار القانوني",
                "case_summary": "ملخص القضية",
                "legal_issues": "المسائل القانونية",
                "applicable_laws": "القوانين المطبقة",
                "case_law": "السوابق القضائية",
                "islamic_jurisprudence": "الأحكام الشرعية (إن وجدت)",
                "legal_arguments": "الحجج القانونية",
                "evidence": "الأدلة",
                "conclusion": "الخلاصة القانونية",
                "recommendations": "التوصيات"
            },
            validation_rules=[
                "يجب الالتزام بالمصطلحات القانونية العراقية",
                "يجب مراجعة القوانين النافذة",
                "يجب تضمين المنظور الإسلامي عند الحاجة",
                "يجب التحقق من السوابق القضائية"
            ]
        )
        self.templates[legal_brief.template_id] = legal_brief
        
        # Contract Template
        contract_template = IraqiTemplate(
            template_id="contract_iraqi",
            name="قالب العقد العراقي",
            description="قالب للعقود التجارية والمدنية وفق القانون العراقي",
            category=TemplateCategory.LEGAL,
            structure={
                "contract_type": "نوع العقد",
                "contract_number": "رقم العقد",
                "date": "تاريخ العقد",
                "parties": {
                    "first_party": "الطرف الأول",
                    "second_party": "الطرف الثاني"
                },
                "preamble": "الديباجة",
                "definitions": "التعريفات",
                "subject_matter": "موضوع العقد",
                "obligations": {
                    "first_party_obligations": "التزامات الطرف الأول",
                    "second_party_obligations": "التزامات الطرف الثاني"
                },
                "financial_terms": "الأحكام المالية",
                "duration": "مدة العقد",
                "termination_conditions": "شروط الإنهاء",
                "dispute_resolution": "تسوية النزاعات",
                "islamic_compliance": "الأحكام الشرعية",
                "applicable_law": "القانون الواجب التطبيق",
                "signatures": "التوقيعات"
            }
        )
        self.templates[contract_template.template_id] = contract_template
    
    def _initialize_medical_templates(self):
        """Initialize medical document templates"""
        
        # Medical Report Template
        medical_report = IraqiTemplate(
            template_id="medical_report_iraqi",
            name="قالب التقرير الطبي العراقي",
            description="قالب للتقارير الطبية وفق المعايير العراقية",
            category=TemplateCategory.MEDICAL,
            structure={
                "hospital_header": {
                    "hospital_name": "اسم المستشفى",
                    "department": "اسم القسم",
                    "address": "العنوان",
                    "phone": "الهاتف"
                },
                "patient_info": {
                    "name": "اسم المريض",
                    "age": "العمر",
                    "gender": "الجنس",
                    "id_number": "رقم الهوية",
                    "admission_date": "تاريخ الدخول"
                },
                "chief_complaint": "الشكوى الرئيسية",
                "history_present_illness": "تاريخ المرض الحالي",
                "past_medical_history": "التاريخ المرضي السابق",
                "physical_examination": "الفحص السريري",
                "investigations": "الفحوصات المختبرية والإشعاعية",
                "diagnosis": "التشخيص",
                "treatment_plan": "خطة العلاج",
                "prognosis": "الإنذار",
                "islamic_medical_ethics": "الاعتبارات الأخلاقية الإسلامية",
                "physician_signature": "توقيع الطبيب المعالج"
            },
            validation_rules=[
                "يجب استخدام المصطلحات الطبية العربية",
                "يجب مراعاة الخصوصية الطبية",
                "يجب الالتزام بالأخلاقيات الطبية الإسلامية",
                "يجب توثيق جميع الفحوصات والعلاجات"
            ]
        )
        self.templates[medical_report.template_id] = medical_report
    
    def _initialize_business_templates(self):
        """Initialize business document templates"""
        
        # Business Plan Template
        business_plan = IraqiTemplate(
            template_id="business_plan_iraqi",
            name="قالب خطة العمل العراقية",
            description="قالب لخطط الأعمال وفق البيئة التجارية العراقية",
            category=TemplateCategory.BUSINESS,
            structure={
                "executive_summary": "الملخص التنفيذي",
                "company_description": "وصف الشركة",
                "market_analysis": "تحليل السوق العراقي",
                "organization_management": "الهيكل التنظيمي والإداري",
                "products_services": "المنتجات والخدمات",
                "marketing_sales": "التسويق والمبيعات",
                "funding_request": "طلب التمويل",
                "financial_projections": "التوقعات المالية",
                "islamic_finance_compliance": "التوافق مع أحكام التمويل الإسلامي",
                "risk_analysis": "تحليل المخاطر",
                "implementation_timeline": "الجدول الزمني للتنفيذ",
                "appendices": "الملاحق"
            },
            validation_rules=[
                "يجب مراعاة البيئة الاقتصادية العراقية",
                "يجب الالتزام بأحكام التمويل الإسلامي",
                "يجب تحليل السوق المحلي والإقليمي",
                "يجب مراعاة التشريعات التجارية العراقية"
            ]
        )
        self.templates[business_plan.template_id] = business_plan
    
    def _initialize_cultural_templates(self):
        """Initialize cultural and religious templates"""
        
        # Islamic Research Template
        islamic_research = IraqiTemplate(
            template_id="islamic_research_iraqi",
            name="قالب البحث الإسلامي العراقي",
            description="قالب للبحوث الإسلامية والدراسات الشرعية",
            category=TemplateCategory.RELIGIOUS,
            structure={
                "basmala": "بسم الله الرحمن الرحيم",
                "title": "عنوان البحث",
                "researcher_info": "معلومات الباحث",
                "abstract": "ملخص البحث",
                "introduction": "المقدمة",
                "research_importance": "أهمية البحث",
                "research_objectives": "أهداف البحث",
                "research_methodology": "منهج البحث",
                "previous_studies": "الدراسات السابقة",
                "main_chapters": {
                    "theoretical_framework": "الإطار النظري",
                    "quranic_verses": "الآيات القرآنية",
                    "prophetic_hadiths": "الأحاديث النبوية",
                    "scholars_opinions": "أقوال العلماء",
                    "jurisprudential_analysis": "التحليل الفقهي"
                },
                "conclusion": "الخاتمة",
                "recommendations": "التوصيات",
                "references": {
                    "quran": "القرآن الكريم",
                    "hadith_books": "كتب الحديث",
                    "jurisprudence_books": "كتب الفقه",
                    "modern_references": "المراجع المعاصرة"
                },
                "closing_prayer": "الدعاء الختامي"
            },
            validation_rules=[
                "يجب البدء بالبسملة",
                "يجب توثيق الآيات والأحاديث بدقة",
                "يجب الرجوع للمصادر الأصيلة",
                "يجب مراجعة العلماء المختصين"
            ]
        )
        self.templates[islamic_research.template_id] = islamic_research
    
    def get_template(self, template_id: str) -> Optional[IraqiTemplate]:
        """Get template by ID"""
        return self.templates.get(template_id)
    
    def list_templates_by_category(self, category: TemplateCategory) -> List[IraqiTemplate]:
        """List templates by category"""
        return [
            template for template in self.templates.values()
            if template.category == category
        ]
    
    def search_templates(self, query: str, category: Optional[TemplateCategory] = None) -> List[IraqiTemplate]:
        """Search templates by name or description"""
        results = []
        
        for template in self.templates.values():
            if category and template.category != category:
                continue
            
            if (query.lower() in template.name.lower() or 
                query.lower() in template.description.lower()):
                results.append(template)
        
        return results
    
    def get_template_placeholders(self, template_id: str) -> List[str]:
        """Get placeholders for template"""
        template = self.get_template(template_id)
        return template.placeholders if template else []
    
    def validate_template_usage(self, template_id: str, content: Dict[str, Any]) -> Dict[str, Any]:
        """Validate template usage"""
        template = self.get_template(template_id)
        if not template:
            return {"valid": False, "error": "Template not found"}
        
        validation_results = {
            "valid": True,
            "errors": [],
            "warnings": []
        }
        
        # Check required placeholders
        for placeholder in template.placeholders:
            if placeholder not in content:
                validation_results["errors"].append(f"Missing required placeholder: {placeholder}")
                validation_results["valid"] = False
        
        # Apply validation rules
        for rule in template.validation_rules:
            # This would implement actual rule checking
            # For now, just add as informational
            validation_results["warnings"].append(f"Validation rule: {rule}")
        
        return validation_results
    
    def generate_template_instance(
        self,
        template_id: str,
        content: Dict[str, Any],
        output_format: str = "markdown"
    ) -> Optional[str]:
        """Generate template instance with content"""
        template = self.get_template(template_id)
        if not template:
            return None
        
        # Validate content
        validation = self.validate_template_usage(template_id, content)
        if not validation["valid"]:
            return None
        
        # Generate content based on template structure
        if output_format == "markdown":
            return self._generate_markdown_template(template, content)
        elif output_format == "html":
            return self._generate_html_template(template, content)
        else:
            return self._generate_text_template(template, content)
    
    def _generate_markdown_template(self, template: IraqiTemplate, content: Dict[str, Any]) -> str:
        """Generate markdown template instance"""
        
        markdown_parts = []
        
        # Add header
        markdown_parts.append(f"# {content.get('title', template.name)}")
        markdown_parts.append("")
        
        # Add structure sections
        for section_name, section_content in template.structure.items():
            if isinstance(section_content, dict):
                markdown_parts.append(f"## {section_name}")
                for subsection, subcontent in section_content.items():
                    markdown_parts.append(f"### {subsection}")
                    if isinstance(subcontent, list):
                        for item in subcontent:
                            markdown_parts.append(f"- {item}")
                    else:
                        markdown_parts.append(str(subcontent))
                    markdown_parts.append("")
            else:
                markdown_parts.append(f"## {section_name}")
                markdown_parts.append(str(section_content))
                markdown_parts.append("")
        
        return "\n".join(markdown_parts)
    
    def _generate_html_template(self, template: IraqiTemplate, content: Dict[str, Any]) -> str:
        """Generate HTML template instance"""
        
        html_parts = ['<!DOCTYPE html>']
        html_parts.append('<html dir="rtl" lang="ar">')
        html_parts.append('<head>')
        html_parts.append('<meta charset="UTF-8">')
        html_parts.append(f'<title>{content.get("title", template.name)}</title>')
        html_parts.append('<style>')
        html_parts.append('body { font-family: "Traditional Arabic", Arial, sans-serif; direction: rtl; }')
        html_parts.append('</style>')
        html_parts.append('</head>')
        html_parts.append('<body>')
        html_parts.append(f'<h1>{content.get("title", template.name)}</h1>')
        
        # Add content sections
        for section_name, section_content in template.structure.items():
            html_parts.append(f'<h2>{section_name}</h2>')
            if isinstance(section_content, dict):
                for subsection, subcontent in section_content.items():
                    html_parts.append(f'<h3>{subsection}</h3>')
                    html_parts.append(f'<p>{subcontent}</p>')
            else:
                html_parts.append(f'<p>{section_content}</p>')
        
        html_parts.append('</body>')
        html_parts.append('</html>')
        
        return "\n".join(html_parts)
    
    def _generate_text_template(self, template: IraqiTemplate, content: Dict[str, Any]) -> str:
        """Generate plain text template instance"""
        
        text_parts = []
        text_parts.append(f"{'='*50}")
        text_parts.append(f"{content.get('title', template.name)}")
        text_parts.append(f"{'='*50}")
        text_parts.append("")
        
        for section_name, section_content in template.structure.items():
            text_parts.append(f"{section_name}:")
            text_parts.append("-" * len(section_name))
            if isinstance(section_content, dict):
                for subsection, subcontent in section_content.items():
                    text_parts.append(f"  {subsection}: {subcontent}")
            else:
                text_parts.append(str(section_content))
            text_parts.append("")
        
        return "\n".join(text_parts)
    
    def get_available_categories(self) -> List[str]:
        """Get list of available template categories"""
        return [category.value for category in TemplateCategory]
    
    def get_templates_summary(self) -> Dict[str, Any]:
        """Get summary of all templates"""
        
        summary = {
            "total_templates": len(self.templates),
            "by_category": {},
            "by_language": {},
            "islamic_compliant": 0,
            "rtl_supported": 0
        }
        
        for template in self.templates.values():
            # Count by category
            category = template.category.value
            summary["by_category"][category] = summary["by_category"].get(category, 0) + 1
            
            # Count by language
            language = template.language
            summary["by_language"][language] = summary["by_language"].get(language, 0) + 1
            
            # Count Islamic compliance
            if template.islamic_compliance:
                summary["islamic_compliant"] += 1
            
            # Count RTL support
            if template.rtl_support:
                summary["rtl_supported"] += 1
        
        return summary