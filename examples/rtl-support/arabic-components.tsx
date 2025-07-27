import React from 'react';

// Arabic Text Component with proper RTL support
interface ArabicTextProps {
  children: string;
  className?: string;
  variant?: 'body' | 'heading' | 'caption';
}

export const ArabicText: React.FC<ArabicTextProps> = ({ 
  children, 
  className = '', 
  variant = 'body' 
}) => {
  const baseClasses = "font-arabic";
  const variantClasses = {
    body: "text-base leading-relaxed",
    heading: "text-xl font-semibold leading-tight",
    caption: "text-sm leading-normal"
  };

  return (
    <div 
      dir="rtl" 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ 
        textAlign: 'right',
        fontFamily: "'Noto Sans Arabic', 'Amiri', 'Cairo', sans-serif",
        lineHeight: '1.8'
      }}
    >
      {children}
    </div>
  );
};

// Mixed Content Component for Arabic-English text
interface MixedContentProps {
  children: React.ReactNode;
  primaryLanguage: 'arabic' | 'english';
  className?: string;
}

export const MixedContent: React.FC<MixedContentProps> = ({
  children,
  primaryLanguage,
  className = ''
}) => {
  return (
    <div
      dir={primaryLanguage === 'arabic' ? 'rtl' : 'ltr'}
      className={`mixed-content ${className}`}
      style={{
        textAlign: primaryLanguage === 'arabic' ? 'right' : 'left',
        unicodeBidi: 'embed'
      }}
    >
      {children}
    </div>
  );
};

// Arabic Input Component
interface ArabicInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  type?: 'text' | 'textarea';
}

export const ArabicInput: React.FC<ArabicInputProps> = ({
  value,
  onChange,
  placeholder = "اكتب هنا...",
  className = '',
  type = 'text'
}) => {
  const baseClasses = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-arabic";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const commonProps = {
    value,
    onChange: handleChange,
    placeholder,
    dir: 'rtl' as const,
    className: `${baseClasses} ${className}`,
    style: {
      textAlign: 'right' as const,
      fontFamily: "'Noto Sans Arabic', 'Amiri', 'Cairo', sans-serif"
    }
  };

  if (type === 'textarea') {
    return (
      <textarea
        {...commonProps}
        rows={4}
      />
    );
  }

  return (
    <input
      type="text"
      {...commonProps}
    />
  );
};

// Arabic Button Component
interface ArabicButtonProps {
  children: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const ArabicButton: React.FC<ArabicButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const baseClasses = "font-arabic rounded-lg focus:outline-none focus:ring-2 transition-colors";
  
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500",
    outline: "border border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500"
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      style={{
        fontFamily: "'Noto Sans Arabic', 'Amiri', 'Cairo', sans-serif"
      }}
    >
      {children}
    </button>
  );
};

// Language Toggle Component
interface LanguageToggleProps {
  currentLanguage: 'arabic' | 'english';
  onLanguageChange: (language: 'arabic' | 'english') => void;
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onLanguageChange,
  className = ''
}) => {
  return (
    <div className={`flex rounded-lg border border-gray-300 overflow-hidden ${className}`}>
      <button
        onClick={() => onLanguageChange('arabic')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          currentLanguage === 'arabic'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        style={{
          fontFamily: "'Noto Sans Arabic', 'Amiri', 'Cairo', sans-serif"
        }}
      >
        العربية
      </button>
      <button
        onClick={() => onLanguageChange('english')}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          currentLanguage === 'english'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        English
      </button>
    </div>
  );
};