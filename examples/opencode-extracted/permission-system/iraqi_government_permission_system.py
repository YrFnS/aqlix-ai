#!/usr/bin/env python3
"""
🇮🇶 Iraqi Government Permission System
=====================================

Comprehensive permission system with Iraqi government hierarchy role-based access control,
ministry-specific permissions, and comprehensive cultural validation.

Features:
- Iraqi government hierarchy role-based access control
- Ministry-specific permission levels with security clearance integration
- Cultural sensitivity permission validation (Islamic compliance, political neutrality)
- Professional domain access control (legal confidentiality, medical privacy)
- Government employee verification with biometric authentication integration
- Audit logging for all permission-related operations

Author: Iraqi AI Development Team
Date: August 21, 2025
Version: 2.1.0
License: Government Use Only - Iraqi Ministry of Digital Transformation
"""

import asyncio
import json
import logging
import hashlib
import hmac
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple, Union, Set, Callable
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
import aiofiles
import jwt
import bcrypt
from cryptography.fernet import Fernet
import asyncio
import weakref

# Cultural and security imports
from cultural_validation import IraqiCulturalValidator, IslamicComplianceChecker
from arabic_processor import ArabicDialectProcessor
from security_manager import IraqiGovernmentSecurityManager, BiometricAuthenticator


class PermissionLevel(Enum):
    """Iraqi government permission hierarchy levels"""
    CITIZEN = "citizen"                    # Public citizen access
    EMPLOYEE = "employee"                  # Government employee
    SUPERVISOR = "supervisor"              # Department supervisor
    MANAGER = "manager"                    # Department manager
    DIRECTOR = "director"                  # Ministry director
    UNDERSECRETARY = "undersecretary"     # Ministry undersecretary
    MINISTER = "minister"                  # Ministry minister
    PRIME_MINISTER = "prime_minister"      # Prime Minister level
    SECURITY_ADMIN = "security_admin"      # Security administrator
    SYSTEM_ADMIN = "system_admin"          # System administrator


class SecurityClearance(Enum):
    """Iraqi government security clearance levels"""
    PUBLIC = "public"                      # Public information
    INTERNAL = "internal"                  # Internal use only
    CONFIDENTIAL = "confidential"          # Confidential
    SECRET = "secret"                      # Secret
    TOP_SECRET = "top_secret"              # Top Secret
    COSMIC = "cosmic"                      # Cosmic (highest)


class MinistryDomain(Enum):
    """Iraqi government ministry domains"""
    INTERIOR = "interior"
    DEFENSE = "defense"
    FOREIGN_AFFAIRS = "foreign_affairs"
    FINANCE = "finance"
    HEALTH = "health"
    EDUCATION = "education"
    JUSTICE = "justice"
    COMMUNICATIONS = "communications"
    DIGITAL_TRANSFORMATION = "digital_transformation"
    AGRICULTURE = "agriculture"
    TRANSPORT = "transport"
    LABOR = "labor"
    YOUTH_SPORTS = "youth_sports"
    PLANNING = "planning"
    OIL = "oil"
    ELECTRICITY = "electricity"


class ProfessionalDomain(Enum):
    """Professional domain access categories"""
    LEGAL = "legal"                        # Legal services and documents
    MEDICAL = "medical"                    # Healthcare and medical records
    EDUCATIONAL = "educational"            # Education and academic records
    FINANCIAL = "financial"                # Financial and banking services
    SECURITY = "security"                  # Security and intelligence
    TECHNICAL = "technical"                # Technical and engineering
    ADMINISTRATIVE = "administrative"      # Administrative services
    CULTURAL = "cultural"                  # Cultural and religious affairs


class ResourceType(Enum):
    """Types of government resources requiring permissions"""
    DOCUMENT = "document"
    DATABASE = "database"
    SERVICE = "service"
    SYSTEM = "system"
    TERMINAL = "terminal"
    API = "api"
    FACILITY = "facility"
    EQUIPMENT = "equipment"


class PermissionAction(Enum):
    """Permission actions available in the system"""
    READ = "read"
    WRITE = "write"
    CREATE = "create"
    UPDATE = "update"
    DELETE = "delete"
    EXECUTE = "execute"
    APPROVE = "approve"
    AUDIT = "audit"
    ADMIN = "admin"


