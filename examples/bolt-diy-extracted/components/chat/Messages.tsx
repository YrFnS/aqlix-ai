import React, { useMemo, useState, useCallback } from 'react';
import { Message } from 'ai';
import { Markdown } from '~/components/ui/Markdown';
import { Avatar } from '~/components/ui/Avatar';
import { IconButton } from '~/components/ui/IconButton';
import { CopyButton } from '~/components/ui/CopyButton';
import { RegenerateButton } from '~/components/ui/RegenerateButton';
import { CulturalValidationBadge } from './CulturalValidationBadge';
import { ArabicTextRenderer } from './ArabicTextRenderer';
import { ProfessionalDomainBadge } from './ProfessionalDomainBadge';
import { MessageActions } from './MessageActions';
import { useMessageProcessing } from '~/lib/hooks/useMessageProcessing';
import { useCulturalValidation } from '~/lib/hooks/useCulturalValidation';
import { useArabicTextProcessing } from '~/lib/hooks/useArabicTextProcessing';
import type { ArabicLanguage, ProfessionalDomain } from '~/types/iraqi-chat';

interface MessagesProps {
  messages: Message[];
  isLoading?: boolean;
  language?: ArabicLanguage;
  rtlSupport?: boolean;
  culturalValidation?: boolean;
  professionalDomain?: ProfessionalDomain;
  showTimestamps?: boolean;
  showActions?: boolean;
  className?: string;
  onMessageRegenerate?: (messageId: string) => void;
  onMessageEdit?: (messageId: string, newContent: string) => void;
  onMessageDelete?: (messageId: string) => void;
}

/**
 * Enhanced Messages component for Iraqi AI Chat System
 * Features Arabic RTL support, cultural validation indicators,
 * professional domain context, and comprehensive message actions
 */
