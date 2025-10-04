import Link from "next/link";

export default function BlogHome() {
  const posts = [
    {
      slug: "introducing-iraqi-ai",
      title: "Introducing Iraqi AI Chat System",
      description:
        "Learn about our mission to provide AI chat with Iraqi dialect support",
      date: "2025-10-01",
    },
    {
      slug: "arabic-nlp-advances",
      title: "Advances in Arabic NLP",
      description: "How we improved Iraqi dialect recognition using modern NLP",
      date: "2025-09-15",
    },
    {
      slug: "cultural-compliance",
      title: "Cultural Compliance in AI",
      description: "Ensuring AI responses respect Iraqi cultural values",
      date: "2025-09-01",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <p className="text-lg text-gray-600 mb-8">
        Latest updates and insights from the Iraqi AI team.
      </p>
      <div className="space-y-6 max-w-3xl">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block border rounded-lg p-6 hover:border-blue-600 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-semibold">{post.title}</h2>
              <span className="text-sm text-gray-500">{post.date}</span>
            </div>
            <p className="text-gray-600">{post.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
