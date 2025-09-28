"""
WebSocket Voice Streaming Handler for FastAPI
Real-time voice processing with OpenAI integration optimized for Iraqi Arabic
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.responses import StreamingResponse
import asyncio
import json
import base64
import io
import tempfile
from pathlib import Path
from typing import Dict, List, Optional, Any
import openai
from pydantic import BaseModel
import logging
import uuid
from collections import defaultdict
import time

app = FastAPI(title="Iraqi Voice Streaming API")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OpenAI client
openai_client = openai.AsyncOpenAI()


# Active WebSocket connections
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_sessions: Dict[str, Dict[str, Any]] = defaultdict(dict)

    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        self.user_sessions[client_id] = {
            "connected_at": time.time(),
            "dialect": "auto",
            "voice_settings": {
                "speed": 0.9,
                "voice": "nova",  # Best for Arabic
            },
            "processing_queue": [],
        }
        logger.info(f"Client {client_id} connected")

    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
        if client_id in self.user_sessions:
            del self.user_sessions[client_id]
        logger.info(f"Client {client_id} disconnected")

    async def send_personal_message(self, message: dict, client_id: str):
        websocket = self.active_connections.get(client_id)
        if websocket:
            try:
                await websocket.send_json(message)
            except Exception as e:
                logger.error(f"Error sending message to {client_id}: {e}")
                self.disconnect(client_id)

    async def broadcast(self, message: dict):
        disconnected = []
        for client_id, websocket in self.active_connections.items():
            try:
                await websocket.send_json(message)
            except:
                disconnected.append(client_id)

        for client_id in disconnected:
            self.disconnect(client_id)


manager = ConnectionManager()


# Message Models
class VoiceMessage(BaseModel):
    type: str  # 'start_recording', 'audio_chunk', 'stop_recording', 'tts_request'
    client_id: str
    data: Optional[Dict[str, Any]] = None
    audio_data: Optional[str] = None  # Base64 encoded
    text: Optional[str] = None
    language: str = "arabic"
    dialect: str = "auto"


class VoiceResponse(BaseModel):
    type: str  # 'transcription', 'tts_audio', 'error', 'status'
    client_id: str
    data: Optional[Dict[str, Any]] = None
    audio_data: Optional[str] = None  # Base64 encoded
    text: Optional[str] = None
    error: Optional[str] = None
    processing_time: Optional[float] = None


# Audio processing utilities
class AudioProcessor:
    def __init__(self):
        self.temp_dir = Path(tempfile.gettempdir()) / "iraqi_voice"
        self.temp_dir.mkdir(exist_ok=True)

    async def convert_webm_to_wav(self, audio_data: bytes) -> bytes:
        """Convert WebM audio to WAV format for better Whisper compatibility"""
        try:
            import subprocess
            import tempfile

            # Create temporary files
            with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as webm_file:
                webm_file.write(audio_data)
                webm_path = webm_file.name

            wav_path = webm_path.replace(".webm", ".wav")

            # Convert using FFmpeg
            cmd = [
                "ffmpeg",
                "-i",
                webm_path,
                "-ar",
                "16000",  # 16kHz sample rate for Whisper
                "-ac",
                "1",  # Mono
                "-c:a",
                "pcm_s16le",  # 16-bit PCM
                "-y",  # Overwrite output
                wav_path,
            ]

            process = await asyncio.create_subprocess_exec(
                *cmd, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE
            )

            stdout, stderr = await process.communicate()

            if process.returncode == 0:
                with open(wav_path, "rb") as wav_file:
                    wav_data = wav_file.read()

                # Cleanup
                Path(webm_path).unlink(missing_ok=True)
                Path(wav_path).unlink(missing_ok=True)

                return wav_data
            else:
                logger.error(f"FFmpeg conversion failed: {stderr.decode()}")
                return audio_data  # Return original if conversion fails

        except Exception as e:
            logger.error(f"Audio conversion error: {e}")
            return audio_data  # Return original if conversion fails

    def get_dialect_context(self, dialect: str, language: str) -> str:
        """Get context prompt for better Iraqi dialect recognition"""
        if language != "arabic" or dialect == "auto":
            return ""

        dialect_contexts = {
            "baghdad": "This is Iraqi Arabic from Baghdad. Common words: شلونك (how are you), وين (where), شگد (how much), أكو (there is).",
            "basra": "This is Iraqi Arabic from Basra. Southern Iraqi dialect with distinctive pronunciation.",
            "mosul": "This is Iraqi Arabic from Mosul. Northern Iraqi dialect with unique vocabulary.",
        }

        return dialect_contexts.get(dialect, "")


audio_processor = AudioProcessor()


@app.websocket("/ws/voice/{client_id}")
async def websocket_voice_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for real-time voice processing"""
    await manager.connect(websocket, client_id)

    try:
        while True:
            # Receive message from client
            message_data = await websocket.receive_text()
            message = json.loads(message_data)

            # Process different message types
            if message["type"] == "start_recording":
                await handle_start_recording(client_id, message)

            elif message["type"] == "audio_chunk":
                await handle_audio_chunk(client_id, message)

            elif message["type"] == "stop_recording":
                await handle_stop_recording(client_id, message)

            elif message["type"] == "tts_request":
                await handle_tts_request(client_id, message)

            elif message["type"] == "update_settings":
                await handle_settings_update(client_id, message)

            else:
                await manager.send_personal_message(
                    {
                        "type": "error",
                        "error": f"Unknown message type: {message['type']}",
                    },
                    client_id,
                )

    except WebSocketDisconnect:
        manager.disconnect(client_id)
    except Exception as e:
        logger.error(f"WebSocket error for {client_id}: {e}")
        manager.disconnect(client_id)


