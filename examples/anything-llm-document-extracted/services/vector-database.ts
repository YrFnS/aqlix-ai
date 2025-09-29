/**
 * Iraqi Enhanced Vector Database Service
 * Extracted and enhanced from anything-llm with Iraqi cultural context
 *
 * Features:
 * - Multi-database support (Pinecone, Weaviate, ChromaDB, Qdrant)
 * - Arabic text embeddings with cultural context
 * - Professional domain indexing for Iraqi sectors
 * - Islamic compliance metadata storage
 * - Semantic search with Iraqi dialect awareness
 * - Cultural similarity scoring
 */

import Redis from "ioredis";
import { PineconeClient } from "@pinecone-database/pinecone";
import weaviate from "weaviate-ts-client";
import { ChromaClient } from "chromadb";
import { QdrantClient } from "@qdrant/js-client-rest";
import OpenAI from "openai";

export interface IraqiDocumentEmbedding {
  id: string;
  content: string;
  contentAr?: string;
  embedding: number[];
  metadata: {
    // Core metadata
    source: string;
    fileType: string;
    processedAt: string;
    userId: string;
    workspaceId: string;

    // Iraqi-specific metadata
    professionalDomain?:
      | "legal"
      | "medical"
      | "educational"
      | "business"
      | "engineering";
    culturalCompliance: {
      islamicCompliance: number; // 0-100%
      politicalNeutrality: number;
      culturalSensitivity: number;
      overallScore: number;
    };
    arabicContent: {
      hasArabicText: boolean;
      arabicRatio: number; // 0-1
      dialect: "baghdad" | "basra" | "mosul" | "general" | "standard";
      rtlProcessed: boolean;
    };

    // Professional metadata
    legalMetadata?: {
      caseType: string;
      courtLevel: string;
      lawCategory: string;
      urgencyLevel: "low" | "medium" | "high" | "critical";
    };
    medicalMetadata?: {
      specialty: string;
      patientPrivacyLevel: string;
      treatmentType: string;
      islamicEthicsCompliant: boolean;
    };
    educationalMetadata?: {
      subject: string;
      educationLevel: string;
      curriculumAlignment: string;
      islamicEducationCompliant: boolean;
    };
    businessMetadata?: {
      businessType: string;
      halalCompliant: boolean;
      financialInstruments: string[];
      riskLevel: string;
    };
    engineeringMetadata?: {
      discipline: string;
      safetyStandards: string[];
      environmentalCompliance: boolean;
      iraqiBuildingCodes: boolean;
    };
  };
}

export interface VectorSearchQuery {
  query: string;
  queryAr?: string;
  workspaceId?: string;
  professionalDomain?: string;
  culturalFilters?: {
    minIslamicCompliance?: number;
    minPoliticalNeutrality?: number;
    requireArabicContent?: boolean;
    dialectPreference?: string;
  };
  limit?: number;
  threshold?: number;
}

export interface VectorSearchResult {
  id: string;
  content: string;
  contentAr?: string;
  score: number;
  culturalScore?: number;
  metadata: IraqiDocumentEmbedding["metadata"];
}

export class IraqiVectorDatabaseService {
  private redis: Redis;
  private openai: OpenAI;
  private pinecone?: PineconeClient;
  private weaviate?: any;
  private chroma?: ChromaClient;
  private qdrant?: QdrantClient;
  private activeProvider: "pinecone" | "weaviate" | "chroma" | "qdrant";

  constructor(
    redisUrl: string,
    openaiApiKey: string,
    vectorConfig: {
      provider: "pinecone" | "weaviate" | "chroma" | "qdrant";
      config: any;
    },
  ) {
    this.redis = new Redis(redisUrl);
    this.openai = new OpenAI({ apiKey: openaiApiKey });
    this.activeProvider = vectorConfig.provider;

    this.initializeVectorDatabase(vectorConfig);
  }

  private async initializeVectorDatabase(config: any): Promise<void> {
    switch (config.provider) {
      case "pinecone":
        this.pinecone = new PineconeClient();
        await this.pinecone.init({
          environment: config.config.environment,
          apiKey: config.config.apiKey,
        });
        break;

      case "weaviate":
        this.weaviate = weaviate.client({
          scheme: config.config.scheme || "http",
          host: config.config.host,
        });
        break;

      case "chroma":
        this.chroma = new ChromaClient({
          path: config.config.path,
        });
        break;

      case "qdrant":
        this.qdrant = new QdrantClient({
          url: config.config.url,
          apiKey: config.config.apiKey,
        });
        break;
    }
  }

