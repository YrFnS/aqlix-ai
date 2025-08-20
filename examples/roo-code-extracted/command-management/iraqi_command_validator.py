"""
Iraqi Command Validator - Advanced Command Validation with Cultural Intelligence

Extracted from Roo-Code validation patterns and enhanced with Iraqi cultural validation,
Arabic language processing, and professional domain compliance.

Key enhancements:
- Multi-level cultural validation (Basic, Standard, Professional, Strict)
- Arabic text analysis and RTL validation
- Iraqi professional domain compliance checking
- Islamic principle compliance validation
- Real-time validation with performance optimization
"""

from dataclasses import dataclass
from enum import Enum
from typing import Dict, Any, List, Optional, Union, Set, Tuple
import asyncio
import json
import logging
import re
from datetime import datetime
import unicodedata

class IraqiProfessionalDomain(Enum):
    LEGAL = "legal"
    MEDICAL = "medical"
    EDUCATIONAL = "educational"
    GOVERNMENT = "government"
    BUSINESS = "business"
    TECHNICAL = "technical"
    GENERAL = "general"

class CulturalValidationLevel(Enum):
    BASIC = "basic"
    STANDARD = "standard"
    PROFESSIONAL = "professional"
    STRICT = "strict"

class ValidationSeverity(Enum):
    INFO = "info"
    WARNING = "warning"
    ERROR = "error"
    CRITICAL = "critical"

class ArabicDialect(Enum):
    STANDARD = "standard"
    IRAQI_BAGHDADI = "iraqi_baghdadi"
    IRAQI_BASRAWI = "iraqi_basrawi"
    IRAQI_MOSLAWI = "iraqi_moslawi"
    KURDISH_ARABIC = "kurdish_arabic"
    MIXED = "mixed"

@dataclass
class ValidationIssue:
    """Individual validation issue with cultural context"""
    severity: ValidationSeverity
    category: str
    message: str
    message_arabic: str
    location: Optional[str] = None
    suggestion: Optional[str] = None
    suggestion_arabic: Optional[str] = None
    cultural_context: Optional[Dict[str, Any]] = None

@dataclass
class ValidationResult:
    """Comprehensive validation result with cultural insights"""
    is_valid: bool
    validation_level: CulturalValidationLevel
    compliance_score: float
    islamic_compliance: bool
    political_neutrality: bool
    professional_appropriateness: bool
    issues: List[ValidationIssue]
    arabic_analysis: Optional[Dict[str, Any]] = None
    processing_time: float = 0.0
    recommendations: List[str] = None

