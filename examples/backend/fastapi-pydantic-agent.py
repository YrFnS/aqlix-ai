"""
FastAPI + PydanticAI Agent Example
Based on official PydanticAI chat example patterns
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from pydantic_ai import Agent, RunContext
from pydantic_ai.models.openai import OpenAIModel
import asyncio
import json
from typing import AsyncGenerator
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Iraqi AI Chat API")

# Request/Response Models
class ChatRequest(BaseModel):
    message: str
    language: str = "english"  # "arabic" or "english"

class ChatResponse(BaseModel):
    response: str
    language: str

# PydanticAI Agent Setup
model = OpenAIModel('gpt-4o', api_key=os.getenv('OPENAI_API_KEY'))

# Iraqi context for the agent
iraqi_context = """
You are an AI assistant designed to help Iraqi users. You can communicate in both Arabic and English.

Key guidelines:
- If user writes in Arabic, respond in Arabic
- If user writes in English, respond in English
- Recognize basic Iraqi dialect phrases like "شلونك؟" (How are you?)
- Be respectful and culturally sensitive
- Use appropriate Islamic greetings when appropriate
- Keep responses helpful and friendly

Basic Iraqi dialect vocabulary:
- شلونك؟ = How are you?
- وين = Where
- شگد = How much/many
- أكو = There is/exists
- مو = No/not
"""

# Create agent with Iraqi context
agent = Agent(
    model,
    system_prompt=iraqi_context,
    retries=2,
)

@app.post("/api/chat", response_class=StreamingResponse)
async def chat_stream(request: ChatRequest):
    """
    Stream chat responses from PydanticAI agent
    """
    try:
        async def generate_response() -> AsyncGenerator[str, None]:
            # Add language context to the message
            enhanced_message = f"[Language: {request.language}] {request.message}"
            
            # Stream response from agent
            async with agent.run_stream(enhanced_message) as result:
                async for chunk in result.stream():
                    if chunk:
                        # Format as SSE (Server-Sent Events)
                        yield f"data: {json.dumps({'content': chunk})}\n\n"
            
            # Send completion signal
            yield f"data: {json.dumps({'done': True})}\n\n"

        return StreamingResponse(
            generate_response(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
            }
        )
    
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Chat processing failed")

@app.post("/api/chat/simple")
async def chat_simple(request: ChatRequest) -> ChatResponse:
    """
    Simple non-streaming chat endpoint
    """
    try:
        enhanced_message = f"[Language: {request.language}] {request.message}"
        
        result = await agent.run(enhanced_message)
        
        return ChatResponse(
            response=result.data,
            language=request.language
        )
    
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Chat processing failed")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "iraqi-ai-chat"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)