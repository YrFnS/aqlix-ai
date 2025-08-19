"""
Iraqi Enhanced Command Validation System

Advanced command validation based on Roo-Code's security patterns with comprehensive
Iraqi cultural integration, professional domain validation, and Islamic compliance.

Key Features:
- Longest prefix match algorithm for command approval/denial
- Comprehensive security risk detection including subshell analysis
- Iraqi cultural validation with Islamic compliance checking
- Professional domain-specific validation rules
- Arabic language command processing with RTL support
- Government service command validation
- Performance optimization with intelligent caching

Based on Roo-Code's validation patterns:
- webview-ui/src/utils/command-validation.ts - Security validation and approval logic
- Longest prefix match strategy for allowlist/denylist conflicts
- Sophisticated subshell detection and command chain analysis
- Professional approval workflows for sensitive domains
"""

import asyncio
import logging
import re
import time
from dataclasses import dataclass, field
from enum import Enum
from typing import Any, Dict, List, Optional, Set, Tuple, Union
from abc import ABC, abstractmethod

from datetime import datetime, timedelta


class CommandDecision(Enum):
    """Command execution decision types"""
    AUTO_APPROVE = "auto_approve"
    AUTO_DENY = "auto_deny"
    ASK_USER = "ask_user"
    CULTURAL_REVIEW = "cultural_review"
    PROFESSIONAL_APPROVE = "professional_approve"
    ISLAMIC_REVIEW = "islamic_review"
    FAMILY_REVIEW = "family_review"


class SecurityRiskLevel(Enum):
    """Security risk levels for commands"""
    SAFE = "safe"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ProfessionalDomain(Enum):
    """Iraqi professional domains"""
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    ENGINEERING = "engineering"
    BUSINESS = "business"
    BANKING = "banking"
    MEDIA = "media"
    AGRICULTURE = "agriculture"
    RELIGIOUS = "religious"
    SECURITY = "security"
    GENERAL = "general"


@dataclass
class ValidationConfig:
    """Configuration for command validation"""
    # Allowlist and denylist for command prefixes
    allowed_commands: List[str] = field(default_factory=list)
    denied_commands: List[str] = field(default_factory=list)
    
    # Cultural validation settings
    cultural_validation_enabled: bool = True
    islamic_compliance_required: bool = True
    family_values_respect: bool = True
    arabic_language_support: bool = True
    
    # Professional domain settings
    professional_approval_required: Dict[str, bool] = field(default_factory=lambda: {
        'legal': True,
        'medical': True,
        'government': True,
        'religious': True,
        'security': True
    })
    
    # Security settings
    subshell_detection_enabled: bool = True
    security_risk_threshold: SecurityRiskLevel = SecurityRiskLevel.MEDIUM
    dangerous_command_blocking: bool = True
    
    # Performance settings
    validation_cache_enabled: bool = True
    cache_ttl_seconds: int = 300  # 5 minutes
    max_cache_size: int = 1000


@dataclass
class SecurityAnalysis:
    """Result of security analysis"""
    risk_level: SecurityRiskLevel
    has_subshells: bool
    security_risks: List[str]
    dangerous_patterns: List[str]
    command_injection_risk: bool
    privilege_escalation_risk: bool
    file_system_risk: bool
    network_risk: bool
    requires_approval: bool
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'risk_level': self.risk_level.value,
            'has_subshells': self.has_subshells,
            'security_risks': self.security_risks,
            'dangerous_patterns': self.dangerous_patterns,
            'command_injection_risk': self.command_injection_risk,
            'privilege_escalation_risk': self.privilege_escalation_risk,
            'file_system_risk': self.file_system_risk,
            'network_risk': self.network_risk,
            'requires_approval': self.requires_approval
        }


@dataclass
class CulturalAnalysis:
    """Result of cultural validation analysis"""
    is_culturally_compliant: bool
    cultural_score: float  # 0.0 to 1.0
    islamic_compliance: bool
    family_appropriateness: bool
    professional_ethics: bool
    arabic_compatibility: bool
    cultural_concerns: List[str]
    suggested_improvements: List[str]
    requires_review: bool
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'is_culturally_compliant': self.is_culturally_compliant,
            'cultural_score': self.cultural_score,
            'islamic_compliance': self.islamic_compliance,
            'family_appropriateness': self.family_appropriateness,
            'professional_ethics': self.professional_ethics,
            'arabic_compatibility': self.arabic_compatibility,
            'cultural_concerns': self.cultural_concerns,
            'suggested_improvements': self.suggested_improvements,
            'requires_review': self.requires_review
        }


@dataclass
class ProfessionalAnalysis:
    """Result of professional domain analysis"""
    detected_domains: List[ProfessionalDomain]
    domain_compatibility: Dict[ProfessionalDomain, bool]
    requires_professional_approval: bool
    approval_domains: List[ProfessionalDomain]
    access_restrictions: List[str]
    professional_context_score: float
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'detected_domains': [domain.value for domain in self.detected_domains],
            'domain_compatibility': {domain.value: compat for domain, compat in self.domain_compatibility.items()},
            'requires_professional_approval': self.requires_professional_approval,
            'approval_domains': [domain.value for domain in self.approval_domains],
            'access_restrictions': self.access_restrictions,
            'professional_context_score': self.professional_context_score
        }


