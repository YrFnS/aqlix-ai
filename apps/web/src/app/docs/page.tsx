import Link from "next/link";

export default function DocsHome() {
  const docs = [
    {
      slug: "getting-started",
      title: "Getting Started",
      description: "Quick start guide for Iraqi AI Chat System",
    },
    {
      slug: "api-reference",
      title: "API Reference",
      description: "Complete API documentation and endpoints",
    },
    {
      slug: "arabic-support",
      title: "Arabic Support",
      description: "Iraqi dialect and RTL layout features",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-6">Documentation</h1>
      <p className="text-lg text-gray-600 mb-8">
        Learn how to use the Iraqi AI Chat System with our comprehensive guides.
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {docs.map((doc) => (
          <Link
            key={doc.slug}
            href={`/docs/${doc.slug}`}
            className="border rounded-lg p-6 hover:border-blue-600 hover:shadow-md transition-all"
          >
            <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
            <p className="text-gray-600">{doc.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
