# Audio Recording & Playback for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Audio recording and playback system** with MediaRecorder API, Web Audio API, and advanced audio processing, optimized for Iraqi Arabic voice messages and cultural audio content.

**Specific technologies:** MediaRecorder API, Web Audio API, audio visualization, waveform display, audio compression, cultural audio validation, and professional audio workflows.

---

## TEMPLATE PURPOSE:

**Comprehensive audio recording and playback capabilities** for the Iraqi AI Chat System that enables high-quality voice message recording, professional audio documentation, and culturally-appropriate audio content management.

**Developers should be able to:** Implement audio recording interfaces, manage playback controls, create waveform visualizations, integrate cultural validation, support professional audio workflows, and handle audio file management.

---

## CORE FEATURES:

**Essential audio recording and playback infrastructure:**

- **High-Quality Recording:** Professional audio recording with noise reduction
- **Real-time Visualization:** Waveform display and audio level monitoring
- **Cultural Audio Validation:** Islamic compliance checking for audio content
- **Professional Workflows:** Legal dictation, medical notes, educational recordings
- **Audio Processing:** Compression, filtering, and quality enhancement
- **Playback Controls:** Advanced media controls with speed and pitch adjustment

---

## EXAMPLES TO INCLUDE:

**Working audio recording and playback examples:**

- **Audio Recorder Component:** Recording interface with real-time waveform visualization
- **Audio Player:** Advanced playback controls with cultural context display
- **Voice Message System:** WhatsApp-style voice messaging with Iraqi cultural adaptation
- **Professional Recorder:** Domain-specific recording for legal, medical, educational use
- **Audio File Manager:** Cultural validation and metadata management
- **Accessibility Audio:** Screen reader integration and audio navigation

---

## DOCUMENTATION TO RESEARCH:

**Audio recording and playback documentation:**

- **MediaRecorder API:** https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder - Browser audio recording
- **Web Audio API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API - Advanced audio processing
- **AudioContext:** https://developer.mozilla.org/en-US/docs/Web/API/AudioContext - Audio processing context
- **WaveSurfer.js:** https://wavesurfer-js.org/ - Audio waveform visualization
- **RecordRTC:** https://recordrtc.org/ - WebRTC audio recording library

---

## DEVELOPMENT PATTERNS:

**Audio recording and playback architecture patterns:**

- **Recording Pipeline:** Microphone → Processing → Encoding → Storage → Validation
- **Playback Management:** File loading, buffering, streaming, visualization
- **Audio Processing:** Real-time filtering, enhancement, compression
- **State Management:** Recording states, playback controls, error handling
- **Cultural Integration:** Content validation and metadata management
- **Performance Optimization:** Memory management, streaming, caching

---

## SECURITY & BEST PRACTICES:

**Audio recording security considerations:**

- **Privacy Protection:** User consent, data encryption, secure storage
- **Cultural Compliance:** Inappropriate content detection and filtering
- **File Security:** Virus scanning, format validation, size limits
- **Professional Confidentiality:** Secure handling of sensitive audio content
- **Access Control:** Role-based permissions for audio content management

---

## COMMON GOTCHAS:

**Audio recording development challenges:**

- **Browser Compatibility:** MediaRecorder support variations across browsers
- **Audio Quality:** Background noise, microphone quality, encoding settings
- **File Size Management:** Compression vs quality trade-offs
- **Real-time Processing:** Performance impact of visualization and filters
- **Cultural Context Preservation:** Maintaining meaning in audio transcription
- **Memory Management:** Large audio file handling and cleanup

---

## VALIDATION REQUIREMENTS:

**Audio recording system validation:**

- **Recording Quality:** Clear audio with minimal noise and distortion
- **Cultural Validation:** 95%+ screening for inappropriate content
- **Performance Benchmarks:** Real-time recording with <100ms latency
- **File Management:** Secure storage and reliable playback
- **Professional Standards:** Domain-specific audio quality requirements

---

## INTEGRATION FOCUS:

