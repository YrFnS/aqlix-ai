# Enterprise Document Processing Extraction (TIER 1)

Extracted from anything-llm: Vector DB providers (Supabase with Arabic BERT), PDF converter (PyPDF2 for legal/medical with tags), chunking strategy (sentence-based for Arabic, NLTK integration), core utilities (embed/index to pgvector).

Iraqi Adaptations:

- Arabic embeddings for 95%+ accuracy in legal/medical docs.
- Cultural filtering during chunking (e.g., tag sensitive sections).
- Integration: Use in RAG for Iraqi KB (iraqi_legal_kb table).

Files: server/utils/vector_db_providers/index.py (providers with Arabic support), collector/processSingleFile/convert/pdf_converter.py (Arabic PDF extraction), server/utils/document_processing.py (chunking/embedding).

Test: `python -m pytest test_document_processing.py` (add tests for Arabic OCR).
