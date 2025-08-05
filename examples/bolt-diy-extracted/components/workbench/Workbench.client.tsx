import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { FileExplorer } from './FileExplorer';
import { CodeEditor } from './CodeEditor';
import { Terminal } from './Terminal';
import { Preview } from './Preview';
import { FileTabs } from './FileTabs';
import { ToolbarActions } from './ToolbarActions';
import { IraqiTemplateGenerator } from './IraqiTemplateGenerator';
import { CulturalCodeValidator } from './CulturalCodeValidator';
import { ArabicCodeComments } from './ArabicCodeComments';
import { ProfessionalDomainScaffold } from './ProfessionalDomainScaffold';
import { IslamicFinanceCalculator } from './IslamicFinanceCalculator';
import { useWorkbenchStore } from '~/lib/stores/workbench';
import { useFileSystem } from '~/lib/hooks/useFileSystem';
import { useCodeExecution } from '~/lib/hooks/useCodeExecution';
import { useIraqiDevelopment } from '~/lib/hooks/useIraqiDevelopment';
import { useProjectScaffolding } from '~/lib/hooks/useProjectScaffolding';
import { useCulturalCodeValidation } from '~/lib/hooks/useCulturalCodeValidation';
import type { 
  ArabicLanguage, 
  ProfessionalDomain, 
  IraqiChatConfig,
  WorkbenchFile,
  ProjectTemplate,
  CulturalValidationResult
} from '~/types/iraqi-chat';

interface WorkbenchProps {
  className?: string;
  language?: ArabicLanguage;
  professionalDomain?: ProfessionalDomain;
  culturalValidation?: boolean;
  iraqiConfig?: IraqiChatConfig;
  initialFiles?: WorkbenchFile[];
  showPreview?: boolean;
  showTerminal?: boolean;
  enableHotReload?: boolean;
}

/**
 * Enhanced Workbench component for Iraqi AI Chat System
 * Complete IDE integration with terminal support, code generation,
 * Iraqi document templates, and professional domain specialization
 */
