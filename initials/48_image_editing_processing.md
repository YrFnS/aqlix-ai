# Image Editing & Processing for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Image editing and processing tools** with Canvas API, WebGL acceleration, and advanced image manipulation libraries, optimized for Arabic text overlay and Iraqi cultural content.

**Specific technologies:** HTML5 Canvas API, WebGL, Fabric.js, Konva.js, image filters, real-time editing, Arabic font rendering, and cultural content validation.

---

## TEMPLATE PURPOSE:

**Comprehensive image editing and processing capabilities** for the Iraqi AI Chat System that enables users to edit, enhance, and manipulate images with full RTL support and cultural validation.

**Developers should be able to:** Create image editing interfaces, implement Canvas-based tools, add Arabic text overlays, apply cultural filters, integrate with professional workflows, and validate edited content.

---

## CORE FEATURES:

**Essential image editing and processing infrastructure:**

- **Canvas-Based Editing:** Advanced Canvas API implementation with WebGL acceleration
- **Arabic Text Overlay:** RTL text rendering with Iraqi fonts and cultural typography
- **Image Manipulation Tools:** Crop, resize, rotate, flip, brightness, contrast, saturation
- **Advanced Filters:** Professional-grade filters with cultural appropriateness validation
- **Layer Management:** Multi-layer editing with Arabic text layers and image composition
- **Cultural Validation:** Real-time validation of edited content for Islamic compliance

---

## EXAMPLES TO INCLUDE:

**Working image editing and processing examples:**

- **Image Editor Component:** Canvas-based editor with toolbar and Arabic text support
- **Filter System:** Advanced filters with cultural appropriateness checks
- **Arabic Text Overlay:** RTL text rendering with Iraqi professional fonts
- **Layer Management:** Multi-layer editing with Arabic content support
- **Export System:** High-quality export with metadata and cultural validation
- **Professional Templates:** Pre-configured templates for Iraqi business contexts

---

## DOCUMENTATION TO RESEARCH:

**Image editing and Canvas documentation:**

- **Canvas API:** https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API - Canvas drawing and manipulation
- **WebGL:** https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API - Hardware-accelerated graphics
- **Fabric.js:** http://fabricjs.com/ - Interactive object model for Canvas
- **Konva.js:** https://konvajs.org/ - Performant 2D canvas library
- **Image Processing:** Advanced filtering and manipulation techniques

---

## DEVELOPMENT PATTERNS:

**Image editing architecture patterns:**

- **Canvas Management:** Efficient canvas operations with memory optimization
- **Event Handling:** User interactions with drawing tools and text input
- **Layer Architecture:** Multi-layer editing with composition and blending modes
- **Real-time Processing:** Live preview with performance optimization
- **Arabic Typography:** Advanced RTL text rendering with font management
- **Cultural Integration:** Seamless validation workflow with editing operations

---

## SECURITY & BEST PRACTICES:

**Image editing security considerations:**

- **Content Validation:** Malicious image detection and sanitization
- **Memory Management:** Efficient canvas memory usage and cleanup
- **File Size Limits:** Upload and export size restrictions for performance
- **Cultural Compliance:** Automated screening for inappropriate content
- **Professional Standards:** Watermarking and metadata for Iraqi business use

---

## COMMON GOTCHAS:

**Image editing development challenges:**

- **Canvas Performance:** Memory leaks and rendering optimization issues
- **Arabic Font Rendering:** Complex RTL text layout and font loading
- **Cross-Browser Support:** Canvas implementation differences
- **Touch Device Support:** Mobile editing with gesture recognition
- **File Format Support:** Different image formats and compression settings
- **Cultural Context Preservation:** Maintaining Islamic compliance during editing

---

## VALIDATION REQUIREMENTS:

**Image editing system validation:**

- **Editing Functionality:** Test all tools work correctly with Arabic content
- **Performance Benchmarks:** Canvas operations under 100ms response time
- **Cultural Validation:** 95%+ Islamic compliance for edited content
- **Export Quality:** High-resolution output with proper Arabic text rendering
- **Cross-Device Testing:** Functionality across desktop, tablet, and mobile

---

## INTEGRATION FOCUS:

**Image editing integration points:**

