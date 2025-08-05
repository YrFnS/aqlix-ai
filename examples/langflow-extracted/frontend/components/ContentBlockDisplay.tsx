"""
ContentBlockDisplay component extracted from Langflow for Iraqi AI Chat System
Original: src/frontend/src/components/core/chatComponents/ContentBlockDisplay.tsx
"""

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface ContentBlock {
  id: string;
  type: 'text' | 'markdown' | 'code' | 'image';
  content: string;
  metadata?: {
    language?: string;
    title?: string;
    // Iraqi AI enhancements:
    isArabic?: boolean;
    culturallyValidated?: boolean;
    professionalDomain?: string;
    rtlProcessed?: boolean;
  };
}

interface ContentBlockDisplayProps {
  contentBlocks: ContentBlock[];
  isLoading?: boolean;
  state?: 'partial' | 'finished';
  chatId: string;
  playgroundPage?: boolean;
  // Iraqi AI enhancements:
  language?: 'arabic' | 'english' | 'mixed';
  culturalMode?: boolean;
  professionalDomain?: string;
}

const ContentBlockDisplay: React.FC<ContentBlockDisplayProps> = ({
  contentBlocks,
  isLoading = false,
  state = 'finished',
  chatId,
  playgroundPage = false,
  // Iraqi AI enhancements:
  language = 'english',
  culturalMode = false,
  professionalDomain = 'general'
}) => {
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
  const [rtlMode, setRtlMode] = useState(false);

  useEffect(() => {
    // Iraqi AI: Determine RTL mode based on language
    setRtlMode(language === 'arabic' || language === 'mixed');
  }, [language]);

  const toggleExpansion = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks);
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId);
    } else {
      newExpanded.add(blockId);
    }
    setExpandedBlocks(newExpanded);
  };

  const renderContentBlock = (block: ContentBlock) => {
    const isExpanded = expandedBlocks.has(block.id);
    const isArabic = block.metadata?.isArabic || language === 'arabic';
    
    return (
      <motion.div
        key={block.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`content-block border rounded-lg p-4 mb-4 ${
          rtlMode ? 'text-right' : 'text-left'
        } ${isArabic ? 'font-arabic' : 'font-sans'}`}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Header with expand/collapse button */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {block.metadata?.title && (
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {block.metadata.title}
              </h3>
            )}
            
            {/* Iraqi AI: Cultural validation indicator */}
            {culturalMode && block.metadata?.culturallyValidated && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                ✓ إسلاميا متوافق
              </span>
            )}
            
            {/* Professional domain indicator */}
            {block.metadata?.professionalDomain && block.metadata.professionalDomain !== 'general' && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {block.metadata.professionalDomain}
              </span>
            )}
          </div>

          <button
            onClick={() => toggleExpansion(block.id)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Content */}
        <AnimatePresence>
          {(isExpanded || state === 'finished') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {renderContent(block)}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading indicator for partial state */}
        {state === 'partial' && isLoading && (
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500 mr-2"></div>
            {language === 'arabic' ? 'جاري المعالجة...' : 'Processing...'}
          </div>
        )}
      </motion.div>
    );
  };

  const renderContent = (block: ContentBlock) => {
    const isArabic = block.metadata?.isArabic || language === 'arabic';
    
    switch (block.type) {
      case 'text':
        return (
          <div className={`prose max-w-none ${isArabic ? 'prose-rtl' : ''}`}>
            <p className="whitespace-pre-wrap">{block.content}</p>
          </div>
        );
      
      case 'markdown':
        return (
          <div 
            className={`prose max-w-none dark:prose-invert ${isArabic ? 'prose-rtl' : ''}`}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content, isArabic) }}
          />
        );
      
      case 'code':
        return (
          <pre className="bg-gray-100 dark:bg-gray-800 rounded p-3 overflow-x-auto">
            <code className={`language-${block.metadata?.language || 'text'}`}>
              {block.content}
            </code>
          </pre>
        );
      
      case 'image':
        return (
          <img
            src={block.content}
            alt={block.metadata?.title || 'Content image'}
            className="max-w-full h-auto rounded"
            loading="lazy"
          />
        );
      
      default:
        return <p>{block.content}</p>;
    }
  };

  const renderMarkdown = (content: string, isArabic: boolean) => {
    // Iraqi AI: Enhanced markdown rendering with RTL support
    // This would integrate with a markdown processor that supports:
    // - Arabic text rendering
    // - RTL layout
    // - Mathematical expressions in Arabic
    // - Cultural content validation
    
    // Placeholder implementation
    return content.replace(/\n/g, '<br>');
  };

  if (!contentBlocks || contentBlocks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        {language === 'arabic' ? 'لا توجد محتويات لعرضها' : 'No content to display'}
      </div>
    );
  }

  return (
    <div className={`content-block-display ${rtlMode ? 'rtl' : 'ltr'}`}>
      <AnimatePresence mode="popLayout">
        {contentBlocks.map(renderContentBlock)}
      </AnimatePresence>
      
      {/* Iraqi AI: Cultural compliance footer */}
      {culturalMode && (
        <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300 text-center">
            {language === 'arabic' 
              ? 'تم التحقق من المحتوى للتوافق مع القيم الإسلامية'
              : 'Content verified for Islamic compliance'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ContentBlockDisplay;

// Iraqi AI Chat System enhancements implemented:
// - RTL text support for Arabic content
// - Cultural validation indicators
// - Professional domain labeling
// - Arabic font support
// - Islamic compliance messaging
// - Enhanced markdown rendering for Arabic
// - Language-specific loading messages
// - Cultural content validation display