export const Workbench: React.FC<WorkbenchProps> = ({
  className = '',
  language = 'english',
  professionalDomain,
  culturalValidation = true,
  iraqiConfig = {
    dialectSupport: ['iraqi', 'standard'],
    islamicCompliance: true,
    professionalContext: true,
    culturalSensitivity: 'high'
  },
  initialFiles = [],
  showPreview = true,
  showTerminal = true,
  enableHotReload = true
}) => {
  // State management
  const [activeLayout, setActiveLayout] = useState<'default' | 'code-focus' | 'terminal-focus'>('default');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [terminalCollapsed, setTerminalCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState<'browser' | 'mobile' | 'tablet'>('browser');
  const [isGeneratingTemplate, setIsGeneratingTemplate] = useState(false);
  const [culturalValidationResults, setCulturalValidationResults] = useState<CulturalValidationResult[]>([]);

  // Refs
  const workbenchRef = useRef<HTMLDivElement>(null);
  const codeEditorRef = useRef<any>(null);
  const terminalRef = useRef<any>(null);

  // Store hooks
  const {
    files,
    activeFile,
    openFiles,
    setActiveFile,
    addFile,
    updateFile,
    deleteFile,
    saveFile,
    createDirectory,
    projectRoot,
    setProjectRoot
  } = useWorkbenchStore();

  // File system operations
  const {
    readFile,
    writeFile,
    createFile,
    deleteFileSystem,
    listDirectory,
    watchFiles,
    exportProject,
    importProject
  } = useFileSystem({
    projectRoot,
    onFileChange: (filePath, content) => {
      updateFile(filePath, { content, lastModified: new Date() });
    }
  });

  // Code execution capabilities
  const {
    executeCode,
    runTests,
    buildProject,
    installDependencies,
    startDevServer,
    stopDevServer,
    getExecutionHistory,
    isRunning,
    executionResults
  } = useCodeExecution({
    projectRoot,
    environment: 'node',
    enableHotReload,
    onOutput: (output) => {
      terminalRef.current?.addOutput(output);
    }
  });

  // Iraqi development features
  const {
    generateIraqiTemplate,
    validateCulturalCompliance,
    addArabicComments,
    generateProfessionalScaffold,
    createIslamicFinanceModule,
    optimizeForArabicText,
    translateCodeComments
  } = useIraqiDevelopment({
    language,
    professionalDomain,
    culturalValidation,
    islamicCompliance: iraqiConfig.islamicCompliance
  });

  // Project scaffolding
  const {
    createProject,
    addTemplate,
    generateBoilerplate,
    setupDependencies,
    configureEnvironment,
    applyProjectStructure
  } = useProjectScaffolding({
    professionalDomain,
    culturalValidation,
    arabicSupport: language === 'arabic'
  });

  // Cultural code validation
  const {
    validateCodeCulture,
    checkIslamicCompliance,
    scanForInappropriateContent,
    generateCulturalReport
  } = useCulturalCodeValidation({
    islamicCompliance: iraqiConfig.islamicCompliance,
    culturalSensitivity: iraqiConfig.culturalSensitivity,
    professionalDomain
  });

  // Initialize workbench
  useEffect(() => {
    if (initialFiles.length > 0) {
      initialFiles.forEach(file => {
        addFile(file.path, file);
      });
    }
  }, [initialFiles, addFile]);

  // Watch for file changes and validate
  useEffect(() => {
    if (culturalValidation && activeFile) {
      const validateFile = async () => {
        const result = await validateCodeCulture(activeFile.content);
        setCulturalValidationResults(prev => [
          ...prev.filter(r => r.filePath !== activeFile.path),
          { ...result, filePath: activeFile.path }
        ]);
      };
      
      const debounceTimer = setTimeout(validateFile, 1000);
      return () => clearTimeout(debounceTimer);
    }
  }, [activeFile?.content, culturalValidation, validateCodeCulture, activeFile?.path]);

  // Event handlers
  const handleFileSelect = useCallback((filePath: string) => {
    const file = files[filePath];
    if (file) {
      setActiveFile(file);
    }
  }, [files, setActiveFile]);

  const handleFileCreate = useCallback(async (filePath: string, template?: string) => {
    try {
      let content = '';
      
      if (template) {
        // Generate template-based content
        if (template === 'iraqi-legal') {
          content = await generateIraqiTemplate('legal', filePath);
        } else if (template === 'iraqi-medical') {
          content = await generateIraqiTemplate('medical', filePath);
        } else if (template === 'islamic-finance') {
          content = await createIslamicFinanceModule(filePath);
        } else {
          content = await generateBoilerplate(template, filePath);
        }
      }

      const newFile: WorkbenchFile = {
        path: filePath,
        content,
        language: getFileLanguage(filePath),
        lastModified: new Date(),
        culturallyValidated: culturalValidation,
        arabicSupport: language === 'arabic'
      };

      await createFile(filePath, content);
      addFile(filePath, newFile);
      setActiveFile(newFile);

    } catch (error) {
      console.error('Failed to create file:', error);
    }
  }, [
    generateIraqiTemplate,
    createIslamicFinanceModule,
    generateBoilerplate,
    createFile,
    addFile,
    setActiveFile,
    culturalValidation,
    language
  ]);

  const handleFileUpdate = useCallback(async (filePath: string, content: string) => {
    try {
      await writeFile(filePath, content);
      updateFile(filePath, { 
        content, 
        lastModified: new Date(),
        needsSave: false 
      });

      // Auto-save functionality
      if (enableHotReload) {
        await saveFile(filePath);
      }
    } catch (error) {
      console.error('Failed to update file:', error);
    }
  }, [writeFile, updateFile, saveFile, enableHotReload]);

  const handleFileSave = useCallback(async (filePath: string) => {
    try {
      const file = files[filePath];
      if (file) {
        await writeFile(filePath, file.content);
        await saveFile(filePath);
        
        // Add Arabic comments if requested
        if (language === 'arabic' && file.language === 'javascript') {
          const enhanced = await addArabicComments(file.content);
          if (enhanced !== file.content) {
            updateFile(filePath, { content: enhanced });
          }
        }
      }
    } catch (error) {
      console.error('Failed to save file:', error);
    }
  }, [files, writeFile, saveFile, language, addArabicComments, updateFile]);

  const handleTerminalCommand = useCallback(async (command: string) => {
    try {
      const result = await executeCode(command, 'shell');
      terminalRef.current?.addOutput(result);
    } catch (error) {
      console.error('Terminal command failed:', error);
      terminalRef.current?.addOutput({
        type: 'error',
        content: error instanceof Error ? error.message : 'Command failed'
      });
    }
  }, [executeCode]);

  const handleGenerateTemplate = useCallback(async (templateType: string, targetPath?: string) => {
    setIsGeneratingTemplate(true);
    
    try {
      let content = '';
      const filePath = targetPath || `${templateType}-${Date.now()}.js`;
      
      switch (templateType) {
        case 'iraqi-government-service':
          content = await generateProfessionalScaffold('government', filePath);
          break;
        case 'islamic-finance-calculator':
          content = await createIslamicFinanceModule(filePath);
          break;
        case 'arabic-form-validator':
          content = await generateIraqiTemplate('form-validation', filePath);
          break;
        case 'cultural-content-filter':
          content = await generateIraqiTemplate('content-filter', filePath);
          break;
        default:
          content = await generateIraqiTemplate('basic', filePath);
      }

      await handleFileCreate(filePath, templateType);
      
    } catch (error) {
      console.error('Template generation failed:', error);
    } finally {
      setIsGeneratingTemplate(false);
    }
  }, [generateProfessionalScaffold, createIslamicFinanceModule, generateIraqiTemplate, handleFileCreate]);

  const handleCulturalValidation = useCallback(async () => {
    if (!activeFile) return;
    
    try {
      const result = await validateCulturalCompliance(activeFile.content);
      setCulturalValidationResults(prev => [
        ...prev.filter(r => r.filePath !== activeFile.path),
        { ...result, filePath: activeFile.path }
      ]);
      
      // Show validation results
      terminalRef.current?.addOutput({
        type: 'info',
        content: `Cultural validation completed for ${activeFile.path}. Score: ${result.score}/100`
      });
      
    } catch (error) {
      console.error('Cultural validation failed:', error);
    }
  }, [activeFile, validateCulturalCompliance]);

  // Helper functions
  const getFileLanguage = (filePath: string): string => {
    const extension = filePath.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'json': 'json',
      'md': 'markdown',
      'yml': 'yaml',
      'yaml': 'yaml'
    };
    return languageMap[extension || ''] || 'text';
  };

  const getCurrentValidationResult = useMemo(() => {
    return activeFile 
      ? culturalValidationResults.find(r => r.filePath === activeFile.path)
      : undefined;
  }, [activeFile, culturalValidationResults]);

  // Layout configurations
  const layoutConfigs = {
    default: [30, 40, 30],
    'code-focus': [20, 60, 20],
    'terminal-focus': [25, 25, 50]
  };

  return (
    <div
      ref={workbenchRef}
      className={`flex flex-col h-full bg-gray-50 ${className} ${
        language === 'arabic' ? 'rtl' : 'ltr'
      }`}
      dir={language === 'arabic' ? 'rtl' : 'ltr'}
    >
      {/* Workbench Header */}
      <div className="flex items-center justify-between p-3 bg-white border-b border-gray-200">
        <div className={`flex items-center gap-3 ${
          language === 'arabic' ? 'flex-row-reverse' : 'flex-row'
        }`}>
          <h2 className="text-lg font-semibold text-gray-800">
            {language === 'arabic' ? 'بيئة التطوير' : 'Development Environment'}
          </h2>
          
          {professionalDomain && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {professionalDomain}
            </span>
          )}

          {getCurrentValidationResult && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              getCurrentValidationResult.score >= 80
                ? 'bg-green-100 text-green-800'
                : getCurrentValidationResult.score >= 60
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {language === 'arabic' 
                ? `التقييم الثقافي: ${getCurrentValidationResult.score}/100`
                : `Cultural Score: ${getCurrentValidationResult.score}/100`
              }
            </span>
          )}
        </div>

        <ToolbarActions
          language={language}
          onSave={() => activeFile && handleFileSave(activeFile.path)}
          onRun={() => activeFile && executeCode(activeFile.content, activeFile.language)}
          onBuild={() => buildProject()}
          onTest={() => runTests()}
          onGenerateTemplate={handleGenerateTemplate}
          onCulturalValidation={handleCulturalValidation}
          onExport={() => exportProject()}
          isGenerating={isGeneratingTemplate}
          isRunning={isRunning}
          canSave={activeFile?.needsSave}
          culturalValidation={culturalValidation}
        />
      </div>

      {/* File Tabs */}
      {openFiles.length > 0 && (
        <FileTabs
          files={openFiles}
          activeFile={activeFile}
          onFileSelect={handleFileSelect}
          onFileClose={(filePath) => {
            const file = files[filePath];
            if (file && file.needsSave) {
              // Prompt to save before closing
              if (confirm('File has unsaved changes. Save before closing?')) {
                handleFileSave(filePath);
              }
            }
            deleteFile(filePath);
          }}
          language={language}
          culturalValidationResults={culturalValidationResults}
        />
      )}

      {/* Main Workbench Area */}
      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Sidebar Panel */}
          {!sidebarCollapsed && (
            <>
              <Panel defaultSize={25} minSize={15} maxSize={40}>
                <div className="flex flex-col h-full bg-white border-r border-gray-200">
                  {/* File Explorer */}
                  <div className="flex-1">
                    <FileExplorer
                      files={files}
                      projectRoot={projectRoot}
                      onFileSelect={handleFileSelect}
                      onFileCreate={handleFileCreate}
                      onFileDelete={deleteFile}
                      onDirectoryCreate={createDirectory}
                      language={language}
                      professionalDomain={professionalDomain}
                      culturalValidation={culturalValidation}
                    />
                  </div>

                  {/* Iraqi Template Generator */}
                  <div className="border-t border-gray-200">
                    <IraqiTemplateGenerator
                      language={language}
                      professionalDomain={professionalDomain}
                      onGenerateTemplate={handleGenerateTemplate}
                      isGenerating={isGeneratingTemplate}
                    />
                  </div>
                </div>
              </Panel>
              <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-gray-400 transition-colors" />
            </>
          )}

          {/* Main Content Panel */}
          <Panel defaultSize={sidebarCollapsed ? 70 : 50} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Code Editor */}
              <Panel defaultSize={terminalCollapsed ? 100 : 70} minSize={30}>
                <div className="h-full bg-white">
                  {activeFile ? (
                    <CodeEditor
                      ref={codeEditorRef}
                      file={activeFile}
                      language={activeFile.language}
                      onChange={(content) => handleFileUpdate(activeFile.path, content)}
                      onSave={() => handleFileSave(activeFile.path)}
                      arabicSupport={language === 'arabic'}
                      culturalValidation={culturalValidation}
                      professionalDomain={professionalDomain}
                      validationResult={getCurrentValidationResult}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-lg">
                          {language === 'arabic' 
                            ? 'اختر ملفاً للتحرير'
                            : 'Select a file to edit'
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Panel>

              {/* Terminal Panel */}
              {showTerminal && !terminalCollapsed && (
                <>
                  <PanelResizeHandle className="h-1 bg-gray-300 hover:bg-gray-400 transition-colors" />
                  <Panel defaultSize={30} minSize={15} maxSize={50}>
                    <Terminal
                      ref={terminalRef}
                      onCommand={handleTerminalCommand}
                      language={language}
                      projectRoot={projectRoot}
                      executionResults={executionResults}
                      isRunning={isRunning}
                    />
                  </Panel>
                </>
              )}
            </PanelGroup>
          </Panel>

          {/* Preview Panel */}
          {showPreview && (
            <>
              <PanelResizeHandle className="w-1 bg-gray-300 hover:bg-gray-400 transition-colors" />
              <Panel defaultSize={30} minSize={20} maxSize={50}>
                <Preview
                  projectRoot={projectRoot}
                  activeFile={activeFile}
                  mode={previewMode}
                  onModeChange={setPreviewMode}
                  language={language}
                  rtlSupport={language === 'arabic'}
                  culturalValidation={culturalValidation}
                />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>

      {/* Cultural Validation Overlay */}
      {culturalValidation && getCurrentValidationResult && getCurrentValidationResult.warnings.length > 0 && (
        <CulturalCodeValidator
          result={getCurrentValidationResult}
          language={language}
          onDismiss={() => setCulturalValidationResults(prev => 
            prev.filter(r => r.filePath !== activeFile?.path)
          )}
          onFix={async (fixes) => {
            if (activeFile) {
              let fixedContent = activeFile.content;
              for (const fix of fixes) {
                fixedContent = await fix.apply(fixedContent);
              }
              handleFileUpdate(activeFile.path, fixedContent);
            }
          }}
        />
      )}

      {/* Islamic Finance Calculator Modal */}
      {professionalDomain === 'finance' && (
        <IslamicFinanceCalculator
          language={language}
          onCalculate={(result) => {
            // Insert calculation result into code
            if (activeFile && codeEditorRef.current) {
              const calculationCode = `
// Islamic Finance Calculation Result
const calculation = ${JSON.stringify(result, null, 2)};
`;
              codeEditorRef.current.insertText(calculationCode);
            }
          }}
        />
      )}
    </div>
  );
};