"use client";

import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  useMemo,
} from "react";
import {
  Languages,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RotateCcw,
  Copy,
  Check,
  AlertCircle,
  Info,
  Eye,
  EyeOff,
  Settings,
  Wand2,
  BookOpen,
  Shield,
  Globe,
} from "lucide-react";

// Types
interface DialectConfig {
  code: string;
  name: string;
  nameAr: string;
  region: string;
  regionAr: string;
  examples: string[];
  commonPhrases: { ar: string; en: string }[];
  culturalNotes?: string[];
}

interface TranslationResult {
  original: string;
  translated: string;
  confidence: number;
  dialect: string;
  culturalScore?: number;
  suggestions?: string[];
}

interface ArabicPromptInputProps {
  value?: string;
  onChange?: (value: string, translation?: string, metadata?: any) => void;
  onTranslationComplete?: (result: TranslationResult) => void;
  placeholder?: string;
  placeholderAr?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minRows?: number;
  maxRows?: number;
  showTranslation?: boolean;
  enableVoiceInput?: boolean;
  enableDialectDetection?: boolean;
  enableCulturalValidation?: boolean;
  enableSuggestions?: boolean;
  defaultDialect?: string;
  professionalDomain?: string;
  isRtlMode?: boolean;
  autoTranslate?: boolean;
  showCharCount?: boolean;
  showDialectInfo?: boolean;
  allowedDialects?: string[];
  onDialectChange?: (dialect: string) => void;
  onCulturalScore?: (score: number) => void;
}

const dialectConfigs: Record<string, DialectConfig> = {
  iraqi: {
    code: "iq",
    name: "Iraqi Arabic",
    nameAr: "العراقية",
    region: "Iraq",
    regionAr: "العراق",
    examples: [
      "شلونك؟ - How are you?",
      "شكو ماكو؟ - What's up?",
      "بسة - Only/just",
      "دازة - Good/excellent",
      "كلش - Very/a lot",
    ],
    commonPhrases: [
      { ar: "أهلاً وسهلاً", en: "Welcome" },
      { ar: "شكراً جزيلاً", en: "Thank you very much" },
      { ar: "الله يعطيك العافية", en: "God give you strength" },
      { ar: "إن شاء الله", en: "God willing" },
      { ar: "بسم الله", en: "In the name of God" },
    ],
    culturalNotes: [
      "Iraqi dialect includes many Turkish and Persian loanwords",
      "Formal Islamic greetings are commonly used in professional contexts",
      "Regional variations exist between Baghdad, Basra, and northern Iraq",
    ],
  },
  msa: {
    code: "msa",
    name: "Modern Standard Arabic",
    nameAr: "العربية الفصحى",
    region: "Pan-Arab",
    regionAr: "عموم الوطن العربي",
    examples: [
      "كيف حالك؟ - How are you?",
      "ما أخبارك؟ - What's your news?",
      "فقط - Only/just",
      "ممتاز - Excellent",
      "كثيراً - Very/a lot",
    ],
    commonPhrases: [
      { ar: "السلام عليكم", en: "Peace be upon you" },
      { ar: "وعليكم السلام", en: "And upon you peace" },
      { ar: "بارك الله فيك", en: "God bless you" },
      { ar: "جزاك الله خيراً", en: "May God reward you with good" },
      { ar: "حفظك الله", en: "May God protect you" },
    ],
    culturalNotes: [
      "Used in formal writing and official communications",
      "Preferred in educational and religious contexts",
      "Standard across all Arab countries",
    ],
  },
  gulf: {
    code: "gulf",
    name: "Gulf Arabic",
    nameAr: "الخليجية",
    region: "Gulf States",
    regionAr: "دول الخليج",
    examples: [
      "شلونك؟ - How are you?",
      "شصاير؟ - What's happening?",
      "بس - Only/just",
      "حلو - Good/nice",
      "وايد - Very/a lot",
    ],
    commonPhrases: [
      { ar: "يسلموا", en: "Thank you (literally: may your hands be safe)" },
      { ar: "الله يعطيك العافية", en: "God give you strength" },
      { ar: "خوش", en: "Good/nice" },
      { ar: "يالله", en: "Come on/Let's go" },
    ],
  },
};

