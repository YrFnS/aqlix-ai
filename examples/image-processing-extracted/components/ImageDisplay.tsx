/**
 * RTL-Optimized Image Display Component
 * Extracted and enhanced from LibreChat for Iraqi AI Chat System
 *
 * Features:
 * - Right-to-left layout support
 * - Arabic caption handling
 * - Cultural content indicators
 * - Professional domain context
 * - Islamic compliance badges
 * - Responsive design for Arabic UI
 */

import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Eye,
  EyeOff,
  RotateCcw,
  Share2,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Iraqi AI system integration
import { useCulturalValidation } from "@/hooks/useCulturalValidation";
import { useArabicTextDirection } from "@/hooks/useArabicTextDirection";
import { ProfessionalDomainBadge } from "@/components/ui/professional-domain-badge";
import { CulturalComplianceBadge } from "@/components/ui/cultural-compliance-badge";
import { ArabicTooltip } from "@/components/ui/arabic-tooltip";

interface ImageDisplayProps {
  imageData: string;
  imageUrl?: string;
  originalPrompt: string;
  originalPromptAr?: string;
  revisedPrompt?: string;
  revisedPromptAr?: string;

  // Iraqi-specific props
  culturalScore: number;
  islamicCompliant: boolean;
  professionalDomain: string;
  professionalAppropriate: boolean;

  // Display options
  showMetadata?: boolean;
  showCulturalBadges?: boolean;
  allowDownload?: boolean;
  allowShare?: boolean;
  isRtlMode?: boolean;

  // Styling
  className?: string;
  width?: number;
  height?: number;

