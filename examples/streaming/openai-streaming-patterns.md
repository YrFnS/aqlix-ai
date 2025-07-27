# OpenAI Streaming Response Patterns

Examples for implementing real-time chat responses.

## Backend: FastAPI Streaming

```python
from fastapi.responses import StreamingResponse
import json

async def stream_openai_response(message: str):
    """Stream OpenAI responses to frontend"""
    
    async def generate():
        try:
            # OpenAI streaming call
            stream = await openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[{"role": "user", "content": message}],
                stream=True
            )
            
            async for chunk in stream:
                if chunk.choices[0].delta.content:
                    content = chunk.choices[0].delta.content
                    # Format as Server-Sent Events
                    yield f"data: {json.dumps({'content': content})}\n\n"
            
            # Signal completion
            yield f"data: {json.dumps({'done': True})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )
```

## Frontend: Next.js Streaming Client

```typescript
// Hook for streaming chat
export function useStreamingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string, language: string) => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, language }),
      });

      if (!response.body) throw new Error('No response stream');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let aiMessage = {
        id: Date.now().toString(),
        content: '',
        isUser: false,
        language: language as 'arabic' | 'english',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.content) {
                aiMessage.content += data.content;
                setMessages(prev =>
                  prev.map(msg =>
                    msg.id === aiMessage.id
                      ? { ...msg, content: aiMessage.content }
                      : msg
                  )
                );
              }
              
              if (data.done) {
                return; // Stream complete
              }
              
              if (data.error) {
                throw new Error(data.error);
              }
            } catch (e) {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}
```

## Error Handling Patterns

```typescript
// Robust streaming with retry logic
class StreamingChatClient {
  private retryCount = 0;
  private maxRetries = 3;

  async streamWithRetry(message: string, language: string) {
    try {
      await this.stream(message, language);
      this.retryCount = 0; // Reset on success
    } catch (error) {
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retry attempt ${this.retryCount}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.streamWithRetry(message, language);
      }
      throw error;
    }
  }

  private async stream(message: string, language: string) {
    // Streaming implementation with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message, language }),
        signal: controller.signal,
      });

      // Handle streaming...
    } finally {
      clearTimeout(timeout);
    }
  }
}
```

## Key Benefits

- **Real-time Experience**: Users see responses as they're generated
- **Better UX**: No waiting for complete response
- **Error Recovery**: Handle connection drops gracefully
- **Scalable**: Efficient resource usage with streaming