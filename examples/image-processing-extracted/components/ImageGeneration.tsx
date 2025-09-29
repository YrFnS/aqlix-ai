"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ImageIcon,
  Wand2,
  Settings,
  AlertCircle,
  CheckCircle2,
  Clock,
  Zap,
  Shield,
  Globe,
  User,
  FileImage,
  Palette,
  Brain,
  Languages,
  Upload,
} from "lucide-react";

import { ImageDisplay } from "./ImageDisplay";

// Types
interface ImageGenerationRequest {
  prompt: string;
  prompt_ar?: string;
  model: "dall-e-2" | "dall-e-3";
  size: string;
  quality?: "standard" | "hd";
  style?: "vivid" | "natural";
  n?: number;
  professional_domain?:
    | "legal"
    | "medical"
    | "educational"
    | "business"
    | "engineering"
    | "general";
  cultural_validation?: boolean;
  islamic_compliance?: boolean;
  rtl_layout?: boolean;
  user_id?: string;
  response_format?: "url" | "b64_json";
}

interface GenerationResponse {
  success: boolean;
  images: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
    revised_prompt_ar?: string;
    cultural_score?: number;
    islamic_compliant?: boolean;
    professional_context?: string;
  }>;
  cultural_validation?: {
    score: number;
    compliant: boolean;
    recommendations?: string[];
  };
  arabic_processing?: {
    detected_dialect?: string;
    rtl_optimized?: boolean;
    mixed_language?: boolean;
  };
  error?: string;
  processing_time?: number;
}

interface ImageGenerationProps {
  className?: string;
  isRtlMode?: boolean;
  defaultDomain?: string;
  onGeneration?: (result: GenerationResponse) => void;
  culturalValidationRequired?: boolean;
  showAdvancedSettings?: boolean;
  maxImages?: number;
  allowedModels?: string[];
}

