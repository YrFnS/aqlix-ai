"""
Iraqi Action Handler - Enhanced browser automation actions for Iraqi government portals

Provides specialized action handling for:
- Arabic form filling with RTL layout support
- Iraqi government portal navigation and interaction
- Cultural validation for Islamic compliance
- Complex multi-step workflow execution with error recovery
"""

import asyncio
import logging
from typing import Dict, Any, Optional, List, Union, Tuple
from dataclasses import dataclass
from enum import Enum
from playwright.async_api import Page, Locator, ElementHandle
import json
import re
from datetime import datetime

logger = logging.getLogger(__name__)

class ActionType(Enum):
    """Supported action types for Iraqi automation"""
    CLICK = "click"
    INPUT_TEXT = "input_text"
    SELECT_OPTION = "select_option"
    UPLOAD_FILE = "upload_file"
    SCROLL = "scroll"
    WAIT = "wait"
    NAVIGATE = "navigate"
    EXTRACT_DATA = "extract_data"
    AUTHENTICATE = "authenticate"
    VALIDATE_FORM = "validate_form"

@dataclass
class ActionResult:
    """Result of an automation action"""
    success: bool
    message: str
    data: Optional[Dict[str, Any]] = None
    screenshot_path: Optional[str] = None
    execution_time: float = 0.0

@dataclass
class IraqiFormField:
    """Represents a form field with Iraqi/Arabic context"""
    name: str
    value: str
    field_type: str
    is_arabic: bool = False
    is_required: bool = False
    validation_rules: Optional[Dict[str, Any]] = None
    cultural_context: Optional[str] = None