class IraqiCommandValidator:
    """Advanced command validator with Iraqi cultural intelligence"""
    
    def __init__(self, validation_level: CulturalValidationLevel = CulturalValidationLevel.STANDARD):
        self.validation_level = validation_level
        self.cultural_patterns = self._load_cultural_patterns()
        self.professional_terminologies = self._load_professional_terminologies()
        self.islamic_compliance_rules = self._load_islamic_compliance_rules()
        self.arabic_linguistic_rules = self._load_arabic_linguistic_rules()
        self._setup_logging()
        
    def _setup_logging(self):
        """Setup culturally appropriate logging"""
        self.logger = logging.getLogger("iraqi_command_validator")
        self.logger.setLevel(logging.INFO)
    
    async def validate_command(self, command_data: Dict[str, Any], 
                             domain: IraqiProfessionalDomain = IraqiProfessionalDomain.GENERAL) -> ValidationResult:
        """Comprehensive command validation with cultural intelligence"""
        start_time = datetime.now()
        issues = []
        
        try:
            # Core validation checks
            issues.extend(await self._validate_basic_structure(command_data))
            issues.extend(await self._validate_cultural_appropriateness(command_data))
            issues.extend(await self._validate_islamic_compliance(command_data))
            issues.extend(await self._validate_political_neutrality(command_data))
            issues.extend(await self._validate_professional_domain(command_data, domain))
            
            # Arabic-specific validation
            arabic_analysis = await self._analyze_arabic_content(command_data)
            if arabic_analysis['has_arabic']:
                issues.extend(await self._validate_arabic_language(command_data, arabic_analysis))
            
            # Calculate compliance scores
            compliance_metrics = self._calculate_compliance_scores(issues)
            
            # Generate recommendations
            recommendations = self._generate_recommendations(issues, domain)
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return ValidationResult(
                is_valid=compliance_metrics['overall_score'] >= self._get_minimum_score(),
                validation_level=self.validation_level,
                compliance_score=compliance_metrics['overall_score'],
                islamic_compliance=compliance_metrics['islamic_score'] >= 0.8,
                political_neutrality=compliance_metrics['political_score'] >= 0.9,
                professional_appropriateness=compliance_metrics['professional_score'] >= 0.7,
                issues=issues,
                arabic_analysis=arabic_analysis,
                processing_time=processing_time,
                recommendations=recommendations
            )
            
        except Exception as e:
            self.logger.error(f"Validation failed: {str(e)}")
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return ValidationResult(
                is_valid=False,
                validation_level=self.validation_level,
                compliance_score=0.0,
                islamic_compliance=False,
                political_neutrality=False,
                professional_appropriateness=False,
                issues=[ValidationIssue(
                    severity=ValidationSeverity.CRITICAL,
                    category="system_error",
                    message=f"Validation system error: {str(e)}",
                    message_arabic=f".7# AJ F8'E 'D*-BB: {str(e)}"
                )],
                processing_time=processing_time,
                recommendations=["Contact system administrator for validation system issues"]
            )
    
    async def validate_batch(self, commands: List[Dict[str, Any]], 
                           domain: IraqiProfessionalDomain = IraqiProfessionalDomain.GENERAL) -> List[ValidationResult]:
        """Validate multiple commands with optimized batch processing"""
        results = []
        
        # Process commands in parallel for better performance
        tasks = []
        for command_data in commands:
            task = asyncio.create_task(self.validate_command(command_data, domain))
            tasks.append(task)
        
        # Wait for all validations to complete
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # Handle any exceptions in batch processing
        processed_results = []
        for i, result in enumerate(results):
            if isinstance(result, Exception):
                processed_results.append(ValidationResult(
                    is_valid=False,
                    validation_level=self.validation_level,
                    compliance_score=0.0,
                    islamic_compliance=False,
                    political_neutrality=False,
                    professional_appropriateness=False,
                    issues=[ValidationIssue(
                        severity=ValidationSeverity.CRITICAL,
                        category="batch_error",
                        message=f"Batch validation error for command {i}: {str(result)}",
                        message_arabic=f".7# AJ 'D*-BB 'DE,E9 DD#E1 {i}: {str(result)}"
                    )],
                    processing_time=0.0
                ))
            else:
                processed_results.append(result)
        
        return processed_results
    
    async def _validate_basic_structure(self, command_data: Dict[str, Any]) -> List[ValidationIssue]:
        """Validate basic command structure"""
        issues = []
        
        required_fields = ['name', 'description', 'parameters']
        
        for field in required_fields:
            if field not in command_data:
                issues.append(ValidationIssue(
                    severity=ValidationSeverity.ERROR,
                    category="structure",
                    message=f"Missing required field: {field}",
                    message_arabic=f"-BD E7DH( EABH/: {field}",
                    suggestion="Add all required fields to command structure",
                    suggestion_arabic="#6A ,EJ9 'D-BHD 'DE7DH() %DI GJCD 'D#E1"
                ))
        
        # Validate field types
        if 'parameters' in command_data and not isinstance(command_data['parameters'], dict):
            issues.append(ValidationIssue(
                severity=ValidationSeverity.ERROR,
                category="structure",
                message="Parameters field must be a dictionary",
                message_arabic="-BD 'DE9'ED'* J,( #F JCHF B'EH3'K",
                location="parameters"
            ))
        
        return issues
    
    async def _validate_cultural_appropriateness(self, command_data: Dict[str, Any]) -> List[ValidationIssue]:
        """Validate cultural appropriateness of command content"""
        issues = []
        
        # Check command name and description
        text_content = [
            command_data.get('name', ''),
            command_data.get('description', ''),
            json.dumps(command_data.get('parameters', {}), default=str)
        ]
        
        combined_text = ' '.join(text_content).lower()
        
        # Check for culturally inappropriate content
        inappropriate_patterns = self.cultural_patterns.get('inappropriate_terms', [])
        
        for pattern in inappropriate_patterns:
            if re.search(pattern, combined_text, re.IGNORECASE):
                severity = ValidationSeverity.ERROR if self.validation_level == CulturalValidationLevel.STRICT else ValidationSeverity.WARNING
                issues.append(ValidationIssue(
                    severity=severity,
                    category="cultural_appropriateness",
                    message=f"Culturally inappropriate content detected: {pattern}",
                    message_arabic=f"*E 'C*4'A E-*HI :J1 EF'3( +B'AJ'K: {pattern}",
                    suggestion="Remove or replace culturally inappropriate content",
                    suggestion_arabic="BE (%2'D) #H '3*(/'D 'DE-*HI :J1 'DEF'3( +B'AJ'K"
                ))
        
        # Check for positive cultural elements
        positive_patterns = self.cultural_patterns.get('positive_terms', [])
        positive_matches = sum(1 for pattern in positive_patterns if re.search(pattern, combined_text, re.IGNORECASE))
        
        if positive_matches > 0:
            issues.append(ValidationIssue(
                severity=ValidationSeverity.INFO,
                category="cultural_appropriateness",
                message=f"Command contains {positive_matches} culturally positive elements",
                message_arabic=f"J-*HJ 'D#E1 9DI {positive_matches} 9F'51 %J,'(J) +B'AJ'K"
            ))
        
        return issues
    
    async def _validate_islamic_compliance(self, command_data: Dict[str, Any]) -> List[ValidationIssue]:
        """Validate Islamic principle compliance"""
        issues = []
        
        text_content = json.dumps(command_data, default=str).lower()
        
        # Check for Islamic compliance issues
        for rule_name, rule_data in self.islamic_compliance_rules.items():
            patterns = rule_data.get('prohibited_patterns', [])
            
            for pattern in patterns:
                if re.search(pattern, text_content, re.IGNORECASE):
                    severity_map = {
                        'critical': ValidationSeverity.CRITICAL,
                        'error': ValidationSeverity.ERROR,
                        'warning': ValidationSeverity.WARNING
                    }
                    
                    severity = severity_map.get(rule_data.get('severity', 'warning'), ValidationSeverity.WARNING)
                    
                    issues.append(ValidationIssue(
                        severity=severity,
                        category="islamic_compliance",
                        message=f"Islamic compliance issue ({rule_name}): {rule_data.get('message', 'Compliance violation')}",
                        message_arabic=f"E3#D) 'E*+'D %3D'EJ ({rule_name}): {rule_data.get('message_arabic', ''F*G'C 'D'E*+'D')}",
                        suggestion=rule_data.get('suggestion', 'Review content for Islamic compliance'),
                        suggestion_arabic=rule_data.get('suggestion_arabic', '1',9 'DE-*HI DD'E*+'D 'D%3D'EJ'),
                        cultural_context={'islamic_rule': rule_name}
                    ))
        
        return issues
    
    async def _validate_political_neutrality(self, command_data: Dict[str, Any]) -> List[ValidationIssue]:
        """Validate political neutrality"""
        issues = []
        
        text_content = json.dumps(command_data, default=str).lower()
        
        # Check for politically sensitive content
        political_patterns = [
            r'\b(sectarian|7'&AJ)\b',
            r'\b(political party|-2( 3J'3J)\b',
            r'\b(ethnic conflict|51'9 91BJ)\b',
            r'\b(religious division|'FB3'E /JFJ)\b'
        ]
        
        for pattern in political_patterns:
            if re.search(pattern, text_content, re.IGNORECASE):
                issues.append(ValidationIssue(
                    severity=ValidationSeverity.WARNING,
                    category="political_neutrality",
                    message=f"Potentially sensitive political content: {pattern}",
                    message_arabic=f"E-*HI 3J'3J -3'3 E-*ED: {pattern}",
                    suggestion="Ensure content maintains political neutrality",
                    suggestion_arabic="*#C/ EF #F 'DE-*HI J-'A8 9DI 'D-J'/ 'D3J'3J"
                ))
        
        return issues
    
    async def _validate_professional_domain(self, command_data: Dict[str, Any], 
                                          domain: IraqiProfessionalDomain) -> List[ValidationIssue]:
        """Validate professional domain-specific requirements"""
        issues = []
        
        domain_rules = self.professional_terminologies.get(domain.value, {})
        
        if not domain_rules:
            return issues
        
        text_content = json.dumps(command_data, default=str).lower()
        
        # Check required terminology for professional domains
        required_terms = domain_rules.get('required_patterns', [])
        missing_terms = []
        
        for term_pattern in required_terms:
            if not re.search(term_pattern, text_content, re.IGNORECASE):
                missing_terms.append(term_pattern)
        
        if missing_terms and domain in [IraqiProfessionalDomain.LEGAL, IraqiProfessionalDomain.MEDICAL]:
            issues.append(ValidationIssue(
                severity=ValidationSeverity.WARNING,
                category="professional_domain",
                message=f"Missing professional terminology for {domain.value} domain",
                message_arabic=f"E57D-'* EGFJ) EABH/) DE,'D {domain.value}",
                suggestion=f"Add appropriate {domain.value} terminology",
                suggestion_arabic=f"#6A 'DE57D-'* 'DEGFJ) 'DEF'3() DE,'D {domain.value}",
                cultural_context={'domain': domain.value, 'missing_terms': missing_terms}
            ))
        
        # Check for prohibited terms in professional context
        prohibited_terms = domain_rules.get('prohibited_patterns', [])
        
        for pattern in prohibited_terms:
            if re.search(pattern, text_content, re.IGNORECASE):
                issues.append(ValidationIssue(
                    severity=ValidationSeverity.ERROR,
                    category="professional_domain",
                    message=f"Prohibited term for {domain.value} domain: {pattern}",
                    message_arabic=f"E57D- E-8H1 DE,'D {domain.value}: {pattern}",
                    suggestion=f"Remove prohibited terminology for {domain.value} context",
                    suggestion_arabic=f"BE (%2'D) 'DE57D-'* 'DE-8H1) D3J'B {domain.value}"
                ))
        
        return issues
    
    async def _analyze_arabic_content(self, command_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze Arabic content in command data"""
        text_content = json.dumps(command_data, default=str)
        
        arabic_chars = [char for char in text_content if self._is_arabic_char(char)]
        total_chars = len([char for char in text_content if char.isalpha()])
        
        has_arabic = len(arabic_chars) > 0
        arabic_percentage = (len(arabic_chars) / max(total_chars, 1)) * 100
        
        analysis = {
            'has_arabic': has_arabic,
            'arabic_char_count': len(arabic_chars),
            'total_char_count': total_chars,
            'arabic_percentage': arabic_percentage,
            'dialect': self._detect_dialect(text_content) if has_arabic else None,
            'rtl_compliance': self._check_rtl_compliance(text_content) if has_arabic else True,
            'mixed_content': self._detect_mixed_content(text_content)
        }
        
        return analysis
    
    async def _validate_arabic_language(self, command_data: Dict[str, Any], 
                                      arabic_analysis: Dict[str, Any]) -> List[ValidationIssue]:
        """Validate Arabic language usage"""
        issues = []
        
        # Check RTL compliance
        if not arabic_analysis.get('rtl_compliance', True):
            issues.append(ValidationIssue(
                severity=ValidationSeverity.WARNING,
                category="arabic_language",
                message="Arabic text may not display correctly in RTL layout",
                message_arabic="B/ D' J8G1 'DF5 'D91(J (4CD 5-J- AJ 'D*.7J7 EF 'DJEJF %DI 'DJ3'1",
                suggestion="Ensure proper RTL formatting for Arabic content",
                suggestion_arabic="*#C/ EF 'D*F3JB 'D5-J- EF 'DJEJF %DI 'DJ3'1 DDE-*HI 'D91(J"
            ))
        
        # Check dialect appropriateness
        detected_dialect = arabic_analysis.get('dialect')
        if detected_dialect and detected_dialect != ArabicDialect.STANDARD:
            severity = ValidationSeverity.INFO if self.validation_level == CulturalValidationLevel.BASIC else ValidationSeverity.WARNING
            
            issues.append(ValidationIssue(
                severity=severity,
                category="arabic_language",
                message=f"Detected Arabic dialect: {detected_dialect.value}",
                message_arabic=f"*E 'C*4'A DG,) 91(J): {detected_dialect.value}",
                suggestion="Consider using standard Arabic for broader compatibility",
                suggestion_arabic="AC1 AJ '3*./'E 'D91(J) 'DA5-I DD-5HD 9DI *H'AB #H39",
                cultural_context={'detected_dialect': detected_dialect.value}
            ))
        
        # Check mixed content handling
        if arabic_analysis.get('mixed_content', False):
            issues.append(ValidationIssue(
                severity=ValidationSeverity.INFO,
                category="arabic_language",
                message="Mixed Arabic-English content detected",
                message_arabic="*E 'C*4'A E-*HI E.*D7 91(J-%F,DJ2J",
                suggestion="Ensure proper formatting for mixed-language content",
                suggestion_arabic="*#C/ EF 'D*F3JB 'D5-J- DDE-*HI E*9// 'DD:'*"
            ))
        
        return issues
    
    def _calculate_compliance_scores(self, issues: List[ValidationIssue]) -> Dict[str, float]:
        """Calculate compliance scores based on issues"""
        
        # Initialize scores
        scores = {
            'overall_score': 1.0,
            'islamic_score': 1.0,
            'political_score': 1.0,
            'professional_score': 1.0,
            'cultural_score': 1.0
        }
        
        # Weight penalties by severity
        severity_weights = {
            ValidationSeverity.INFO: 0.0,
            ValidationSeverity.WARNING: 0.1,
            ValidationSeverity.ERROR: 0.3,
            ValidationSeverity.CRITICAL: 0.5
        }
        
        # Calculate penalties by category
        category_penalties = {
            'islamic_compliance': 0.0,
            'political_neutrality': 0.0,
            'professional_domain': 0.0,
            'cultural_appropriateness': 0.0
        }
        
        for issue in issues:
            penalty = severity_weights.get(issue.severity, 0.1)
            category_penalties[issue.category] = category_penalties.get(issue.category, 0.0) + penalty
        
        # Apply penalties to scores
        scores['islamic_score'] = max(0.0, 1.0 - category_penalties.get('islamic_compliance', 0.0))
        scores['political_score'] = max(0.0, 1.0 - category_penalties.get('political_neutrality', 0.0))
        scores['professional_score'] = max(0.0, 1.0 - category_penalties.get('professional_domain', 0.0))
        scores['cultural_score'] = max(0.0, 1.0 - category_penalties.get('cultural_appropriateness', 0.0))
        
        # Calculate overall score as weighted average
        scores['overall_score'] = (
            scores['islamic_score'] * 0.3 +
            scores['political_score'] * 0.2 +
            scores['professional_score'] * 0.3 +
            scores['cultural_score'] * 0.2
        )
        
        return scores
    
    def _generate_recommendations(self, issues: List[ValidationIssue], 
                                domain: IraqiProfessionalDomain) -> List[str]:
        """Generate actionable recommendations based on validation issues"""
        recommendations = []
        
        # Group issues by category
        issue_categories = {}
        for issue in issues:
            if issue.category not in issue_categories:
                issue_categories[issue.category] = []
            issue_categories[issue.category].append(issue)
        
        # Generate recommendations by category
        for category, category_issues in issue_categories.items():
            critical_issues = [i for i in category_issues if i.severity == ValidationSeverity.CRITICAL]
            error_issues = [i for i in category_issues if i.severity == ValidationSeverity.ERROR]
            
            if critical_issues:
                recommendations.append(f"URGENT: Address {len(critical_issues)} critical {category} issues immediately")
            
            if error_issues:
                recommendations.append(f"High Priority: Fix {len(error_issues)} {category} errors before deployment")
        
        # Domain-specific recommendations
        if domain == IraqiProfessionalDomain.LEGAL:
            recommendations.append("Ensure all legal content complies with Iraqi law and Islamic jurisprudence")
        elif domain == IraqiProfessionalDomain.MEDICAL:
            recommendations.append("Verify medical content follows Iraqi healthcare standards and Islamic medical ethics")
        
        # General recommendations
        if not recommendations:
            recommendations.append("Command validation successful - ready for execution")
        
        return recommendations
    
    def _get_minimum_score(self) -> float:
        """Get minimum compliance score based on validation level"""
        score_thresholds = {
            CulturalValidationLevel.BASIC: 0.5,
            CulturalValidationLevel.STANDARD: 0.7,
            CulturalValidationLevel.PROFESSIONAL: 0.8,
            CulturalValidationLevel.STRICT: 0.9
        }
        
        return score_thresholds.get(self.validation_level, 0.7)
    
    def _is_arabic_char(self, char: str) -> bool:
        """Check if character is Arabic"""
        return 0x0600 <= ord(char) <= 0x06FF
    
    def _detect_dialect(self, text: str) -> Optional[ArabicDialect]:
        """Detect Arabic dialect in text"""
        
        # Iraqi dialect patterns
        iraqi_patterns = {
            ArabicDialect.IRAQI_BAGHDADI: [r'4DHF', r''CH', r'E'CH', r','F', r'D'F'],
            ArabicDialect.IRAQI_BASRAWI: [r'4HC*', r'HJF', r',J', r'G'J'],
            ArabicDialect.IRAQI_MOSLAWI: [r'/:1J', r'G3G', r'4C/']
        }
        
        for dialect, patterns in iraqi_patterns.items():
            if any(re.search(pattern, text) for pattern in patterns):
                return dialect
        
        return ArabicDialect.STANDARD if self._is_arabic_char(text[0]) else None
    
    def _check_rtl_compliance(self, text: str) -> bool:
        """Check RTL layout compliance"""
        # Simplified RTL check - look for RTL markers or proper Unicode direction
        rtl_markers = ['\u202E', '\u202D', '\u200F', '\u200E']
        has_rtl_markers = any(marker in text for marker in rtl_markers)
        
        # Check if Arabic text is properly formatted
        arabic_sentences = re.findall(r'[^\x00-\x7F]+', text)
        
        return has_rtl_markers or len(arabic_sentences) > 0
    
    def _detect_mixed_content(self, text: str) -> bool:
        """Detect mixed Arabic-English content"""
        has_arabic = any(self._is_arabic_char(char) for char in text)
        has_latin = any(char.isascii() and char.isalpha() for char in text)
        
        return has_arabic and has_latin
    
    def _load_cultural_patterns(self) -> Dict[str, List[str]]:
        """Load cultural validation patterns"""
        return {
            'inappropriate_terms': [
                r'\b(gambling|BE'1)\b',
                r'\b(alcohol|.E1)\b',
                r'\b(inappropriate|:J1 EF'3()\b',
                r'\b(offensive|E3J!)\b'
            ],
            'positive_terms': [
                r'\b(respect|'-*1'E)\b',
                r'\b(family|9'&D))\b',
                r'\b(community|E,*E9)\b',
                r'\b(education|*9DJE)\b'
            ]
        }
    
    def _load_professional_terminologies(self) -> Dict[str, Dict[str, List[str]]]:
        """Load professional domain terminologies"""
        return {
            'legal': {
                'required_patterns': [r'\b(law|B'FHF|legal|B'FHFJ)\b'],
                'prohibited_patterns': [r'\b(illegal|:J1 B'FHFJ)\b']
            },
            'medical': {
                'required_patterns': [r'\b(medical|7(J|health|5-))\b'],
                'prohibited_patterns': [r'\b(harmful|6'1)\b']
            },
            'educational': {
                'required_patterns': [r'\b(education|*9DJE|learning|*9DE)\b'],
                'prohibited_patterns': []
            }
        }
    
    def _load_islamic_compliance_rules(self) -> Dict[str, Dict[str, Any]]:
        """Load Islamic compliance validation rules"""
        return {
            'interest_prohibition': {
                'prohibited_patterns': [r'\b(interest|1('|usury|A'&/))\b'],
                'severity': 'error',
                'message': 'Content may conflict with Islamic finance principles',
                'message_arabic': 'B/ J*9'16 'DE-*HI E9 E('/& 'D*EHJD 'D%3D'EJ',
                'suggestion': 'Use Islamic finance compliant alternatives',
                'suggestion_arabic': ''3*./E (/'&D E*H'AB) E9 'D*EHJD 'D%3D'EJ'
            },
            'general_appropriateness': {
                'prohibited_patterns': [r'\b(haram|-1'E|forbidden|E-1E)\b'],
                'severity': 'warning',
                'message': 'Content may need Islamic compliance review',
                'message_arabic': 'B/ J-*', 'DE-*HI %DI E1',9) 'D'E*+'D 'D%3D'EJ',
                'suggestion': 'Review content for Islamic appropriateness',
                'suggestion_arabic': '1',9 'DE-*HI DDEF'3() 'D%3D'EJ)'
            }
        }
    
    def _load_arabic_linguistic_rules(self) -> Dict[str, Any]:
        """Load Arabic linguistic validation rules"""
        return {
            'rtl_requirements': {
                'require_rtl_markers': True,
                'support_mixed_content': True
            },
            'dialect_preferences': {
                'prefer_standard': True,
                'allow_iraqi_dialects': True
            }
        }

# Example usage and testing
async def main():
    """Example usage of Iraqi Command Validator"""
    validator = IraqiCommandValidator(validation_level=CulturalValidationLevel.PROFESSIONAL)
    
    # Test command with Arabic content
    test_command = {
        'name': 'translate_legal_document',
        'description': 'Translate legal document for Iraqi court system',
        'description_arabic': '*1,E) 'DH+JB) 'DB'FHFJ) DF8'E 'DE-'CE 'D91'BJ)',
        'parameters': {
            'source_document': 'Legal contract with Arabic terms 'DH+JB) 'DB'FHFJ)',
            'target_language': 'arabic',
            'domain': 'legal',
            'compliance_required': True
        }
    }
    
    # Validate the command
    result = await validator.validate_command(test_command, IraqiProfessionalDomain.LEGAL)
    
    print(f"Validation Result:")
    print(f"Is Valid: {result.is_valid}")
    print(f"Compliance Score: {result.compliance_score:.2f}")
    print(f"Islamic Compliance: {result.islamic_compliance}")
    print(f"Processing Time: {result.processing_time:.3f}s")
    print(f"Issues Found: {len(result.issues)}")
    
    for issue in result.issues:
        print(f"  - {issue.severity.value}: {issue.message}")
    
    print(f"Recommendations: {result.recommendations}")
    
    # Test batch validation
    batch_commands = [test_command, {
        'name': 'process_medical_record',
        'description': 'Process patient medical record',
        'parameters': {'patient_id': '12345', 'privacy_compliant': True}
    }]
    
    batch_results = await validator.validate_batch(batch_commands, IraqiProfessionalDomain.MEDICAL)
    print(f"\nBatch validation completed: {len(batch_results)} commands processed")

if __name__ == "__main__":
    asyncio.run(main())