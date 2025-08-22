/**
 * Iraqi AI System - Workflow Engine Type Definitions
 * Enhanced types for cultural intelligence and Arabic RTL support
 */

export type ExecutionStatus = 
  | 'new'
  | 'running' 
  | 'success'
  | 'error'
  | 'canceled'
  | 'waiting'
  | 'warning';

export interface IExecutionResponse {
  data: IRunExecutionData;
  mode: 'cli' | 'error' | 'integrated' | 'internal' | 'manual' | 'retry' | 'trigger' | 'webhook';
  startedAt: Date;
  stoppedAt: Date | null;
  finished: boolean;
  culturalCompliance?: ICulturalComplianceMetrics;
}

export interface IRunExecutionData {
  resultData?: {
    runData: IRunData;
    pinData?: IPinData;
    workflowData?: IWorkflowBase;
    lastNodeExecuted?: string;
    error?: ExecutionError;
  };
  executionData?: {
    contextData: IExecuteContextData;
    nodeExecutionStack: IExecuteData[];
    metadata: IExecutionMetadata;
    waitingExecution: IWaitingForExecution;
    waitingExecutionSource: IWaitingForExecutionSource | null;
  };
  startData?: {
    destinationNode?: string;
    runNodeFilter?: string[];
  };
}

export interface IWorkflowSettings {
  executionOrder: 'v0' | 'v1';
  saveManualExecutions: boolean;
  callerPolicy: string;
  errorWorkflow?: string;
  timezone: string;
  // Iraqi-specific additions
  culturalValidation?: {
    enabled: boolean;
    islamicCompliance: boolean;
    arabicTextProcessing: boolean;
    professionalDomain?: string;
  };
}

export interface IWorkflowExecuteAdditionalData {
  credentialsHelper: any;
  hooks?: IWorkflowExecuteHooks;
  executeWorkflow: any;
  restApiUrl: string;
  instanceBaseUrl: string;
  formWaitingBaseUrl: string;
  webhookBaseUrl: string;
  webhookWaitingBaseUrl: string;
  webhookTestBaseUrl: string;
  currentNodeParameters?: any;
  executionTimeoutTimestamp?: number;
  userId?: string;
  variables: any;
}

export interface IWorkflowExecuteHooks {
  workflowExecuteBefore?: (workflow: any) => Promise<void>;
  workflowExecuteAfter?: (data: IExecutionResponse, workflow: any) => Promise<void>;
  nodeExecuteBefore?: (nodeName: string, node: INode) => Promise<void>;
  nodeExecuteAfter?: (nodeName: string, data: any, node: INode) => Promise<void>;
}

export interface INode {
  id: string;
  name: string;
  typeVersion: number;
  type: string;
  position: [number, number];
  disabled?: boolean;
  notes?: string;
  notesInFlow?: boolean;
  retryOnFail?: boolean;
  maxTries?: number;
  waitBetweenTries?: number;
  alwaysOutputData?: boolean;
  executeOnce?: boolean;
  onError?: 'stopWorkflow' | 'continueRegularOutput' | 'continueErrorOutput';
  continueOnFail?: boolean;
  parameters: INodeParameters;
  credentials?: INodeCredentials;
  webhookId?: string;
  // Iraqi-specific node properties
  culturalSettings?: {
    islamicCompliant: boolean;
    arabicTextEnabled: boolean;
    iraqiServiceIntegration?: string;
  };
}

export interface INodeParameters {
  [key: string]: any;
}

export interface INodeCredentials {
  [key: string]: INodeCredentialsDetails;
}

export interface INodeCredentialsDetails {
  id: string;
  name?: string;
}

export interface IExecuteData {
  data: ITaskData;
  node: INode;
  source: ISourceData | null;
}

export interface ITaskData {
  main: INodeExecutionData[][];
  binary?: IBinaryKeyData[];
  error?: ExecutionError;
}

export interface INodeExecutionData {
  json: IDataObject;
  binary?: IBinaryKeyData;
  error?: ExecutionError;
  pairedItem?: IPairedItemData | IPairedItemData[];
  // Iraqi-specific execution data
  culturalMetadata?: {
    arabicTextProcessed: boolean;
    islamicComplianceScore: number;
    iraqiTimezoneAdjusted: boolean;
  };
}

export interface IDataObject {
  [key: string]: any;
}

export interface IBinaryKeyData {
  [key: string]: IBinaryData;
}

export interface IBinaryData {
  data: string;
  mimeType: string;
  fileExtension?: string;
  fileName?: string;
  directory?: string;
  fileSize?: number;
  id?: string;
}

export interface IPairedItemData {
  item: number;
  input?: number;
}

export interface ISourceData {
  previousNode: string;
  previousNodeOutput?: number;
  previousNodeRun?: number;
}

export interface IRunData {
  [key: string]: ITaskData[];
}

export interface IPinData {
  [key: string]: INodeExecutionData[];
}

export interface IWorkflowBase {
  id?: string;
  name: string;
  active: boolean;
  nodes: INode[];
  connections: IConnections;
  settings?: IWorkflowSettings;
  staticData?: IDataObject;
  pinData?: IPinData;
  versionId?: string;
  meta?: IWorkflowMetadata;
  // Iraqi-specific workflow properties
  culturalProfile?: {
    targetAudience: 'government' | 'private' | 'education' | 'healthcare';
    languageSupport: 'arabic' | 'english' | 'bilingual';
    islamicCompliance: boolean;
    ministryApproval?: string;
  };
}

export interface IConnections {
  [key: string]: {
    [type: string]: IConnection[][];
  };
}

export interface IConnection {
  node: string;
  type: string;
  index: number;
}

