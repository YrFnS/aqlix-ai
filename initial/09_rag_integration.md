# RAG Integration PydanticAI Agent for Iraqi AI Chat System

## FEATURE:

**Building an intelligent RAG-powered AI agent** for the Iraqi AI Chat System that enhances responses with relevant Iraqi professional knowledge, cultural context, and domain expertise through advanced retrieval capabilities and Arabic text embeddings.

**Developers should be able to:** Create a PydanticAI agent with RAG capabilities that retrieves relevant Iraqi knowledge, processes Arabic text embeddings, provides culturally appropriate responses, accesses professional domain expertise, and synthesizes responses with proper attribution and cultural validation.

---

## TOOLS:

**What specific tools and capabilities should this agent have?**

**Essential RAG capabilities for Iraqi knowledge enhancement:**

- **Vector Database Integration:** Advanced similarity search with Arabic text embeddings and cultural context weighting
- **Iraqi Knowledge Base Access:** Comprehensive retrieval from Iraqi professional domains and cultural databases
- **Arabic Text Processing:** Intelligent chunking, embedding, and retrieval of Arabic content with RTL awareness
- **Cultural Context Retrieval:** Access to Iraqi customs, Islamic values, and regional cultural knowledge
- **Professional Domain Expertise:** Specialized retrieval for Iraqi legal, medical, educational, and engineering knowledge
- **Query Expansion:** Intelligent query enhancement with Iraqi dialect and professional terminology
- **Response Synthesis:** RAG response generation with cultural appropriateness validation and source attribution
- **Relevance Scoring:** Advanced relevance scoring with Iraqi context weighting and cultural sensitivity
- **Multi-Modal Retrieval:** Support for text, document, and structured data retrieval from Iraqi sources

---

## DEPENDENCIES:

**What environment and configuration dependencies are needed?**

**RAG system infrastructure and Iraqi knowledge requirements:**

- **PydanticAI Framework:** https://ai.pydantic.dev/ - Agent framework with retrieval capabilities
- **Vector Databases:** Pinecone, Weaviate, or Chroma for Arabic text embeddings and similarity search
- **Embedding Models:** OpenAI Embeddings or Sentence-Transformers for Arabic text processing
- **Arabic NLP Libraries:** Text processing, chunking, and embedding optimization for Arabic content
- **Knowledge Bases:** Iraqi professional domain knowledge (legal, medical, educational, engineering)
- **Cultural Context Data:** Iraqi customs, Islamic values, and regional cultural knowledge
- **Performance Monitoring:** Retrieval performance tracking and optimization tools
- **Security Infrastructure:** Access control, content filtering, and audit logging systems

---

## SYSTEM PROMPT(S):

**What system prompt(s) should this agent use?**

**Main RAG Agent System Prompt:**
```
You are an intelligent RAG-powered AI assistant for Iraqi users. You enhance your responses with relevant knowledge from Iraqi professional domains, cultural context, and regional expertise.

Core Capabilities:
- Retrieve relevant Iraqi knowledge from professional domains (legal, medical, educational, engineering)
- Process Arabic text with proper RTL awareness and dialect recognition
- Provide culturally appropriate responses respecting Iraqi customs and Islamic values
- Synthesize responses with proper source attribution and cultural validation
- Understand Iraqi professional terminology and context

Guidelines:
- Always retrieve relevant knowledge before responding to professional queries
- Validate cultural appropriateness of all retrieved content
- Provide proper attribution for knowledge sources
- Respect professional boundaries for legal, medical, and professional advice
- Maintain privacy with session-only context and no persistent storage
- Use Iraqi dialect appropriately when speaking Arabic
```

**Cultural Validation Prompt:**
```
Before using retrieved knowledge, validate it for Iraqi cultural appropriateness:
- Ensure content respects Islamic values and Iraqi customs
- Check for political or sectarian sensitivity
- Verify professional accuracy for Iraqi standards
- Confirm appropriate cultural context for the region
```

---

## EXAMPLES:

**What working examples should be provided?**

**Working RAG implementation examples:**

- **Complete RAG Agent:** PydanticAI agent with vector database integration and Iraqi knowledge access
- **Arabic Embedding Pipeline:** Text processing, chunking, and embedding generation for Arabic content
- **Knowledge Base Integration:** Iraqi professional domain knowledge indexing and retrieval
- **Cultural Context Retrieval:** Iraqi customs and Islamic values integration with response synthesis
- **Query Processing:** Advanced query understanding with Iraqi dialect and terminology expansion
- **Response Synthesis:** RAG response generation with cultural validation and source attribution
- **Relevance Scoring:** Iraqi context-aware relevance scoring and ranking algorithms
- **Testing Patterns:** Comprehensive testing with Iraqi knowledge queries and cultural validation

---

## DOCUMENTATION:

**What specific documentation should be thoroughly researched and referenced?**

**RAG systems and Arabic NLP documentation:**

- **PydanticAI Documentation:** https://ai.pydantic.dev/ - Agent framework and tool integration patterns
- **Vector Database Docs:** Pinecone, Weaviate, Chroma documentation for Arabic text embeddings
- **Embedding Models:** OpenAI Embeddings, Sentence-Transformers for Arabic text processing
- **Arabic NLP Research:** Text processing, chunking, and embedding optimization for Arabic content
- **Knowledge Graph Systems:** Structured knowledge representation for Iraqi professional domains
- **Retrieval Algorithms:** Advanced similarity search and ranking for cultural context
- **RAG Architecture Papers:** Best practices for retrieval-augmented generation systems
- **Cultural AI Research:** Culturally-aware AI systems and bias mitigation techniques

---

## OTHER CONSIDERATIONS:

**Any additional considerations for this agent?**

**RAG development challenges and Iraqi-specific requirements:**

- **Arabic Embedding Quality:** Variable embedding quality for Iraqi dialect and professional terminology
- **Cultural Context Preservation:** Maintaining cultural nuance in knowledge retrieval and synthesis
- **Knowledge Base Accuracy:** Ensuring accuracy and currency of Iraqi professional knowledge
- **Retrieval Relevance:** Balancing similarity search with cultural and professional context
- **Response Attribution:** Proper source citation while maintaining response fluency
- **Professional Boundaries:** Maintaining appropriate boundaries for legal, medical, and professional advice
- **Performance Scaling:** Vector search performance with large Arabic knowledge bases
- **Knowledge Conflicts:** Resolving conflicts between different sources or cultural perspectives
- **Privacy Compliance:** Session-only context with automatic knowledge access cleanup
- **Mobile Optimization:** Efficient vector search suitable for mobile device limitations

---

**This initial file provides comprehensive requirements for building a RAG-powered AI agent with Iraqi knowledge integration, Arabic text embeddings, cultural context retrieval, and professional domain expertise for the Iraqi AI Chat System.**