import React, { useState, useRef, useCallback, useEffect } from "react";
import { Message } from "ai";
import { toast } from "react-hot-toast";
import { ChatInput } from "./ChatInput";
import { Messages } from "./Messages";
import { VoiceInput } from "./VoiceInput";
import { FileUpload } from "./FileUpload";
import { CulturalValidation } from "./CulturalValidation";
import { LanguageToggle } from "./LanguageToggle";
import { ProfessionalDomainSelector } from "./ProfessionalDomainSelector";
import { ExamplePrompts } from "./ExamplePrompts";
import { StreamingIndicator } from "./StreamingIndicator";
import { ClientOnly } from "~/components/ClientOnly";
import { Workbench } from "~/components/workbench/Workbench.client";
import { Menu } from "~/components/ui/Menu";
import { IconButton } from "~/components/ui/IconButton";
import { useChatStore } from "~/lib/stores/chat";
import { useSettings } from "~/lib/hooks/useSettings";
import {
  useIraqiChatManagement,
  useArabicLanguageProcessing,
  useCulturalValidation,
  useVoiceRecognition,
  useStreamingChat,
} from "~/lib/hooks/iraqi-chat";
import type {
  IraqiChatConfig,
  ProfessionalDomain,
  ArabicLanguage,
} from "~/types/iraqi-chat";

interface BaseChatProps {
  initialMessages?: Message[];
  isLoading?: boolean;
  showWorkbench?: boolean;
  className?: string;
  // Iraqi AI enhancements
  language?: ArabicLanguage;
  professionalDomain?: ProfessionalDomain;
  culturalValidation?: boolean;
  voiceEnabled?: boolean;
  rtlSupport?: boolean;
  iraqiConfig?: IraqiChatConfig;
}

/**
 * Enhanced BaseChat component for Iraqi AI Chat System
 * Features Arabic RTL support, voice recognition, cultural validation,
 * and professional domain specialization
 */
