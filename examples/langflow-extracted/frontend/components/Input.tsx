"""
Input component extracted from Langflow for Iraqi AI Chat System
Original: src/frontend/src/components/ui/input.tsx
"""

import React from 'react';
import { cn } from '../../../utils/cn';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ComponentType<{ className?: string }>;
  // Iraqi AI enhancements:
  rtl?: boolean;
  arabicText?: boolean;
  culturalMode?: boolean;
  professionalDomain?: string;
  showValidation?: boolean;
  validationStatus?: 'valid' | 'invalid' | 'pending';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text", 
    icon: Icon,
    // Iraqi AI enhancements:
    rtl = false,
    arabicText = false,
    culturalMode = false,
    professionalDomain,
    showValidation = false,
    validationStatus,
    placeholder,
    ...props 
  }, ref) => {
    // Iraqi AI: Detect if content is Arabic based on placeholder or value
    const isArabicContent = React.useMemo(() => {
      if (arabicText) return true;
      
      const text = (props.value || placeholder || '').toString();
      const arabicRegex = /[\u0600-\u06FF]/;
      return arabicRegex.test(text);
    }, [arabicText, props.value, placeholder]);

    // Iraqi AI: Determine effective RTL mode
    const effectiveRTL = rtl || isArabicContent;

    // Iraqi AI: Get professional domain styling
    const getDomainStyling = () => {
      if (!professionalDomain) return '';
      
      const domainStyles = {
        legal: 'border-indigo-300 focus:border-indigo-500 focus:ring-indigo-500',
        medical: 'border-red-300 focus:border-red-500 focus:ring-red-500',
        educational: 'border-purple-300 focus:border-purple-500 focus:ring-purple-500',
        business: 'border-gray-300 focus:border-gray-500 focus:ring-gray-500'
      };
      
      return domainStyles[professionalDomain as keyof typeof domainStyles] || '';
    };

    // Iraqi AI: Get validation styling
    const getValidationStyling = () => {
      if (!showValidation || !validationStatus) return '';
      
      const validationStyles = {
        valid: 'border-green-300 focus:border-green-500 focus:ring-green-500',
        invalid: 'border-red-300 focus:border-red-500 focus:ring-red-500',
        pending: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500'
      };
      
      return validationStyles[validationStatus];
    };

    return (
      <div className={cn(
        "relative flex items-center",
        effectiveRTL && "flex-row-reverse"
      )}>
        {Icon && (
          <div className={cn(
            "absolute z-10 pointer-events-none",
            effectiveRTL ? "right-3" : "left-3"
          )}>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </div>
        )}
        
        <input
          type={type}
          className={cn(
            // Base styles
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            
            // Iraqi AI enhancements:
            {
              // Arabic font and RTL support
              'font-arabic': isArabicContent,
              'text-right': effectiveRTL,
              'text-left': !effectiveRTL,
              
              // Icon padding adjustments for RTL
              'pl-10': Icon && !effectiveRTL,
              'pr-10': Icon && effectiveRTL,
              
              // Cultural mode styling
              'focus:ring-emerald-500 focus:border-emerald-500': culturalMode,
            },
            
            // Professional domain styling
            getDomainStyling(),
            
            // Validation styling
            getValidationStyling(),
            
            className
          )}
          ref={ref}
          dir={effectiveRTL ? 'rtl' : 'ltr'}
          placeholder={placeholder}
          {...props}
        />
        
        {/* Iraqi AI: Validation indicator */}
        {showValidation && validationStatus && (
          <div className={cn(
            "absolute z-10 pointer-events-none",
            effectiveRTL ? "left-3" : "right-3"
          )}>
            {validationStatus === 'valid' && (
              <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {validationStatus === 'invalid' && (
              <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
            {validationStatus === 'pending' && (
              <svg className="h-4 w-4 text-yellow-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

// Iraqi AI: Specialized input components
export const ArabicInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => (
    <Input 
      {...props} 
      ref={ref} 
      rtl={true} 
      arabicText={true}
      className={cn('font-arabic', props.className)}
    />
  )
);

export const CulturalInput = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => (
    <Input 
      {...props} 
      ref={ref} 
      culturalMode={true}
    />
  )
);

export const ProfessionalInput = React.forwardRef<HTMLInputElement, 
  InputProps & { domain: 'legal' | 'medical' | 'educational' | 'business' }
>(({ domain, ...props }, ref) => (
  <Input 
    {...props} 
    ref={ref} 
    professionalDomain={domain}
  />
));

export const ValidatedInput = React.forwardRef<HTMLInputElement, 
  InputProps & { 
    onValidate?: (value: string) => 'valid' | 'invalid' | 'pending';
    culturalValidation?: boolean;
  }
>(({ onValidate, culturalValidation, ...props }, ref) => {
  const [validationStatus, setValidationStatus] = React.useState<'valid' | 'invalid' | 'pending'>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (onValidate) {
      const status = onValidate(value);
      setValidationStatus(status);
    }
    
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <Input 
      {...props} 
      ref={ref} 
      onChange={handleChange}
      showValidation={true}
      validationStatus={validationStatus}
      culturalMode={culturalValidation}
    />
  );
});

ArabicInput.displayName = "ArabicInput";
CulturalInput.displayName = "CulturalInput";
ProfessionalInput.displayName = "ProfessionalInput";
ValidatedInput.displayName = "ValidatedInput";

export { Input };

// Iraqi AI Chat System enhancements implemented:
// - Full RTL support with automatic Arabic detection
// - Arabic font application
// - Cultural mode with Islamic green accent colors
// - Professional domain styling (legal, medical, educational, business)
// - Real-time validation with visual indicators
// - Specialized input variants (Arabic, Cultural, Professional, Validated)
// - Icon positioning that respects RTL layout
// - Direction-aware placeholder and text alignment
// - Validation status indicators with culturally appropriate colors