@dataclass
class ValidationResult:
    """Comprehensive validation result"""
    decision: CommandDecision
    confidence_score: float  # 0.0 to 1.0
    security_analysis: SecurityAnalysis
    cultural_analysis: CulturalAnalysis
    professional_analysis: ProfessionalAnalysis
    validation_time_ms: float
    cached_result: bool
    
    # Additional metadata
    command_patterns: List[str]
    subcommands: List[str]
    longest_allowed_match: Optional[str]
    longest_denied_match: Optional[str]
    decision_rationale: List[str]
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'decision': self.decision.value,
            'confidence_score': self.confidence_score,
            'security_analysis': self.security_analysis.to_dict(),
            'cultural_analysis': self.cultural_analysis.to_dict(),
            'professional_analysis': self.professional_analysis.to_dict(),
            'validation_time_ms': self.validation_time_ms,
            'cached_result': self.cached_result,
            'command_patterns': self.command_patterns,
            'subcommands': self.subcommands,
            'longest_allowed_match': self.longest_allowed_match,
            'longest_denied_match': self.longest_denied_match,
            'decision_rationale': self.decision_rationale
        }


class IraqiCommandSecurityAnalyzer:
    """Advanced security analysis for Iraqi commands"""
    
    def __init__(self):
        # Subshell detection patterns (from Roo-Code)
        self.subshell_patterns = [
            r'\$\([^)]*\)',          # $() command substitution
            r'`[^`]*`',              # `` backtick substitution
            r'<\([^)]*\)',           # <() process substitution
            r'>\([^)]*\)',           # >() process substitution
            r'\$\(\([^)]*\)\)',      # $(()) arithmetic expansion
            r'\$\[[^\]]*\]',         # $[] arithmetic expansion
            r'\([^)]*[;&|]+[^)]*\)'  # subshell grouping
        ]
        
        # Dangerous command patterns
        self.dangerous_patterns = {
            'file_system_destruction': [
                r'\brm\s+.*-rf\s*/',
                r'\bdel\s+.*[/\\]',
                r'\bformat\s+[a-zA-Z]:',
                r'\bmkfs\.',
                r'\bfdisk\s+'
            ],
            'privilege_escalation': [
                r'\bsudo\s+',
                r'\bsu\s+',
                r'\brunas\s+',
                r'\belevate\s+',
                r'\badmin\s+'
            ],
            'credential_exposure': [
                r'\bpasswd\s+',
                r'\bpassword\s*=',
                r'\bcredential\s*=',
                r'\bapi[_-]?key\s*=',
                r'\btoken\s*='
            ],
            'network_exploitation': [
                r'\bcurl\s+.*\|\s*(sh|bash|python)',
                r'\bwget\s+.*\|\s*(sh|bash|python)',
                r'\bnc\s+.*-e\s+',
                r'\bnetcat\s+.*-e\s+',
                r'\btelnet\s+'
            ],
            'process_manipulation': [
                r'\bkill\s+-9',
                r'\bpkill\s+',
                r'\bkillall\s+',
                r'\bterminate\s+',
                r'\btaskkill\s+'
            ]
        }
        
        # Iraqi-specific security concerns
        self.iraqi_security_patterns = {
            'government_sensitive': [
                r'\b(ministry|وزارة)\b.*\b(hack|crack|breach)\b',
                r'\b(passport|جواز)\b.*\b(fake|forge|counterfeit)\b',
                r'\b(vote|انتخاب)\b.*\b(manipulate|fraud|rigging)\b'
            ],
            'cultural_sensitive': [
                r'\b(mosque|مسجد)\b.*\b(attack|bomb|threat)\b',
                r'\b(imam|إمام)\b.*\b(impersonate|fake)\b',
                r'\b(quran|قرآن)\b.*\b(alter|modify|corrupt)\b'
            ],
            'professional_sensitive': [
                r'\b(doctor|طبيب)\b.*\b(prescription|وصفة)\b.*\b(fake|forge)\b',
                r'\b(lawyer|محامي)\b.*\b(evidence|دليل)\b.*\b(destroy|hide)\b',
                r'\b(judge|قاضي)\b.*\b(bribe|رشوة|corrupt)\b'
            ]
        }
    
    def analyze_security(self, command: str) -> SecurityAnalysis:
        """Comprehensive security analysis of command"""
        try:
            # Detect subshells
            has_subshells = self._detect_subshells(command)
            
            # Analyze dangerous patterns
            dangerous_patterns = self._detect_dangerous_patterns(command)
            
            # Check for specific security risks
            security_risks = self._identify_security_risks(command, has_subshells, dangerous_patterns)
            
            # Assess Iraqi-specific security concerns
            iraqi_risks = self._assess_iraqi_security_risks(command)
            security_risks.extend(iraqi_risks)
            
            # Determine overall risk level
            risk_level = self._calculate_risk_level(has_subshells, dangerous_patterns, security_risks)
            
            # Specific risk categorization
            command_injection_risk = has_subshells or any('injection' in risk for risk in security_risks)
            privilege_escalation_risk = any('privilege' in pattern for pattern in dangerous_patterns)
            file_system_risk = any('file_system' in pattern for pattern in dangerous_patterns)
            network_risk = any('network' in pattern for pattern in dangerous_patterns)
            
            requires_approval = risk_level in [SecurityRiskLevel.HIGH, SecurityRiskLevel.CRITICAL]
            
            return SecurityAnalysis(
                risk_level=risk_level,
                has_subshells=has_subshells,
                security_risks=security_risks,
                dangerous_patterns=dangerous_patterns,
                command_injection_risk=command_injection_risk,
                privilege_escalation_risk=privilege_escalation_risk,
                file_system_risk=file_system_risk,
                network_risk=network_risk,
                requires_approval=requires_approval
            )
            
        except Exception as e:
            logging.error(f"Security analysis error: {e}")
            # Conservative approach on error
            return SecurityAnalysis(
                risk_level=SecurityRiskLevel.CRITICAL,
                has_subshells=True,
                security_risks=[f"Analysis error: {str(e)}"],
                dangerous_patterns=[],
                command_injection_risk=True,
                privilege_escalation_risk=True,
                file_system_risk=True,
                network_risk=True,
                requires_approval=True
            )
    
    def _detect_subshells(self, command: str) -> bool:
        """Detect subshell usage and command substitution"""
        return any(
            re.search(pattern, command, re.IGNORECASE)
            for pattern in self.subshell_patterns
        )
    
    def _detect_dangerous_patterns(self, command: str) -> List[str]:
        """Detect dangerous command patterns"""
        detected_patterns = []
        
        for category, patterns in self.dangerous_patterns.items():
            for pattern in patterns:
                if re.search(pattern, command, re.IGNORECASE):
                    detected_patterns.append(category)
                    break
        
        return detected_patterns
    
    def _identify_security_risks(self, command: str, has_subshells: bool, dangerous_patterns: List[str]) -> List[str]:
        """Identify specific security risks"""
        risks = []
        
        if has_subshells:
            risks.append("Command substitution detected - potential injection risk")
        
        if 'file_system_destruction' in dangerous_patterns:
            risks.append("File system destruction risk detected")
        
        if 'privilege_escalation' in dangerous_patterns:
            risks.append("Privilege escalation attempt detected")
        
        if 'credential_exposure' in dangerous_patterns:
            risks.append("Credential exposure risk detected")
        
        if 'network_exploitation' in dangerous_patterns:
            risks.append("Network exploitation risk detected")
        
        if 'process_manipulation' in dangerous_patterns:
            risks.append("Process manipulation detected")
        
        # Check for chained commands that might bypass validation
        if re.search(r'&&|\|\||;', command):
            risks.append("Command chaining detected - review each component")
        
        return risks
    
    def _assess_iraqi_security_risks(self, command: str) -> List[str]:
        """Assess Iraqi-specific security risks"""
        iraqi_risks = []
        
        for category, patterns in self.iraqi_security_patterns.items():
            for pattern in patterns:
                if re.search(pattern, command, re.IGNORECASE):
                    iraqi_risks.append(f"Iraqi {category} security concern detected")
                    break
        
        return iraqi_risks
    
    def _calculate_risk_level(self, has_subshells: bool, dangerous_patterns: List[str], security_risks: List[str]) -> SecurityRiskLevel:
        """Calculate overall security risk level"""
        risk_score = 0
        
        if has_subshells:
            risk_score += 3
        
        risk_score += len(dangerous_patterns) * 2
        risk_score += len(security_risks)
        
        # Check for critical patterns
        critical_patterns = ['file_system_destruction', 'privilege_escalation']
        if any(pattern in dangerous_patterns for pattern in critical_patterns):
            risk_score += 5
        
        # Determine risk level
        if risk_score >= 10:
            return SecurityRiskLevel.CRITICAL
        elif risk_score >= 7:
            return SecurityRiskLevel.HIGH
        elif risk_score >= 4:
            return SecurityRiskLevel.MEDIUM
        elif risk_score >= 2:
            return SecurityRiskLevel.LOW
        else:
            return SecurityRiskLevel.SAFE


