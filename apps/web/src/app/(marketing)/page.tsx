import { Container } from "@/components/layout/container";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center section-spacing">
      <Container size="md">
        <div className="text-center">
          <h1 className="text-heading-1 mb-4">Iraqi AI Chat System</h1>
          <p className="text-body-large text-gray-600">
            Next.js 15 + React 19 + Tailwind CSS
          </p>
        </div>
      </Container>
    </main>
  );
}
