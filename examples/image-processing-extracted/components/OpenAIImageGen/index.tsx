"use client";

import React, { useState, useCallback } from "react";
import {
  Image as ImageIcon,
  Settings,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Info,
  ExternalLink,
  Cpu,
  DollarSign,
} from "lucide-react";

import { ImageGeneration } from "../ImageGeneration";

// Types
interface OpenAIConfig {
  apiKey: string;
  endpoint: string;
  organization?: string;
  culturalValidationEndpoint?: string;
  enabledModels: string[];
  rateLimits: {
    "dall-e-2": { rpm: number; rph: number };
    "dall-e-3": { rpm: number; rph: number };
  };
  pricing: {
    "dall-e-2": Record<string, number>;
    "dall-e-3": Record<string, number>;
  };
}

interface OpenAIImageGenProps {
  config?: Partial<OpenAIConfig>;
  className?: string;
  isRtlMode?: boolean;
  defaultDomain?: string;
  onConfigUpdate?: (config: OpenAIConfig) => void;
  showConfigPanel?: boolean;
  showUsageStats?: boolean;
  culturalValidationRequired?: boolean;
  maxCreditsPerSession?: number;
  onCreditUsage?: (credits: number, operation: string) => void;
}

interface UsageStats {
  totalImages: number;
  totalCredits: number;
  sessionCredits: number;
  remainingCredits: number;
  rateLimitStatus: {
    "dall-e-2": { current: number; limit: number; resetTime?: Date };
    "dall-e-3": { current: number; limit: number; resetTime?: Date };
  };
  lastGeneration?: Date;
}

const defaultConfig: OpenAIConfig = {
  apiKey: "",
  endpoint: "https://api.openai.com/v1",
  enabledModels: ["dall-e-2", "dall-e-3"],
  rateLimits: {
    "dall-e-2": { rpm: 50, rph: 1000 },
    "dall-e-3": { rpm: 5, rph: 200 },
  },
  pricing: {
    "dall-e-2": {
      "256x256": 0.016,
      "512x512": 0.018,
      "1024x1024": 0.02,
    },
    "dall-e-3": {
      "1024x1024": 0.04,
      "1792x1024": 0.08,
      "1024x1792": 0.08,
    },
  },
};