  // Events
  onImageClick?: () => void;
  onDownload?: (imageData: string) => void;
  onShare?: (imageData: string) => void;
  onCulturalReport?: (imageData: string) => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  imageData,
  imageUrl,
  originalPrompt,
  originalPromptAr,
  revisedPrompt,
  revisedPromptAr,
  culturalScore = 0.95,
  islamicCompliant = true,
  professionalDomain = "general",
  professionalAppropriate = true,
  showMetadata = true,
  showCulturalBadges = true,
  allowDownload = true,
  allowShare = false,
  isRtlMode = false,
  className = "",
  width,
  height,
  onImageClick,
  onDownload,
  onShare,
  onCulturalReport,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPromptDetails, setShowPromptDetails] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Iraqi AI hooks
  const { validateImageContent } = useCulturalValidation();
  const { getTextDirection, isArabicText } = useArabicTextDirection();

  // Determine text directions
  const promptDirection = getTextDirection(originalPrompt);
  const arabicPromptDirection = originalPromptAr
    ? getTextDirection(originalPromptAr)
    : "ltr";

  // Cultural compliance status
  const getCulturalStatus = () => {
    if (!islamicCompliant) return "blocked";
    if (culturalScore >= 0.95) return "excellent";
    if (culturalScore >= 0.85) return "good";
    if (culturalScore >= 0.75) return "acceptable";
    return "needs_review";
  };

  const culturalStatus = getCulturalStatus();

  // Handle image download
  const handleDownload = async () => {
    if (!allowDownload || !onDownload) return;

    try {
      const link = document.createElement("a");
      const displayUrl = imageUrl || `data:image/png;base64,${imageData}`;

      // Add cultural metadata to filename
      const timestamp = new Date().toISOString().slice(0, 10);
      const domain =
        professionalDomain !== "general" ? `_${professionalDomain}` : "";
      const cultural = islamicCompliant ? "_halal" : "";
      const filename = `iraqi_ai_image_${timestamp}${domain}${cultural}.png`;

      link.href = displayUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      onDownload(imageData);
    } catch (error) {
      console.error("Image download failed:", error);
    }
  };

  // Handle image sharing
  const handleShare = async () => {
    if (!allowShare || !onShare) return;

    try {
      if (navigator.share && navigator.canShare) {
        const displayUrl = imageUrl || `data:image/png;base64,${imageData}`;
        const shareTitle =
          originalPromptAr ||
          originalPrompt ||
          "صورة من النظام العراقي للذكاء الاصطناعي";

        await navigator.share({
          title: shareTitle,
          text: `Generated with Iraqi AI Chat System - Cultural Score: ${(culturalScore * 100).toFixed(1)}%`,
          url: displayUrl,
        });
      }

      onShare(imageData);
    } catch (error) {
      console.error("Image sharing failed:", error);
    }
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle cultural report
  const handleCulturalReport = () => {
    if (onCulturalReport) {
      onCulturalReport(imageData);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case "Escape":
          setIsFullscreen(false);
          break;
        case "d":
        case "D":
          handleDownload();
          break;
        case "s":
        case "S":
          handleShare();
          break;
        case "i":
        case "I":
          setShowPromptDetails(!showPromptDetails);
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen, showPromptDetails]);

  const displayUrl = imageUrl || `data:image/png;base64,${imageData}`;

  return (
    <>
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className={cn(
          "relative group rounded-lg overflow-hidden border transition-all duration-200",
          isRtlMode ? "text-right" : "text-left",
          culturalStatus === "blocked" && "border-red-500 bg-red-50",
          culturalStatus === "excellent" && "border-green-500 bg-green-50",
          culturalStatus === "good" && "border-blue-500 bg-blue-50",
          culturalStatus === "acceptable" && "border-yellow-500 bg-yellow-50",
          culturalStatus === "needs_review" && "border-orange-500 bg-orange-50",
          className,
        )}
        style={{
          width: width ? `${width}px` : "auto",
          height: height ? `${height}px` : "auto",
          direction: isRtlMode ? "rtl" : "ltr",
        }}
      >
        {/* Cultural Compliance Badges */}
        {showCulturalBadges && (
          <div
            className={cn(
              "absolute top-2 z-10 flex flex-wrap gap-1",
              isRtlMode ? "right-2" : "left-2",
            )}
          >
            <CulturalComplianceBadge
              score={culturalScore}
              islamicCompliant={islamicCompliant}
              status={culturalStatus}
              size="sm"
            />
            <ProfessionalDomainBadge
              domain={professionalDomain}
              appropriate={professionalAppropriate}
              size="sm"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div
          className={cn(
            "absolute top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity",
            "flex gap-1",
            isRtlMode ? "left-2" : "right-2",
          )}
        >
          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
            title={isRtlMode ? "عرض كامل" : "Fullscreen"}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Download Button */}
          {allowDownload && (
            <button
              onClick={handleDownload}
              className="p-1.5 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
              title={isRtlMode ? "تحميل الصورة" : "Download Image"}
            >
              <Download className="w-4 h-4" />
            </button>
          )}

          {/* Share Button */}
          {allowShare && (
            <button
              onClick={handleShare}
              className="p-1.5 bg-black/50 text-white rounded hover:bg-black/70 transition-colors"
              title={isRtlMode ? "مشاركة الصورة" : "Share Image"}
            >
              <Share2 className="w-4 h-4" />
            </button>
          )}

          {/* Cultural Report Button */}
          {culturalStatus === "needs_review" && (
            <button
              onClick={handleCulturalReport}
              className="p-1.5 bg-orange-500/80 text-white rounded hover:bg-orange-600/80 transition-colors"
              title={isRtlMode ? "تقرير ثقافي" : "Cultural Report"}
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Main Image */}
        <img
          ref={imageRef}
          src={displayUrl}
          alt={originalPromptAr || originalPrompt || "Generated image"}
          className={cn(
            "w-full h-auto cursor-pointer transition-transform duration-200",
            "group-hover:scale-[1.02]",
            !isLoaded && "animate-pulse bg-gray-200",
          )}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onClick={() => {
            if (onImageClick) {
              onImageClick();
            } else {
              toggleFullscreen();
            }
          }}
          style={{
            maxWidth: "100%",
            height: "auto",
          }}
        />

        {/* Loading Overlay */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse">
            <div className="text-gray-500 text-sm">
              {isRtlMode ? "جاري التحميل..." : "Loading..."}
            </div>
          </div>
        )}

        {/* Metadata Panel */}
        {showMetadata && (
          <div
            className={cn(
              "absolute bottom-0 left-0 right-0 p-3",
              "bg-gradient-to-t from-black/80 to-transparent",
              "opacity-0 group-hover:opacity-100 transition-opacity",
            )}
          >
            <div className="space-y-1">
              {/* Original Prompt */}
              <div
                className={cn(
                  "text-sm text-white/90",
                  promptDirection === "rtl" && "text-right",
                )}
              >
                <span className="font-medium">
                  {isRtlMode ? "الطلب:" : "Prompt:"}
                </span>{" "}
                <span className="truncate">
                  {originalPromptAr || originalPrompt}
                </span>
              </div>

              {/* Cultural Score */}
              <div className="flex items-center gap-2 text-xs text-white/80">
                <span>
                  {isRtlMode ? "النقاط الثقافية:" : "Cultural Score:"}
                </span>
                <span className="font-medium">
                  {(culturalScore * 100).toFixed(1)}%
                </span>
                {islamicCompliant ? (
                  <CheckCircle className="w-3 h-3 text-green-400" />
                ) : (
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                )}
              </div>

              {/* Toggle Details Button */}
              <button
                onClick={() => setShowPromptDetails(!showPromptDetails)}
                className="text-xs text-white/70 hover:text-white/90 underline"
              >
                {showPromptDetails
                  ? isRtlMode
                    ? "إخفاء التفاصيل"
                    : "Hide Details"
                  : isRtlMode
                    ? "عرض التفاصيل"
                    : "Show Details"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Expanded Details Panel */}
      {showPromptDetails && showMetadata && (
        <div
          className={cn(
            "mt-3 p-4 bg-gray-50 rounded-lg border text-sm",
            isRtlMode && "text-right",
          )}
        >
          <div className="space-y-3">
            {/* Original Prompts */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                {isRtlMode ? "النص الأصلي:" : "Original Prompts:"}
              </h4>
              <div className="space-y-2">
                {originalPrompt && (
                  <div
                    className={cn(
                      "p-2 bg-white rounded border",
                      promptDirection === "rtl" && "text-right",
                    )}
                  >
                    <span className="text-xs text-gray-500 uppercase">
                      {promptDirection === "rtl" ? "عربي" : "English"}
                    </span>
                    <p>{originalPrompt}</p>
                  </div>
                )}
                {originalPromptAr && originalPromptAr !== originalPrompt && (
                  <div className="p-2 bg-white rounded border text-right">
                    <span className="text-xs text-gray-500 uppercase">
                      عربي
                    </span>
                    <p>{originalPromptAr}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Revised Prompts (if different) */}
            {(revisedPrompt || revisedPromptAr) && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  {isRtlMode ? "النص المحسن:" : "Revised Prompts:"}
                </h4>
                <div className="space-y-2">
                  {revisedPrompt && (
                    <div
                      className={cn(
                        "p-2 bg-blue-50 rounded border",
                        promptDirection === "rtl" && "text-right",
                      )}
                    >
                      <span className="text-xs text-gray-500 uppercase">
                        {getTextDirection(revisedPrompt) === "rtl"
                          ? "عربي"
                          : "English"}
                      </span>
                      <p>{revisedPrompt}</p>
                    </div>
                  )}
                  {revisedPromptAr && (
                    <div className="p-2 bg-blue-50 rounded border text-right">
                      <span className="text-xs text-gray-500 uppercase">
                        عربي
                      </span>
                      <p>{revisedPromptAr}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cultural Analysis */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                {isRtlMode ? "التحليل الثقافي:" : "Cultural Analysis:"}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>
                      {isRtlMode ? "النقاط الثقافية:" : "Cultural Score:"}
                    </span>
                    <span className="font-medium">
                      {(culturalScore * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {isRtlMode ? "الامتثال الإسلامي:" : "Islamic Compliant:"}
                    </span>
                    <span
                      className={
                        islamicCompliant ? "text-green-600" : "text-red-600"
                      }
                    >
                      {islamicCompliant
                        ? isRtlMode
                          ? "نعم"
                          : "Yes"
                        : isRtlMode
                          ? "لا"
                          : "No"}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>
                      {isRtlMode ? "السياق المهني:" : "Professional Domain:"}
                    </span>
                    <span className="font-medium capitalize">
                      {professionalDomain}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {isRtlMode
                        ? "مناسب مهنياً:"
                        : "Professionally Appropriate:"}
                    </span>
                    <span
                      className={
                        professionalAppropriate
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {professionalAppropriate
                        ? isRtlMode
                          ? "نعم"
                          : "Yes"
                        : isRtlMode
                          ? "لا"
                          : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <div className="relative max-w-[95vw] max-h-[95vh]">
            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              title={isRtlMode ? "إغلاق" : "Close (ESC)"}
            >
              <EyeOff className="w-6 h-6" />
            </button>

            {/* Fullscreen Action Buttons */}
            <div className="absolute -top-12 left-0 flex gap-2">
              {allowDownload && (
                <button
                  onClick={handleDownload}
                  className="text-white hover:text-gray-300 transition-colors"
                  title={isRtlMode ? "تحميل (D)" : "Download (D)"}
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              {allowShare && (
                <button
                  onClick={handleShare}
                  className="text-white hover:text-gray-300 transition-colors"
                  title={isRtlMode ? "مشاركة (S)" : "Share (S)"}
                >
                  <Share2 className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={() => setShowPromptDetails(!showPromptDetails)}
                className="text-white hover:text-gray-300 transition-colors"
                title={isRtlMode ? "معلومات (I)" : "Info (I)"}
              >
                <Info className="w-5 h-5" />
              </button>
            </div>

            {/* Fullscreen Image */}
            <img
              src={displayUrl}
              alt={originalPromptAr || originalPrompt || "Generated image"}
              className="max-w-full max-h-full object-contain"
            />

            {/* Fullscreen Details */}
            {showPromptDetails && (
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 p-4",
                  "bg-gradient-to-t from-black/90 to-transparent text-white",
                  isRtlMode && "text-right",
                )}
              >
                <div className="max-w-2xl mx-auto space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">
                      {isRtlMode ? "الطلب:" : "Prompt:"}
                    </span>{" "}
                    {originalPromptAr || originalPrompt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-white/80">
                    <span>
                      {isRtlMode ? "النقاط الثقافية:" : "Cultural Score:"}{" "}
                      {(culturalScore * 100).toFixed(1)}%
                    </span>
                    <span>
                      {isRtlMode ? "السياق:" : "Domain:"} {professionalDomain}
                    </span>
                    {islamicCompliant && (
                      <span className="text-green-400">
                        {isRtlMode
                          ? "✓ متوافق إسلامياً"
                          : "✓ Islamic Compliant"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