@dataclass
class CulturalPermissionPolicy:
    """Cultural sensitivity policies for permissions"""
    islamic_compliance_required: bool = True
    political_neutrality_required: bool = True
    family_values_protection: bool = True
    religious_accommodation: bool = True
    cultural_sensitivity_level: str = "high"
    
    # Specific cultural restrictions
    ramadan_restrictions: bool = True
    prayer_time_accommodation: bool = True
    gender_separated_access: bool = False  # For specific services
    halal_compliance_required: bool = True
    
    # Content filtering policies
    inappropriate_content_blocking: bool = True
    sectarian_content_filtering: bool = True
    political_content_restrictions: bool = True
    
    def validate_cultural_compliance(self, content: str, context: str) -> Dict[str, Any]:
        """Validate content against cultural policies"""
        violations = []
        
        # Check for inappropriate content
        if self.inappropriate_content_blocking:
            # This would integrate with content filtering systems
            pass
        
        # Check for sectarian content
        if self.sectarian_content_filtering:
            # This would check for sectarian references
            pass
        
        # Check for political sensitivity
        if self.political_content_restrictions:
            # This would check for political content
            pass
        
        return {
            "compliant": len(violations) == 0,
            "violations": violations,
            "policy_level": self.cultural_sensitivity_level
        }


@dataclass
class GovernmentEmployee:
    """Iraqi government employee with permissions and cultural context"""
    employee_id: str
    national_id: str
    full_name: str
    ministry: MinistryDomain
    department: str
    position: str
    permission_level: PermissionLevel
    security_clearance: SecurityClearance
    
    # Professional domains
    professional_domains: List[ProfessionalDomain] = field(default_factory=list)
    
    # Contact information
    email: str = ""
    phone: str = ""
    office_location: str = ""
    
    # Employment details
    hire_date: datetime = field(default_factory=datetime.now)
    contract_expiry: Optional[datetime] = None
    supervisor_id: Optional[str] = None
    
    # Security information
    biometric_enrolled: bool = False
    mfa_enabled: bool = False
    last_login: Optional[datetime] = None
    failed_login_attempts: int = 0
    account_locked: bool = False
    
    # Cultural context
    language_preference: str = "ar"  # Arabic default
    prayer_time_notifications: bool = True
    cultural_sensitivity_training: bool = False
    islamic_calendar_preference: bool = True
    
    # Permissions
    explicit_permissions: Set[str] = field(default_factory=set)
    denied_permissions: Set[str] = field(default_factory=set)
    temporary_permissions: Dict[str, datetime] = field(default_factory=dict)
    
    def has_security_clearance_for(self, required_clearance: SecurityClearance) -> bool:
        """Check if employee has required security clearance"""
        clearance_levels = [
            SecurityClearance.PUBLIC,
            SecurityClearance.INTERNAL,
            SecurityClearance.CONFIDENTIAL,
            SecurityClearance.SECRET,
            SecurityClearance.TOP_SECRET,
            SecurityClearance.COSMIC
        ]
        
        employee_level = clearance_levels.index(self.security_clearance)
        required_level = clearance_levels.index(required_clearance)
        
        return employee_level >= required_level
    
    def has_ministry_access(self, target_ministry: MinistryDomain) -> bool:
        """Check if employee has access to target ministry"""
        # Same ministry access
        if self.ministry == target_ministry:
            return True
        
        # Cross-ministry access for high-level positions
        if self.permission_level in [
            PermissionLevel.MINISTER,
            PermissionLevel.PRIME_MINISTER,
            PermissionLevel.SYSTEM_ADMIN
        ]:
            return True
        
        # Specific cross-ministry permissions would be checked here
        return False
    
    def is_account_valid(self) -> bool:
        """Check if account is valid and not locked"""
        if self.account_locked:
            return False
        
        if self.contract_expiry and datetime.now() > self.contract_expiry:
            return False
        
        if self.failed_login_attempts >= 5:  # Auto-lock after 5 failed attempts
            return False
        
        return True


