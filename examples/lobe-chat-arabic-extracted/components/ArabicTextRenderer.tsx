/**
 * Arabic Text Renderer Component for Iraqi AI Chat System
 * 
 * Features:
 * - Intelligent Arabic text rendering with Iraqi dialect support
 * - Real-time text optimization and performance monitoring
 * - Cultural adaptation and Islamic typography principles
 * - Mixed Arabic-English content handling
 * - Professional domain-specific rendering
 */

'use client';

import React, { forwardRef, useEffect, useImperativeHandle } from 'react';
import { cn } from '@/lib/utils';
import { 
  useArabicTextRendering, 
  useArabicTextMeasurement, 
  UseArabicTextRenderingOptions 
} from '../hooks/useArabicTextRendering';

export interface ArabicTextRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  
  // Arabic-specific options
  dialect?: 'iraqi' | 'baghdad' | 'basra' | 'mosul' | 'standard';
  domain?: 'general' | 'legal' | 'medical' | 'educational' | 'business' | 'engineering';
  direction?: 'ltr' | 'rtl' | 'auto';
  
  // Rendering options
  optimization?: 'speed' | 'quality' | 'balanced';
  kerning?: boolean;
  ligatures?: boolean;
  
  // Cultural and performance options
  culturalAdaptation?: boolean;
  performanceMonitoring?: boolean;
  autoOptimize?: boolean;
  
  // Styling options
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
  
  // Event handlers
  onOptimized?: () => void;
  onPerformanceMetrics?: (metrics: any) => void;
}

export interface ArabicTextRendererRef {
  optimize: () => void;
  reoptimize: () => void;
  getMetrics: () => any;
  element: HTMLDivElement | null;
}

/**
 * ArabicTextRenderer - Intelligent Arabic text rendering component
 */
export const ArabicTextRenderer = forwardRef<ArabicTextRendererRef, ArabicTextRendererProps>(({
  children,
  className,
  dialect = 'iraqi',
  domain = 'general',
  direction = 'auto',
  optimization = 'balanced',
  kerning = true,
  ligatures = true,
  culturalAdaptation = true,
  performanceMonitoring = false,
  autoOptimize = true,
  fontSize = 'base',
  fontWeight = 'normal',
  onOptimized,
  onPerformanceMetrics,
  ...props
}, ref) => {
  
  // Arabic text rendering hook
  const {
    elementRef,
    optimizeRendering,
    reoptimize,
    isOptimized,
    fontLoaded,
    metrics,
    analyzeTextContent
  } = useArabicTextRendering({
    dialect,
    domain,
    direction,
    optimization,
    kerning,
    ligatures,
    culturalAdaptation,
    performanceMonitoring,
    autoOptimize
  });
  
  // Text measurement utilities
  const { measureText } = useArabicTextMeasurement();
  
  // Expose methods through ref
  useImperativeHandle(ref, () => ({
    optimize: optimizeRendering,
    reoptimize,
    getMetrics: () => metrics,
    element: elementRef.current
  }), [optimizeRendering, reoptimize, metrics]);
  
  // Handle optimization completion
  useEffect(() => {
    if (isOptimized && onOptimized) {
      onOptimized();
    }
  }, [isOptimized, onOptimized]);
  
  // Handle performance metrics
  useEffect(() => {
    if (metrics && onPerformanceMetrics) {
      onPerformanceMetrics(metrics);
    }
  }, [metrics, onPerformanceMetrics]);
  
  // Generate CSS classes for styling
  const getTextClasses = () => {
    const classes = [
      // Base classes
      'arabic-text-renderer',
      
      // Font size classes
      {
        'text-sm': fontSize === 'sm',
        'text-base': fontSize === 'base',
        'text-lg': fontSize === 'lg',
        'text-xl': fontSize === 'xl',
        'text-2xl': fontSize === '2xl'
      },
      
      // Font weight classes
      {
        'font-normal': fontWeight === 'normal',
        'font-medium': fontWeight === 'medium',
        'font-semibold': fontWeight === 'semibold',
        'font-bold': fontWeight === 'bold'
      },
      
      // Dialect classes
      `dialect-${dialect}`,
      
      // Domain classes
      `domain-${domain}`,
      
      // Optimization classes
      {
        'optimized': isOptimized,
        'font-loaded': fontLoaded,
        'rtl-optimized': direction === 'rtl' || direction === 'auto',
        'cultural-adapted': culturalAdaptation
      }
    ];
    
    return cn(...classes, className);
  };
  
  // Generate inline styles for Arabic rendering
  const getInlineStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    
    // Direction handling
    if (direction !== 'auto') {
      styles.direction = direction;
      styles.textAlign = direction === 'rtl' ? 'right' : 'left';
    }
    
    // Optimization styles
    switch (optimization) {
      case 'speed':
        styles.textRendering = 'optimizeSpeed';
        break;
      case 'quality':
        styles.textRendering = 'optimizeLegibility';
        break;
      case 'balanced':
      default:
        styles.textRendering = 'auto';
        break;
    }
    
    // Typography features
    if (kerning) {
      styles.fontKerning = 'auto';
    }
    
    if (ligatures) {
      styles.fontVariantLigatures = 'common-ligatures';
      styles.fontFeatureSettings = '"liga" 1, "clig" 1, "kern" 1';
    }
    
    // Cultural adaptations
    if (culturalAdaptation) {
      // Islamic typography principles - avoid decorative elements
      styles.textShadow = 'none';
      styles.textTransform = 'none';
      
      // Iraqi dialect-specific adjustments
      switch (dialect) {
        case 'iraqi':
          styles.letterSpacing = '0.02em';
          styles.wordSpacing = '0.1em';
          styles.lineHeight = '1.7';
          break;
        case 'baghdad':
          styles.letterSpacing = '0.015em';
          styles.wordSpacing = '0.08em';
          styles.lineHeight = '1.65';
          break;
        case 'basra':
          styles.letterSpacing = '0.025em';
          styles.wordSpacing = '0.12em';
          styles.lineHeight = '1.75';
          break;
        case 'mosul':
          styles.letterSpacing = '0.02em';
          styles.wordSpacing = '0.09em';
          styles.lineHeight = '1.68';
          break;
      }
    }
    
    return styles;
  };
  
  return (
    <div
      ref={elementRef}
      className={getTextClasses()}
      style={getInlineStyles()}
      lang="ar"
      dir={direction === 'auto' ? undefined : direction}
      {...props}
    >
      {children}
      
      {/* Performance monitoring indicator */}
      {performanceMonitoring && metrics && (
        <div className="arabic-performance-indicator" style={{
          position: 'absolute',
          top: '-20px',
          right: '0',
          fontSize: '10px',
          color: '#666',
          background: '#f0f0f0',
          padding: '2px 6px',
          borderRadius: '3px',
          pointerEvents: 'none',
          opacity: 0.7
        }}>
          {metrics.renderTime.toFixed(1)}ms | {metrics.detectedLanguage} | {metrics.detectedDialect}
        </div>
      )}
    </div>
  );
});

