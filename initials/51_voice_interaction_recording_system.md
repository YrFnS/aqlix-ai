# Voice Interaction & Recording System for Iraqi AI Chat System

## TECHNOLOGY/FRAMEWORK:

**Comprehensive voice interaction and recording system** with natural language understanding (NLU), intent recognition, command execution, MediaRecorder API, Web Audio API, and advanced audio processing, optimized for Iraqi Arabic voice commands, professional audio workflows, and cultural context awareness.

**Specific technologies:** NLU pipelines, intent classification, entity extraction, command routing, MediaRecorder API, Web Audio API, audio visualization, waveform display, real-time audio processing, cultural command validation, and professional voice workflows.

---

## TEMPLATE PURPOSE:

**Complete voice interaction and recording infrastructure** for the Iraqi AI Chat System that combines advanced voice command processing with high-quality audio recording capabilities, enabling natural Iraqi Arabic interactions, professional audio documentation, and culturally-appropriate voice content management.

**Developers should be able to:** Implement unified voice interfaces, configure intent recognition, manage command routing, handle multi-language commands, integrate cultural validation, support professional workflows, create audio recording interfaces, manage playback controls, and handle comprehensive voice interaction workflows.

---

## CORE FEATURES:

**Essential voice interaction and recording infrastructure:**

### Voice Command Processing
- **Intent Recognition:** Advanced NLU for Iraqi Arabic command understanding
- **Cultural Command Processing:** Islamic expressions and culturally appropriate commands
- **Professional Workflows:** Domain-specific commands for legal, medical, educational contexts
- **Multilingual Commands:** Arabic-English code-switching command recognition
- **Command Validation:** Security and cultural appropriateness checking
- **Accessibility Integration:** Voice navigation and screen reader compatibility

### Audio Recording & Playback
- **High-Quality Recording:** Professional audio recording with noise reduction
- **Real-time Visualization:** Waveform display and audio level monitoring
- **Cultural Audio Validation:** Islamic compliance checking for audio content
- **Professional Audio Workflows:** Legal dictation, medical notes, educational recordings
- **Audio Processing:** Compression, filtering, and quality enhancement
- **Playback Controls:** Advanced media controls with speed and pitch adjustment

### Unified Voice System
- **Voice-to-Voice Interaction:** Command processing with audio feedback
- **Recording Command Integration:** Voice commands to control recording functions
- **Cultural Context Preservation:** Maintaining Iraqi context across voice interactions
- **Professional Domain Integration:** Seamless voice workflows for Iraqi professional contexts
- **Real-time Processing:** <300ms command-to-audio response pipeline
- **Accessibility First:** Comprehensive voice navigation for all system features

---

## EXAMPLES TO INCLUDE:

**Working voice interaction and recording examples:**

### Voice Interaction Components
- **Unified Voice Interface:** Combined command processing and recording with visual feedback
- **Intent Classification:** Iraqi Arabic intent recognition with audio response
- **Command Execution:** Safe command processing with cultural validation and audio confirmation
- **Professional Voice Commands:** Domain-specific voice workflow integration with recording
- **Cultural Voice Commands:** Islamic expressions and cultural context handling with audio feedback

### Audio Recording Components
- **Voice Message System:** WhatsApp-style voice messaging with Iraqi cultural adaptation
- **Professional Audio Recorder:** Domain-specific recording for legal, medical, educational use
- **Audio File Manager:** Cultural validation and metadata management
- **Advanced Audio Player:** Playback controls with cultural context display

### Integration Components
- **Voice-Command-Recording Chain:** Seamless flow from voice commands to audio recording
- **Audio-Cultural-Validation Pipeline:** Real-time cultural screening of voice interactions
- **Professional Voice Workflows:** Integrated recording and command processing for Iraqi domains
- **Accessibility Voice Navigation:** Complete voice control with audio feedback

---

## DOCUMENTATION TO RESEARCH:

**Voice interaction and recording documentation:**

### Voice Command Processing
- **Web Speech API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API - Browser speech recognition
- **Dialogflow:** https://cloud.google.com/dialogflow/docs - Google conversational AI
- **Azure LUIS:** https://docs.microsoft.com/en-us/azure/cognitive-services/luis/ - Language understanding service
- **Rasa NLU:** https://rasa.com/docs/rasa/nlu/ - Open source NLU framework
- **Annyang.js:** https://www.talater.com/annyang/ - Speech recognition library

### Audio Recording and Processing
- **MediaRecorder API:** https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder - Browser audio recording
- **Web Audio API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API - Advanced audio processing
- **AudioContext:** https://developer.mozilla.org/en-US/docs/Web/API/AudioContext - Audio processing context
- **WaveSurfer.js:** https://wavesurfer-js.org/ - Audio waveform visualization
- **RecordRTC:** https://recordrtc.org/ - WebRTC audio recording library

---

## DEVELOPMENT PATTERNS:

**Voice interaction and recording architecture patterns:**

### Unified Voice Processing Pipeline
- **Voice Input:** Microphone → Speech Recognition → Intent Classification → Command Processing
- **Audio Recording:** Microphone → Processing → Encoding → Storage → Cultural Validation
- **Voice Output:** Command Response → TTS → Audio Playback → User Feedback
- **Integration Flow:** Command Recognition → Recording Control → Professional Workflow → Cultural Validation

### Command and Recording Management
- **Intent Management:** Hierarchical intent organization with cultural context and recording triggers
- **Audio State Management:** Recording states, playback controls, command states, error handling
- **Command Security:** Input validation, execution sandboxing, audio content screening
- **Cultural Integration:** Content validation, metadata management, Islamic compliance checking
- **Performance Optimization:** Real-time processing, memory management, streaming, caching

### Professional Voice Workflows
- **Legal Voice Processing:** Voice commands + dictation recording with legal compliance
- **Medical Voice Integration:** Medical commands + patient note recording with confidentiality
- **Educational Voice System:** Learning commands + educational content recording
- **Business Voice Features:** Professional commands + meeting recording with cultural validation

---

## SECURITY & BEST PRACTICES:

**Voice interaction and recording security considerations:**

### Voice Command Security
- **Command Validation:** Malicious command detection and sanitization
- **Permission System:** Role-based command access and authorization
- **Cultural Screening:** Inappropriate command filtering
- **Execution Sandboxing:** Safe command execution with limited privileges
- **Audit Logging:** Command execution tracking for security and compliance

### Audio Recording Security
- **Privacy Protection:** User consent, data encryption, secure storage
- **Cultural Compliance:** Inappropriate content detection and filtering
- **File Security:** Virus scanning, format validation, size limits
- **Professional Confidentiality:** Secure handling of sensitive audio content
- **Access Control:** Role-based permissions for audio content management

