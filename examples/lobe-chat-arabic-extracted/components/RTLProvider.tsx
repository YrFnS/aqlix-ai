'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Iraqi RTL Configuration Types
interface IraqiRTLConfig {
  locale: 'ar-IQ' | 'en-US' | 'ar-SA';
  direction: 'rtl' | 'ltr';
  dialectPreference: 'baghdad' | 'basra' | 'mosul' | 'kurdish' | 'standard';
  culturalAdaptation: {
    islamicCompliance: boolean;
    professionalContext: boolean;
    governmentStandards: boolean;
    formalLanguage: boolean;
  };
  layoutPreferences: {
    textAlignment: 'auto' | 'right' | 'left';
    navigationDirection: 'rtl' | 'ltr';
    contentFlow: 'natural' | 'forced-rtl' | 'forced-ltr';
    mixedContentHandling: 'intelligent' | 'strict-rtl' | 'strict-ltr';
  };
}

// RTL Context Interface
interface RTLContextType {
  config: IraqiRTLConfig;
  isRTL: boolean;
  isArabic: boolean;
  toggleDirection: () => void;
  setLocale: (locale: 'ar-IQ' | 'en-US' | 'ar-SA') => void;
  setDialect: (dialect: IraqiRTLConfig['dialectPreference']) => void;
  updateCulturalSettings: (settings: Partial<IraqiRTLConfig['culturalAdaptation']>) => void;
  getTextDirection: (text?: string) => 'rtl' | 'ltr';
  getLayoutClasses: (baseClasses?: string) => string;
  formatMixedContent: (content: string) => { direction: 'rtl' | 'ltr'; content: string }[];
}

// Default Iraqi RTL Configuration
const defaultIraqiConfig: IraqiRTLConfig = {
  locale: 'ar-IQ',
  direction: 'rtl',
  dialectPreference: 'baghdad',
  culturalAdaptation: {
    islamicCompliance: true,
    professionalContext: true,
    governmentStandards: true,
    formalLanguage: true,
  },
  layoutPreferences: {
    textAlignment: 'auto',
    navigationDirection: 'rtl',
    contentFlow: 'natural',
    mixedContentHandling: 'intelligent',
  },
};

// RTL Context
const RTLContext = createContext<RTLContextType | undefined>(undefined);

// Arabic Text Detection Utility
const detectArabicText = (text: string): boolean => {
  const arabicRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicRegex.test(text);
};

// Iraqi Dialect Detection
const detectIraqiDialect = (text: string): IraqiRTLConfig['dialectPreference'] => {
  // Baghdad dialect indicators
  if (text.includes('شلونك') || text.includes('شكو ماكو') || text.includes('وين رايح')) {
    return 'baghdad';
  }
  
  // Basra dialect indicators
  if (text.includes('شلونكم') || text.includes('هسة') || text.includes('وين ماشي')) {
    return 'basra';
  }
  
  // Mosul dialect indicators
  if (text.includes('شلون حالك') || text.includes('كيفك') || text.includes('وين رايح')) {
    return 'mosul';
  }
  
  // Kurdish-Arabic mixed indicators
  if (text.includes('سڵاو') || text.includes('چون')) {
    return 'kurdish';
  }
  
  return 'standard';
};

// Mixed Content Handler
const formatMixedContent = (content: string): { direction: 'rtl' | 'ltr'; content: string }[] => {
  const segments: { direction: 'rtl' | 'ltr'; content: string }[] = [];
  const words = content.split(/(\s+)/);
  let currentSegment = '';
  let currentDirection: 'rtl' | 'ltr' | null = null;
  
  words.forEach((word) => {
    const wordDirection = detectArabicText(word) ? 'rtl' : 'ltr';
    
    if (currentDirection === null) {
      currentDirection = wordDirection;
      currentSegment = word;
    } else if (currentDirection === wordDirection) {
      currentSegment += word;
    } else {
      // Direction change - save current segment and start new one
      if (currentSegment.trim()) {
        segments.push({ direction: currentDirection, content: currentSegment });
      }
      currentDirection = wordDirection;
      currentSegment = word;
    }
  });
  
  // Add final segment
  if (currentSegment.trim()) {
    segments.push({ direction: currentDirection!, content: currentSegment });
  }
  
  return segments;
};

// RTL Layout Classes Generator
const generateLayoutClasses = (config: IraqiRTLConfig, baseClasses = ''): string => {
  const classes = [baseClasses];
  
  // Direction classes
  classes.push(config.direction === 'rtl' ? 'rtl' : 'ltr');
  
  // Text alignment based on locale and preferences
  if (config.layoutPreferences.textAlignment === 'auto') {
    classes.push(config.direction === 'rtl' ? 'text-right' : 'text-left');
  } else {
    classes.push(`text-${config.layoutPreferences.textAlignment}`);
  }
  
  // Cultural adaptation classes
  if (config.culturalAdaptation.islamicCompliance) {
    classes.push('islamic-compliant');
  }
  
  if (config.culturalAdaptation.professionalContext) {
    classes.push('professional-context');
  }
  
  if (config.culturalAdaptation.governmentStandards) {
    classes.push('government-standards');
  }
  
  // Dialect-specific classes
  classes.push(`dialect-${config.dialectPreference}`);
  
  // Layout flow classes
  classes.push(`flow-${config.layoutPreferences.contentFlow}`);
  classes.push(`mixed-${config.layoutPreferences.mixedContentHandling}`);
  
  return classes.filter(Boolean).join(' ');
};