ArabicTextRenderer.displayName = 'ArabicTextRenderer';

/**
 * Specialized Arabic Text Components for different use cases
 */

// Chat message renderer
export const ArabicChatMessage = forwardRef<ArabicTextRendererRef, 
  Omit<ArabicTextRendererProps, 'domain' | 'optimization'>
>(({ children, ...props }, ref) => (
  <ArabicTextRenderer
    ref={ref}
    domain="general"
    optimization="balanced"
    className="arabic-chat-message"
    {...props}
  >
    {children}
  </ArabicTextRenderer>
));

ArabicChatMessage.displayName = 'ArabicChatMessage';

// Professional domain text renderer
export const ArabicProfessionalText = forwardRef<ArabicTextRendererRef, 
  ArabicTextRendererProps & { professional?: boolean }
>(({ children, professional = true, domain = 'business', ...props }, ref) => (
  <ArabicTextRenderer
    ref={ref}
    domain={domain}
    optimization="quality"
    culturalAdaptation={professional}
    className={cn('arabic-professional-text', professional && 'professional-styling')}
    {...props}
  >
    {children}
  </ArabicTextRenderer>
));

ArabicProfessionalText.displayName = 'ArabicProfessionalText';

// Legal document text renderer
export const ArabicLegalText = forwardRef<ArabicTextRendererRef, 
  Omit<ArabicTextRendererProps, 'domain' | 'fontWeight'>
>(({ children, ...props }, ref) => (
  <ArabicTextRenderer
    ref={ref}
    domain="legal"
    fontWeight="medium"
    optimization="quality"
    className="arabic-legal-text"
    {...props}
  >
    {children}
  </ArabicTextRenderer>
));

ArabicLegalText.displayName = 'ArabicLegalText';

// Medical text renderer
export const ArabicMedicalText = forwardRef<ArabicTextRendererRef, 
  Omit<ArabicTextRendererProps, 'domain'>
>(({ children, ...props }, ref) => (
  <ArabicTextRenderer
    ref={ref}
    domain="medical"
    optimization="quality"
    className="arabic-medical-text"
    {...props}
  >
    {children}
  </ArabicTextRenderer>
));

ArabicMedicalText.displayName = 'ArabicMedicalText';

// Educational content text renderer
export const ArabicEducationalText = forwardRef<ArabicTextRendererRef, 
  Omit<ArabicTextRendererProps, 'domain'>
>(({ children, ...props }, ref) => (
  <ArabicTextRenderer
    ref={ref}
    domain="educational"
    fontSize="lg"
    optimization="quality"
    className="arabic-educational-text"
    {...props}
  >
    {children}
  </ArabicTextRenderer>
));

ArabicEducationalText.displayName = 'ArabicEducationalText';

// Engineering/technical text renderer
export const ArabicTechnicalText = forwardRef<ArabicTextRendererRef, 
  Omit<ArabicTextRendererProps, 'domain'>
>(({ children, ...props }, ref) => (
  <ArabicTextRenderer
    ref={ref}
    domain="engineering"
    fontSize="sm"
    optimization="speed"
    className="arabic-technical-text monospace-arabic"
    {...props}
  >
    {children}
  </ArabicTextRenderer>
));

ArabicTechnicalText.displayName = 'ArabicTechnicalText';