export interface IWorkflowMetadata {
  instanceId?: string;
  onboardingId?: string;
  templateId?: string;
  templateCredsSetupCompleted?: boolean;
  // Iraqi-specific metadata
  culturalValidation?: {
    lastValidated: string;
    validatorVersion: string;
    complianceScore: number;
  };
}

export interface IExecuteContextData {
  node: INode;
  data: ITaskData;
  source: ISourceData | null;
}

export interface IExecutionMetadata {
  instanceId: string;
  userId?: string;
  workflowId: string;
  workflowName?: string;
}

export interface IWaitingForExecution {
  [key: string]: {
    [key: string]: ITaskData;
  };
}

export interface IWaitingForExecutionSource {
  [key: string]: {
    [key: string]: ISourceData;
  };
}

export class ExecutionError extends Error {
  constructor(
    message: string,
    public node?: INode,
    public description?: string,
    public context?: IDataObject,
    public cause?: Error,
    // Iraqi-specific error properties
    public culturalIssue?: {
      type: 'islamic_compliance' | 'arabic_processing' | 'cultural_sensitivity';
      severity: 'low' | 'medium' | 'high' | 'critical';
      recommendations: string[];
    }
  ) {
    super(message);
    this.name = 'ExecutionError';
  }
}

// Iraqi Cultural Intelligence Types

export interface ICulturalComplianceMetrics {
  islamicCompliance: number; // 0-1 score
  arabicProcessing: number; // 0-1 score
  timezonCompliance: number; // 0-1 score
  overallScore: number; // 0-1 score
  lastValidated?: Date;
  validationDetails?: {
    islamicIssues: string[];
    arabicIssues: string[];
    timezoneIssues: string[];
    recommendations: string[];
  };
}

export interface IIslamicComplianceConfig {
  strictMode: boolean;
  professionalDomain: 'health' | 'education' | 'interior' | 'justice' | 'general';
  allowedBusinessHours?: {
    start: string; // HH:mm format
    end: string; // HH:mm format
    excludeFriday?: boolean;
    excludeRamadan?: boolean;
  };
  contentFilters?: {
    financialInterest: boolean; // Riba checking
    halalCompliance: boolean;
    prayerTimeRespect: boolean;
  };
}

export interface IArabicProcessingConfig {
  enableRTL: boolean;
  dialectRecognition: boolean;
  mixedLanguageSupport: boolean;
  fontSupport: {
    primaryFont: string;
    fallbackFonts: string[];
  };
  textDirection?: {
    arabic: 'rtl';
    english: 'ltr';
    mixed: 'auto';
  };
}

export interface IIraqiTimezoneConfig {
  timezone: 'Asia/Baghdad';
  hijriCalendar: boolean;
  prayerTimeAwareness: boolean;
  workingHours: {
    sunday: { start: string; end: string; };
    monday: { start: string; end: string; };
    tuesday: { start: string; end: string; };
    wednesday: { start: string; end: string; };
    thursday: { start: string; end: string; };
    friday?: { start: string; end: string; }; // Optional for government offices
    saturday: { start: string; end: string; };
  };
  holidays: {
    islamic: string[]; // Hijri dates
    national: string[]; // Gregorian dates
  };
}

export interface IIraqiServiceIntegration {
  paymentGateways: {
    zainCash: {
      enabled: boolean;
      minAmount: number; // 1000 IQD
      maxAmount: number;
      merchantId?: string;
    };
    fastPay: {
      enabled: boolean;
      minAmount: number; // 500 IQD
      maxAmount: number;
      apiKey?: string;
    };
    nassWallet: {
      enabled: boolean;
      minAmount: number; // 1000 IQD
      maxAmount: number;
      partnerId?: string;
    };
  };
  
  governmentAPIs: {
    citizenId: {
      enabled: boolean;
      verificationEndpoint?: string;
      certificateValidation: boolean;
    };
    ministryServices: {
      health: { enabled: boolean; endpoints: string[]; };
      education: { enabled: boolean; endpoints: string[]; };
      interior: { enabled: boolean; endpoints: string[]; };
      justice: { enabled: boolean; endpoints: string[]; };
    };
  };
  
  arabicNLP: {
    dialectProcessing: boolean;
    sentimentAnalysis: boolean;
    namedEntityRecognition: boolean;
    textClassification: boolean;
  };
}

// Node Type Definitions for Iraqi Services

export interface IIraqiPaymentNode extends INode {
  type: 'iraqi-payment';
  parameters: {
    gateway: 'zainCash' | 'fastPay' | 'nassWallet';
    amount: number;
    currency: 'IQD';
    description: string;
    arabicDescription?: string;
    customerPhone: string;
    culturalValidation: boolean;
  };
}

export interface IIraqiGovernmentNode extends INode {
  type: 'iraqi-government';
  parameters: {
    ministry: 'health' | 'education' | 'interior' | 'justice';
    service: string;
    citizenId?: string;
    arabicForm: boolean;
    bilingualOutput: boolean;
  };
}

export interface IIraqiArabicNLPNode extends INode {
  type: 'iraqi-arabic-nlp';
  parameters: {
    operation: 'sentiment' | 'entity' | 'classification' | 'translation';
    text: string;
    dialect: 'baghdadi' | 'basri' | 'moslawi' | 'standard';
    outputFormat: 'json' | 'text';
  };
}

export interface ICulturalValidationNode extends INode {
  type: 'cultural-validation';
  parameters: {
    validationType: 'islamic' | 'arabic' | 'professional' | 'complete';
    strictMode: boolean;
    professionalDomain?: string;
    generateReport: boolean;
  };
}