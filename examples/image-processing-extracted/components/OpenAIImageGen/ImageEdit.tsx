"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload,
  Edit3,
  RotateCcw,
  Download,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Eye,
  EyeOff,
  Layers,
  Brush,
  Scissors,
  Languages,
  Shield,
  Wand2,
} from "lucide-react";

import { ImageDisplay } from "../ImageDisplay";

// Types
interface EditRequest {
  image: File | string; // File or base64/URL
  mask?: File | string; // File or base64/URL for areas to edit
  prompt: string;
  prompt_ar?: string;
  model: "dall-e-2";
  size?: "256x256" | "512x512" | "1024x1024";
  n?: number;
  professional_domain?: string;
  cultural_validation?: boolean;
  islamic_compliance?: boolean;
  user_id?: string;
  response_format?: "url" | "b64_json";
}

interface EditResponse {
  success: boolean;
  images: Array<{
    url?: string;
    b64_json?: string;
    revised_prompt?: string;
    revised_prompt_ar?: string;
    cultural_score?: number;
    islamic_compliant?: boolean;
  }>;
  cultural_validation?: {
    score: number;
    compliant: boolean;
    recommendations?: string[];
  };
  original_preserved?: boolean;
  error?: string;
  processing_time?: number;
}

interface ImageEditProps {
  className?: string;
  isRtlMode?: boolean;
  defaultDomain?: string;
  onEdit?: (result: EditResponse) => void;
  culturalValidationRequired?: boolean;
  maxImages?: number;
  allowedSizes?: string[];
  showMaskEditor?: boolean;
}