class IraqiCulturalAnalyzer:
    """Cultural analysis for Iraqi commands"""
    
    def __init__(self):
        # Islamic compliance keywords
        self.islamic_keywords = {
            'positive': {
                'prayer', 'salah', 'quran', 'hadith', 'mosque', 'imam', 'allah', 'prophet',
                'charity', 'zakat', 'hajj', 'umrah', 'ramadan', 'fasting', 'dua', 'halal',
                'صلاة', 'قرآن', 'حديث', 'مسجد', 'إمام', 'الله', 'نبي', 'خير', 'زكاة', 'حج', 'حلال'
            },
            'negative': {
                'haram', 'forbidden', 'sin', 'alcohol', 'pork', 'gambling', 'interest', 'riba',
                'adultery', 'theft', 'corruption', 'bribery', 'lie', 'cheat', 'steal',
                'حرام', 'محرم', 'خمر', 'خنزير', 'قمار', 'ربا', 'زنا', 'سرقة', 'فساد', 'رشوة', 'كذب'
            }
        }
        
        # Family values keywords
        self.family_keywords = {
            'family', 'mother', 'father', 'child', 'parent', 'spouse', 'marriage', 'wedding',
            'brother', 'sister', 'son', 'daughter', 'home', 'household', 'tradition', 'respect',
            'honor', 'dignity', 'care', 'love', 'support', 'protection', 'guidance', 'education',
            'عائلة', 'أم', 'أب', 'طفل', 'والد', 'زوج', 'زواج', 'عرس', 'أخ', 'أخت', 'ابن', 'ابنة',
            'بيت', 'تقليد', 'احترام', 'كرامة', 'حب', 'دعم', 'حماية', 'توجيه', 'تعليم'
        }
        
        # Professional ethics keywords
        self.professional_ethics = {
            'integrity', 'honesty', 'transparency', 'accountability', 'responsibility', 'ethics',
            'professional', 'competence', 'quality', 'excellence', 'service', 'dedication',
            'commitment', 'reliability', 'trustworthy', 'confidentiality', 'privacy',
            'نزاهة', 'صدق', 'شفافية', 'مساءلة', 'مسؤولية', 'أخلاق', 'مهني', 'كفاءة', 'جودة',
            'تميز', 'خدمة', 'إخلاص', 'التزام', 'موثوقية', 'سرية', 'خصوصية'
        }
        
        # Problematic content patterns
        self.problematic_patterns = [
            r'\b(violence|harm|hurt|damage|destroy)\b',
            r'\b(hate|discrimination|racism|sectarian)\b',
            r'\b(explicit|adult|mature|inappropriate)\b',
            r'\b(fraud|scam|cheat|steal|rob)\b',
            r'\b(عنف|ضرر|أذى|تدمير|كراهية|تمييز|عنصرية|طائفية|احتيال|خداع|سرقة)\b'
        ]
    
    def analyze_cultural_compliance(self, command: str) -> CulturalAnalysis:
        """Analyze cultural compliance of command"""
        try:
            # Islamic compliance analysis
            islamic_score = self._analyze_islamic_compliance(command)
            
            # Family values analysis
            family_score = self._analyze_family_appropriateness(command)
            
            # Professional ethics analysis
            ethics_score = self._analyze_professional_ethics(command)
            
            # Arabic compatibility analysis
            arabic_score = self._analyze_arabic_compatibility(command)
            
            # Overall cultural score
            cultural_score = (islamic_score * 0.3 + family_score * 0.25 + 
                            ethics_score * 0.25 + arabic_score * 0.2)
            
            # Check for problematic content
            has_problematic_content = self._has_problematic_content(command)
            
            # Determine compliance
            is_compliant = (cultural_score >= 0.7 and not has_problematic_content)
            
            # Generate concerns and suggestions
            concerns = self._identify_cultural_concerns(command, islamic_score, family_score, ethics_score)
            suggestions = self._generate_cultural_suggestions(command, cultural_score)
            
            return CulturalAnalysis(
                is_culturally_compliant=is_compliant,
                cultural_score=cultural_score,
                islamic_compliance=islamic_score >= 0.8,
                family_appropriateness=family_score >= 0.8,
                professional_ethics=ethics_score >= 0.8,
                arabic_compatibility=arabic_score >= 0.7,
                cultural_concerns=concerns,
                suggested_improvements=suggestions,
                requires_review=cultural_score < 0.8 or has_problematic_content
            )
            
        except Exception as e:
            logging.error(f"Cultural analysis error: {e}")
            return CulturalAnalysis(
                is_culturally_compliant=False,
                cultural_score=0.0,
                islamic_compliance=False,
                family_appropriateness=False,
                professional_ethics=False,
                arabic_compatibility=False,
                cultural_concerns=[f"Analysis error: {str(e)}"],
                suggested_improvements=[],
                requires_review=True
            )
    
    def _analyze_islamic_compliance(self, command: str) -> float:
        """Analyze Islamic compliance"""
        command_lower = command.lower()
        
        # Check for positive Islamic content
        positive_content = any(keyword in command_lower for keyword in self.islamic_keywords['positive'])
        
        # Check for negative/haram content
        negative_content = any(keyword in command_lower for keyword in self.islamic_keywords['negative'])
        
        if negative_content:
            return 0.1  # Very low score for haram content
        elif positive_content:
            return 1.0  # High score for Islamic content
        else:
            return 0.8  # Neutral content gets good score
    
    def _analyze_family_appropriateness(self, command: str) -> float:
        """Analyze family values appropriateness"""
        command_lower = command.lower()
        
        # Check for family-positive content
        family_content = any(keyword in command_lower for keyword in self.family_keywords)
        
        # Check for family-inappropriate content
        inappropriate_patterns = [
            r'\b(adult|explicit|mature|violence|harm)\b',
            r'\b(كبار|صريح|عنف|ضرر)\b'
        ]
        
        has_inappropriate = any(re.search(pattern, command_lower) for pattern in inappropriate_patterns)
        
        if has_inappropriate:
            return 0.2
        elif family_content:
            return 1.0
        else:
            return 0.8
    
    def _analyze_professional_ethics(self, command: str) -> float:
        """Analyze professional ethics compliance"""
        command_lower = command.lower()
        
        # Check for professional ethics content
        ethics_content = any(keyword in command_lower for keyword in self.professional_ethics)
        
        # Check for unethical content
        unethical_patterns = [
            r'\b(bribe|corruption|fraud|cheat|lie|deceive)\b',
            r'\b(رشوة|فساد|احتيال|خداع|كذب|غش)\b'
        ]
        
        has_unethical = any(re.search(pattern, command_lower) for pattern in unethical_patterns)
        
        if has_unethical:
            return 0.1
        elif ethics_content:
            return 1.0
        else:
            return 0.8
    
    def _analyze_arabic_compatibility(self, command: str) -> float:
        """Analyze Arabic language compatibility"""
        # Check for Arabic text
        has_arabic = bool(re.search(r'[\u0600-\u06FF]', command))
        
        # Check for RTL text indicators
        has_rtl = bool(re.search(r'[\u0590-\u08FF]', command))
        
        if has_arabic and has_rtl:
            return 1.0  # Full Arabic support
        elif has_arabic:
            return 0.8  # Arabic text present
        else:
            return 0.7  # No Arabic, but compatible
    
    def _has_problematic_content(self, command: str) -> bool:
        """Check for problematic content"""
        return any(re.search(pattern, command, re.IGNORECASE) for pattern in self.problematic_patterns)
    
    def _identify_cultural_concerns(self, command: str, islamic_score: float, 
                                  family_score: float, ethics_score: float) -> List[str]:
        """Identify specific cultural concerns"""
        concerns = []
        
        if islamic_score < 0.5:
            concerns.append("Islamic compliance concerns detected")
        
        if family_score < 0.5:
            concerns.append("Family values compatibility issues")
        
        if ethics_score < 0.5:
            concerns.append("Professional ethics violations detected")
        
        if self._has_problematic_content(command):
            concerns.append("Problematic content detected")
        
        return concerns
    
    def _generate_cultural_suggestions(self, command: str, score: float) -> List[str]:
        """Generate cultural improvement suggestions"""
        suggestions = []
        
        if score < 0.5:
            suggestions.extend([
                "Review command for Islamic compliance",
                "Ensure family-appropriate content",
                "Follow professional ethics guidelines"
            ])
        elif score < 0.8:
            suggestions.extend([
                "Consider adding cultural context",
                "Enhance Arabic language support",
                "Review professional appropriateness"
            ])
        
        return suggestions


