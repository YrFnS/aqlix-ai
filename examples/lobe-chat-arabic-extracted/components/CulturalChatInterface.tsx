/**
 * Iraqi Cultural Chat Interface Component
 * Extracted and enhanced from lobe-chat with Iraqi cultural context
 * 
 * Features:
 * - Cultural greetings and interaction patterns
 * - Professional domain interface adaptation
 * - Islamic compliance UI elements
 * - Iraqi dialect-aware responses
 * - Mixed Arabic-English conversation support
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRTL, useCulturalAdaptation, useAutoDirection } from './RTLProvider';

export interface CulturalMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  language: 'ar' | 'en' | 'mixed';
  dialect?: 'baghdad' | 'basra' | 'mosul' | 'general' | 'standard';
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
  culturalContext?: {
    islamicContent: boolean;
    culturalReferences: string[];
    formalityLevel: 'formal' | 'informal' | 'professional';
  };
  metadata?: {
    confidence: number;
    suggestions?: string[];
    corrections?: string[];
  };
}

export interface CulturalChatInterfaceProps {
  messages: CulturalMessage[];
  onSendMessage: (message: string, metadata?: any) => void;
  onMessageUpdate?: (messageId: string, updates: Partial<CulturalMessage>) => void;
  isLoading?: boolean;
  welcomeMessage?: string;
  professionalMode?: boolean;
  enableDialectDetection?: boolean;
  enableCulturalAdaptation?: boolean;
  className?: string;
}

export function CulturalChatInterface({
  messages,
  onSendMessage,
  onMessageUpdate,
  isLoading = false,
  welcomeMessage,
  professionalMode = false,
  enableDialectDetection = true,
  enableCulturalAdaptation = true,
  className = ''
}: CulturalChatInterfaceProps) {
  const {
    direction,
    language,
    dialect,
    professionalDomain,
    culturalTheme,
    formatText,
    detectTextDirection,
    detectDialect
  } = useRTL();
  
  const {
    getCulturalGreeting,
    getCulturalFarewell,
    adaptContent
  } = useCulturalAdaptation();

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [culturalSuggestions, setCulturalSuggestions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cultural phrases for suggestions
  const culturalPhrases = {
    islamic: {
      ar: [
        'بسم الله نبدأ',
        'إن شاء الله',
        'بارك الله فيك',
        'جزاك الله خيراً',
        'حفظك الله',
        'في أمان الله'
      ],
      en: [
        'In the name of Allah',
        'God willing',
        'May Allah bless you',
        'May Allah reward you',
        'May Allah protect you',
        'Go in peace'
      ]
    },
    iraqi: {
      baghdad: [
        'شلونك اليوم؟',
        'شكو ماكو؟',
        'زين، ماشي الحال',
        'الله وياك',
        'سلامات عليك',
        'شدسوي هسة؟'
      ],
      basra: [
        'شلونچم؟',
        'شكد الحال؟',
        'هوائي زين',
        'الله معاچ',
        'بالسلامة',
        'وين رايح؟'
      ],
      mosul: [
        'شونك؟',
        'كيفچم اليوم؟',
        'هاي زين',
        'الله معك',
        'سلامات',
        'شد تسوي؟'
      ]
    },
    professional: {
      legal: [
        'حسب القانون العراقي',
        'في ضوء التشريعات',
        'وفقاً للأنظمة',
        'بموجب القانون',
        'حسب الأصول القانونية',
        'As per Iraqi law'
      ],
      medical: [
        'من الناحية الطبية',
        'حسب الإجراءات الطبية',
        'بناءً على التشخيص',
        'وفقاً للبروتوكول',
        'حسب الأخلاق الطبية',
        'Medically speaking'
      ],
      educational: [
        'من الناحية التعليمية',
        'حسب المناهج',
        'وفقاً للمعايير',
        'في السياق التعليمي',
        'حسب الأساليب التربوية',
        'Educationally'
      ]
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate cultural suggestions based on context
  const generateCulturalSuggestions = useCallback((text: string) => {
    if (!enableCulturalAdaptation) return [];

    const suggestions: string[] = [];
    const lowerText = text.toLowerCase();

    // Islamic suggestions
    if (culturalTheme === 'islamic') {
      if (lowerText.includes('start') || lowerText.includes('begin') || lowerText.includes('نبدأ')) {
        suggestions.push(...culturalPhrases.islamic[language === 'ar' ? 'ar' : 'en']);
      }
    }

    // Iraqi dialect suggestions
    if (culturalTheme === 'iraqi' && dialect) {
      const dialectPhrases = culturalPhrases.iraqi[dialect as keyof typeof culturalPhrases.iraqi];
      if (dialectPhrases) {
        suggestions.push(...dialectPhrases);
      }
    }

    // Professional domain suggestions
    if (professionalMode && professionalDomain) {
      const domainPhrases = culturalPhrases.professional[professionalDomain as keyof typeof culturalPhrases.professional];
      if (domainPhrases) {
        suggestions.push(...domainPhrases);
      }
    }

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }, [culturalTheme, dialect, professionalDomain, language, professionalMode, enableCulturalAdaptation]);

  // Handle input change with cultural adaptation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsTyping(value.length > 0);

    // Generate suggestions based on input
    if (value.length > 2) {
      const suggestions = generateCulturalSuggestions(value);
      setCulturalSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // Handle message send with cultural processing
  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    // Detect text properties
    const textDirection = detectTextDirection(textToSend);
    const detectedDialect = enableDialectDetection ? detectDialect(textToSend) : null;
    
    // Adapt content culturally
    const adaptedContent = enableCulturalAdaptation ? adaptContent(textToSend) : textToSend;

    // Create message metadata
    const metadata = {
      direction: textDirection,
      detectedDialect,
      culturalTheme,
      professionalDomain,
      timestamp: new Date()
    };

    // Send message with metadata
    onSendMessage(adaptedContent, metadata);

    // Clear input and suggestions
    setInputValue('');
    setShowSuggestions(false);
    setCulturalSuggestions([]);
    setIsTyping(false);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    const newValue = inputValue + (inputValue ? ' ' : '') + suggestion;
    setInputValue(newValue);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get message formatting
  const getMessageFormatting = (message: CulturalMessage) => {
    const formatting = formatText(message.content);
    
    let additionalClasses = '';
    
    // Add sender-specific styling
    if (message.sender === 'user') {
      additionalClasses += ' message-user';
    } else {
      additionalClasses += ' message-assistant';
    }

    // Add professional domain styling
    if (message.professionalDomain) {
      additionalClasses += ` professional-${message.professionalDomain}`;
    }

    // Add cultural context styling
    if (message.culturalContext?.islamicContent) {
      additionalClasses += ' islamic-content';
    }

    if (message.culturalContext?.formalityLevel) {
      additionalClasses += ` ${message.culturalContext.formalityLevel}-tone`;
    }

    return {
      ...formatting,
      className: formatting.className + additionalClasses
    };
  };

  // Render welcome message
  const renderWelcomeMessage = () => {
    if (!welcomeMessage && messages.length > 0) return null;

    const greeting = welcomeMessage || getCulturalGreeting();
    const { className, direction: msgDirection, lang } = formatText(greeting);

    return (
      <div className={`welcome-message ${className} rtl-card islamic-theme`} dir={msgDirection} lang={lang}>
        <div className="welcome-content">
          <h3 className="welcome-title">
            {language === 'ar' ? 'مرحباً بك في النظام' : 'Welcome to the System'}
          </h3>
          <p className="welcome-text">{greeting}</p>
          {professionalMode && professionalDomain && (
            <p className="professional-notice">
              {language === 'ar' 
                ? `تم تفعيل الوضع المهني: ${professionalDomain === 'legal' ? 'القانوني' : 
                                               professionalDomain === 'medical' ? 'الطبي' :
                                               professionalDomain === 'educational' ? 'التعليمي' :
                                               professionalDomain === 'business' ? 'التجاري' : 'الهندسي'}`
                : `Professional mode active: ${professionalDomain}`}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render message bubble
  const renderMessage = (message: CulturalMessage) => {
    const formatting = getMessageFormatting(message);
    const isUser = message.sender === 'user';

    return (
      <div
        key={message.id}
        className={`message-container ${isUser ? 'user-message' : 'assistant-message'} ${direction}`}
        dir={formatting.direction}
      >
        <div className={`message-bubble ${formatting.className}`} lang={formatting.lang}>
          <div className="message-content">
            {message.content}
          </div>
          
          {message.metadata?.suggestions && (
            <div className="message-suggestions">
              <small className="suggestions-label">
                {language === 'ar' ? 'اقتراحات:' : 'Suggestions:'}
              </small>
              <div className="suggestions-list">
                {message.metadata.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="suggestion-button"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="message-meta">
            <span className="message-time">
              {message.timestamp.toLocaleTimeString(language === 'ar' ? 'ar-IQ' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            
            {message.dialect && (
              <span className="message-dialect">
                {message.dialect}
              </span>
            )}
            
            {message.professionalDomain && (
              <span className="message-domain">
                {message.professionalDomain}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const inputFormatting = useAutoDirection(inputValue);

  return (
    <div className={`cultural-chat-interface ${direction}-layout ${className}`} dir={direction}>
      {/* Welcome Message */}
      {renderWelcomeMessage()}
      
      {/* Messages Container */}
      <div className="messages-container rtl-container">
        {messages.map(renderMessage)}
        
        {isLoading && (
          <div className="loading-indicator rtl-flex rtl-items-center">
            <div className="loading-spinner"></div>
            <span className="loading-text">
              {language === 'ar' ? 'يكتب...' : 'Typing...'}
            </span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Cultural Suggestions */}
      {showSuggestions && culturalSuggestions.length > 0 && (
        <div className="cultural-suggestions rtl-container">
          <div className="suggestions-header">
            <span className="suggestions-title">
              {language === 'ar' ? 'اقتراحات ثقافية:' : 'Cultural Suggestions:'}
            </span>
          </div>
          <div className="suggestions-grid">
            {culturalSuggestions.map((suggestion, index) => {
              const suggestionFormatting = formatText(suggestion);
              return (
                <button
                  key={index}
                  className={`suggestion-chip ${suggestionFormatting.className}`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  dir={suggestionFormatting.direction}
                  lang={suggestionFormatting.lang}
                >
                  {suggestion}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="input-area rtl-container">
        <div className="input-wrapper rtl-flex">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder={
              language === 'ar' 
                ? (professionalMode ? 'اكتب استفسارك المهني هنا...' : 'اكتب رسالتك هنا...')
                : (professionalMode ? 'Type your professional inquiry...' : 'Type your message...')
            }
            className={`message-input ${inputFormatting.className}`}
            dir={inputFormatting.direction}
            lang={inputFormatting.lang}
            disabled={isLoading}
          />
          
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputValue.trim() || isLoading}
            className="send-button rtl-btn"
            title={language === 'ar' ? 'إرسال' : 'Send'}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className={`send-icon ${direction === 'rtl' ? 'rtl-flip' : ''}`}
            >
              <path
                d="M2 21l21-9L2 3v7l15 2-15 2v7z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {/* Input Meta Information */}
        {isTyping && inputValue && (
          <div className="input-meta">
            <div className="input-stats">
              <span className="text-direction">
                {inputFormatting.direction === 'rtl' ? 'عربي' : 
                 inputFormatting.direction === 'mixed' ? 'مختلط' : 'English'}
              </span>
              
              {enableDialectDetection && inputFormatting.direction !== 'ltr' && (
                <span className="detected-dialect">
                  {detectDialect(inputValue) || 'عام'}
                </span>
              )}
              
              <span className="char-count">
                {inputValue.length}/1000
              </span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .cultural-chat-interface {
          display: flex;
          flex-direction: column;
          height: 100%;
          max-height: 600px;
          background: var(--chat-background, #f8f9fa);
          border-radius: 12px;
          overflow: hidden;
        }

        .welcome-message {
          padding: 1.5rem;
          margin: 1rem;
          border-radius: 12px;
          text-align: center;
        }

        .welcome-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
          font-weight: 600;
        }

        .welcome-text {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .professional-notice {
          margin: 0;
          font-size: 0.9rem;
          opacity: 0.8;
          font-weight: 500;
        }

        .messages-container {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message-container {
          display: flex;
          flex-direction: column;
        }

        .message-container.user-message {
          align-items: flex-start;
        }

        .message-container.assistant-message {
          align-items: flex-end;
        }

        .message-bubble {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 18px;
          word-wrap: break-word;
          line-height: 1.5;
        }

        .message-bubble.message-user {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 18px 18px 6px 18px;
        }

        .message-bubble.message-assistant {
          background: white;
          color: #2d3748;
          border: 1px solid #e2e8f0;
          border-radius: 18px 18px 18px 6px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .message-content {
          margin-bottom: 0.5rem;
        }

        .message-meta {
          display: flex;
          gap: 0.5rem;
          font-size: 0.75rem;
          opacity: 0.7;
          margin-top: 0.25rem;
        }

        .cultural-suggestions {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          background: white;
        }

        .suggestions-title {
          font-size: 0.875rem;
          font-weight: 500;
          color: #4a5568;
          margin-bottom: 0.5rem;
          display: block;
        }

        .suggestions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .suggestion-chip {
          padding: 0.25rem 0.75rem;
          border: 1px solid #cbd5e0;
          border-radius: 16px;
          background: white;
          color: #4a5568;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .suggestion-chip:hover {
          background: #edf2f7;
          border-color: #a0aec0;
        }

        .input-area {
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          background: white;
        }

        .input-wrapper {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .message-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid #cbd5e0;
          border-radius: 24px;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }

        .message-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .send-button {
          padding: 0.75rem;
          border: none;
          border-radius: 50%;
          background: #667eea;
          color: white;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-button:hover:not(:disabled) {
          background: #5a67d8;
          transform: translateY(-1px);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .send-icon.rtl-flip {
          transform: scaleX(-1);
        }

        .input-meta {
          margin-top: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .input-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.75rem;
          color: #718096;
        }

        .loading-indicator {
          padding: 1rem;
          justify-content: center;
          gap: 0.5rem;
        }

        .loading-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #cbd5e0;
          border-top: 2px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          font-size: 0.875rem;
          color: #718096;
        }

        /* Professional domain styling */
        .professional-legal {
          border-left: 4px solid #3182ce;
        }

        .professional-medical {
          border-left: 4px solid #38a169;
        }

        .professional-educational {
          border-left: 4px solid #d69e2e;
        }

        .professional-business {
          border-left: 4px solid #805ad5;
        }

        .professional-engineering {
          border-left: 4px solid #dd6b20;
        }

        /* Cultural themes */
        .islamic-content {
          background: linear-gradient(135deg, #e6fffa 0%, #f0fff4 100%);
          border: 1px solid #9ae6b4;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .message-bubble {
            max-width: 90%;
          }
          
          .suggestions-grid {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}