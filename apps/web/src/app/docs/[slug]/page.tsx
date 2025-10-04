import { DocPageParams } from "@/types/routes";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<DocPageParams>;
}

// Mock docs data
const docs = {
  "getting-started": {
    title: "Getting Started",
    content: `
      Welcome to the Iraqi AI Chat System! This guide will help you get started with our platform.

      ## Installation

      First, install the required dependencies:

      \`\`\`bash
      bun install
      \`\`\`

      ## Configuration

      Set up your environment variables in \`.env\`:

      - \`NEXT_PUBLIC_API_URL\`: Your API endpoint
      - \`ANTHROPIC_API_KEY\`: Your Anthropic API key

      ## First Steps

      1. Start the development server
      2. Configure your Iraqi dialect preferences
      3. Begin chatting with the AI assistant
    `,
  },
  "api-reference": {
    title: "API Reference",
    content: `
      Complete API documentation for the Iraqi AI Chat System.

      ## Endpoints

      ### POST /api/chat
      Send a chat message to the AI assistant.

      **Request:**
      \`\`\`json
      {
        "message": "مرحبا، شلونك؟",
        "dialect": "iraqi"
      }
      \`\`\`

      **Response:**
      \`\`\`json
      {
        "reply": "اهلا وسهلا! انا زين، شكرا",
        "confidence": 0.95
      }
      \`\`\`

      ### GET /api/docs
      Retrieve available documentation.
    `,
  },
  "arabic-support": {
    title: "Arabic Support",
    content: `
      Learn about Arabic and Iraqi dialect features.

      ## Iraqi Dialect Recognition

      Our system supports Iraqi Arabic dialect with high accuracy:
      - Baghdad dialect
      - Southern Iraqi dialect
      - Northern Iraqi dialect

      ## RTL Layout

      All interfaces automatically adjust for right-to-left languages:
      - Proper text alignment
      - Mirrored navigation
      - Cultural appropriateness

      ## Language Switching

      Users can seamlessly switch between:
      - Iraqi Arabic
      - Standard Arabic
      - English
    `,
  },
};

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;

  const doc = docs[slug as keyof typeof docs];

  if (!doc) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/docs"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Documentation
      </Link>
      <h1 className="text-4xl font-bold mb-6">{doc.title}</h1>
      <div className="prose prose-lg max-w-none">
        {doc.content.split("\n").map((line, i) => (
          <p key={i} className="mb-4 whitespace-pre-wrap">
            {line}
          </p>
        ))}
      </div>
    </article>
  );
}

export async function generateStaticParams() {
  return [
    { slug: "getting-started" },
    { slug: "api-reference" },
    { slug: "arabic-support" },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const doc = docs[slug as keyof typeof docs];

  return {
    title: doc ? `${doc.title} | Iraqi AI Docs` : "Doc Not Found",
    description: doc ? `Documentation: ${doc.title}` : undefined,
  };
}