async def handle_start_recording(client_id: str, message: dict):
    """Handle start recording event"""
    session = manager.user_sessions[client_id]
    session["recording_started"] = time.time()
    session["audio_chunks"] = []

    # Update settings if provided
    if "dialect" in message:
        session["dialect"] = message["dialect"]

    await manager.send_personal_message(
        {"type": "recording_started", "timestamp": session["recording_started"]},
        client_id,
    )


async def handle_audio_chunk(client_id: str, message: dict):
    """Handle incoming audio chunk"""
    session = manager.user_sessions[client_id]

    if "audio_chunks" not in session:
        session["audio_chunks"] = []

    # Decode base64 audio data
    if message.get("audio_data"):
        try:
            audio_data = base64.b64decode(message["audio_data"])
            session["audio_chunks"].append(audio_data)

            await manager.send_personal_message(
                {
                    "type": "chunk_received",
                    "chunk_size": len(audio_data),
                    "total_chunks": len(session["audio_chunks"]),
                },
                client_id,
            )

        except Exception as e:
            await manager.send_personal_message(
                {"type": "error", "error": f"Invalid audio data: {str(e)}"}, client_id
            )


async def handle_stop_recording(client_id: str, message: dict):
    """Handle stop recording and process complete audio"""
    start_time = time.time()
    session = manager.user_sessions[client_id]

    if "audio_chunks" not in session or not session["audio_chunks"]:
        await manager.send_personal_message(
            {"type": "error", "error": "No audio data received"}, client_id
        )
        return

    try:
        # Combine audio chunks
        combined_audio = b"".join(session["audio_chunks"])

        # Convert to WAV if needed
        if len(combined_audio) > 100:  # Skip tiny audio samples
            wav_audio = await audio_processor.convert_webm_to_wav(combined_audio)

            # Prepare for Whisper API
            audio_file = io.BytesIO(wav_audio)
            audio_file.name = f"{client_id}_recording.wav"

            # Get dialect context
            dialect_context = audio_processor.get_dialect_context(
                session.get("dialect", "auto"), message.get("language", "arabic")
            )

            # Transcribe with OpenAI Whisper
            transcription_result = await openai_client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                language="ar" if message.get("language") == "arabic" else "en",
                prompt=dialect_context,
                response_format="verbose_json",
            )

            processing_time = time.time() - start_time

            await manager.send_personal_message(
                {
                    "type": "transcription",
                    "text": transcription_result.text,
                    "language": transcription_result.language,
                    "confidence": getattr(transcription_result, "confidence", None),
                    "processing_time": processing_time,
                    "audio_duration": len(combined_audio)
                    / (16000 * 2),  # Approximate duration
                },
                client_id,
            )

        else:
            await manager.send_personal_message(
                {"type": "error", "error": "Audio too short for transcription"},
                client_id,
            )

    except Exception as e:
        logger.error(f"Transcription error for {client_id}: {e}")
        await manager.send_personal_message(
            {"type": "error", "error": f"Transcription failed: {str(e)}"}, client_id
        )

    finally:
        # Cleanup
        if "audio_chunks" in session:
            del session["audio_chunks"]


