/**
 * Iraqi Enhanced CopilotKit Crew State Management
 * Extracted from CopilotKit packages/react-core/src/types/crew.ts
 * Enhanced with Iraqi cultural context and agent coordination
 */

import { IraqiCulturalContext } from '@aqlix-ai/types';

/**
 * Status of a response or action that requires user input with Iraqi cultural context
 */
export type IraqiCrewsResponseStatus = 
  | "inProgress" 
  | "complete" 
  | "executing"
  | "culturalValidation" 
  | "islamicCompliance" 
  | "arabicProcessing";

/**
 * Enhanced Response data structure with Iraqi cultural intelligence
 */
export interface IraqiCrewsResponse {
  /**
   * Unique identifier for the response
   */
  id: string;

  /**
   * The content of the response to display
   */
  content: string;

  /**
   * Arabic translation of content if available
   */
  contentArabic?: string;

  /**
   * Cultural context for this response
   */
  culturalContext?: IraqiCulturalContext;

  /**
   * Cultural validation score (0-100)
   */
  culturalScore?: number;

  /**
   * Islamic compliance score (0-100)  
   */
  islamicComplianceScore?: number;

  /**
   * Professional domain this response relates to
   */
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business' | 'government' | 'general';

  /**
   * Optional metadata for the response with Iraqi context
   */
  metadata?: {
    language?: 'arabic' | 'english' | 'mixed';
    dialect?: 'iraqi' | 'standard' | 'gulf' | 'levantine';
    rtlLayout?: boolean;
    culturallyValidated?: boolean;
    islamicCompliance?: boolean;
    professionalValidation?: boolean;
    [key: string]: any;
  };
}

/**
 * Base state item interface for Iraqi agent state items
 */
export interface IraqiCrewsStateItem {
  /**
   * Unique identifier for the item
   */
  id: string;

  /**
   * Timestamp when the item was created (ISO 8601 format)
   */
  timestamp: string;

  /**
   * Cultural context when this item was created
   */
  culturalContext?: IraqiCulturalContext;

  /**
   * Agent that created this state item
   */
  agentId?: string;

  /**
   * Agent type (Iraqi specialized agent)
   */
  agentType?: 'iraqi-cultural-validator' | 'arabic-rtl-processor' | 'iraqi-professional-domain-expert' | 'general';
}

/**
 * Enhanced Tool execution state item with Iraqi validation
 */
export interface IraqiCrewsToolStateItem extends IraqiCrewsStateItem {
  /**
   * Name of the tool that was executed
   */
  tool: string;

  /**
   * Optional thought process for the tool execution (with cultural context)
   */
  thought?: string;

  /**
   * Arabic translation of thought if available
   */
  thoughtArabic?: string;

  /**
   * Result of the tool execution
   */
  result?: any;

  /**
   * Cultural validation result for this tool execution
   */
  culturalValidation?: {
    score: number;
    passed: boolean;
    issues: string[];
    recommendations: string[];
  };

  /**
   * Islamic compliance validation for this tool execution
   */
  islamicCompliance?: {
    score: number;
    compliant: boolean;
    violations: string[];
    recommendations: string[];
  };

  /**
   * Processing time for Iraqi enhancements
   */
  processingTime?: number;

  /**
   * Whether this tool execution required Arabic processing
   */
  arabicProcessingRequired?: boolean;
}

/**
 * Enhanced Task state item with Iraqi professional domain context
 */
export interface IraqiCrewsTaskStateItem extends IraqiCrewsStateItem {
  /**
   * Name of the task
   */
  name: string;

  /**
   * Arabic name of the task if available
   */
  nameArabic?: string;

  /**
   * Description of the task
   */
  description?: string;

  /**
   * Arabic description if available
   */
  descriptionArabic?: string;

  /**
   * Professional domain this task belongs to
   */
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business' | 'government' | 'technology' | 'general';

  /**
   * Priority level for Iraqi context
   */
  priority?: 'low' | 'medium' | 'high' | 'critical';

  /**
   * Cultural sensitivity level required
   */
  culturalSensitivity?: 'low' | 'medium' | 'high';

  /**
   * Whether Islamic compliance validation is required
   */
  islamicComplianceRequired?: boolean;

  /**
   * Task status with Iraqi cultural validation states
   */
  status?: 'pending' | 'in_progress' | 'cultural_validation' | 'islamic_compliance' | 'completed' | 'failed';

  /**
   * Task assignee (Iraqi agent type)
   */
  assignedAgent?: string;

  /**
   * Estimated completion time in milliseconds
   */
  estimatedCompletionTime?: number;
}

/**
 * Enhanced AgentState containing information about steps and tasks with Iraqi intelligence
 */
export interface IraqiCrewsAgentState {
  /**
   * Array of tool execution steps
   */
  steps?: IraqiCrewsToolStateItem[];

  /**
   * Array of tasks
   */
  tasks?: IraqiCrewsTaskStateItem[];

  /**
   * Current cultural context for the agent
   */
  culturalContext?: IraqiCulturalContext;

  /**
   * Overall cultural compliance score for the agent state
   */
  overallCulturalScore?: number;

  /**
   * Overall Islamic compliance score for the agent state
   */
  overallIslamicScore?: number;

  /**
   * Active professional domain
   */
  activeProfessionalDomain?: 'legal' | 'medical' | 'educational' | 'business' | 'government' | 'technology' | 'general';

  /**
   * Language preference for this agent state
   */
  languagePreference?: 'arabic' | 'english' | 'mixed';

  /**
   * RTL layout enabled for UI rendering
   */
  rtlLayoutEnabled?: boolean;

  /**
   * Agent coordination metadata
   */
  coordination?: {
    primaryAgent?: string;
    collaboratingAgents?: string[];
    coordinationStrategy?: 'sequential' | 'parallel' | 'conditional';
  };

  /**
   * Performance metrics for Iraqi enhancements
   */
  performanceMetrics?: {
    averageCulturalValidationTime?: number;
    averageIslamicComplianceTime?: number;
    averageArabicProcessingTime?: number;
    totalProcessingTime?: number;
    successRate?: number;
  };

  /**
   * State creation and last update timestamps
   */
  createdAt?: string;
  lastUpdated?: string;
}

/**
 * State management utilities for Iraqi crew coordination
 */
export interface IraqiCrewsStateManager {
  /**
   * Add a new step to the agent state with cultural validation
   */
  addStep(step: Omit<IraqiCrewsToolStateItem, 'id' | 'timestamp'>): Promise<IraqiCrewsToolStateItem>;

  /**
   * Add a new task with Iraqi professional domain context
   */
  addTask(task: Omit<IraqiCrewsTaskStateItem, 'id' | 'timestamp'>): Promise<IraqiCrewsTaskStateItem>;

  /**
   * Update cultural context for the entire agent state
   */
  updateCulturalContext(context: IraqiCulturalContext): Promise<void>;

  /**
   * Get current state with cultural and Islamic compliance scores
   */
  getCurrentState(): Promise<IraqiCrewsAgentState>;

  /**
   * Validate entire agent state for cultural appropriateness
   */
  validateCulturalCompliance(): Promise<{
    passed: boolean;
    overallScore: number;
    issues: string[];
    recommendations: string[];
  }>;

  /**
   * Get performance metrics for Iraqi enhancements
   */
  getPerformanceMetrics(): Promise<{
    averageValidationTime: number;
    successRate: number;
    culturalComplianceRate: number;
    islamicComplianceRate: number;
  }>;
}