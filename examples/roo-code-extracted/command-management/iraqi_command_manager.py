"""
Iraqi Command Management System - Enhanced Command Processing with Cultural Intelligence

Extracted from Roo-Code command processing patterns and enhanced with Iraqi cultural validation,
Arabic language support, and professional domain expertise.

Key enhancements:
- Cultural validation for command execution
- Arabic/English bilingual command processing
- Iraqi professional domain support (legal, medical, educational, government)
- Islamic compliance validation for command outputs
- RTL-aware command result formatting
"""

from dataclasses import dataclass
from enum import Enum
from typing import Dict, Any, List, Optional, Union, Callable
import asyncio
import json
import logging
import re
from datetime import datetime
from pathlib import Path


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


class CommandPriority(Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"
    CRITICAL = "critical"


class CommandStatus(Enum):
    PENDING = "pending"
    VALIDATING = "validating"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


@dataclass
class CommandContext:
    """Command execution context with cultural awareness"""

    domain: IraqiProfessionalDomain
    validation_level: CulturalValidationLevel
    language: str = "ar"  # Arabic by default
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    timestamp: Optional[datetime] = None
    cultural_metadata: Optional[Dict[str, Any]] = None


@dataclass
class CommandResult:
    """Command execution result with cultural validation"""

    success: bool
    data: Any
    status: CommandStatus
    execution_time: float
    error: Optional[str] = None
    cultural_validation: Optional[Dict[str, Any]] = None
    arabic_content: Optional[Dict[str, str]] = None
    professional_domain: Optional[IraqiProfessionalDomain] = None
    islamic_compliance: bool = True


@dataclass
class Command:
    """Iraqi-enhanced command with cultural context"""

    id: str
    name: str
    description: str
    description_arabic: str
    parameters: Dict[str, Any]
    context: CommandContext
    priority: CommandPriority = CommandPriority.NORMAL
    status: CommandStatus = CommandStatus.PENDING
    created_at: Optional[datetime] = None
    executed_at: Optional[datetime] = None
    result: Optional[CommandResult] = None


class IraqiCommandManager:
    """Enhanced command management system with Iraqi cultural intelligence"""

    def __init__(
        self,
        validation_level: CulturalValidationLevel = CulturalValidationLevel.STANDARD,
    ):
        self.validation_level = validation_level
        self.commands: Dict[str, Command] = {}
        self.command_handlers: Dict[str, Callable] = {}
        self.cultural_validators: Dict[str, Callable] = {}
        self.execution_queue: List[str] = []
        self.active_commands: Dict[str, asyncio.Task] = {}
        self._setup_logging()
        self._setup_default_handlers()

    def _setup_logging(self):
        """Setup culturally appropriate logging"""
        self.logger = logging.getLogger("iraqi_command_manager")
        self.logger.setLevel(logging.INFO)

    def _setup_default_handlers(self):
        """Setup default command handlers for common Iraqi operations"""
        self.command_handlers = {
            "translate_document": self._handle_translation,
            "validate_legal_document": self._handle_legal_validation,
            "process_medical_record": self._handle_medical_processing,
            "generate_arabic_content": self._handle_arabic_generation,
            "cultural_compliance_check": self._handle_cultural_compliance,
        }

    async def register_command(self, command: Command) -> bool:
        """Register a new command with cultural validation"""
        try:
            # Pre-registration validation
            validation_result = await self._validate_command_registration(command)

            if not validation_result["allowed"]:
                self.logger.warning(
                    f"Command registration blocked: {validation_result['reason']}"
                )
                return False

            # Set metadata
            command.created_at = datetime.now()
            command.id = command.id or self._generate_command_id(command.name)

            # Store command
            self.commands[command.id] = command

            # Add to execution queue if priority allows
            if command.priority in [
                CommandPriority.HIGH,
                CommandPriority.URGENT,
                CommandPriority.CRITICAL,
            ]:
                self.execution_queue.insert(0, command.id)
            else:
                self.execution_queue.append(command.id)

            self.logger.info(f"Successfully registered command: {command.id}")
            return True

        except Exception as e:
            self.logger.error(f"Failed to register command {command.id}: {str(e)}")
            return False

    async def execute_command(self, command_id: str) -> CommandResult:
        """Execute command with cultural validation and monitoring"""
        try:
            if command_id not in self.commands:
                return CommandResult(
                    success=False,
                    data=None,
                    status=CommandStatus.FAILED,
                    execution_time=0.0,
                    error=f"Command {command_id} not found",
                )

            command = self.commands[command_id]
            start_time = datetime.now()

            # Update status
            command.status = CommandStatus.VALIDATING

            # Cultural validation
            validation_result = await self._validate_command_execution(command)

            if not validation_result["allowed"]:
                command.status = CommandStatus.FAILED
                return CommandResult(
                    success=False,
                    data=None,
                    status=CommandStatus.FAILED,
                    execution_time=(datetime.now() - start_time).total_seconds(),
                    error=f"Command execution blocked: {validation_result['reason']}",
                    cultural_validation=validation_result,
                )

            # Execute command
            command.status = CommandStatus.EXECUTING
            command.executed_at = datetime.now()

            execution_result = await self._execute_command_handler(command)

            # Post-execution processing
            processed_result = await self._process_command_result(
                execution_result, command
            )

            # Update command status
            command.status = (
                CommandStatus.COMPLETED
                if processed_result["success"]
                else CommandStatus.FAILED
            )

            execution_time = (datetime.now() - start_time).total_seconds()

            result = CommandResult(
                success=processed_result["success"],
                data=processed_result["data"],
                status=command.status,
                execution_time=execution_time,
                cultural_validation=processed_result.get("cultural_validation"),
                arabic_content=processed_result.get("arabic_content"),
                professional_domain=command.context.domain,
                islamic_compliance=processed_result.get("islamic_compliance", True),
            )

            command.result = result

            # Remove from active commands
            if command_id in self.active_commands:
                del self.active_commands[command_id]

            # Remove from queue
            if command_id in self.execution_queue:
                self.execution_queue.remove(command_id)

            self.logger.info(
                f"Command {command_id} executed successfully in {execution_time:.2f}s"
            )
            return result

        except Exception as e:
            self.logger.error(f"Command execution failed for {command_id}: {str(e)}")
            command.status = CommandStatus.FAILED

            return CommandResult(
                success=False,
                data=None,
                status=CommandStatus.FAILED,
                execution_time=(datetime.now() - start_time).total_seconds(),
                error=str(e),
            )

    async def execute_command_batch(
        self, command_ids: List[str], parallel: bool = False
    ) -> Dict[str, CommandResult]:
        """Execute multiple commands with cultural coordination"""
        results = {}

        if parallel:
            # Execute commands in parallel
            tasks = []
            for command_id in command_ids:
                task = asyncio.create_task(self.execute_command(command_id))
                tasks.append((command_id, task))
                self.active_commands[command_id] = task

            # Wait for all tasks to complete
            for command_id, task in tasks:
                try:
                    result = await task
                    results[command_id] = result
                except Exception as e:
                    results[command_id] = CommandResult(
                        success=False,
                        data=None,
                        status=CommandStatus.FAILED,
                        execution_time=0.0,
                        error=str(e),
                    )
        else:
            # Execute commands sequentially
            for command_id in command_ids:
                result = await self.execute_command(command_id)
                results[command_id] = result

                # Stop on critical failure if validation level is strict
                if (
                    not result.success
                    and self.validation_level == CulturalValidationLevel.STRICT
                ):
                    break

        return results

    async def cancel_command(self, command_id: str) -> bool:
        """Cancel command execution"""
        try:
            if command_id in self.active_commands:
                task = self.active_commands[command_id]
                task.cancel()
                del self.active_commands[command_id]

            if command_id in self.commands:
                self.commands[command_id].status = CommandStatus.CANCELLED

            if command_id in self.execution_queue:
                self.execution_queue.remove(command_id)

            self.logger.info(f"Command {command_id} cancelled successfully")
            return True

        except Exception as e:
            self.logger.error(f"Failed to cancel command {command_id}: {str(e)}")
            return False

    async def get_command_status(self, command_id: str) -> Optional[Dict[str, Any]]:
        """Get comprehensive command status"""
        if command_id not in self.commands:
            return None

        command = self.commands[command_id]

        return {
            "id": command.id,
            "name": command.name,
            "status": command.status.value,
            "priority": command.priority.value,
            "domain": command.context.domain.value,
            "validation_level": command.context.validation_level.value,
            "created_at": command.created_at.isoformat()
            if command.created_at
            else None,
            "executed_at": command.executed_at.isoformat()
            if command.executed_at
            else None,
            "result": {
                "success": command.result.success if command.result else None,
                "execution_time": command.result.execution_time
                if command.result
                else None,
                "islamic_compliance": command.result.islamic_compliance
                if command.result
                else None,
            }
            if command.result
            else None,
        }

    async def get_queue_status(self) -> Dict[str, Any]:
        """Get execution queue status with cultural insights"""
        queue_by_domain = {}
        queue_by_priority = {}

        for command_id in self.execution_queue:
            command = self.commands.get(command_id)
            if command:
                # Group by domain
                domain = command.context.domain.value
                if domain not in queue_by_domain:
                    queue_by_domain[domain] = []
                queue_by_domain[domain].append(command_id)

                # Group by priority
                priority = command.priority.value
                if priority not in queue_by_priority:
                    queue_by_priority[priority] = []
                queue_by_priority[priority].append(command_id)

        return {
            "total_queued": len(self.execution_queue),
            "active_commands": len(self.active_commands),
            "by_domain": queue_by_domain,
            "by_priority": queue_by_priority,
            "validation_level": self.validation_level.value,
        }

    def _generate_command_id(self, command_name: str) -> str:
        """Generate unique command ID with timestamp"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")[:-3]
        clean_name = re.sub(r"[^a-zA-Z0-9_]", "_", command_name)
        return f"cmd_{clean_name}_{timestamp}"

    async def _validate_command_registration(self, command: Command) -> Dict[str, Any]:
        """Validate command registration against cultural requirements"""
        issues = []

        # Check command name appropriateness
        if not self._is_culturally_appropriate_name(command.name):
            issues.append("Command name contains culturally inappropriate content")

        # Check parameters for sensitive content
        param_validation = self._validate_parameters_cultural_content(
            command.parameters
        )
        if not param_validation["is_appropriate"]:
            issues.extend(param_validation["issues"])

        # Domain-specific validation
        domain_validation = await self._validate_domain_specific_requirements(command)
        if not domain_validation["valid"]:
            issues.extend(domain_validation["issues"])

        return {
            "allowed": len(issues) == 0,
            "reason": "; ".join(issues) if issues else "Validation passed",
            "issues": issues,
            "validation_level": self.validation_level.value,
        }

    async def _validate_command_execution(self, command: Command) -> Dict[str, Any]:
        """Validate command execution against cultural and professional requirements"""

        # Check if command handler exists
        if command.name not in self.command_handlers:
            return {
                "allowed": False,
                "reason": f"No handler found for command {command.name}",
                "validation_level": self.validation_level.value,
            }

        # Cultural validation
        cultural_check = self._validate_cultural_compliance(command)
        if (
            not cultural_check["compliant"]
            and self.validation_level == CulturalValidationLevel.STRICT
        ):
            return {
                "allowed": False,
                "reason": f"Cultural compliance check failed: {cultural_check['issues']}",
                "validation_level": self.validation_level.value,
            }

        # Professional domain validation
        domain_check = await self._validate_professional_domain_access(command)
        if not domain_check["allowed"]:
            return {
                "allowed": False,
                "reason": f"Professional domain access denied: {domain_check['reason']}",
                "validation_level": self.validation_level.value,
            }

        return {
            "allowed": True,
            "reason": "Validation passed",
            "validation_level": self.validation_level.value,
            "cultural_validation": cultural_check,
            "domain_validation": domain_check,
        }

    def _is_culturally_appropriate_name(self, name: str) -> bool:
        """Check if command name is culturally appropriate"""
        inappropriate_terms = [
            "inappropriate",
            "offensive",
            "gambling",
            "alcohol",
            "adult",
        ]
        name_lower = name.lower()
        return not any(term in name_lower for term in inappropriate_terms)

    def _validate_parameters_cultural_content(
        self, parameters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Validate parameters for cultural appropriateness"""
        issues = []
        inappropriate_terms = ["inappropriate", "offensive", "gambling", "alcohol"]

        param_str = json.dumps(parameters, default=str).lower()

        for term in inappropriate_terms:
            if term in param_str:
                issues.append(f"Inappropriate term detected in parameters: {term}")

        return {
            "is_appropriate": len(issues) == 0,
            "issues": issues,
            "contains_arabic": self._detect_arabic_text(param_str),
        }

    def _validate_cultural_compliance(self, command: Command) -> Dict[str, Any]:
        """Validate command for cultural compliance"""
        issues = []
        compliance_score = 1.0

        # Check Islamic compliance based on command type and parameters
        if command.context.domain == IraqiProfessionalDomain.LEGAL:
            # Ensure legal commands align with Islamic jurisprudence
            if "interest" in json.dumps(command.parameters, default=str).lower():
                issues.append(
                    "Legal command may conflict with Islamic finance principles"
                )
                compliance_score -= 0.3

        return {
            "compliant": compliance_score > 0.6,
            "compliance_score": max(0.0, compliance_score),
            "issues": issues,
            "islamic_compliance": compliance_score > 0.8,
        }

    async def _validate_domain_specific_requirements(
        self, command: Command
    ) -> Dict[str, Any]:
        """Validate domain-specific requirements"""
        issues = []

        domain = command.context.domain

        if domain == IraqiProfessionalDomain.MEDICAL:
            # Medical commands require special validation
            if "patient_data" in command.parameters and not command.parameters.get(
                "consent_verified"
            ):
                issues.append("Medical command requires patient consent verification")

        elif domain == IraqiProfessionalDomain.LEGAL:
            # Legal commands require compliance verification
            if "legal_document" in command.parameters and not command.parameters.get(
                "jurisdiction_verified"
            ):
                issues.append("Legal command requires jurisdiction verification")

        return {"valid": len(issues) == 0, "issues": issues, "domain": domain.value}

    async def _validate_professional_domain_access(
        self, command: Command
    ) -> Dict[str, Any]:
        """Validate access to professional domains"""
        domain = command.context.domain

        # Professional domains require higher validation levels
        if domain in [IraqiProfessionalDomain.LEGAL, IraqiProfessionalDomain.MEDICAL]:
            if command.context.validation_level not in [
                CulturalValidationLevel.PROFESSIONAL,
                CulturalValidationLevel.STRICT,
            ]:
                return {
                    "allowed": False,
                    "reason": f"Domain {domain.value} requires PROFESSIONAL or STRICT validation level",
                }

        return {
            "allowed": True,
            "reason": "Domain access granted",
            "domain": domain.value,
        }

    def _detect_arabic_text(self, text: str) -> bool:
        """Detect Arabic text in string"""
        arabic_range = range(0x0600, 0x06FF + 1)  # Arabic Unicode block
        return any(ord(char) in arabic_range for char in text)

    async def _execute_command_handler(self, command: Command) -> Dict[str, Any]:
        """Execute the appropriate command handler"""
        handler = self.command_handlers.get(command.name)

        if not handler:
            return {
                "success": False,
                "data": None,
                "error": f"No handler found for command {command.name}",
            }

        try:
            result = await handler(command)
            return result
        except Exception as e:
            return {"success": False, "data": None, "error": str(e)}

    async def _process_command_result(
        self, raw_result: Dict[str, Any], command: Command
    ) -> Dict[str, Any]:
        """Process command result with cultural intelligence"""

        # Extract and validate content
        if raw_result.get("success", False):
            result_data = raw_result.get("data", "")

            # Cultural validation of result
            cultural_validation = {
                "is_appropriate": True,
                "islamic_compliance": True,
                "political_neutrality": True,
                "professional_appropriateness": True,
            }

            # Arabic content processing
            arabic_content = None
            if isinstance(result_data, str) and self._detect_arabic_text(result_data):
                arabic_content = {
                    "detected": True,
                    "rtl_formatted": self._format_rtl_content(result_data),
                    "mixed_content": self._detect_mixed_arabic_english(result_data),
                }

            return {
                "success": True,
                "data": result_data,
                "cultural_validation": cultural_validation,
                "arabic_content": arabic_content,
                "islamic_compliance": cultural_validation["islamic_compliance"],
            }
        else:
            return raw_result

    def _format_rtl_content(self, text: str) -> str:
        """Format content for RTL display"""
        lines = text.split("\n")
        rtl_lines = []

        for line in lines:
            if self._detect_arabic_text(line):
                # RTL formatting for Arabic content
                rtl_lines.append(f"{line}")  # RLM markers
            else:
                rtl_lines.append(line)

        return "\n".join(rtl_lines)

    def _detect_mixed_arabic_english(self, text: str) -> bool:
        """Detect mixed Arabic-English content"""
        has_arabic = self._detect_arabic_text(text)
        has_english = any(char.isascii() and char.isalpha() for char in text)
        return has_arabic and has_english

    # Default command handlers
    async def _handle_translation(self, command: Command) -> Dict[str, Any]:
        """Handle document translation commands"""
        await asyncio.sleep(0.1)  # Simulate processing

        source_text = command.parameters.get("source_text", "")
        target_lang = command.parameters.get("target_language", "ar")

        # Simulate translation
        translated_text = f"Translated to {target_lang}: {source_text}"

        return {
            "success": True,
            "data": {
                "original_text": source_text,
                "translated_text": translated_text,
                "target_language": target_lang,
                "translation_quality": "high",
            },
        }

    async def _handle_legal_validation(self, command: Command) -> Dict[str, Any]:
        """Handle legal document validation"""
        await asyncio.sleep(0.2)  # Simulate processing

        document = command.parameters.get("document", "")

        return {
            "success": True,
            "data": {
                "document_type": "legal_contract",
                "validation_status": "compliant",
                "islamic_compliance": True,
                "recommendations": ["Document meets Iraqi legal standards"],
            },
        }

    async def _handle_medical_processing(self, command: Command) -> Dict[str, Any]:
        """Handle medical record processing"""
        await asyncio.sleep(0.15)  # Simulate processing

        patient_id = command.parameters.get("patient_id", "")

        return {
            "success": True,
            "data": {
                "patient_id": patient_id,
                "processing_status": "completed",
                "privacy_compliance": True,
                "islamic_medical_ethics": True,
            },
        }

    async def _handle_arabic_generation(self, command: Command) -> Dict[str, Any]:
        """Handle Arabic content generation"""
        await asyncio.sleep(0.1)  # Simulate processing

        content_type = command.parameters.get("content_type", "general")

        return {
            "success": True,
            "data": {
                "generated_content": f"Generated Arabic content for {content_type}",
                "rtl_formatted": True,
                "dialect": "iraqi",
                "cultural_appropriateness": "high",
            },
        }

    async def _handle_cultural_compliance(self, command: Command) -> Dict[str, Any]:
        """Handle cultural compliance checking"""
        await asyncio.sleep(0.05)  # Simulate processing

        content = command.parameters.get("content", "")

        return {
            "success": True,
            "data": {
                "compliance_score": 0.95,
                "islamic_compliance": True,
                "cultural_appropriateness": True,
                "recommendations": ["Content meets Iraqi cultural standards"],
            },
        }


# Example usage and testing
async def main():
    """Example usage of Iraqi Command Manager"""
    manager = IraqiCommandManager(validation_level=CulturalValidationLevel.PROFESSIONAL)

    # Create a sample command
    context = CommandContext(
        domain=IraqiProfessionalDomain.LEGAL,
        validation_level=CulturalValidationLevel.PROFESSIONAL,
        language="ar",
    )

    command = Command(
        id="legal_validation_001",
        name="validate_legal_document",
        description="Validate legal document for Iraqi compliance",
        description_arabic="'D*-BB EF 'DH+JB) 'DB'FHFJ) DD'E*+'D 'D91'BJ",
        parameters={
            "document": "Sample legal contract text",
            "jurisdiction": "iraq",
            "language": "arabic",
        },
        context=context,
        priority=CommandPriority.HIGH,
    )

    # Register and execute command
    await manager.register_command(command)
    result = await manager.execute_command(command.id)

    print(f"Command execution result: {result}")

    # Check queue status
    queue_status = await manager.get_queue_status()
    print(f"Queue status: {queue_status}")


if __name__ == "__main__":
    asyncio.run(main())
