// Real-time Voice Recording Component for Iraqi Arabic
// Based on MediaRecorder API with VAD and Arabic RTL support

import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Square, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VoiceRecorderProps {
  language: 'arabic' | 'english';
  onRecordingComplete: (audioBlob: Blob, duration: number) => void;
  onTranscriptionReceived?: (text: string) => void;
  maxDuration?: number; // in seconds
  dialect?: 'baghdad' | 'basra' | 'mosul' | 'auto';
}

interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  isPlaying: boolean;
  duration: number;
  audioBlob: Blob | null;
  transcription: string;
  isProcessing: boolean;
}

export function VoiceRecorder({
  language,
  onRecordingComplete,
  onTranscriptionReceived,
  maxDuration = 180, // 3 minutes
  dialect = 'auto'
}: VoiceRecorderProps) {
  const [state, setState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    isPlaying: false,
    duration: 0,
    audioBlob: null,
    transcription: '',
    isProcessing: false
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Voice Activity Detection
  const vadRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const direction = language === 'arabic' ? 'rtl' : 'ltr';
  const textAlign = language === 'arabic' ? 'text-right' : 'text-left';
  const fontFamily = language === 'arabic' ? 'font-arabic' : 'font-sans';

  const texts = {
    arabic: {
      recording: 'جاري التسجيل...',
      paused: 'متوقف مؤقتاً',
      duration: 'المدة',
      startRecording: 'بدء التسجيل',
      stopRecording: 'إيقاف التسجيل',
      pauseRecording: 'توقف مؤقتاً',
      resumeRecording: 'استئناف التسجيل',
      playRecording: 'تشغيل التسجيل',
      processing: 'جاري المعالجة...',
      transcribing: 'جاري التحويل إلى نص...',
      noPermission: 'لا يمكن الوصول إلى الميكروفون',
      permissionDenied: 'تم رفض إذن الميكروفون. يرجى السماح بالوصول إلى الميكروفون في إعدادات المتصفح.',
      maxDurationReached: `تم الوصول للحد الأقصى للمدة (${maxDuration} ثانية)`,
      dialect: {
        baghdad: 'لهجة بغدادية',
        basra: 'لهجة بصراوية', 
        mosul: 'لهجة موصلية',
        auto: 'تحديد تلقائي'
      }
    },
    english: {
      recording: 'Recording...',
      paused: 'Paused',
      duration: 'Duration',
      startRecording: 'Start Recording',
      stopRecording: 'Stop Recording',
      pauseRecording: 'Pause Recording',
      resumeRecording: 'Resume Recording',
      playRecording: 'Play Recording',
      processing: 'Processing...',
      transcribing: 'Transcribing...',
      noPermission: 'Cannot access microphone',
      permissionDenied: 'Microphone permission denied. Please allow microphone access in browser settings.',
      maxDurationReached: `Maximum duration reached (${maxDuration} seconds)`,
      dialect: {
        baghdad: 'Baghdad Dialect',
        basra: 'Basra Dialect',
        mosul: 'Mosul Dialect', 
        auto: 'Auto Detect'
      }
    }
  };

  const t = texts[language];

  // Initialize Voice Activity Detection
  useEffect(() => {
    const initVAD = async () => {
      try {
        // Dynamically import VAD (requires WebAssembly)
        const { MicVAD } = await import('@ricky0123/vad-web');
        
        vadRef.current = await MicVAD.new({
          onSpeechStart: () => {
            // Clear silence timeout when speech detected
            if (silenceTimeoutRef.current) {
              clearTimeout(silenceTimeoutRef.current);
              silenceTimeoutRef.current = null;
            }
          },
          onSpeechEnd: () => {
            // Start silence timeout - auto-stop after 2 seconds of silence
            if (state.isRecording && !state.isPaused) {
              silenceTimeoutRef.current = setTimeout(() => {
                stopRecording();
              }, 2000);
            }
          },
          positiveSpeechThreshold: 0.8, // Higher threshold for Arabic
          negativeSpeechThreshold: 0.3,
          redemptionFrames: 8,
          frameSamples: 1536
        });
      } catch (error) {
        console.log('VAD not available:', error);
        // Continue without VAD
      }
    };

    initVAD();

    return () => {
      if (vadRef.current) {
        vadRef.current.destroy();
      }
    };
  }, []);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setState(prev => {
        const newDuration = prev.duration + 1;
        
        // Auto-stop at max duration
        if (newDuration >= maxDuration) {
          stopRecording();
          return { ...prev, duration: maxDuration };
        }
        
        return { ...prev, duration: newDuration };
      });
    }, 1000);
  }, [maxDuration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000, // Optimal for Whisper
          sampleSize: 16,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
          ? 'audio/webm;codecs=opus'
          : 'audio/webm'
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm' 
        });
        
        setState(prev => ({ ...prev, audioBlob, isRecording: false, isPaused: false }));
        onRecordingComplete(audioBlob, state.duration);
        
        // Start transcription
        transcribeAudio(audioBlob);
      };

      mediaRecorder.start(100); // Collect data every 100ms
      
      setState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0
      }));
      
      startTimer();

      // Start VAD monitoring
      if (vadRef.current) {
        vadRef.current.start();
      }

    } catch (error) {
      console.error('Error starting recording:', error);
      setState(prev => ({
        ...prev,
        isProcessing: false
      }));
      
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        alert(t.permissionDenied);
      } else {
        alert(t.noPermission);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
      
      // Stop VAD
      if (vadRef.current) {
        vadRef.current.pause();
      }
      
      // Clean up stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      stopTimer();
      
      // Clear silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.pause();
      setState(prev => ({ ...prev, isPaused: true }));
      stopTimer();
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && state.isPaused) {
      mediaRecorderRef.current.resume();
      setState(prev => ({ ...prev, isPaused: false }));
      startTimer();
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setState(prev => ({ ...prev, isProcessing: true, transcription: '' }));

    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', language);
      formData.append('dialect', dialect);

      const response = await fetch('/api/voice/transcribe', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      const transcription = result.text || '';

      setState(prev => ({ 
        ...prev, 
        transcription, 
        isProcessing: false 
      }));

      if (onTranscriptionReceived) {
        onTranscriptionReceived(transcription);
      }

    } catch (error) {
      console.error('Transcription error:', error);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        transcription: language === 'arabic' 
          ? 'خطأ في تحويل الصوت إلى نص'
          : 'Transcription failed'
      }));
    }
  };

  const playRecording = () => {
    if (state.audioBlob && !state.isPlaying) {
      const audioUrl = URL.createObjectURL(state.audioBlob);
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setState(prev => ({ ...prev, isPlaying: false }));
        URL.revokeObjectURL(audioUrl);
      };

      audio.onloadstart = () => {
        setState(prev => ({ ...prev, isPlaying: true }));
      };

      audio.play();
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (vadRef.current) {
        vadRef.current.destroy();
      }
    };
  }, [stopTimer]);

  return (
    <div className={`w-full p-6 border rounded-lg bg-white shadow-sm ${fontFamily}`} dir={direction}>
      {/* Header */}
      <div className={`flex items-center justify-between mb-6 ${textAlign}`}>
        <h3 className="text-lg font-semibold">
          {language === 'arabic' ? 'التسجيل الصوتي' : 'Voice Recording'}
        </h3>
        
        {/* Dialect Selector */}
        <select
          value={dialect}
          onChange={(e) => setState(prev => ({ ...prev, dialect: e.target.value as any }))}
          className="px-3 py-1 border rounded text-sm"
          disabled={state.isRecording}
        >
          <option value="auto">{t.dialect.auto}</option>
          <option value="baghdad">{t.dialect.baghdad}</option>
          <option value="basra">{t.dialect.basra}</option>
          <option value="mosul">{t.dialect.mosul}</option>
        </select>
      </div>

      {/* Recording Status */}
      {(state.isRecording || state.duration > 0) && (
        <div className={`mb-4 p-3 rounded-lg ${state.isRecording ? 'bg-red-50' : 'bg-gray-50'}`}>
          <div className={`flex items-center justify-between ${textAlign}`}>
            <div className="flex items-center space-x-2">
              {state.isRecording && !state.isPaused && (
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
              <span className={`font-medium ${
                state.isRecording ? 'text-red-700' : 'text-gray-700'
              }`}>
                {state.isRecording 
                  ? (state.isPaused ? t.paused : t.recording)
                  : `${t.duration}: ${formatDuration(state.duration)}`
                }
              </span>
            </div>
            
            <span className="text-sm text-gray-500">
              {formatDuration(state.duration)} / {formatDuration(maxDuration)}
            </span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6 justify-center">
        {!state.isRecording ? (
          <button
            onClick={startRecording}
            disabled={state.isProcessing}
            className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Mic className="w-5 h-5" />
            <span>{t.startRecording}</span>
          </button>
        ) : (
          <>
            <button
              onClick={stopRecording}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Square className="w-5 h-5" />
              <span>{t.stopRecording}</span>
            </button>
            
            {!state.isPaused ? (
              <button
                onClick={pauseRecording}
                className="flex items-center space-x-2 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
              >
                <Pause className="w-5 h-5" />
                <span>{t.pauseRecording}</span>
              </button>
            ) : (
              <button
                onClick={resumeRecording}
                className="flex items-center space-x-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>{t.resumeRecording}</span>
              </button>
            )}
          </>
        )}

        {state.audioBlob && !state.isRecording && (
          <button
            onClick={state.isPlaying ? stopPlayback : playRecording}
            disabled={state.isProcessing}
            className="flex items-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {state.isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span>{t.playRecording}</span>
          </button>
        )}
      </div>

      {/* Processing Status */}
      {state.isProcessing && (
        <div className={`mb-4 p-3 bg-blue-50 rounded-lg ${textAlign}`}>
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            <span className="text-blue-700 font-medium">{t.transcribing}</span>
          </div>
        </div>
      )}

      {/* Transcription Result */}
      {state.transcription && (
        <div className={`p-4 bg-gray-50 rounded-lg ${textAlign}`}>
          <h4 className="font-medium mb-2">
            {language === 'arabic' ? 'النص المستخرج:' : 'Transcription:'}
          </h4>
          <p className={`text-gray-700 leading-relaxed ${
            language === 'arabic' ? 'text-right' : 'text-left'
          }`}>
            {state.transcription}
          </p>
        </div>
      )}
    </div>
  );
}