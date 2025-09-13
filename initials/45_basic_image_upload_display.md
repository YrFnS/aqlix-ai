# Basic Image Upload & Display for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Comprehensive image upload and display system** with Next.js Image component optimization, Supabase Storage integration, RTL-optimized image galleries, Arabic metadata support, and cultural content filtering for Iraqi AI Chat System.

**Specific technologies:** Next.js Image component, Supabase Storage buckets, file upload handling, RTL image layouts, Arabic metadata processing, cultural content validation, and image optimization pipelines.

---

## TEMPLATE PURPOSE:

**Setting up foundational image handling infrastructure** for Iraqi AI Chat System that supports secure image upload, culturally-compliant display, RTL-optimized galleries, Arabic metadata processing, and integration with Iraqi cultural validation services.

**Developers should be able to:** Upload images securely, display images in RTL layouts, process Arabic metadata, validate cultural appropriateness, optimize image delivery, create responsive galleries, and integrate with Supabase Storage.

---

## CORE FEATURES:

**Iraqi image upload and display infrastructure:**

### Secure Image Upload System
- **File Upload Handling:** Secure image upload with size and format validation
- **Supabase Storage Integration:** Direct integration with Supabase buckets for scalable image storage
- **Cultural Content Filtering:** Automatic filtering of culturally inappropriate images
- **Image Optimization:** Automatic image compression and format conversion
- **Upload Progress Tracking:** Real-time upload progress with Arabic/English status messages

### RTL-Optimized Image Display
- **RTL Image Galleries:** Right-to-left optimized image gallery layouts
- **Arabic Metadata Support:** Display of Arabic image captions, titles, and descriptions
- **Responsive Image Grids:** Mobile-first responsive image grids with RTL support
- **Next.js Image Optimization:** Advanced image optimization with lazy loading
- **Cultural Context Display:** Show culturally-relevant image information and tags

### Image Management Features
- **Image Categorization:** Organize images by Iraqi professional domains (legal, medical, educational)
- **Search and Filtering:** Arabic-enabled image search with cultural tag filtering
- **Batch Operations:** Multiple image selection and batch processing
- **Image Metadata Editing:** In-line editing of Arabic image descriptions and tags
- **Privacy Controls:** Image privacy settings with Islamic compliance options

### Professional Domain Integration
- **Legal Documents:** Support for legal document images with Iraqi court system formatting
- **Medical Images:** HIPAA-compliant medical image handling with Arabic annotations
- **Educational Resources:** Educational image management with Iraqi curriculum support
- **Business Documents:** Iraqi business document image handling with cultural validation
- **Identity Documents:** Secure handling of Iraqi identification documents with privacy protection

### Cultural Validation Integration
- **Islamic Compliance Checking:** Automatic validation of images against Islamic principles
- **Cultural Appropriateness Validation:** Integration with iraqi-cultural-validator for image content
- **Regional Adaptation:** Support for Baghdad, Basra, Mosul, Erbil cultural variations
- **Professional Ethics Compliance:** Ensure images comply with Iraqi professional standards
- **Content Moderation:** Automated moderation with cultural context awareness

---

## EXAMPLES TO INCLUDE:

**Iraqi image upload and display examples:**

