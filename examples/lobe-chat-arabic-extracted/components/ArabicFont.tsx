'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRTL } from './RTLProvider';

// Font Configuration Types
export type ArabicFontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
export type ArabicFontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
export type ArabicLineHeight = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';
export type ArabicLetterSpacing = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';
export type IraqiDialect = 'baghdad' | 'basra' | 'mosul' | 'kurdish' | 'standard';
export type ProfessionalDomain = 'legal' | 'medical' | 'educational' | 'government' | 'technical';

interface ArabicFontProps {
  children: ReactNode;
  size?: ArabicFontSize;
  weight?: ArabicFontWeight;
  lineHeight?: ArabicLineHeight;
  letterSpacing?: ArabicLetterSpacing;
  dialect?: IraqiDialect;
  domain?: ProfessionalDomain;
  className?: string;
  variant?: 'primary' | 'heading' | 'body' | 'mono';
  cultural?: 'formal' | 'casual' | 'religious';
  align?: 'right' | 'left' | 'center' | 'justify';
  as?: keyof JSX.IntrinsicElements;
}

// Font Family Mappings
const FONT_FAMILIES = {
  primary: 'var(--font-arabic-primary)',
  heading: 'var(--font-arabic-heading)',
  body: 'var(--font-arabic-body)',
  mono: 'var(--font-arabic-mono)',
};

const DIALECT_FONTS = {
  baghdad: 'var(--font-baghdad)',
  basra: 'var(--font-basra)',
  mosul: 'var(--font-mosul)',
  kurdish: 'var(--font-kurdish)',
  standard: 'var(--font-standard)',
};

const DOMAIN_FONTS = {
  legal: 'var(--font-legal)',
  medical: 'var(--font-medical)',
  educational: 'var(--font-educational)',
  government: 'var(--font-government)',
  technical: 'var(--font-technical)',
};

// Font Loading Hook
export const useArabicFontLoading = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        if ('fonts' in document) {
          // Load primary Arabic fonts
          await Promise.all([
            document.fonts.load('400 16px "Noto Sans Arabic"'),
            document.fonts.load('400 16px "Amiri"'),
            document.fonts.load('400 16px "IBM Plex Sans Arabic"'),
            document.fonts.load('400 16px "Cairo"'),
          ]);

          setFontsLoaded(true);
        } else {
          // Fallback for browsers without Font Loading API
          setTimeout(() => setFontsLoaded(true), 3000);
        }
      } catch (error) {
        setLoadingError(error instanceof Error ? error.message : 'Font loading failed');
        setFontsLoaded(true); // Continue with fallback fonts
      }
    };

    loadFonts();
  }, []);

  return { fontsLoaded, loadingError };
};

// Arabic Font Component
export const ArabicFont: React.FC<ArabicFontProps> = ({
  children,
  size = 'base',
  weight = 400,
  lineHeight = 'normal',
  letterSpacing = 'normal',
  dialect,
  domain,
  className = '',
  variant = 'primary',
  cultural,
  align,
  as: Component = 'div',
}) => {
  const { config, isArabic, getLayoutClasses } = useRTL();
  const { fontsLoaded } = useArabicFontLoading();

  // Build font family based on priority
  const getFontFamily = (): string => {
    if (domain) return DOMAIN_FONTS[domain];
    if (dialect) return DIALECT_FONTS[dialect];
    return FONT_FAMILIES[variant];
  };

  // Build CSS classes
  const buildClasses = (): string => {
    const classes = [className];

    // Base Arabic font class
    classes.push('font-arabic');

    // Size classes
    classes.push(`text-${size}-arabic`);

    // Line height classes
    classes.push(`leading-${lineHeight}-arabic`);

    // Letter spacing classes
    classes.push(`tracking-${letterSpacing}-arabic`);

    // Dialect classes
    if (dialect) {
      classes.push(`dialect-${dialect}`);
    }

    // Professional domain classes
    if (domain) {
      classes.push(`professional-${domain}`);
    }

    // Cultural variant classes
    if (cultural) {
      classes.push(`${cultural}-arabic`);
    }

    // Alignment classes
    if (align) {
      classes.push(`text-${align}-arabic`);
    }

    // RTL layout classes
    const rtlClasses = getLayoutClasses();
    if (rtlClasses) {
      classes.push(rtlClasses);
    }

    // Font loading state
    if (!fontsLoaded) {
      classes.push('font-loading');
    }

    return classes.filter(Boolean).join(' ');
  };

  // Build inline styles
  const buildStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      fontFamily: getFontFamily(),
      fontWeight: weight,
      direction: isArabic ? 'rtl' : 'ltr',
    };

    // Add font display swap for performance
    if (!fontsLoaded) {
      styles.fontDisplay = 'swap';
    }

    return styles;
  };

  return (
    <Component className={buildClasses()} style={buildStyles()} dir={isArabic ? 'rtl' : 'ltr'}>
      {children}
    </Component>
  );
};

// Specialized Arabic Text Components
interface ArabicTextProps extends Omit<ArabicFontProps, 'variant'> {
  text?: string;
}

export const ArabicHeading: React.FC<ArabicTextProps> = (props) => (
  <ArabicFont {...props} variant="heading" as="h2" weight={600} size="xl" />
);

