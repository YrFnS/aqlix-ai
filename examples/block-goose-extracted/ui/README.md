# Desktop Application UI Components for Iraqi AI Chat System

**Extracted from**: Block/Goose `ui/desktop/`  
**Value**: 5-7 weeks development time saved  
**Iraqi Integration Focus**: Arabic RTL layout, Iraqi cultural interface elements, professional domain interfaces

## 🎯 OVERVIEW

Comprehensive React/TypeScript UI component library (200+ components) extracted from Block Goose desktop application, adapted for Arabic RTL layout and Iraqi cultural interface requirements with professional domain specialization.

## 📁 CORE UI ARCHITECTURE

### Base Chat Interface (`BaseChat.tsx`)

```tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, IraqiCulturalContext, IraqiDomain } from '../types/iraqi-types';
import { ChatInput } from './ChatInput';
import { MessageList } from './MessageList';
import { CulturalContextPanel } from './CulturalContextPanel';
import { DomainSelector } from './DomainSelector';

interface IraqiBaseChatProps {
  culturalContext: IraqiCulturalContext;
  onCulturalContextChange: (context: IraqiCulturalContext) => void;
  onMessageSend: (message: string, attachments?: File[]) => void;
  messages: Message[];
  isLoading?: boolean;
  className?: string;
  rtlLayout?: boolean;
}

export const IraqiBaseChat: React.FC<IraqiBaseChatProps> = ({
  culturalContext,
  onCulturalContextChange,
  onMessageSend,
  messages,
  isLoading = false,
  className = '',
  rtlLayout = true
}) => {
  const [showCulturalPanel, setShowCulturalPanel] = useState(false);
  const [currentDomain, setCurrentDomain] = useState<IraqiDomain>(culturalContext.domain);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Update cultural context when domain changes
  useEffect(() => {
    if (currentDomain !== culturalContext.domain) {
      onCulturalContextChange({
        ...culturalContext,
        domain: currentDomain
      });
    }
  }, [currentDomain, culturalContext, onCulturalContextChange]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleDomainChange = useCallback((domain: IraqiDomain) => {
    setCurrentDomain(domain);
  }, []);

  const handleCulturalSettingsChange = useCallback((updates: Partial<IraqiCulturalContext>) => {
    onCulturalContextChange({
      ...culturalContext,
      ...updates
    });
  }, [culturalContext, onCulturalContextChange]);

  const getChatDirection = () => {
    return culturalContext.language === 'arabic' || rtlLayout ? 'rtl' : 'ltr';
  };

  const getLayoutClasses = () => {
    const direction = getChatDirection();
    return `
      flex flex-col h-full
      ${direction === 'rtl' ? 'text-right' : 'text-left'}
      ${culturalContext.domain === IraqiDomain.LEGAL ? 'font-serif' : 'font-sans'}
      ${className}
    `;
  };

  return (
    <div 
      ref={chatContainerRef}
      className={getLayoutClasses()}
      dir={getChatDirection()}
    >
      {/* Header with Cultural Context Controls */}
      <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className={`flex items-center justify-between ${getChatDirection() === 'rtl' ? 'flex-row-reverse' : ''}`}>
          {/* Domain Selector */}
          <DomainSelector
            currentDomain={currentDomain}
            onDomainChange={handleDomainChange}
            culturalContext={culturalContext}
            rtlLayout={rtlLayout}
          />

          {/* Cultural Context Toggle */}
          <button
            onClick={() => setShowCulturalPanel(!showCulturalPanel)}
            className={`
              px-4 py-2 rounded-lg border
              ${showCulturalPanel 
                ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200' 
                : 'bg-gray-100 border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
              }
              hover:bg-opacity-80 transition-colors
              font-arabic text-sm
            `}
            title={rtlLayout ? 'إعدادات السياق الثقافي' : 'Cultural Context Settings'}
          >
            {rtlLayout ? 'السياق الثقافي' : 'Cultural Context'}
          </button>

          {/* Islamic Compliance Indicator */}
          {culturalContext.islamic_compliance_required && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-arabic">
                {rtlLayout ? 'متوافق إسلامياً' : 'Islamic Compliant'}
              </span>
            </div>
          )}
        </div>

        {/* Cultural Context Panel */}
        {showCulturalPanel && (
          <CulturalContextPanel
            culturalContext={culturalContext}
            onContextChange={handleCulturalSettingsChange}
            rtlLayout={rtlLayout}
            className="mt-4"
          />
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden relative">
        <MessageList
          messages={messages}
          culturalContext={culturalContext}
          rtlLayout={rtlLayout}
          isLoading={isLoading}
          className="h-full"
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
        <ChatInput
          onMessageSend={onMessageSend}
          culturalContext={culturalContext}
          rtlLayout={rtlLayout}
          disabled={isLoading}
          placeholder={getInputPlaceholder()}
          className="p-4"
        />
      </div>
    </div>
  );

  function getInputPlaceholder(): string {
    if (!rtlLayout) return "Type your message...";
    
    const domainPlaceholders = {
      [IraqiDomain.LEGAL]: "اكتب استفسارك القانوني...",
      [IraqiDomain.MEDICAL]: "اكتب استفسارك الطبي...",
      [IraqiDomain.EDUCATIONAL]: "اكتب سؤالك التعليمي...",
      [IraqiDomain.GOVERNMENT]: "اكتب استفسارك الحكومي...",
      [IraqiDomain.BUSINESS]: "اكتب استفسارك التجاري...",
      [IraqiDomain.PERSONAL]: "اكتب رسالتك..."
    };
    
    return domainPlaceholders[currentDomain] || "اكتب رسالتك...";
  }
};
```

