"""
Dialog component extracted from Langflow for Iraqi AI Chat System
Original: src/frontend/src/components/ui/dialog.tsx
"""

import React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '../../../utils/cn';

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

interface DialogContentProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> {
  // Iraqi AI enhancements:
  rtl?: boolean;
  arabicContent?: boolean;
  culturalMode?: boolean;
  professionalDomain?: string;
  hideCloseButton?: boolean;
}

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ 
  className, 
  children, 
  // Iraqi AI enhancements:
  rtl = false,
  arabicContent = false,
  culturalMode = false,
  professionalDomain,
  hideCloseButton = false,
  ...props 
}, ref) => {
  // Iraqi AI: Detect Arabic content and apply RTL
  const effectiveRTL = rtl || arabicContent;

  // Iraqi AI: Get professional domain styling
  const getDomainBorder = () => {
    if (!professionalDomain) return '';
    
    const domainBorders = {
      legal: 'border-t-4 border-t-indigo-500',
      medical: 'border-t-4 border-t-red-500',
      educational: 'border-t-4 border-t-purple-500',
      business: 'border-t-4 border-t-gray-500'
    };
    
    return domainBorders[professionalDomain as keyof typeof domainBorders] || '';
  };

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          
          // Iraqi AI enhancements:
          {
            // Cultural mode styling
            'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950': culturalMode,
            'border-emerald-200 dark:border-emerald-800': culturalMode,
          },
          
          // Professional domain border
          getDomainBorder(),
          
          className
        )}
        dir={effectiveRTL ? 'rtl' : 'ltr'}
        {...props}
      >
        {children}
        
        {!hideCloseButton && (
          <DialogPrimitive.Close 
            className={cn(
              "absolute ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
              effectiveRTL ? "left-4 top-4" : "right-4 top-4",
              culturalMode ? "hover:bg-emerald-100 dark:hover:bg-emerald-900" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">
              {effectiveRTL ? 'إغلاق' : 'Close'}
            </span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  rtl?: boolean;
  arabicContent?: boolean;
}

const DialogHeader = React.forwardRef<HTMLDivElement, DialogHeaderProps>(
  ({ className, rtl = false, arabicContent = false, ...props }, ref) => {
    const effectiveRTL = rtl || arabicContent;
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col space-y-1.5",
          effectiveRTL ? "text-right" : "text-left",
          arabicContent && "font-arabic",
          className
        )}
        dir={effectiveRTL ? 'rtl' : 'ltr'}
        {...props}
      />
    );
  }
);
DialogHeader.displayName = "DialogHeader";

interface DialogTitleProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title> {
  rtl?: boolean;
  arabicContent?: boolean;
  hideTitle?: boolean;
}

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  DialogTitleProps
>(({ className, rtl = false, arabicContent = false, hideTitle = false, ...props }, ref) => {
  const effectiveRTL = rtl || arabicContent;
  
  return (
    <DialogPrimitive.Title
      ref={ref}
      className={cn(
        "text-lg font-semibold leading-none tracking-tight",
        effectiveRTL ? "text-right" : "text-left",
        arabicContent && "font-arabic",
        hideTitle && "sr-only",
        className
      )}
      dir={effectiveRTL ? 'rtl' : 'ltr'}
      {...props}
    />
  );
});
DialogTitle.displayName = DialogPrimitive.Title.displayName;

interface DialogDescriptionProps extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description> {
  rtl?: boolean;
  arabicContent?: boolean;
}

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  DialogDescriptionProps
>(({ className, rtl = false, arabicContent = false, ...props }, ref) => {
  const effectiveRTL = rtl || arabicContent;
  
  return (
    <DialogPrimitive.Description
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground",
        effectiveRTL ? "text-right" : "text-left",
        arabicContent && "font-arabic",
        className
      )}
      dir={effectiveRTL ? 'rtl' : 'ltr'}
      {...props}
    />
  );
});
DialogDescription.displayName = DialogPrimitive.Description.displayName;

interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  rtl?: boolean;
  arabicContent?: boolean;
}

const DialogFooter = React.forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, rtl = false, arabicContent = false, ...props }, ref) => {
    const effectiveRTL = rtl || arabicContent;
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
          effectiveRTL && "sm:flex-row-reverse sm:space-x-reverse",
          className
        )}
        dir={effectiveRTL ? 'rtl' : 'ltr'}
        {...props}
      />
    );
  }
);
DialogFooter.displayName = "DialogFooter";

// Iraqi AI: Specialized dialog components
export const ArabicDialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>((props, ref) => (
  <DialogContent 
    {...props} 
    ref={ref} 
    rtl={true} 
    arabicContent={true}
  />
));

export const CulturalDialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>((props, ref) => (
  <DialogContent 
    {...props} 
    ref={ref} 
    culturalMode={true}
  />
));

export const ProfessionalDialog = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps & { domain: 'legal' | 'medical' | 'educational' | 'business' }
>(({ domain, ...props }, ref) => (
  <DialogContent 
    {...props} 
    ref={ref} 
    professionalDomain={domain}
  />
));

// Iraqi AI: Cultural confirmation dialog
export const CulturalConfirmDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  arabicContent?: boolean;
}> = ({ isOpen, onClose, onConfirm, title, message, arabicContent = false }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent culturalMode={true} arabicContent={arabicContent}>
        <DialogHeader arabicContent={arabicContent}>
          <DialogTitle arabicContent={arabicContent}>{title}</DialogTitle>
          <DialogDescription arabicContent={arabicContent}>
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter arabicContent={arabicContent}>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {arabicContent ? 'إلغاء' : 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {arabicContent ? 'تأكيد' : 'Confirm'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

ArabicDialog.displayName = "ArabicDialog";
CulturalDialog.displayName = "CulturalDialog";
ProfessionalDialog.displayName = "ProfessionalDialog";

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};

// Iraqi AI Chat System enhancements implemented:
// - Full RTL support for Arabic dialogs
// - Cultural mode with Islamic green theme
// - Professional domain border indicators
// - Arabic font support across all components
// - Direction-aware button and content layout
// - Specialized dialog variants (Arabic, Cultural, Professional)
// - Cultural confirmation dialog with Islamic styling
// - Accessibility support for Arabic screen readers
// - Close button positioning that respects RTL layout