/**
 * Iraqi AI Enhanced Workflow Block Component
 * Visual workflow block with Arabic RTL support and cultural validation
 */

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Code,
  Info,
  Zap,
  Shield,
  Globe,
  CreditCard,
} from "lucide-react";
import { Handle, type NodeProps, Position } from "reactflow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { BlockConfig } from "../../blocks/types";

interface IraqiWorkflowBlockProps {
  type: string;
  config: BlockConfig;
  name: string;
  isActive?: boolean;
  isPending?: boolean;
  isPreview?: boolean;
  subBlockValues?: Record<string, any>;
  blockState?: any;
  // Iraqi AI Enhancements
  culturalValidation?: {
    isValid: boolean;
    confidence: number;
    islamicCompliance: number;
  };
  arabicContent?: boolean;
  professionalDomain?: "legal" | "medical" | "educational" | "organizational";
  paymentGateway?: "zaincash" | "fastpay" | "nasswallet";
}

export function IraqiWorkflowBlock({
  id,
  data,
}: NodeProps<IraqiWorkflowBlockProps>) {
  const {
    type,
    config,
    name,
    isActive,
    isPending,
    culturalValidation,
    arabicContent,
    professionalDomain,
    paymentGateway,
  } = data;

  // State management
  const [isConnecting, setIsConnecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [showCulturalDetails, setShowCulturalDetails] = useState(false);

  // RTL support detection
  const isRTL = arabicContent || /[\u0600-\u06FF]/.test(name);
  const displayName = isRTL ? name : name;

  // Cultural validation status
  const getCulturalStatus = () => {
    if (!culturalValidation) return null;

    if (
      culturalValidation.confidence >= 0.95 &&
      culturalValidation.islamicCompliance >= 0.9
    ) {
      return {
        status: "excellent",
        color: "bg-green-500",
        text: "ممتاز / Excellent",
      };
    } else if (culturalValidation.confidence >= 0.8) {
      return { status: "good", color: "bg-blue-500", text: "جيد / Good" };
    } else if (culturalValidation.confidence >= 0.6) {
      return {
        status: "warning",
        color: "bg-yellow-500",
        text: "تحذير / Warning",
      };
    } else {
      return { status: "error", color: "bg-red-500", text: "خطأ / Error" };
    }
  };

  const culturalStatus = getCulturalStatus();

  // Professional domain icons
  const getProfessionalIcon = () => {
    switch (professionalDomain) {
      case "legal":
        return <BookOpen className="w-3 h-3" />;
      case "medical":
        return <Shield className="w-3 h-3" />;
      case "educational":
        return <Info className="w-3 h-3" />;
      case "organizational":
        return <Globe className="w-3 h-3" />;
      default:
        return null;
    }
  };

  // Payment gateway badge
  const getPaymentBadge = () => {
    if (!paymentGateway) return null;

    const gateways = {
      zaincash: { name: "زين كاش", color: "bg-purple-500" },
      fastpay: { name: "فاست باي", color: "bg-blue-500" },
      nasswallet: { name: "ناس والت", color: "bg-green-500" },
    };

    const gateway = gateways[paymentGateway];
    return (
      <Badge className={cn("text-xs text-white", gateway.color)}>
        <CreditCard className="w-3 h-3 ml-1" />
        {gateway.name}
      </Badge>
    );
  };

  return (
    <Card
      className={cn(
        "workflow-block relative min-w-[280px] transition-all duration-200",
        isActive && "ring-2 ring-blue-500 shadow-lg",
        isPending && "opacity-70",
        isRTL && "text-right",
        culturalStatus?.status === "error" && "ring-2 ring-red-500",
        culturalStatus?.status === "warning" && "ring-2 ring-yellow-500",
      )}
      style={{ backgroundColor: config.bgColor + "15" }}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="workflow-handle-target"
        style={{ background: config.bgColor }}
      />

      <Handle
        type="source"
        position={Position.Bottom}
        className="workflow-handle-source"
        style={{ background: config.bgColor }}
      />

      {/* Block Header */}
      <div
        className={cn(
          "flex items-center justify-between p-3 border-b",
          isRTL && "flex-row-reverse",
        )}
      >
        <div
          className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}
        >
          {/* Block Icon */}
          <div
            className="p-2 rounded-lg text-white"
            style={{ backgroundColor: config.bgColor }}
          >
            <config.icon className="w-4 h-4" />
          </div>

          {/* Block Name and Type */}
          <div className={cn(isRTL && "text-right")}>
            <div className="font-medium text-sm">{displayName}</div>
            <div className="text-xs text-gray-500">{config.name}</div>
          </div>
        </div>

        {/* Status Badges */}
        <div
          className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}
        >
          {/* Professional Domain Badge */}
          {professionalDomain && (
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="secondary" className="text-xs">
                  {getProfessionalIcon()}
                  <span className="ml-1">
                    {professionalDomain === "legal" && "قانوني"}
                    {professionalDomain === "medical" && "طبي"}
                    {professionalDomain === "educational" && "تعليمي"}
                    {professionalDomain === "organizational" && "تنظيمي"}
                  </span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                Professional Domain: {professionalDomain}
              </TooltipContent>
            </Tooltip>
          )}

          {/* Payment Gateway Badge */}
          {getPaymentBadge()}

          {/* Arabic Content Badge */}
          {arabicContent && (
            <Badge variant="outline" className="text-xs">
              <span className="text-blue-600">عربي</span>
            </Badge>
          )}

          {/* Cultural Validation Status */}
          {culturalStatus && (
            <Tooltip>
              <TooltipTrigger>
                <div
                  className={cn("w-3 h-3 rounded-full", culturalStatus.color)}
                  onClick={() => setShowCulturalDetails(!showCulturalDetails)}
                />
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  <div>Status: {culturalStatus.text}</div>
                  <div>
                    Confidence:{" "}
                    {Math.round(culturalValidation!.confidence * 100)}%
                  </div>
                  <div>
                    Islamic Compliance:{" "}
                    {Math.round(culturalValidation!.islamicCompliance * 100)}%
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Cultural Validation Details */}
      {showCulturalDetails && culturalValidation && (
        <div className="p-3 border-b bg-gray-50">
          <div className="space-y-2 text-sm">
            <div
              className={cn(
                "flex justify-between",
                isRTL && "flex-row-reverse",
              )}
            >
              <span>الثقة / Confidence:</span>
              <span>{Math.round(culturalValidation.confidence * 100)}%</span>
            </div>
            <div
              className={cn(
                "flex justify-between",
                isRTL && "flex-row-reverse",
              )}
            >
              <span>الامتثال الإسلامي / Islamic Compliance:</span>
              <span>
                {Math.round(culturalValidation.islamicCompliance * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Block Content */}
      <div className="p-3">
        <div className={cn("text-sm text-gray-600", isRTL && "text-right")}>
          {config.description}
        </div>

        {/* Iraqi Enhancement Indicators */}
        {config.iraqiEnhancements && (
          <div
            className={cn("flex flex-wrap gap-1 mt-2", isRTL && "justify-end")}
          >
            {config.iraqiEnhancements.culturalValidation.enabled && (
              <Badge variant="outline" className="text-xs">
                <Shield className="w-3 h-3 ml-1" />
                Cultural Validation
              </Badge>
            )}
            {config.iraqiEnhancements.arabicProcessing?.enabled && (
              <Badge variant="outline" className="text-xs">
                <Globe className="w-3 h-3 ml-1" />
                Arabic Processing
              </Badge>
            )}
            {config.iraqiEnhancements.paymentGateways?.enabled && (
              <Badge variant="outline" className="text-xs">
                <CreditCard className="w-3 h-3 ml-1" />
                Payment Gateways
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Execution Status */}
      {isPending && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg flex items-center justify-center">
          <div className="flex items-center gap-2 text-blue-600">
            <Zap className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">
              {isRTL ? "قيد التنفيذ..." : "Executing..."}
            </span>
          </div>
        </div>
      )}

      {/* Block Actions */}
      <div
        className={cn(
          "flex items-center justify-end gap-2 p-2 border-t",
          isRTL && "justify-start",
        )}
      >
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
          <Code className="w-3 h-3" />
        </Button>

        {config.docsLink && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(config.docsLink, "_blank")}
          >
            <BookOpen className="w-3 h-3" />
          </Button>
        )}
      </div>
    </Card>
  );
}
