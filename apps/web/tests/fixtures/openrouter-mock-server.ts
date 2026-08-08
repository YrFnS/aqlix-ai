const port = Number.parseInt(process.env.OPENROUTER_MOCK_PORT ?? "4011", 10);
const expectedKey = "openrouter-test-user-owned-key-2026";
const freeModelId = "fixture/live-free-model:free";
const paidModelId = "fixture/live-paid-model";

function authorized(request: Request): boolean {
  return request.headers.get("authorization") === `Bearer ${expectedKey}`;
}

function json(data: unknown, status = 200): Response {
  return Response.json(data, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

const models = [
  {
    id: freeModelId,
    canonical_slug: "fixture/live-free-model",
    name: "Live Free Fixture Model",
    description: "A deterministic free model returned by the live catalog fixture.",
    created: 1786147200,
    context_length: 65536,
    expiration_date: null,
    architecture: {
      input_modalities: ["text"],
      output_modalities: ["text"],
      modality: "text->text",
    },
    supported_parameters: ["max_tokens"],
    pricing: {
      prompt: "0",
      completion: "0",
      request: "0",
      image: "0",
    },
    top_provider: {
      max_completion_tokens: 4096,
    },
  },
  {
    id: paidModelId,
    canonical_slug: paidModelId,
    name: "Live Paid Fixture Model",
    description: "A deterministic paid model returned by the live catalog fixture.",
    created: 1786060800,
    context_length: 131072,
    expiration_date: null,
    architecture: {
      input_modalities: ["text"],
      output_modalities: ["text"],
      modality: "text->text",
    },
    supported_parameters: ["max_tokens"],
    pricing: {
      prompt: "0.000001",
      completion: "0.000002",
      request: "0",
      image: "0",
    },
    top_provider: {
      max_completion_tokens: 8192,
    },
  },
];

Bun.serve({
  hostname: "127.0.0.1",
  port,
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/v1/health") {
      return json({ status: "ok" });
    }

    if (!authorized(request)) {
      return json({ error: { message: "Fixture key rejected" } }, 401);
    }

    if (request.method === "GET" && url.pathname === "/api/v1/key") {
      return json({
        data: {
          label: "P5 browser fixture key",
          usage: 0,
          limit: 5,
          limit_remaining: 5,
          is_free_tier: true,
          expires_at: null,
        },
      });
    }

    if (
      request.method === "GET" &&
      url.pathname === "/api/v1/models/user"
    ) {
      return json({ data: models });
    }

    if (
      request.method === "POST" &&
      url.pathname === "/api/v1/chat/completions"
    ) {
      const body = (await request.json()) as {
        model?: string;
        stream?: boolean;
        messages?: Array<{ role?: string; content?: string }>;
      };

      if (!models.some((model) => model.id === body.model)) {
        return json({ error: { message: "Fixture model unavailable" } }, 404);
      }
      if (body.stream !== true) {
        return json({ error: { message: "Fixture requires streaming" } }, 400);
      }

      const userContent =
        [...(body.messages ?? [])]
          .reverse()
          .find((message) => message.role === "user")?.content ?? "";
      const responseText = userContent.includes("العربية")
        ? "استجابة OpenRouter اختبارية محفوظة بالعربية وEnglish 2026."
        : "A deterministic OpenRouter response was streamed and saved.";
      const chunks = [responseText.slice(0, 24), responseText.slice(24)].filter(
        Boolean,
      );
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          const encoder = new TextEncoder();
          for (const content of chunks) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  id: "generation_fixture_2026",
                  model: body.model,
                  choices: [{ delta: { content }, finish_reason: null }],
                })}\n\n`,
              ),
            );
          }
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                id: "generation_fixture_2026",
                model: body.model,
                choices: [{ delta: {}, finish_reason: "stop" }],
                usage: {
                  prompt_tokens: 20,
                  completion_tokens: 12,
                  total_tokens: 32,
                  completion_tokens_details: { reasoning_tokens: 0 },
                },
              })}\n\n`,
            ),
          );
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        },
      });

      return new Response(stream, {
        status: 200,
        headers: {
          "content-type": "text/event-stream; charset=utf-8",
          "cache-control": "no-store",
          "x-generation-id": "generation_fixture_2026",
        },
      });
    }

    return json({ error: { message: "Fixture endpoint not found" } }, 404);
  },
});

console.info(`OpenRouter fixture listening on http://127.0.0.1:${port}`);
