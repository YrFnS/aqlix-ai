# Image Generation & AI Art for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Advanced AI image generation system** with DALL-E integration, Midjourney API support, Stable Diffusion models, Arabic prompt processing, Islamic art style generation, cultural appropriateness filtering, and professional domain image creation for Iraqi AI Chat System.

**Specific technologies:** OpenAI DALL-E API, Midjourney API integration, Stable Diffusion models, Arabic prompt translation, Islamic art style models, cultural content filtering, and professional image templates.

---

## TEMPLATE PURPOSE:

**Setting up comprehensive AI image generation infrastructure** for Iraqi AI Chat System that creates culturally-appropriate images from Arabic prompts, generates Islamic art styles, validates cultural compliance, integrates professional domain requirements, and coordinates with Iraqi AI agents for enhanced image creation.

**Developers should be able to:** Generate images from Arabic prompts, create Islamic art styles, validate cultural appropriateness, process professional domain requests, translate Arabic descriptions, coordinate with cultural validators, and manage AI art generation workflows.

---

## CORE FEATURES:

**Iraqi AI image generation infrastructure:**

### Advanced Arabic Prompt Processing
- **Arabic Prompt Translation:** Intelligent translation of Arabic prompts to English for AI models
- **Cultural Context Enhancement:** Enrich prompts with Iraqi cultural context and Islamic principles
- **Dialect Recognition:** Process Iraqi dialect variations in image generation requests
- **Professional Domain Prompts:** Specialized prompt templates for Iraqi professional contexts
- **Multilingual Prompt Handling:** Seamless Arabic-English mixed prompt processing

### Islamic Art Style Generation
- **Traditional Islamic Patterns:** Generate geometric patterns and Arabic calligraphy art
- **Iraqi Cultural Motifs:** Create images with Iraqi cultural symbols and traditional elements
- **Islamic Architecture:** Generate mosque designs and Islamic architectural elements
- **Arabic Calligraphy:** Create artistic Arabic text and calligraphic designs
- **Cultural Landscapes:** Generate Iraqi landscapes and cultural scenes with authenticity

### Cultural Appropriateness Filtering
- **Islamic Compliance Validation:** Ensure generated images comply with Islamic principles (95%+ accuracy)
- **Cultural Sensitivity Checking:** Validate images for Iraqi cultural appropriateness
- **Content Moderation:** Automatic filtering of inappropriate or culturally insensitive content
- **Professional Ethics Compliance:** Ensure images meet Iraqi professional standards
- **Regional Adaptation:** Adapt image styles for different Iraqi regions and contexts

### Professional Domain Image Generation
- **Legal Visualization:** Generate images for Iraqi legal contexts and court presentations
- **Medical Illustrations:** Create medical diagrams and healthcare-related imagery with Arabic labels
- **Educational Materials:** Generate educational images for Iraqi curriculum and learning materials
- **Business Graphics:** Create business-appropriate images for Iraqi commercial contexts
- **Identity and Branding:** Generate culturally-appropriate logos and branding elements

### Multi-Model AI Integration
- **DALL-E Integration:** High-quality image generation with advanced prompt processing
- **Midjourney API:** Artistic image generation with style customization capabilities
- **Stable Diffusion Models:** Open-source image generation with custom model fine-tuning
- **Model Selection Logic:** Intelligent routing to optimal AI model based on prompt type
- **Quality Assessment:** Automatic evaluation and selection of best generated images

---

## EXAMPLES TO INCLUDE:

**Iraqi AI image generation examples:**

