import { BlogPageParams } from "@/types/routes";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<BlogPageParams>;
}

// Mock blog data
const posts = {
  "introducing-iraqi-ai": {
    title: "Introducing Iraqi AI Chat System",
    date: "2025-10-01",
    author: "Iraqi AI Team",
    content: `
      We're excited to introduce the Iraqi AI Chat System, a revolutionary platform designed
      specifically for Iraqi users with full support for Iraqi Arabic dialect.

      ## Our Mission

      Our mission is to make AI accessible and culturally appropriate for Iraqi professionals
      and everyday users. We believe technology should adapt to culture, not the other way around.

      ## Key Features

      - **Iraqi Dialect Support**: Native support for Baghdad, Southern, and Northern dialects
      - **Cultural Compliance**: All responses respect Islamic values and Iraqi cultural norms
      - **Professional Tools**: Specialized features for legal, medical, and educational professionals
      - **RTL-First Design**: Beautiful, proper right-to-left interfaces

      ## What's Next

      We're continuously improving our AI models and adding new features based on your feedback.
      Stay tuned for more updates!
    `,
  },
  "arabic-nlp-advances": {
    title: "Advances in Arabic NLP",
    date: "2025-09-15",
    author: "Dr. Ahmed Al-Iraqi",
    content: `
      Natural Language Processing for Arabic, especially Iraqi dialect, presents unique challenges.
      Here's how we're addressing them.

      ## Dialect Recognition

      Iraqi Arabic differs significantly from Modern Standard Arabic. Our system uses:
      - Custom-trained dialect classifiers
      - Regional vocabulary databases
      - Context-aware understanding

      ## Technical Innovations

      We've implemented several novel approaches:
      1. Hybrid neural architectures
      2. Transfer learning from MSA to Iraqi dialect
      3. Cultural context embeddings

      ## Results

      Our latest models achieve 95%+ accuracy in Iraqi dialect recognition, a significant
      improvement over generic Arabic NLP systems.
    `,
  },
  "cultural-compliance": {
    title: "Cultural Compliance in AI",
    date: "2025-09-01",
    author: "Sarah Al-Baghdadi",
    content: `
      Ensuring AI systems respect cultural values is critical, especially in regions with
      strong cultural and religious traditions.

      ## Our Approach

      We've developed a comprehensive cultural compliance framework:
      - Islamic value alignment
      - Political neutrality checks
      - Professional etiquette validation

      ## Implementation

      Every AI response goes through multiple validation layers:
      1. Content filtering for cultural appropriateness
      2. Respect for Islamic principles
      3. Professional context awareness

      ## Community Feedback

      We actively incorporate feedback from Iraqi users to continuously improve our
      cultural compliance mechanisms.
    `,
  },
};

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params;

  const post = posts[slug as keyof typeof posts];

  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      <Link
        href="/blog"
        className="text-blue-600 hover:underline mb-4 inline-block"
      >
        ← Back to Blog
      </Link>
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <div className="flex gap-4 text-gray-600 mb-8">
        <span>{post.date}</span>
        <span>•</span>
        <span>By {post.author}</span>
      </div>
      <div className="prose prose-lg max-w-none">
        {post.content.split("\n").map((line, i) => (
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
    { slug: "introducing-iraqi-ai" },
    { slug: "arabic-nlp-advances" },
    { slug: "cultural-compliance" },
  ];
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = posts[slug as keyof typeof posts];

  return {
    title: post ? `${post.title} | Iraqi AI Blog` : "Post Not Found",
    description: post ? post.content.substring(0, 155) : undefined,
  };
}