export const ArabicPromptInput: React.FC<ArabicPromptInputProps> = ({
  value = "",
  onChange,
  onTranslationComplete,
  placeholder = "Enter your prompt...",
  placeholderAr = "أدخل وصفك للصورة...",
  className = "",
  disabled = false,
  readOnly = false,
  maxLength = 1000,
  minRows = 3,
  maxRows = 8,
  showTranslation = true,
  enableVoiceInput = false,
  enableDialectDetection = true,
  enableCulturalValidation = true,
  enableSuggestions = true,
  defaultDialect = "iraqi",
  professionalDomain = "general",
  isRtlMode = false,
  autoTranslate = true,
  showCharCount = true,
  showDialectInfo = true,
  allowedDialects = ["iraqi", "msa", "gulf"],
  onDialectChange,
  onCulturalScore,
}) => {
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const translationRef = useRef<HTMLTextAreaElement>(null);

  // State Management
  const [inputValue, setInputValue] = useState(value);
  const [translation, setTranslation] = useState("");
  const [detectedDialect, setDetectedDialect] = useState(defaultDialect);
  const [selectedDialect, setSelectedDialect] = useState(defaultDialect);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationResult, setTranslationResult] =
    useState<TranslationResult | null>(null);
  const [culturalScore, setCulturalScore] = useState<number>(0.95);

  // UI State
  const [showTranslationPanel, setShowTranslationPanel] =
    useState(showTranslation);
  const [showDialectPanel, setShowDialectPanel] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedText, setCopiedText] = useState<"input" | "translation" | null>(
    null,
  );

  // Suggestions State
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // Language Detection
  const [textDirection, setTextDirection] = useState<"ltr" | "rtl" | "auto">(
    "auto",
  );
  const [mixedLanguage, setMixedLanguage] = useState(false);

  // Available dialects based on props
  const availableDialects = useMemo(() => {
    return Object.entries(dialectConfigs)
      .filter(([code]) => allowedDialects.includes(code))
      .map(([code, config]) => ({ code, ...config }));
  }, [allowedDialects]);

  // Detect language and direction
  const detectLanguageDirection = useCallback((text: string) => {
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    const englishPattern = /[a-zA-Z]/;

    const hasArabic = arabicPattern.test(text);
    const hasEnglish = englishPattern.test(text);

    if (hasArabic && hasEnglish) {
      setMixedLanguage(true);
      setTextDirection("auto");
    } else if (hasArabic) {
      setMixedLanguage(false);
      setTextDirection("rtl");
    } else {
      setMixedLanguage(false);
      setTextDirection("ltr");
    }
  }, []);

  // Detect Arabic dialect
  const detectDialect = useCallback(
    async (text: string) => {
      if (!enableDialectDetection || !text.trim()) return;

      // Simple dialect detection based on common phrases/words
      const iraqiMarkers = [
        "شلونك",
        "شكو ماكو",
        "بسة",
        "دازة",
        "كلش",
        "لية",
        "عدكم",
      ];
      const gulfMarkers = ["شلونك", "وايد", "خوش", "يالله", "شصاير"];
      const msaMarkers = ["كيف حالك", "ما أخبارك", "كثيراً", "ممتاز"];

      let iraqiScore = 0;
      let gulfScore = 0;
      let msaScore = 0;

      iraqiMarkers.forEach((marker) => {
        if (text.includes(marker)) iraqiScore++;
      });

      gulfMarkers.forEach((marker) => {
        if (text.includes(marker)) gulfScore++;
      });

      msaMarkers.forEach((marker) => {
        if (text.includes(marker)) msaScore++;
      });

      let detected = defaultDialect;
      if (iraqiScore > gulfScore && iraqiScore > msaScore) {
        detected = "iraqi";
      } else if (gulfScore > iraqiScore && gulfScore > msaScore) {
        detected = "gulf";
      } else if (msaScore > 0) {
        detected = "msa";
      }

      if (detected !== detectedDialect) {
        setDetectedDialect(detected);
        setSelectedDialect(detected);
        onDialectChange?.(detected);
      }
    },
    [enableDialectDetection, defaultDialect, detectedDialect, onDialectChange],
  );

  // Cultural validation
  const validateCulturalContent = useCallback(
    async (text: string) => {
      if (!enableCulturalValidation || !text.trim()) return;

      try {
        // Simulate cultural validation - replace with actual API call
        let score = 0.95;

        // Simple scoring based on content
        const inappropriateTerms = ["عنف", "كراهية", "violence", "hate"];
        const hasInappropriate = inappropriateTerms.some((term) =>
          text.toLowerCase().includes(term.toLowerCase()),
        );

        if (hasInappropriate) {
          score = 0.4;
        }

        // Boost score for Islamic phrases
        const islamicPhrases = [
          "بسم الله",
          "إن شاء الله",
          "الحمد لله",
          "اللهم",
        ];
        const hasIslamic = islamicPhrases.some((phrase) =>
          text.includes(phrase),
        );
        if (hasIslamic) {
          score = Math.min(1.0, score + 0.1);
        }

        setCulturalScore(score);
        onCulturalScore?.(score);
      } catch (error) {
        console.error("Cultural validation failed:", error);
      }
    },
    [enableCulturalValidation, onCulturalScore],
  );

  // Translate text
  const translateText = useCallback(
    async (text: string, fromDialect: string) => {
      if (!text.trim()) return;

      setIsTranslating(true);

      try {
        // Simulate translation API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Simple mock translation
        let translated = text;

        // Basic Iraqi to English translation examples
        if (fromDialect === "iraqi") {
          translated = text
            .replace(/شلونك/g, "how are you")
            .replace(/شكو ماكو/g, "what's up")
            .replace(/بسة/g, "only")
            .replace(/دازة/g, "excellent")
            .replace(/كلش/g, "very much");
        }

        const result: TranslationResult = {
          original: text,
          translated,
          confidence: 0.85,
          dialect: fromDialect,
          culturalScore: culturalScore,
          suggestions: enableSuggestions
            ? [
                "Add more descriptive details",
                "Consider cultural context",
                "Use formal language for professional domain",
              ]
            : [],
        };

        setTranslation(translated);
        setTranslationResult(result);
        onTranslationComplete?.(result);
      } catch (error) {
        console.error("Translation failed:", error);
      } finally {
        setIsTranslating(false);
      }
    },
    [culturalScore, enableSuggestions, onTranslationComplete],
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      if (maxLength && newValue.length > maxLength) {
        return;
      }

      setInputValue(newValue);
      onChange?.(newValue, translation, {
        dialect: selectedDialect,
        culturalScore,
      });

      // Detect language/direction
      detectLanguageDirection(newValue);

      // Detect dialect
      detectDialect(newValue);

      // Validate cultural content
      validateCulturalContent(newValue);

      // Auto-translate if enabled
      if (autoTranslate && newValue.length > 10) {
        const timeoutId = setTimeout(() => {
          translateText(newValue, selectedDialect);
        }, 1000);

        return () => clearTimeout(timeoutId);
      }
    },
    [
      maxLength,
      translation,
      selectedDialect,
      culturalScore,
      onChange,
      detectLanguageDirection,
      detectDialect,
      validateCulturalContent,
      autoTranslate,
      translateText,
    ],
  );

  // Auto-resize textarea
  const autoResize = useCallback(
    (textarea: HTMLTextAreaElement) => {
      textarea.style.height = "auto";
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minRows * 24),
        maxRows * 24,
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minRows, maxRows],
  );

  // Copy to clipboard
  const copyToClipboard = useCallback(
    async (text: string, type: "input" | "translation") => {
      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(type);
        setTimeout(() => setCopiedText(null), 2000);
      } catch (error) {
        console.error("Copy failed:", error);
      }
    },
    [],
  );

  // Handle dialect change
  const handleDialectChange = useCallback(
    (dialect: string) => {
      setSelectedDialect(dialect);
      onDialectChange?.(dialect);

      if (inputValue && autoTranslate) {
        translateText(inputValue, dialect);
      }
    },
    [inputValue, autoTranslate, translateText, onDialectChange],
  );

  // Voice input (placeholder)
  const handleVoiceInput = useCallback(() => {
    if (!enableVoiceInput) return;

    setIsRecording(!isRecording);
    // Implementation would use Web Speech API
    console.log("Voice input toggled:", !isRecording);
  }, [enableVoiceInput, isRecording]);

  // Text-to-speech (placeholder)
  const handleTextToSpeech = useCallback(
    (text: string) => {
      setIsPlayingAudio(!isPlayingAudio);

      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = textDirection === "rtl" ? "ar-SA" : "en-US";
        utterance.onend = () => setIsPlayingAudio(false);
        speechSynthesis.speak(utterance);
      }
    },
    [textDirection, isPlayingAudio],
  );

  // Update textarea height on value change
  useEffect(() => {
    if (textareaRef.current) {
      autoResize(textareaRef.current);
    }
  }, [inputValue, autoResize]);

  // Sync external value
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value);
    }
  }, [value, inputValue]);

  // RTL-aware classes
  const rtlClass = isRtlMode ? "rtl" : "ltr";
  const textAlign = isRtlMode ? "text-right" : "text-left";
  const flexDir = isRtlMode ? "flex-row-reverse" : "flex-row";

  // Determine input direction
  const inputDirection =
    textDirection === "auto"
      ? inputValue && /[\u0600-\u06FF]/.test(inputValue)
        ? "rtl"
        : "ltr"
      : textDirection;

  return (
    <div className={`arabic-prompt-input ${rtlClass} ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between mb-3 ${flexDir}`}>
        <div className={`flex items-center gap-2 ${flexDir}`}>
          <Languages className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            {isRtlMode ? "مدخل النص العربي" : "Arabic Text Input"}
          </span>

          {mixedLanguage && (
            <div className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded text-xs text-blue-700">
              <Globe className="w-3 h-3" />
              <span>{isRtlMode ? "مختلط" : "Mixed"}</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className={`flex items-center gap-1 ${flexDir}`}>
          {showCharCount && (
            <span className="text-xs text-gray-500">
              {inputValue.length}
              {maxLength ? `/${maxLength}` : ""}
            </span>
          )}

          {showDialectInfo && (
            <button
              onClick={() => setShowDialectPanel(!showDialectPanel)}
              className="p-1 text-gray-500 hover:text-gray-700 rounded"
              title={isRtlMode ? "معلومات اللهجة" : "Dialect info"}
            >
              <Info className="w-3 h-3" />
            </button>
          )}

          {showTranslation && (
            <button
              onClick={() => setShowTranslationPanel(!showTranslationPanel)}
              className={`p-1 rounded ${showTranslationPanel ? "text-blue-600" : "text-gray-500 hover:text-gray-700"}`}
              title={
                isRtlMode ? "إظهار/إخفاء الترجمة" : "Show/hide translation"
              }
            >
              {showTranslationPanel ? (
                <Eye className="w-3 h-3" />
              ) : (
                <EyeOff className="w-3 h-3" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Dialect Selection Panel */}
      {showDialectPanel && (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className={`text-sm font-medium mb-3 ${textAlign}`}>
            {isRtlMode ? "اختيار اللهجة" : "Dialect Selection"}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {availableDialects.map((dialect) => (
              <button
                key={dialect.code}
                onClick={() => handleDialectChange(dialect.code)}
                className={`p-3 text-left border rounded-lg transition-colors ${
                  selectedDialect === dialect.code
                    ? "bg-blue-50 border-blue-300 text-blue-700"
                    : "bg-white border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className={`font-medium text-sm ${textAlign}`}>
                  {isRtlMode ? dialect.nameAr : dialect.name}
                </div>
                <div className={`text-xs text-gray-600 ${textAlign}`}>
                  {isRtlMode ? dialect.regionAr : dialect.region}
                </div>
                {dialect.code === detectedDialect && (
                  <div className="mt-1 text-xs text-green-600">
                    {isRtlMode ? "مكتشف" : "Detected"}
                  </div>
                )}
              </button>
            ))}
          </div>

          {dialectConfigs[selectedDialect]?.examples && (
            <div className="mt-4">
              <h5
                className={`text-xs font-medium text-gray-700 mb-2 ${textAlign}`}
              >
                {isRtlMode ? "أمثلة" : "Examples"}:
              </h5>
              <div className="text-xs text-gray-600 space-y-1">
                {dialectConfigs[selectedDialect].examples
                  .slice(0, 3)
                  .map((example, idx) => (
                    <div key={idx} className={`${textAlign}`}>
                      {example}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Panel */}
        <div className="space-y-3">
          {/* Input Label */}
          <div className={`flex items-center justify-between ${flexDir}`}>
            <label className={`text-sm font-medium text-gray-700 ${textAlign}`}>
              {isRtlMode ? "النص الأصلي" : "Original Text"}
              {selectedDialect !== "msa" && (
                <span className="ml-2 text-xs text-blue-600">
                  ({dialectConfigs[selectedDialect]?.nameAr || selectedDialect})
                </span>
              )}
            </label>

            <div className={`flex items-center gap-1 ${flexDir}`}>
              {enableCulturalValidation && (
                <div
                  className={`flex items-center gap-1 text-xs ${
                    culturalScore >= 0.8
                      ? "text-green-600"
                      : culturalScore >= 0.6
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  <span>{Math.round(culturalScore * 100)}%</span>
                </div>
              )}

              {enableVoiceInput && (
                <button
                  onClick={handleVoiceInput}
                  disabled={disabled || readOnly}
                  className={`p-1 rounded ${
                    isRecording
                      ? "text-red-600 bg-red-50"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  title={isRtlMode ? "إدخال صوتي" : "Voice input"}
                >
                  {isRecording ? (
                    <Mic className="w-3 h-3" />
                  ) : (
                    <MicOff className="w-3 h-3" />
                  )}
                </button>
              )}

              <button
                onClick={() => copyToClipboard(inputValue, "input")}
                disabled={!inputValue}
                className="p-1 text-gray-500 hover:text-gray-700 rounded disabled:opacity-50"
                title={isRtlMode ? "نسخ" : "Copy"}
              >
                {copiedText === "input" ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>

              <button
                onClick={() => handleTextToSpeech(inputValue)}
                disabled={!inputValue}
                className="p-1 text-gray-500 hover:text-gray-700 rounded disabled:opacity-50"
                title={isRtlMode ? "قراءة صوتية" : "Text to speech"}
              >
                {isPlayingAudio ? (
                  <VolumeX className="w-3 h-3" />
                ) : (
                  <Volume2 className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>

          {/* Input Textarea */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={
                inputDirection === "rtl" ? placeholderAr : placeholder
              }
              disabled={disabled}
              readOnly={readOnly}
              className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none transition-colors ${
                inputDirection === "rtl"
                  ? "text-right font-arabic"
                  : "text-left"
              } ${mixedLanguage ? "font-mixed" : ""}`}
              style={{
                direction: inputDirection,
                minHeight: `${minRows * 24}px`,
                maxHeight: `${maxRows * 24}px`,
              }}
            />

            {culturalScore < 0.8 && inputValue && (
              <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded text-xs text-yellow-700">
                <AlertCircle className="w-3 h-3" />
                <span>{isRtlMode ? "انتباه ثقافي" : "Cultural attention"}</span>
              </div>
            )}
          </div>

          {/* Quick Phrases */}
          {dialectConfigs[selectedDialect]?.commonPhrases && (
            <div className="space-y-2">
              <h5 className={`text-xs font-medium text-gray-700 ${textAlign}`}>
                {isRtlMode ? "عبارات شائعة" : "Common phrases"}:
              </h5>
              <div className="flex flex-wrap gap-1">
                {dialectConfigs[selectedDialect].commonPhrases
                  .slice(0, 4)
                  .map((phrase, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const newValue = inputValue
                          ? `${inputValue} ${phrase.ar}`
                          : phrase.ar;
                        setInputValue(newValue);
                        onChange?.(newValue, translation, {
                          dialect: selectedDialect,
                          culturalScore,
                        });
                      }}
                      disabled={disabled || readOnly}
                      className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 disabled:opacity-50"
                      title={phrase.en}
                    >
                      {phrase.ar}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Translation Panel */}
        {showTranslationPanel && (
          <div className="space-y-3">
            {/* Translation Label */}
            <div className={`flex items-center justify-between ${flexDir}`}>
              <label
                className={`text-sm font-medium text-gray-700 ${textAlign}`}
              >
                {isRtlMode ? "الترجمة الإنجليزية" : "English Translation"}
                {translationResult && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({Math.round(translationResult.confidence * 100)}%
                    confidence)
                  </span>
                )}
              </label>

              <div className={`flex items-center gap-1 ${flexDir}`}>
                {isTranslating && (
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                    <span>{isRtlMode ? "ترجمة..." : "Translating..."}</span>
                  </div>
                )}

                <button
                  onClick={() =>
                    inputValue && translateText(inputValue, selectedDialect)
                  }
                  disabled={!inputValue || isTranslating}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded disabled:opacity-50"
                  title={isRtlMode ? "ترجمة" : "Translate"}
                >
                  <Wand2 className="w-3 h-3" />
                </button>

                <button
                  onClick={() => copyToClipboard(translation, "translation")}
                  disabled={!translation}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded disabled:opacity-50"
                  title={isRtlMode ? "نسخ الترجمة" : "Copy translation"}
                >
                  {copiedText === "translation" ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Translation Textarea */}
            <textarea
              ref={translationRef}
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Translation will appear here..."
              readOnly={!translation && isTranslating}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-left"
              style={{
                direction: "ltr",
                minHeight: `${minRows * 24}px`,
                maxHeight: `${maxRows * 24}px`,
              }}
            />

            {/* Translation Suggestions */}
            {translationResult?.suggestions &&
              translationResult.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h5
                    className={`text-xs font-medium text-gray-700 ${textAlign}`}
                  >
                    {isRtlMode
                      ? "اقتراحات للتحسين"
                      : "Suggestions for improvement"}
                    :
                  </h5>
                  <ul className="space-y-1">
                    {translationResult.suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className={`text-xs text-gray-600 flex items-start gap-1 ${flexDir}`}
                      >
                        <span className="text-blue-600">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {(enableCulturalValidation || professionalDomain !== "general") && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className={`flex items-start gap-2 ${flexDir}`}>
            <Shield className="w-4 h-4 text-green-600 mt-0.5" />
            <div className="text-xs text-green-700">
              <div className={`font-medium ${textAlign}`}>
                {isRtlMode
                  ? "التحقق الثقافي مفعل"
                  : "Cultural validation enabled"}
              </div>
              <div className={`mt-1 ${textAlign}`}>
                {isRtlMode
                  ? `المجال المهني: ${professionalDomain} • النقاط الثقافية: ${Math.round(culturalScore * 100)}% • اللهجة: ${dialectConfigs[selectedDialect]?.nameAr}`
                  : `Professional domain: ${professionalDomain} • Cultural score: ${Math.round(culturalScore * 100)}% • Dialect: ${dialectConfigs[selectedDialect]?.name}`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArabicPromptInput;
