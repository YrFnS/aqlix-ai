# Basic Speech Recognition (STT) for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Speech-to-Text (STT) processing** with Web Speech API, OpenAI Whisper, and Azure Cognitive Services, optimized for Iraqi Arabic dialects and multilingual recognition.

**Specific technologies:** Web Speech API, Whisper API, Azure Speech Services, real-time audio processing, dialect recognition, noise reduction, and cultural context understanding.

---

## TEMPLATE PURPOSE:

**Comprehensive speech recognition capabilities** for the Iraqi AI Chat System that accurately converts Iraqi speech patterns to text with dialect recognition and cultural context preservation.

**Developers should be able to:** Implement STT interfaces, configure dialect recognition, integrate noise reduction, handle real-time transcription, manage cultural validation, and support professional domain terminology.

---

## CORE FEATURES:

**Essential speech recognition infrastructure:**

- **Real-time Transcription:** Live audio-to-text conversion with streaming support
- **Iraqi Dialect Recognition:** Baghdad, Basra, Mosul, and regional dialect support
- **Multilingual Processing:** Arabic-English code-switching detection and handling
- **Professional Vocabulary:** Domain-specific terminology for legal, medical, educational contexts
- **Cultural Context Integration:** Islamic expressions and cultural phrases recognition
- **Noise Reduction:** Advanced audio preprocessing for clear transcription

---

## EXAMPLES TO INCLUDE:

**Working speech recognition examples:**

- **STT Component:** Real-time speech recognition with dialect selection
- **Audio Preprocessing:** Noise reduction and quality enhancement pipeline
- **Dialect Recognition:** Automatic Iraqi dialect detection and adaptation
- **Professional STT:** Domain-specific vocabulary and terminology recognition
- **Cultural Validation:** Recognition of Islamic expressions and cultural context
- **Multilingual Support:** Arabic-English code-switching handling

---

## DOCUMENTATION TO RESEARCH:

**Speech recognition documentation:**

- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API - Browser speech recognition
- **OpenAI Whisper:** https://openai.com/research/whisper - Advanced speech recognition model
- **Azure Speech:** https://docs.microsoft.com/en-us/azure/cognitive-services/speech-service/ - Cloud speech services
- **Google Speech-to-Text:** https://cloud.google.com/speech-to-text/docs - Google Cloud STT API
- **Arabic STT:** Specialized Arabic speech recognition techniques and models

---

## DEVELOPMENT PATTERNS:

**Speech recognition architecture patterns:**

- **Audio Pipeline:** Microphone input, preprocessing, recognition, post-processing
- **Dialect Management:** Dynamic dialect switching and recognition accuracy optimization
- **Real-time Processing:** Streaming audio with live transcription updates
- **Error Handling:** Network failures, audio quality issues, recognition errors
- **Performance Optimization:** Efficient audio processing and memory management
- **Cultural Integration:** Context-aware recognition with Islamic compliance

---

## SECURITY & BEST PRACTICES:

**Speech recognition security considerations:**

- **Privacy Protection:** Local processing vs cloud API privacy implications
- **Audio Data Security:** Encrypted transmission and secure storage policies
- **User Consent:** Clear permissions and data usage transparency
- **Cultural Compliance:** Screening for inappropriate content recognition
- **Professional Confidentiality:** Secure handling of sensitive domain conversations

---

## COMMON GOTCHAS:

**Speech recognition development challenges:**

- **Dialect Accuracy:** Iraqi dialect variations and recognition challenges
- **Background Noise:** Audio quality impact on transcription accuracy
- **Code-switching:** Arabic-English mixed speech recognition complexity
- **Browser Compatibility:** Web Speech API support variations across browsers
- **Network Dependency:** API availability and latency issues
- **Cultural Context Loss:** Maintaining meaning in dialect-to-standard conversion

---

## VALIDATION REQUIREMENTS:

**Speech recognition system validation:**

- **Accuracy Testing:** 85%+ recognition accuracy for Iraqi dialects
- **Dialect Coverage:** Support for major Iraqi regional variations
- **Performance Benchmarks:** Real-time processing with <500ms latency
- **Cultural Validation:** 95%+ preservation of Islamic expressions and cultural context
- **Professional Terminology:** 90%+ accuracy for domain-specific vocabulary

---

## INTEGRATION FOCUS:

**Speech recognition integration points:**