---

## COMMON GOTCHAS:

**Voice interaction and recording development challenges:**

### Voice Command Challenges
- **Dialect Variations:** Iraqi dialect command recognition accuracy
- **Ambiguous Commands:** Multiple interpretation handling and clarification
- **Context Loss:** Maintaining conversational context across commands
- **Cultural Misinterpretation:** Commands with cultural significance
- **Performance Impact:** Real-time processing and response latency

### Audio Recording Challenges
- **Browser Compatibility:** MediaRecorder support variations across browsers
- **Audio Quality:** Background noise, microphone quality, encoding settings
- **File Size Management:** Compression vs quality trade-offs
- **Real-time Processing:** Performance impact of visualization and filters
- **Cultural Context Preservation:** Maintaining meaning in audio transcription
- **Memory Management:** Large audio file handling and cleanup

---

## VALIDATION REQUIREMENTS:

**Voice interaction and recording system validation:**

### Voice Command Validation
- **Recognition Accuracy:** 90%+ Iraqi Arabic command recognition
- **Intent Classification:** 95%+ accuracy for common command intents
- **Cultural Validation:** 100% screening for culturally inappropriate commands
- **Response Time:** <300ms from command to execution acknowledgment
- **Professional Commands:** 85%+ accuracy for domain-specific workflows

### Audio Recording Validation
- **Recording Quality:** Clear audio with minimal noise and distortion
- **Cultural Validation:** 95%+ screening for inappropriate content
- **Performance Benchmarks:** Real-time recording with <100ms latency
- **File Management:** Secure storage and reliable playback
- **Professional Standards:** Domain-specific audio quality requirements

### Integrated System Validation
- **Voice-to-Voice Response:** <1000ms command recognition to audio response
- **Recording Command Integration:** Voice commands to control recording with <200ms response
- **Cultural Consistency:** 100% cultural validation across all voice interactions
- **Professional Workflow Integration:** Domain-specific voice + recording workflows with 90%+ accuracy

---

## INTEGRATION FOCUS:

**Voice interaction and recording integration points:**

### Core System Integration
- **Speech Processing:** Integration with STT/TTS system (Initial 49) for bidirectional voice processing
- **Cultural Validation:** Real-time cultural compliance checking across all voice interactions
- **Professional Domains:** Iraqi legal, medical, educational, business voice workflow integration
- **Chat Interface:** Voice-activated chat commands, voice messages, and audio recording integration

### Advanced Integration
- **AI Agent Integration:** Voice commands to trigger specialized Iraqi AI agents
- **Document Generation:** Voice-controlled document creation with audio recording capabilities
- **Payment Processing:** Voice-activated payment commands with cultural validation
- **Accessibility Services:** Complete voice navigation and screen reader integration

---

## ADDITIONAL NOTES:

**Iraqi AI Chat System voice interaction considerations:**

### Cultural Integration Priorities
- **Focus on Iraqi cultural commands** - prayer times, Islamic expressions, cultural greetings with audio responses
- **Professional domain integration** - legal dictation, medical notes, educational commands with recording
- **Cultural validation integration** - real-time Islamic compliance checking for both commands and recordings
- **Accessibility first approach** - comprehensive voice navigation with audio feedback for all features

### Performance and User Experience
- **Real-time processing optimization** - <300ms command processing, <100ms recording response
- **Voice-to-voice interaction** - seamless command recognition to audio response pipeline
- **Cultural context preservation** - maintaining Iraqi cultural meaning across voice interactions
- **Professional workflow enhancement** - voice commands + recording for Iraqi professional efficiency

---

## TEMPLATE COMPLEXITY LEVEL:

- [ ] **Beginner-friendly** - Simple getting started patterns
- [ ] **Intermediate** - Production-ready patterns with common features
- [x] **Advanced** - Comprehensive patterns including complex scenarios
- [ ] **Enterprise** - Full enterprise patterns with monitoring, scaling, security

**Advanced complexity selected** because unified voice interaction and recording requires NLU expertise, advanced audio processing, real-time integration, cultural validation, and complex professional workflow coordination.

---

## IMPLEMENTATION EXAMPLES:

### Unified Voice Interaction & Recording Component