### Secure Image Upload Component
```tsx
// components/ImageUpload.tsx
import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ImageUploadProps {
  onUploadComplete: (url: string, metadata: ImageMetadata) => void
  culturalValidation?: boolean
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business'
}

interface ImageMetadata {
  originalName: string
  arabicTitle?: string
  arabicDescription?: string
  culturalTags: string[]
  professionalDomain?: string
  uploadedAt: string
}

export default function ImageUpload({ 
  onUploadComplete, 
  culturalValidation = true,
  professionalDomain 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [culturalValidationStatus, setCulturalValidationStatus] = useState<string>()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setUploading(true)
    setUploadProgress(0)

    try {
      // Validate file size and type
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('حجم الملف كبير جداً. الحد الأقصى 10 ميجابايت / File too large. Maximum 10MB')
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('يجب أن يكون الملف صورة / File must be an image')
      }

      // Cultural validation if enabled
      if (culturalValidation) {
        setCulturalValidationStatus('جاري التحقق من الامتثال الثقافي... / Validating cultural compliance...')
        
        // Simulate cultural validation API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setCulturalValidationStatus('تم التحقق بنجاح / Validation successful')
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
      const filePath = professionalDomain 
        ? `${professionalDomain}/${fileName}`
        : `general/${fileName}`

      const { data, error } = await supabase.storage
        .from('iraqi-ai-images')
        .upload(filePath, file, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100)
          }
        })

      if (error) throw error

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('iraqi-ai-images')
        .getPublicUrl(filePath)

      // Create metadata
      const metadata: ImageMetadata = {
        originalName: file.name,
        culturalTags: ['approved'],
        professionalDomain,
        uploadedAt: new Date().toISOString()
      }

      onUploadComplete(publicUrl, metadata)

    } catch (error) {
      console.error('Upload error:', error)
      setCulturalValidationStatus(error.message)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [culturalValidation, professionalDomain, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    disabled: uploading
  })

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <Upload className="w-12 h-12 text-gray-400" />
          
          <div className="space-y-2">
            <p className="text-lg font-medium text-gray-900">
              اسحب الصورة هنا أو انقر للاختيار
            </p>
            <p className="text-sm text-gray-500">
              Drag image here or click to select
            </p>
          </div>

          <div className="text-xs text-gray-400">
            PNG, JPG, GIF حتى 10 ميجابايت / up to 10MB
          </div>
        </div>
      </div>

      {uploading && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>جاري الرفع... / Uploading...</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {culturalValidationStatus && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            {culturalValidationStatus.includes('successful') ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-blue-600" />
            )}
            <p className="text-sm text-blue-800">{culturalValidationStatus}</p>
          </div>
        </div>
      )}
    </div>
  )
}
```