// RTL Provider Props
interface RTLProviderProps {
  children: ReactNode;
  initialConfig?: Partial<IraqiRTLConfig>;
  persistSettings?: boolean;
  onConfigChange?: (config: IraqiRTLConfig) => void;
}

// RTL Provider Component
export const RTLProvider: React.FC<RTLProviderProps> = ({
  children,
  initialConfig = {},
  persistSettings = true,
  onConfigChange,
}) => {
  const [config, setConfig] = useState<IraqiRTLConfig>(() => {
    // Load from localStorage if available and persistence enabled
    if (persistSettings && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('iraqi-rtl-config');
        if (saved) {
          return { ...defaultIraqiConfig, ...JSON.parse(saved), ...initialConfig };
        }
      } catch (error) {
        console.warn('Failed to load RTL config from localStorage:', error);
      }
    }
    return { ...defaultIraqiConfig, ...initialConfig };
  });

  // Save to localStorage when config changes
  useEffect(() => {
    if (persistSettings && typeof window !== 'undefined') {
      try {
        localStorage.setItem('iraqi-rtl-config', JSON.stringify(config));
      } catch (error) {
        console.warn('Failed to save RTL config to localStorage:', error);
      }
    }
    
    onConfigChange?.(config);
  }, [config, persistSettings, onConfigChange]);

  // Apply RTL styles to document
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.dir = config.direction;
      document.documentElement.lang = config.locale;
      
      // Add cultural CSS classes to body
      const bodyClasses = [
        `locale-${config.locale}`,
        `direction-${config.direction}`,
        `dialect-${config.dialectPreference}`,
        config.culturalAdaptation.islamicCompliance ? 'islamic-compliant' : '',
        config.culturalAdaptation.professionalContext ? 'professional-context' : '',
        config.culturalAdaptation.governmentStandards ? 'government-standards' : '',
        config.culturalAdaptation.formalLanguage ? 'formal-language' : '',
      ].filter(Boolean);
      
      document.body.className = document.body.className
        .split(' ')
        .filter(cls => !cls.startsWith('locale-') && !cls.startsWith('direction-') && 
                      !cls.startsWith('dialect-') && !['islamic-compliant', 'professional-context', 
                      'government-standards', 'formal-language'].includes(cls))
        .concat(bodyClasses)
        .join(' ');
    }
  }, [config]);

  // Context value
  const contextValue: RTLContextType = {
    config,
    isRTL: config.direction === 'rtl',
    isArabic: config.locale.startsWith('ar'),
    
    toggleDirection: () => {
      setConfig(prev => ({
        ...prev,
        direction: prev.direction === 'rtl' ? 'ltr' : 'rtl',
      }));
    },
    
    setLocale: (locale) => {
      setConfig(prev => ({
        ...prev,
        locale,
        direction: locale.startsWith('ar') ? 'rtl' : 'ltr',
      }));
    },
    
    setDialect: (dialect) => {
      setConfig(prev => ({
        ...prev,
        dialectPreference: dialect,
      }));
    },
    
    updateCulturalSettings: (settings) => {
      setConfig(prev => ({
        ...prev,
        culturalAdaptation: {
          ...prev.culturalAdaptation,
          ...settings,
        },
      }));
    },
    
    getTextDirection: (text) => {
      if (!text) return config.direction;
      return detectArabicText(text) ? 'rtl' : 'ltr';
    },
    
    getLayoutClasses: (baseClasses) => {
      return generateLayoutClasses(config, baseClasses);
    },
    
    formatMixedContent: (content) => {
      return formatMixedContent(content);
    },
  };

  return (
    <RTLContext.Provider value={contextValue}>
      <div className={generateLayoutClasses(config)} dir={config.direction}>
        {children}
      </div>
    </RTLContext.Provider>
  );
};

// RTL Hook
export const useRTL = (): RTLContextType => {
  const context = useContext(RTLContext);
  if (context === undefined) {
    throw new Error('useRTL must be used within an RTLProvider');
  }
  return context;
};

// HOC for RTL components
export const withRTL = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const RTLComponent = (props: P) => {
    const rtl = useRTL();
    return <Component {...props} rtl={rtl} />;
  };
  
  RTLComponent.displayName = `withRTL(${Component.displayName || Component.name})`;
  return RTLComponent;
};

// Cultural Direction Component
interface CulturalDirectionProps {
  children: ReactNode;
  text?: string;
  forceDirection?: 'rtl' | 'ltr';
  className?: string;
}

export const CulturalDirection: React.FC<CulturalDirectionProps> = ({
  children,
  text,
  forceDirection,
  className = '',
}) => {
  const { getTextDirection, getLayoutClasses } = useRTL();
  
  const direction = forceDirection || (text ? getTextDirection(text) : undefined);
  const directionClass = direction ? `dir-${direction}` : '';
  const layoutClasses = getLayoutClasses(`${className} ${directionClass}`);
  
  return (
    <div className={layoutClasses} dir={direction}>
      {children}
    </div>
  );
};

// Mixed Content Component
interface MixedContentProps {
  content: string;
  className?: string;
  segmentClassName?: string;
}

export const MixedContent: React.FC<MixedContentProps> = ({
  content,
  className = '',
  segmentClassName = '',
}) => {
  const { formatMixedContent, getLayoutClasses } = useRTL();
  
  const segments = formatMixedContent(content);
  const containerClasses = getLayoutClasses(className);
  
  return (
    <div className={`mixed-content ${containerClasses}`}>
      {segments.map((segment, index) => (
        <span
          key={index}
          dir={segment.direction}
          className={`segment segment-${segment.direction} ${segmentClassName}`}
        >
          {segment.content}
        </span>
      ))}
    </div>
  );
};

export default RTLProvider;