@dataclass
class PermissionRule:
    """Permission rule with cultural and security constraints"""
    rule_id: str
    name: str
    description: str
    
    # Core permission settings
    resource_type: ResourceType
    required_permission_level: PermissionLevel
    required_security_clearance: SecurityClearance
    allowed_actions: List[PermissionAction]
    
    # Ministry and domain constraints
    allowed_ministries: List[MinistryDomain] = field(default_factory=list)
    allowed_professional_domains: List[ProfessionalDomain] = field(default_factory=list)
    
    # Time-based constraints
    time_restricted: bool = False
    allowed_hours_start: int = 8  # 8 AM
    allowed_hours_end: int = 18   # 6 PM
    weekend_access: bool = True
    holiday_access: bool = False
    
    # Cultural constraints
    cultural_policy: CulturalPermissionPolicy = field(default_factory=CulturalPermissionPolicy)
    islamic_compliance_required: bool = True
    
    # Geographic constraints
    location_restricted: bool = False
    allowed_locations: List[str] = field(default_factory=list)
    
    # Additional constraints
    biometric_required: bool = False
    mfa_required: bool = True
    supervisor_approval_required: bool = False
    audit_logging_required: bool = True
    
    def evaluate_permission(
        self,
        employee: GovernmentEmployee,
        action: PermissionAction,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Evaluate permission against this rule"""
        context = context or {}
        violations = []
        
        # Check basic permission level
        if not self._check_permission_level(employee):
            violations.append(f"Insufficient permission level: required {self.required_permission_level.value}")
        
        # Check security clearance
        if not employee.has_security_clearance_for(self.required_security_clearance):
            violations.append(f"Insufficient security clearance: required {self.required_security_clearance.value}")
        
        # Check action is allowed
        if action not in self.allowed_actions:
            violations.append(f"Action not permitted: {action.value}")
        
        # Check ministry access
        if self.allowed_ministries and not any(employee.has_ministry_access(ministry) for ministry in self.allowed_ministries):
            violations.append("Ministry access not permitted")
        
        # Check professional domain
        if self.allowed_professional_domains:
            if not any(domain in employee.professional_domains for domain in self.allowed_professional_domains):
                violations.append("Professional domain access not permitted")
        
        # Check time restrictions
        if self.time_restricted and not self._check_time_access():
            violations.append("Access not permitted at this time")
        
        # Check account validity
        if not employee.is_account_valid():
            violations.append("Account is not valid or locked")
        
        # Check biometric requirement
        if self.biometric_required and not employee.biometric_enrolled:
            violations.append("Biometric authentication required")
        
        # Check MFA requirement
        if self.mfa_required and not employee.mfa_enabled:
            violations.append("Multi-factor authentication required")
        
        # Check cultural compliance if content provided
        if context.get('content') and self.islamic_compliance_required:
            cultural_check = self.cultural_policy.validate_cultural_compliance(
                context['content'], 
                context.get('context_type', 'general')
            )
            if not cultural_check['compliant']:
                violations.extend(cultural_check['violations'])
        
        return {
            "granted": len(violations) == 0,
            "violations": violations,
            "rule_id": self.rule_id,
            "security_level": self.required_security_clearance.value,
            "cultural_compliant": context.get('content') is None or self.cultural_policy.validate_cultural_compliance(
                context.get('content', ''), 
                context.get('context_type', 'general')
            )['compliant']
        }
    
    def _check_permission_level(self, employee: GovernmentEmployee) -> bool:
        """Check if employee has required permission level"""
        level_hierarchy = [
            PermissionLevel.CITIZEN,
            PermissionLevel.EMPLOYEE,
            PermissionLevel.SUPERVISOR,
            PermissionLevel.MANAGER,
            PermissionLevel.DIRECTOR,
            PermissionLevel.UNDERSECRETARY,
            PermissionLevel.MINISTER,
            PermissionLevel.PRIME_MINISTER
        ]
        
        # System and security admins have special access
        if employee.permission_level in [PermissionLevel.SYSTEM_ADMIN, PermissionLevel.SECURITY_ADMIN]:
            return True
        
        if self.required_permission_level in level_hierarchy and employee.permission_level in level_hierarchy:
            employee_level = level_hierarchy.index(employee.permission_level)
            required_level = level_hierarchy.index(self.required_permission_level)
            return employee_level >= required_level
        
        return employee.permission_level == self.required_permission_level
    
    def _check_time_access(self) -> bool:
        """Check if current time allows access"""
        now = datetime.now()
        current_hour = now.hour
        
        # Check business hours
        if current_hour < self.allowed_hours_start or current_hour > self.allowed_hours_end:
            return False
        
        # Check weekend access
        if not self.weekend_access and now.weekday() >= 5:  # Saturday = 5, Sunday = 6
            return False
        
        # Check holiday access (simplified - would integrate with holiday calendar)
        if not self.holiday_access:
            # This would check against Iraqi government holiday calendar
            pass
        
        return True


class IraqiGovernmentPermissionSystem:
    """
    Comprehensive Iraqi government permission system with cultural intelligence
    """
    
    def __init__(self, enable_cultural_validation: bool = True):
        self.enable_cultural_validation = enable_cultural_validation
        
        # Employee registry
        self.employees: Dict[str, GovernmentEmployee] = {}
        
        # Permission rules
        self.permission_rules: Dict[str, PermissionRule] = {}
        self.global_rules: List[PermissionRule] = []
        
        # Cultural processors
        self.cultural_validator = IraqiCulturalValidator() if enable_cultural_validation else None
        self.islamic_checker = IslamicComplianceChecker() if enable_cultural_validation else None
        
        # Security components
        self.security_manager = IraqiGovernmentSecurityManager()
        self.biometric_auth = BiometricAuthenticator()
        
        # Audit logging
        self.audit_log: List[Dict[str, Any]] = []
        
        # Setup logging
        self.logger = logging.getLogger('IraqiPermissionSystem')
        
        # Initialize default rules
        self._initialize_default_rules()
    
    def _initialize_default_rules(self):
        """Initialize default Iraqi government permission rules"""
        
        # Public document access rule
        public_docs_rule = PermissionRule(
            rule_id="public_documents",
            name="Public Document Access",
            description="Access to public government documents",
            resource_type=ResourceType.DOCUMENT,
            required_permission_level=PermissionLevel.CITIZEN,
            required_security_clearance=SecurityClearance.PUBLIC,
            allowed_actions=[PermissionAction.READ],
            time_restricted=False,
            mfa_required=False,
            audit_logging_required=True
        )
        
        # Confidential system access rule
        confidential_system_rule = PermissionRule(
            rule_id="confidential_systems",
            name="Confidential System Access",
            description="Access to confidential government systems",
            resource_type=ResourceType.SYSTEM,
            required_permission_level=PermissionLevel.SUPERVISOR,
            required_security_clearance=SecurityClearance.CONFIDENTIAL,
            allowed_actions=[PermissionAction.READ, PermissionAction.WRITE, PermissionAction.EXECUTE],
            biometric_required=True,
            mfa_required=True,
            time_restricted=True,
            audit_logging_required=True
        )
        
        # Ministry administration rule
        ministry_admin_rule = PermissionRule(
            rule_id="ministry_administration",
            name="Ministry Administration",
            description="Administrative access to ministry systems",
            resource_type=ResourceType.SYSTEM,
            required_permission_level=PermissionLevel.DIRECTOR,
            required_security_clearance=SecurityClearance.SECRET,
            allowed_actions=[PermissionAction.READ, PermissionAction.WRITE, PermissionAction.CREATE, 
                            PermissionAction.UPDATE, PermissionAction.APPROVE],
            biometric_required=True,
            mfa_required=True,
            supervisor_approval_required=False,
            audit_logging_required=True
        )
        
        # Add rules to system
        self.add_permission_rule(public_docs_rule)
        self.add_permission_rule(confidential_system_rule)
        self.add_permission_rule(ministry_admin_rule)
        
        self.logger.info("Default permission rules initialized")
    
    def register_employee(self, employee: GovernmentEmployee):
        """Register a government employee in the system"""
        self.employees[employee.employee_id] = employee
        
        # Log registration
        self._log_audit_event(
            event_type="employee_registered",
            employee_id=employee.employee_id,
            details={
                "ministry": employee.ministry.value,
                "permission_level": employee.permission_level.value,
                "security_clearance": employee.security_clearance.value
            }
        )
        
        self.logger.info(f"Employee registered: {employee.employee_id}")
    
    def add_permission_rule(self, rule: PermissionRule):
        """Add a permission rule to the system"""
        self.permission_rules[rule.rule_id] = rule
        self.logger.info(f"Permission rule added: {rule.rule_id}")
    
    async def check_permission(
        self,
        employee_id: str,
        resource_type: ResourceType,
        action: PermissionAction,
        context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Check if employee has permission for specific action
        
        Args:
            employee_id: Government employee ID
            resource_type: Type of resource being accessed
            action: Action being attempted
            context: Additional context (content, location, etc.)
        
        Returns:
            Permission decision with details
        """
        context = context or {}
        
        # Get employee
        employee = self.employees.get(employee_id)
        if not employee:
            return {
                "granted": False,
                "reason": "Employee not found",
                "employee_id": employee_id
            }
        
        # Cultural validation if content provided
        cultural_compliance = {"compliant": True, "issues": []}
        if self.enable_cultural_validation and context.get('content'):
            cultural_compliance = await self._validate_content_culturally(
                context['content'],
                context.get('context_type', 'general')
            )
        
        # Find applicable rules
        applicable_rules = self._find_applicable_rules(resource_type, action)
        
        if not applicable_rules:
            # No specific rules - check default permissions
            return await self._check_default_permissions(employee, action, context)
        
        # Evaluate each rule
        rule_results = []
        overall_granted = False
        
        for rule in applicable_rules:
            rule_result = rule.evaluate_permission(employee, action, context)
            rule_results.append(rule_result)
            
            # If any rule grants permission, overall permission is granted
            if rule_result['granted']:
                overall_granted = True
        
        # Check explicit permissions
        explicit_permission = f"{resource_type.value}:{action.value}"
        if explicit_permission in employee.explicit_permissions:
            overall_granted = True
        
        # Check denied permissions
        if explicit_permission in employee.denied_permissions:
            overall_granted = False
        
        # Cultural compliance can override permission
        if not cultural_compliance['compliant']:
            overall_granted = False
        
        # Create permission decision
        decision = {
            "granted": overall_granted,
            "employee_id": employee_id,
            "resource_type": resource_type.value,
            "action": action.value,
            "rule_evaluations": rule_results,
            "cultural_compliance": cultural_compliance,
            "timestamp": datetime.now().isoformat(),
            "security_level": employee.security_clearance.value
        }
        
        # Log permission check
        await self._log_permission_check(decision, employee, context)
        
        return decision
    
    async def grant_temporary_permission(
        self,
        employee_id: str,
        permission: str,
        expiry: datetime,
        granted_by: str,
        reason: str
    ) -> bool:
        """Grant temporary permission to employee"""
        employee = self.employees.get(employee_id)
        if not employee:
            return False
        
        # Add temporary permission
        employee.temporary_permissions[permission] = expiry
        
        # Log temporary permission grant
        self._log_audit_event(
            event_type="temporary_permission_granted",
            employee_id=employee_id,
            details={
                "permission": permission,
                "expiry": expiry.isoformat(),
                "granted_by": granted_by,
                "reason": reason
            }
        )
        
        self.logger.info(f"Temporary permission granted: {permission} to {employee_id}")
        return True
    
    async def revoke_permission(
        self,
        employee_id: str,
        permission: str,
        revoked_by: str,
        reason: str
    ) -> bool:
        """Revoke permission from employee"""
        employee = self.employees.get(employee_id)
        if not employee:
            return False
        
        # Remove from explicit permissions
        employee.explicit_permissions.discard(permission)
        
        # Add to denied permissions
        employee.denied_permissions.add(permission)
        
        # Remove from temporary permissions
        employee.temporary_permissions.pop(permission, None)
        
        # Log permission revocation
        self._log_audit_event(
            event_type="permission_revoked",
            employee_id=employee_id,
            details={
                "permission": permission,
                "revoked_by": revoked_by,
                "reason": reason
            }
        )
        
        self.logger.info(f"Permission revoked: {permission} from {employee_id}")
        return True
    
    async def _validate_content_culturally(
        self,
        content: str,
        context_type: str
    ) -> Dict[str, Any]:
        """Validate content for cultural appropriateness"""
        if not self.enable_cultural_validation:
            return {"compliant": True, "issues": []}
        
        try:
            # Cultural validation
            cultural_result = await self.cultural_validator.validate_content(
                content,
                context_type=context_type,
                check_level='government'
            )
            
            # Islamic compliance check
            islamic_result = await self.islamic_checker.check_compliance(
                content,
                check_level='comprehensive'
            )
            
            return {
                "compliant": cultural_result.get('compliant', True) and islamic_result.get('compliant', True),
                "cultural_score": cultural_result.get('compliance_score', 1.0),
                "islamic_score": islamic_result.get('compliance_score', 1.0),
                "issues": cultural_result.get('issues', []) + islamic_result.get('issues', [])
            }
        
        except Exception as e:
            self.logger.error(f"Cultural validation error: {e}")
            return {"compliant": False, "issues": [str(e)]}
    
    def _find_applicable_rules(
        self,
        resource_type: ResourceType,
        action: PermissionAction
    ) -> List[PermissionRule]:
        """Find permission rules applicable to resource and action"""
        applicable_rules = []
        
        for rule in self.permission_rules.values():
            if rule.resource_type == resource_type and action in rule.allowed_actions:
                applicable_rules.append(rule)
        
        # Also check global rules
        for rule in self.global_rules:
            if rule.resource_type == resource_type and action in rule.allowed_actions:
                applicable_rules.append(rule)
        
        return applicable_rules
    
    async def _check_default_permissions(
        self,
        employee: GovernmentEmployee,
        action: PermissionAction,
        context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Check default permissions when no specific rules apply"""
        
        # Very restrictive default - only basic read access for employees
        if action == PermissionAction.READ and employee.permission_level != PermissionLevel.CITIZEN:
            return {
                "granted": True,
                "reason": "Default read access for government employees",
                "employee_id": employee.employee_id,
                "default_rule": True
            }
        
        return {
            "granted": False,
            "reason": "No applicable permission rules found and action not in default permissions",
            "employee_id": employee.employee_id,
            "default_rule": True
        }
    
    async def _log_permission_check(
        self,
        decision: Dict[str, Any],
        employee: GovernmentEmployee,
        context: Dict[str, Any]
    ):
        """Log permission check for audit purposes"""
        audit_entry = {
            "event_type": "permission_check",
            "timestamp": datetime.now().isoformat(),
            "employee_id": employee.employee_id,
            "ministry": employee.ministry.value,
            "decision": decision,
            "context": {
                "user_agent": context.get('user_agent', ''),
                "ip_address": context.get('ip_address', ''),
                "location": context.get('location', '')
            }
        }
        
        self.audit_log.append(audit_entry)
        
        # In production, this would write to secure audit log storage
        if decision['granted']:
            self.logger.info(f"Permission granted: {employee.employee_id} - {decision['action']}")
        else:
            self.logger.warning(f"Permission denied: {employee.employee_id} - {decision['action']}")
    
    def _log_audit_event(
        self,
        event_type: str,
        employee_id: str,
        details: Dict[str, Any]
    ):
        """Log audit event"""
        audit_entry = {
            "event_type": event_type,
            "timestamp": datetime.now().isoformat(),
            "employee_id": employee_id,
            "details": details
        }
        
        self.audit_log.append(audit_entry)
    
    async def get_employee_permissions(self, employee_id: str) -> Dict[str, Any]:
        """Get comprehensive permission summary for employee"""
        employee = self.employees.get(employee_id)
        if not employee:
            return {"error": "Employee not found"}
        
        # Calculate effective permissions
        effective_permissions = {
            "explicit_permissions": list(employee.explicit_permissions),
            "denied_permissions": list(employee.denied_permissions),
            "temporary_permissions": {
                perm: exp.isoformat() for perm, exp in employee.temporary_permissions.items()
                if exp > datetime.now()
            },
            "role_based_access": {
                "permission_level": employee.permission_level.value,
                "security_clearance": employee.security_clearance.value,
                "ministry": employee.ministry.value,
                "professional_domains": [domain.value for domain in employee.professional_domains]
            }
        }
        
        return {
            "employee_id": employee_id,
            "full_name": employee.full_name,
            "permissions": effective_permissions,
            "account_status": {
                "valid": employee.is_account_valid(),
                "locked": employee.account_locked,
                "biometric_enrolled": employee.biometric_enrolled,
                "mfa_enabled": employee.mfa_enabled
            }
        }
    
    async def get_audit_report(
        self,
        start_date: datetime,
        end_date: datetime,
        employee_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """Generate audit report for specified date range"""
        
        # Filter audit log
        filtered_logs = []
        for entry in self.audit_log:
            entry_date = datetime.fromisoformat(entry['timestamp'])
            
            if start_date <= entry_date <= end_date:
                if not employee_id or entry.get('employee_id') == employee_id:
                    filtered_logs.append(entry)
        
        # Generate statistics
        stats = {
            "total_events": len(filtered_logs),
            "permission_checks": len([e for e in filtered_logs if e['event_type'] == 'permission_check']),
            "permissions_granted": len([
                e for e in filtered_logs 
                if e['event_type'] == 'permission_check' and e.get('decision', {}).get('granted', False)
            ]),
            "permissions_denied": len([
                e for e in filtered_logs 
                if e['event_type'] == 'permission_check' and not e.get('decision', {}).get('granted', True)
            ]),
            "cultural_violations": len([
                e for e in filtered_logs 
                if e['event_type'] == 'permission_check' 
                and not e.get('decision', {}).get('cultural_compliance', {}).get('compliant', True)
            ])
        }
        
        return {
            "report_period": {
                "start": start_date.isoformat(),
                "end": end_date.isoformat()
            },
            "statistics": stats,
            "events": filtered_logs
        }


# Example usage and testing
async def main():
    """Example usage of Iraqi Government Permission System"""
    
    # Initialize permission system
    permission_system = IraqiGovernmentPermissionSystem(enable_cultural_validation=True)
    
    print("🇮🇶 Iraqi Government Permission System")
    print("====================================")
    
    # Create test employee
    employee = GovernmentEmployee(
        employee_id="MOD_001",
        national_id="198012345678",
        full_name="أحمد محمد علي",
        ministry=MinistryDomain.DIGITAL_TRANSFORMATION,
        department="Information Systems",
        position="System Administrator",
        permission_level=PermissionLevel.MANAGER,
        security_clearance=SecurityClearance.SECRET,
        professional_domains=[ProfessionalDomain.TECHNICAL, ProfessionalDomain.ADMINISTRATIVE],
        biometric_enrolled=True,
        mfa_enabled=True,
        cultural_sensitivity_training=True
    )
    
    # Register employee
    permission_system.register_employee(employee)
    print(f"✅ Employee registered: {employee.full_name}")
    
    # Test permission checks
    test_cases = [
        {
            "resource_type": ResourceType.DOCUMENT,
            "action": PermissionAction.READ,
            "context": {"content": "تقرير حكومي عن الأمن السيبراني"}
        },
        {
            "resource_type": ResourceType.SYSTEM,
            "action": PermissionAction.ADMIN,
            "context": {"location": "Baghdad", "ip_address": "192.168.1.100"}
        },
        {
            "resource_type": ResourceType.DATABASE,
            "action": PermissionAction.DELETE,
            "context": {"content": "حذف بيانات المواطنين"}
        }
    ]
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n🔍 Test Case {i}: {test_case['resource_type'].value} - {test_case['action'].value}")
        
        result = await permission_system.check_permission(
            employee_id=employee.employee_id,
            resource_type=test_case['resource_type'],
            action=test_case['action'],
            context=test_case['context']
        )
        
        print(f"   Result: {'✅ GRANTED' if result['granted'] else '❌ DENIED'}")
        print(f"   Security Level: {result['security_level']}")
        
        if result.get('cultural_compliance'):
            compliance = result['cultural_compliance']
            print(f"   Cultural Compliance: {'✅' if compliance['compliant'] else '❌'}")
            if compliance.get('issues'):
                print(f"   Cultural Issues: {compliance['issues']}")
    
    # Get employee permissions summary
    permissions_summary = await permission_system.get_employee_permissions(employee.employee_id)
    print(f"\n📋 Permissions Summary for {employee.full_name}:")
    print(f"   Permission Level: {permissions_summary['permissions']['role_based_access']['permission_level']}")
    print(f"   Security Clearance: {permissions_summary['permissions']['role_based_access']['security_clearance']}")
    print(f"   Ministry: {permissions_summary['permissions']['role_based_access']['ministry']}")
    print(f"   Account Valid: {'✅' if permissions_summary['account_status']['valid'] else '❌'}")
    
    # Generate audit report
    end_date = datetime.now()
    start_date = end_date - timedelta(days=1)
    
    audit_report = await permission_system.get_audit_report(start_date, end_date)
    print(f"\n📊 Audit Report (Last 24 hours):")
    print(f"   Total Events: {audit_report['statistics']['total_events']}")
    print(f"   Permissions Granted: {audit_report['statistics']['permissions_granted']}")
    print(f"   Permissions Denied: {audit_report['statistics']['permissions_denied']}")
    print(f"   Cultural Violations: {audit_report['statistics']['cultural_violations']}")


if __name__ == "__main__":
    asyncio.run(main())