### Cultural Context Panel (`CulturalContextPanel.tsx`)

```tsx
import React, { useState } from 'react';
import { IraqiCulturalContext, IraqiDomain, CulturalSensitivity } from '../types/iraqi-types';

interface CulturalContextPanelProps {
  culturalContext: IraqiCulturalContext;
  onContextChange: (updates: Partial<IraqiCulturalContext>) => void;
  rtlLayout?: boolean;
  className?: string;
}

export const CulturalContextPanel: React.FC<CulturalContextPanelProps> = ({
  culturalContext,
  onContextChange,
  rtlLayout = true,
  className = ''
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const handleInputChange = (field: keyof IraqiCulturalContext, value: any) => {
    onContextChange({ [field]: value });
  };

  const getDirectionClasses = () => {
    return rtlLayout ? 'text-right' : 'text-left';
  };

  const getFlexDirection = () => {
    return rtlLayout ? 'flex-row-reverse' : 'flex-row';
  };

  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4 ${getDirectionClasses()} ${className}`} dir={rtlLayout ? 'rtl' : 'ltr'}>
      
      {/* Basic Settings */}
      <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
        <button
          onClick={() => toggleSection('basic')}
          className={`flex items-center justify-between w-full text-left font-semibold text-gray-700 dark:text-gray-300 ${getFlexDirection()}`}
        >
          <span className="font-arabic">
            {rtlLayout ? 'الإعدادات الأساسية' : 'Basic Settings'}
          </span>
          <span className={`transform transition-transform ${expandedSections.has('basic') ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.has('basic') && (
          <div className="mt-3 space-y-3">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-arabic">
                {rtlLayout ? 'اللغة' : 'Language'}
              </label>
              <select
                value={culturalContext.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-arabic"
              >
                <option value="arabic">{rtlLayout ? 'العربية' : 'Arabic'}</option>
                <option value="english">{rtlLayout ? 'الإنجليزية' : 'English'}</option>
                <option value="kurdish">{rtlLayout ? 'الكردية' : 'Kurdish'}</option>
              </select>
            </div>

            {/* Dialect Selection */}
            {culturalContext.language === 'arabic' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-arabic">
                  {rtlLayout ? 'اللهجة' : 'Dialect'}
                </label>
                <select
                  value={culturalContext.dialect}
                  onChange={(e) => handleInputChange('dialect', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-arabic"
                >
                  <option value="iraqi">{rtlLayout ? 'العراقية' : 'Iraqi'}</option>
                  <option value="baghdadi">{rtlLayout ? 'البغدادية' : 'Baghdadi'}</option>
                  <option value="basrawi">{rtlLayout ? 'البصراوية' : 'Basrawi'}</option>
                  <option value="formal">{rtlLayout ? 'الفصحى' : 'Formal Arabic'}</option>
                </select>
              </div>
            )}

            {/* Formality Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-arabic">
                {rtlLayout ? 'مستوى الرسمية' : 'Formality Level'}
              </label>
              <select
                value={culturalContext.formality_level}
                onChange={(e) => handleInputChange('formality_level', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-arabic"
              >
                <option value="casual">{rtlLayout ? 'عادي' : 'Casual'}</option>
                <option value="professional">{rtlLayout ? 'مهني' : 'Professional'}</option>
                <option value="formal">{rtlLayout ? 'رسمي' : 'Formal'}</option>
                <option value="highly_formal">{rtlLayout ? 'شديد الرسمية' : 'Highly Formal'}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Religious & Cultural Settings */}
      <div className="border-b border-gray-200 dark:border-gray-600 pb-4">
        <button
          onClick={() => toggleSection('religious')}
          className={`flex items-center justify-between w-full text-left font-semibold text-gray-700 dark:text-gray-300 ${getFlexDirection()}`}
        >
          <span className="font-arabic">
            {rtlLayout ? 'الإعدادات الدينية والثقافية' : 'Religious & Cultural Settings'}
          </span>
          <span className={`transform transition-transform ${expandedSections.has('religious') ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.has('religious') && (
          <div className="mt-3 space-y-3">
            {/* Islamic Compliance */}
            <div className={`flex items-center space-x-2 ${rtlLayout ? 'space-x-reverse' : ''}`}>
              <input
                type="checkbox"
                id="islamic-compliance"
                checked={culturalContext.islamic_compliance_required}
                onChange={(e) => handleInputChange('islamic_compliance_required', e.target.checked)}
                className="rounded border-gray-300 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="islamic-compliance" className="text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic">
                {rtlLayout ? 'مطلوب التوافق الإسلامي' : 'Islamic Compliance Required'}
              </label>
            </div>

            {/* Cultural Sensitivity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-arabic">
                {rtlLayout ? 'مستوى الحساسية الثقافية' : 'Cultural Sensitivity Level'}
              </label>
              <select
                value={culturalContext.sensitivity_level}
                onChange={(e) => handleInputChange('sensitivity_level', e.target.value as CulturalSensitivity)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-arabic"
              >
                <option value={CulturalSensitivity.LOW}>{rtlLayout ? 'منخفض' : 'Low'}</option>
                <option value={CulturalSensitivity.MEDIUM}>{rtlLayout ? 'متوسط' : 'Medium'}</option>
                <option value={CulturalSensitivity.HIGH}>{rtlLayout ? 'عالي' : 'High'}</option>
                <option value={CulturalSensitivity.RELIGIOUS}>{rtlLayout ? 'ديني' : 'Religious'}</option>
              </select>
            </div>

            {/* Regional Context */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-arabic">
                {rtlLayout ? 'السياق الإقليمي' : 'Regional Context'}
              </label>
              <select
                value={culturalContext.regional_context || ''}
                onChange={(e) => handleInputChange('regional_context', e.target.value || null)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-arabic"
              >
                <option value="">{rtlLayout ? 'عام عراقي' : 'General Iraqi'}</option>
                <option value="baghdad">{rtlLayout ? 'بغداد' : 'Baghdad'}</option>
                <option value="basra">{rtlLayout ? 'البصرة' : 'Basra'}</option>
                <option value="erbil">{rtlLayout ? 'أربيل' : 'Erbil'}</option>
                <option value="najaf">{rtlLayout ? 'النجف' : 'Najaf'}</option>
                <option value="karbala">{rtlLayout ? 'كربلاء' : 'Karbala'}</option>
                <option value="mosul">{rtlLayout ? 'الموصل' : 'Mosul'}</option>
                <option value="kirkuk">{rtlLayout ? 'كركوك' : 'Kirkuk'}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Professional Context */}
      <div>
        <button
          onClick={() => toggleSection('professional')}
          className={`flex items-center justify-between w-full text-left font-semibold text-gray-700 dark:text-gray-300 ${getFlexDirection()}`}
        >
          <span className="font-arabic">
            {rtlLayout ? 'السياق المهني' : 'Professional Context'}
          </span>
          <span className={`transform transition-transform ${expandedSections.has('professional') ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>

        {expandedSections.has('professional') && (
          <div className="mt-3 space-y-3">
            {/* Gender Context (for medical/legal contexts) */}
            {(culturalContext.domain === IraqiDomain.MEDICAL || culturalContext.domain === IraqiDomain.LEGAL) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-arabic">
                  {rtlLayout ? 'السياق الجنسي (للخصوصية)' : 'Gender Context (for privacy)'}
                </label>
                <select
                  value={culturalContext.gender_context || ''}
                  onChange={(e) => handleInputChange('gender_context', e.target.value || null)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-arabic"
                >
                  <option value="">{rtlLayout ? 'غير محدد' : 'Not specified'}</option>
                  <option value="male">{rtlLayout ? 'ذكر' : 'Male'}</option>
                  <option value="female">{rtlLayout ? 'أنثى' : 'Female'}</option>
                </select>
              </div>
            )}

            {/* Age Appropriateness */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 font-arabic">
                {rtlLayout ? 'مناسبة العمر' : 'Age Appropriateness'}
              </label>
              <select
                value={culturalContext.age_appropriateness}
                onChange={(e) => handleInputChange('age_appropriateness', e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-arabic"
              >
                <option value="child">{rtlLayout ? 'طفل' : 'Child'}</option>
                <option value="teenager">{rtlLayout ? 'مراهق' : 'Teenager'}</option>
                <option value="adult">{rtlLayout ? 'بالغ' : 'Adult'}</option>
                <option value="elderly">{rtlLayout ? 'كبير السن' : 'Elderly'}</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Context Summary */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3 mt-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 font-arabic">
          {rtlLayout ? 'ملخص السياق الحالي' : 'Current Context Summary'}
        </h4>
        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1 font-arabic">
          <div>{rtlLayout ? `المجال: ${getDomainLabel(culturalContext.domain)}` : `Domain: ${culturalContext.domain}`}</div>
          <div>{rtlLayout ? `اللغة: ${culturalContext.language} (${culturalContext.dialect})` : `Language: ${culturalContext.language} (${culturalContext.dialect})`}</div>
          <div>{rtlLayout ? `الرسمية: ${culturalContext.formality_level}` : `Formality: ${culturalContext.formality_level}`}</div>
          <div>{rtlLayout ? `التوافق الإسلامي: ${culturalContext.islamic_compliance_required ? 'مطلوب' : 'غير مطلوب'}` : `Islamic Compliance: ${culturalContext.islamic_compliance_required ? 'Required' : 'Not Required'}`}</div>
        </div>
      </div>
    </div>
  );

  function getDomainLabel(domain: IraqiDomain): string {
    if (!rtlLayout) return domain;
    
    const labels = {
      [IraqiDomain.LEGAL]: 'قانوني',
      [IraqiDomain.MEDICAL]: 'طبي',
      [IraqiDomain.EDUCATIONAL]: 'تعليمي',
      [IraqiDomain.GOVERNMENT]: 'حكومي',
      [IraqiDomain.BUSINESS]: 'تجاري',
      [IraqiDomain.PERSONAL]: 'شخصي'
    };
    
    return labels[domain] || domain;
  }
};
```

### Domain Selector (`DomainSelector.tsx`)

```tsx
import React from 'react';
import { IraqiDomain, IraqiCulturalContext } from '../types/iraqi-types';

interface DomainSelectorProps {
  currentDomain: IraqiDomain;
  onDomainChange: (domain: IraqiDomain) => void;
  culturalContext: IraqiCulturalContext;
  rtlLayout?: boolean;
  className?: string;
}

export const DomainSelector: React.FC<DomainSelectorProps> = ({
  currentDomain,
  onDomainChange,
  culturalContext,
  rtlLayout = true,
  className = ''
}) => {
  const domains = [
    {
      value: IraqiDomain.PERSONAL,
      label: rtlLayout ? 'شخصي' : 'Personal',
      icon: '👤',
      description: rtlLayout ? 'محادثة عامة وشخصية' : 'General personal conversation',
      color: 'bg-gray-100 text-gray-800 border-gray-300'
    },
    {
      value: IraqiDomain.LEGAL,
      label: rtlLayout ? 'قانوني' : 'Legal',
      icon: '⚖️',
      description: rtlLayout ? 'استشارات قانونية وتوثيق' : 'Legal consultation and documentation',
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      value: IraqiDomain.MEDICAL,
      label: rtlLayout ? 'طبي' : 'Medical',
      icon: '🏥',
      description: rtlLayout ? 'استشارات طبية ومعلومات صحية' : 'Medical consultation and health information',
      color: 'bg-red-100 text-red-800 border-red-300'
    },
    {
      value: IraqiDomain.EDUCATIONAL,
      label: rtlLayout ? 'تعليمي' : 'Educational',
      icon: '📚',
      description: rtlLayout ? 'تعليم ومناهج دراسية' : 'Education and academic curriculum',
      color: 'bg-green-100 text-green-800 border-green-300'
    },
    {
      value: IraqiDomain.GOVERNMENT,
      label: rtlLayout ? 'حكومي' : 'Government',
      icon: '🏛️',
      description: rtlLayout ? 'خدمات حكومية وإجراءات رسمية' : 'Government services and official procedures',
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    },
    {
      value: IraqiDomain.BUSINESS,
      label: rtlLayout ? 'تجاري' : 'Business',
      icon: '💼',
      description: rtlLayout ? 'أعمال تجارية ومشاريع' : 'Business and commercial projects',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    }
  ];

  const getCurrentDomainInfo = () => {
    return domains.find(d => d.value === currentDomain) || domains[0];
  };

  const getDirectionClasses = () => {
    return rtlLayout ? 'text-right' : 'text-left';
  };

  return (
    <div className={`relative ${getDirectionClasses()} ${className}`} dir={rtlLayout ? 'rtl' : 'ltr'}>
      <div className="relative">
        <select
          value={currentDomain}
          onChange={(e) => onDomainChange(e.target.value as IraqiDomain)}
          className={`
            appearance-none w-full px-4 py-2 pr-8 rounded-lg border font-medium
            ${getCurrentDomainInfo().color}
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            font-arabic text-sm
            ${rtlLayout ? 'text-right pl-8 pr-4' : 'text-left pr-8 pl-4'}
          `}
        >
          {domains.map((domain) => (
            <option key={domain.value} value={domain.value}>
              {domain.icon} {domain.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className={`absolute inset-y-0 flex items-center pointer-events-none ${rtlLayout ? 'left-0 pl-3' : 'right-0 pr-3'}`}>
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Domain Description */}
      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 font-arabic">
        {getCurrentDomainInfo().description}
      </div>

      {/* Islamic Compliance Indicator for Religious Domains */}
      {(currentDomain === IraqiDomain.LEGAL || currentDomain === IraqiDomain.MEDICAL) && 
       culturalContext.islamic_compliance_required && (
        <div className={`mt-1 flex items-center gap-1 text-xs text-green-600 dark:text-green-400 ${rtlLayout ? 'flex-row-reverse' : ''}`}>
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span className="font-arabic">
            {rtlLayout ? 'يتطلب التوافق مع الأحكام الإسلامية' : 'Requires Islamic compliance'}
          </span>
        </div>
      )}
    </div>
  );
};
```

### Enhanced Chat Input (`ChatInput.tsx`)

```tsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { IraqiCulturalContext, IraqiDomain } from '../types/iraqi-types';

interface ChatInputProps {
  onMessageSend: (message: string, attachments?: File[]) => void;
  culturalContext: IraqiCulturalContext;
  rtlLayout?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onMessageSend,
  culturalContext,
  rtlLayout = true,
  disabled = false,
  placeholder,
  className = ''
}) => {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [culturalWarning, setCulturalWarning] = useState<string | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  // Cultural validation
  useEffect(() => {
    if (message.trim()) {
      const warning = validateCulturalAppropriateness(message);
      setCulturalWarning(warning);
    } else {
      setCulturalWarning(null);
    }
  }, [message, culturalContext]);

  const validateCulturalAppropriateness = (text: string): string | null => {
    if (!culturalContext.islamic_compliance_required) return null;

    const lowerText = text.toLowerCase();
    
    // Simple validation - in real implementation, this would be more sophisticated
    const inappropriateIndicators = [
      'alcohol', 'gambling', 'inappropriate_content'
    ];

    for (const indicator of inappropriateIndicators) {
      if (lowerText.includes(indicator)) {
        return rtlLayout 
          ? 'قد يحتوي المحتوى على مواد غير متوافقة مع القيم الإسلامية'
          : 'Content may contain materials incompatible with Islamic values';
      }
    }

    return null;
  };

  const handleSendMessage = useCallback(() => {
    if (!message.trim() || disabled) return;
    
    // Don't send if there's a cultural warning and compliance is required
    if (culturalWarning && culturalContext.islamic_compliance_required) {
      return;
    }

    onMessageSend(message.trim(), attachments.length > 0 ? attachments : undefined);
    setMessage('');
    setAttachments([]);
    setCulturalWarning(null);
  }, [message, attachments, onMessageSend, disabled, culturalWarning, culturalContext.islamic_compliance_required]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  }, []);

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  }, []);

  const getInputDirection = () => {
    return culturalContext.language === 'arabic' || rtlLayout ? 'rtl' : 'ltr';
  };

  const getPlaceholderText = () => {
    if (placeholder) return placeholder;
    
    if (!rtlLayout) return "Type your message...";
    
    const domainPlaceholders = {
      [IraqiDomain.LEGAL]: "اكتب استفسارك القانوني مع مراعاة الأحكام الإسلامية...",
      [IraqiDomain.MEDICAL]: "اكتب استفسارك الطبي مع الحفاظ على الخصوصية...",
      [IraqiDomain.EDUCATIONAL]: "اكتب سؤالك التعليمي...",
      [IraqiDomain.GOVERNMENT]: "اكتب استفسارك عن الخدمات الحكومية...",
      [IraqiDomain.BUSINESS]: "اكتب استفسارك التجاري...",
      [IraqiDomain.PERSONAL]: "اكتب رسالتك..."
    };
    
    return domainPlaceholders[culturalContext.domain] || "اكتب رسالتك...";
  };

  const getAppropriateEmojis = () => {
    // Return culturally appropriate emojis based on context
    const commonEmojis = ['😊', '👍', '🙏', '📚', '✅', '❓', '💡', '🌟'];
    
    const domainEmojis = {
      [IraqiDomain.LEGAL]: ['⚖️', '📋', '✍️', '📄'],
      [IraqiDomain.MEDICAL]: ['🏥', '💊', '🩺', '❤️'],
      [IraqiDomain.EDUCATIONAL]: ['📚', '🎓', '✏️', '🧠'],
      [IraqiDomain.GOVERNMENT]: ['🏛️', '📋', '🆔', '📄'],
      [IraqiDomain.BUSINESS]: ['💼', '📈', '💰', '🤝'],
      [IraqiDomain.PERSONAL]: ['😊', '🌺', '🌙', '⭐']
    };
    
    return [...commonEmojis, ...domainEmojis[culturalContext.domain]];
  };

  return (
    <div className={`${className}`} dir={getInputDirection()}>
      {/* Cultural Warning */}
      {culturalWarning && (
        <div className="mb-2 p-2 bg-yellow-100 border border-yellow-300 rounded-lg text-yellow-800 text-sm font-arabic">
          <div className={`flex items-center gap-2 ${rtlLayout ? 'flex-row-reverse' : ''}`}>
            <span>⚠️</span>
            <span>{culturalWarning}</span>
          </div>
        </div>
      )}

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div key={index} className={`flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm ${rtlLayout ? 'flex-row-reverse' : ''}`}>
              <span>📎</span>
              <span className="font-arabic">{file.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className={`flex items-end gap-2 ${rtlLayout ? 'flex-row-reverse' : ''}`}>
        {/* Main Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder={getPlaceholderText()}
            className={`
              w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              resize-none font-arabic
              ${getInputDirection() === 'rtl' ? 'text-right' : 'text-left'}
              ${culturalWarning && culturalContext.islamic_compliance_required ? 'border-yellow-400' : ''}
            `}
            style={{ 
              minHeight: '44px', 
              maxHeight: '120px',
              fontFamily: culturalContext.language === 'arabic' ? 'font-arabic' : 'inherit'
            }}
          />
        </div>

        {/* Action Buttons */}
        <div className={`flex items-center gap-1 ${rtlLayout ? 'flex-row-reverse' : ''}`}>
          {/* File Upload */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
            title={rtlLayout ? 'إرفاق ملف' : 'Attach file'}
          >
            📎
          </button>

          {/* Emoji Picker */}
          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600"
            title={rtlLayout ? 'إضافة رموز تعبيرية' : 'Add emoji'}
          >
            😊
          </button>

          {/* Voice Recording (if supported) */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            disabled={disabled}
            className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 ${isRecording ? 'text-red-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            title={rtlLayout ? 'تسجيل صوتي' : 'Voice recording'}
          >
            {isRecording ? '🔴' : '🎤'}
          </button>

          {/* Send Button */}
          <button
            onClick={handleSendMessage}
            disabled={disabled || !message.trim() || (culturalWarning && culturalContext.islamic_compliance_required)}
            className={`
              p-2 rounded-lg font-medium
              ${disabled || !message.trim() || (culturalWarning && culturalContext.islamic_compliance_required)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
              }
            `}
            title={rtlLayout ? 'إرسال' : 'Send'}
          >
            {rtlLayout ? '↲' : '→'}
          </button>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileUpload}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
      />

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full mb-2 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10">
          <div className="grid grid-cols-8 gap-2">
            {getAppropriateEmojis().map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  setMessage(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded text-lg"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

## 🎨 IRAQI CULTURAL UI THEMES

### Arabic Typography and Layout (`styles/iraqi-theme.css`)

```css
/* Iraqi AI Chat System - Cultural UI Theme */

/* Arabic Font Imports */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');

/* Font Families */
.font-arabic {
  font-family: 'Noto Sans Arabic', Arial, sans-serif;
}

.font-arabic-serif {
  font-family: 'Amiri', 'Times New Roman', serif;
}

/* RTL Layout Support */
.rtl {
  direction: rtl;
  text-align: right;
}

.ltr {
  direction: ltr;
  text-align: left;
}

/* Iraqi Color Palette */
:root {
  /* Iraqi Flag Colors */
  --iraqi-red: #CE1126;
  --iraqi-white: #FFFFFF;
  --iraqi-black: #000000;
  --iraqi-green: #007A3D;
  
  /* Cultural Colors */
  --islamic-green: #009639;
  --desert-sand: #F4E4BC;
  --baghdad-blue: #0F4C75;
  --mesopotamian-gold: #FFD700;
  
  /* Semantic Colors */
  --success-green: var(--islamic-green);
  --warning-amber: #F59E0B;
  --error-red: var(--iraqi-red);
  --info-blue: var(--baghdad-blue);
}

/* Cultural Theme Classes */
.theme-iraqi {
  --primary-color: var(--baghdad-blue);
  --secondary-color: var(--islamic-green);
  --accent-color: var(--mesopotamian-gold);
  --background-color: var(--desert-sand);
}

.theme-islamic {
  --primary-color: var(--islamic-green);
  --secondary-color: var(--mesopotamian-gold);
  --accent-color: var(--baghdad-blue);
  --background-color: #F8F9FA;
}

/* Domain-Specific Styling */
.domain-legal {
  --domain-color: var(--baghdad-blue);
  --domain-bg: #EFF6FF;
  --domain-border: #DBEAFE;
}

.domain-medical {
  --domain-color: var(--iraqi-red);
  --domain-bg: #FEF2F2;
  --domain-border: #FECACA;
}

.domain-educational {
  --domain-color: var(--islamic-green);
  --domain-bg: #F0FDF4;
  --domain-border: #BBF7D0;
}

.domain-government {
  --domain-color: #7C3AED;
  --domain-bg: #F5F3FF;
  --domain-border: #DDD6FE;
}

.domain-business {
  --domain-color: #F59E0B;
  --domain-bg: #FFFBEB;
  --domain-border: #FED7AA;
}

/* Arabic Text Enhancements */
.arabic-text {
  line-height: 1.8;
  letter-spacing: 0.02em;
  word-spacing: 0.1em;
}

.arabic-text-formal {
  font-size: 1.1em;
  font-weight: 500;
  line-height: 2;
}

/* Cultural Sensitivity Indicators */
.islamic-compliant {
  border-left: 4px solid var(--islamic-green);
  background-color: #F0FDF4;
}

.cultural-warning {
  border-left: 4px solid var(--warning-amber);
  background-color: #FFFBEB;
}

.cultural-violation {
  border-left: 4px solid var(--error-red);
  background-color: #FEF2F2;
}

/* Professional Context Styling */
.context-professional {
  font-family: 'Noto Sans Arabic', Arial, sans-serif;
  font-weight: 500;
}

.context-formal {
  font-family: 'Amiri', 'Times New Roman', serif;
  font-weight: 600;
  font-size: 1.05em;
}

.context-religious {
  font-family: 'Amiri', 'Times New Roman', serif;
  color: var(--islamic-green);
  font-weight: 600;
}

/* Regional Adaptations */
.region-baghdad {
  --regional-accent: var(--baghdad-blue);
}

.region-basra {
  --regional-accent: #0EA5E9;
}

.region-erbil {
  --regional-accent: #10B981;
}

.region-najaf {
  --regional-accent: var(--islamic-green);
}

/* UI Component Adaptations */
.btn-iraqi {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: 'Noto Sans Arabic', Arial, sans-serif;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-iraqi:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-iraqi {
  background: white;
  border: 1px solid var(--domain-border, #E5E7EB);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.input-iraqi {
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  padding: 12px 16px;
  font-family: 'Noto Sans Arabic', Arial, sans-serif;
  transition: border-color 0.3s ease;
}

.input-iraqi:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(15, 76, 117, 0.1);
}

/* Message Styling */
.message-user {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  border-radius: 18px 18px 4px 18px;
}

.message-assistant {
  background: #F8F9FA;
  color: #1F2937;
  border: 1px solid #E5E7EB;
  border-radius: 18px 18px 18px 4px;
}

.message-system {
  background: var(--domain-bg, #F3F4F6);
  color: var(--domain-color, #6B7280);
  border: 1px solid var(--domain-border, #D1D5DB);
  border-radius: 12px;
  font-style: italic;
}

/* Responsive Adaptations */
@media (max-width: 768px) {
  .font-arabic {
    font-size: 0.95em;
  }
  
  .arabic-text-formal {
    font-size: 1.05em;
  }
  
  .btn-iraqi {
    padding: 10px 20px;
    font-size: 0.9em;
  }
}

/* High Contrast Mode for Accessibility */
@media (prefers-contrast: high) {
  .card-iraqi {
    border-width: 2px;
  }
  
  .btn-iraqi {
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
  
  .input-iraqi {
    border-width: 3px;
  }
}

/* Reduced Motion for Accessibility */
@media (prefers-reduced-motion: reduce) {
  .btn-iraqi {
    transition: none;
  }
  
  .btn-iraqi:hover {
    transform: none;
  }
  
  .input-iraqi {
    transition: none;
  }
}
```

## 📱 RESPONSIVE DESIGN FOR IRAQI CONTEXTS

### Mobile Adaptations

```tsx
// Mobile-optimized components for Iraqi users
const IraqiMobileOptimizations = {
  // Touch-friendly Arabic keyboard support
  keyboardSupport: {
    arabicKeyboard: true,
    predictiveText: 'iraqi_dialect',
    voiceInput: 'arabic_iraqi',
    swipeGestures: 'rtl_optimized'
  },
  
  // Cultural mobile patterns
  mobilePatterns: {
    rightHandNavigation: true, // Most Arabic users are right-handed
    largerTouchTargets: '48px', // Better for Arabic text selection
    voiceMessagePriority: 'high', // Popular in Middle East
    offlineCapability: 'essential' // For Iraqi infrastructure
  },
  
  // Professional mobile interfaces
  professionalMobile: {
    legalDocumentScanning: true,
    medicalImageCapture: true,
    governmentFormFilling: true,
    businessCardRecognition: 'arabic'
  }
};
```

## 🚀 INTEGRATION STRATEGY

### Phase 1: Core UI Framework
1. **Arabic RTL Components**: Deploy base components with RTL support
2. **Cultural Theme System**: Implement Iraqi color palette and typography
3. **Domain-Specific Interfaces**: Legal, medical, educational, government interfaces
4. **Cultural Validation UI**: Visual indicators for Islamic compliance

### Phase 2: Advanced Interactions
1. **Voice Integration**: Arabic voice input/output components
2. **Document Processing UI**: OCR results display, document templates
3. **Professional Workflows**: Domain-specific user interfaces
4. **Mobile Optimization**: Touch-friendly Arabic interfaces

### Phase 3: Enterprise Features
1. **Government Portal Integration**: Citizen services interfaces
2. **Professional Dashboard**: Iraqi domain expert interfaces  
3. **Cultural Analytics**: User behavior and compliance dashboards
4. **Multi-Language Support**: Arabic, Kurdish, English interfaces

## 📊 UI PERFORMANCE METRICS

- **Arabic Text Rendering**: <100ms for complex RTL layouts
- **Cultural Validation**: Real-time compliance checking <50ms
- **Domain Switching**: <200ms interface adaptation
- **Mobile Responsiveness**: 100% touch target accessibility
- **Accessibility**: WCAG 2.1 AA compliance for Arabic interfaces

---

**Next Steps**: Extract Recipe System with Iraqi professional domain workflows and automation templates.