class IraqiActionHandler:
    """
    Enhanced action handler for Iraqi government and business automation
    
    Features:
    - Arabic text input with RTL support
    - Iraqi government portal specific interactions
    - Cultural validation and Islamic compliance
    - Advanced error recovery and retry mechanisms
    - Comprehensive audit logging for government compliance
    """
    
    def __init__(self, page: Page, config: Optional[Dict[str, Any]] = None):
        self.page = page
        self.config = config or {}
        self.arabic_text_pattern = re.compile(r'[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]')
        self.action_history: List[Dict[str, Any]] = []
        
        # Iraqi specific configurations
        self.government_portal_timeout = self.config.get('government_timeout', 30000)
        self.enable_cultural_validation = self.config.get('cultural_validation', True)
        self.enable_audit_logging = self.config.get('audit_logging', True)
        
    async def execute_action(
        self,
        action_type: ActionType,
        target: str,
        data: Optional[Dict[str, Any]] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> ActionResult:
        """
        Execute an automation action with Iraqi optimizations
        
        Args:
            action_type: Type of action to perform
            target: CSS selector or element identifier
            data: Action-specific data
            context: Additional context for the action
        """
        start_time = datetime.now()
        action_id = f"{action_type.value}_{int(start_time.timestamp())}"
        
        try:
            logger.info(f"Executing action {action_id}: {action_type.value} on {target}")
            
            # Log action for audit trail
            if self.enable_audit_logging:
                await self._log_action(action_id, action_type, target, data, context)
            
            # Execute specific action
            result = await self._dispatch_action(action_type, target, data, context)
            
            execution_time = (datetime.now() - start_time).total_seconds()
            result.execution_time = execution_time
            
            # Log successful completion
            if result.success:
                logger.info(f"Action {action_id} completed successfully in {execution_time:.2f}s")
            else:
                logger.warning(f"Action {action_id} failed: {result.message}")
            
            return result
            
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds()
            logger.error(f"Action {action_id} failed with exception: {e}")
            
            return ActionResult(
                success=False,
                message=f"Action failed: {str(e)}",
                execution_time=execution_time
            )
    
    async def _dispatch_action(
        self,
        action_type: ActionType,
        target: str,
        data: Optional[Dict[str, Any]],
        context: Optional[Dict[str, Any]]
    ) -> ActionResult:
        """Dispatch action to appropriate handler"""
        
        handlers = {
            ActionType.CLICK: self._handle_click_action,
            ActionType.INPUT_TEXT: self._handle_input_text_action,
            ActionType.SELECT_OPTION: self._handle_select_option_action,
            ActionType.UPLOAD_FILE: self._handle_upload_file_action,
            ActionType.SCROLL: self._handle_scroll_action,
            ActionType.WAIT: self._handle_wait_action,
            ActionType.NAVIGATE: self._handle_navigate_action,
            ActionType.EXTRACT_DATA: self._handle_extract_data_action,
            ActionType.AUTHENTICATE: self._handle_authenticate_action,
            ActionType.VALIDATE_FORM: self._handle_validate_form_action
        }
        
        handler = handlers.get(action_type)
        if not handler:
            return ActionResult(
                success=False,
                message=f"Unsupported action type: {action_type.value}"
            )
        
        return await handler(target, data, context)
    
    async def _handle_click_action(
        self,
        target: str,
        data: Optional[Dict[str, Any]],
        context: Optional[Dict[str, Any]]
    ) -> ActionResult:
        """Handle click actions with Iraqi optimizations"""
        try:
            # Wait for element to be visible and clickable
            element = self.page.locator(target)
            await element.wait_for(state='visible', timeout=self.government_portal_timeout)
            
            # Check if element is blocked by overlays (common in government portals)
            is_blocked = await self._check_element_blocked(element)
            if is_blocked:
                await self._handle_blocking_elements()
            
            # Perform click with multiple fallback strategies
            click_strategies = [
                lambda: element.click(timeout=5000),
                lambda: element.click(force=True, timeout=5000),
                lambda: self._javascript_click(target),
                lambda: self._coordinate_click(element)
            ]
            
            for i, strategy in enumerate(click_strategies):
                try:
                    await strategy()
                    logger.debug(f"Click successful with strategy {i+1}")
                    break
                except Exception as e:
                    logger.debug(f"Click strategy {i+1} failed: {e}")
                    if i == len(click_strategies) - 1:
                        raise e
                    continue
            
            # Wait for potential navigation or content changes
            await self.page.wait_for_timeout(1000)
            
            return ActionResult(
                success=True,
                message="Click action completed successfully"
            )
            
        except Exception as e:
            return ActionResult(
                success=False,
                message=f"Click action failed: {str(e)}"
            )
    
    async def _handle_input_text_action(
        self,
        target: str,
        data: Optional[Dict[str, Any]],
        context: Optional[Dict[str, Any]]
    ) -> ActionResult:
        """Handle text input with Arabic RTL support"""
        try:
            if not data or 'text' not in data:
                return ActionResult(
                    success=False,
                    message="No text provided for input action"
                )
            
            text = data['text']
            element = self.page.locator(target)
            
            # Wait for element to be ready
            await element.wait_for(state='visible', timeout=self.government_portal_timeout)
            
            # Detect if text is Arabic and apply RTL formatting
            is_arabic = bool(self.arabic_text_pattern.search(text))
            
            if is_arabic:
                # Apply RTL formatting for Arabic text
                await self._prepare_arabic_input(element, text)
            
            # Clear existing content
            await element.clear()
            
            # Input text with proper typing simulation
            if data.get('simulate_typing', False):
                await element.type(text, delay=50)  # Simulate human typing
            else:
                await element.fill(text)
            
            # Validate input if required
            if data.get('validate_input', True):
                entered_value = await element.input_value()
                if entered_value != text:
                    logger.warning(f"Input validation failed. Expected: {text}, Got: {entered_value}")
            
            # Cultural validation for Iraqi context
            if self.enable_cultural_validation and is_arabic:
                validation_result = await self._validate_arabic_input(text, context)
                if not validation_result['valid']:
                    return ActionResult(
                        success=False,
                        message=f"Cultural validation failed: {validation_result['message']}"
                    )
            
            return ActionResult(
                success=True,
                message="Text input completed successfully",
                data={'text_entered': text, 'is_arabic': is_arabic}
            )
            
        except Exception as e:
            return ActionResult(
                success=False,
                message=f"Text input failed: {str(e)}"
            )
    
    async def _handle_select_option_action(
        self,
        target: str,
        data: Optional[Dict[str, Any]],
        context: Optional[Dict[str, Any]]
    ) -> ActionResult:
        """Handle dropdown selection with Arabic option support"""
        try:
            if not data or 'option' not in data:
                return ActionResult(
                    success=False,
                    message="No option provided for select action"
                )
            
            option = data['option']
            element = self.page.locator(target)
            
            await element.wait_for(state='visible', timeout=self.government_portal_timeout)
            
            # Try different selection strategies
            selection_strategies = [
                lambda: element.select_option(value=option),
                lambda: element.select_option(label=option),
                lambda: element.select_option(index=int(option) if option.isdigit() else 0),
                lambda: self._select_by_text_content(element, option)
            ]
            
            selected_option = None
            for i, strategy in enumerate(selection_strategies):
                try:
                    selected_option = await strategy()
                    logger.debug(f"Selection successful with strategy {i+1}")
                    break
                except Exception as e:
                    logger.debug(f"Selection strategy {i+1} failed: {e}")
                    if i == len(selection_strategies) - 1:
                        raise e
                    continue
            
            return ActionResult(
                success=True,
                message="Option selection completed successfully",
                data={'selected_option': selected_option}
            )
            
        except Exception as e:
            return ActionResult(
                success=False,
                message=f"Option selection failed: {str(e)}"
            )
    
    async def _handle_upload_file_action(
        self,
        target: str,
        data: Optional[Dict[str, Any]],
        context: Optional[Dict[str, Any]]
    ) -> ActionResult:
        """Handle file upload with Iraqi document validation"""
        try:
            if not data or 'file_path' not in data:
                return ActionResult(
                    success=False,
                    message="No file path provided for upload action"
                )
            
            file_path = data['file_path']
            element = self.page.locator(target)
            
            # Validate file before upload
            file_validation = await self._validate_iraqi_document(file_path, context)
            if not file_validation['valid']:
                return ActionResult(
                    success=False,
                    message=f"File validation failed: {file_validation['message']}"
                )
            
            # Handle file upload
            await element.set_input_files(file_path)
            
            # Wait for upload processing
            await self.page.wait_for_timeout(2000)
            
            return ActionResult(
                success=True,
                message="File upload completed successfully",
                data={'file_path': file_path, 'validation': file_validation}
            )
            
        except Exception as e:
            return ActionResult(
                success=False,
                message=f"File upload failed: {str(e)}"
            )
    
    async def _handle_authenticate_action(
        self,
        target: str,
        data: Optional[Dict[str, Any]],
        context: Optional[Dict[str, Any]]
    ) -> ActionResult:
        """Handle authentication for Iraqi government portals"""
        try:
            if not data:
                return ActionResult(
                    success=False,
                    message="No authentication data provided"
                )
            
            auth_type = data.get('type', 'basic')
            
            if auth_type == 'basic':
                result = await self._handle_basic_auth(data)
            elif auth_type == '2fa':
                result = await self._handle_2fa_auth(data)
            elif auth_type == 'government_sso':
                result = await self._handle_government_sso(data)
            else:
                return ActionResult(
                    success=False,
                    message=f"Unsupported authentication type: {auth_type}"
                )
            
            return result
            
        except Exception as e:
            return ActionResult(
                success=False,
                message=f"Authentication failed: {str(e)}"
            )
    
    async def _prepare_arabic_input(self, element: Locator, text: str) -> None:
        """Prepare element for Arabic text input with RTL support"""
        await element.evaluate("""
        (element, text) => {
            element.style.direction = 'rtl';
            element.style.textAlign = 'right';
            element.setAttribute('dir', 'rtl');
            element.setAttribute('lang', 'ar');
        }
        """, text)
    
    async def _validate_arabic_input(
        self,
        text: str,
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Validate Arabic input for cultural appropriateness"""
        # Basic validation - in production this would integrate with
        # comprehensive cultural validation service
        
        validation_result = {
            'valid': True,
            'message': 'Text validation passed',
            'warnings': []
        }
        
        # Check for common inappropriate content patterns
        inappropriate_patterns = [
            # Add patterns that should be flagged for Iraqi context
            r'(?i)(inappropriate|offensive)_patterns_here'
        ]
        
        for pattern in inappropriate_patterns:
            if re.search(pattern, text):
                validation_result['valid'] = False
                validation_result['message'] = 'Text contains inappropriate content'
                break
        
        return validation_result
    
    async def _validate_iraqi_document(
        self,
        file_path: str,
        context: Optional[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """Validate document for Iraqi government standards"""
        import os
        from pathlib import Path
        
        validation_result = {
            'valid': True,
            'message': 'Document validation passed',
            'file_info': {}
        }
        
        try:
            file_info = {
                'size': os.path.getsize(file_path),
                'extension': Path(file_path).suffix.lower(),
                'name': Path(file_path).name
            }
            
            validation_result['file_info'] = file_info
            
            # Validate file size (10MB limit for government portals)
            max_size = 10 * 1024 * 1024  # 10MB
            if file_info['size'] > max_size:
                validation_result['valid'] = False
                validation_result['message'] = f'File size exceeds limit: {file_info["size"]} bytes'
                return validation_result
            
            # Validate file type
            allowed_extensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']
            if file_info['extension'] not in allowed_extensions:
                validation_result['valid'] = False
                validation_result['message'] = f'File type not allowed: {file_info["extension"]}'
                return validation_result
            
        except Exception as e:
            validation_result['valid'] = False
            validation_result['message'] = f'Document validation error: {str(e)}'
        
        return validation_result
    
    async def _handle_basic_auth(self, data: Dict[str, Any]) -> ActionResult:
        """Handle basic username/password authentication"""
        try:
            username = data.get('username')
            password = data.get('password')
            
            if not username or not password:
                return ActionResult(
                    success=False,
                    message="Username and password required for basic authentication"
                )
            
            # Find and fill username field
            username_selectors = [
                'input[name="username"]',
                'input[name="email"]', 
                'input[type="email"]',
                'input[id*="username"]',
                'input[id*="email"]'
            ]
            
            username_filled = False
            for selector in username_selectors:
                try:
                    username_element = self.page.locator(selector)
                    if await username_element.count() > 0:
                        await username_element.fill(username)
                        username_filled = True
                        break
                except:
                    continue
            
            if not username_filled:
                return ActionResult(
                    success=False,
                    message="Could not find username field"
                )
            
            # Find and fill password field
            password_selectors = [
                'input[name="password"]',
                'input[type="password"]',
                'input[id*="password"]'
            ]
            
            password_filled = False
            for selector in password_selectors:
                try:
                    password_element = self.page.locator(selector)
                    if await password_element.count() > 0:
                        await password_element.fill(password)
                        password_filled = True
                        break
                except:
                    continue
            
            if not password_filled:
                return ActionResult(
                    success=False,
                    message="Could not find password field"
                )
            
            # Submit form
            submit_selectors = [
                'button[type="submit"]',
                'input[type="submit"]',
                'button:has-text("تسجيل الدخول")',
                'button:has-text("دخول")',
                'button:has-text("Login")'
            ]
            
            for selector in submit_selectors:
                try:
                    submit_element = self.page.locator(selector)
                    if await submit_element.count() > 0:
                        await submit_element.click()
                        break
                except:
                    continue
            
            # Wait for navigation or authentication result
            await self.page.wait_for_timeout(3000)
            
            return ActionResult(
                success=True,
                message="Basic authentication completed"
            )
            
        except Exception as e:
            return ActionResult(
                success=False,
                message=f"Basic authentication failed: {str(e)}"
            )
    
    async def _check_element_blocked(self, element: Locator) -> bool:
        """Check if element is blocked by overlays or other elements"""
        try:
            bounding_box = await element.bounding_box()
            if not bounding_box:
                return True
            
            # Check for common blocking elements
            blocking_selectors = [
                '.modal',
                '.overlay',
                '.popup',
                '.loading',
                '[style*="z-index"]'
            ]
            
            for selector in blocking_selectors:
                blocking_elements = self.page.locator(selector)
                if await blocking_elements.count() > 0:
                    return True
            
            return False
            
        except:
            return False
    
    async def _javascript_click(self, target: str) -> None:
        """Perform click using JavaScript as fallback"""
        await self.page.evaluate(f"""
        () => {{
            const element = document.querySelector('{target}');
            if (element) {{
                element.click();
            }}
        }}
        """)
    
    async def _log_action(
        self,
        action_id: str,
        action_type: ActionType,
        target: str,
        data: Optional[Dict[str, Any]],
        context: Optional[Dict[str, Any]]
    ) -> None:
        """Log action for audit trail"""
        log_entry = {
            'action_id': action_id,
            'timestamp': datetime.now().isoformat(),
            'action_type': action_type.value,
            'target': target,
            'data': data,
            'context': context,
            'page_url': self.page.url
        }
        
        self.action_history.append(log_entry)
        
        # In production, this would send to audit logging system
        logger.info(f"Action logged: {action_id}")


# Utility functions for Iraqi action handling
async def fill_iraqi_form(
    handler: IraqiActionHandler,
    form_fields: List[IraqiFormField],
    form_selector: Optional[str] = None
) -> List[ActionResult]:
    """
    Fill a complete Iraqi form with cultural validation
    
    Args:
        handler: Action handler instance
        form_fields: List of form fields to fill
        form_selector: Optional form container selector
    
    Returns:
        List of action results for each field
    """
    results = []
    
    for field in form_fields:
        # Determine field selector
        field_selector = f'input[name="{field.name}"]'
        if form_selector:
            field_selector = f'{form_selector} {field_selector}'
        
        # Prepare action data
        action_data = {
            'text': field.value,
            'validate_input': True,
            'simulate_typing': field.field_type == 'sensitive'
        }
        
        # Add cultural context
        context = {
            'cultural_context': field.cultural_context,
            'is_required': field.is_required,
            'validation_rules': field.validation_rules
        }
        
        # Execute input action
        result = await handler.execute_action(
            ActionType.INPUT_TEXT,
            field_selector,
            action_data,
            context
        )
        
        results.append(result)
        
        # Stop on first failure if field is required
        if not result.success and field.is_required:
            logger.error(f"Required field {field.name} failed: {result.message}")
            break
    
    return results


async def automate_government_portal_workflow(
    handler: IraqiActionHandler,
    workflow_steps: List[Dict[str, Any]]
) -> List[ActionResult]:
    """
    Execute a complete government portal workflow
    
    Args:
        handler: Action handler instance
        workflow_steps: List of workflow steps to execute
    
    Returns:
        List of action results for each step
    """
    results = []
    
    for i, step in enumerate(workflow_steps):
        logger.info(f"Executing workflow step {i+1}/{len(workflow_steps)}: {step.get('name', 'Unnamed step')}")
        
        action_type = ActionType(step['action_type'])
        target = step.get('target', '')
        data = step.get('data', {})
        context = step.get('context', {})
        
        # Execute step
        result = await handler.execute_action(action_type, target, data, context)
        results.append(result)
        
        # Handle step failure
        if not result.success:
            if step.get('critical', True):
                logger.error(f"Critical workflow step failed: {result.message}")
                break
            else:
                logger.warning(f"Non-critical step failed, continuing: {result.message}")
        
        # Wait between steps if specified
        wait_time = step.get('wait_after', 1000)
        if wait_time > 0:
            await handler.page.wait_for_timeout(wait_time)
    
    return results