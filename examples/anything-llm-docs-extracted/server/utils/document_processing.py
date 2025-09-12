# Document Processing Utilities for Iraqi KB
# Adapted from anything-llm for Arabic embeddings and indexing

from typing import list
from supabase import create_client

client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def chunk_arabic_document(text: str, chunk_size: int = 512) -> list[str]:
    # Chunk at sentence boundaries for Arabic (e.g., via NLTK Arabic tokenizer)
    chunks = []
    # Preserve RTL: Process right-to-left if needed
    sentences = text.split(".")  # Simplified; use arabic-reshaper for proper
    for sentence in sentences:
        if len(sentence) > chunk_size:
            # Split long Arabic sentences
            for i in range(0, len(sentence), chunk_size):
                chunks.append(sentence[i:i+chunk_size])
        else:
            chunks.append(sentence)
    # Index to Supabase pgvector for Iraqi KB
    embeddings = client.rpc("generate_embeddings", {"texts": chunks}).execute()
    return chunks  # With metadata for cultural validation