  /**
   * Generate embeddings with Iraqi cultural context
   */
  async generateEmbeddings(
    content: string,
    contentAr?: string,
    culturalContext?: {
      professionalDomain?: string;
      culturalTags?: string[];
      islamicContext?: string;
    },
  ): Promise<number[]> {
    try {
      // Combine content with cultural context for better embeddings
      let enhancedContent = content;

      if (contentAr) {
        enhancedContent += `\n[Arabic]: ${contentAr}`;
      }

      if (culturalContext?.professionalDomain) {
        enhancedContent += `\n[Domain]: ${culturalContext.professionalDomain}`;
      }

      if (culturalContext?.islamicContext) {
        enhancedContent += `\n[Islamic Context]: ${culturalContext.islamicContext}`;
      }

      if (culturalContext?.culturalTags?.length) {
        enhancedContent += `\n[Cultural Tags]: ${culturalContext.culturalTags.join(", ")}`;
      }

      const response = await this.openai.embeddings.create({
        model: "text-embedding-3-large",
        input: enhancedContent,
        dimensions: 1536,
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embeddings:", error);
      throw new Error("Failed to generate embeddings");
    }
  }

  /**
   * Store document embedding in vector database
   */
  async storeEmbedding(embedding: IraqiDocumentEmbedding): Promise<void> {
    const cacheKey = `embedding:${embedding.id}`;

    try {
      switch (this.activeProvider) {
        case "pinecone":
          await this.storePineconeEmbedding(embedding);
          break;
        case "weaviate":
          await this.storeWeaviateEmbedding(embedding);
          break;
        case "chroma":
          await this.storeChromaEmbedding(embedding);
          break;
        case "qdrant":
          await this.storeQdrantEmbedding(embedding);
          break;
      }

      // Cache embedding metadata
      await this.redis.setex(
        cacheKey,
        3600, // 1 hour cache
        JSON.stringify({
          metadata: embedding.metadata,
          storedAt: new Date().toISOString(),
        }),
      );

      console.log(`Stored embedding ${embedding.id} in ${this.activeProvider}`);
    } catch (error) {
      console.error("Error storing embedding:", error);
      throw error;
    }
  }

  /**
   * Search embeddings with Iraqi cultural context
   */
  async searchEmbeddings(
    query: VectorSearchQuery,
  ): Promise<VectorSearchResult[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await this.generateEmbeddings(
        query.query,
        query.queryAr,
        {
          professionalDomain: query.professionalDomain,
          culturalTags: query.culturalFilters
            ? Object.keys(query.culturalFilters).filter(
                (key) =>
                  query.culturalFilters![
                    key as keyof typeof query.culturalFilters
                  ],
              )
            : undefined,
        },
      );

      let results: VectorSearchResult[] = [];

      switch (this.activeProvider) {
        case "pinecone":
          results = await this.searchPinecone(queryEmbedding, query);
          break;
        case "weaviate":
          results = await this.searchWeaviate(queryEmbedding, query);
          break;
        case "chroma":
          results = await this.searchChroma(queryEmbedding, query);
          break;
        case "qdrant":
          results = await this.searchQdrant(queryEmbedding, query);
          break;
      }

      // Apply cultural filtering and scoring
      results = await this.applyCulturalFiltering(results, query);

      // Sort by combined cultural and semantic score
      results.sort((a, b) => {
        const scoreA = a.score * 0.7 + (a.culturalScore || 0) * 0.3;
        const scoreB = b.score * 0.7 + (b.culturalScore || 0) * 0.3;
        return scoreB - scoreA;
      });

      return results.slice(0, query.limit || 20);
    } catch (error) {
      console.error("Error searching embeddings:", error);
      throw error;
    }
  }

  /**
   * Apply cultural filtering and scoring to search results
   */
  private async applyCulturalFiltering(
    results: VectorSearchResult[],
    query: VectorSearchQuery,
  ): Promise<VectorSearchResult[]> {
    return results
      .filter((result) => {
        const { culturalFilters } = query;
        if (!culturalFilters) return true;

        const { culturalCompliance, arabicContent } = result.metadata;

        // Apply cultural filters
        if (
          culturalFilters.minIslamicCompliance &&
          culturalCompliance.islamicCompliance <
            culturalFilters.minIslamicCompliance
        ) {
          return false;
        }

        if (
          culturalFilters.minPoliticalNeutrality &&
          culturalCompliance.politicalNeutrality <
            culturalFilters.minPoliticalNeutrality
        ) {
          return false;
        }

        if (
          culturalFilters.requireArabicContent &&
          !arabicContent.hasArabicText
        ) {
          return false;
        }

        if (
          culturalFilters.dialectPreference &&
          arabicContent.dialect !== culturalFilters.dialectPreference &&
          arabicContent.dialect !== "general"
        ) {
          return false;
        }

        return true;
      })
      .map((result) => {
        // Calculate cultural score
        const culturalScore = this.calculateCulturalScore(result, query);
        return {
          ...result,
          culturalScore,
        };
      });
  }

  /**
   * Calculate cultural relevance score
   */
  private calculateCulturalScore(
    result: VectorSearchResult,
    query: VectorSearchQuery,
  ): number {
    let score = 0;
    const { metadata } = result;

    // Cultural compliance scoring
    score += metadata.culturalCompliance.overallScore * 0.3;

    // Professional domain match
    if (
      query.professionalDomain &&
      metadata.professionalDomain === query.professionalDomain
    ) {
      score += 25;
    }

    // Arabic content preference
    if (query.queryAr && metadata.arabicContent.hasArabicText) {
      score += 20;

      // Dialect preference bonus
      if (
        query.culturalFilters?.dialectPreference &&
        metadata.arabicContent.dialect ===
          query.culturalFilters.dialectPreference
      ) {
        score += 10;
      }
    }

    // Islamic compliance bonus
    if (metadata.culturalCompliance.islamicCompliance > 85) {
      score += 15;
    }

    return Math.min(score, 100);
  }

  // Provider-specific implementation methods
  private async storePineconeEmbedding(
    embedding: IraqiDocumentEmbedding,
  ): Promise<void> {
    if (!this.pinecone) throw new Error("Pinecone not initialized");

    const index = this.pinecone.Index("iraqi-documents");
    await index.upsert({
      upsertRequest: {
        vectors: [
          {
            id: embedding.id,
            values: embedding.embedding,
            metadata: embedding.metadata as any,
          },
        ],
      },
    });
  }

  private async storeWeaviateEmbedding(
    embedding: IraqiDocumentEmbedding,
  ): Promise<void> {
    if (!this.weaviate) throw new Error("Weaviate not initialized");

    await this.weaviate.data
      .creator()
      .withClassName("IraqiDocument")
      .withId(embedding.id)
      .withVector(embedding.embedding)
      .withProperties({
        content: embedding.content,
        contentAr: embedding.contentAr,
        ...embedding.metadata,
      })
      .do();
  }

  private async storeChromaEmbedding(
    embedding: IraqiDocumentEmbedding,
  ): Promise<void> {
    if (!this.chroma) throw new Error("ChromaDB not initialized");

    const collection = await this.chroma.getOrCreateCollection({
      name: "iraqi-documents",
    });

    await collection.add({
      ids: [embedding.id],
      embeddings: [embedding.embedding],
      documents: [embedding.content],
      metadatas: [embedding.metadata as any],
    });
  }

  private async storeQdrantEmbedding(
    embedding: IraqiDocumentEmbedding,
  ): Promise<void> {
    if (!this.qdrant) throw new Error("Qdrant not initialized");

    await this.qdrant.upsert("iraqi-documents", {
      wait: true,
      points: [
        {
          id: embedding.id,
          vector: embedding.embedding,
          payload: {
            content: embedding.content,
            contentAr: embedding.contentAr,
            ...embedding.metadata,
          },
        },
      ],
    });
  }

  private async searchPinecone(
    queryEmbedding: number[],
    query: VectorSearchQuery,
  ): Promise<VectorSearchResult[]> {
    if (!this.pinecone) throw new Error("Pinecone not initialized");

    const index = this.pinecone.Index("iraqi-documents");
    const response = await index.query({
      queryRequest: {
        vector: queryEmbedding,
        topK: query.limit || 20,
        includeMetadata: true,
        filter: query.workspaceId
          ? { workspaceId: query.workspaceId }
          : undefined,
      },
    });

    return (
      response.matches?.map((match) => ({
        id: match.id,
        content: match.metadata?.content as string,
        contentAr: match.metadata?.contentAr as string,
        score: match.score || 0,
        metadata: match.metadata as any,
      })) || []
    );
  }

  private async searchWeaviate(
    queryEmbedding: number[],
    query: VectorSearchQuery,
  ): Promise<VectorSearchResult[]> {
    if (!this.weaviate) throw new Error("Weaviate not initialized");

    const response = await this.weaviate.graphql
      .get()
      .withClassName("IraqiDocument")
      .withFields("content contentAr _additional { certainty }")
      .withNearVector({ vector: queryEmbedding })
      .withLimit(query.limit || 20)
      .do();

    return response.data.Get.IraqiDocument.map((item: any) => ({
      id: item.id,
      content: item.content,
      contentAr: item.contentAr,
      score: item._additional.certainty,
      metadata: item,
    }));
  }

  private async searchChroma(
    queryEmbedding: number[],
    query: VectorSearchQuery,
  ): Promise<VectorSearchResult[]> {
    if (!this.chroma) throw new Error("ChromaDB not initialized");

    const collection = await this.chroma.getCollection({
      name: "iraqi-documents",
    });

    const response = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: query.limit || 20,
    });

