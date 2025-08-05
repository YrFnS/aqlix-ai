"""
Button component extracted from Langflow for Iraqi AI Chat System
Original: src/frontend/src/components/ui/button.tsx
"""

import React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../utils/cn';

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Iraqi AI enhancements:
        primary: "bg-blue-600 text-white shadow hover:bg-blue-700 focus:ring-blue-500",
        success: "bg-green-600 text-white shadow hover:bg-green-700 focus:ring-green-500",
        warning: "bg-yellow-600 text-white shadow hover:bg-yellow-700 focus:ring-yellow-500",
        cultural: "bg-emerald-600 text-white shadow hover:bg-emerald-700 focus:ring-emerald-500", // Islamic green
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-9 w-9",
        // Iraqi AI enhancements:
        'icon-sm': "h-8 w-8",
        'icon-lg': "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
  titleCase?: boolean;
  // Iraqi AI enhancements:
  rtl?: boolean;
  arabicText?: boolean;
  culturalMode?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false,
    titleCase = false,
    // Iraqi AI enhancements:
    rtl = false,
    arabicText = false,
    culturalMode = false,
    children,
    disabled,
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // Iraqi AI: Handle text transformation for Arabic
    const processedChildren = React.useMemo(() => {
      if (typeof children === 'string') {
        if (titleCase && !arabicText) {
          return children.replace(/\w\S*/g, (txt) => 
            txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
          );
        }
      }
      return children;
    }, [children, titleCase, arabicText]);

    // Iraqi AI: Apply cultural variant if in cultural mode
    const effectiveVariant = culturalMode && variant === 'primary' ? 'cultural' : variant;

    return (
      <Comp
        className={cn(
          buttonVariants({ variant: effectiveVariant, size, className }),
          // Iraqi AI enhancements:
          {
            'font-arabic': arabicText,
            'flex-row-reverse': rtl && !asChild,
            'text-right': rtl && arabicText,
            'text-left': !rtl && !arabicText,
          }
        )}
        ref={ref}
        disabled={disabled || loading}
        dir={rtl ? 'rtl' : 'ltr'}
        {...props}
      >
        {loading && (
          <div className={cn(
            "animate-spin rounded-full border-2 border-current border-t-transparent",
            size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
            rtl ? 'ml-2' : 'mr-2'
          )} />
        )}
        {processedChildren}
      </Comp>
    );
  }
);

Button.displayName = "Button";

// Iraqi AI: Specialized button components
export const ArabicButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <Button 
      {...props} 
      ref={ref} 
      rtl={true} 
      arabicText={true}
      className={cn('font-arabic', props.className)}
    />
  )
);

export const CulturalButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => (
    <Button 
      {...props} 
      ref={ref} 
      culturalMode={true}
      variant={props.variant || 'cultural'}
    />
  )
);

export const ProfessionalButton = React.forwardRef<HTMLButtonElement, 
  ButtonProps & { domain?: 'legal' | 'medical' | 'educational' | 'business' }
>(({ domain, ...props }, ref) => {
  const domainStyles = {
    legal: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    medical: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    educational: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
    business: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500'
  };

  return (
    <Button 
      {...props} 
      ref={ref}
      className={cn(
        domain && domainStyles[domain],
        props.className
      )}
    />
  );
});

ArabicButton.displayName = "ArabicButton";
CulturalButton.displayName = "CulturalButton";
ProfessionalButton.displayName = "ProfessionalButton";

export { Button, buttonVariants };

// Iraqi AI Chat System enhancements implemented:
// - RTL support for Arabic button layouts
// - Arabic font support
// - Cultural mode with Islamic green color scheme
// - Professional domain styling
// - Specialized Arabic, Cultural, and Professional button variants
// - Enhanced loading states with proper RTL positioning
// - Title case handling that respects Arabic text
// - Direction-aware spacing and alignment