- **Upload System:** Seamless integration with Initial 45 image upload
- **OCR Processing:** Connection to Initial 46 Arabic text extraction
- **AI Generation:** Integration with Initial 47 AI-generated content editing
- **Professional Workflow:** Iraqi business document editing and enhancement

---

## ADDITIONAL NOTES:

**Iraqi AI Chat System image editing considerations:**

- **Focus on Arabic support** - RTL text overlay with proper Iraqi font rendering
- **Cultural validation integration** - real-time Islamic compliance checking
- **Professional domain support** - templates for Iraqi legal, medical, educational use
- **Performance optimization** - Canvas operations optimized for Arabic content processing

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [x] **Intermediate** - Production-ready patterns with common features  
- [ ] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Intermediate complexity selected** because image editing requires Canvas expertise, Arabic text rendering, and cultural validation integration while remaining accessible to developers.

---

## IMPLEMENTATION EXAMPLES:

### Image Editor Component

```tsx
'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Fabric } from 'fabric'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Task } from '@/lib/task-delegation'

interface ImageEditorProps {
  initialImage?: string
  onSave?: (editedImage: string, metadata: EditedImageMetadata) => void
  culturalValidation?: boolean
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business'
  enableArabicText?: boolean
  className?: string
}

interface EditedImageMetadata {
  originalDimensions: { width: number; height: number }
  editedDimensions: { width: number; height: number }
  filters: FilterSettings[]
  arabicTextLayers: ArabicTextLayer[]
  culturalCompliance: {
    status: 'compliant' | 'non-compliant' | 'pending'
    score: number
    issues: string[]
  }
  professionalValidation?: {
    domain: string
    approved: boolean
    requirements: string[]
  }
}

interface FilterSettings {
  type: 'brightness' | 'contrast' | 'saturation' | 'blur' | 'sepia'
  value: number
  timestamp: number
}

interface ArabicTextLayer {
  id: string
  text: string
  x: number
  y: number
  fontSize: number
  fontFamily: string
  color: string
  direction: 'rtl' | 'ltr'
  culturallyValidated: boolean
}

export default function ImageEditor({
  initialImage,
  onSave,
  culturalValidation = true,
  professionalDomain,
  enableArabicText = true,
  className
}: ImageEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<Fabric.Canvas | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string>('select')
  const [arabicText, setArabicText] = useState('')
  const [textLayers, setTextLayers] = useState<ArabicTextLayer[]>([])
  
  // Filter states
  const [brightness, setBrightness] = useState(100)
  const [contrast, setContrast] = useState(100)
  const [saturation, setSaturation] = useState(100)
  
  // Cultural validation state
  const [culturalValidationStatus, setCulturalValidationStatus] = useState<string>('')
  const [validationResults, setValidationResults] = useState<any>(null)

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new Fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 600,
        backgroundColor: 'white'
      })
      
      fabricCanvasRef.current = canvas

      // Load initial image if provided
      if (initialImage) {
        Fabric.Image.fromURL(initialImage, (img) => {
          img.scaleToWidth(canvas.width!)
          canvas.add(img)
          canvas.renderAll()
        })
      }

      return () => {
        canvas.dispose()
      }
    }
  }, [initialImage])

  // Apply filters to canvas
  const applyFilters = useCallback(() => {
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    const objects = canvas.getObjects('image')
    
    objects.forEach((obj: any) => {
      const filters = []
      
      if (brightness !== 100) {
        filters.push(new Fabric.Image.filters.Brightness({
          brightness: (brightness - 100) / 100
        }))
      }
      
      if (contrast !== 100) {
        filters.push(new Fabric.Image.filters.Contrast({
          contrast: (contrast - 100) / 100
        }))
      }
      
      if (saturation !== 100) {
        filters.push(new Fabric.Image.filters.Saturation({
          saturation: (saturation - 100) / 100
        }))
      }
      
      obj.filters = filters
      obj.applyFilters()
    })
    
    canvas.renderAll()
  }, [brightness, contrast, saturation])

  // Add Arabic text overlay
  const addArabicText = useCallback(async () => {
    if (!arabicText.trim() || !fabricCanvasRef.current) return
    
    setIsLoading(true)
    
    try {
      // Process Arabic text with RTL processor
      if (culturalValidation) {
        setCulturalValidationStatus('معالجة النص العربي... / Processing Arabic text...')
        
        const task = new Task({
          subagent_type: 'arabic-rtl-processor',
          description: 'Process Arabic text for image overlay',
          prompt: `Process this Arabic text for image overlay with cultural validation:
          
          Text: "${arabicText}"
          Context: Image editing overlay
          Professional Domain: ${professionalDomain || 'general'}
          
          Requirements:
          - Validate RTL text direction
          - Check cultural appropriateness
          - Ensure proper Arabic typography
          - Verify Islamic compliance
          
          Return processed text with validation results.`
        })
        
        const result = await task.execute()
        
        if (result.culturallyAppropriate) {
          const textObj = new Fabric.Text(arabicText, {
            left: 50,
            top: 50,
            fontSize: 24,
            fontFamily: 'Noto Sans Arabic, Arial',
            fill: '#333333',
            direction: 'rtl',
            textAlign: 'right'
          })
          
          fabricCanvasRef.current.add(textObj)
          fabricCanvasRef.current.renderAll()
          
          // Store text layer metadata
          const newLayer: ArabicTextLayer = {
            id: `text_${Date.now()}`,
            text: arabicText,
            x: 50,
            y: 50,
            fontSize: 24,
            fontFamily: 'Noto Sans Arabic, Arial',
            color: '#333333',
            direction: 'rtl',
            culturallyValidated: true
          }
          
          setTextLayers(prev => [...prev, newLayer])
          setArabicText('')
          setCulturalValidationStatus('تم التحقق بنجاح / Validation successful')
        } else {
          setCulturalValidationStatus(`تحذير ثقافي / Cultural warning: ${result.issues?.join(', ')}`)
        }
      } else {
        // Add text without validation
        const textObj = new Fabric.Text(arabicText, {
          left: 50,
          top: 50,
          fontSize: 24,
          fontFamily: 'Noto Sans Arabic, Arial',
          fill: '#333333',
          direction: 'rtl',
          textAlign: 'right'
        })
        
        fabricCanvasRef.current.add(textObj)
        fabricCanvasRef.current.renderAll()
        setArabicText('')
      }
    } catch (error) {
      console.error('Error adding Arabic text:', error)
      setCulturalValidationStatus('خطأ في معالجة النص / Text processing error')
    } finally {
      setIsLoading(false)
    }
  }, [arabicText, culturalValidation, professionalDomain])

  // Save edited image
  const handleSave = useCallback(async () => {
    if (!fabricCanvasRef.current) return
    
    setIsLoading(true)
    
    try {
      const canvas = fabricCanvasRef.current
      const dataURL = canvas.toDataURL('image/png', 1.0)
      
      // Validate edited image if cultural validation enabled
      let finalValidationResults = null
      if (culturalValidation) {
        setCulturalValidationStatus('التحقق النهائي من الصورة المحررة... / Final image validation...')
        
        const task = new Task({
          subagent_type: 'iraqi-cultural-validator',
          description: 'Validate edited image for cultural compliance',
          prompt: `Validate this edited image for Iraqi cultural compliance:
          
          Image Context: User-edited image with text overlays
          Professional Domain: ${professionalDomain || 'general'}
          Text Layers: ${textLayers.length} Arabic text layers
          
          Validation Requirements:
          - Islamic compliance (95%+ required)
          - Cultural appropriateness for Iraqi context
          - Professional domain standards
          - Content screening for inappropriate material
          
          Return detailed validation report with compliance score.`
        })
        
        finalValidationResults = await task.execute()
      }
      
      const metadata: EditedImageMetadata = {
        originalDimensions: { width: 800, height: 600 },
        editedDimensions: { width: canvas.width!, height: canvas.height! },
        filters: [
          { type: 'brightness', value: brightness, timestamp: Date.now() },
          { type: 'contrast', value: contrast, timestamp: Date.now() },
          { type: 'saturation', value: saturation, timestamp: Date.now() }
        ],
        arabicTextLayers: textLayers,
        culturalCompliance: {
          status: finalValidationResults?.compliant ? 'compliant' : 'pending',
          score: finalValidationResults?.complianceScore || 0,
          issues: finalValidationResults?.issues || []
        },
        professionalValidation: professionalDomain ? {
          domain: professionalDomain,
          approved: finalValidationResults?.professionallyAppropriate || false,
          requirements: finalValidationResults?.requirements || []
        } : undefined
      }
      
      onSave?.(dataURL, metadata)
      setCulturalValidationStatus('تم حفظ الصورة بنجاح / Image saved successfully')
    } catch (error) {
      console.error('Error saving image:', error)
      setCulturalValidationStatus('خطأ في حفظ الصورة / Error saving image')
    } finally {
      setIsLoading(false)
    }
  }, [brightness, contrast, saturation, textLayers, culturalValidation, professionalDomain, onSave])

  // Apply filters when values change
  useEffect(() => {
    applyFilters()
  }, [brightness, contrast, saturation, applyFilters])

  return (
    <div className={`image-editor ${className || ''}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>محرر الصور المتقدم / Advanced Image Editor</span>
            {professionalDomain && (
              <span className="text-sm text-muted-foreground">
                ({professionalDomain})
              </span>
            )}
          </CardTitle>
          {culturalValidationStatus && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              {culturalValidationStatus}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Canvas Area */}
            <div className="lg:col-span-2">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <canvas
                  ref={canvasRef}
                  className="max-w-full border border-gray-300 bg-white shadow-sm"
                />
              </div>
            </div>
            
            {/* Tools Panel */}
            <div className="space-y-6">
              {/* Filter Controls */}
              <div className="space-y-4">
                <h3 className="font-medium">المرشحات / Filters</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    السطوع / Brightness: {brightness}%
                  </label>
                  <Slider
                    value={[brightness]}
                    onValueChange={(value) => setBrightness(value[0])}
                    min={0}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    التباين / Contrast: {contrast}%
                  </label>
                  <Slider
                    value={[contrast]}
                    onValueChange={(value) => setContrast(value[0])}
                    min={0}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    التشبع / Saturation: {saturation}%
                  </label>
                  <Slider
                    value={[saturation]}
                    onValueChange={(value) => setSaturation(value[0])}
                    min={0}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Arabic Text Overlay */}
              {enableArabicText && (
                <div className="space-y-4">
                  <h3 className="font-medium">النص العربي / Arabic Text</h3>
                  <textarea
                    value={arabicText}
                    onChange={(e) => setArabicText(e.target.value)}
                    placeholder="أدخل النص العربي هنا... / Enter Arabic text here..."
                    className="w-full p-3 border border-gray-300 rounded-md resize-none font-arabic text-right"
                    rows={3}
                    dir="rtl"
                  />
                  <Button
                    onClick={addArabicText}
                    disabled={!arabicText.trim() || isLoading}
                    className="w-full"
                  >
                    {isLoading ? 'معالجة... / Processing...' : 'إضافة النص / Add Text'}
                  </Button>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'حفظ... / Saving...' : 'حفظ الصورة / Save Image'}
                </Button>
                
                <Button
                  onClick={() => {
                    fabricCanvasRef.current?.clear()
                    setTextLayers([])
                    setBrightness(100)
                    setContrast(100)
                    setSaturation(100)
                    setCulturalValidationStatus('')
                  }}
                  variant="outline"
                  className="w-full"
                >
                  مسح الكل / Clear All
                </Button>
              </div>
              
              {/* Text Layers List */}
              {textLayers.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">طبقات النص / Text Layers</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {textLayers.map((layer) => (
                      <div
                        key={layer.id}
                        className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded"
                      >
                        <span className="truncate font-arabic text-right flex-1" dir="rtl">
                          {layer.text}
                        </span>
                        <span className={`ml-2 px-2 py-1 rounded text-xs ${
                          layer.culturallyValidated 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {layer.culturallyValidated ? '✓' : '!'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Advanced Filter System

```typescript
// lib/image-filters.ts
import { Task } from '@/lib/task-delegation'

export interface FilterConfig {
  name: string
  displayName: string
  displayNameArabic: string
  parameters: FilterParameter[]
  culturalValidation?: boolean
  professionalApproved?: string[]
}

export interface FilterParameter {
  name: string
  type: 'range' | 'boolean' | 'select'
  min?: number
  max?: number
  step?: number
  default: number | boolean | string
  options?: { value: string; label: string; labelArabic: string }[]
}

export class AdvancedImageFilters {
  private static culturallyApprovedFilters: FilterConfig[] = [
    {
      name: 'brightness',
      displayName: 'Brightness',
      displayNameArabic: 'السطوع',
      parameters: [
        { name: 'value', type: 'range', min: 0, max: 200, step: 5, default: 100 }
      ],
      culturalValidation: false,
      professionalApproved: ['legal', 'medical', 'educational', 'business']
    },
    {
      name: 'contrast',
      displayName: 'Contrast',
      displayNameArabic: 'التباين',
      parameters: [
        { name: 'value', type: 'range', min: 0, max: 200, step: 5, default: 100 }
      ],
      culturalValidation: false,
      professionalApproved: ['legal', 'medical', 'educational', 'business']
    },
    {
      name: 'saturation',
      displayName: 'Saturation',
      displayNameArabic: 'التشبع',
      parameters: [
        { name: 'value', type: 'range', min: 0, max: 200, step: 5, default: 100 }
      ],
      culturalValidation: false,
      professionalApproved: ['legal', 'medical', 'educational', 'business']
    },
    {
      name: 'sepia',
      displayName: 'Sepia',
      displayNameArabic: 'بني داكن',
      parameters: [
        { name: 'intensity', type: 'range', min: 0, max: 100, step: 5, default: 0 }
      ],
      culturalValidation: true,
      professionalApproved: ['business', 'educational']
    },
    {
      name: 'blur',
      displayName: 'Blur',
      displayNameArabic: 'ضبابية',
      parameters: [
        { name: 'radius', type: 'range', min: 0, max: 20, step: 1, default: 0 }
      ],
      culturalValidation: false,
      professionalApproved: ['business']
    },
    {
      name: 'islamic_patterns',
      displayName: 'Islamic Geometric Patterns',
      displayNameArabic: 'الأنماط الهندسية الإسلامية',
      parameters: [
        {
          name: 'pattern_type',
          type: 'select',
          default: 'none',
          options: [
            { value: 'none', label: 'None', labelArabic: 'بدون' },
            { value: 'geometric', label: 'Geometric', labelArabic: 'هندسي' },
            { value: 'calligraphy', label: 'Calligraphy', labelArabic: 'خط عربي' },
            { value: 'arabesque', label: 'Arabesque', labelArabic: 'أرابيسك' }
          ]
        },
        { name: 'opacity', type: 'range', min: 0, max: 100, step: 5, default: 20 }
      ],
      culturalValidation: true,
      professionalApproved: ['legal', 'medical', 'educational', 'business']
    }
  ]

  static async validateFilter(
    filterName: string,
    parameters: Record<string, any>,
    professionalDomain?: string
  ): Promise<{
    approved: boolean
    culturallyAppropriate: boolean
    issues: string[]
    recommendations: string[]
  }> {
    const filter = this.culturallyApprovedFilters.find(f => f.name === filterName)
    
    if (!filter) {
      return {
        approved: false,
        culturallyAppropriate: false,
        issues: ['Unknown filter type'],
        recommendations: ['Use approved filters only']
      }
    }

    // Check professional domain approval
    const professionallyApproved = !professionalDomain || 
      filter.professionalApproved?.includes(professionalDomain)

    // Cultural validation if required
    let culturalValidation = { approved: true, issues: [], recommendations: [] }
    
    if (filter.culturalValidation) {
      try {
        const task = new Task({
          subagent_type: 'iraqi-cultural-validator',
          description: 'Validate image filter for cultural appropriateness',
          prompt: `Validate this image filter for Iraqi cultural compliance:
          
          Filter: ${filterName}
          Parameters: ${JSON.stringify(parameters)}
          Professional Domain: ${professionalDomain || 'general'}
          
          Validation Requirements:
          - Islamic compliance
          - Cultural appropriateness for Iraqi context
          - Professional standards compliance
          
          Return validation results with recommendations.`
        })
        
        const result = await task.execute()
        culturalValidation = {
          approved: result.culturallyAppropriate,
          issues: result.issues || [],
          recommendations: result.recommendations || []
        }
      } catch (error) {
        console.error('Cultural validation error:', error)
        culturalValidation = {
          approved: false,
          issues: ['Cultural validation failed'],
          recommendations: ['Retry validation or use simpler filters']
        }
      }
    }

    return {
      approved: professionallyApproved && culturalValidation.approved,
      culturallyAppropriate: culturalValidation.approved,
      issues: culturalValidation.issues,
      recommendations: culturalValidation.recommendations
    }
  }

  static getAvailableFilters(professionalDomain?: string): FilterConfig[] {
    return this.culturallyApprovedFilters.filter(filter =>
      !professionalDomain || filter.professionalApproved?.includes(professionalDomain)
    )
  }

  static async applyIslamicPattern(
    canvas: HTMLCanvasElement,
    patternType: string,
    opacity: number = 20
  ): Promise<HTMLCanvasElement> {
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas context not available')

    // Create pattern overlay
    const patternCanvas = document.createElement('canvas')
    patternCanvas.width = canvas.width
    patternCanvas.height = canvas.height
    const patternCtx = patternCanvas.getContext('2d')!

    switch (patternType) {
      case 'geometric':
        this.drawGeometricPattern(patternCtx, canvas.width, canvas.height)
        break
      case 'calligraphy':
        await this.drawCalligraphyPattern(patternCtx, canvas.width, canvas.height)
        break
      case 'arabesque':
        this.drawArabesquePattern(patternCtx, canvas.width, canvas.height)
        break
      default:
        return canvas
    }

    // Apply pattern with opacity
    ctx.globalAlpha = opacity / 100
    ctx.drawImage(patternCanvas, 0, 0)
    ctx.globalAlpha = 1

    return canvas
  }

  private static drawGeometricPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    ctx.strokeStyle = '#B8860B' // Gold color
    ctx.lineWidth = 1
    
    const gridSize = 40
    
    // Draw Islamic geometric grid
    for (let x = 0; x < width; x += gridSize) {
      for (let y = 0; y < height; y += gridSize) {
        // Draw octagon
        ctx.beginPath()
        const centerX = x + gridSize / 2
        const centerY = y + gridSize / 2
        const radius = gridSize / 3
        
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI * 2) / 8
          const pointX = centerX + radius * Math.cos(angle)
          const pointY = centerY + radius * Math.sin(angle)
          
          if (i === 0) {
            ctx.moveTo(pointX, pointY)
          } else {
            ctx.lineTo(pointX, pointY)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }
    }
  }

  private static async drawCalligraphyPattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): Promise<void> {
    ctx.fillStyle = '#8B4513' // Brown color
    ctx.font = '24px "Noto Naskh Arabic", serif'
    ctx.textAlign = 'center'
    
    // Arabic calligraphy phrases (respectful and appropriate)
    const phrases = ['بسم الله', 'الحمد لله', 'سبحان الله', 'لا حول ولا قوة إلا بالله']
    
    const gridSize = 120
    let phraseIndex = 0
    
    for (let x = gridSize; x < width; x += gridSize) {
      for (let y = gridSize; y < height; y += gridSize) {
        ctx.fillText(phrases[phraseIndex % phrases.length], x, y)
        phraseIndex++
      }
    }
  }

  private static drawArabesquePattern(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ): void {
    ctx.strokeStyle = '#CD853F' // Peru color
    ctx.lineWidth = 2
    
    const step = 60
    
    for (let x = 0; x < width; x += step) {
      for (let y = 0; y < height; y += step) {
        // Draw flowing arabesque curves
        ctx.beginPath()
        ctx.moveTo(x, y + step / 2)
        
        // Create flowing S-curve pattern
        ctx.quadraticCurveTo(x + step / 4, y, x + step / 2, y + step / 4)
        ctx.quadraticCurveTo(x + (3 * step) / 4, y + step / 2, x + step, y + step / 4)
        ctx.quadraticCurveTo(x + (3 * step) / 4, y + step, x + step / 2, y + (3 * step) / 4)
        ctx.quadraticCurveTo(x + step / 4, y + step / 2, x, y + (3 * step) / 4)
        
        ctx.stroke()
      }
    }
  }
}
```

---

**This micro-initial provides comprehensive image editing and processing capabilities specifically designed for Iraqi AI Chat System integration, with full Arabic text support, cultural validation, and professional domain compliance.**