```tsx
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Task } from '@/lib/task-delegation'

interface UnifiedVoiceSystemProps {
  onCommandExecuted?: (command: ExecutedCommand) => void
  onRecordingComplete?: (audio: RecordedAudio) => void
  onVoiceInteraction?: (interaction: VoiceInteraction) => void
  enableCulturalValidation?: boolean
  professionalDomain?: 'legal' | 'medical' | 'educational' | 'business'
  accessibilityMode?: boolean
  enableVisualization?: boolean
  maxRecordingDuration?: number
  quality?: 'low' | 'medium' | 'high' | 'professional'
  className?: string
}

interface VoiceInteraction {
  id: string
  timestamp: number
  type: 'command' | 'recording' | 'combined'
  voiceCommand?: RecognizedCommand
  audioRecording?: RecordedAudio
  culturalValidation: CulturalValidation
  professionalContext?: ProfessionalContext
  responseAudio?: Blob
}

interface RecognizedCommand {
  rawText: string
  confidence: number
  intent: string
  entities: CommandEntity[]
  culturalContext?: CulturalContext
  professionalContext?: ProfessionalContext
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

interface ExecutedCommand {
  id: string
  timestamp: number
  command: RecognizedCommand
  result: CommandResult
  executionTime: number
  audioResponse?: Blob
}

interface CommandResult {
  success: boolean
  message: string
  messageArabic: string
  data?: any
  actions?: CommandAction[]
  audioFeedback?: boolean
}

interface CommandAction {
  type: 'navigate' | 'execute' | 'display' | 'speak' | 'record' | 'stop_record' | 'play_audio'
  target: string
  parameters?: Record<string, any>
}

export default function UnifiedVoiceSystem({
  onCommandExecuted,
  onRecordingComplete,
  onVoiceInteraction,
  enableCulturalValidation = true,
  professionalDomain,
  accessibilityMode = false,
  enableVisualization = true,
  maxRecordingDuration = 300,
  quality = 'high',
  className
}: UnifiedVoiceSystemProps) {
  // Voice command state
  const [isListeningForCommands, setIsListeningForCommands] = useState(false)
  const [isProcessingCommand, setIsProcessingCommand] = useState(false)
  const [currentCommand, setCurrentCommand] = useState<string>('')

  // Recording state
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessingRecording, setIsProcessingRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioLevel, setAudioLevel] = useState(0)

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [volume, setVolume] = useState(1.0)

  // System state
  const [voiceInteractions, setVoiceInteractions] = useState<VoiceInteraction[]>([])
  const [currentInteraction, setCurrentInteraction] = useState<VoiceInteraction | null>(null)
  const [systemMode, setSystemMode] = useState<'command' | 'recording' | 'playback'>('command')
  const [status, setStatus] = useState<string>('')
  const [availableCommands, setAvailableCommands] = useState<CommandIntent[]>([])

  // Refs
  const commandRecognitionRef = useRef<SpeechRecognition | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const voiceEngineRef = useRef<UnifiedVoiceEngine | null>(null)

  // Initialize unified voice system
  useEffect(() => {
    voiceEngineRef.current = new UnifiedVoiceEngine({
      culturalValidation: enableCulturalValidation,
      professionalDomain,
      accessibilityMode,
      quality,
      maxRecordingDuration
    })

    loadAvailableCommands()
    initializeAudioSystem()
  }, [enableCulturalValidation, professionalDomain, accessibilityMode, quality, maxRecordingDuration])

  const loadAvailableCommands = useCallback(async () => {
    try {
      const commands = await voiceEngineRef.current?.getAvailableCommands() || []
      setAvailableCommands(commands)
    } catch (error) {
      console.error('Error loading commands:', error)
    }
  }, [])

  const initializeAudioSystem = useCallback(async () => {
    try {
      if (enableVisualization && !audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
    } catch (error) {
      console.error('Audio system initialization error:', error)
    }
  }, [enableVisualization])

  // Start listening for voice commands
  const startVoiceCommands = useCallback(async () => {
    if (!voiceEngineRef.current) return

    try {
      setStatus('بدء الاستماع للأوامر الصوتية... / Starting voice command listening...')
      setSystemMode('command')

      const recognition = await voiceEngineRef.current.startCommandRecognition()
      commandRecognitionRef.current = recognition

      recognition.onresult = async (event) => {
        const result = event.results[event.results.length - 1]
        const transcript = result[0].transcript
        const confidence = result[0].confidence

        setCurrentCommand(transcript)

        if (result.isFinal) {
          await processVoiceCommand(transcript, confidence)
        }
      }

      recognition.onend = () => {
        setIsListeningForCommands(false)
        setStatus('توقف الاستماع للأوامر / Stopped listening for commands')
      }

      setIsListeningForCommands(true)

    } catch (error) {
      console.error('Voice command error:', error)
      setStatus('خطأ في بدء الأوامر الصوتية / Voice command error')
    }
  }, [])

  // Process voice command
  const processVoiceCommand = useCallback(async (
    transcript: string,
    confidence: number
  ): Promise<void> => {
    if (!voiceEngineRef.current) return

    setIsProcessingCommand(true)
    setStatus('معالجة الأمر الصوتي... / Processing voice command...')

    try {
      const startTime = performance.now()

      // Process command with cultural validation
      const recognizedCommand = await voiceEngineRef.current.processCommand(
        transcript,
        confidence
      )

      // Execute command (may trigger recording or other actions)
      const executionResult = await voiceEngineRef.current.executeCommand(
        recognizedCommand
      )

      const executionTime = performance.now() - startTime

      const executedCommand: ExecutedCommand = {
        id: `cmd_${Date.now()}`,
        timestamp: Date.now(),
        command: recognizedCommand,
        result: executionResult,
        executionTime,
        audioResponse: executionResult.audioFeedback ? await generateAudioResponse(executionResult) : undefined
      }

      // Create voice interaction record
      const interaction: VoiceInteraction = {
        id: `interaction_${Date.now()}`,
        timestamp: Date.now(),
        type: 'command',
        voiceCommand: recognizedCommand,
        culturalValidation: recognizedCommand.culturalContext || {} as CulturalValidation,
        professionalContext: recognizedCommand.professionalContext,
        responseAudio: executedCommand.audioResponse
      }

      setVoiceInteractions(prev => [...prev, interaction])
      onCommandExecuted?.(executedCommand)
      onVoiceInteraction?.(interaction)

      // Handle command actions
      await handleCommandActions(executionResult.actions || [])

      // Provide status feedback
      if (executionResult.success) {
        setStatus(`تم تنفيذ الأمر: ${executionResult.messageArabic} / Command executed: ${executionResult.message}`)

        // Play audio response if available
        if (executedCommand.audioResponse) {
          await playAudioResponse(executedCommand.audioResponse)
        }
      } else {
        setStatus(`فشل تنفيذ الأمر: ${executionResult.messageArabic} / Command failed: ${executionResult.message}`)
      }

    } catch (error) {
      console.error('Command processing error:', error)
      setStatus('خطأ في تنفيذ الأمر / Command execution error')
    } finally {
      setIsProcessingCommand(false)
      setCurrentCommand('')
    }
  }, [onCommandExecuted, onVoiceInteraction])

  // Handle command actions (including recording control)
  const handleCommandActions = useCallback(async (actions: CommandAction[]) => {
    for (const action of actions) {
      switch (action.type) {
        case 'record':
          await startRecording()
          break
        case 'stop_record':
          await stopRecording()
          break
        case 'play_audio':
          if (action.parameters?.audioId) {
            const interaction = voiceInteractions.find(i => i.id === action.parameters.audioId)
            if (interaction?.audioRecording) {
              await playAudio(interaction.audioRecording)
            }
          }
          break
        case 'navigate':
          window.history.pushState(null, '', action.target)
          break
        case 'execute':
          // Handle other execution actions
          break
      }
    }
  }, [voiceInteractions])

  // Start audio recording
  const startRecording = useCallback(async () => {
    try {
      setStatus('بدء تسجيل الصوت... / Starting audio recording...')
      setSystemMode('recording')

      const mediaRecorder = await voiceEngineRef.current?.startRecording()
      if (!mediaRecorder) return

      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      setRecordingTime(0)

      // Start recording timer
      const timer = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxRecordingDuration) {
            stopRecording()
          }
          return newTime
        })
      }, 1000)

      mediaRecorder.onstop = async () => {
        clearInterval(timer)
        setIsProcessingRecording(true)
        setStatus('معالجة التسجيل... / Processing recording...')

        const recordedAudio = await voiceEngineRef.current?.processRecording()
        if (recordedAudio) {
          // Create voice interaction record
          const interaction: VoiceInteraction = {
            id: `interaction_${Date.now()}`,
            timestamp: Date.now(),
            type: 'recording',
            audioRecording: recordedAudio,
            culturalValidation: recordedAudio.culturalValidation || {} as CulturalValidation
          }

          setVoiceInteractions(prev => [...prev, interaction])
          onRecordingComplete?.(recordedAudio)
          onVoiceInteraction?.(interaction)
          setStatus(`تم التسجيل بنجاح - المدة: ${Math.round(recordedAudio.duration)}s / Recording completed - Duration: ${Math.round(recordedAudio.duration)}s`)
        }

        setIsProcessingRecording(false)
        setIsRecording(false)
        setSystemMode('command')
      }

    } catch (error) {
      console.error('Recording error:', error)
      setStatus('خطأ في بدء التسجيل / Recording start error')
      setIsRecording(false)
      setSystemMode('command')
    }
  }, [maxRecordingDuration, onRecordingComplete, onVoiceInteraction])

  // Stop recording
  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
  }, [isRecording])

  // Play audio
  const playAudio = useCallback(async (audio: RecordedAudio) => {
    if (!audioRef.current) return

    try {
      setSystemMode('playback')
      const audioUrl = URL.createObjectURL(audio.blob)
      audioRef.current.src = audioUrl
      audioRef.current.playbackRate = playbackRate
      audioRef.current.volume = volume

      await audioRef.current.play()
      setIsPlaying(true)
      setStatus(`تشغيل الصوت... / Playing audio...`)

      audioRef.current.onended = () => {
        setIsPlaying(false)
        setCurrentTime(0)
        setSystemMode('command')
        setStatus('انتهى التشغيل / Playback ended')
        URL.revokeObjectURL(audioUrl)
      }
    } catch (error) {
      console.error('Playback error:', error)
      setStatus('خطأ في التشغيل / Playback error')
      setSystemMode('command')
    }
  }, [playbackRate, volume])

  // Generate audio response for commands
  const generateAudioResponse = useCallback(async (result: CommandResult): Promise<Blob | undefined> => {
    try {
      const task = new Task({
        subagent_type: 'arabic-rtl-processor',
        description: 'Generate audio response for command result',
        prompt: `Generate TTS audio response for this command result:

        Message: ${result.messageArabic}
        Success: ${result.success}
        Professional Domain: ${professionalDomain || 'general'}

        Requirements:
        - Generate clear Iraqi Arabic audio response
        - Use appropriate tone for success/failure
        - Include cultural expressions if appropriate
        - Keep response concise and informative

        Return audio blob for TTS response.`
      })

      const ttsResult = await task.execute()
      return ttsResult.audioBlob
    } catch (error) {
      console.error('Audio response generation error:', error)
      return undefined
    }
  }, [professionalDomain])

  // Play audio response
  const playAudioResponse = useCallback(async (audioBlob: Blob) => {
    if (!audioRef.current) return

    try {
      const audioUrl = URL.createObjectURL(audioBlob)
      const responseAudio = new Audio(audioUrl)
      responseAudio.volume = volume * 0.8 // Slightly lower for responses

      await responseAudio.play()

      responseAudio.onended = () => {
        URL.revokeObjectURL(audioUrl)
      }
    } catch (error) {
      console.error('Audio response playback error:', error)
    }
  }, [volume])

  // Format time display
  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }, [])

  return (
    <div className={`unified-voice-system ${className || ''}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>نظام التفاعل الصوتي والتسجيل / Voice Interaction & Recording System</span>
            {professionalDomain && (
              <Badge variant="outline">{professionalDomain}</Badge>
            )}
            {accessibilityMode && (
              <Badge variant="secondary">إمكانية الوصول / Accessibility</Badge>
            )}
            <Badge variant="default">{systemMode}</Badge>
          </CardTitle>
          {status && (
            <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
              {status}
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* System Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button
                onClick={startVoiceCommands}
                disabled={isListeningForCommands || isProcessingCommand}
                className={`${isListeningForCommands
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isListeningForCommands ? (
                  <>
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2" />
                    الاستماع للأوامر... / Listening for Commands...
                  </>
                ) : isProcessingCommand ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    معالجة الأمر... / Processing Command...
                  </>
                ) : (
                  'أوامر صوتية / Voice Commands'
                )}
              </Button>

              <Button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessingRecording}
                className={`${isRecording
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                {isProcessingRecording ? (
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
                  'تسجيل صوتي / Audio Recording'
                )}
              </Button>

              <Button
                onClick={() => setSystemMode(systemMode === 'playback' ? 'command' : 'playback')}
                variant="outline"
                disabled={voiceInteractions.length === 0}
              >
                تشغيل التسجيلات / Playback Mode
              </Button>
            </div>

            {/* Recording Progress */}
            {isRecording && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">مدة التسجيل / Recording Duration</span>
                  <span className="text-sm font-mono">
                    {formatTime(recordingTime)} / {formatTime(maxRecordingDuration)}
                  </span>
                </div>
                <Progress
                  value={(recordingTime / maxRecordingDuration) * 100}
                  className="w-full"
                />
              </div>
            )}

            {/* Current Command Display */}
            {currentCommand && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">الأمر الحالي / Current Command</h4>
                <div className="p-4 bg-gray-50 rounded-md border">
                  <p className="text-right font-arabic" dir="rtl">
                    {currentCommand}
                  </p>
                  {isProcessingCommand && (
                    <div className="flex items-center mt-2 text-sm text-blue-600">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      معالجة الأمر الصوتي... / Processing voice command...
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Available Commands */}
            {availableCommands.length > 0 && systemMode === 'command' && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">الأوامر المتاحة / Available Commands</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {availableCommands.slice(0, 8).map((command) => (
                    <div
                      key={command.intent}
                      className="flex justify-between items-center p-2 bg-white border rounded-md text-xs"
                    >
                      <span className="font-arabic text-right flex-1" dir="rtl">
                        {command.exampleArabic}
                      </span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {command.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playback Controls */}
            {systemMode === 'playback' && currentInteraction?.audioRecording && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => isPlaying ? setIsPlaying(false) : playAudio(currentInteraction.audioRecording!)}
                    variant="outline"
                  >
                    {isPlaying ? 'إيقاف مؤقت / Pause' : 'تشغيل / Play'}
                  </Button>

                  <span className="text-sm font-mono">
                    {formatTime(currentTime)} / {formatTime(currentInteraction.audioRecording.duration)}
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

            {/* Voice Interactions History */}
            {voiceInteractions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium">سجل التفاعلات الصوتية / Voice Interactions History</h4>
                <ScrollArea className="h-48">
                  <div className="space-y-2">
                    {voiceInteractions.slice(-10).reverse().map((interaction) => (
                      <div
                        key={interaction.id}
                        className={`p-3 rounded-md border cursor-pointer transition-colors ${
                          currentInteraction?.id === interaction.id
                            ? 'bg-blue-50 border-blue-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setCurrentInteraction(interaction)}
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <Badge variant="outline" className="text-xs">
                                {interaction.type}
                              </Badge>
                              {interaction.voiceCommand && (
                                <p className="text-sm font-arabic text-right" dir="rtl">
                                  {interaction.voiceCommand.rawText}
                                </p>
                              )}
                              {interaction.audioRecording && (
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>🎵 {formatTime(interaction.audioRecording.duration)}</span>
                                  <span>{(interaction.audioRecording.size / 1024).toFixed(1)} KB</span>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(interaction.timestamp).toLocaleTimeString('ar-IQ')}
                            </div>
                          </div>

                          {interaction.culturalValidation && (
                            <div className="flex gap-1">
                              <Badge
                                variant={interaction.culturalValidation.appropriate ? "default" : "destructive"}
                                className="text-xs"
                              >
                                {interaction.culturalValidation.appropriate ? 'مناسب / Appropriate' : 'تحذير / Warning'}
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
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

### Unified Voice Engine

```typescript
// lib/unified-voice-engine.ts
import { Task } from '@/lib/task-delegation'

export interface UnifiedVoiceConfig {
  culturalValidation: boolean
  professionalDomain?: string
  accessibilityMode: boolean
  quality: 'low' | 'medium' | 'high' | 'professional'
  maxRecordingDuration: number
  language: string
  confidenceThreshold: number
}

export class UnifiedVoiceEngine {
  private config: UnifiedVoiceConfig
  private commandRecognition: SpeechRecognition | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioContext: AudioContext | null = null
  private voiceCommands: Map<string, CommandIntent> = new Map()
  private currentRecording: Blob | null = null

  constructor(config: Partial<UnifiedVoiceConfig> = {}) {
    this.config = {
      culturalValidation: true,
      accessibilityMode: false,
      quality: 'high',
      maxRecordingDuration: 300,
      language: 'ar-IQ',
      confidenceThreshold: 0.7,
      ...config
    }

    this.initializeVoiceCommands()
  }

  private initializeVoiceCommands(): void {
    // Voice + Recording Commands
    this.voiceCommands.set('start_recording', {
      intent: 'start_recording',
      category: 'action',
      examples: ['start recording', 'begin recording', 'record audio'],
      exampleArabic: 'ابدأ التسجيل',
      entities: ['duration'],
      permissions: ['record'],
      culturalSensitive: false,
      professionalDomains: ['legal', 'medical', 'educational', 'business'],
      accessibilityEnabled: true
    })

    this.voiceCommands.set('stop_recording', {
      intent: 'stop_recording',
      category: 'action',
      examples: ['stop recording', 'end recording', 'finish recording'],
      exampleArabic: 'أوقف التسجيل',
      entities: [],
      permissions: ['record'],
      culturalSensitive: false,
      professionalDomains: ['legal', 'medical', 'educational', 'business'],
      accessibilityEnabled: true
    })

    this.voiceCommands.set('play_last_recording', {
      intent: 'play_last_recording',
      category: 'action',
      examples: ['play recording', 'play last audio', 'replay'],
      exampleArabic: 'شغل آخر تسجيل',
      entities: [],
      permissions: ['play'],
      culturalSensitive: false,
      professionalDomains: ['legal', 'medical', 'educational', 'business'],
      accessibilityEnabled: true
    })

    // Professional Voice Commands
    this.voiceCommands.set('dictate_legal_note', {
      intent: 'dictate_legal_note',
      category: 'action',
      examples: ['dictate legal note', 'legal dictation', 'record legal memo'],
      exampleArabic: 'إملاء مذكرة قانونية',
      entities: ['case_number', 'note_type'],
      permissions: ['legal_access', 'record'],
      culturalSensitive: true,
      professionalDomains: ['legal'],
      accessibilityEnabled: true
    })

    this.voiceCommands.set('record_medical_note', {
      intent: 'record_medical_note',
      category: 'action',
      examples: ['record patient note', 'medical dictation', 'document symptoms'],
      exampleArabic: 'سجل ملاحظة طبية',
      entities: ['patient_id', 'note_type'],
      permissions: ['medical_access', 'record'],
      culturalSensitive: true,
      professionalDomains: ['medical'],
      accessibilityEnabled: true
    })

    // Cultural Voice Commands
    this.voiceCommands.set('prayer_reminder_record', {
      intent: 'prayer_reminder_record',
      category: 'cultural',
      examples: ['record prayer reminder', 'set prayer note', 'Islamic reminder'],
      exampleArabic: 'سجل تذكير الصلاة',
      entities: ['prayer_name', 'reminder_time'],
      permissions: ['record'],
      culturalSensitive: true,
      professionalDomains: [],
      accessibilityEnabled: true
    })

    // Accessibility Voice Commands
    this.voiceCommands.set('describe_and_record', {
      intent: 'describe_and_record',
      category: 'accessibility',
      examples: ['describe and record', 'audio description', 'record accessibility note'],
      exampleArabic: 'وصف وتسجيل',
      entities: ['description_type'],
      permissions: ['record'],
      culturalSensitive: false,
      professionalDomains: [],
      accessibilityEnabled: true
    })
  }

  async startCommandRecognition(): Promise<SpeechRecognition> {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = this.config.language
      recognition.maxAlternatives = 3

      recognition.onstart = () => {
        console.log('Voice command recognition started')
      }

      recognition.onerror = (event) => {
        console.error('Voice command recognition error:', event.error)
      }

      this.commandRecognition = recognition
      recognition.start()

      return recognition
    } else {
      throw new Error('Speech recognition not supported')
    }
  }

  async processCommand(
    transcript: string,
    confidence: number
  ): Promise<RecognizedCommand> {
    // Use cultural validator for intent recognition
    const intentTask = new Task({
      subagent_type: 'iraqi-cultural-validator',
      description: 'Process unified voice command with recording integration',
      prompt: `Analyze this Iraqi Arabic voice command for unified voice and recording system:

      Command: "${transcript}"
      Confidence: ${confidence}
      Available Intents: ${Array.from(this.voiceCommands.keys()).join(', ')}
      Professional Domain: ${this.config.professionalDomain || 'general'}

      Unified System Capabilities:
      - Voice commands that trigger recording
      - Professional voice workflows (legal, medical, educational)
      - Cultural voice expressions and Islamic commands
      - Audio recording control commands
      - Accessibility voice navigation

      Requirements:
      - Identify intent (command vs recording vs combined action)
      - Extract entities and parameters
      - Validate cultural appropriateness for both command and potential recording
      - Check professional domain permissions
      - Determine if command should trigger recording, playback, or other audio actions

      Return intent classification with audio action requirements.`
    })

    const intentResult = await intentTask.execute()

    // Extract entities
    const entities = await this.extractEntities(transcript, intentResult.intent || 'unknown', confidence)

    // Cultural context analysis
    let culturalContext: CulturalContext | undefined
    if (this.config.culturalValidation) {
      culturalContext = await this.analyzeCulturalContext(transcript)
    }

    // Professional context analysis
    let professionalContext: ProfessionalContext | undefined
    if (this.config.professionalDomain) {
      professionalContext = await this.analyzeProfessionalContext(transcript, this.config.professionalDomain)
    }

    return {
      rawText: transcript,
      confidence,
      intent: intentResult.intent || 'unknown',
      entities,
      culturalContext,
      professionalContext
    }
  }

  async executeCommand(command: RecognizedCommand): Promise<CommandResult> {
    const intent = this.voiceCommands.get(command.intent)

    if (!intent) {
      return {
        success: false,
        message: 'Unknown command',
        messageArabic: 'أمر غير معروف',
        audioFeedback: true
      }
    }

    // Validation
    const validationResult = await this.validateCommand(command, intent)
    if (!validationResult.valid) {
      return {
        success: false,
        message: validationResult.reason,
        messageArabic: validationResult.reasonArabic || validationResult.reason,
        audioFeedback: true
      }
    }

    // Execute unified voice + recording commands
    try {
      switch (command.intent) {
        case 'start_recording':
          return {
            success: true,
            message: 'Starting audio recording',
            messageArabic: 'بدء تسجيل الصوت',
            actions: [{ type: 'record', target: 'audio' }],
            audioFeedback: true
          }

        case 'stop_recording':
          return {
            success: true,
            message: 'Stopping audio recording',
            messageArabic: 'إيقاف تسجيل الصوت',
            actions: [{ type: 'stop_record', target: 'audio' }],
            audioFeedback: true
          }

        case 'play_last_recording':
          return {
            success: true,
            message: 'Playing last recording',
            messageArabic: 'تشغيل آخر تسجيل',
            actions: [{ type: 'play_audio', target: 'last_recording' }],
            audioFeedback: true
          }

        case 'dictate_legal_note':
          return await this.executeProfessionalDictation(command, 'legal')

        case 'record_medical_note':
          return await this.executeProfessionalDictation(command, 'medical')

        case 'prayer_reminder_record':
          return await this.executeCulturalRecording(command)

        case 'describe_and_record':
          return await this.executeAccessibilityRecording(command)

        default:
          return {
            success: false,
            message: 'Command not implemented',
            messageArabic: 'الأمر غير مُنفذ',
            audioFeedback: true
          }
      }
    } catch (error) {
      console.error('Unified command execution error:', error)
      return {
        success: false,
        message: 'Command execution failed',
        messageArabic: 'فشل تنفيذ الأمر',
        audioFeedback: true
      }
    }
  }

  async startRecording(): Promise<MediaRecorder> {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: this.getQualitySettings().sampleRate,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    })

    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm; codecs=opus',
      audioBitsPerSecond: this.getQualitySettings().bitRate
    })

    const chunks: Blob[] = []

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data)
      }
    }

    this.mediaRecorder.onstop = () => {
      this.currentRecording = new Blob(chunks, { type: 'audio/webm; codecs=opus' })
    }

    this.mediaRecorder.start(100)
    return this.mediaRecorder
  }

  async processRecording(): Promise<RecordedAudio | null> {
    if (!this.currentRecording) return null

    // Calculate duration
    const audio = new Audio(URL.createObjectURL(this.currentRecording))
    await new Promise((resolve) => {
      audio.addEventListener('loadedmetadata', resolve, { once: true })
    })

    const recordedAudio: RecordedAudio = {
      id: `audio_${Date.now()}`,
      blob: this.currentRecording,
      duration: audio.duration,
      size: this.currentRecording.size,
      format: 'webm',
      timestamp: Date.now()
    }

    // Cultural validation if enabled
    if (this.config.culturalValidation) {
      recordedAudio.culturalValidation = await this.validateAudioCulturally(recordedAudio)
    }

    // Professional metadata if domain specified
    if (this.config.professionalDomain) {
      recordedAudio.professionalMetadata = await this.generateProfessionalMetadata(
        recordedAudio,
        this.config.professionalDomain
      )
    }

    return recordedAudio
  }

  private async executeProfessionalDictation(
    command: RecognizedCommand,
    domain: string
  ): Promise<CommandResult> {
    return {
      success: true,
      message: `Starting ${domain} dictation recording`,
      messageArabic: `بدء تسجيل الإملاء ${domain === 'legal' ? 'القانوني' : 'الطبي'}`,
      actions: [
        { type: 'record', target: 'audio', parameters: { domain, type: 'dictation' } }
      ],
      audioFeedback: true
    }
  }

  private async executeCulturalRecording(command: RecognizedCommand): Promise<CommandResult> {
    return {
      success: true,
      message: 'Starting Islamic reminder recording',
      messageArabic: 'بدء تسجيل التذكير الإسلامي',
      actions: [
        { type: 'record', target: 'audio', parameters: { type: 'islamic_reminder' } }
      ],
      audioFeedback: true
    }
  }

  private async executeAccessibilityRecording(command: RecognizedCommand): Promise<CommandResult> {
    return {
      success: true,
      message: 'Starting accessibility description recording',
      messageArabic: 'بدء تسجيل الوصف لإمكانية الوصول',
      actions: [
        { type: 'record', target: 'audio', parameters: { type: 'accessibility_description' } }
      ],
      audioFeedback: true
    }
  }

  private async extractEntities(
    text: string,
    intent: string,
    confidence: number
  ): Promise<CommandEntity[]> {
    const entityTask = new Task({
      subagent_type: 'arabic-rtl-processor',
      description: 'Extract entities from unified voice command',
      prompt: `Extract entities from this Iraqi Arabic voice/recording command:

      Text: "${text}"
      Intent: ${intent}
      Expected Entities: ${this.voiceCommands.get(intent)?.entities.join(', ') || 'none'}

      Unified System Context:
      - Commands may reference recording duration, file names, professional contexts
      - Extract Arabic-specific entities (times, dates, names)
      - Identify professional domain entities (case numbers, patient IDs, etc.)
      - Handle cultural entities (prayer names, Islamic expressions)

      Return extracted entities with positions and confidence.`
    })

    const result = await entityTask.execute()
    return result.entities || []
  }

  private async analyzeCulturalContext(text: string): Promise<CulturalContext> {
    const culturalTask = new Task({
      subagent_type: 'iraqi-cultural-validator',
      description: 'Analyze cultural context in unified voice command',
      prompt: `Analyze cultural context in this Iraqi voice command that may trigger recording:

      Command: "${text}"

      Unified System Analysis:
      - Check for Islamic expressions in voice commands
      - Validate cultural appropriateness for both command and potential recording content
      - Consider professional cultural requirements
      - Assess religious sensitivity for voice and audio content

      Return comprehensive cultural context analysis.`
    })

    const result = await culturalTask.execute()
    return {
      islamicExpressions: result.islamicExpressions || [],
      culturalSensitivity: result.culturalSensitivity || 'low',
      appropriate: result.culturallyAppropriate || true,
      concerns: result.concerns || []
    }
  }

  private async analyzeProfessionalContext(
    text: string,
    domain: string
  ): Promise<ProfessionalContext> {
    const professionalTask = new Task({
      subagent_type: 'iraqi-professional-domain-expert',
      description: 'Analyze professional context in unified voice command',
      prompt: `Analyze professional context in this voice command with recording implications:

      Command: "${text}"
      Professional Domain: ${domain}

      Professional Voice Analysis:
      - Extract domain-specific terminology for voice commands and recording
      - Identify workflow requirements (dictation, note-taking, documentation)
      - Check authorization needs for voice and recording access
      - Validate professional appropriateness for audio content
      - Determine confidentiality requirements

      Return professional context analysis with recording considerations.`
    })

    const result = await professionalTask.execute()
    return {
      domain,
      terminology: result.professionalTerms || [],
      workflowType: result.workflowType || 'general',
      requiresAuthorization: result.requiresAuth || false,
      appropriate: result.professionallyAppropriate || true
    }
  }

  private async validateCommand(
    command: RecognizedCommand,
    intent: CommandIntent
  ): Promise<{ valid: boolean; reason: string; reasonArabic?: string }> {
    // Standard validation checks
    if (command.confidence < this.config.confidenceThreshold) {
      return {
        valid: false,
        reason: 'Low confidence recognition',
        reasonArabic: 'ثقة منخفضة في التعرف'
      }
    }

    // Cultural validation
    if (intent.culturalSensitive && command.culturalContext && !command.culturalContext.appropriate) {
      return {
        valid: false,
        reason: 'Culturally inappropriate command',
        reasonArabic: 'أمر غير مناسب ثقافياً'
      }
    }

    // Professional domain check
    if (this.config.professionalDomain &&
        intent.professionalDomains.length > 0 &&
        !intent.professionalDomains.includes(this.config.professionalDomain)) {
      return {
        valid: false,
        reason: 'Command not available in this professional domain',
        reasonArabic: 'الأمر غير متاح في هذا المجال المهني'
      }
    }

    return { valid: true, reason: 'Command validated' }
  }

  private async validateAudioCulturally(audio: RecordedAudio): Promise<CulturalAudioValidation> {
    try {
      const task = new Task({
        subagent_type: 'iraqi-cultural-validator',
        description: 'Validate recorded audio for cultural compliance in unified system',
        prompt: `Validate this recorded audio for Iraqi cultural compliance in unified voice system:

        Audio Duration: ${audio.duration} seconds
        Audio Size: ${audio.size} bytes
        Professional Context: ${this.config.professionalDomain || 'general'}

        Unified System Validation:
        - Check for Islamic content appropriateness in voice recordings
        - Verify cultural sensitivity for professional voice workflows
        - Screen for inappropriate audio content in voice interactions
        - Validate professional domain suitability for audio content
        - Consider cultural context preservation in voice-to-voice interactions

        Return detailed cultural validation for unified voice system.`
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
  }

  private async generateProfessionalMetadata(
    audio: RecordedAudio,
    domain: string
  ): Promise<ProfessionalAudioMetadata> {
    try {
      const task = new Task({
        subagent_type: 'iraqi-professional-domain-expert',
        description: 'Generate professional metadata for unified voice system audio',
        prompt: `Generate professional metadata for this audio in unified voice system:

        Audio Duration: ${audio.duration} seconds
        Professional Domain: ${domain}
        System Quality: ${this.config.quality}

        Unified System Metadata:
        - Classify recording within professional domain context
        - Assess confidentiality for voice-recorded content
        - Determine transcription needs for voice interactions
        - Calculate quality score for professional voice workflows
        - Consider integration with voice command workflows

        Return professional metadata optimized for unified voice system.`
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
  }

  private getQualitySettings() {
    const settings = {
      low: { bitRate: 32000, sampleRate: 22050 },
      medium: { bitRate: 64000, sampleRate: 44100 },
      high: { bitRate: 128000, sampleRate: 48000 },
      professional: { bitRate: 256000, sampleRate: 48000 }
    }
    return settings[this.config.quality]
  }

  getAvailableCommands(): CommandIntent[] {
    const commands = Array.from(this.voiceCommands.values())

    // Filter by professional domain
    if (this.config.professionalDomain) {
      return commands.filter(cmd =>
        cmd.professionalDomains.length === 0 ||
        cmd.professionalDomains.includes(this.config.professionalDomain!)
      )
    }

    // Filter by accessibility mode
    if (this.config.accessibilityMode) {
      return commands.filter(cmd => cmd.accessibilityEnabled)
    }

    return commands
  }

  async cleanup(): Promise<void> {
    if (this.commandRecognition) {
      this.commandRecognition.stop()
      this.commandRecognition = null
    }

    if (this.mediaRecorder) {
      this.mediaRecorder = null
    }

    if (this.audioContext) {
      await this.audioContext.close()
      this.audioContext = null
    }

    this.currentRecording = null
  }
}

// Type definitions
interface CommandIntent {
  intent: string
  category: 'navigation' | 'action' | 'query' | 'control' | 'accessibility' | 'cultural'
  examples: string[]
  exampleArabic: string
  entities: string[]
  permissions: string[]
  culturalSensitive: boolean
  professionalDomains: string[]
  accessibilityEnabled: boolean
}

interface CulturalContext {
  islamicExpressions: string[]
  culturalSensitivity: 'low' | 'medium' | 'high'
  appropriate: boolean
  concerns: string[]
}

interface ProfessionalContext {
  domain: string
  terminology: string[]
  workflowType: string
  requiresAuthorization: boolean
  appropriate: boolean
}

interface CulturalValidation {
  appropriate: boolean
  issues: string[]
  recommendations: string[]
}

interface CommandEntity {
  type: string
  value: string
  confidence: number
  startPos: number
  endPos: number
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
```

---

## DATABASE SCHEMA:

**Unified voice interaction and recording tables:**

```sql
-- Unified Voice Interactions
CREATE TABLE voice_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    conversation_id UUID REFERENCES conversations(id),
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('command', 'recording', 'combined')),

    -- Voice Command Data
    voice_command_text TEXT,
    voice_command_intent VARCHAR(100),
    command_confidence DECIMAL(3,2),
    command_execution_time INTEGER, -- milliseconds
    command_success BOOLEAN,

    -- Audio Recording Data
    audio_blob_url TEXT,
    audio_duration DECIMAL(8,2), -- seconds
    audio_size BIGINT, -- bytes
    audio_format VARCHAR(20),
    audio_quality_score DECIMAL(3,2),

    -- Cultural Validation
    cultural_validation_status VARCHAR(20) CHECK (cultural_validation_status IN ('validated', 'warning', 'rejected')),
    cultural_appropriateness_score DECIMAL(3,2),
    islamic_content_detected BOOLEAN DEFAULT false,
    cultural_issues JSONB DEFAULT '[]',
    cultural_recommendations JSONB DEFAULT '[]',

    -- Professional Context
    professional_domain VARCHAR(50), -- legal, medical, educational, business
    professional_category VARCHAR(100),
    confidential_content BOOLEAN DEFAULT false,
    transcription_required BOOLEAN DEFAULT false,
    professional_metadata JSONB DEFAULT '{}',

    -- System Metadata
    processing_time INTEGER, -- milliseconds
    system_mode VARCHAR(20) CHECK (system_mode IN ('command', 'recording', 'playback')),
    accessibility_mode_used BOOLEAN DEFAULT false,
    quality_setting VARCHAR(20) CHECK (quality_setting IN ('low', 'medium', 'high', 'professional')),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Voice Command Intents
CREATE TABLE voice_command_intents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    intent_name VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,

    -- Command Examples
    english_examples TEXT[] DEFAULT ARRAY[]::TEXT[],
    arabic_example TEXT NOT NULL,

    -- Intent Configuration
    required_entities TEXT[] DEFAULT ARRAY[]::TEXT[],
    required_permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
    cultural_sensitive BOOLEAN DEFAULT false,
    professional_domains TEXT[] DEFAULT ARRAY[]::TEXT[],
    accessibility_enabled BOOLEAN DEFAULT true,

    -- Integration Settings
    triggers_recording BOOLEAN DEFAULT false,
    triggers_playback BOOLEAN DEFAULT false,
    requires_audio_feedback BOOLEAN DEFAULT false,

    -- Cultural Validation
    islamic_compliant BOOLEAN DEFAULT true,
    cultural_appropriateness_level VARCHAR(20) DEFAULT 'standard',

    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Voice System Usage Analytics
CREATE TABLE voice_system_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),

    -- Usage Metrics
    commands_processed INTEGER DEFAULT 0,
    recordings_created INTEGER DEFAULT 0,
    total_interaction_time INTEGER DEFAULT 0, -- seconds
    successful_interactions INTEGER DEFAULT 0,
    failed_interactions INTEGER DEFAULT 0,

    -- Quality Metrics
    average_command_confidence DECIMAL(3,2),
    average_audio_quality DECIMAL(3,2),
    cultural_compliance_rate DECIMAL(3,2),
    professional_usage_percentage DECIMAL(3,2),

    -- Performance Metrics
    average_response_time INTEGER, -- milliseconds
    peak_usage_hour INTEGER CHECK (peak_usage_hour BETWEEN 0 AND 23),
    preferred_interaction_type VARCHAR(20),

    -- Accessibility Usage
    accessibility_mode_usage INTEGER DEFAULT 0,
    voice_navigation_usage INTEGER DEFAULT 0,

    date_tracked DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(user_id, date_tracked)
);

-- Cultural Voice Patterns
CREATE TABLE cultural_voice_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pattern_type VARCHAR(50) NOT NULL, -- islamic_expression, cultural_greeting, professional_phrase

    -- Pattern Data
    arabic_text TEXT NOT NULL,
    english_translation TEXT,
    pronunciation_guide TEXT,

    -- Context Information
    usage_context VARCHAR(100), -- prayer, greeting, professional, casual
    professional_domains TEXT[] DEFAULT ARRAY[]::TEXT[],
    cultural_significance TEXT,
    religious_importance VARCHAR(20) CHECK (religious_importance IN ('low', 'medium', 'high', 'critical')),

    -- Validation Settings
    requires_cultural_validation BOOLEAN DEFAULT true,
    islamic_compliance_required BOOLEAN DEFAULT false,
    professional_approval_needed BOOLEAN DEFAULT false,

    -- Usage Tracking
    usage_count INTEGER DEFAULT 0,
    successful_recognitions INTEGER DEFAULT 0,
    average_recognition_confidence DECIMAL(3,2),

    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Professional Voice Workflows
CREATE TABLE professional_voice_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name VARCHAR(200) NOT NULL,
    professional_domain VARCHAR(50) NOT NULL,

    -- Workflow Configuration
    command_sequence JSONB NOT NULL, -- Array of command intents in order
    recording_requirements JSONB DEFAULT '{}', -- Duration, quality, etc.
    validation_requirements JSONB DEFAULT '{}', -- Cultural, professional validation needs

    -- Professional Context
    requires_authorization BOOLEAN DEFAULT false,
    confidentiality_level VARCHAR(20) CHECK (confidentiality_level IN ('public', 'internal', 'confidential', 'restricted')),
    professional_category VARCHAR(100),

    -- Integration Settings
    auto_transcription BOOLEAN DEFAULT false,
    cultural_validation_required BOOLEAN DEFAULT true,
    audio_response_enabled BOOLEAN DEFAULT true,

    -- Usage Tracking
    usage_count INTEGER DEFAULT 0,
    success_rate DECIMAL(3,2),
    average_completion_time INTEGER, -- seconds

    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_voice_interactions_user_timestamp ON voice_interactions(user_id, created_at DESC);
CREATE INDEX idx_voice_interactions_type ON voice_interactions(interaction_type);
CREATE INDEX idx_voice_interactions_professional_domain ON voice_interactions(professional_domain);
CREATE INDEX idx_voice_interactions_cultural_status ON voice_interactions(cultural_validation_status);
CREATE INDEX idx_voice_command_intents_category ON voice_command_intents(category);
CREATE INDEX idx_voice_command_intents_professional ON voice_command_intents USING GIN(professional_domains);
CREATE INDEX idx_cultural_voice_patterns_context ON cultural_voice_patterns(usage_context);
CREATE INDEX idx_professional_voice_workflows_domain ON professional_voice_workflows(professional_domain);
```

---

**This unified initial provides comprehensive voice interaction and recording capabilities specifically designed for Iraqi AI Chat System integration, combining advanced voice command processing with professional audio recording workflows, cultural validation, and seamless Iraqi Arabic voice-to-voice interaction.**