export const ImageGeneration: React.FC<ImageGenerationProps> = ({
  className = "",
  isRtlMode = false,
  defaultDomain = "general",
  onGeneration,
  culturalValidationRequired = true,
  showAdvancedSettings = true,
  maxImages = 4,
  allowedModels = ["dall-e-2", "dall-e-3"],
}) => {
  const router = useRouter();
  const promptInputRef = useRef<HTMLTextAreaElement>(null);
  const promptArInputRef = useRef<HTMLTextAreaElement>(null);

  // State Management
  const [prompt, setPrompt] = useState("");
  const [promptAr, setPromptAr] = useState("");
  const [model, setModel] = useState<"dall-e-2" | "dall-e-3">("dall-e-3");
  const [size, setSize] = useState("1024x1024");
  const [quality, setQuality] = useState<"standard" | "hd">("standard");
  const [style, setStyle] = useState<"vivid" | "natural">("natural");
  const [numImages, setNumImages] = useState(1);
  const [professionalDomain, setProfessionalDomain] = useState(defaultDomain);
  const [culturalValidation, setCulturalValidation] = useState(
    culturalValidationRequired,
  );
  const [islamicCompliance, setIslamicCompliance] = useState(true);
  const [rtlLayout, setRtlLayout] = useState(isRtlMode);

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] =
    useState<GenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);

  // Cultural Status
  const [culturalPrecheck, setCulturalPrecheck] = useState<{
    score: number;
    compliant: boolean;
    warnings: string[];
  } | null>(null);

  // Language Detection
  const [detectedLanguage, setDetectedLanguage] = useState<
    "en" | "ar" | "mixed"
  >("en");
  const [activeInput, setActiveInput] = useState<"en" | "ar">("en");

  // Model Configuration
  const modelConfigs = {
    "dall-e-2": {
      sizes: ["256x256", "512x512", "1024x1024"],
      maxImages: 10,
      qualities: ["standard"],
      styles: [],
      estimatedTime: 15,
    },
    "dall-e-3": {
      sizes: ["1024x1024", "1792x1024", "1024x1792"],
      maxImages: 1,
      qualities: ["standard", "hd"],
      styles: ["vivid", "natural"],
      estimatedTime: 30,
    },
  };

  // Professional Domain Options
  const professionalDomains = [
    { value: "general", label: "عام / General", icon: Globe },
    { value: "legal", label: "قانوني / Legal", icon: Shield },
    { value: "medical", label: "طبي / Medical", icon: User },
    { value: "educational", label: "تعليمي / Educational", icon: Brain },
    { value: "business", label: "تجاري / Business", icon: Zap },
    { value: "engineering", label: "هندسي / Engineering", icon: Settings },
  ];

  // Detect language and validate prompt
  useEffect(() => {
    const detectLanguage = (text: string) => {
      const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
      const englishPattern = /[a-zA-Z]/;

      const hasArabic = arabicPattern.test(text);
      const hasEnglish = englishPattern.test(text);

      if (hasArabic && hasEnglish) return "mixed";
      if (hasArabic) return "ar";
      return "en";
    };

    if (prompt || promptAr) {
      const primaryText = activeInput === "en" ? prompt : promptAr;
      setDetectedLanguage(detectLanguage(primaryText));

      // Estimate generation time
      const baseTime = modelConfigs[model].estimatedTime;
      const complexityMultiplier = primaryText.length > 100 ? 1.3 : 1;
      const culturalMultiplier = culturalValidation ? 1.2 : 1;
      setEstimatedTime(
        Math.round(baseTime * complexityMultiplier * culturalMultiplier),
      );
    }
  }, [prompt, promptAr, model, culturalValidation, activeInput]);

  // Cultural precheck for prompts
  const performCulturalPrecheck = useCallback(
    async (text: string) => {
      if (!culturalValidation || !text.trim()) return;

      try {
        // Simulate cultural validation API call
        // In actual implementation, this would call the cultural validator
        const mockValidation = {
          score: Math.random() * 0.3 + 0.7, // 0.7-1.0
          compliant: true,
          warnings: text.toLowerCase().includes("inappropriate")
            ? ["Content may require adjustment for cultural appropriateness"]
            : [],
        };

        setCulturalPrecheck(mockValidation);
      } catch (error) {
        console.error("Cultural precheck failed:", error);
      }
    },
    [culturalValidation],
  );

  // Handle prompt changes with debounced cultural validation
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeText = activeInput === "en" ? prompt : promptAr;
      performCulturalPrecheck(activeText);
    }, 1000);

    return () => clearTimeout(timer);
  }, [prompt, promptAr, activeInput, performCulturalPrecheck]);

  // Handle model change
  const handleModelChange = (newModel: "dall-e-2" | "dall-e-3") => {
    setModel(newModel);
    const config = modelConfigs[newModel];

    // Reset size if not supported
    if (!config.sizes.includes(size)) {
      setSize(config.sizes[0]);
    }

    // Reset quality if not supported
    if (!config.qualities.includes(quality)) {
      setQuality(config.qualities[0]);
    }

    // Reset style if not supported
    if (config.styles.length > 0 && !config.styles.includes(style)) {
      setStyle(config.styles[0]);
    }

    // Adjust number of images
    if (numImages > config.maxImages) {
      setNumImages(config.maxImages);
    }
  };

  // Generate images
  const handleGenerate = async () => {
    if (!prompt.trim() && !promptAr.trim()) {
      setError(
        isRtlMode
          ? "يرجى إدخال وصف للصورة"
          : "Please enter a description for the image",
      );
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImages(null);

    try {
      const requestData: ImageGenerationRequest = {
        prompt: prompt.trim(),
        prompt_ar: promptAr.trim(),
        model,
        size,
        quality: model === "dall-e-3" ? quality : undefined,
        style: model === "dall-e-3" ? style : undefined,
        n: numImages,
        professional_domain: professionalDomain,
        cultural_validation: culturalValidation,
        islamic_compliance: islamicCompliance,
        rtl_layout: rtlLayout,
        response_format: "url",
      };

      // Simulate API call - replace with actual API endpoint
      const response = await fetch("/api/v1/images/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.statusText}`);
      }

      const result: GenerationResponse = await response.json();

      if (result.success) {
        setGeneratedImages(result);
        onGeneration?.(result);
      } else {
        throw new Error(result.error || "Generation failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Generation failed";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  // Clear results
  const handleClear = () => {
    setGeneratedImages(null);
    setError(null);
    setCulturalPrecheck(null);
  };

  // RTL-aware classes
  const rtlClass = isRtlMode ? "rtl" : "ltr";
  const textAlign = isRtlMode ? "text-right" : "text-left";
  const flexDir = isRtlMode ? "flex-row-reverse" : "flex-row";

  return (
    <div className={`image-generation-container ${rtlClass} ${className}`}>
      {/* Header */}
      <div className={`flex items-center gap-3 mb-6 ${flexDir}`}>
        <div className="flex items-center gap-2">
          <Palette className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {isRtlMode
              ? "إنتاج الصور بالذكاء الاصطناعي"
              : "AI Image Generation"}
          </h2>
        </div>

        {culturalValidation && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded text-xs text-green-700">
            <Shield className="w-3 h-3" />
            <span>{isRtlMode ? "التحقق الثقافي" : "Cultural Validation"}</span>
          </div>
        )}
      </div>

      {/* Main Generation Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Generation Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Prompt Inputs */}
          <div className="space-y-4">
            {/* Language Selection */}
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setActiveInput("en")}
                className={`px-3 py-1 text-xs rounded ${
                  activeInput === "en"
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}
              >
                <Languages className="w-3 h-3 inline mr-1" />
                English
              </button>
              <button
                onClick={() => setActiveInput("ar")}
                className={`px-3 py-1 text-xs rounded ${
                  activeInput === "ar"
                    ? "bg-blue-100 text-blue-700 border border-blue-300"
                    : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}
              >
                <Languages className="w-3 h-3 inline mr-1" />
                العربية
              </button>
            </div>

            {/* English Prompt */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
              >
                English Prompt
              </label>
              <textarea
                ref={promptInputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none ${textAlign}`}
                rows={3}
                style={{ direction: "ltr" }}
              />
            </div>

            {/* Arabic Prompt */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
              >
                Arabic Prompt / النص العربي
              </label>
              <textarea
                ref={promptArInputRef}
                value={promptAr}
                onChange={(e) => setPromptAr(e.target.value)}
                placeholder="صف الصورة التي تريد إنتاجها..."
                className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-right font-arabic`}
                rows={3}
                style={{ direction: "rtl" }}
              />
            </div>

            {/* Cultural Precheck Status */}
            {culturalPrecheck && (
              <div
                className={`p-3 rounded-lg border ${
                  culturalPrecheck.compliant
                    ? "bg-green-50 border-green-200"
                    : "bg-yellow-50 border-yellow-200"
                }`}
              >
                <div className={`flex items-center gap-2 ${flexDir}`}>
                  {culturalPrecheck.compliant ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      culturalPrecheck.compliant
                        ? "text-green-700"
                        : "text-yellow-700"
                    }`}
                  >
                    {isRtlMode ? "التقييم الثقافي" : "Cultural Assessment"}:{" "}
                    {Math.round(culturalPrecheck.score * 100)}%
                  </span>
                </div>
                {culturalPrecheck.warnings.length > 0 && (
                  <ul className="mt-2 text-xs text-gray-600 space-y-1">
                    {culturalPrecheck.warnings.map((warning, idx) => (
                      <li key={idx} className={textAlign}>
                        • {warning}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Professional Domain */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
            >
              {isRtlMode ? "المجال المهني" : "Professional Domain"}
            </label>
            <select
              value={professionalDomain}
              onChange={(e) => setProfessionalDomain(e.target.value)}
              className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${textAlign}`}
            >
              {professionalDomains.map((domain) => (
                <option key={domain.value} value={domain.value}>
                  {domain.label}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selection */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
            >
              {isRtlMode ? "النموذج" : "Model"}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {allowedModels.map((modelOption) => (
                <button
                  key={modelOption}
                  onClick={() =>
                    handleModelChange(modelOption as "dall-e-2" | "dall-e-3")
                  }
                  className={`p-2 text-sm rounded-lg border ${
                    model === modelOption
                      ? "bg-blue-50 border-blue-300 text-blue-700"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {modelOption.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Basic Settings */}
          <div className="space-y-4">
            {/* Image Size */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
              >
                {isRtlMode ? "حجم الصورة" : "Image Size"}
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${textAlign}`}
              >
                {modelConfigs[model].sizes.map((sizeOption) => (
                  <option key={sizeOption} value={sizeOption}>
                    {sizeOption}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Images */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
              >
                {isRtlMode ? "عدد الصور" : "Number of Images"}: {numImages}
              </label>
              <input
                type="range"
                min="1"
                max={Math.min(modelConfigs[model].maxImages, maxImages)}
                value={numImages}
                onChange={(e) => setNumImages(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          {showAdvancedSettings && (
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 ${flexDir}`}
              >
                <Settings className="w-4 h-4" />
                <span>
                  {isRtlMode ? "الإعدادات المتقدمة" : "Advanced Settings"}
                </span>
              </button>

              {showAdvanced && (
                <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                  {/* Quality (DALL-E 3 only) */}
                  {model === "dall-e-3" && (
                    <div>
                      <label
                        className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
                      >
                        {isRtlMode ? "الجودة" : "Quality"}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {modelConfigs[model].qualities.map((qualityOption) => (
                          <button
                            key={qualityOption}
                            onClick={() => setQuality(qualityOption)}
                            className={`p-2 text-sm rounded border ${
                              quality === qualityOption
                                ? "bg-blue-50 border-blue-300 text-blue-700"
                                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            {qualityOption === "hd" ? "HD" : "Standard"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Style (DALL-E 3 only) */}
                  {model === "dall-e-3" &&
                    modelConfigs[model].styles.length > 0 && (
                      <div>
                        <label
                          className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
                        >
                          {isRtlMode ? "النمط" : "Style"}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {modelConfigs[model].styles.map((styleOption) => (
                            <button
                              key={styleOption}
                              onClick={() => setStyle(styleOption)}
                              className={`p-2 text-sm rounded border ${
                                style === styleOption
                                  ? "bg-blue-50 border-blue-300 text-blue-700"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {styleOption === "vivid" ? "Vivid" : "Natural"}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Cultural Settings */}
                  <div className="space-y-3">
                    <div
                      className={`flex items-center justify-between ${flexDir}`}
                    >
                      <span className="text-sm text-gray-700">
                        {isRtlMode ? "التحقق الثقافي" : "Cultural Validation"}
                      </span>
                      <input
                        type="checkbox"
                        checked={culturalValidation}
                        onChange={(e) =>
                          setCulturalValidation(e.target.checked)
                        }
                        className="rounded"
                      />
                    </div>
                    <div
                      className={`flex items-center justify-between ${flexDir}`}
                    >
                      <span className="text-sm text-gray-700">
                        {isRtlMode ? "الامتثال الإسلامي" : "Islamic Compliance"}
                      </span>
                      <input
                        type="checkbox"
                        checked={islamicCompliance}
                        onChange={(e) => setIslamicCompliance(e.target.checked)}
                        className="rounded"
                      />
                    </div>
                    <div
                      className={`flex items-center justify-between ${flexDir}`}
                    >
                      <span className="text-sm text-gray-700">
                        {isRtlMode ? "تخطيط من اليمين لليسار" : "RTL Layout"}
                      </span>
                      <input
                        type="checkbox"
                        checked={rtlLayout}
                        onChange={(e) => setRtlLayout(e.target.checked)}
                        className="rounded"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Generation Button */}
          <div className="space-y-3">
            {estimatedTime > 0 && (
              <div
                className={`flex items-center gap-2 text-xs text-gray-600 ${flexDir}`}
              >
                <Clock className="w-3 h-3" />
                <span>
                  {isRtlMode ? "الوقت المتوقع" : "Estimated time"}: ~
                  {estimatedTime}s
                </span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!prompt.trim() && !promptAr.trim())}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                isGenerating ? "cursor-wait" : ""
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isRtlMode ? "جاري الإنتاج..." : "Generating..."}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>{isRtlMode ? "إنتاج الصور" : "Generate Images"}</span>
                </>
              )}
            </button>

            {(generatedImages || error) && (
              <button
                onClick={handleClear}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {isRtlMode ? "مسح النتائج" : "Clear Results"}
              </button>
            )}
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="lg:col-span-2">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className={`flex items-center gap-2 ${flexDir}`}>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  {isRtlMode ? "خطأ في الإنتاج" : "Generation Error"}
                </span>
              </div>
              <p className={`mt-2 text-sm text-red-600 ${textAlign}`}>
                {error}
              </p>
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">
                  {isRtlMode ? "جاري إنتاج الصور..." : "Generating images..."}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {isRtlMode
                    ? "قد يستغرق هذا بضع دقائق"
                    : "This may take a few minutes"}
                </p>
              </div>
            </div>
          )}

          {/* Generated Images */}
          {generatedImages && generatedImages.success && (
            <div className="space-y-6">
              {/* Generation Summary */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className={`flex items-center gap-2 mb-2 ${flexDir}`}>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {isRtlMode ? "تم الإنتاج بنجاح" : "Generation Successful"}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className={textAlign}>
                    <span className="text-gray-600">
                      {isRtlMode ? "الصور:" : "Images:"}
                    </span>
                    <span className="ml-1 font-medium">
                      {generatedImages.images.length}
                    </span>
                  </div>
                  {generatedImages.processing_time && (
                    <div className={textAlign}>
                      <span className="text-gray-600">
                        {isRtlMode ? "الوقت:" : "Time:"}
                      </span>
                      <span className="ml-1 font-medium">
                        {generatedImages.processing_time}s
                      </span>
                    </div>
                  )}
                  {generatedImages.cultural_validation && (
                    <div className={textAlign}>
                      <span className="text-gray-600">
                        {isRtlMode ? "التقييم الثقافي:" : "Cultural Score:"}
                      </span>
                      <span className="ml-1 font-medium">
                        {Math.round(
                          generatedImages.cultural_validation.score * 100,
                        )}
                        %
                      </span>
                    </div>
                  )}
                  <div className={textAlign}>
                    <span className="text-gray-600">
                      {isRtlMode ? "النموذج:" : "Model:"}
                    </span>
                    <span className="ml-1 font-medium">
                      {model.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedImages.images.map((image, index) => (
                  <ImageDisplay
                    key={index}
                    imageData={{
                      url: image.url,
                      base64: image.b64_json,
                      alt: `Generated image ${index + 1}`,
                    }}
                    originalPrompt={prompt}
                    originalPromptAr={promptAr}
                    revisedPrompt={image.revised_prompt}
                    revisedPromptAr={image.revised_prompt_ar}
                    culturalScore={image.cultural_score}
                    islamicCompliant={image.islamic_compliant}
                    professionalDomain={professionalDomain}
                    isRtlMode={isRtlMode}
                    showCulturalBadge={culturalValidation}
                    showDownload={true}
                    showFullscreen={true}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isGenerating && !generatedImages && !error && (
            <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <FileImage className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  {isRtlMode ? "ابدأ بإنتاج الصور" : "Start Generating Images"}
                </p>
                <p className="text-sm text-gray-500">
                  {isRtlMode
                    ? "أدخل وصفاً للصورة التي تريد إنتاجها"
                    : "Enter a description for the image you want to generate"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageGeneration;
