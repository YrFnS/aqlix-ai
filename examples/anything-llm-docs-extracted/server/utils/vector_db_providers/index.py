# Vector DB Providers for Iraqi Document Processing
# Adapted from anything-llm for Arabic/RTL documents

from typing import Optional, Any
from pydantic import BaseModel
from supabase import create_client


class VectorDBProvider(BaseModel):
    name: str
    supports_arabic: bool = True
    embedding_model: str = "arabic-bert-base"  # Arabic embeddings


class SupabaseVectorProvider(VectorDBProvider):
    def __init__(self):
        super().__init__(name="supabase")
        self.client = create_client(
            os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY")
        )

    def embed_document(self, chunks: list[str]) -> list[str]:
        # Embed Arabic chunks with cultural context
        embeddings = self.client.rpc(
            "embed_arabic_chunks", {"chunks": chunks}
        ).execute()
        return embeddings.data  # Return vector IDs

    def query_similar(self, query_embedding: list[float]) -> list[dict]:
        results = self.client.rpc(
            "query_iraqi_kb", {"embedding": query_embedding}
        ).execute()
        return results.data  # With cultural filter