- **Chat Interface:** Voice input integration with text-based chat system
- **Voice Commands:** Connection to voice command processing (Initial 51)
- **Audio Recording:** Integration with audio recording system (Initial 52)
- **Cultural Validation:** Real-time cultural compliance checking during transcription

---

## ADDITIONAL NOTES:

**Iraqi AI Chat System speech recognition considerations:**

- **Focus on Iraqi dialects** - specialized support for Baghdad, Basra, Mosul variations
- **Islamic compliance integration** - respectful handling of religious expressions
- **Professional domain support** - legal, medical, educational terminology recognition
- **Real-time performance optimization** - <500ms latency for responsive interaction

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [x] **Intermediate** - Production-ready patterns with common features  
- [ ] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Intermediate complexity selected** because speech recognition requires audio processing expertise, dialect handling, and cultural validation integration while remaining accessible to developers.

---

## IMPLEMENTATION EXAMPLES:

### Speech Recognition Component

```tsx
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Task } from '@/lib/task-delegation'

interface SpeechRecognitionProps {
  onTranscription?: (text: string, confidence: number, dialect?: string) => void
  onError?: (error: STTError) => void
  enableDialectDetection?: boolean
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business'
  culturalValidation?: boolean
  realTimeProcessing?: boolean
  className?: string
}

interface STTResult {
  transcript: string
  confidence: number
  detectedDialect?: string
  culturalContext?: {
    islamicExpressions: string[]
    culturalPhrases: string[]
    validated: boolean
  }
  professionalTerms?: {
    domain: string
    terms: string[]
    accuracy: number
  }
}

interface STTError {
  code: 'NETWORK_ERROR' | 'AUDIO_ERROR' | 'PERMISSION_DENIED' | 'DIALECT_ERROR'
  message: string
  details?: any
}

export default function SpeechRecognition({
  onTranscription,
  onError,
  enableDialectDetection = true,
  professionalDomain,
  culturalValidation = true,
  realTimeProcessing = true,
  className
}: SpeechRecognitionProps) {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [selectedDialect, setSelectedDialect] = useState<string>('auto')
  const [recognitionResults, setRecognitionResults] = useState<STTResult[]>([])
  const [status, setStatus] = useState<string>('')
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  // Iraqi dialect options
  const dialectOptions = [
    { value: 'auto', label: 'تحديد تلقائي / Auto Detect', region: 'Iraq' },
    { value: 'baghdad', label: 'بغدادي / Baghdad', region: 'Central Iraq' },
    { value: 'basra', label: 'بصري / Basra', region: 'Southern Iraq' },
    { value: 'mosul', label: 'موصلي / Mosul', region: 'Northern Iraq' },
    { value: 'anbar', label: 'أنباري / Anbar', region: 'Western Iraq' },
    { value: 'najaf', label: 'نجفي / Najaf', region: 'Central-South Iraq' }
  ]

  // Initialize Web Speech API
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      
      recognition.continuous = realTimeProcessing
      recognition.interimResults = realTimeProcessing
      recognition.lang = 'ar-IQ' // Iraqi Arabic
      recognition.maxAlternatives = 3
      
      recognition.onstart = () => {
        setStatus('جاري الاستماع... / Listening...')
      }
      
      recognition.onresult = async (event) => {
        const lastResult = event.results[event.results.length - 1]
        const transcript = lastResult[0].transcript
        const confidence = lastResult[0].confidence
        
        setCurrentTranscript(transcript)
        
        if (lastResult.isFinal) {
          await processTranscription(transcript, confidence)
        }
      }
      
      recognition.onerror = (event) => {
        const error: STTError = {
          code: 'AUDIO_ERROR',
          message: `Speech recognition error: ${event.error}`,
          details: event
        }
        onError?.(error)
        setStatus('خطأ في التعرف على الصوت / Speech recognition error')
        setIsListening(false)
      }
      
      recognition.onend = () => {
        setIsListening(false)
        setStatus('توقف الاستماع / Stopped listening')
      }
      
      recognitionRef.current = recognition
    }
  }, [realTimeProcessing])

  // Process transcription with dialect detection and cultural validation
  const processTranscription = useCallback(async (
    transcript: string,
    confidence: number
  ): Promise<void> => {
    setIsProcessing(true)
    setStatus('معالجة النص المنطوق... / Processing transcription...')
    
    try {
      let result: STTResult = {
        transcript,
        confidence
      }

      // Dialect detection if enabled
      if (enableDialectDetection) {
        const dialectTask = new Task({
          subagent_type: 'arabic-rtl-processor',
          description: 'Detect Iraqi dialect in speech transcription',
          prompt: `Analyze this Iraqi Arabic transcription for dialect detection:
          
          Transcript: "${transcript}"
          Selected Dialect: ${selectedDialect}
          Professional Domain: ${professionalDomain || 'general'}
          
          Requirements:
          - Detect specific Iraqi dialect (Baghdad, Basra, Mosul, etc.)
          - Identify dialect-specific phrases and vocabulary
          - Provide confidence score for dialect detection
          - Note any mixed dialect usage
          
          Return dialect analysis with confidence metrics.`
        })
        
        const dialectResult = await dialectTask.execute()
        result.detectedDialect = dialectResult.dialect
        
        setStatus(`تم تحديد اللهجة: ${dialectResult.dialectName} / Dialect detected: ${dialectResult.dialectName}`)
      }

      // Cultural validation if enabled
      if (culturalValidation) {
        const culturalTask = new Task({
          subagent_type: 'iraqi-cultural-validator',
          description: 'Validate speech transcription for cultural context',
          prompt: `Validate this Iraqi speech transcription for cultural compliance:
          
          Transcript: "${transcript}"
          Detected Dialect: ${result.detectedDialect || 'unknown'}
          Professional Domain: ${professionalDomain || 'general'}
          
          Validation Requirements:
          - Identify Islamic expressions and religious phrases
          - Extract cultural context and meaningful phrases
          - Validate appropriateness for professional domain
          - Ensure respectful handling of religious content
          
          Return cultural validation results with context extraction.`
        })
        
        const culturalResult = await culturalTask.execute()
        result.culturalContext = {
          islamicExpressions: culturalResult.islamicExpressions || [],
          culturalPhrases: culturalResult.culturalPhrases || [],
          validated: culturalResult.culturallyAppropriate || false
        }
      }

      // Professional terminology processing
      if (professionalDomain) {
        const professionalTask = new Task({
          subagent_type: 'iraqi-professional-domain-expert',
          description: 'Process professional terminology in speech transcription',
          prompt: `Process this Iraqi speech transcription for professional terminology:
          
          Transcript: "${transcript}"
          Professional Domain: ${professionalDomain}
          Dialect: ${result.detectedDialect || 'general Iraqi'}
          
          Processing Requirements:
          - Extract domain-specific terminology
          - Validate professional accuracy
          - Provide alternative spellings or pronunciations
          - Calculate terminology accuracy score
          
          Return professional terminology analysis.`
        })
        
        const professionalResult = await professionalTask.execute()
        result.professionalTerms = {
          domain: professionalDomain,
          terms: professionalResult.extractedTerms || [],
          accuracy: professionalResult.accuracyScore || 0
        }
      }

      // Store result and trigger callback
      setRecognitionResults(prev => [...prev, result])
      onTranscription?.(result.transcript, result.confidence, result.detectedDialect)
      
      setStatus(`اكتمل التحليل - الثقة: ${Math.round(confidence * 100)}% / Analysis complete - Confidence: ${Math.round(confidence * 100)}%`)
    } catch (error) {
      console.error('Error processing transcription:', error)
      const sttError: STTError = {
        code: 'NETWORK_ERROR',
        message: 'Failed to process transcription',
        details: error
      }
      onError?.(sttError)
      setStatus('خطأ في معالجة النص / Processing error')
    } finally {
      setIsProcessing(false)
    }
  }, [enableDialectDetection, culturalValidation, professionalDomain, selectedDialect, onTranscription, onError])

  // Start speech recognition
  const startListening = useCallback(async () => {
    if (!recognitionRef.current) {
      const error: STTError = {
        code: 'AUDIO_ERROR',
        message: 'Speech recognition not supported in this browser',
        details: null
      }
      onError?.(error)
      return
    }

    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true })
      
      setIsListening(true)
      setCurrentTranscript('')
      setStatus('جاري بدء التعرف على الصوت... / Starting speech recognition...')
      
      recognitionRef.current.start()
    } catch (error) {
      const sttError: STTError = {
        code: 'PERMISSION_DENIED',
        message: 'Microphone permission denied',
        details: error
      }
      onError?.(sttError)
      setStatus('تم رفض إذن الميكروفون / Microphone permission denied')
    }
  }, [onError])

  // Stop speech recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }, [isListening])

  return (
    <div className={`speech-recognition ${className || ''}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>التعرف على الصوت / Speech Recognition</span>
            {professionalDomain && (
              <span className="text-sm text-muted-foreground">
                ({professionalDomain})
              </span>
            )}
          </CardTitle>
          {status && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              {status}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Dialect Selection */}
            {enableDialectDetection && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  اللهجة / Dialect
                </label>
                <Select value={selectedDialect} onValueChange={setSelectedDialect}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="اختر اللهجة / Select Dialect" />
                  </SelectTrigger>
                  <SelectContent>
                    {dialectOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.region}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Control Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={startListening}
                disabled={isListening || isProcessing}
                className={`flex-1 ${isListening 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isListening ? (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
                    جاري الاستماع... / Listening...
                  </>
                ) : (
                  'بدء التسجيل / Start Recording'
                )}
              </Button>
              
              {isListening && (
                <Button
                  onClick={stopListening}
                  variant="outline"
                  className="px-6"
                >
                  إيقاف / Stop
                </Button>
              )}
            </div>

            {/* Current Transcript */}
            {currentTranscript && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">النص الحالي / Current Transcript</h4>
                <div className="p-4 bg-gray-50 rounded-md border">
                  <p className="text-right font-arabic" dir="rtl">
                    {currentTranscript}
                  </p>
                  {isProcessing && (
                    <div className="flex items-center mt-2 text-sm text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      معالجة... / Processing...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recognition Results */}
            {recognitionResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">نتائج التعرف / Recognition Results</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recognitionResults.slice(-5).map((result, index) => (
                    <div key={index} className="p-4 bg-white border rounded-md shadow-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <p className="text-right font-arabic flex-1" dir="rtl">
                            {result.transcript}
                          </p>
                          <span className="text-xs text-muted-foreground ml-3">
                            {Math.round(result.confidence * 100)}% ثقة / confidence
                          </span>
                        </div>
                        
                        {result.detectedDialect && (
                          <div className="text-xs text-blue-600">
                            اللهجة المكتشفة / Detected: {result.detectedDialect}
                          </div>
                        )}
                        
                        {result.culturalContext?.islamicExpressions.length > 0 && (
                          <div className="text-xs text-green-600">
                            تعبيرات إسلامية / Islamic expressions: {result.culturalContext.islamicExpressions.join(', ')}
                          </div>
                        )}
                        
                        {result.professionalTerms?.terms.length > 0 && (
                          <div className="text-xs text-purple-600">
                            مصطلحات مهنية / Professional terms: {result.professionalTerms.terms.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Advanced STT Processor Service

```typescript
// lib/speech-recognition-service.ts
import { Task } from '@/lib/task-delegation'

export interface STTConfig {
  provider: 'web-speech' | 'whisper' | 'azure' | 'google'
  language: string
  dialect?: string
  enableProfanityFilter: boolean
  enablePunctuationInsertion: boolean
  enableDialectDetection: boolean
  culturalValidation: boolean
  professionalDomain?: string
}

export interface AudioProcessingOptions {
  sampleRate: number
  channels: number
  bitDepth: number
  noiseReduction: boolean
  echoCancellation: boolean
  automaticGainControl: boolean
}

export class AdvancedSTTProcessor {
  private config: STTConfig
  private audioContext: AudioContext | null = null
  private mediaStream: MediaStream | null = null
  private processor: ScriptProcessorNode | null = null

  constructor(config: STTConfig) {
    this.config = config
  }

  async initialize(): Promise<void> {
    try {
      // Initialize audio context for preprocessing
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Request microphone access with enhanced constraints
      const constraints: MediaStreamConstraints = {
        audio: {
          sampleRate: 48000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          googEchoCancellation: true,
          googAutoGainControl: true,
          googNoiseSuppression: true,
          googHighpassFilter: true,
          googTypingNoiseDetection: true
        }
      }

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      
      console.log('Advanced STT processor initialized successfully')
    } catch (error) {
      console.error('Failed to initialize STT processor:', error)
      throw new Error('STT initialization failed')
    }
  }

  async processAudioChunk(audioBlob: Blob): Promise<{
    transcript: string
    confidence: number
    metadata: STTMetadata
  }> {
    const startTime = performance.now()
    
    try {
      // Convert audio blob to appropriate format
      const audioBuffer = await this.preprocessAudio(audioBlob)
      
      // Select appropriate STT provider
      let result
      switch (this.config.provider) {
        case 'whisper':
          result = await this.processWithWhisper(audioBuffer)
          break
        case 'azure':
          result = await this.processWithAzure(audioBuffer)
          break
        case 'google':
          result = await this.processWithGoogle(audioBuffer)
          break
        default:
          result = await this.processWithWebSpeech(audioBuffer)
      }

      // Post-process with dialect detection and cultural validation
      const enhancedResult = await this.postProcessTranscript(
        result.transcript,
        result.confidence
      )

      const processingTime = performance.now() - startTime
      
      return {
        ...enhancedResult,
        metadata: {
          ...result.metadata,
          processingTime,
          provider: this.config.provider,
          dialect: this.config.dialect || 'auto'
        }
      }
    } catch (error) {
      console.error('Audio processing error:', error)
      throw error
    }
  }

  private async preprocessAudio(audioBlob: Blob): Promise<ArrayBuffer> {
    if (!this.audioContext) {
      throw new Error('Audio context not initialized')
    }

    const arrayBuffer = await audioBlob.arrayBuffer()
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
    
    // Apply noise reduction and enhancement
    const enhancedBuffer = await this.applyAudioEnhancements(audioBuffer)
    
    return this.audioBufferToArrayBuffer(enhancedBuffer)
  }

  private async applyAudioEnhancements(audioBuffer: AudioBuffer): Promise<AudioBuffer> {
    if (!this.audioContext) return audioBuffer

    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    )

    const source = offlineContext.createBufferSource()
    source.buffer = audioBuffer

    // Apply high-pass filter to remove low-frequency noise
    const highpass = offlineContext.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.setValueAtTime(80, offlineContext.currentTime)

    // Apply dynamic range compression
    const compressor = offlineContext.createDynamicsCompressor()
    compressor.threshold.setValueAtTime(-24, offlineContext.currentTime)
    compressor.knee.setValueAtTime(30, offlineContext.currentTime)
    compressor.ratio.setValueAtTime(12, offlineContext.currentTime)
    compressor.attack.setValueAtTime(0.003, offlineContext.currentTime)
    compressor.release.setValueAtTime(0.25, offlineContext.currentTime)

    // Connect audio graph
    source.connect(highpass)
    highpass.connect(compressor)
    compressor.connect(offlineContext.destination)

    source.start()
    return await offlineContext.startRendering()
  }

  private async processWithWhisper(audioBuffer: ArrayBuffer): Promise<{
    transcript: string
    confidence: number
    metadata: STTMetadata
  }> {
    const formData = new FormData()
    formData.append('file', new Blob([audioBuffer], { type: 'audio/wav' }))
    formData.append('model', 'whisper-1')
    formData.append('language', 'ar')
    formData.append('response_format', 'verbose_json')

    const response = await fetch('/api/speech/whisper', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`Whisper API error: ${response.statusText}`)
    }

    const result = await response.json()
    
    return {
      transcript: result.text,
      confidence: this.calculateWhisperConfidence(result),
      metadata: {
        provider: 'whisper',
        language: result.language,
        duration: result.duration,
        segments: result.segments?.length || 0
      }
    }
  }

  private async processWithAzure(audioBuffer: ArrayBuffer): Promise<{
    transcript: string
    confidence: number
    metadata: STTMetadata
  }> {
    // Azure Speech Services implementation
    const response = await fetch('/api/speech/azure', {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/wav',
        'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY!
      },
      body: audioBuffer
    })

    if (!response.ok) {
      throw new Error(`Azure Speech API error: ${response.statusText}`)
    }

    const result = await response.json()
    
    return {
      transcript: result.DisplayText,
      confidence: result.Confidence || 0.8,
      metadata: {
        provider: 'azure',
        recognitionStatus: result.RecognitionStatus,
        offset: result.Offset,
        duration: result.Duration
      }
    }
  }

  private async processWithGoogle(audioBuffer: ArrayBuffer): Promise<{
    transcript: string
    confidence: number
    metadata: STTMetadata
  }> {
    // Google Speech-to-Text implementation
    const response = await fetch('/api/speech/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: 'ar-IQ',
          alternativeLanguageCodes: ['ar', 'en-US'],
          enableAutomaticPunctuation: true,
          enableWordConfidence: true,
          model: 'latest_long'
        },
        audio: {
          content: Buffer.from(audioBuffer).toString('base64')
        }
      })
    })

    const result = await response.json()
    const alternative = result.results?.[0]?.alternatives?.[0]
    
    return {
      transcript: alternative?.transcript || '',
      confidence: alternative?.confidence || 0,
      metadata: {
        provider: 'google',
        wordCount: alternative?.words?.length || 0,
        languageCode: result.results?.[0]?.languageCode
      }
    }
  }

  private async processWithWebSpeech(audioBuffer: ArrayBuffer): Promise<{
    transcript: string
    confidence: number
    metadata: STTMetadata
  }> {
    // Web Speech API is handled differently as it's real-time
    // This is a placeholder for compatibility
    return {
      transcript: '',
      confidence: 0,
      metadata: {
        provider: 'web-speech',
        note: 'Web Speech API requires real-time processing'
      }
    }
  }

  private async postProcessTranscript(
    transcript: string,
    confidence: number
  ): Promise<{
    transcript: string
    confidence: number
    dialectInfo?: DialectInfo
    culturalContext?: CulturalContext
    professionalTerms?: string[]
  }> {
    const tasks = []
    
    // Dialect detection
    if (this.config.enableDialectDetection) {
      tasks.push(
        new Task({
          subagent_type: 'arabic-rtl-processor',
          description: 'Detect Iraqi dialect in transcription',
          prompt: `Analyze Iraqi dialect in: "${transcript}"`
        }).execute()
      )
    }
    
    // Cultural validation
    if (this.config.culturalValidation) {
      tasks.push(
        new Task({
          subagent_type: 'iraqi-cultural-validator',
          description: 'Validate cultural context in transcription',
          prompt: `Validate cultural content in: "${transcript}"`
        }).execute()
      )
    }

    // Professional terminology
    if (this.config.professionalDomain) {
      tasks.push(
        new Task({
          subagent_type: 'iraqi-professional-domain-expert',
          description: 'Extract professional terminology',
          prompt: `Extract ${this.config.professionalDomain} terms from: "${transcript}"`
        }).execute()
      )
    }

    const results = await Promise.all(tasks)
    
    return {
      transcript,
      confidence,
      dialectInfo: results[0]?.dialectInfo,
      culturalContext: results[1]?.culturalContext,
      professionalTerms: results[2]?.professionalTerms
    }
  }

  private calculateWhisperConfidence(result: any): number {
    // Calculate confidence from Whisper segments
    if (!result.segments || result.segments.length === 0) {
      return 0.8 // Default confidence
    }
    
    const avgLogProb = result.segments.reduce(
      (sum: number, segment: any) => sum + (segment.avg_logprob || 0),
      0
    ) / result.segments.length
    
    // Convert log probability to confidence score (0-1)
    return Math.exp(avgLogProb)
  }

  private audioBufferToArrayBuffer(audioBuffer: AudioBuffer): ArrayBuffer {
    const length = audioBuffer.length * audioBuffer.numberOfChannels * 2
    const arrayBuffer = new ArrayBuffer(length)
    const view = new Int16Array(arrayBuffer)
    
    let offset = 0
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel)
      for (let i = 0; i < channelData.length; i++) {
        view[offset++] = channelData[i] * 0x7FFF
      }
    }
    
    return arrayBuffer
  }

  async cleanup(): Promise<void> {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null
    }
    
    if (this.audioContext) {
      await this.audioContext.close()
      this.audioContext = null
    }
    
    if (this.processor) {
      this.processor.disconnect()
      this.processor = null
    }
  }
}

interface STTMetadata {
  provider: string
  processingTime?: number
  dialect?: string
  language?: string
  duration?: number
  segments?: number
  recognitionStatus?: string
  offset?: number
  wordCount?: number
  languageCode?: string
  note?: string
}

interface DialectInfo {
  detected: string
  confidence: number
  region: string
  characteristics: string[]
}

interface CulturalContext {
  islamicExpressions: string[]
  culturalPhrases: string[]
  validated: boolean
  issues: string[]
}
```

---

**This micro-initial provides comprehensive speech recognition capabilities specifically designed for Iraqi AI Chat System integration, with full Iraqi dialect support, cultural validation, and professional domain terminology recognition.**