class IraqiProfessionalAnalyzer:
    """Professional domain analysis for Iraqi commands"""
    
    def __init__(self):
        # Professional domain indicators
        self.domain_indicators = {
            ProfessionalDomain.LEGAL: {
                'court', 'judge', 'lawyer', 'law', 'legal', 'justice', 'attorney', 'case', 'trial',
                'evidence', 'witness', 'verdict', 'appeal', 'litigation', 'contract', 'agreement',
                'محكمة', 'قاضي', 'محامي', 'قانون', 'قانوني', 'عدالة', 'قضية', 'محاكمة', 'دليل', 'شاهد'
            },
            ProfessionalDomain.MEDICAL: {
                'doctor', 'patient', 'hospital', 'medicine', 'treatment', 'diagnosis', 'health', 'clinic',
                'surgery', 'prescription', 'medical', 'nurse', 'physician', 'therapy', 'cure',
                'طبيب', 'مريض', 'مستشفى', 'دواء', 'علاج', 'تشخيص', 'صحة', 'عيادة', 'جراحة', 'وصفة'
            },
            ProfessionalDomain.EDUCATIONAL: {
                'school', 'teacher', 'student', 'university', 'education', 'classroom', 'lesson', 'exam',
                'curriculum', 'grade', 'academic', 'learning', 'knowledge', 'study', 'research',
                'مدرسة', 'معلم', 'طالب', 'جامعة', 'تعليم', 'صف', 'درس', 'امتحان', 'منهج', 'علامة'
            },
            ProfessionalDomain.GOVERNMENT: {
                'ministry', 'government', 'public', 'service', 'official', 'department', 'citizen', 'permit',
                'license', 'registration', 'administrative', 'bureau', 'agency', 'municipal', 'federal',
                'وزارة', 'حكومة', 'عام', 'خدمة', 'رسمي', 'دائرة', 'مواطن', 'تصريح', 'رخصة', 'تسجيل'
            },
            ProfessionalDomain.BANKING: {
                'bank', 'finance', 'loan', 'credit', 'account', 'transaction', 'payment', 'investment',
                'currency', 'interest', 'mortgage', 'deposit', 'withdrawal', 'transfer', 'balance',
                'بنك', 'مالية', 'قرض', 'ائتمان', 'حساب', 'معاملة', 'دفع', 'استثمار', 'عملة', 'فائدة'
            },
            ProfessionalDomain.RELIGIOUS: {
                'mosque', 'imam', 'religious', 'islamic', 'scholar', 'cleric', 'prayer', 'sermon',
                'fatwa', 'quran', 'hadith', 'sunnah', 'sharia', 'worship', 'faith', 'belief',
                'مسجد', 'إمام', 'ديني', 'إسلامي', 'عالم', 'رجل دين', 'صلاة', 'خطبة', 'فتوى'
            }
        }
        
        # Professional approval requirements
        self.approval_required_domains = {
            ProfessionalDomain.LEGAL,
            ProfessionalDomain.MEDICAL,
            ProfessionalDomain.GOVERNMENT,
            ProfessionalDomain.RELIGIOUS,
            ProfessionalDomain.SECURITY
        }
    
    def analyze_professional_context(self, command: str, user_domain: ProfessionalDomain) -> ProfessionalAnalysis:
        """Analyze professional context of command"""
        try:
            # Detect professional domains in command
            detected_domains = self._detect_professional_domains(command)
            
            # Assess domain compatibility
            domain_compatibility = self._assess_domain_compatibility(detected_domains, user_domain)
            
            # Check approval requirements
            requires_approval = self._requires_professional_approval(detected_domains)
            approval_domains = [domain for domain in detected_domains if domain in self.approval_required_domains]
            
            # Identify access restrictions
            access_restrictions = self._identify_access_restrictions(detected_domains, user_domain)
            
            # Calculate professional context score
            context_score = self._calculate_professional_score(detected_domains, user_domain, domain_compatibility)
            
            return ProfessionalAnalysis(
                detected_domains=detected_domains,
                domain_compatibility=domain_compatibility,
                requires_professional_approval=requires_approval,
                approval_domains=approval_domains,
                access_restrictions=access_restrictions,
                professional_context_score=context_score
            )
            
        except Exception as e:
            logging.error(f"Professional analysis error: {e}")
            return ProfessionalAnalysis(
                detected_domains=[],
                domain_compatibility={},
                requires_professional_approval=True,  # Conservative approach
                approval_domains=[],
                access_restrictions=[f"Analysis error: {str(e)}"],
                professional_context_score=0.0
            )
    
    def _detect_professional_domains(self, command: str) -> List[ProfessionalDomain]:
        """Detect professional domains in command"""
        command_lower = command.lower()
        detected_domains = []
        
        for domain, keywords in self.domain_indicators.items():
            if any(keyword in command_lower for keyword in keywords):
                detected_domains.append(domain)
        
        return detected_domains
    
    def _assess_domain_compatibility(self, detected_domains: List[ProfessionalDomain], 
                                   user_domain: ProfessionalDomain) -> Dict[ProfessionalDomain, bool]:
        """Assess compatibility between detected and user domains"""
        compatibility = {}
        
        for domain in ProfessionalDomain:
            if domain == ProfessionalDomain.GENERAL:
                compatibility[domain] = True  # General domain is always compatible
            elif domain == user_domain:
                compatibility[domain] = True  # User's own domain
            elif domain in detected_domains and domain in self.approval_required_domains:
                compatibility[domain] = False  # Requires special approval
            else:
                compatibility[domain] = True  # Default compatible
        
        return compatibility
    
    def _requires_professional_approval(self, detected_domains: List[ProfessionalDomain]) -> bool:
        """Check if professional approval is required"""
        return any(domain in self.approval_required_domains for domain in detected_domains)
    
    def _identify_access_restrictions(self, detected_domains: List[ProfessionalDomain], 
                                    user_domain: ProfessionalDomain) -> List[str]:
        """Identify access restrictions"""
        restrictions = []
        
        for domain in detected_domains:
            if domain in self.approval_required_domains and domain != user_domain:
                restrictions.append(f"Requires {domain.value} professional approval")
        
        return restrictions
    
    def _calculate_professional_score(self, detected_domains: List[ProfessionalDomain],
                                    user_domain: ProfessionalDomain,
                                    compatibility: Dict[ProfessionalDomain, bool]) -> float:
        """Calculate professional context score"""
        if not detected_domains:
            return 1.0  # No specific domain requirements
        
        compatible_count = sum(1 for domain in detected_domains if compatibility.get(domain, False))
        total_count = len(detected_domains)
        
        return compatible_count / total_count if total_count > 0 else 1.0