async def handle_tts_request(client_id: str, message: dict):
    """Handle Text-to-Speech request"""
    start_time = time.time()
    session = manager.user_sessions[client_id]

    if not message.get("text"):
        await manager.send_personal_message(
            {"type": "error", "error": "No text provided for TTS"}, client_id
        )
        return

    try:
        # Get voice settings
        voice_settings = session.get("voice_settings", {})
        voice = voice_settings.get("voice", "nova")
        speed = voice_settings.get("speed", 0.9)

        # Generate speech with OpenAI TTS
        response = await openai_client.audio.speech.create(
            model="tts-1-hd",
            voice=voice,
            input=message["text"],
            speed=speed,
            response_format="mp3",
        )

        # Convert to base64 for WebSocket transmission
        audio_data = base64.b64encode(response.content).decode("utf-8")
        processing_time = time.time() - start_time

        await manager.send_personal_message(
            {
                "type": "tts_audio",
                "audio_data": audio_data,
                "text": message["text"],
                "voice": voice,
                "speed": speed,
                "processing_time": processing_time,
                "audio_format": "mp3",
            },
            client_id,
        )

    except Exception as e:
        logger.error(f"TTS error for {client_id}: {e}")
        await manager.send_personal_message(
            {"type": "error", "error": f"TTS generation failed: {str(e)}"}, client_id
        )


async def handle_settings_update(client_id: str, message: dict):
    """Handle voice settings update"""
    session = manager.user_sessions[client_id]

    if "voice_settings" in message:
        session["voice_settings"].update(message["voice_settings"])

    if "dialect" in message:
        session["dialect"] = message["dialect"]

    await manager.send_personal_message(
        {
            "type": "settings_updated",
            "current_settings": {
                "voice_settings": session["voice_settings"],
                "dialect": session["dialect"],
            },
        },
        client_id,
    )


# REST API Endpoints for non-WebSocket clients
@app.post("/voice/transcribe")
async def transcribe_audio(
    audio: bytes, language: str = "arabic", dialect: str = "auto"
):
    """REST endpoint for audio transcription"""
    try:
        # Convert audio if needed
        wav_audio = await audio_processor.convert_webm_to_wav(audio)

        # Prepare audio file
        audio_file = io.BytesIO(wav_audio)
        audio_file.name = "audio.wav"

        # Get dialect context
        dialect_context = audio_processor.get_dialect_context(dialect, language)

        # Transcribe
        result = await openai_client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="ar" if language == "arabic" else "en",
            prompt=dialect_context,
            response_format="verbose_json",
        )

        return {
            "text": result.text,
            "language": result.language,
            "confidence": getattr(result, "confidence", None),
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {str(e)}")


@app.post("/voice/synthesize")
async def synthesize_speech(
    text: str, voice: str = "nova", speed: float = 0.9, format: str = "mp3"
):
    """REST endpoint for text-to-speech"""
    try:
        response = await openai_client.audio.speech.create(
            model="tts-1-hd",
            voice=voice,
            input=text,
            speed=speed,
            response_format=format,
        )

        return StreamingResponse(
            io.BytesIO(response.content),
            media_type=f"audio/{format}",
            headers={"Content-Disposition": f"attachment; filename=speech.{format}"},
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS generation failed: {str(e)}")


@app.get("/voice/status")
async def get_voice_status():
    """Get voice service status"""
    return {
        "status": "active",
        "active_connections": len(manager.active_connections),
        "supported_languages": ["arabic", "english"],
        "supported_dialects": ["auto", "baghdad", "basra", "mosul"],
        "available_voices": ["nova", "alloy", "echo", "fable", "onyx", "shimmer"],
        "models": {"transcription": "whisper-1", "synthesis": "tts-1-hd"},
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8002, reload=True)