export const OpenAIImageGen: React.FC<OpenAIImageGenProps> = ({
  config,
  className = "",
  isRtlMode = false,
  defaultDomain = "general",
  onConfigUpdate,
  showConfigPanel = true,
  showUsageStats = true,
  culturalValidationRequired = true,
  maxCreditsPerSession = 10.0,
  onCreditUsage,
}) => {
  // State Management
  const [openaiConfig, setOpenaiConfig] = useState<OpenAIConfig>({
    ...defaultConfig,
    ...config,
  });

  const [isConfigured, setIsConfigured] = useState(!!config?.apiKey);
  const [showConfig, setShowConfig] = useState(!isConfigured);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    totalImages: 0,
    totalCredits: 0,
    sessionCredits: 0,
    remainingCredits: maxCreditsPerSession,
    rateLimitStatus: {
      "dall-e-2": { current: 0, limit: 50 },
      "dall-e-3": { current: 0, limit: 5 },
    },
  });

  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "error" | "idle"
  >("idle");
  const [lastError, setLastError] = useState<string | null>(null);

  // Configuration Management
  const handleConfigUpdate = useCallback(
    (field: keyof OpenAIConfig, value: any) => {
      const updatedConfig = {
        ...openaiConfig,
        [field]: value,
      };

      setOpenaiConfig(updatedConfig);
      onConfigUpdate?.(updatedConfig);

      // Auto-verify connection when API key changes
      if (field === "apiKey" && value) {
        verifyConnection(updatedConfig);
      }
    },
    [openaiConfig, onConfigUpdate],
  );

  // Connection Verification
  const verifyConnection = async (
    configToTest: OpenAIConfig = openaiConfig,
  ) => {
    if (!configToTest.apiKey) {
      setLastError(isRtlMode ? "مفتاح API مطلوب" : "API key required");
      return;
    }

    setConnectionStatus("connecting");
    setLastError(null);

    try {
      // Test API connection - replace with actual endpoint
      const response = await fetch(`${configToTest.endpoint}/models`, {
        headers: {
          Authorization: `Bearer ${configToTest.apiKey}`,
          "Content-Type": "application/json",
          ...(configToTest.organization && {
            "OpenAI-Organization": configToTest.organization,
          }),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const hasImageModels = data.data?.some((model: any) =>
          model.id.includes("dall-e"),
        );

        if (hasImageModels) {
          setConnectionStatus("connected");
          setIsConfigured(true);
          setShowConfig(false);
        } else {
          throw new Error(
            isRtlMode ? "نماذج الصور غير متاحة" : "Image models not available",
          );
        }
      } else {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setConnectionStatus("error");
      setLastError(
        error instanceof Error ? error.message : "Connection failed",
      );
    }
  };

  // Usage Tracking
  const trackUsage = useCallback(
    (model: string, size: string, count: number) => {
      const modelKey = model as keyof typeof openaiConfig.pricing;
      const cost = (openaiConfig.pricing[modelKey]?.[size] || 0) * count;

      setUsageStats((prev) => ({
        ...prev,
        totalImages: prev.totalImages + count,
        totalCredits: prev.totalCredits + cost,
        sessionCredits: prev.sessionCredits + cost,
        remainingCredits: Math.max(0, prev.remainingCredits - cost),
        lastGeneration: new Date(),
        rateLimitStatus: {
          ...prev.rateLimitStatus,
          [modelKey]: {
            ...prev.rateLimitStatus[modelKey],
            current: prev.rateLimitStatus[modelKey].current + count,
          },
        },
      }));

      onCreditUsage?.(cost, `${model}-${size}-${count}`);
    },
    [openaiConfig.pricing, onCreditUsage],
  );

  // Handle Generation Results
  const handleGenerationComplete = useCallback(
    (result: any) => {
      if (result.success && result.images) {
        const imageCount = result.images.length;
        const model = result.model || "dall-e-3";
        const size = result.size || "1024x1024";

        trackUsage(model, size, imageCount);
      }
    },
    [trackUsage],
  );

  // RTL-aware classes
  const rtlClass = isRtlMode ? "rtl" : "ltr";
  const textAlign = isRtlMode ? "text-right" : "text-left";
  const flexDir = isRtlMode ? "flex-row-reverse" : "flex-row";

  return (
    <div className={`openai-image-gen ${rtlClass} ${className}`}>
      {/* Header with OpenAI Branding */}
      <div className={`flex items-center justify-between mb-6 ${flexDir}`}>
        <div className={`flex items-center gap-3 ${flexDir}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {isRtlMode ? "OpenAI لإنتاج الصور" : "OpenAI Image Generation"}
              </h2>
              <p className="text-xs text-gray-500">
                {isRtlMode ? "مدعوم بـ DALL-E" : "Powered by DALL-E"}
              </p>
            </div>
          </div>

          {/* Connection Status */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
              connectionStatus === "connected"
                ? "bg-green-50 text-green-700"
                : connectionStatus === "error"
                  ? "bg-red-50 text-red-700"
                  : "bg-yellow-50 text-yellow-700"
            }`}
          >
            {connectionStatus === "connected" && (
              <CheckCircle2 className="w-3 h-3" />
            )}
            {connectionStatus === "error" && (
              <AlertTriangle className="w-3 h-3" />
            )}
            {connectionStatus === "connecting" && (
              <div className="animate-spin rounded-full h-3 w-3 border-b border-current" />
            )}
            <span>
              {connectionStatus === "connected" &&
                (isRtlMode ? "متصل" : "Connected")}
              {connectionStatus === "error" && (isRtlMode ? "خطأ" : "Error")}
              {connectionStatus === "connecting" &&
                (isRtlMode ? "اتصال..." : "Connecting...")}
              {connectionStatus === "idle" &&
                (isRtlMode ? "غير متصل" : "Not Connected")}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className={`flex items-center gap-2 ${flexDir}`}>
          {showUsageStats && (
            <div className="text-xs text-gray-600 space-y-1">
              <div className={textAlign}>
                <span>{isRtlMode ? "الرصيد المتبقي:" : "Credits:"}</span>
                <span className="ml-1 font-medium">
                  ${usageStats.remainingCredits.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {showConfigPanel && (
            <button
              onClick={() => setShowConfig(!showConfig)}
              className={`p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg ${
                showConfig ? "bg-gray-100" : ""
              }`}
              title={isRtlMode ? "الإعدادات" : "Settings"}
            >
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Configuration Panel */}
      {showConfig && (
        <div className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className={`text-lg font-semibold mb-4 ${textAlign}`}>
            {isRtlMode ? "إعدادات OpenAI" : "OpenAI Configuration"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* API Key */}
            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
              >
                {isRtlMode ? "مفتاح API" : "API Key"}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={openaiConfig.apiKey}
                  onChange={(e) => handleConfigUpdate("apiKey", e.target.value)}
                  placeholder="sk-..."
                  className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${textAlign}`}
                />
                {openaiConfig.apiKey && (
                  <button
                    onClick={() => verifyConnection()}
                    disabled={connectionStatus === "connecting"}
                    className="absolute inset-y-0 right-3 flex items-center text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    title={isRtlMode ? "اختبار الاتصال" : "Test Connection"}
                  >
                    {connectionStatus === "connecting" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b border-current" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {isRtlMode
                  ? "احصل على مفتاح API من OpenAI Platform"
                  : "Get your API key from OpenAI Platform"}
              </p>
            </div>

            {/* Organization ID */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
              >
                {isRtlMode
                  ? "معرف المنظمة (اختياري)"
                  : "Organization ID (Optional)"}
              </label>
              <input
                type="text"
                value={openaiConfig.organization || ""}
                onChange={(e) =>
                  handleConfigUpdate("organization", e.target.value)
                }
                placeholder="org-..."
                className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${textAlign}`}
              />
            </div>

            {/* Endpoint */}
            <div>
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
              >
                {isRtlMode ? "نقطة النهاية" : "API Endpoint"}
              </label>
              <input
                type="text"
                value={openaiConfig.endpoint}
                onChange={(e) => handleConfigUpdate("endpoint", e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${textAlign}`}
              />
            </div>

            {/* Enabled Models */}
            <div className="md:col-span-2">
              <label
                className={`block text-sm font-medium text-gray-700 mb-2 ${textAlign}`}
              >
                {isRtlMode ? "النماذج المفعلة" : "Enabled Models"}
              </label>
              <div className="flex gap-3">
                {["dall-e-2", "dall-e-3"].map((model) => (
                  <label
                    key={model}
                    className={`flex items-center gap-2 ${flexDir}`}
                  >
                    <input
                      type="checkbox"
                      checked={openaiConfig.enabledModels.includes(model)}
                      onChange={(e) => {
                        const newModels = e.target.checked
                          ? [...openaiConfig.enabledModels, model]
                          : openaiConfig.enabledModels.filter(
                              (m) => m !== model,
                            );
                        handleConfigUpdate("enabledModels", newModels);
                      }}
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">
                      {model.toUpperCase()}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Connection Test Results */}
          {lastError && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className={`flex items-center gap-2 ${flexDir}`}>
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-700">
                  {isRtlMode ? "خطأ في الاتصال" : "Connection Error"}
                </span>
              </div>
              <p className={`mt-1 text-xs text-red-600 ${textAlign}`}>
                {lastError}
              </p>
            </div>
          )}

          {connectionStatus === "connected" && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className={`flex items-center gap-2 ${flexDir}`}>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {isRtlMode ? "تم الاتصال بنجاح" : "Connection Successful"}
                </span>
              </div>
              <p className={`mt-1 text-xs text-green-600 ${textAlign}`}>
                {isRtlMode
                  ? "يمكنك الآن بدء إنتاج الصور"
                  : "You can now start generating images"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Usage Statistics Panel */}
      {showUsageStats && isConfigured && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4
            className={`text-sm font-semibold text-blue-800 mb-3 ${textAlign}`}
          >
            {isRtlMode ? "إحصائيات الاستخدام" : "Usage Statistics"}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className={textAlign}>
              <div className="flex items-center gap-1 text-blue-700">
                <ImageIcon className="w-3 h-3" />
                <span>{isRtlMode ? "الصور:" : "Images:"}</span>
              </div>
              <span className="font-medium">{usageStats.totalImages}</span>
            </div>
            <div className={textAlign}>
              <div className="flex items-center gap-1 text-blue-700">
                <DollarSign className="w-3 h-3" />
                <span>{isRtlMode ? "التكلفة:" : "Cost:"}</span>
              </div>
              <span className="font-medium">
                ${usageStats.sessionCredits.toFixed(3)}
              </span>
            </div>
            <div className={textAlign}>
              <div className="flex items-center gap-1 text-blue-700">
                <Cpu className="w-3 h-3" />
                <span>{isRtlMode ? "DALL-E 2:" : "DALL-E 2:"}</span>
              </div>
              <span className="font-medium">
                {usageStats.rateLimitStatus["dall-e-2"].current}/
                {usageStats.rateLimitStatus["dall-e-2"].limit}
              </span>
            </div>
            <div className={textAlign}>
              <div className="flex items-center gap-1 text-blue-700">
                <Zap className="w-3 h-3" />
                <span>{isRtlMode ? "DALL-E 3:" : "DALL-E 3:"}</span>
              </div>
              <span className="font-medium">
                {usageStats.rateLimitStatus["dall-e-3"].current}/
                {usageStats.rateLimitStatus["dall-e-3"].limit}
              </span>
            </div>
          </div>

          {usageStats.remainingCredits <= 1.0 && (
            <div
              className={`mt-3 flex items-center gap-2 text-xs text-orange-700 ${flexDir}`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>
                {isRtlMode
                  ? `الرصيد المتبقي منخفض: $${usageStats.remainingCredits.toFixed(2)}`
                  : `Low credits remaining: $${usageStats.remainingCredits.toFixed(2)}`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Main Generation Interface */}
      {isConfigured ? (
        <ImageGeneration
          className="openai-themed"
          isRtlMode={isRtlMode}
          defaultDomain={defaultDomain}
          onGeneration={handleGenerationComplete}
          culturalValidationRequired={culturalValidationRequired}
          showAdvancedSettings={true}
          maxImages={4}
          allowedModels={openaiConfig.enabledModels}
        />
      ) : (
        <div className="flex items-center justify-center p-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">
              {isRtlMode ? "إعداد مطلوب" : "Configuration Required"}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {isRtlMode
                ? "يرجى إعداد مفتاح OpenAI API للمتابعة"
                : "Please configure your OpenAI API key to continue"}
            </p>
            <button
              onClick={() => setShowConfig(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isRtlMode ? "إعداد الآن" : "Configure Now"}
            </button>
          </div>
        </div>
      )}

      {/* Cultural Compliance Notice */}
      {culturalValidationRequired && isConfigured && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className={`flex items-start gap-3 ${flexDir}`}>
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4
                className={`text-sm font-semibold text-green-800 mb-1 ${textAlign}`}
              >
                {isRtlMode
                  ? "التحقق الثقافي مفعل"
                  : "Cultural Validation Enabled"}
              </h4>
              <p className={`text-xs text-green-700 ${textAlign}`}>
                {isRtlMode
                  ? "جميع الصور المنتجة ستخضع للتحقق من الامتثال الثقافي والإسلامي لضمان الملاءمة للسياق العراقي المهني."
                  : "All generated images will be validated for cultural and Islamic compliance to ensure appropriateness for Iraqi professional contexts."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenAIImageGen;
