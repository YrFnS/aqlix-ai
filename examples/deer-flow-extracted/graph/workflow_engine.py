"""
Iraqi Workflow Engine - LangGraph-based workflow orchestration for Iraqi processes

Handles complex multi-step Iraqi business processes with cultural context awareness,
Islamic compliance validation, and Arabic RTL support.
"""

from typing import Dict, List, Optional, Any, Callable
from dataclasses import dataclass, field
from enum import Enum
import asyncio
from datetime import datetime, timezone
import json

from langgraph.graph import StateGraph, END
from langgraph.prebuilt import ToolExecutor
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from pydantic import BaseModel, Field


class IraqiProcessType(Enum):
    """Types of Iraqi business processes"""
    GOVERNMENT_APPROVAL = "government_approval"
    LEGAL_REVIEW = "legal_review"
    MEDICAL_CONSULTATION = "medical_consultation"
    ACADEMIC_RESEARCH = "academic_research"
    BUSINESS_TRANSACTION = "business_transaction"
    ISLAMIC_COMPLIANCE = "islamic_compliance"
    DOCUMENT_PROCESSING = "document_processing"
    CULTURAL_VALIDATION = "cultural_validation"


class IraqiWorkflowState(BaseModel):
    """State model for Iraqi workflow processes"""
    
    # Core workflow data
    process_id: str = Field(..., description="Unique process identifier")
    process_type: IraqiProcessType = Field(..., description="Type of Iraqi process")
    messages: List[BaseMessage] = Field(default_factory=list, description="Message history")
    
    # Iraqi cultural context
    language: str = Field(default="arabic", description="Primary language (arabic/english)")
    cultural_context: str = Field(default="iraqi", description="Cultural context")
    islamic_compliance_required: bool = Field(default=True, description="Islamic compliance requirement")
    
    # Process state
    current_step: str = Field(default="initiate", description="Current workflow step")
    completed_steps: List[str] = Field(default_factory=list, description="Completed steps")
    pending_approvals: List[str] = Field(default_factory=list, description="Pending approvals")
    
    # Iraqi-specific data
    government_agency: Optional[str] = Field(None, description="Relevant Iraqi government agency")
    legal_framework: Optional[str] = Field(None, description="Applicable Iraqi legal framework")
    religious_validation: Optional[bool] = Field(None, description="Religious validation status")
    
    # Workflow metadata
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    priority: str = Field(default="medium", description="Process priority")
    deadline: Optional[datetime] = Field(None, description="Process deadline")
    
    # Results and outputs
    results: Dict[str, Any] = Field(default_factory=dict, description="Process results")
    documents: List[str] = Field(default_factory=list, description="Generated documents")
    approvals: Dict[str, bool] = Field(default_factory=dict, description="Approval status")


@dataclass
class IraqiWorkflowNode:
    """Represents a node in Iraqi workflow graph"""
    
    name: str
    description: str
    function: Callable
    requirements: List[str] = field(default_factory=list)
    cultural_context: Optional[str] = None
    compliance_checks: List[str] = field(default_factory=list)
    arabic_support: bool = True