export const ImageEdit: React.FC<ImageEditProps> = ({
  className = "",
  isRtlMode = false,
  defaultDomain = "general",
  onEdit,
  culturalValidationRequired = true,
  maxImages = 4,
  allowedSizes = ["256x256", "512x512", "1024x1024"],
  showMaskEditor = true,
}) => {
  // Refs
  const originalImageRef = useRef<HTMLInputElement>(null);
  const maskImageRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

  // State Management
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>("");
  const [maskImage, setMaskImage] = useState<File | null>(null);
  const [maskImageUrl, setMaskImageUrl] = useState<string>("");
  const [showMaskPreview, setShowMaskPreview] = useState(true);

  // Edit parameters
  const [prompt, setPrompt] = useState("");
  const [promptAr, setPromptAr] = useState("");
  const [size, setSize] = useState<"256x256" | "512x512" | "1024x1024">(
    "1024x1024",
  );
  const [numImages, setNumImages] = useState(1);
  const [professionalDomain, setProfessionalDomain] = useState(defaultDomain);
  const [culturalValidation, setCulturalValidation] = useState(
    culturalValidationRequired,
  );
  const [islamicCompliance, setIslamicCompliance] = useState(true);

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedImages, setEditedImages] = useState<EditResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<
    "original" | "masked" | "overlay"
  >("original");

  // Mask editor state
  const [isDrawing, setIsDrawing] = useState(false);
  const [maskEditMode, setMaskEditMode] = useState<"draw" | "erase">("draw");
  const [brushSize, setBrushSize] = useState(20);

  // Professional Domain Options
  const professionalDomains = [
    { value: "general", label: "عام / General" },
    { value: "legal", label: "قانوني / Legal" },
    { value: "medical", label: "طبي / Medical" },
    { value: "educational", label: "تعليمي / Educational" },
    { value: "business", label: "تجاري / Business" },
    { value: "engineering", label: "هندسي / Engineering" },
  ];

  // Handle original image upload
  const handleOriginalImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError(
          isRtlMode
            ? "يرجى اختيار ملف صورة صالح"
            : "Please select a valid image file",
        );
        return;
      }

      // Validate file size (max 4MB)
      if (file.size > 4 * 1024 * 1024) {
        setError(
          isRtlMode
            ? "حجم الملف كبير جداً (الحد الأقصى 4MB)"
            : "File too large (max 4MB)",
        );
        return;
      }

      setOriginalImage(file);
      setError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setOriginalImageUrl(url);

      // Clear existing mask
      setMaskImage(null);
      setMaskImageUrl("");
    },
    [isRtlMode],
  );

  // Handle mask image upload
  const handleMaskImageUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        setError(
          isRtlMode
            ? "يرجى اختيار ملف قناع صالح"
            : "Please select a valid mask image",
        );
        return;
      }

      setMaskImage(file);
      setError(null);

      const url = URL.createObjectURL(file);
      setMaskImageUrl(url);
    },
    [isRtlMode],
  );

  // Canvas mask drawing
  const startDrawing = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;
      setIsDrawing(true);

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      ctx.globalCompositeOperation =
        maskEditMode === "draw" ? "source-over" : "destination-out";
      ctx.strokeStyle = maskEditMode === "draw" ? "white" : "transparent";
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, 2 * Math.PI);
      ctx.fill();
    },
    [maskEditMode, brushSize],
  );

  const draw = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      ctx.lineTo(x, y);
      ctx.stroke();
    },
    [isDrawing],
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Clear mask
  const clearMask = useCallback(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
    setMaskImage(null);
    setMaskImageUrl("");
  }, []);

  // Convert canvas to mask file
  const canvasToMask = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      if (!canvasRef.current) {
        resolve(null);
        return;
      }

      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "mask.png", { type: "image/png" });
          resolve(file);
        } else {
          resolve(null);
        }
      }, "image/png");
    });
  }, []);

  // Perform image edit
  const handleEdit = async () => {
    if (!originalImage) {
      setError(
        isRtlMode
          ? "يرجى اختيار صورة أصلية"
          : "Please select an original image",
      );
      return;
    }

    if (!prompt.trim() && !promptAr.trim()) {
      setError(
        isRtlMode
          ? "يرجى إدخال وصف للتعديل"
          : "Please enter an edit description",
      );
      return;
    }

    setIsProcessing(true);
    setError(null);
    setEditedImages(null);

    try {
      // Get mask from canvas if drawing, or use uploaded mask
      let maskFile = maskImage;
      if (!maskFile && canvasRef.current) {
        maskFile = await canvasToMask();
      }

      if (!maskFile) {
        throw new Error(
          isRtlMode
            ? "يرجى إنشاء قناع للمناطق المراد تعديلها"
            : "Please create a mask for areas to edit",
        );
      }

      const formData = new FormData();
      formData.append("image", originalImage);
      formData.append("mask", maskFile);
      formData.append("prompt", prompt.trim());
      if (promptAr.trim()) formData.append("prompt_ar", promptAr.trim());
      formData.append("model", "dall-e-2");
      formData.append("size", size);
      formData.append("n", numImages.toString());
      formData.append("professional_domain", professionalDomain);
      formData.append("cultural_validation", culturalValidation.toString());
      formData.append("islamic_compliance", islamicCompliance.toString());
      formData.append("response_format", "url");

      // Simulate API call - replace with actual endpoint
      const response = await fetch("/api/v1/images/edit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Edit failed: ${response.statusText}`);
      }

      const result: EditResponse = await response.json();

      if (result.success) {
        setEditedImages(result);
        onEdit?.(result);
      } else {
        throw new Error(result.error || "Edit failed");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Edit failed";
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Clean up URLs
  useEffect(() => {
    return () => {
      if (originalImageUrl && originalImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(originalImageUrl);
      }
      if (maskImageUrl && maskImageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(maskImageUrl);
      }
    };
  }, [originalImageUrl, maskImageUrl]);

  // RTL-aware classes
  const rtlClass = isRtlMode ? "rtl" : "ltr";
  const textAlign = isRtlMode ? "text-right" : "text-left";
  const flexDir = isRtlMode ? "flex-row-reverse" : "flex-row";

  return (
    <div className={`image-edit-container ${rtlClass} ${className}`}>
      {/* Header */}
      <div className={`flex items-center gap-3 mb-6 ${flexDir}`}>
        <div className="flex items-center gap-2">
          <Edit3 className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            {isRtlMode ? "تعديل الصور بالذكاء الاصطناعي" : "AI Image Editing"}
          </h2>
        </div>

        {culturalValidation && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded text-xs text-green-700">
            <Shield className="w-3 h-3" />
            <span>{isRtlMode ? "التحقق الثقافي" : "Cultural Validation"}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Upload & Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Original Image Upload */}
          <div>
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
            >
              {isRtlMode ? "الصورة الأصلية" : "Original Image"}
            </label>
            <div className="space-y-3">
              <input
                ref={originalImageRef}
                type="file"
                accept="image/*"
                onChange={handleOriginalImageUpload}
                className="hidden"
              />
              <button
                onClick={() => originalImageRef.current?.click()}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 focus:border-blue-500 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  {isRtlMode ? "اختر صورة للتعديل" : "Choose image to edit"}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG (Max 4MB)</p>
              </button>

              {originalImage && (
                <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                  ✓ {originalImage.name} (
                  {(originalImage.size / 1024).toFixed(1)}KB)
                </div>
              )}
            </div>
          </div>

          {/* Mask Upload/Editor */}
          {originalImage && (
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
              >
                {isRtlMode ? "قناع التعديل" : "Edit Mask"}
              </label>

              <div className="space-y-3">
                {/* Mask method selection */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => maskImageRef.current?.click()}
                    className="p-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
                  >
                    <Upload className="w-3 h-3 mx-auto mb-1" />
                    {isRtlMode ? "رفع قناع" : "Upload Mask"}
                  </button>

                  {showMaskEditor && (
                    <button
                      onClick={() => setPreviewMode("masked")}
                      className="p-2 text-xs border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <Brush className="w-3 h-3 mx-auto mb-1" />
                      {isRtlMode ? "رسم قناع" : "Draw Mask"}
                    </button>
                  )}
                </div>

                <input
                  ref={maskImageRef}
                  type="file"
                  accept="image/*"
                  onChange={handleMaskImageUpload}
                  className="hidden"
                />

                {/* Mask drawing tools */}
                {showMaskEditor && previewMode === "masked" && (
                  <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                    <div
                      className={`flex items-center justify-between ${flexDir}`}
                    >
                      <span className="text-xs text-gray-700">
                        {isRtlMode ? "أدوات الرسم" : "Drawing Tools"}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setMaskEditMode("draw")}
                          className={`p-1 text-xs rounded ${
                            maskEditMode === "draw"
                              ? "bg-blue-100 text-blue-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <Brush className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => setMaskEditMode("erase")}
                          className={`p-1 text-xs rounded ${
                            maskEditMode === "erase"
                              ? "bg-red-100 text-red-700"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <Scissors className="w-3 h-3" />
                        </button>
                        <button
                          onClick={clearMask}
                          className="p-1 text-xs text-red-600 hover:bg-red-100 rounded"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className={`block text-xs text-gray-600 mb-1 ${textAlign}`}
                      >
                        {isRtlMode ? "حجم الفرشاة" : "Brush Size"}: {brushSize}
                        px
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit Prompt */}
          {originalImage && (
            <div className="space-y-4">
              {/* English Prompt */}
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
                >
                  {isRtlMode
                    ? "وصف التعديل (إنجليزي)"
                    : "Edit Description (English)"}
                </label>
                <textarea
                  ref={promptInputRef}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to change in the marked areas..."
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
                  {isRtlMode
                    ? "وصف التعديل (عربي)"
                    : "Edit Description (Arabic)"}
                </label>
                <textarea
                  value={promptAr}
                  onChange={(e) => setPromptAr(e.target.value)}
                  placeholder="صف التغييرات المطلوبة في المناطق المحددة..."
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-right font-arabic`}
                  rows={3}
                  style={{ direction: "rtl" }}
                />
              </div>
            </div>
          )}

          {/* Edit Settings */}
          {originalImage && (
            <div className="space-y-4">
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

              {/* Size Selection */}
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
                >
                  {isRtlMode ? "حجم الصورة" : "Image Size"}
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value as any)}
                  className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${textAlign}`}
                >
                  {allowedSizes.map((sizeOption) => (
                    <option key={sizeOption} value={sizeOption}>
                      {sizeOption}
                    </option>
                  ))}
                </select>
              </div>

              {/* Number of variations */}
              <div>
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
                >
                  {isRtlMode ? "عدد الإصدارات" : "Number of Variations"}:{" "}
                  {numImages}
                </label>
                <input
                  type="range"
                  min="1"
                  max={maxImages}
                  value={numImages}
                  onChange={(e) => setNumImages(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Cultural Settings */}
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                <div className={`flex items-center justify-between ${flexDir}`}>
                  <span className="text-sm text-gray-700">
                    {isRtlMode ? "التحقق الثقافي" : "Cultural Validation"}
                  </span>
                  <input
                    type="checkbox"
                    checked={culturalValidation}
                    onChange={(e) => setCulturalValidation(e.target.checked)}
                    className="rounded"
                  />
                </div>
                <div className={`flex items-center justify-between ${flexDir}`}>
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
              </div>
            </div>
          )}

          {/* Edit Button */}
          {originalImage && (
            <button
              onClick={handleEdit}
              disabled={isProcessing || (!prompt.trim() && !promptAr.trim())}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed ${
                isProcessing ? "cursor-wait" : ""
              }`}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{isRtlMode ? "جاري التعديل..." : "Editing..."}</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>{isRtlMode ? "تعديل الصورة" : "Edit Image"}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Middle Panel - Preview */}
        <div className="lg:col-span-1">
          {originalImage ? (
            <div className="space-y-4">
              {/* Preview Mode Selector */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                {["original", "masked", "overlay"].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode as any)}
                    className={`flex-1 px-3 py-2 text-xs rounded ${
                      previewMode === mode
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {mode === "original" &&
                      (isRtlMode ? "الأصلية" : "Original")}
                    {mode === "masked" && (isRtlMode ? "مع القناع" : "Masked")}
                    {mode === "overlay" && (isRtlMode ? "معاينة" : "Overlay")}
                  </button>
                ))}
              </div>

              {/* Image Preview */}
              <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={originalImageUrl}
                  alt="Original"
                  className="w-full h-auto"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />

                {/* Canvas overlay for mask editing */}
                {previewMode === "masked" && showMaskEditor && (
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                  />
                )}

                {/* Mask preview overlay */}
                {previewMode === "overlay" && maskImageUrl && (
                  <img
                    src={maskImageUrl}
                    alt="Mask"
                    className="absolute inset-0 w-full h-full opacity-50"
                    style={{ mixBlendMode: "multiply" }}
                  />
                )}
              </div>

              {/* Instructions */}
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                {previewMode === "masked" && showMaskEditor && (
                  <p className={textAlign}>
                    {isRtlMode
                      ? "ارسم على المناطق التي تريد تعديلها. المناطق البيضاء ستتم معالجتها."
                      : "Draw on areas you want to edit. White areas will be processed."}
                  </p>
                )}
                {previewMode === "original" && (
                  <p className={textAlign}>
                    {isRtlMode
                      ? "الصورة الأصلية التي ستتم معالجتها."
                      : "Original image that will be processed."}
                  </p>
                )}
                {previewMode === "overlay" && (
                  <p className={textAlign}>
                    {isRtlMode
                      ? "معاينة القناع على الصورة الأصلية."
                      : "Preview of mask overlaid on original image."}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  {isRtlMode ? "رفع صورة" : "Upload Image"}
                </p>
                <p className="text-sm text-gray-500">
                  {isRtlMode
                    ? "اختر صورة لبدء التعديل"
                    : "Choose an image to start editing"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Results */}
        <div className="lg:col-span-1">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className={`flex items-center gap-2 ${flexDir}`}>
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  {isRtlMode ? "خطأ في التعديل" : "Edit Error"}
                </span>
              </div>
              <p className={`mt-2 text-sm text-red-600 ${textAlign}`}>
                {error}
              </p>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">
                  {isRtlMode ? "جاري تعديل الصورة..." : "Editing image..."}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {isRtlMode
                    ? "قد يستغرق هذا بضع دقائق"
                    : "This may take a few minutes"}
                </p>
              </div>
            </div>
          )}

          {/* Edited Images */}
          {editedImages && editedImages.success && (
            <div className="space-y-6">
              {/* Edit Summary */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className={`flex items-center gap-2 mb-2 ${flexDir}`}>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    {isRtlMode ? "تم التعديل بنجاح" : "Edit Successful"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className={textAlign}>
                    <span className="text-gray-600">
                      {isRtlMode ? "الإصدارات:" : "Variations:"}
                    </span>
                    <span className="ml-1 font-medium">
                      {editedImages.images.length}
                    </span>
                  </div>
                  {editedImages.processing_time && (
                    <div className={textAlign}>
                      <span className="text-gray-600">
                        {isRtlMode ? "الوقت:" : "Time:"}
                      </span>
                      <span className="ml-1 font-medium">
                        {editedImages.processing_time}s
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Edited Images Grid */}
              <div className="space-y-4">
                {editedImages.images.map((image, index) => (
                  <ImageDisplay
                    key={index}
                    imageData={{
                      url: image.url,
                      base64: image.b64_json,
                      alt: `Edited image ${index + 1}`,
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
          {!isProcessing && !editedImages && !error && (
            <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Edit3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-600 mb-2">
                  {isRtlMode ? "جاهز للتعديل" : "Ready to Edit"}
                </p>
                <p className="text-sm text-gray-500">
                  {isRtlMode
                    ? "النتائج ستظهر هنا بعد التعديل"
                    : "Edited images will appear here"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageEdit;
