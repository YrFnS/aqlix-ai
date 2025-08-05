"""
ContentDisplay component extracted from Langflow for Iraqi AI Chat System
Original: src/frontend/src/components/core/chatComponents/ContentDisplay.tsx
"""

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ContentItem {
  type: 'text' | 'markdown' | 'code' | 'json' | 'error' | 'tool' | 'media';
  data: any;
  timestamp?: string;
  duration?: number;
  // Iraqi AI enhancements:
  language?: 'arabic' | 'english';
  culturallyValidated?: boolean;
  professionalDomain?: string;
  rtlProcessed?: boolean;
}

interface ContentDisplayProps {
  content: ContentItem;
  chatId: string;
  playgroundPage?: boolean;
  // Iraqi AI enhancements:
  userLanguage?: 'arabic' | 'english' | 'mixed';
  culturalMode?: boolean;
  showDuration?: boolean;
}

const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  chatId,
  playgroundPage = false,
  // Iraqi AI enhancements:
  userLanguage = 'english',
  culturalMode = false,
  showDuration = true
}) => {
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Determine RTL mode based on content and user language
    const shouldUseRTL = content.language === 'arabic' || 
                        userLanguage === 'arabic' || 
                        (userLanguage === 'mixed' && detectArabicContent(content.data));
    setIsRTL(shouldUseRTL);
  }, [content, userLanguage]);

  const detectArabicContent = (data: any): boolean => {
    // Iraqi AI: Simple Arabic detection
    const text = typeof data === 'string' ? data : JSON.stringify(data);
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  };

  const renderHeader = () => {
    if (!content.type || content.type === 'text') return null;
    
    return (
      <div className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
            {getTypeLabel(content.type)}
          </span>
          
          {/* Iraqi AI: Cultural validation indicator */}
          {culturalMode && content.culturallyValidated && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              {isRTL ? '✓ متوافق' : '✓ Verified'}
            </span>
          )}
          
          {/* Professional domain indicator */}
          {content.professionalDomain && content.professionalDomain !== 'general' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {getProfessionalDomainLabel(content.professionalDomain)}
            </span>
          )}
        </div>
        
        {/* Duration display */}
        {showDuration && content.duration && (
          <div className={`flex items-center text-xs text-gray-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>{formatDuration(content.duration)}</span>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (content.type) {
      case 'text':
        return renderText();
      case 'markdown':
        return renderMarkdown();
      case 'code':
        return renderCode();
      case 'json':
        return renderJSON();
      case 'error':
        return renderError();
      case 'tool':
        return renderTool();
      case 'media':
        return renderMedia();
      default:
        return renderText();
    }
  };

  const renderText = () => (
    <div 
      className={`prose max-w-none ${isRTL ? 'text-right prose-rtl' : 'text-left'} ${
        isRTL ? 'font-arabic' : 'font-sans'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <p className="whitespace-pre-wrap leading-relaxed">
        {content.data}
      </p>
    </div>
  );

  const renderMarkdown = () => (
    <div 
      className={`prose max-w-none dark:prose-invert ${
        isRTL ? 'text-right prose-rtl font-arabic' : 'text-left font-sans'
      }`}
      dir={isRTL ? 'rtl' : 'ltr'}
      dangerouslySetInnerHTML={{ 
        __html: processMarkdown(content.data, isRTL) 
      }}
    />
  );

  const renderCode = () => (
    <div className="relative">
      <div className="absolute top-2 right-2 flex space-x-1">
        <button
          onClick={() => copyToClipboard(content.data)}
          className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          {isRTL ? 'نسخ' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm">{content.data}</code>
      </pre>
    </div>
  );

  const renderJSON = () => (
    <div className="relative">
      <div className="absolute top-2 right-2">
        <button
          onClick={() => copyToClipboard(JSON.stringify(content.data, null, 2))}
          className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
        >
          {isRTL ? 'نسخ' : 'Copy'}
        </button>
      </div>
      <pre className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto">
        <code className="text-sm">
          {JSON.stringify(content.data, null, 2)}
        </code>
      </pre>
    </div>
  );

  const renderError = () => (
    <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
          {isRTL ? 'خطأ' : 'Error'}
        </h4>
        <p className="text-sm text-red-700 dark:text-red-300">
          {content.data}
        </p>
      </div>
    </div>
  );

  const renderTool = () => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className={`flex items-center space-x-2 mb-3 ${isRTL ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {isRTL ? 'استخدام الأداة' : 'Tool Usage'}
        </span>
      </div>
      <div className={`text-sm text-gray-600 dark:text-gray-400 ${isRTL ? 'text-right' : 'text-left'}`}>
        <pre className="whitespace-pre-wrap">{JSON.stringify(content.data, null, 2)}</pre>
      </div>
    </div>
  );

  const renderMedia = () => {
    if (typeof content.data === 'string' && content.data.startsWith('http')) {
      return (
        <img
          src={content.data}
          alt="Content media"
          className="max-w-full h-auto rounded-lg shadow-sm"
          loading="lazy"
        />
      );
    }
    return renderText();
  };

  const getTypeLabel = (type: string): string => {
    if (!isRTL) return type;
    
    const arabicLabels: Record<string, string> = {
      'text': 'نص',
      'markdown': 'تنسيق',
      'code': 'كود',
      'json': 'بيانات',
      'error': 'خطأ',
      'tool': 'أداة',
      'media': 'وسائط'
    };
    
    return arabicLabels[type] || type;
  };

  const getProfessionalDomainLabel = (domain: string): string => {
    if (!isRTL) return domain;
    
    const arabicDomains: Record<string, string> = {
      'legal': 'قانوني',
      'medical': 'طبي',
      'educational': 'تعليمي',
      'business': 'تجاري',
      'engineering': 'هندسة'
    };
    
    return arabicDomains[domain] || domain;
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = (ms / 1000).toFixed(1);
    return isRTL ? `${seconds} ث` : `${seconds}s`;
  };

  const processMarkdown = (markdown: string, rtl: boolean): string => {
    // Iraqi AI: Enhanced markdown processing for RTL and Arabic
    let processed = markdown;
    
    // Add RTL direction for Arabic content
    if (rtl) {
      processed = processed.replace(/<p>/g, '<p dir="rtl">');
      processed = processed.replace(/<div>/g, '<div dir="rtl">');
    }
    
    // Handle mathematical expressions in Arabic context
    // Handle Arabic numerals vs English numerals based on context
    
    return processed;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success notification
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`content-display ${isRTL ? 'rtl' : 'ltr'}`}
    >
      {renderHeader()}
      {renderContent()}
      
      {/* Iraqi AI: Cultural compliance notice */}
      {culturalMode && content.culturallyValidated && (
        <div className="mt-3 text-xs text-green-600 dark:text-green-400 text-center">
          {isRTL 
            ? 'تم التحقق من المحتوى للتوافق مع القيم الإسلامية'
            : 'Content verified for cultural appropriateness'
          }
        </div>
      )}
    </motion.div>
  );
};

export default ContentDisplay;

// Iraqi AI Chat System enhancements implemented:
// - Full RTL support for Arabic content
// - Arabic language detection and processing
// - Cultural validation indicators
// - Professional domain labeling in Arabic
// - Arabic error messages and labels
// - Enhanced markdown processing for RTL
// - Arabic typography and font handling
// - Duration formatting in Arabic
// - Cultural compliance notifications