### RTL Image Gallery Component
```tsx
// components/ImageGallery.tsx
import React, { useState } from 'react'
import Image from 'next/image'
import { Search, Filter, Grid, List, Eye } from 'lucide-react'

interface ImageItem {
  id: string
  url: string
  arabicTitle?: string
  arabicDescription?: string
  culturalTags: string[]
  professionalDomain?: string
  uploadedAt: string
}

interface ImageGalleryProps {
  images: ImageItem[]
  viewMode?: 'grid' | 'list'
  enableSearch?: boolean
  professionalDomain?: string
}

export default function ImageGallery({ 
  images, 
  viewMode = 'grid',
  enableSearch = true,
  professionalDomain 
}: ImageGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDomain, setSelectedDomain] = useState(professionalDomain || 'all')
  const [currentViewMode, setCurrentViewMode] = useState(viewMode)
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null)

  const filteredImages = images.filter(image => {
    const matchesSearch = !searchTerm || 
      image.arabicTitle?.includes(searchTerm) ||
      image.arabicDescription?.includes(searchTerm) ||
      image.culturalTags.some(tag => tag.includes(searchTerm))
    
    const matchesDomain = selectedDomain === 'all' || 
      image.professionalDomain === selectedDomain

    return matchesSearch && matchesDomain
  })

  return (
    <div className="w-full space-y-6">
      {/* Search and Filter Bar */}
      {enableSearch && (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="ابحث في الصور... / Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 rtl:pr-4 rtl:pl-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              dir="auto"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">جميع المجالات / All Domains</option>
              <option value="legal">قانوني / Legal</option>
              <option value="medical">طبي / Medical</option>
              <option value="educational">تعليمي / Educational</option>
              <option value="business">أعمال / Business</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setCurrentViewMode('grid')}
                className={`p-2 ${currentViewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentViewMode('list')}
                className={`p-2 ${currentViewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        {filteredImages.length} صور / images
      </div>

      {/* Image Gallery */}
      <div className={`
        ${currentViewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' 
          : 'space-y-4'
        }
      `}>
        {filteredImages.map((image) => (
          <div
            key={image.id}
            className={`
              bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer
              ${currentViewMode === 'list' ? 'flex items-center space-x-4 rtl:space-x-reverse p-4' : ''}
            `}
            onClick={() => setSelectedImage(image)}
          >
            <div className={`relative ${currentViewMode === 'list' ? 'w-24 h-24' : 'aspect-square'}`}>
              <Image
                src={image.url}
                alt={image.arabicTitle || 'صورة / Image'}
                fill
                className="object-cover"
              />
            </div>

            <div className={`p-4 ${currentViewMode === 'list' ? 'flex-1 p-0' : ''}`}>
              {image.arabicTitle && (
                <h3 className="font-medium text-gray-900 mb-2 line-clamp-2" dir="rtl">
                  {image.arabicTitle}
                </h3>
              )}
              
              {image.arabicDescription && (
                <p className="text-sm text-gray-600 line-clamp-3 mb-3" dir="rtl">
                  {image.arabicDescription}
                </p>
              )}

              <div className="flex flex-wrap gap-1 mb-2">
                {image.culturalTags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{image.professionalDomain}</span>
                <span>{new Date(image.uploadedAt).toLocaleDateString('ar-IQ')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Eye className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            لا توجد صور
          </h3>
          <p className="text-gray-600">
            لم يتم العثور على صور تطابق معايير البحث
          </p>
          <p className="text-gray-600 text-sm">
            No images found matching search criteria
          </p>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl max-h-full overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video">
              <Image
                src={selectedImage.url}
                alt={selectedImage.arabicTitle || 'صورة / Image'}
                fill
                className="object-contain"
              />
            </div>
            
            <div className="p-6">
              {selectedImage.arabicTitle && (
                <h2 className="text-xl font-bold text-gray-900 mb-2" dir="rtl">
                  {selectedImage.arabicTitle}
                </h2>
              )}
              
              {selectedImage.arabicDescription && (
                <p className="text-gray-700 mb-4" dir="rtl">
                  {selectedImage.arabicDescription}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                {selectedImage.culturalTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
```

### Supabase Storage Configuration
```sql
-- Supabase Storage Bucket Setup
CREATE POLICY "Iraqi AI Images Upload Policy" ON storage.objects
  FOR INSERT 
  WITH CHECK (bucket_id = 'iraqi-ai-images' AND auth.role() = 'authenticated');

CREATE POLICY "Iraqi AI Images View Policy" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'iraqi-ai-images');

-- Image Metadata Table
CREATE TABLE image_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  storage_path TEXT NOT NULL,
  original_name TEXT NOT NULL,
  arabic_title TEXT,
  arabic_description TEXT,
  cultural_tags TEXT[] DEFAULT '{}',
  professional_domain TEXT,
  cultural_validation_status TEXT DEFAULT 'pending',
  islamic_compliance_approved BOOLEAN DEFAULT false,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE image_metadata ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own images" ON image_metadata
  FOR SELECT USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can insert their own images" ON image_metadata
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own images" ON image_metadata
  FOR UPDATE USING (auth.uid() = uploaded_by);
```

### Cultural Validation Integration
```tsx
// lib/cultural-validation.ts
import { Task } from '@/lib/task-delegation'

interface ImageValidationResult {
  approved: boolean
  culturalScore: number
  islamicCompliance: boolean
  professionalAppropriateness: boolean
  recommendations: string[]
  arabicFeedback: string
  englishFeedback: string
}

export async function validateImageCulturally(
  imageUrl: string,
  professionalDomain?: string
): Promise<ImageValidationResult> {
  const task = new Task({
    subagent_type: 'iraqi-cultural-validator',
    description: 'Validate image cultural appropriateness',
    prompt: `
      Please validate this image for Iraqi cultural appropriateness:
      
      Image URL: ${imageUrl}
      Professional Domain: ${professionalDomain || 'general'}
      
      Check for:
      1. Islamic compliance (95%+ required)
      2. Iraqi cultural appropriateness (90%+ required)
      3. Professional domain suitability
      4. Content moderation requirements
      
      Provide validation results with Arabic and English feedback.
    `
  })

  const result = await task.execute()
  
  return {
    approved: result.culturalScore >= 90 && result.islamicCompliance,
    culturalScore: result.culturalScore,
    islamicCompliance: result.islamicCompliance,
    professionalAppropriateness: result.professionalScore >= 85,
    recommendations: result.recommendations || [],
    arabicFeedback: result.arabicFeedback || 'تم التحقق بنجاح',
    englishFeedback: result.englishFeedback || 'Validation successful'
  }
}

export async function processImageMetadata(
  imageFile: File,
  arabicTitle?: string,
  arabicDescription?: string
): Promise<any> {
  const task = new Task({
    subagent_type: 'arabic-rtl-processor',
    description: 'Process Arabic image metadata',
    prompt: `
      Process Arabic metadata for image:
      
      Original filename: ${imageFile.name}
      Arabic title: ${arabicTitle || ''}
      Arabic description: ${arabicDescription || ''}
      
      Generate:
      1. Cultural tags based on content
      2. RTL-optimized display formatting
      3. Professional domain classification
      4. SEO-friendly Arabic keywords
    `
  })

  return await task.execute()
}
```

---

## DOCUMENTATION TO RESEARCH:

**Image upload and display documentation:**

- **Next.js Image Component:** https://nextjs.org/docs/app/api-reference/components/image - Advanced image optimization
- **Supabase Storage:** https://supabase.com/docs/guides/storage - File storage and management
- **React Dropzone:** https://react-dropzone.js.org/ - File upload handling
- **Image Optimization:** https://web.dev/optimize-cls/ - Performance optimization patterns
- **RTL CSS:** https://rtlcss.com/ - Right-to-left styling patterns

---

## DEVELOPMENT PATTERNS:

**Iraqi image handling architecture patterns:**

### Secure Upload Architecture
- **Client-side Validation:** File type, size, and format validation before upload
- **Cultural Pre-screening:** Basic content validation using client-side heuristics
- **Progressive Upload:** Chunked upload with progress tracking and resume capability
- **Metadata Extraction:** EXIF data extraction with cultural tagging
- **Storage Organization:** Domain-based folder structure with Iraqi professional categories

### RTL Image Display Patterns
- **Responsive RTL Grids:** CSS Grid and Flexbox patterns optimized for RTL layouts
- **Arabic Typography Integration:** Arabic font loading and text rendering optimization
- **Cultural Context Display:** Professional domain indicators and cultural compliance badges
- **Bi-directional Search:** Arabic-English search capability with RTL input handling
- **Accessibility Compliance:** WCAG 2.1 AA compliance with Arabic screen reader support

### Performance Optimization Patterns
- **Image Lazy Loading:** Intersection Observer API for efficient image loading
- **Progressive Image Enhancement:** Low-quality placeholder with progressive enhancement
- **CDN Integration:** Supabase CDN optimization for global image delivery
- **Caching Strategies:** Browser and server-side caching for optimal performance
- **Mobile Optimization:** Responsive images with device-specific optimization

### Cultural Integration Patterns
- **Islamic Compliance Validation:** Automated content moderation with cultural context
- **Professional Domain Classification:** Automatic categorization based on Iraqi professional standards
- **Regional Adaptation:** Support for Baghdad, Basra, Mosul, Erbil cultural variations
- **Arabic Metadata Processing:** RTL text handling and cultural tag generation
- **Privacy and Modesty Compliance:** Content validation against Islamic modesty principles

---

## SECURITY & BEST PRACTICES:

**Image upload security considerations:**

- **File Type Validation:** Server-side MIME type verification and magic number validation
- **Content Scanning:** Malware scanning and cultural content validation
- **Size Limitations:** Progressive size limits based on user authentication and professional domain
- **Storage Security:** Encrypted storage with access control and audit logging

---

## COMMON GOTCHAS:

**Image handling development challenges:**

- **RTL Layout Issues:** Image alignment and caption positioning in RTL contexts
- **Arabic Font Loading:** FOUT/FOIT handling for Arabic typography
- **Mobile Performance:** Image optimization for low-bandwidth Iraqi mobile networks
- **Cultural Sensitivity:** Balancing automated validation with cultural nuance
- **Storage Costs:** Optimizing image storage and delivery costs for scale

---

## VALIDATION REQUIREMENTS:

**Iraqi image system validation:**

### Image Upload Testing
- **File Format Support:** Test PNG, JPG, GIF, WebP upload and processing
- **Size Validation:** Test file size limits and progressive upload functionality
- **Cultural Filtering:** Validate cultural appropriateness detection accuracy (95%+)
- **RTL Display:** Test image gallery RTL layout across devices and browsers
- **Arabic Metadata:** Validate Arabic text processing and display formatting

### Performance Testing
- **Upload Performance:** Measure upload speeds and progress tracking accuracy
- **Image Optimization:** Validate Next.js image optimization and lazy loading
- **Mobile Responsiveness:** Test responsive image galleries on various screen sizes
- **Search Functionality:** Test Arabic-English bi-directional search performance
- **Storage Integration:** Validate Supabase Storage bucket policies and access control

### Cultural Compliance Testing
- **Islamic Compliance:** Test image validation against Islamic principles (95%+ accuracy)
- **Professional Appropriateness:** Validate domain-specific image classification
- **Regional Variations:** Test cultural adaptation for different Iraqi regions
- **Content Moderation:** Validate automated content moderation accuracy
- **Privacy Protection:** Test privacy controls and Islamic modesty compliance

### Integration Testing
- **Multi-Agent Coordination:** Test integration with iraqi-cultural-validator and arabic-rtl-processor
- **Professional Domain Integration:** Validate domain-specific image handling workflows
- **User Authentication:** Test upload permissions and user-specific image management
- **Search and Filtering:** Validate advanced search and filtering capabilities
- **Batch Operations:** Test multiple image selection and bulk processing

---

## INTEGRATION FOCUS:

**Iraqi image system integration points:**

### Cultural Intelligence Integration
- **iraqi-cultural-validator Integration:** Seamless cultural validation pipeline for uploaded images
- **arabic-rtl-processor Integration:** Arabic metadata processing and RTL display optimization
- **Professional Domain Integration:** Domain-specific image categorization and validation workflows
- **Islamic Compliance Integration:** Automated Islamic principle compliance checking and validation

### Storage and Performance Integration
- **Supabase Storage Integration:** Direct integration with Supabase buckets and CDN optimization
- **Next.js Image Integration:** Advanced image optimization and lazy loading with cultural context
- **Mobile Optimization Integration:** Responsive image delivery optimized for Iraqi mobile networks
- **Caching Integration:** Multi-layer caching strategy for optimal performance and cost efficiency

### User Experience Integration
- **RTL Layout Integration:** Seamless RTL layout integration with existing Arabic UI components
- **Search Integration:** Integration with global Arabic-English search capabilities
- **Authentication Integration:** User-specific image management with professional domain permissions
- **Professional Workflow Integration:** Integration with Iraqi professional domain workflows and compliance requirements

---

## ADDITIONAL NOTES:

**Iraqi AI Chat System image considerations:**

- **Focus on cultural compliance** - Automated validation with Iraqi cultural context awareness
- **Emphasize RTL optimization** - Native RTL support for all image display and management interfaces
- **Plan for professional domains** - Domain-specific image handling for legal, medical, educational contexts
- **Keep Islamic principles central** - All image validation and display must respect Islamic principles and Iraqi cultural norms

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [ ] **Intermediate** - Production-ready patterns with common features  
- [x] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Advanced complexity selected** because this system requires sophisticated RTL image handling, cultural validation integration, professional domain management, and seamless integration with Iraqi AI agents for comprehensive image upload and display functionality.

---

**This initial provides comprehensive image upload and display capabilities for the Iraqi AI Chat System with RTL optimization, cultural validation, professional domain support, and seamless integration with Iraqi AI agents.**