class IraqiCommandValidator:
    """
    Comprehensive command validator with Iraqi cultural integration.
    
    Implements longest prefix match algorithm from Roo-Code with enhanced
    cultural validation, professional domain checking, and security analysis.
    """
    
    def __init__(self, config: Optional[ValidationConfig] = None):
        """Initialize validator with configuration"""
        self.config = config or ValidationConfig()
        
        # Initialize analyzers
        self.security_analyzer = IraqiCommandSecurityAnalyzer()
        self.cultural_analyzer = IraqiCulturalAnalyzer()
        self.professional_analyzer = IraqiProfessionalAnalyzer()
        
        # Validation cache
        self.validation_cache: Dict[str, Tuple[ValidationResult, datetime]] = {}
        
        # Performance metrics
        self.metrics = {
            'total_validations': 0,
            'cache_hits': 0,
            'average_validation_time': 0.0,
            'security_blocks': 0,
            'cultural_reviews': 0,
            'professional_approvals': 0
        }
        
        logging.info("Iraqi Command Validator initialized")
    
    async def validate_command(self, command: str, 
                             user_domain: ProfessionalDomain = ProfessionalDomain.GENERAL) -> ValidationResult:
        """Comprehensive command validation"""
        start_time = time.time()
        
        try:
            # Check cache first
            cache_key = f"{command}_{user_domain.value}"
            if self.config.validation_cache_enabled:
                cached_result = self._get_cached_result(cache_key)
                if cached_result:
                    self.metrics['cache_hits'] += 1
                    return cached_result
            
            # Parse command into subcommands
            subcommands = self._parse_command_chain(command)
            
            # Extract command patterns
            patterns = self._extract_command_patterns(command)
            
            # Apply longest prefix match algorithm
            longest_allowed, longest_denied = self._find_longest_prefix_matches(command)
            
            # Perform comprehensive analysis
            security_analysis = self.security_analyzer.analyze_security(command)
            cultural_analysis = self.cultural_analyzer.analyze_cultural_compliance(command)
            professional_analysis = self.professional_analyzer.analyze_professional_context(command, user_domain)
            
            # Make decision
            decision, confidence, rationale = self._make_validation_decision(
                longest_allowed, longest_denied, security_analysis, 
                cultural_analysis, professional_analysis
            )
            
            # Create validation result
            validation_time = (time.time() - start_time) * 1000  # Convert to milliseconds
            
            result = ValidationResult(
                decision=decision,
                confidence_score=confidence,
                security_analysis=security_analysis,
                cultural_analysis=cultural_analysis,
                professional_analysis=professional_analysis,
                validation_time_ms=validation_time,
                cached_result=False,
                command_patterns=patterns,
                subcommands=subcommands,
                longest_allowed_match=longest_allowed,
                longest_denied_match=longest_denied,
                decision_rationale=rationale
            )
            
            # Cache result
            if self.config.validation_cache_enabled:
                self._cache_result(cache_key, result)
            
            # Update metrics
            self._update_metrics(result)
            
            return result
            
        except Exception as e:
            logging.error(f"Validation error: {e}")
            # Return conservative result on error
            return ValidationResult(
                decision=CommandDecision.AUTO_DENY,
                confidence_score=0.0,
                security_analysis=SecurityAnalysis(
                    risk_level=SecurityRiskLevel.CRITICAL,
                    has_subshells=True,
                    security_risks=[f"Validation error: {str(e)}"],
                    dangerous_patterns=[],
                    command_injection_risk=True,
                    privilege_escalation_risk=True,
                    file_system_risk=True,
                    network_risk=True,
                    requires_approval=True
                ),
                cultural_analysis=CulturalAnalysis(
                    is_culturally_compliant=False,
                    cultural_score=0.0,
                    islamic_compliance=False,
                    family_appropriateness=False,
                    professional_ethics=False,
                    arabic_compatibility=False,
                    cultural_concerns=[f"Validation error: {str(e)}"],
                    suggested_improvements=[],
                    requires_review=True
                ),
                professional_analysis=ProfessionalAnalysis(
                    detected_domains=[],
                    domain_compatibility={},
                    requires_professional_approval=True,
                    approval_domains=[],
                    access_restrictions=[f"Validation error: {str(e)}"],
                    professional_context_score=0.0
                ),
                validation_time_ms=(time.time() - start_time) * 1000,
                cached_result=False,
                command_patterns=[],
                subcommands=[],
                longest_allowed_match=None,
                longest_denied_match=None,
                decision_rationale=[f"Validation error: {str(e)}"]
            )
    
    def _parse_command_chain(self, command: str) -> List[str]:
        """Parse command chain following Roo-Code patterns"""
        if not command or not command.strip():
            return []
        
        # Split by command separators
        separators = ['&&', '||', ';', '|', '&']
        commands = [command]
        
        for separator in separators:
            new_commands = []
            for cmd in commands:
                new_commands.extend(cmd.split(separator))
            commands = new_commands
        
        # Clean and filter commands
        return [cmd.strip() for cmd in commands if cmd.strip()]
    
    def _extract_command_patterns(self, command: str) -> List[str]:
        """Extract command patterns for validation"""
        patterns = set()
        subcommands = self._parse_command_chain(command)
        
        for subcmd in subcommands:
            tokens = subcmd.split()
            if not tokens:
                continue
            
            # Add base command
            patterns.add(tokens[0])
            
            # Add command + first argument (max 3 levels)
            for i in range(1, min(len(tokens), 3)):
                # Stop at flags or special characters
                if tokens[i].startswith('-') or any(char in tokens[i] for char in ['/', '\\', '~', ':']):
                    break
                pattern = ' '.join(tokens[:i + 1])
                patterns.add(pattern)
        
        return sorted(list(patterns))
    
    def _find_longest_prefix_matches(self, command: str) -> Tuple[Optional[str], Optional[str]]:
        """Find longest prefix matches in allowlist and denylist"""
        command_lower = command.lower().strip()
        
        # Find longest allowed match
        longest_allowed = None
        for allowed_prefix in self.config.allowed_commands:
            prefix_lower = allowed_prefix.lower()
            if prefix_lower == "*" or command_lower.startswith(prefix_lower):
                if not longest_allowed or len(prefix_lower) > len(longest_allowed):
                    longest_allowed = prefix_lower
        
        # Find longest denied match
        longest_denied = None
        for denied_prefix in self.config.denied_commands:
            prefix_lower = denied_prefix.lower()
            if command_lower.startswith(prefix_lower):
                if not longest_denied or len(prefix_lower) > len(longest_denied):
                    longest_denied = prefix_lower
        
        return longest_allowed, longest_denied
    
    def _make_validation_decision(self, longest_allowed: Optional[str], longest_denied: Optional[str],
                                security_analysis: SecurityAnalysis, cultural_analysis: CulturalAnalysis,
                                professional_analysis: ProfessionalAnalysis) -> Tuple[CommandDecision, float, List[str]]:
        """Make validation decision using multiple factors"""
        rationale = []
        confidence = 1.0
        
        # Critical security risks
        if security_analysis.risk_level == SecurityRiskLevel.CRITICAL:
            return CommandDecision.AUTO_DENY, confidence, ["Critical security risk detected"]
        
        # Cultural compliance issues
        if not cultural_analysis.is_culturally_compliant:
            if cultural_analysis.cultural_score < 0.3:
                return CommandDecision.AUTO_DENY, confidence, ["Severe cultural compliance violation"]
            else:
                return CommandDecision.CULTURAL_REVIEW, 0.7, ["Cultural review required"]
        
        # Professional approval required
        if professional_analysis.requires_professional_approval:
            return CommandDecision.PROFESSIONAL_APPROVE, 0.8, ["Professional approval required"]
        
        # High security risks
        if security_analysis.risk_level == SecurityRiskLevel.HIGH:
            return CommandDecision.ASK_USER, 0.6, ["High security risk requires user confirmation"]
        
        # Apply longest prefix match rule
        if longest_denied and longest_allowed:
            if len(longest_denied) > len(longest_allowed):
                rationale.append(f"Denied by longer prefix match: '{longest_denied}'")
                return CommandDecision.AUTO_DENY, confidence, rationale
            elif len(longest_allowed) > len(longest_denied):
                rationale.append(f"Approved by longer prefix match: '{longest_allowed}'")
                return CommandDecision.AUTO_APPROVE, confidence, rationale
            else:
                # Equal length - default to denial for safety
                rationale.append("Equal prefix matches - defaulting to denial for safety")
                return CommandDecision.AUTO_DENY, confidence, rationale
        elif longest_denied:
            rationale.append(f"Denied by prefix match: '{longest_denied}'")
            return CommandDecision.AUTO_DENY, confidence, rationale
        elif longest_allowed:
            rationale.append(f"Approved by prefix match: '{longest_allowed}'")
            return CommandDecision.AUTO_APPROVE, confidence, rationale
        
        # Medium security risks or cultural concerns
        if (security_analysis.risk_level == SecurityRiskLevel.MEDIUM or
            cultural_analysis.requires_review):
            return CommandDecision.ASK_USER, 0.5, ["Review required due to security or cultural concerns"]
        
        # Default to asking user if no clear rules
        return CommandDecision.ASK_USER, 0.3, ["No specific rules found - user decision required"]
    
    def _get_cached_result(self, cache_key: str) -> Optional[ValidationResult]:
        """Get cached validation result if valid"""
        if cache_key in self.validation_cache:
            result, timestamp = self.validation_cache[cache_key]
            if datetime.now() - timestamp < timedelta(seconds=self.config.cache_ttl_seconds):
                result.cached_result = True
                return result
            else:
                # Remove expired entry
                del self.validation_cache[cache_key]
        return None
    
    def _cache_result(self, cache_key: str, result: ValidationResult):
        """Cache validation result"""
        # Clean cache if too large
        if len(self.validation_cache) >= self.config.max_cache_size:
            # Remove oldest entries
            sorted_items = sorted(self.validation_cache.items(), key=lambda x: x[1][1])
            for key, _ in sorted_items[:self.config.max_cache_size // 2]:
                del self.validation_cache[key]
        
        self.validation_cache[cache_key] = (result, datetime.now())
    
    def _update_metrics(self, result: ValidationResult):
        """Update performance metrics"""
        self.metrics['total_validations'] += 1
        
        # Update average validation time
        total = self.metrics['total_validations']
        current_avg = self.metrics['average_validation_time']
        self.metrics['average_validation_time'] = (
            (current_avg * (total - 1) + result.validation_time_ms) / total
        )
        
        # Update decision counters
        if result.decision == CommandDecision.AUTO_DENY:
            self.metrics['security_blocks'] += 1
        elif result.decision == CommandDecision.CULTURAL_REVIEW:
            self.metrics['cultural_reviews'] += 1
        elif result.decision == CommandDecision.PROFESSIONAL_APPROVE:
            self.metrics['professional_approvals'] += 1
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get validation metrics"""
        return self.metrics.copy()
    
    def clear_cache(self):
        """Clear validation cache"""
        self.validation_cache.clear()
        logging.info("Validation cache cleared")


# Example usage and testing
if __name__ == "__main__":
    async def main():
        # Create validation configuration
        config = ValidationConfig(
            allowed_commands=["git", "npm", "python", "ls", "cat"],
            denied_commands=["rm -rf", "sudo rm", "format"],
            cultural_validation_enabled=True,
            islamic_compliance_required=True
        )
        
        # Initialize validator
        validator = IraqiCommandValidator(config)
        
        # Test commands
        test_commands = [
            "git status",
            "rm -rf /",
            "python script.py --help",
            "صلاة الفجر في المسجد",  # Arabic: Fajr prayer in mosque
            "sudo delete important_file",
            "ls -la documents/"
        ]
        
        print("Iraqi Command Validation Results:")
        print("=" * 50)
        
        for command in test_commands:
            result = await validator.validate_command(command, ProfessionalDomain.GENERAL)
            
            print(f"\nCommand: {command}")
            print(f"Decision: {result.decision.value}")
            print(f"Confidence: {result.confidence_score:.2f}")
            print(f"Security Risk: {result.security_analysis.risk_level.value}")
            print(f"Cultural Score: {result.cultural_analysis.cultural_score:.2f}")
            print(f"Validation Time: {result.validation_time_ms:.1f}ms")
            
            if result.decision_rationale:
                print(f"Rationale: {'; '.join(result.decision_rationale)}")
        
        # Show metrics
        print(f"\nValidation Metrics:")
        metrics = validator.get_metrics()
        for key, value in metrics.items():
            print(f"{key}: {value}")
    
    # Run example
    asyncio.run(main())