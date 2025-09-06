/**
 * Cultural Validation Panel Component
 * Comprehensive cultural appropriateness validation display
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  XCircle,
  Eye,
  BookOpen,
  Users,
  Globe,
  RefreshCw
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface CulturalValidationResult {
  isValid: boolean
  confidence: number
  islamicCompliance: number
  politicalNeutrality: number
  professionalAppropriate: number
  violations: Array<{
    type: 'islamic' | 'political' | 'professional' | 'cultural'
    severity: 'low' | 'medium' | 'high' | 'critical'
    message: string
    suggestion: string
  }>
  suggestions: string[]
  detailedReport: {
    analyzedContent: string
    professionalContext?: string
    dialectAnalysis: {
      detectedDialect: string
      confidence: number
    }
    processingTime: number
  }
}

interface CulturalValidationPanelProps {
  validationResult: CulturalValidationResult | null
  isLoading?: boolean
  onRevalidate?: () => void
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'organizational'
  className?: string
}

export function CulturalValidationPanel({
  validationResult,
  isLoading = false,
  onRevalidate,
  professionalDomain,
  className
}: CulturalValidationPanelProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Get overall status
  const getOverallStatus = () => {
    if (!validationResult) return { status: 'pending', color: 'text-gray-500', icon: Shield }
    
    if (validationResult.confidence >= 0.95 && validationResult.islamicCompliance >= 0.9) {
      return { status: 'excellent', color: 'text-green-600', icon: CheckCircle }
    } else if (validationResult.confidence >= 0.8) {
      return { status: 'good', color: 'text-blue-600', icon: CheckCircle }
    } else if (validationResult.confidence >= 0.6) {
      return { status: 'warning', color: 'text-yellow-600', icon: AlertCircle }
    } else {
      return { status: 'error', color: 'text-red-600', icon: XCircle }
    }
  }

  const overallStatus = getOverallStatus()

  // Get violation badge color
  const getViolationColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600'
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  // Get violation type label
  const getViolationTypeLabel = (type: string) => {
    switch (type) {
      case 'islamic': return 'إسلامي / Islamic'
      case 'political': return 'سياسي / Political'
      case 'professional': return 'مهني / Professional'
      case 'cultural': return 'ثقافي / Cultural'
      default: return type
    }
  }

  if (isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            التحقق الثقافي / Cultural Validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-2 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <overallStatus.icon className={cn('w-5 h-5', overallStatus.color)} />
            التحقق الثقافي / Cultural Validation
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {professionalDomain && (
              <Badge variant="outline" className="text-xs">
                <Users className="w-3 h-3 mr-1" />
                {professionalDomain === 'legal' && 'قانوني / Legal'}
                {professionalDomain === 'medical' && 'طبي / Medical'}
                {professionalDomain === 'educational' && 'تعليمي / Educational'}
                {professionalDomain === 'organizational' && 'تنظيمي / Organizational'}
              </Badge>
            )}
            
            {onRevalidate && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRevalidate}
                disabled={isLoading}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!validationResult ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>لا يوجد محتوى للتحقق / No content to validate</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                {Math.round(validationResult.confidence * 100)}%
              </div>
              <div className={cn('text-sm font-medium', overallStatus.color)}>
                {overallStatus.status === 'excellent' && 'ممتاز / Excellent'}
                {overallStatus.status === 'good' && 'جيد / Good'}
                {overallStatus.status === 'warning' && 'تحذير / Warning'}
                {overallStatus.status === 'error' && 'خطأ / Error'}
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>الامتثال الإسلامي / Islamic Compliance</span>
                  <span>{Math.round(validationResult.islamicCompliance * 100)}%</span>
                </div>
                <Progress 
                  value={validationResult.islamicCompliance * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>الحياد السياسي / Political Neutrality</span>
                  <span>{Math.round(validationResult.politicalNeutrality * 100)}%</span>
                </div>
                <Progress 
                  value={validationResult.politicalNeutrality * 100} 
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>الملاءمة المهنية / Professional Appropriateness</span>
                  <span>{Math.round(validationResult.professionalAppropriate * 100)}%</span>
                </div>
                <Progress 
                  value={validationResult.professionalAppropriate * 100} 
                  className="h-2"
                />
              </div>
            </div>

            {/* Violations */}
            {validationResult.violations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-sm">
                    المخالفات / Violations ({validationResult.violations.length})
                  </span>
                </div>
                
                <div className="space-y-2">
                  {validationResult.violations.map((violation, index) => (
                    <div key={index} className="p-3 rounded-lg border bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-xs text-white', getViolationColor(violation.severity))}>
                            {getViolationTypeLabel(violation.type)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {violation.severity}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-700 mb-2">
                        {violation.message}
                      </div>
                      
                      <div className="text-xs text-blue-600">
                        💡 {violation.suggestion}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {validationResult.suggestions.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-sm">
                    اقتراحات التحسين / Improvement Suggestions
                  </span>
                </div>
                
                <div className="space-y-2">
                  {validationResult.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Toggle Details */}
            <div className="text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showDetails ? 'إخفاء التفاصيل / Hide Details' : 'عرض التفاصيل / Show Details'}
              </Button>
            </div>

            {/* Detailed Report */}
            {showDetails && validationResult.detailedReport && (
              <div className="pt-4 border-t">
                <div className="space-y-4 text-sm">
                  <div>
                    <span className="font-medium">وقت المعالجة / Processing Time:</span>
                    <span className="ml-2">{validationResult.detailedReport.processingTime}ms</span>
                  </div>
                  
                  {validationResult.detailedReport.dialectAnalysis && (
                    <div>
                      <span className="font-medium">تحليل اللهجة / Dialect Analysis:</span>
                      <div className="ml-4 text-gray-600">
                        <div>Detected: {validationResult.detailedReport.dialectAnalysis.detectedDialect}</div>
                        <div>Confidence: {Math.round(validationResult.detailedReport.dialectAnalysis.confidence * 100)}%</div>
                      </div>
                    </div>
                  )}
                  
                  {validationResult.detailedReport.professionalContext && (
                    <div>
                      <span className="font-medium">السياق المهني / Professional Context:</span>
                      <span className="ml-2">{validationResult.detailedReport.professionalContext}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}