export const BaseChat = React.forwardRef<HTMLDivElement, BaseChatProps>(
  (
    {
      initialMessages = [],
      isLoading = false,
      showWorkbench = false,
      className = "",
      language = "arabic",
      professionalDomain,
      culturalValidation = true,
      voiceEnabled = true,
      rtlSupport = true,
      iraqiConfig = {
        dialectSupport: ["iraqi", "standard"],
        islamicCompliance: true,
        professionalContext: true,
        culturalSensitivity: "high",
      },
    },
    ref,
  ) => {
    // Core chat state
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [currentLanguage, setCurrentLanguage] =
      useState<ArabicLanguage>(language);
    const [selectedDomain, setSelectedDomain] = useState<
      ProfessionalDomain | undefined
    >(professionalDomain);
    const [showExamples, setShowExamples] = useState(!initialMessages.length);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [culturalWarnings, setCulturalWarnings] = useState<string[]>([]);

    // Refs
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Store and settings
    const {
      messages,
      addMessage,
      updateMessage,
      clearMessages,
      isGenerating,
      setIsGenerating,
    } = useChatStore();

    const { settings, updateSettings } = useSettings();

    // Iraqi-specific hooks
    const {
      sendMessage,
      enhancePrompt,
      validateCulturalContent,
      optimizeForArabic,
    } = useIraqiChatManagement({
      language: currentLanguage,
      professionalDomain: selectedDomain,
      culturalValidation,
      iraqiConfig,
    });

    const { processArabicText, detectLanguage, translateText, formatRTL } =
      useArabicLanguageProcessing({
        dialect: iraqiConfig.dialectSupport[0],
        rtlSupport,
      });

    const {
      validateMessage,
      checkIslamicCompliance,
      filterInappropriateContent,
      addCulturalContext,
    } = useCulturalValidation({
      islamicCompliance: iraqiConfig.islamicCompliance,
      culturalSensitivity: iraqiConfig.culturalSensitivity,
      professionalContext: iraqiConfig.professionalContext,
    });

    const {
      isListening,
      startListening,
      stopListening,
      voiceText,
      voiceError,
      isSupported: voiceSupported,
    } = useVoiceRecognition({
      language: currentLanguage === "arabic" ? "ar-IQ" : "en-US",
      continuous: true,
      interimResults: true,
    });

    const {
      streamMessage,
      abortStream,
      isStreaming: streamingActive,
    } = useStreamingChat({
      onMessage: (message) => addMessage(message),
      onError: (error) => toast.error(error.message),
      onComplete: () => setIsStreaming(false),
    });

    // Effects
    useEffect(() => {
      if (voiceText && isVoiceActive) {
        setInput((prev) => prev + " " + voiceText);
      }
    }, [voiceText, isVoiceActive]);

    useEffect(() => {
      if (voiceError) {
        toast.error(`Voice recognition error: ${voiceError.message}`);
        setIsVoiceActive(false);
      }
    }, [voiceError]);

    useEffect(() => {
      // Scroll to bottom when new messages arrive
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
      // Initialize with provided messages
      if (initialMessages.length > 0 && messages.length === 0) {
        initialMessages.forEach((msg) => addMessage(msg));
      }
    }, [initialMessages, messages.length, addMessage]);

    // Event handlers
    const handleSubmit = useCallback(
      async (e?: React.FormEvent) => {
        e?.preventDefault();

        if (!input.trim() || isGenerating || isStreaming) return;

        const messageText = input.trim();
        setInput("");
        setShowExamples(false);

        try {
          // Cultural validation
          if (culturalValidation) {
            const validation = await validateMessage(messageText);
            if (!validation.isValid) {
              setCulturalWarnings(validation.warnings || []);
              toast.error("Message contains culturally inappropriate content");
              return;
            }
            setCulturalWarnings([]);
          }

          // Language processing
          const processedText = await processArabicText(messageText);
          const optimizedText = await optimizeForArabic(processedText);

          // Add cultural context if needed
          const contextualText = await addCulturalContext(
            optimizedText,
            selectedDomain,
          );

          // Create user message
          const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: contextualText,
            createdAt: new Date(),
          };

          addMessage(userMessage);
          setIsStreaming(true);

          // Send message with Iraqi optimizations
          await streamMessage(contextualText, {
            language: currentLanguage,
            professionalDomain: selectedDomain,
            culturalValidation,
            islamicCompliance: iraqiConfig.islamicCompliance,
            dialectSupport: iraqiConfig.dialectSupport,
          });
        } catch (error) {
          console.error("Error sending message:", error);
          toast.error("Failed to send message. Please try again.");
          setIsStreaming(false);
        }
      },
      [
        input,
        isGenerating,
        isStreaming,
        culturalValidation,
        validateMessage,
        processArabicText,
        optimizeForArabic,
        addCulturalContext,
        selectedDomain,
        addMessage,
        streamMessage,
        currentLanguage,
        iraqiConfig,
      ],
    );

    const handleVoiceToggle = useCallback(() => {
      if (!voiceSupported || !voiceEnabled) {
        toast.error("Voice recognition is not supported or disabled");
        return;
      }

      if (isListening) {
        stopListening();
        setIsVoiceActive(false);
      } else {
        startListening();
        setIsVoiceActive(true);
      }
    }, [
      voiceSupported,
      voiceEnabled,
      isListening,
      startListening,
      stopListening,
    ]);

    const handleFileUpload = useCallback(
      async (files: FileList) => {
        // Handle file upload with cultural validation
        for (const file of Array.from(files)) {
          try {
            // Validate file content if it's text
            if (file.type.startsWith("text/")) {
              const content = await file.text();
              if (culturalValidation) {
                const validation = await validateMessage(content);
                if (!validation.isValid) {
                  toast.error(
                    `File "${file.name}" contains inappropriate content`,
                  );
                  continue;
                }
              }
            }

            // Process file upload
            toast.success(`File "${file.name}" uploaded successfully`);
          } catch (error) {
            console.error("File upload error:", error);
            toast.error(`Failed to upload "${file.name}"`);
          }
        }
      },
      [culturalValidation, validateMessage],
    );

    const handleExamplePrompt = useCallback((prompt: string) => {
      setInput(prompt);
      setShowExamples(false);
      textareaRef.current?.focus();
    }, []);

    const handleClearChat = useCallback(() => {
      clearMessages();
      setInput("");
      setShowExamples(true);
      setCulturalWarnings([]);
      toast.success("Chat cleared");
    }, [clearMessages]);

    const handleLanguageChange = useCallback(
      (newLanguage: ArabicLanguage) => {
        setCurrentLanguage(newLanguage);
        updateSettings({ language: newLanguage });
        toast.success(
          `Language changed to ${newLanguage === "arabic" ? "Arabic" : "English"}`,
        );
      },
      [updateSettings],
    );

    const handleDomainChange = useCallback(
      (domain: ProfessionalDomain | undefined) => {
        setSelectedDomain(domain);
        updateSettings({ professionalDomain: domain });
        if (domain) {
          toast.success(`Professional domain: ${domain}`);
        }
      },
      [updateSettings],
    );

    // Render helpers
    const renderChatHeader = () => (
      <div
        className={`flex items-center justify-between p-4 border-b bg-white/80 backdrop-blur-sm ${
          rtlSupport && currentLanguage === "arabic" ? "rtl" : "ltr"
        }`}
      >
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800">
            {currentLanguage === "arabic"
              ? "مساعد الذكاء الاصطناعي العراقي"
              : "Iraqi AI Assistant"}
          </h1>
          {selectedDomain && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {selectedDomain}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
            rtlSupport={rtlSupport}
          />

          <ProfessionalDomainSelector
            selectedDomain={selectedDomain}
            onDomainChange={handleDomainChange}
            language={currentLanguage}
          />

          <IconButton
            onClick={handleClearChat}
            title={currentLanguage === "arabic" ? "مسح المحادثة" : "Clear Chat"}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </IconButton>

          <Menu />
        </div>
      </div>
    );

    const renderMessages = () => (
      <div
        className={`flex-1 overflow-auto ${
          rtlSupport && currentLanguage === "arabic" ? "rtl" : "ltr"
        }`}
      >
        {showExamples && (
          <ExamplePrompts
            onSelectPrompt={handleExamplePrompt}
            language={currentLanguage}
            professionalDomain={selectedDomain}
            className="p-4"
          />
        )}

        <Messages
          messages={messages}
          isLoading={isLoading || isStreaming}
          language={currentLanguage}
          rtlSupport={rtlSupport}
          culturalValidation={culturalValidation}
          professionalDomain={selectedDomain}
        />

        {isStreaming && (
          <StreamingIndicator
            language={currentLanguage}
            className="px-4 pb-4"
          />
        )}

        <div ref={messagesEndRef} />
      </div>
    );

    const renderChatInput = () => (
      <div className="border-t bg-white/90 backdrop-blur-sm">
        {culturalWarnings.length > 0 && (
          <CulturalValidation
            warnings={culturalWarnings}
            language={currentLanguage}
            onDismiss={() => setCulturalWarnings([])}
          />
        )}

        <div className="p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <ChatInput
                ref={textareaRef}
                value={input}
                onChange={setInput}
                onSubmit={handleSubmit}
                disabled={isGenerating || isStreaming}
                placeholder={
                  currentLanguage === "arabic"
                    ? "اكتب رسالتك هنا..."
                    : "Type your message here..."
                }
                language={currentLanguage}
                rtlSupport={rtlSupport}
                className="w-full"
              />
            </div>

            {voiceEnabled && voiceSupported && (
              <VoiceInput
                isListening={isListening}
                isActive={isVoiceActive}
                onToggle={handleVoiceToggle}
                language={currentLanguage === "arabic" ? "ar-IQ" : "en-US"}
                className="flex-shrink-0"
              />
            )}

            <FileUpload
              onFileUpload={handleFileUpload}
              ref={fileInputRef}
              accept=".txt,.pdf,.doc,.docx,.md"
              multiple
              culturalValidation={culturalValidation}
              className="flex-shrink-0"
            />
          </div>
        </div>
      </div>
    );

    return (
      <div
        ref={ref}
        className={`flex h-full ${
          rtlSupport && currentLanguage === "arabic" ? "rtl" : "ltr"
        } ${className}`}
        dir={rtlSupport && currentLanguage === "arabic" ? "rtl" : "ltr"}
      >
        {/* Chat Interface */}
        <div className="flex flex-col flex-1 min-w-0">
          {renderChatHeader()}
          {renderMessages()}
          {renderChatInput()}
        </div>

        {/* Workbench Integration */}
        {showWorkbench && (
          <ClientOnly fallback={<div className="flex-1 bg-gray-100" />}>
            <Workbench
              className="flex-1 border-l"
              language={currentLanguage}
              professionalDomain={selectedDomain}
              culturalValidation={culturalValidation}
              iraqiConfig={iraqiConfig}
            />
          </ClientOnly>
        )}
      </div>
    );
  },
);

BaseChat.displayName = "BaseChat";