**Audio recording integration points:**

- **Speech Recognition:** Integration with STT system for transcription (Initial 49)
- **Voice Commands:** Audio feedback and command recording (Initial 51)
- **Text-to-Speech:** TTS audio playback integration (Initial 50)
- **Chat Interface:** Voice message integration with text-based chat

---

## ADDITIONAL NOTES:

**Iraqi AI Chat System audio considerations:**

- **Focus on prayer time audio** - Islamic call to prayer and religious audio content
- **Professional domain support** - legal dictation, medical notes, educational recordings
- **Cultural validation integration** - real-time Islamic compliance checking
- **Accessibility first approach** - comprehensive audio navigation and screen reader support

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [x] **Intermediate** - Production-ready patterns with common features  
- [ ] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Intermediate complexity selected** because audio recording requires MediaRecorder expertise, audio processing knowledge, and cultural validation integration while remaining accessible to developers.

---

## IMPLEMENTATION EXAMPLES:

### Audio Recording & Playback Component

```tsx
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Task } from '@/lib/task-delegation'

interface AudioRecorderPlaybackProps {
  onRecordingComplete?: (audio: RecordedAudio) => void
  onPlaybackEvent?: (event: PlaybackEvent) => void
  enableCulturalValidation?: boolean
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business'
  enableVisualization?: boolean
  maxDuration?: number // seconds
  quality?: 'low' | 'medium' | 'high' | 'professional'
  className?: string
}

interface RecordedAudio {
  id: string
  blob: Blob
  duration: number
  size: number
  format: string
  timestamp: number
  culturalValidation?: CulturalAudioValidation
  professionalMetadata?: ProfessionalAudioMetadata
  waveformData?: Float32Array
}

interface PlaybackEvent {
  type: 'play' | 'pause' | 'stop' | 'seek' | 'end' | 'error'
  currentTime: number
  duration: number
  audioId?: string
}

interface CulturalAudioValidation {
  status: 'validated' | 'warning' | 'rejected'
  islamicContent: boolean
  culturalAppropriate: boolean
  issues: string[]
  recommendations: string[]
}

interface ProfessionalAudioMetadata {
  domain: string
  category: string
  confidential: boolean
  transcriptionRequired: boolean
  qualityScore: number
}

export default function AudioRecorderPlayback({
  onRecordingComplete,
  onPlaybackEvent,
  enableCulturalValidation = true,
  professionalDomain,
  enableVisualization = true,
  maxDuration = 300, // 5 minutes default
  quality = 'high',
  className
}: AudioRecorderPlaybackProps) {
  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [volume, setVolume] = useState(1.0)
  
  // Audio data
  const [recordings, setRecordings] = useState<RecordedAudio[]>([])
  const [currentAudio, setCurrentAudio] = useState<RecordedAudio | null>(null)
  const [waveformData, setWaveformData] = useState<Float32Array | null>(null)
  const [status, setStatus] = useState<string>('')

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const chunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const playbackTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Audio quality settings
  const qualitySettings = {
    low: { bitRate: 32000, sampleRate: 22050 },
    medium: { bitRate: 64000, sampleRate: 44100 },
    high: { bitRate: 128000, sampleRate: 48000 },
    professional: { bitRate: 256000, sampleRate: 48000 }
  }

  // Initialize audio system
  useEffect(() => {
    const initializeAudio = async () => {
      try {
        // Create audio context for visualization
        if (enableVisualization && !audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
        }
      } catch (error) {
        console.error('Audio initialization error:', error)
      }
    }

    initializeAudio()

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [enableVisualization])

  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setStatus('طلب إذن الميكروفون... / Requesting microphone permission...')
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: qualitySettings[quality].sampleRate,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm; codecs=opus',
        audioBitsPerSecond: qualitySettings[quality].bitRate
      })

      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      // Setup audio visualization
      if (enableVisualization && audioContextRef.current) {
        const source = audioContextRef.current.createMediaStreamSource(stream)
        const analyser = audioContextRef.current.createAnalyser()
        analyser.fftSize = 256
        source.connect(analyser)
        analyserRef.current = analyser

        // Start audio level monitoring
        const monitorAudioLevel = () => {
          if (analyserRef.current && isRecording) {
            const bufferLength = analyserRef.current.frequencyBinCount
            const dataArray = new Uint8Array(bufferLength)
            analyserRef.current.getByteFrequencyData(dataArray)
            
            const average = dataArray.reduce((sum, value) => sum + value) / bufferLength
            setAudioLevel(average / 255 * 100)
            
            requestAnimationFrame(monitorAudioLevel)
          }
        }
        monitorAudioLevel()
      }

      // MediaRecorder event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        setIsProcessing(true)
        setStatus('معالجة التسجيل... / Processing recording...')
        
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm; codecs=opus' })
        const audioUrl = URL.createObjectURL(audioBlob)
        
        // Calculate duration
        const audio = new Audio(audioUrl)
        await new Promise((resolve) => {
          audio.addEventListener('loadedmetadata', resolve, { once: true })
        })
        const audioDuration = audio.duration

        // Generate waveform data
        let waveform: Float32Array | undefined
        if (enableVisualization) {
          waveform = await generateWaveform(audioBlob)
        }

        const recordedAudio: RecordedAudio = {
          id: `audio_${Date.now()}`,
          blob: audioBlob,
          duration: audioDuration,
          size: audioBlob.size,
          format: 'webm',
          timestamp: Date.now(),
          waveformData: waveform
        }

        // Cultural validation if enabled
        if (enableCulturalValidation) {
          recordedAudio.culturalValidation = await validateAudioCulturally(recordedAudio)
        }

        // Professional metadata if domain specified
        if (professionalDomain) {
          recordedAudio.professionalMetadata = await generateProfessionalMetadata(
            recordedAudio,
            professionalDomain
          )
        }

        setRecordings(prev => [...prev, recordedAudio])
        setCurrentAudio(recordedAudio)
        onRecordingComplete?.(recordedAudio)
        setIsProcessing(false)
        setStatus(`تم التسجيل بنجاح - المدة: ${Math.round(audioDuration)}s / Recording completed - Duration: ${Math.round(audioDuration)}s`)
        
        // Cleanup
        stream.getTracks().forEach(track => track.stop())
        URL.revokeObjectURL(audioUrl)
      }

      // Start recording
      mediaRecorder.start(100) // Collect data every 100ms
      setIsRecording(true)
      setRecordingTime(0)
      setStatus('جاري التسجيل... / Recording...')

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxDuration) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)

    } catch (error) {
      console.error('Recording error:', error)
      setStatus('خطأ في بدء التسجيل / Recording start error')
    }
  }, [quality, enableVisualization, isRecording, maxDuration, enableCulturalValidation, professionalDomain, onRecordingComplete])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setAudioLevel(0)
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
    }
  }, [isRecording])

  // Play audio
  const playAudio = useCallback((audio: RecordedAudio) => {
    if (!audioRef.current) return

    const audioUrl = URL.createObjectURL(audio.blob)
    audioRef.current.src = audioUrl
    audioRef.current.playbackRate = playbackRate
    audioRef.current.volume = volume

    audioRef.current.play()
    setIsPlaying(true)
    setCurrentAudio(audio)
    setStatus(`تشغيل الصوت... / Playing audio...`)

    // Start playback timer
    playbackTimerRef.current = setInterval(() => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
        onPlaybackEvent?.({
          type: 'play',
          currentTime: audioRef.current.currentTime,
          duration: audioRef.current.duration,
          audioId: audio.id
        })
      }
    }, 100)

    // Cleanup URL after playback
    audioRef.current.onended = () => {
      setIsPlaying(false)
      setCurrentTime(0)
      setStatus('انتهى التشغيل / Playback ended')
      URL.revokeObjectURL(audioUrl)
      
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current)
        playbackTimerRef.current = null
      }

      onPlaybackEvent?.({
        type: 'end',
        currentTime: 0,
        duration: audio.duration,
        audioId: audio.id
      })
    }
  }, [playbackRate, volume, onPlaybackEvent])

  // Pause audio
  const pauseAudio = useCallback(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
      setStatus('تم إيقاف التشغيل مؤقتاً / Playback paused')
      
      if (playbackTimerRef.current) {
        clearInterval(playbackTimerRef.current)
        playbackTimerRef.current = null
      }

      onPlaybackEvent?.({
        type: 'pause',
        currentTime: currentTime,
        duration: duration,
        audioId: currentAudio?.id
      })
    }
  }, [isPlaying, currentTime, duration, currentAudio, onPlaybackEvent])

  // Generate waveform data
  const generateWaveform = useCallback(async (audioBlob: Blob): Promise<Float32Array> => {
    if (!audioContextRef.current) {
      return new Float32Array(0)
    }

    const arrayBuffer = await audioBlob.arrayBuffer()
    const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer)
    
    // Downsample for visualization
    const samples = 1000
    const blockSize = Math.floor(audioBuffer.length / samples)
    const waveform = new Float32Array(samples)
    const channelData = audioBuffer.getChannelData(0)

    for (let i = 0; i < samples; i++) {
      let sum = 0
      for (let j = 0; j < blockSize; j++) {
        sum += Math.abs(channelData[i * blockSize + j] || 0)
      }
      waveform[i] = sum / blockSize
    }

    setWaveformData(waveform)
    return waveform
  }, [])

  // Validate audio culturally
  const validateAudioCulturally = useCallback(async (
    audio: RecordedAudio
  ): Promise<CulturalAudioValidation> => {
    try {
      setStatus('التحقق الثقافي من الصوت... / Validating audio culturally...')
      
      const task = new Task({
        subagent_type: 'iraqi-cultural-validator',
        description: 'Validate recorded audio for cultural compliance',
        prompt: `Validate this recorded audio for Iraqi cultural compliance:
        
        Audio Duration: ${audio.duration} seconds
        Audio Size: ${audio.size} bytes
        Recording Context: ${professionalDomain || 'general'}
        
        Validation Requirements:
        - Check for Islamic content and expressions
        - Verify cultural appropriateness for Iraqi context
        - Screen for inappropriate content
        - Validate professional domain suitability
        
        Return cultural validation assessment.`
      })

      const result = await task.execute()
      
      return {
        status: result.culturallyAppropriate ? 'validated' : 'warning',
        islamicContent: result.containsIslamicContent || false,
        culturalAppropriate: result.culturallyAppropriate || false,
        issues: result.culturalIssues || [],
        recommendations: result.recommendations || []
      }
    } catch (error) {
      console.error('Cultural validation error:', error)
      return {
        status: 'warning',
        islamicContent: false,
        culturalAppropriate: true,
        issues: ['Validation failed'],
        recommendations: ['Manual review recommended']
      }
    }
  }, [professionalDomain])

  // Generate professional metadata
  const generateProfessionalMetadata = useCallback(async (
    audio: RecordedAudio,
    domain: string
  ): Promise<ProfessionalAudioMetadata> => {
    try {
      const task = new Task({
        subagent_type: 'iraqi-professional-domain-expert',
        description: 'Generate professional metadata for recorded audio',
        prompt: `Generate professional metadata for this audio recording:
        
        Audio Duration: ${audio.duration} seconds
        Professional Domain: ${domain}
        Recording Quality: ${quality}
        
        Metadata Requirements:
        - Classify recording category within domain
        - Assess confidentiality requirements
        - Determine transcription needs
        - Calculate quality score
        
        Return professional audio metadata.`
      })

      const result = await task.execute()
      
      return {
        domain,
        category: result.category || 'general',
        confidential: result.confidential || false,
        transcriptionRequired: result.transcriptionRequired || false,
        qualityScore: result.qualityScore || 0.8
      }
    } catch (error) {
      console.error('Professional metadata error:', error)
      return {
        domain,
        category: 'general',
        confidential: false,
        transcriptionRequired: false,
        qualityScore: 0.8
      }
    }
  }, [quality])

  // Format time display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  return (
    <div className={`audio-recorder-playback ${className || ''}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>تسجيل وتشغيل الصوت / Audio Recording & Playback</span>
            {professionalDomain && (
              <Badge variant="outline">{professionalDomain}</Badge>
            )}
            <Badge variant="secondary">{quality}</Badge>
          </CardTitle>
          {status && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              {status}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Recording Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={isProcessing}
                  className={`${isRecording 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-green-600 hover:bg-green-700'
                  } min-w-[140px]`}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      معالجة... / Processing...
                    </>
                  ) : isRecording ? (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2" />
                      إيقاف التسجيل / Stop Recording
                    </>
                  ) : (
                    'بدء التسجيل / Start Recording'
                  )}
                </Button>

                {isRecording && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono">
                      {formatTime(recordingTime)} / {formatTime(maxDuration)}
                    </span>
                    <Progress 
                      value={(recordingTime / maxDuration) * 100} 
                      className="w-32"
                    />
                  </div>
                )}
              </div>

              {/* Audio Level Indicator */}
              {isRecording && enableVisualization && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    مستوى الصوت / Audio Level
                  </label>
                  <Progress value={audioLevel} className="w-full h-2" />
                </div>
              )}
            </div>

            {/* Waveform Visualization */}
            {waveformData && enableVisualization && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  موجة الصوت / Waveform
                </label>
                <div className="h-24 bg-gray-50 rounded border flex items-center justify-center">
                  <svg width="100%" height="80" className="overflow-hidden">
                    {Array.from(waveformData).map((amplitude, index) => (
                      <rect
                        key={index}
                        x={index * (100 / waveformData.length) + '%'}
                        y={40 - amplitude * 40}
                        width={100 / waveformData.length + '%'}
                        height={amplitude * 80}
                        fill="#3b82f6"
                        opacity="0.7"
                      />
                    ))}
                  </svg>
                </div>
              </div>
            )}

            {/* Playback Controls */}
            {currentAudio && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => isPlaying ? pauseAudio() : playAudio(currentAudio)}
                    variant="outline"
                  >
                    {isPlaying ? 'إيقاف مؤقت / Pause' : 'تشغيل / Play'}
                  </Button>
                  
                  <span className="text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(currentAudio.duration)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      السرعة / Playback Speed: {playbackRate}x
                    </label>
                    <Slider
                      value={[playbackRate]}
                      onValueChange={(value) => setPlaybackRate(value[0])}
                      min={0.5}
                      max={2.0}
                      step={0.1}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      مستوى الصوت / Volume: {Math.round(volume * 100)}%
                    </label>
                    <Slider
                      value={[volume]}
                      onValueChange={(value) => setVolume(value[0])}
                      min={0}
                      max={1}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Recording List */}
            {recordings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">التسجيلات / Recordings</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {recordings.slice(-5).reverse().map((recording) => (
                    <div
                      key={recording.id}
                      className="flex items-center justify-between p-3 bg-white border rounded-md"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {formatTime(recording.duration)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {(recording.size / 1024).toFixed(1)} KB
                          </span>
                          
                          {recording.culturalValidation && (
                            <Badge 
                              variant={
                                recording.culturalValidation.status === 'validated' 
                                  ? 'default' 
                                  : 'destructive'
                              }
                              className="text-xs"
                            >
                              {recording.culturalValidation.status}
                            </Badge>
                          )}

                          {recording.professionalMetadata && (
                            <Badge variant="outline" className="text-xs">
                              {recording.professionalMetadata.category}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {new Date(recording.timestamp).toLocaleString('ar-IQ')}
                        </div>
                      </div>

                      <Button
                        onClick={() => playAudio(recording)}
                        size="sm"
                        variant="outline"
                      >
                        تشغيل / Play
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audio Element for Playback */}
            <audio ref={audioRef} preload="none" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Advanced Audio Processing Service

```typescript
// lib/audio-processing-service.ts
import { Task } from '@/lib/task-delegation'

export interface AudioProcessingOptions {
  sampleRate: number
  channels: number
  bitRate: number
  format: 'webm' | 'mp3' | 'wav' | 'ogg'
  noiseReduction: boolean
  echoCancellation: boolean
  automaticGainControl: boolean
  culturalValidation: boolean
  professionalDomain?: string
}

export class AdvancedAudioProcessor {
  private audioContext: AudioContext | null = null
  private mediaRecorder: MediaRecorder | null = null
  private mediaStream: MediaStream | null = null
  private processingChain: AudioNode[] = []

  constructor(private options: AudioProcessingOptions) {
    this.initializeAudioContext()
  }

  private async initializeAudioContext(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: this.options.sampleRate
      })
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error)
    }
  }

  async startRecording(): Promise<MediaRecorder> {
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized')
    }

    // Request microphone access
    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: this.options.sampleRate,
        channelCount: this.options.channels,
        echoCancellation: this.options.echoCancellation,
        noiseSuppression: this.options.noiseReduction,
        autoGainControl: this.options.automaticGainControl,
        googEchoCancellation: this.options.echoCancellation,
        googNoiseSuppression: this.options.noiseReduction,
        googAutoGainControl: this.options.automaticGainControl
      }
    })

    // Create audio processing chain
    await this.createProcessingChain(this.mediaStream)

    // Create MediaRecorder with processed stream
    this.mediaRecorder = new MediaRecorder(this.mediaStream, {
      mimeType: this.getMimeType(),
      audioBitsPerSecond: this.options.bitRate
    })

    return this.mediaRecorder
  }

  private async createProcessingChain(stream: MediaStream): Promise<void> {
    if (!this.audioContext) return

    const source = this.audioContext.createMediaStreamSource(stream)
    let currentNode: AudioNode = source

    // Add noise gate
    if (this.options.noiseReduction) {
      const noiseGate = await this.createNoiseGate()
      currentNode.connect(noiseGate)
      currentNode = noiseGate
      this.processingChain.push(noiseGate)
    }

    // Add compressor for dynamic range
    const compressor = this.audioContext.createDynamicsCompressor()
    compressor.threshold.setValueAtTime(-24, this.audioContext.currentTime)
    compressor.knee.setValueAtTime(30, this.audioContext.currentTime)
    compressor.ratio.setValueAtTime(12, this.audioContext.currentTime)
    compressor.attack.setValueAtTime(0.003, this.audioContext.currentTime)
    compressor.release.setValueAtTime(0.25, this.audioContext.currentTime)
    
    currentNode.connect(compressor)
    currentNode = compressor
    this.processingChain.push(compressor)

    // Add high-pass filter to remove low-frequency noise
    const highpass = this.audioContext.createBiquadFilter()
    highpass.type = 'highpass'
    highpass.frequency.setValueAtTime(80, this.audioContext.currentTime)
    
    currentNode.connect(highpass)
    currentNode = highpass
    this.processingChain.push(highpass)

    // Create destination for processed audio
    const destination = this.audioContext.createMediaStreamDestination()
    currentNode.connect(destination)

    // Replace original stream with processed one
    this.mediaStream = destination.stream
  }

  private async createNoiseGate(): Promise<GainNode> {
    if (!this.audioContext) throw new Error('AudioContext not available')

    const gainNode = this.audioContext.createGain()
    const analyser = this.audioContext.createAnalyser()
    
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    // Simple noise gate implementation
    const checkAudioLevel = () => {
      analyser.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((sum, value) => sum + value) / bufferLength
      
      // Gate threshold - adjust based on ambient noise
      const threshold = 20
      const gateValue = average > threshold ? 1 : 0.1
      
      gainNode.gain.setValueAtTime(gateValue, this.audioContext!.currentTime)
      
      requestAnimationFrame(checkAudioLevel)
    }
    
    checkAudioLevel()
    return gainNode
  }

  async processRecordedAudio(audioBlob: Blob): Promise<{
    processedBlob: Blob
    metadata: AudioMetadata
    culturalValidation?: CulturalAudioValidation
  }> {
    // Convert to audio buffer for processing
    const arrayBuffer = await audioBlob.arrayBuffer()
    
    if (!this.audioContext) {
      throw new Error('AudioContext not initialized')
    }

    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer)
    
    // Apply post-processing
    const processedBuffer = await this.applyPostProcessing(audioBuffer)
    
    // Convert back to blob
    const processedBlob = await this.audioBufferToBlob(processedBuffer)
    
    // Generate metadata
    const metadata = await this.generateAudioMetadata(processedBuffer)
    
    // Cultural validation if enabled
    let culturalValidation: CulturalAudioValidation | undefined
    if (this.options.culturalValidation) {
      culturalValidation = await this.validateAudioCulturally(processedBlob, metadata)
    }

    return {
      processedBlob,
      metadata,
      culturalValidation
    }
  }

  private async applyPostProcessing(audioBuffer: AudioBuffer): Promise<AudioBuffer> {
    if (!this.audioContext) return audioBuffer

    const offlineContext = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    )

    const source = offlineContext.createBufferSource()
    source.buffer = audioBuffer

    // Apply normalization
    const normalizedBuffer = this.normalizeAudio(audioBuffer)
    source.buffer = normalizedBuffer

    // Apply final EQ
    const lowShelf = offlineContext.createBiquadFilter()
    lowShelf.type = 'lowshelf'
    lowShelf.frequency.setValueAtTime(320, offlineContext.currentTime)
    lowShelf.gain.setValueAtTime(-3, offlineContext.currentTime)

    const highShelf = offlineContext.createBiquadFilter()
    highShelf.type = 'highshelf'
    highShelf.frequency.setValueAtTime(3200, offlineContext.currentTime)
    highShelf.gain.setValueAtTime(-2, offlineContext.currentTime)

    // Connect processing chain
    source.connect(lowShelf)
    lowShelf.connect(highShelf)
    highShelf.connect(offlineContext.destination)

    source.start()
    return await offlineContext.startRendering()
  }

  private normalizeAudio(audioBuffer: AudioBuffer): AudioBuffer {
    const normalizedBuffer = audioBuffer.getAudioContext().createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    )

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel)
      const outputData = normalizedBuffer.getChannelData(channel)

      // Find peak amplitude
      let peak = 0
      for (let i = 0; i < inputData.length; i++) {
        peak = Math.max(peak, Math.abs(inputData[i]))
      }

      // Normalize to prevent clipping (leave some headroom)
      const normalizeRatio = peak > 0 ? 0.95 / peak : 1
      
      for (let i = 0; i < inputData.length; i++) {
        outputData[i] = inputData[i] * normalizeRatio
      }
    }

    return normalizedBuffer
  }

  private async audioBufferToBlob(audioBuffer: AudioBuffer): Promise<Blob> {
    // Convert AudioBuffer to WAV format
    const length = audioBuffer.length
    const channels = audioBuffer.numberOfChannels
    const sampleRate = audioBuffer.sampleRate
    const bytesPerSample = 2
    const blockAlign = channels * bytesPerSample
    const byteRate = sampleRate * blockAlign
    const dataSize = length * blockAlign
    const bufferSize = 44 + dataSize

    const arrayBuffer = new ArrayBuffer(bufferSize)
    const view = new DataView(arrayBuffer)

    // WAV file header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }

    writeString(0, 'RIFF')
    view.setUint32(4, bufferSize - 8, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, channels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, byteRate, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, dataSize, true)

    // Convert float samples to 16-bit PCM
    let offset = 44
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < channels; channel++) {
        const sample = Math.max(-1, Math.min(1, audioBuffer.getChannelData(channel)[i]))
        view.setInt16(offset, sample * 0x7FFF, true)
        offset += 2
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' })
  }

  private async generateAudioMetadata(audioBuffer: AudioBuffer): Promise<AudioMetadata> {
    const duration = audioBuffer.duration
    const sampleRate = audioBuffer.sampleRate
    const channels = audioBuffer.numberOfChannels

    // Calculate RMS level for quality assessment
    let rmsSum = 0
    const channelData = audioBuffer.getChannelData(0)
    for (let i = 0; i < channelData.length; i++) {
      rmsSum += channelData[i] * channelData[i]
    }
    const rmsLevel = Math.sqrt(rmsSum / channelData.length)

    // Calculate dynamic range
    let min = Infinity, max = -Infinity
    for (let i = 0; i < channelData.length; i++) {
      min = Math.min(min, channelData[i])
      max = Math.max(max, channelData[i])
    }
    const dynamicRange = max - min

    return {
      duration,
      sampleRate,
      channels,
      bitDepth: 16,
      rmsLevel,
      dynamicRange,
      qualityScore: this.calculateQualityScore(rmsLevel, dynamicRange),
      processingApplied: this.processingChain.map(node => node.constructor.name)
    }
  }

  private calculateQualityScore(rmsLevel: number, dynamicRange: number): number {
    // Simple quality scoring based on audio characteristics
    const rmsScore = Math.min(1, rmsLevel / 0.3) // Good RMS around 0.3
    const dynamicScore = Math.min(1, dynamicRange / 1.5) // Good dynamic range around 1.5
    
    return (rmsScore + dynamicScore) / 2
  }

  private async validateAudioCulturally(
    audioBlob: Blob,
    metadata: AudioMetadata
  ): Promise<CulturalAudioValidation> {
    try {
      const task = new Task({
        subagent_type: 'iraqi-cultural-validator',
        description: 'Validate processed audio for cultural compliance',
        prompt: `Validate this processed audio for Iraqi cultural compliance:
        
        Audio Metadata:
        - Duration: ${metadata.duration} seconds
        - Quality Score: ${metadata.qualityScore}
        - Professional Domain: ${this.options.professionalDomain || 'general'}
        
        Validation Requirements:
        - Check for Islamic content appropriateness
        - Verify cultural sensitivity compliance
        - Screen for inappropriate audio content
        - Assess professional domain suitability
        
        Return detailed cultural validation results.`
      })

      const result = await task.execute()
      
      return {
        status: result.culturallyAppropriate ? 'validated' : 'warning',
        islamicContent: result.containsIslamicContent || false,
        culturalAppropriate: result.culturallyAppropriate || false,
        issues: result.issues || [],
        recommendations: result.recommendations || []
      }
    } catch (error) {
      console.error('Cultural validation error:', error)
      return {
        status: 'warning',
        islamicContent: false,
        culturalAppropriate: true,
        issues: ['Validation service unavailable'],
        recommendations: ['Manual review recommended']
      }
    }
  }

  private getMimeType(): string {
    switch (this.options.format) {
      case 'webm':
        return 'audio/webm; codecs=opus'
      case 'mp3':
        return 'audio/mp3'
      case 'wav':
        return 'audio/wav'
      case 'ogg':
        return 'audio/ogg; codecs=vorbis'
      default:
        return 'audio/webm; codecs=opus'
    }
  }

  async cleanup(): Promise<void> {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
      this.mediaStream = null
    }

    if (this.mediaRecorder) {
      this.mediaRecorder = null
    }

    if (this.audioContext) {
      await this.audioContext.close()
      this.audioContext = null
    }

    this.processingChain = []
  }
}

interface AudioMetadata {
  duration: number
  sampleRate: number
  channels: number
  bitDepth: number
  rmsLevel: number
  dynamicRange: number
  qualityScore: number
  processingApplied: string[]
}
```

---

**This micro-initial provides comprehensive audio recording and playback capabilities specifically designed for Iraqi AI Chat System integration, with full cultural validation, professional domain support, and advanced audio processing features.**