### Arabic Prompt Processing Component
```tsx
// components/ImageGeneration.tsx
import React, { useState, useCallback } from 'react'
import { Palette, Wand2, Globe, Eye, Download, Sparkles } from 'lucide-react'
import { Task } from '@/lib/task-delegation'

interface ImageGenerationProps {
  onImageGenerated: (result: GeneratedImageResult) => void
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business'
  stylePreference?: 'realistic' | 'artistic' | 'islamic' | 'professional'
}

interface GeneratedImageResult {
  imageUrl: string
  prompt: string
  arabicPrompt: string
  style: string
  model: string
  culturalValidation: {
    islamicCompliant: boolean
    culturallyAppropriate: boolean
    professionalSuitable: boolean
  }
  metadata: {
    generatedAt: string
    model: string
    parameters: any
    culturalTags: string[]
  }
}

export default function ImageGeneration({
  onImageGenerated,
  professionalDomain,
  stylePreference = 'realistic'
}: ImageGenerationProps) {
  const [prompt, setPrompt] = useState('')
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState('')
  const [selectedModel, setSelectedModel] = useState<'dalle' | 'midjourney' | 'stable-diffusion'>('dalle')
  const [islamicArtMode, setIslamicArtMode] = useState(false)

  const processArabicPrompt = useCallback(async (arabicPrompt: string): Promise<string> => {
    const task = new Task({
      subagent_type: 'arabic-rtl-processor',
      description: 'Process Arabic image generation prompt',
      prompt: `
        Process this Arabic image generation prompt for AI image generation:
        
        Arabic Prompt: ${arabicPrompt}
        Professional Domain: ${professionalDomain || 'general'}
        Style Preference: ${stylePreference}
        Islamic Art Mode: ${islamicArtMode}
        
        Tasks:
        1. Translate to English while preserving cultural context
        2. Enhance with Iraqi cultural details
        3. Add Islamic art elements if appropriate
        4. Include professional domain context
        5. Optimize for AI image generation models
        
        Return enhanced English prompt with cultural context.
      `
    })

    const result = await task.execute()
    return result.enhancedPrompt
  }, [professionalDomain, stylePreference, islamicArtMode])

  const validateCulturally = useCallback(async (
    imageUrl: string, 
    prompt: string
  ): Promise<any> => {
    const task = new Task({
      subagent_type: 'iraqi-cultural-validator',
      description: 'Validate generated image culturally',
      prompt: `
        Validate this AI-generated image for Iraqi cultural appropriateness:
        
        Image URL: ${imageUrl}
        Original Prompt: ${prompt}
        Professional Domain: ${professionalDomain || 'general'}
        Islamic Art Mode: ${islamicArtMode}
        
        Validation Criteria:
        1. Islamic compliance (95%+ required)
        2. Iraqi cultural appropriateness (90%+ required)  
        3. Professional domain suitability
        4. Content appropriateness for all audiences
        5. Respect for Iraqi cultural values
        
        Provide detailed validation results with recommendations.
      `
    })

    return await task.execute()
  }, [professionalDomain, islamicArtMode])

  const generateImage = useCallback(async () => {
    if (!prompt.trim()) return

    setGenerating(true)
    setProgress(0)
    setStatus('جاري معالجة الطلب... / Processing request...')

    try {
      // Process Arabic prompt
      setProgress(20)
      setStatus('جاري معالجة النص العربي... / Processing Arabic text...')
      
      const enhancedPrompt = await processArabicPrompt(prompt)

      // Generate image based on selected model
      setProgress(40)
      setStatus('جاري إنتاج الصورة... / Generating image...')

      let imageUrl: string
      let modelUsed: string

      switch (selectedModel) {
        case 'dalle':
          imageUrl = await generateWithDALLE(enhancedPrompt)
          modelUsed = 'DALL-E 3'
          break
        case 'midjourney':
          imageUrl = await generateWithMidjourney(enhancedPrompt)
          modelUsed = 'Midjourney'
          break
        case 'stable-diffusion':
          imageUrl = await generateWithStableDiffusion(enhancedPrompt)
          modelUsed = 'Stable Diffusion'
          break
        default:
          throw new Error('Model not supported')
      }

      setProgress(80)
      setStatus('جاري التحقق الثقافي... / Cultural validation...')

      // Cultural validation
      const culturalValidation = await validateCulturally(imageUrl, enhancedPrompt)

      setProgress(100)
      setStatus('تم بنجاح! / Completed successfully!')

      const result: GeneratedImageResult = {
        imageUrl,
        prompt: enhancedPrompt,
        arabicPrompt: prompt,
        style: stylePreference,
        model: modelUsed,
        culturalValidation,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: modelUsed,
          parameters: {
            islamicArtMode,
            professionalDomain,
            stylePreference
          },
          culturalTags: culturalValidation.culturalTags || []
        }
      }

      onImageGenerated(result)

    } catch (error) {
      console.error('Image generation error:', error)
      setStatus(`خطأ: ${error.message} / Error: ${error.message}`)
    } finally {
      setTimeout(() => {
        setGenerating(false)
        setProgress(0)
      }, 2000)
    }
  }, [prompt, selectedModel, processArabicPrompt, validateCulturally, onImageGenerated])

  const generateWithDALLE = async (prompt: string): Promise<string> => {
    const response = await fetch('/api/generate-image/dalle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt,
        size: '1024x1024',
        quality: 'hd',
        style: islamicArtMode ? 'natural' : 'vivid',
        user: 'iraqi-ai-chat'
      })
    })

    if (!response.ok) {
      throw new Error(`DALL-E generation failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.imageUrl
  }

  const generateWithMidjourney = async (prompt: string): Promise<string> => {
    const response = await fetch('/api/generate-image/midjourney', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: islamicArtMode ? `${prompt} --style islamic art --ar 1:1` : prompt,
        aspect_ratio: '1:1',
        version: '6.0'
      })
    })

    if (!response.ok) {
      throw new Error(`Midjourney generation failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.imageUrl
  }

  const generateWithStableDiffusion = async (prompt: string): Promise<string> => {
    const response = await fetch('/api/generate-image/stable-diffusion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: islamicArtMode ? `${prompt}, islamic art style, geometric patterns` : prompt,
        negative_prompt: 'nsfw, inappropriate, violence, alcohol',
        width: 1024,
        height: 1024,
        steps: 30,
        guidance_scale: 7.5
      })
    })

    if (!response.ok) {
      throw new Error(`Stable Diffusion generation failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data.imageUrl
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          إنتاج الصور بالذكاء الاصطناعي
        </h2>
        <p className="text-gray-600">
          AI Image Generation with Iraqi Cultural Intelligence
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نموذج الذكاء الاصطناعي / AI Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="dalle">DALL-E 3 (OpenAI)</option>
              <option value="midjourney">Midjourney</option>
              <option value="stable-diffusion">Stable Diffusion</option>
            </select>
          </div>

          {/* Style Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نمط الصورة / Image Style
            </label>
            <select
              value={stylePreference}
              onChange={(e) => setStylePreference(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="realistic">واقعي / Realistic</option>
              <option value="artistic">فني / Artistic</option>
              <option value="islamic">إسلامي / Islamic Art</option>
              <option value="professional">مهني / Professional</option>
            </select>
          </div>

          {/* Professional Domain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              المجال المهني / Professional Domain
            </label>
            <select
              value={professionalDomain || ''}
              onChange={(e) => setProfessionalDomain(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">عام / General</option>
              <option value="legal">قانوني / Legal</option>
              <option value="medical">طبي / Medical</option>
              <option value="educational">تعليمي / Educational</option>
              <option value="business">أعمال / Business</option>
            </select>
          </div>
        </div>

        {/* Islamic Art Mode Toggle */}
        <div className="flex items-center space-x-3 rtl:space-x-reverse mb-6">
          <input
            type="checkbox"
            id="islamic-art-mode"
            checked={islamicArtMode}
            onChange={(e) => setIslamicArtMode(e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="islamic-art-mode" className="text-sm font-medium text-gray-700">
            <Sparkles className="w-4 h-4 inline-block ml-1 rtl:ml-0 rtl:mr-1" />
            وضع الفن الإسلامي / Islamic Art Mode
          </label>
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            وصف الصورة / Image Description
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="صف الصورة التي تريد إنتاجها... / Describe the image you want to generate..."
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none font-arabic"
            dir="auto"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>{prompt.length} حرف / characters</span>
            <span>الحد الأقصى: 500 حرف / Max: 500 characters</span>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateImage}
          disabled={!prompt.trim() || generating}
          className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          <Wand2 className="w-5 h-5 inline-block ml-2 rtl:ml-0 rtl:mr-2" />
          {generating ? 'جاري الإنتاج... / Generating...' : 'أنتج الصورة / Generate Image'}
        </button>
      </div>

      {/* Generation Progress */}
      {generating && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-blue-800 font-medium">جاري إنتاج الصورة... / Generating Image...</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-blue-700">
              <span>{status}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Quick Prompt Templates */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          قوالب سريعة / Quick Templates
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { ar: 'مسجد عراقي تقليدي', en: 'Traditional Iraqi mosque' },
            { ar: 'خط عربي جميل', en: 'Beautiful Arabic calligraphy' },
            { ar: 'منظر طبيعي من العراق', en: 'Iraqi landscape scene' },
            { ar: 'زخارف إسلامية هندسية', en: 'Islamic geometric patterns' },
            { ar: 'تصميم شعار مهني', en: 'Professional logo design' },
            { ar: 'رسم توضيحي طبي', en: 'Medical illustration' }
          ].map((template, index) => (
            <button
              key={index}
              onClick={() => setPrompt(template.ar)}
              className="p-3 text-sm bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-right"
            >
              <div className="font-arabic font-medium">{template.ar}</div>
              <div className="text-xs text-gray-500 mt-1">{template.en}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Generated Image Display Component
```tsx
// components/GeneratedImageDisplay.tsx
import React, { useState } from 'react'
import Image from 'next/image'
import { Download, Share2, Edit3, RefreshCw, Shield, Globe, Palette } from 'lucide-react'

interface GeneratedImageDisplayProps {
  result: GeneratedImageResult
  onRegenerate?: () => void
  onEdit?: () => void
}

export default function GeneratedImageDisplay({ 
  result, 
  onRegenerate, 
  onEdit 
}: GeneratedImageDisplayProps) {
  const [showMetadata, setShowMetadata] = useState(false)

  const downloadImage = async () => {
    const response = await fetch(result.imageUrl)
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-image-${Date.now()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareImage = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'صورة مُنتجة بالذكاء الاصطناعي / AI Generated Image',
        text: result.arabicPrompt,
        url: result.imageUrl
      })
    }
  }

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-square">
        <Image
          src={result.imageUrl}
          alt={result.arabicPrompt}
          fill
          className="object-cover"
        />
        
        {/* Action Overlay */}
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 flex space-x-2 rtl:space-x-reverse">
          <button
            onClick={downloadImage}
            className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-opacity"
            title="تحميل / Download"
          >
            <Download className="w-4 h-4" />
          </button>
          
          <button
            onClick={shareImage}
            className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-opacity"
            title="مشاركة / Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-opacity"
              title="تحرير / Edit"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}

          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="p-2 bg-black bg-opacity-50 text-white rounded-lg hover:bg-opacity-70 transition-opacity"
              title="إعادة إنتاج / Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Prompts */}
        <div className="space-y-3 mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              الطلب الأصلي / Original Prompt
            </h3>
            <p className="text-gray-900 font-arabic" dir="rtl">
              {result.arabicPrompt}
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              الطلب المحسن / Enhanced Prompt
            </h3>
            <p className="text-sm text-gray-600">
              {result.prompt}
            </p>
          </div>
        </div>

        {/* Metadata Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            <Palette className="w-3 h-3 inline-block ml-1 rtl:ml-0 rtl:mr-1" />
            {result.model}
          </span>
          
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            <Globe className="w-3 h-3 inline-block ml-1 rtl:ml-0 rtl:mr-1" />
            {result.style}
          </span>

          {result.metadata.culturalTags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Cultural Validation Status */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            التحقق الثقافي / Cultural Validation
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className={`w-3 h-3 rounded-full ${
                result.culturalValidation.islamicCompliant ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-xs">
                {result.culturalValidation.islamicCompliant ? '✓' : '✗'} 
                الامتثال الإسلامي / Islamic Compliant
              </span>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className={`w-3 h-3 rounded-full ${
                result.culturalValidation.culturallyAppropriate ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-xs">
                {result.culturalValidation.culturallyAppropriate ? '✓' : '✗'} 
                مناسب ثقافياً / Culturally Appropriate
              </span>
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div className={`w-3 h-3 rounded-full ${
                result.culturalValidation.professionalSuitable ? 'bg-green-500' : 'bg-yellow-500'
              }`} />
              <span className="text-xs">
                {result.culturalValidation.professionalSuitable ? '✓' : '⚠'} 
                مناسب مهنياً / Professionally Suitable
              </span>
            </div>
          </div>
        </div>

        {/* Toggle Metadata */}
        <button
          onClick={() => setShowMetadata(!showMetadata)}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          {showMetadata ? 'إخفاء التفاصيل / Hide Details' : 'عرض التفاصيل / Show Details'}
        </button>

        {/* Detailed Metadata */}
        {showMetadata && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">تاريخ الإنتاج:</span>
                <p className="text-gray-600">
                  {new Date(result.metadata.generatedAt).toLocaleString('ar-IQ')}
                </p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">نموذج الذكاء الاصطناعي:</span>
                <p className="text-gray-600">{result.metadata.model}</p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">المعاملات:</span>
                <p className="text-gray-600">
                  {JSON.stringify(result.metadata.parameters, null, 2)}
                </p>
              </div>
              
              <div>
                <span className="font-medium text-gray-700">العلامات الثقافية:</span>
                <p className="text-gray-600">
                  {result.metadata.culturalTags.join(', ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

### AI Model Integration Services
```typescript
// lib/ai-image-generation.ts
import { Task } from '@/lib/task-delegation'

export class AIImageGenerationService {
  async generateWithDALLE(
    prompt: string,
    options: {
      size?: '1024x1024' | '1792x1024' | '1024x1792'
      quality?: 'standard' | 'hd'
      style?: 'vivid' | 'natural'
      user?: string
    } = {}
  ): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: options.size || '1024x1024',
        quality: options.quality || 'hd',
        style: options.style || 'natural',
        user: options.user || 'iraqi-ai-chat'
      })
    })

    if (!response.ok) {
      throw new Error(`DALL-E API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.data[0].url
  }

  async generateWithStableDiffusion(
    prompt: string,
    options: {
      negativePrompt?: string
      width?: number
      height?: number
      steps?: number
      guidanceScale?: number
      seed?: number
    } = {}
  ): Promise<string> {
    const response = await fetch('https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          },
          ...(options.negativePrompt ? [{
            text: options.negativePrompt,
            weight: -1
          }] : [])
        ],
        cfg_scale: options.guidanceScale || 7,
        width: options.width || 1024,
        height: options.height || 1024,
        steps: options.steps || 30,
        samples: 1,
        seed: options.seed
      })
    })

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Convert base64 to blob URL
    const imageData = data.artifacts[0].base64
    const blob = new Blob([Uint8Array.from(atob(imageData), c => c.charCodeAt(0))], {
      type: 'image/png'
    })
    
    return URL.createObjectURL(blob)
  }

  async enhancePromptWithCulturalContext(
    arabicPrompt: string,
    professionalDomain?: string,
    islamicArtMode?: boolean
  ): Promise<string> {
    const task = new Task({
      subagent_type: 'iraqi-cultural-validator',
      description: 'Enhance image prompt with Iraqi cultural context',
      prompt: `
        Enhance this Arabic image generation prompt with Iraqi cultural context:
        
        Original Prompt: ${arabicPrompt}
        Professional Domain: ${professionalDomain || 'general'}
        Islamic Art Mode: ${islamicArtMode || false}
        
        Enhancement Requirements:
        1. Translate to English while preserving cultural nuance
        2. Add Iraqi cultural elements and context
        3. Include Islamic art principles if applicable
        4. Ensure cultural appropriateness and sensitivity
        5. Add professional domain specific elements
        6. Optimize for AI image generation models
        
        Cultural Guidelines:
        - Respect Islamic principles and values
        - Include Iraqi architectural/cultural elements when relevant
        - Use appropriate cultural symbols and motifs
        - Ensure modesty and cultural appropriateness
        - Add Arabic/Islamic calligraphy elements if suitable
        
        Return enhanced English prompt with cultural context.
      `
    })

    const result = await task.execute()
    return result.enhancedPrompt
  }

  async validateImageCulturally(
    imageUrl: string,
    originalPrompt: string,
    professionalDomain?: string
  ): Promise<any> {
    const task = new Task({
      subagent_type: 'iraqi-cultural-validator',
      description: 'Validate AI-generated image culturally',
      prompt: `
        Validate this AI-generated image for Iraqi cultural appropriateness:
        
        Image URL: ${imageUrl}
        Original Prompt: ${originalPrompt}
        Professional Domain: ${professionalDomain || 'general'}
        
        Validation Criteria:
        1. Islamic compliance (check for appropriate content, modesty, religious sensitivity)
        2. Iraqi cultural appropriateness (symbols, colors, representations)
        3. Professional domain suitability for Iraqi context
        4. Content appropriateness for all age groups
        5. Respect for Iraqi cultural values and traditions
        
        Scoring Requirements:
        - Islamic Compliance: 95%+ required for approval
        - Cultural Appropriateness: 90%+ required for approval
        - Professional Suitability: 85%+ required for domain-specific use
        
        Provide detailed validation results with:
        - Boolean flags for each criterion
        - Confidence scores
        - Cultural tags and classifications
        - Recommendations for improvement if needed
        - Arabic and English feedback
      `
    })

    return await task.execute()
  }

  async selectOptimalModel(
    prompt: string,
    stylePreference: string,
    professionalDomain?: string
  ): Promise<'dalle' | 'midjourney' | 'stable-diffusion'> {
    // Simple model selection logic - can be enhanced with AI
    if (stylePreference === 'islamic' || professionalDomain === 'educational') {
      return 'stable-diffusion' // More customizable for cultural content
    }
    
    if (stylePreference === 'artistic' || prompt.includes('calligraphy')) {
      return 'midjourney' // Better for artistic content
    }
    
    return 'dalle' // Default for high-quality, general-purpose generation
  }
}
```

---

## DOCUMENTATION TO RESEARCH:

**AI image generation documentation:**

- **OpenAI DALL-E API:** https://platform.openai.com/docs/guides/images - Image generation API documentation
- **Stability AI:** https://platform.stability.ai/docs/getting-started - Stable Diffusion API integration
- **Midjourney API:** https://docs.midjourney.com/ - Midjourney API documentation and guides
- **Cultural AI Guidelines:** https://ai.google/principles/ - Ethical AI development principles
- **Islamic Art Principles:** https://islamicart.museumwnf.org/ - Islamic art patterns and cultural context

---

## DEVELOPMENT PATTERNS:

**Iraqi AI image generation architecture patterns:**

### Cultural-First Generation Patterns
- **Arabic Prompt Processing:** Intelligent translation with cultural context preservation and enhancement
- **Islamic Art Integration:** Traditional patterns, geometric designs, and calligraphic elements
- **Cultural Validation Pipeline:** Multi-stage validation ensuring Islamic compliance and Iraqi cultural appropriateness
- **Professional Domain Adaptation:** Specialized generation for Iraqi professional contexts and requirements
- **Regional Cultural Adaptation:** Support for different Iraqi regional cultural preferences and variations

### Multi-Model Orchestration Patterns
- **Intelligent Model Selection:** Dynamic routing to optimal AI model based on prompt analysis and requirements
- **Quality Assessment:** Automatic evaluation and ranking of generated images from multiple models
- **Fallback Strategies:** Graceful degradation when primary models fail or produce inappropriate content
- **Cost Optimization:** Smart model selection balancing quality requirements with generation costs
- **Performance Monitoring:** Real-time tracking of model performance and cultural compliance rates

### Professional Integration Patterns
- **Domain-Specific Templates:** Pre-configured prompts for Iraqi legal, medical, educational, and business contexts
- **Cultural Compliance Workflows:** Automated validation and approval processes for professional use
- **Brand Consistency:** Professional branding guidelines integration with cultural appropriateness requirements
- **Legal Compliance:** Copyright and intellectual property considerations for AI-generated professional content
- **Quality Assurance:** Professional review processes ensuring images meet Iraqi professional standards

---

## SECURITY & BEST PRACTICES:

**AI image generation security considerations:**

- **Content Moderation:** Multi-layered filtering preventing generation of inappropriate or culturally insensitive content
- **API Security:** Secure handling of API keys and rate limiting for external AI services
- **Cultural Compliance:** Mandatory validation ensuring all generated content respects Islamic principles and Iraqi cultural values
- **Professional Ethics:** Compliance with Iraqi professional standards and ethical guidelines for domain-specific content

---

## COMMON GOTCHAS:

**AI image generation development challenges:**

- **Cultural Sensitivity:** Ensuring AI models understand and respect Iraqi cultural context and Islamic principles
- **Prompt Translation:** Maintaining cultural nuance when translating Arabic prompts to English for AI models
- **Model Limitations:** Different AI models have varying capabilities for cultural content and artistic styles
- **Cost Management:** Balancing image quality with API costs for different AI generation services
- **Content Filtering:** Preventing generation of culturally inappropriate content while maintaining creative flexibility

---

## VALIDATION REQUIREMENTS:

**Iraqi AI image generation validation:**

### Cultural Compliance Testing
- **Islamic Compliance:** Validate generated images for Islamic principle compliance (95%+ accuracy required)
- **Cultural Appropriateness:** Test Iraqi cultural sensitivity and appropriateness across different contexts
- **Professional Domain Testing:** Validate domain-specific image generation for Iraqi professional requirements
- **Regional Adaptation:** Test cultural variation support for different Iraqi regions and communities
- **Content Moderation:** Validate filtering of inappropriate or culturally insensitive content

### Generation Quality Testing
- **Prompt Processing:** Test Arabic prompt translation and cultural context enhancement accuracy
- **Multi-Model Performance:** Compare generation quality across different AI models and use cases
- **Style Consistency:** Validate style preferences and Islamic art mode generation accuracy
- **Professional Standards:** Test professional image generation meeting Iraqi domain requirements
- **Error Handling:** Validate graceful handling of generation failures and inappropriate content detection

### Integration Testing
- **Multi-Agent Coordination:** Test integration with iraqi-cultural-validator and arabic-rtl-processor agents
- **Image Management:** Validate integration with image upload, display, and storage systems
- **Professional Workflows:** Test integration with Iraqi professional domain workflows and approval processes
- **User Experience:** Validate Arabic-English bilingual interface and RTL layout support
- **Performance:** Test generation speed, API response times, and system resource usage

### Security Testing
- **Content Security:** Validate prevention of inappropriate content generation and cultural violations
- **API Security:** Test secure handling of external AI service APIs and rate limiting
- **Privacy Protection:** Validate handling of sensitive or personal information in generated images
- **Cultural Privacy:** Test respect for cultural and religious privacy requirements
- **Professional Confidentiality:** Validate appropriate handling of professional domain sensitive content

---

## INTEGRATION FOCUS:

**Iraqi AI image generation integration points:**

### Cultural Intelligence Integration
- **iraqi-cultural-validator Integration:** Seamless cultural validation pipeline for all generated images
- **arabic-rtl-processor Integration:** Advanced Arabic prompt processing and cultural context enhancement
- **iraqi-professional-domain-expert Integration:** Professional domain-specific image generation and validation
- **Islamic Compliance Integration:** Automated Islamic principle compliance checking and cultural appropriateness validation

### Image Management Integration
- **Image Upload Integration:** Seamless integration with image upload and display system for generated images
- **Storage Integration:** Efficient storage and retrieval of generated images with metadata and cultural tags
- **Gallery Integration:** Integration with image galleries supporting generated image display and management
- **Search Integration:** Arabic-English searchable generated image library with cultural and professional tags

### Professional Workflow Integration
- **Legal Document Integration:** Generated images for Iraqi legal presentations, documents, and court materials
- **Medical Illustration Integration:** Medical diagrams and educational materials with Arabic labels and cultural sensitivity
- **Educational Content Integration:** Generated images for Iraqi curriculum materials and educational resources
- **Business Graphics Integration:** Professional branding and marketing materials respecting Iraqi cultural values

### User Experience Integration
- **RTL Interface Integration:** Seamless RTL interface support for Arabic prompt input and image management
- **Bilingual Support Integration:** Arabic-English interface with cultural context-aware user experience
- **Progressive Enhancement Integration:** Loading states and progress tracking for AI image generation workflows
- **Accessibility Integration:** Screen reader support and accessibility compliance for generated image interfaces

---

## ADDITIONAL NOTES:

**Iraqi AI Chat System image generation considerations:**

- **Focus on cultural authenticity** - Ensure all generated images respect Iraqi cultural values and Islamic principles
- **Emphasize professional quality** - Generate images meeting Iraqi professional standards for legal, medical, educational domains
- **Plan for Islamic art integration** - Include traditional Islamic patterns, geometric designs, and calligraphic elements
- **Keep cost efficiency in mind** - Optimize AI model selection and usage for sustainable operation costs

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [ ] **Intermediate** - Production-ready patterns with common features  
- [x] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Advanced complexity selected** because this system requires sophisticated AI model integration, cultural validation pipelines, Arabic prompt processing, Islamic art generation, professional domain adaptation, and seamless coordination with multiple Iraqi AI agents for comprehensive image generation capabilities.

---

**This initial provides comprehensive AI image generation capabilities for the Iraqi AI Chat System with cultural intelligence, Islamic art support, professional domain integration, and seamless coordination with Iraqi AI agents.**