export const ArabicBody: React.FC<ArabicTextProps> = (props) => (
  <ArabicFont {...props} variant="body" as="p" weight={400} size="base" />
);

export const ArabicCaption: React.FC<ArabicTextProps> = (props) => (
  <ArabicFont {...props} variant="body" as="span" weight={300} size="sm" />
);

export const ArabicCode: React.FC<ArabicTextProps> = (props) => (
  <ArabicFont {...props} variant="mono" as="code" weight={400} size="sm" />
);

// Mixed Content Component with Intelligent Direction
interface MixedContentTextProps {
  content: string;
  className?: string;
  segmentProps?: Partial<ArabicFontProps>;
}

export const MixedContentText: React.FC<MixedContentTextProps> = ({
  content,
  className = '',
  segmentProps = {},
}) => {
  const { formatMixedContent } = useRTL();
  const segments = formatMixedContent(content);

  return (
    <div className={`mixed-content-text ${className}`}>
      {segments.map((segment, index) => (
        <ArabicFont
          key={index}
          {...segmentProps}
          className={`segment segment-${segment.direction}`}
          as="span"
        >
          {segment.content}
        </ArabicFont>
      ))}
    </div>
  );
};

// Professional Title Component
interface ProfessionalTitleProps extends ArabicTextProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  governorate?: string;
}

export const ProfessionalTitle: React.FC<ProfessionalTitleProps> = ({
  level,
  governorate,
  className = '',
  ...props
}) => {
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeMap: Record<number, ArabicFontSize> = {
    1: '3xl',
    2: '2xl',
    3: 'xl',
    4: 'lg',
    5: 'base',
    6: 'sm',
  };

  const additionalClasses = governorate ? `governorate-${governorate}` : '';

  return (
    <ArabicFont
      {...props}
      variant="heading"
      as={Component}
      size={sizeMap[level]}
      weight={600}
      cultural="formal"
      className={`professional-title ${additionalClasses} ${className}`}
    />
  );
};

// Islamic Text Component
interface IslamicTextProps extends ArabicTextProps {
  emphasis?: boolean;
}

export const IslamicText: React.FC<IslamicTextProps> = ({
  emphasis = false,
  className = '',
  ...props
}) => {
  const emphasisClass = emphasis ? 'cultural-emphasis' : '';

  return (
    <ArabicFont
      {...props}
      cultural="religious"
      weight={emphasis ? 600 : 500}
      className={`religious-text islamic-compliant ${emphasisClass} ${className}`}
    />
  );
};

// Dialect-Aware Text Component
interface DialectTextProps extends ArabicTextProps {
  autoDetect?: boolean;
}

export const DialectText: React.FC<DialectTextProps> = ({
  autoDetect = false,
  children,
  ...props
}) => {
  const [detectedDialect, setDetectedDialect] = useState<IraqiDialect>('standard');

  useEffect(() => {
    if (autoDetect && typeof children === 'string') {
      // Simple dialect detection based on common phrases
      if (children.includes('شلونك') || children.includes('شكو ماكو')) {
        setDetectedDialect('baghdad');
      } else if (children.includes('شلونكم') || children.includes('هسة')) {
        setDetectedDialect('basra');
      } else if (children.includes('شلون حالك') || children.includes('كيفك')) {
        setDetectedDialect('mosul');
      } else if (children.includes('سڵاو') || children.includes('چون')) {
        setDetectedDialect('kurdish');
      } else {
        setDetectedDialect('standard');
      }
    }
  }, [autoDetect, children]);

  return (
    <ArabicFont {...props} dialect={props.dialect || (autoDetect ? detectedDialect : undefined)}>
      {children}
    </ArabicFont>
  );
};

// Font Preloader Component
export const ArabicFontPreloader: React.FC = () => {
  useEffect(() => {
    // Preload critical Arabic fonts
    if ('fonts' in document) {
      const fontPromises = [
        new FontFace(
          'Noto Sans Arabic',
          'url(https://fonts.gstatic.com/s/notosansarabic/v18/nwpxtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlhQ5l-b9w-6GOTSJqKE.woff2)',
          { weight: '400' }
        ),
        new FontFace(
          'Amiri',
          'url(https://fonts.gstatic.com/s/amiri/v27/J7aFnoNzCn9kJHdLRZNYUeYlSPDB.woff2)',
          { weight: '400' }
        ),
        new FontFace(
          'IBM Plex Sans Arabic',
          'url(https://fonts.gstatic.com/s/ibmplexsansarabic/v13/Qw3MZR9OHiCOp8wVzM6QOOHdRhwFam8jM5RFV6g_vvBWMjxiK6M.woff2)',
          { weight: '400' }
        ),
        new FontFace(
          'Cairo',
          'url(https://fonts.gstatic.com/s/cairo/v28/SLXGc1nY6HkvalKS6i6w5rJRYBYAhK3CnHO4n2k.woff2)',
          { weight: '400' }
        ),
      ];

      fontPromises.forEach((font) => {
        font
          .load()
          .then((loadedFont) => {
            document.fonts.add(loadedFont);
          })
          .catch((error) => {
            console.warn('Failed to preload Arabic font:', error);
          });
      });
    }
  }, []);

  return null;
};

export default ArabicFont;