export const Messages: React.FC<MessagesProps> = ({
  messages,
  isLoading = false,
  language = 'english',
  rtlSupport = true,
  culturalValidation = true,
  professionalDomain,
  showTimestamps = true,
  showActions = true,
  className = '',
  onMessageRegenerate,
  onMessageEdit,
  onMessageDelete
}) => {
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set());
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set());

  // Hooks for message processing
  const {
    processMessage,
    detectLanguage,
    formatMessage,
    addMessageMetadata
  } = useMessageProcessing({
    language,
    professionalDomain,
    culturalValidation
  });

  const {
    validateMessage,
    getCulturalScore,
    getIslamicComplianceStatus,
    getProfessionalAppropriatenessScore
  } = useCulturalValidation({
    islamicCompliance: true,
    culturalSensitivity: 'high',
    professionalContext: true
  });

  const {
    formatArabicText,
    detectTextDirection,
    renderBidirectionalText
  } = useArabicTextProcessing({
    language,
    dialect: 'iraqi'
  });

  // Process messages with enhancements
  const processedMessages = useMemo(() => {
    return messages.map(message => {
      const processedContent = processMessage(message.content);
      const detectedLanguage = detectLanguage(message.content);
      const textDirection = rtlSupport ? detectTextDirection(message.content) : 'ltr';
      
      return {
        ...message,
        processedContent,
        detectedLanguage,
        textDirection,
        metadata: {
          culturalScore: culturalValidation ? getCulturalScore(message.content) : undefined,
          islamicCompliance: culturalValidation ? getIslamicComplianceStatus(message.content) : undefined,
          professionalScore: professionalDomain ? getProfessionalAppropriatenessScore(message.content) : undefined,
          wordCount: message.content.split(' ').length,
          characterCount: message.content.length,
          hasArabicText: /[\u0600-\u06FF]/.test(message.content),
          hasEnglishText: /[a-zA-Z]/.test(message.content),
          isMixed: /[\u0600-\u06FF]/.test(message.content) && /[a-zA-Z]/.test(message.content)
        }
      };
    });
  }, [
    messages,
    processMessage,
    detectLanguage,
    detectTextDirection,
    rtlSupport,
    culturalValidation,
    getCulturalScore,
    getIslamicComplianceStatus,
    getProfessionalAppropriatenessScore,
    professionalDomain
  ]);

  // Event handlers
  const handleToggleExpanded = useCallback((messageId: string) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  const handleToggleSelected = useCallback((messageId: string) => {
    setSelectedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  }, []);

  const formatTimestamp = useCallback((date: Date) => {
    if (language === 'arabic') {
      return new Intl.DateTimeFormat('ar-IQ', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      }).format(date);
    }
    
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  }, [language]);

  const renderMessageHeader = (message: any) => (
    <div className={`flex items-center justify-between mb-2 ${
      message.textDirection === 'rtl' ? 'flex-row-reverse' : 'flex-row'
    }`}>
      <div className={`flex items-center gap-2 ${
        message.textDirection === 'rtl' ? 'flex-row-reverse' : 'flex-row'
      }`}>
        <Avatar
          role={message.role}
          size="sm"
          className={message.role === 'assistant' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
        />
        
        <span className="font-medium text-sm text-gray-700">
          {message.role === 'assistant' 
            ? (language === 'arabic' ? 'المساعد' : 'Assistant')
            : (language === 'arabic' ? 'أنت' : 'You')
          }
        </span>

        {/* Professional domain indicator */}
        {message.role === 'assistant' && professionalDomain && (
          <ProfessionalDomainBadge
            domain={professionalDomain}
            language={language}
            size="sm"
          />
        )}

        {/* Language indicator for mixed content */}
        {message.metadata.isMixed && (
          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
            {language === 'arabic' ? 'مختلط' : 'Mixed'}
          </span>
        )}
      </div>

      <div className={`flex items-center gap-2 ${
        message.textDirection === 'rtl' ? 'flex-row-reverse' : 'flex-row'
      }`}>
        {/* Timestamp */}
        {showTimestamps && message.createdAt && (
          <span className="text-xs text-gray-500">
            {formatTimestamp(new Date(message.createdAt))}
          </span>
        )}

        {/* Selection checkbox */}
        <input
          type="checkbox"
          checked={selectedMessages.has(message.id)}
          onChange={() => handleToggleSelected(message.id)}
          className="w-4 h-4 text-blue-600 rounded"
        />
      </div>
    </div>
  );

  const renderMessageContent = (message: any) => {
    const isExpanded = expandedMessages.has(message.id);
    const shouldTruncate = message.content.length > 500 && !isExpanded;
    const displayContent = shouldTruncate 
      ? message.content.substring(0, 500) + '...'
      : message.content;

    return (
      <div className={`${
        message.textDirection === 'rtl' ? 'text-right' : 'text-left'
      }`} dir={message.textDirection}>
        {message.metadata.hasArabicText ? (
          <ArabicTextRenderer
            content={displayContent}
            language={message.detectedLanguage}
            dialect="iraqi"
            rtlSupport={rtlSupport}
            professionalDomain={professionalDomain}
          />
        ) : (
          <Markdown
            content={displayContent}
            className={`prose max-w-none ${
              language === 'arabic' ? 'prose-arabic' : ''
            }`}
          />
        )}

        {/* Expand/Collapse button */}
        {message.content.length > 500 && (
          <button
            onClick={() => handleToggleExpanded(message.id)}
            className={`mt-2 text-sm text-blue-600 hover:text-blue-800 ${
              message.textDirection === 'rtl' ? 'text-right' : 'text-left'
            }`}
          >
            {isExpanded 
              ? (language === 'arabic' ? 'عرض أقل' : 'Show less')
              : (language === 'arabic' ? 'عرض المزيد' : 'Show more')
            }
          </button>
        )}
      </div>
    );
  };

  const renderMessageFooter = (message: any) => (
    <div className={`flex items-center justify-between mt-3 pt-3 border-t border-gray-100 ${
      message.textDirection === 'rtl' ? 'flex-row-reverse' : 'flex-row'
    }`}>
      {/* Cultural validation indicators */}
      <div className={`flex items-center gap-2 ${
        message.textDirection === 'rtl' ? 'flex-row-reverse' : 'flex-row'
      }`}>
        {culturalValidation && (
          <CulturalValidationBadge
            culturalScore={message.metadata.culturalScore}
            islamicCompliance={message.metadata.islamicCompliance}
            professionalScore={message.metadata.professionalScore}
            language={language}
            size="sm"
          />
        )}

        {/* Message statistics */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>
            {language === 'arabic' 
              ? `${message.metadata.wordCount} كلمة`
              : `${message.metadata.wordCount} words`
            }
          </span>
          <span>
            {language === 'arabic'
              ? `${message.metadata.characterCount} حرف`
              : `${message.metadata.characterCount} chars`
            }
          </span>
        </div>
      </div>

      {/* Message actions */}
      {showActions && (
        <MessageActions
          message={message}
          language={language}
          onCopy={() => navigator.clipboard.writeText(message.content)}
          onRegenerate={onMessageRegenerate ? () => onMessageRegenerate(message.id) : undefined}
          onEdit={onMessageEdit ? (newContent) => onMessageEdit(message.id, newContent) : undefined}
          onDelete={onMessageDelete ? () => onMessageDelete(message.id) : undefined}
          className={message.textDirection === 'rtl' ? 'flex-row-reverse' : 'flex-row'}
        />
      )}
    </div>
  );

  const renderMessage = (message: any, index: number) => (
    <div
      key={message.id || index}
      className={`mb-6 ${
        message.role === 'assistant' 
          ? 'bg-blue-50 border border-blue-100' 
          : 'bg-white border border-gray-200'
      } rounded-lg p-4 shadow-sm transition-all duration-200 hover:shadow-md ${
        selectedMessages.has(message.id) ? 'ring-2 ring-blue-300' : ''
      }`}
    >
      {renderMessageHeader(message)}
      {renderMessageContent(message)}
      {renderMessageFooter(message)}
    </div>
  );

  if (processedMessages.length === 0 && !isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 text-gray-500 ${className}`}>
        <div className={`text-center ${
          rtlSupport && language === 'arabic' ? 'rtl' : 'ltr'
        }`}>
          <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-lg font-medium">
            {language === 'arabic' 
              ? 'ابدأ محادثة جديدة'
              : 'Start a new conversation'
            }
          </p>
          <p className="text-sm mt-2">
            {language === 'arabic'
              ? 'اكتب رسالة لبدء التفاعل مع المساعد الذكي'
              : 'Type a message to start interacting with the AI assistant'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} ${
      rtlSupport && language === 'arabic' ? 'rtl' : 'ltr'
    }`} dir={rtlSupport && language === 'arabic' ? 'rtl' : 'ltr'}>
      {/* Selected messages actions */}
      {selectedMessages.size > 0 && (
        <div className="sticky top-0 z-10 bg-blue-100 border border-blue-200 rounded-lg p-3 mb-4">
          <div className={`flex items-center justify-between ${
            rtlSupport && language === 'arabic' ? 'flex-row-reverse' : 'flex-row'
          }`}>
            <span className="text-sm font-medium text-blue-800">
              {language === 'arabic' 
                ? `${selectedMessages.size} رسائل محددة`
                : `${selectedMessages.size} messages selected`
              }
            </span>
            
            <div className={`flex gap-2 ${
              rtlSupport && language === 'arabic' ? 'flex-row-reverse' : 'flex-row'
            }`}>
              <button
                onClick={() => {
                  const selectedContent = processedMessages
                    .filter(m => selectedMessages.has(m.id))
                    .map(m => m.content)
                    .join('\n\n');
                  navigator.clipboard.writeText(selectedContent);
                }}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                {language === 'arabic' ? 'نسخ' : 'Copy'}
              </button>
              
              <button
                onClick={() => setSelectedMessages(new Set())}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
              >
                {language === 'arabic' ? 'إلغاء التحديد' : 'Deselect'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Messages list */}
      <div className="space-y-4">
        {processedMessages.map((message, index) => renderMessage(message, index))}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
            <span className="text-gray-600">
              {language === 'arabic' 
                ? 'يتم الآن إنشاء الرد...'
                : 'Generating response...'
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};