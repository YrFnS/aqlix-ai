/**
 * BiForm - Bidirectional Form Components
 *
 * Direction-aware form components with proper label alignment and field grouping.
 * Supports validation messages and field layouts for RTL/LTR.
 *
 * @module components/bidirectional/BiForm
 */

import React from "react";
import type {
  BidirectionalProps,
  DirectionalAlignment,
} from "../../types/bidirectional";
import { useBidirectional } from "../../hooks/useBidirectional";

/**
 * BiForm Props
 */
export interface BiFormProps
  extends BidirectionalProps,
    Omit<React.FormHTMLAttributes<HTMLFormElement>, "dir"> {}

/**
 * BiFormField Props
 */
export interface BiFormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Field label */
  label?: string;

  /** Field description/helper text */
  description?: string;

  /** Error message */
  error?: string;

  /** Required field indicator */
  required?: boolean;

  /** Field ID for label association */
  htmlFor?: string;
}

/**
 * BiFormLabel Props
 */
export interface BiFormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Required field indicator */
  required?: boolean;
}

/**
 * BiFormGroup Props
 */
export interface BiFormGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Group layout direction */
  layout?: "vertical" | "horizontal";

  /** Alignment for horizontal layout */
  alignment?: DirectionalAlignment;
}

/**
 * Bidirectional Form Component
 *
 * Form wrapper with direction awareness.
 *
 * @example
 * ```tsx
 * <BiForm direction="rtl" onSubmit={handleSubmit}>
 *   <BiFormField label="الاسم" required>
 *     <BiInput />
 *   </BiFormField>
 * </BiForm>
 * ```
 */
export const BiForm = React.memo<BiFormProps>(
  ({ children, direction: propDirection, className = "", ...props }) => {
    const { direction } = useBidirectional(propDirection);

    return (
      <form
        className={`space-y-6 ${className}`.trim()}
        dir={direction}
        {...props}
      >
        {children}
      </form>
    );
  },
);

BiForm.displayName = "BiForm";

/**
 * Bidirectional Form Field
 *
 * Complete form field with label, input, description, and error message.
 *
 * @example
 * ```tsx
 * <BiFormField
 *   label="البريد الإلكتروني"
 *   description="أدخل بريدك الإلكتروني"
 *   error={errors.email}
 *   required
 * >
 *   <BiInput type="email" />
 * </BiFormField>
 * ```
 */
export const BiFormField = React.memo<BiFormFieldProps>(
  ({
    children,
    label,
    description,
    error,
    required = false,
    htmlFor,
    className = "",
    ...props
  }) => {
    return (
      <div className={`space-y-2 ${className}`.trim()} {...props}>
        {label && (
          <BiFormLabel htmlFor={htmlFor} required={required}>
            {label}
          </BiFormLabel>
        )}

        {children}

        {description && !error && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

BiFormField.displayName = "BiFormField";

/**
 * Bidirectional Form Label
 *
 * Label with required indicator support.
 *
 * @example
 * ```tsx
 * <BiFormLabel htmlFor="name" required>
 *   الاسم
 * </BiFormLabel>
 * ```
 */
export const BiFormLabel = React.memo<BiFormLabelProps>(
  ({ children, required = false, className = "", ...props }) => {
    return (
      <label
        className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`.trim()}
        {...props}
      >
        {children}
        {required && <span className="text-destructive ms-1">*</span>}
      </label>
    );
  },
);

BiFormLabel.displayName = "BiFormLabel";

/**
 * Bidirectional Form Group
 *
 * Groups multiple form fields with layout control.
 *
 * @example
 * ```tsx
 * <BiFormGroup layout="horizontal">
 *   <BiFormField label="الاسم الأول">
 *     <BiInput />
 *   </BiFormField>
 *   <BiFormField label="اسم العائلة">
 *     <BiInput />
 *   </BiFormField>
 * </BiFormGroup>
 * ```
 */
export const BiFormGroup = React.memo<BiFormGroupProps>(
  ({
    children,
    layout = "vertical",
    alignment = "start",
    className = "",
    ...props
  }) => {
    const { getAlignmentClass } = useBidirectional();
    const alignClass = getAlignmentClass(alignment);

    const layoutClasses =
      layout === "horizontal" ? `flex gap-4 ${alignClass}` : "space-y-4";

    return (
      <div className={`${layoutClasses} ${className}`.trim()} {...props}>
        {children}
      </div>
    );
  },
);

BiFormGroup.displayName = "BiFormGroup";