class IraqiWorkflowEngine:
    """
    LangGraph-based workflow engine for Iraqi processes
    
    Provides advanced workflow orchestration with Iraqi process modeling,
    state management for complex multi-step Iraqi business processes,
    and conditional branching for Iraqi regulatory compliance.
    """
    
    def __init__(self):
        self.workflows: Dict[str, StateGraph] = {}
        self.process_states: Dict[str, IraqiWorkflowState] = {}
        self.cultural_validators = {}
        self.compliance_checkers = {}
        
    async def create_workflow(
        self,
        process_type: IraqiProcessType,
        nodes: List[IraqiWorkflowNode],
        edges: List[tuple],
        cultural_requirements: Optional[Dict] = None
    ) -> str:
        """Create a new Iraqi workflow"""
        
        workflow_id = f"{process_type.value}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Create LangGraph workflow
        workflow = StateGraph(IraqiWorkflowState)
        
        # Add nodes with Iraqi context
        for node in nodes:
            workflow.add_node(
                node.name,
                self._create_iraqi_node_function(node)
            )
        
        # Add edges with conditional branching
        for source, target, condition in edges:
            if condition:
                workflow.add_conditional_edges(
                    source,
                    self._create_iraqi_condition(condition),
                    {True: target, False: END}
                )
            else:
                workflow.add_edge(source, target)
        
        # Set entry point
        workflow.set_entry_point(nodes[0].name)
        
        # Compile workflow
        compiled_workflow = workflow.compile()
        self.workflows[workflow_id] = compiled_workflow
        
        return workflow_id
    
    async def execute_workflow(
        self,
        workflow_id: str,
        initial_data: Dict[str, Any],
        cultural_context: Dict[str, Any] = None
    ) -> IraqiWorkflowState:
        """Execute Iraqi workflow with cultural context"""
        
        if workflow_id not in self.workflows:
            raise ValueError(f"Workflow {workflow_id} not found")
        
        # Initialize state
        state = IraqiWorkflowState(
            process_id=f"proc_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            process_type=IraqiProcessType(initial_data.get("process_type", "document_processing")),
            language=initial_data.get("language", "arabic"),
            cultural_context=initial_data.get("cultural_context", "iraqi"),
            islamic_compliance_required=initial_data.get("islamic_compliance", True)
        )
        
        # Add initial message
        if "user_input" in initial_data:
            state.messages.append(
                HumanMessage(content=initial_data["user_input"])
            )
        
        # Store state
        self.process_states[state.process_id] = state
        
        # Execute workflow
        workflow = self.workflows[workflow_id]
        result = await workflow.ainvoke(state)
        
        # Update stored state
        self.process_states[state.process_id] = result
        
        return result
    
    def _create_iraqi_node_function(self, node: IraqiWorkflowNode) -> Callable:
        """Create node function with Iraqi cultural context"""
        
        async def iraqi_node_function(state: IraqiWorkflowState) -> IraqiWorkflowState:
            # Update current step
            state.current_step = node.name
            state.updated_at = datetime.now(timezone.utc)
            
            # Validate cultural requirements
            if node.cultural_context and state.cultural_context != node.cultural_context:
                state.messages.append(
                    AIMessage(content=f"Cultural context mismatch for step {node.name}")
                )
                return state
            
            # Check Islamic compliance if required
            if state.islamic_compliance_required and node.compliance_checks:
                compliance_result = await self._validate_islamic_compliance(
                    state, node.compliance_checks
                )
                if not compliance_result:
                    state.messages.append(
                        AIMessage(content=f"Islamic compliance check failed for step {node.name}")
                    )
                    return state
            
            # Execute node function
            try:
                result = await node.function(state)
                state.completed_steps.append(node.name)
                
                # Add success message
                if state.language == "arabic":
                    success_msg = f"تم إنجاز الخطوة {node.name} بنجاح"
                else:
                    success_msg = f"Step {node.name} completed successfully"
                
                state.messages.append(AIMessage(content=success_msg))
                
                return result
                
            except Exception as e:
                # Handle errors with cultural context
                if state.language == "arabic":
                    error_msg = f"خطأ في الخطوة {node.name}: {str(e)}"
                else:
                    error_msg = f"Error in step {node.name}: {str(e)}"
                
                state.messages.append(AIMessage(content=error_msg))
                return state
        
        return iraqi_node_function
    
    def _create_iraqi_condition(self, condition: str) -> Callable:
        """Create conditional function with Iraqi context"""
        
        def iraqi_condition_function(state: IraqiWorkflowState) -> bool:
            # Handle Iraqi-specific conditions
            if condition == "government_approval_required":
                return bool(state.government_agency)
            elif condition == "islamic_compliance_check":
                return state.islamic_compliance_required
            elif condition == "arabic_language":
                return state.language == "arabic"
            elif condition == "legal_review_needed":
                return bool(state.legal_framework)
            elif condition == "religious_validation_required":
                return state.religious_validation is not None
            else:
                # Default condition evaluation
                return eval(condition.replace("state.", "state."))
        
        return iraqi_condition_function
    
    async def _validate_islamic_compliance(
        self,
        state: IraqiWorkflowState,
        compliance_checks: List[str]
    ) -> bool:
        """Validate Islamic compliance for workflow step"""
        
        for check in compliance_checks:
            if check == "halal_content":
                # Check if content is halal
                if not await self._is_content_halal(state):
                    return False
            elif check == "prayer_time_consideration":
                # Check if process respects prayer times
                if not await self._respects_prayer_times(state):
                    return False
            elif check == "islamic_finance":
                # Check Islamic finance compliance
                if not await self._validates_islamic_finance(state):
                    return False
            elif check == "gender_interaction":
                # Check appropriate gender interaction guidelines
                if not await self._validates_gender_interaction(state):
                    return False
        
        return True
    
    async def _is_content_halal(self, state: IraqiWorkflowState) -> bool:
        """Check if content complies with Islamic guidelines"""
        # Implementation would use Islamic content validation
        return True  # Placeholder
    
    async def _respects_prayer_times(self, state: IraqiWorkflowState) -> bool:
        """Check if process timing respects prayer times"""
        # Implementation would check current time against prayer schedule
        return True  # Placeholder
    
    async def _validates_islamic_finance(self, state: IraqiWorkflowState) -> bool:
        """Validate Islamic finance compliance"""
        # Implementation would check Sharia compliance
        return True  # Placeholder
    
    async def _validates_gender_interaction(self, state: IraqiWorkflowState) -> bool:
        """Validate appropriate gender interaction guidelines"""
        # Implementation would check Islamic gender interaction guidelines
        return True  # Placeholder
    
    async def get_workflow_status(self, process_id: str) -> Dict[str, Any]:
        """Get status of Iraqi workflow process"""
        
        if process_id not in self.process_states:
            raise ValueError(f"Process {process_id} not found")
        
        state = self.process_states[process_id]
        
        return {
            "process_id": state.process_id,
            "process_type": state.process_type.value,
            "current_step": state.current_step,
            "completed_steps": state.completed_steps,
            "pending_approvals": state.pending_approvals,
            "language": state.language,
            "cultural_context": state.cultural_context,
            "islamic_compliance": state.islamic_compliance_required,
            "created_at": state.created_at.isoformat(),
            "updated_at": state.updated_at.isoformat(),
            "progress": len(state.completed_steps) / (len(state.completed_steps) + len(state.pending_approvals) + 1) * 100
        }
    
    async def create_government_approval_workflow(self) -> str:
        """Create standard Iraqi government approval workflow"""
        
        nodes = [
            IraqiWorkflowNode(
                name="document_validation",
                description="Validate submitted documents",
                function=self._validate_documents,
                requirements=["valid_id", "required_forms"],
                compliance_checks=["halal_content"]
            ),
            IraqiWorkflowNode(
                name="eligibility_check",
                description="Check applicant eligibility",
                function=self._check_eligibility,
                requirements=["document_validation"],
                compliance_checks=["islamic_compliance"]
            ),
            IraqiWorkflowNode(
                name="government_review",
                description="Government agency review",
                function=self._government_review,
                requirements=["eligibility_check"],
                cultural_context="iraqi"
            ),
            IraqiWorkflowNode(
                name="approval_decision",
                description="Final approval decision",
                function=self._approval_decision,
                requirements=["government_review"],
                compliance_checks=["legal_compliance"]
            )
        ]
        
        edges = [
            ("document_validation", "eligibility_check", None),
            ("eligibility_check", "government_review", "eligibility_passed"),
            ("government_review", "approval_decision", "review_completed"),
        ]
        
        return await self.create_workflow(
            IraqiProcessType.GOVERNMENT_APPROVAL,
            nodes,
            edges,
            {"requires_arabic": True, "government_agency": True}
        )
    
    async def _validate_documents(self, state: IraqiWorkflowState) -> IraqiWorkflowState:
        """Validate documents step"""
        # Implementation for document validation
        state.results["documents_validated"] = True
        return state
    
    async def _check_eligibility(self, state: IraqiWorkflowState) -> IraqiWorkflowState:
        """Check eligibility step"""
        # Implementation for eligibility checking
        state.results["eligibility_passed"] = True
        return state
    
    async def _government_review(self, state: IraqiWorkflowState) -> IraqiWorkflowState:
        """Government review step"""
        # Implementation for government review
        state.results["review_completed"] = True
        return state
    
    async def _approval_decision(self, state: IraqiWorkflowState) -> IraqiWorkflowState:
        """Final approval decision step"""
        # Implementation for approval decision
        state.results["approved"] = True
        return state