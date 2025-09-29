import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { IconButton } from "~/components/ui/IconButton";
import { useArabicTextProcessing } from "~/lib/hooks/useArabicTextProcessing";
import { useChatEnhancement } from "~/lib/hooks/useChatEnhancement";
import type { ArabicLanguage } from "~/types/iraqi-chat";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  disabled?: boolean;
  placeholder?: string;
  language?: ArabicLanguage;
  rtlSupport?: boolean;
  maxLength?: number;
  showEnhancer?: boolean;
  autoResize?: boolean;
  className?: string;
}

/**
 * Enhanced ChatInput component with Arabic RTL support,
 * text processing, and Iraqi cultural enhancements
 */
export const ChatInput = forwardRef<HTMLTextAreaElement, ChatInputProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      disabled = false,
      placeholder = "",
      language = "english",
      rtlSupport = true,
      maxLength = 4000,
      showEnhancer = true,
      autoResize = true,
      className = "",
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = ref || internalRef;

    // Arabic text processing hooks
    const {
      formatArabicText,
      detectTextDirection,
      normalizeText,
      addDiacritics,
    } = useArabicTextProcessing({
      language,
      dialect: "iraqi",
    });

    const { enhancePrompt, isEnhancing, enhancedText, clearEnhancement } =
      useChatEnhancement({
        language,
        culturalContext: "iraqi",
      });

    // Auto-resize textarea
    const adjustTextareaHeight = useCallback(() => {
      if (!autoResize || !textareaRef || typeof textareaRef === "function")
        return;

      const textarea = textareaRef.current;
      if (!textarea) return;

      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
      textarea.style.height = `${newHeight}px`;
    }, [autoResize, textareaRef]);

    useEffect(() => {
      adjustTextareaHeight();
    }, [value, adjustTextareaHeight]);

    // Handle input changes with Arabic processing
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        let newValue = e.target.value;

        // Apply maximum length limit
        if (maxLength && newValue.length > maxLength) {
          newValue = newValue.substring(0, maxLength);
        }

        // Process Arabic text if needed
        if (language === "arabic" && rtlSupport) {
          newValue = formatArabicText(newValue);
        }

        onChange(newValue);
      },
      [onChange, maxLength, language, rtlSupport, formatArabicText],
    );

    // Handle key events
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit on Enter (without Shift)
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (!disabled && value.trim()) {
            onSubmit();
          }
        }

        // Handle RTL/LTR switching
        if (rtlSupport && e.ctrlKey && e.key === "Shift") {
          e.preventDefault();
          const textarea = e.currentTarget;
          const currentDir = textarea.dir;
          textarea.dir = currentDir === "rtl" ? "ltr" : "rtl";
        }
      },
      [disabled, value, onSubmit, rtlSupport],
    );

    // Handle paste events
    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        const pastedText = e.clipboardData.getData("text");

        // Process Arabic text
        if (language === "arabic" && rtlSupport) {
          const processedText = formatArabicText(pastedText);

          // If text was processed, prevent default and set processed text
          if (processedText !== pastedText) {
            e.preventDefault();
            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue =
              value.substring(0, start) + processedText + value.substring(end);

            onChange(newValue);

            // Set cursor position after processed text
            setTimeout(() => {
              textarea.setSelectionRange(
                start + processedText.length,
                start + processedText.length,
              );
            }, 0);
          }
        }
      },
      [language, rtlSupport, formatArabicText, value, onChange],
    );

    // Handle text enhancement
    const handleEnhanceText = useCallback(async () => {
      if (!value.trim() || isEnhancing) return;

      try {
        const enhanced = await enhancePrompt(value);
        if (enhanced && enhanced !== value) {
          onChange(enhanced);
        }
      } catch (error) {
        console.error("Text enhancement failed:", error);
      }
    }, [value, isEnhancing, enhancePrompt, onChange]);

    // Detect text direction automatically
    const textDirection = rtlSupport ? detectTextDirection(value) : "ltr";
    const isRTL = textDirection === "rtl";

    // Calculate character count and progress
    const characterCount = value.length;
    const characterProgress = maxLength
      ? (characterCount / maxLength) * 100
      : 0;
    const isNearLimit = characterProgress > 90;
    const isOverLimit = characterProgress > 100;

    return (
      <div className={`relative ${className}`}>
        {/* Enhanced text display */}
        {enhancedText && enhancedText !== value && (
          <div
            className={`mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg ${
              isRTL ? "text-right" : "text-left"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-800">
                {language === "arabic" ? "نص محسن" : "Enhanced Text"}
              </span>
              <button
                onClick={clearEnhancement}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {language === "arabic" ? "إلغاء" : "Cancel"}
              </button>
            </div>
            <div className="text-sm text-blue-700 whitespace-pre-wrap">
              {enhancedText}
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onChange(enhancedText)}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                {language === "arabic" ? "استخدام" : "Use"}
              </button>
              <button
                onClick={clearEnhancement}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
              >
                {language === "arabic" ? "رفض" : "Dismiss"}
              </button>
            </div>
          </div>
        )}

        {/* Main textarea container */}
        <div className="relative flex items-end gap-2">
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              disabled={disabled}
              placeholder={placeholder}
              dir={isRTL ? "rtl" : "ltr"}
              className={`
              w-full resize-none rounded-lg border border-gray-300 
              px-4 py-3 pr-12 focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:border-transparent
              ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
              ${isRTL ? "text-right" : "text-left"}
              ${language === "arabic" ? "font-arabic" : "font-sans"}
              ${isOverLimit ? "border-red-500" : ""}
              min-h-[50px] max-h-[200px]
            `}
              style={{
                fontSize: language === "arabic" ? "16px" : "14px",
                lineHeight: language === "arabic" ? "1.6" : "1.4",
              }}
              rows={1}
            />

            {/* Character count */}
            {maxLength && (
              <div
                className={`absolute bottom-2 text-xs text-gray-500 ${
                  isRTL ? "left-3" : "right-3"
                } ${isNearLimit ? "text-orange-500" : ""} ${isOverLimit ? "text-red-500" : ""}`}
              >
                {characterCount}/{maxLength}
              </div>
            )}

            {/* Loading indicator */}
            {isEnhancing && (
              <div className={`absolute top-3 ${isRTL ? "left-3" : "right-3"}`}>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-1">
            {/* Enhance button */}
            {showEnhancer && (
              <IconButton
                onClick={handleEnhanceText}
                disabled={disabled || !value.trim() || isEnhancing}
                title={language === "arabic" ? "تحسين النص" : "Enhance text"}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </IconButton>
            )}

            {/* Submit button */}
            <IconButton
              onClick={() => onSubmit()}
              disabled={disabled || !value.trim()}
              title={language === "arabic" ? "إرسال (Enter)" : "Send (Enter)"}
              className={`p-2 rounded-lg transition-colors ${
                disabled || !value.trim()
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-white bg-blue-600 hover:bg-blue-700"
              }`}
            >
              <svg
                className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </IconButton>
          </div>
        </div>

        {/* Text direction indicator */}
        {rtlSupport && value && (
          <div
            className={`absolute top-2 text-xs text-gray-400 ${
              isRTL ? "left-2" : "right-2"
            }`}
          >
            {isRTL ? "RTL" : "LTR"}
          </div>
        )}

        {/* Keyboard shortcuts help */}
        <div
          className={`mt-1 text-xs text-gray-500 ${isRTL ? "text-right" : "text-left"}`}
        >
          {language === "arabic" ? (
            <>
              Enter للإرسال • Shift+Enter للسطر الجديد
              {rtlSupport && " • Ctrl+Shift لتبديل الاتجاه"}
            </>
          ) : (
            <>
              Enter to send • Shift+Enter for new line
              {rtlSupport && " • Ctrl+Shift to toggle direction"}
            </>
          )}
        </div>
      </div>
    );
  },
);

ChatInput.displayName = "ChatInput";
