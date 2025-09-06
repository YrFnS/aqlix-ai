/**
 * Arabic Text Input Component
 * Enhanced text input with RTL support and Iraqi dialect recognition
 */

import { useState, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  Globe, 
  Keyboard, 
  Eye, 
  EyeOff, 
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ArabicTextInputProps {
  id: string
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  multiline?: boolean
  rows?: number
  required?: boolean
  disabled?: boolean
  className?: string
  // Iraqi AI Enhancements
  dialectSupport?: 'iraqi' | 'standard' | 'mixed'
  enableRTL?: boolean
  arabicKeyboard?: boolean
  culturalValidation?: boolean
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'organizational'
}

interface DialectAnalysis {
  detectedDialect: 'iraqi' | 'standard' | 'mixed' | 'non-arabic'
  confidence: number
  suggestions?: string[]
}

export function ArabicTextInput({
  id,
  value = '',
  onChange,
  placeholder,
  multiline = false,
  rows = 4,
  required = false,
  disabled = false,
  className,
  dialectSupport = 'mixed',
  enableRTL = true,
  arabicKeyboard = true,
  culturalValidation = false,
  professionalDomain
}: ArabicTextInputProps) {
  // State management
  const [isRTL, setIsRTL] = useState(enableRTL)
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [dialectAnalysis, setDialectAnalysis] = useState<DialectAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [validationStatus, setValidationStatus] = useState<'valid' | 'warning' | 'error' | null>(null)
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null)

  // Detect Arabic text and adjust RTL automatically
  const detectArabicContent = (text: string): boolean => {
    const arabicPattern = /[\u0600-\u06FF]/
    return arabicPattern.test(text)
  }

  // Analyze Iraqi dialect
  const analyzeDialect = async (text: string): Promise<DialectAnalysis> => {
    // Simulate dialect analysis (in real implementation, this would call the Arabic processor agent)
    const hasArabic = detectArabicContent(text)
    
    if (!hasArabic) {
      return {
        detectedDialect: 'non-arabic',
        confidence: 1.0
      }
    }

    // Iraqi dialect indicators
    const iraqiIndicators = [
      'شلونك', 'شكو ماكو', 'وين رايح', 'شسمك', 'اكو', 'ماكو',
      'ولة', 'زين', 'خوش', 'شوية', 'هسة', 'وياك'
    ]
    
    // Standard Arabic indicators
    const standardIndicators = [
      'كيف حالك', 'ما اسمك', 'أين تذهب', 'هناك', 'ليس هناك',
      'جيد', 'قليل', 'الآن', 'معك'
    ]

    let iraqiScore = 0
    let standardScore = 0

    iraqiIndicators.forEach(indicator => {
      if (text.includes(indicator)) iraqiScore += 1
    })

    standardIndicators.forEach(indicator => {
      if (text.includes(indicator)) standardScore += 1
    })

    const totalScore = iraqiScore + standardScore
    
    if (totalScore === 0) {
      return {
        detectedDialect: 'standard',
        confidence: 0.6
      }
    }

    if (iraqiScore > standardScore) {
      return {
        detectedDialect: 'iraqi',
        confidence: Math.min(0.95, iraqiScore / totalScore + 0.3),
        suggestions: ['Text contains Iraqi dialect expressions']
      }
    } else if (standardScore > iraqiScore) {
      return {
        detectedDialect: 'standard',
        confidence: Math.min(0.95, standardScore / totalScore + 0.3)
      }
    } else {
      return {
        detectedDialect: 'mixed',
        confidence: 0.8,
        suggestions: ['Text contains mixed dialectical expressions']
      }
    }
  }

  // Handle text change
  const handleTextChange = async (newValue: string) => {
    onChange(newValue)

    // Auto-detect RTL
    if (enableRTL) {
      const shouldBeRTL = detectArabicContent(newValue)
      setIsRTL(shouldBeRTL)
    }

    // Analyze dialect if text contains Arabic
    if (newValue.trim() && detectArabicContent(newValue)) {
      setIsAnalyzing(true)
      try {
        const analysis = await analyzeDialect(newValue)
        setDialectAnalysis(analysis)
        
        // Set validation status based on professional domain and dialect
        if (culturalValidation) {
          if (professionalDomain === 'legal' && analysis.detectedDialect === 'iraqi') {
            setValidationStatus('warning') // Legal documents typically prefer standard Arabic
          } else if (analysis.confidence < 0.7) {
            setValidationStatus('warning')
          } else {
            setValidationStatus('valid')
          }
        }
      } catch (error) {
        console.error('Error analyzing dialect:', error)
      } finally {
        setIsAnalyzing(false)
      }
    } else {
      setDialectAnalysis(null)
      setValidationStatus(null)
    }
  }

  // Insert Arabic text at cursor
  const insertArabicText = (text: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0
      const end = inputRef.current.selectionEnd || 0
      const newValue = value.substring(0, start) + text + value.substring(end)
      handleTextChange(newValue)
      
      // Reset cursor position
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = start + text.length
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos)
          inputRef.current.focus()
        }
      }, 0)
    }
  }

  // Common Arabic phrases for quick insertion
  const commonPhrases = {
    iraqi: [
      'شلونك؟', 'شكو ماكو؟', 'زين هواية', 'ما شاء الله',
      'إن شاء الله', 'بإذنكم', 'تسلم إيديك', 'الله يعطيك العافية'
    ],
    standard: [
      'كيف حالك؟', 'ما أخبارك؟', 'جيد جداً', 'ما شاء الله',
      'إن شاء الله', 'بإذنكم', 'شكراً لك', 'بارك الله فيك'
    ]
  }

  // Get dialect badge color and text
  const getDialectBadge = () => {
    if (!dialectAnalysis || isAnalyzing) return null

    const badges = {
      iraqi: { color: 'bg-green-500', text: 'عراقي', confidence: dialectAnalysis.confidence },
      standard: { color: 'bg-blue-500', text: 'فصحى', confidence: dialectAnalysis.confidence },
      mixed: { color: 'bg-yellow-500', text: 'مختلط', confidence: dialectAnalysis.confidence },
      'non-arabic': { color: 'bg-gray-500', text: 'غير عربي', confidence: dialectAnalysis.confidence }
    }

    const badge = badges[dialectAnalysis.detectedDialect]
    return (
      <Badge className={cn('text-xs text-white', badge.color)}>
        {badge.text} ({Math.round(badge.confidence * 100)}%)
      </Badge>
    )
  }

  // Get validation status icon
  const getValidationIcon = () => {
    if (!validationStatus) return null

    switch (validationStatus) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const InputComponent = multiline ? Textarea : Input

  return (
    <div className="space-y-2">
      {/* Input Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* RTL Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRTL(!isRTL)}
                disabled={disabled}
              >
                <RotateCcw className="w-4 h-4" />
                {isRTL ? 'RTL' : 'LTR'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle text direction</TooltipContent>
          </Tooltip>

          {/* Arabic Keyboard Toggle */}
          {arabicKeyboard && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowKeyboard(!showKeyboard)}
                  disabled={disabled}
                >
                  <Keyboard className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Show Arabic keyboard helper</TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2">
          {getValidationIcon()}
          {getDialectBadge()}
          {isAnalyzing && (
            <div className="animate-pulse text-sm text-gray-500">
              Analyzing...
            </div>
          )}
        </div>
      </div>

      {/* Main Input */}
      <div className="relative">
        <InputComponent
          ref={inputRef}
          id={id}
          value={value}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder={placeholder}
          rows={multiline ? rows : undefined}
          required={required}
          disabled={disabled}
          className={cn(
            'transition-all duration-200',
            isRTL && 'text-right',
            validationStatus === 'error' && 'border-red-500',
            validationStatus === 'warning' && 'border-yellow-500',
            validationStatus === 'valid' && 'border-green-500',
            className
          )}
          style={{
            direction: isRTL ? 'rtl' : 'ltr',
            fontFamily: detectArabicContent(value) 
              ? 'Noto Sans Arabic, Arial, sans-serif' 
              : 'inherit'
          }}
        />
      </div>

      {/* Arabic Keyboard Helper */}
      {showKeyboard && arabicKeyboard && !disabled && (
        <div className="p-3 border rounded-lg bg-gray-50">
          <div className="text-sm font-medium mb-2">Quick Insert:</div>
          <div className="space-y-2">
            {dialectSupport !== 'standard' && (
              <div>
                <div className="text-xs text-gray-600 mb-1">Iraqi Dialect:</div>
                <div className="flex flex-wrap gap-1">
                  {commonPhrases.iraqi.map((phrase, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => insertArabicText(phrase)}
                      className="text-xs"
                    >
                      {phrase}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {dialectSupport !== 'iraqi' && (
              <div>
                <div className="text-xs text-gray-600 mb-1">Standard Arabic:</div>
                <div className="flex flex-wrap gap-1">
                  {commonPhrases.standard.map((phrase, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => insertArabicText(phrase)}
                      className="text-xs"
                    >
                      {phrase}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Dialect Analysis Results */}
      {dialectAnalysis && dialectAnalysis.suggestions && (
        <div className="text-xs text-gray-600">
          <div className="font-medium">Analysis:</div>
          <ul className="list-disc list-inside">
            {dialectAnalysis.suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}