    return response.ids[0].map((id, index) => ({
      id,
      content: response.documents?.[0]?.[index] || "",
      contentAr: response.metadatas?.[0]?.[index]?.contentAr as string,
      score: 1 - (response.distances?.[0]?.[index] || 0),
      metadata: response.metadatas?.[0]?.[index] as any,
    }));
  }

  private async searchQdrant(
    queryEmbedding: number[],
    query: VectorSearchQuery,
  ): Promise<VectorSearchResult[]> {
    if (!this.qdrant) throw new Error("Qdrant not initialized");

    const response = await this.qdrant.search("iraqi-documents", {
      vector: queryEmbedding,
      limit: query.limit || 20,
      with_payload: true,
    });

    return response.map((hit) => ({
      id: hit.id as string,
      content: hit.payload?.content as string,
      contentAr: hit.payload?.contentAr as string,
      score: hit.score,
      metadata: hit.payload as any,
    }));
  }

  /**
   * Delete embedding from vector database
   */
  async deleteEmbedding(embeddingId: string): Promise<void> {
    const cacheKey = `embedding:${embeddingId}`;

    try {
      switch (this.activeProvider) {
        case "pinecone":
          if (this.pinecone) {
            const index = this.pinecone.Index("iraqi-documents");
            await index.delete1({ ids: [embeddingId] });
          }
          break;
        case "weaviate":
          if (this.weaviate) {
            await this.weaviate.data
              .deleter()
              .withClassName("IraqiDocument")
              .withId(embeddingId)
              .do();
          }
          break;
        case "chroma":
          if (this.chroma) {
            const collection = await this.chroma.getCollection({
              name: "iraqi-documents",
            });
            await collection.delete({ ids: [embeddingId] });
          }
          break;
        case "qdrant":
          if (this.qdrant) {
            await this.qdrant.delete("iraqi-documents", {
              wait: true,
              points: [embeddingId],
            });
          }
          break;
      }

      await this.redis.del(cacheKey);
      console.log(
        `Deleted embedding ${embeddingId} from ${this.activeProvider}`,
      );
    } catch (error) {
      console.error("Error deleting embedding:", error);
      throw error;
    }
  }

  /**
   * Get collection statistics
   */
  async getCollectionStats(): Promise<{
    totalDocuments: number;
    byProfessionalDomain: Record<string, number>;
    culturalComplianceAverage: number;
    arabicContentRatio: number;
  }> {
    try {
      const cacheKey = "vector:stats";
      const cached = await this.redis.get(cacheKey);

      if (cached) {
        return JSON.parse(cached);
      }

      // Implementation would vary by provider
      // This is a placeholder for stats calculation
      const stats = {
        totalDocuments: 0,
        byProfessionalDomain: {},
        culturalComplianceAverage: 0,
        arabicContentRatio: 0,
      };

      await this.redis.setex(cacheKey, 300, JSON.stringify(stats));
      return stats;
    } catch (error) {
      console.error("Error getting collection stats:", error);
      throw error;
    }
  }
}
