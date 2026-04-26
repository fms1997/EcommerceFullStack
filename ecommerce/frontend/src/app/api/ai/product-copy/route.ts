import { NextResponse } from "next/server";
import { ProductCopyRequest, ProductCopyResponse } from "@/modules/admin/types/ai-copy";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProductCopyRequest;

    if (!body?.name?.trim()) {
      return NextResponse.json({ message: "El nombre es obligatorio." }, { status: 400 });
    }

    const prompt = `
Eres un copywriter de ecommerce.
Responde SOLO JSON válido con esta forma:
{
  "short_description": "string",
  "bullet_points": ["string", "string", "string"],
  "seo_title": "string"
}
Reglas:
- Idioma: español.
- short_description: máximo 80 palabras.
- bullet_points: 3 a 5 puntos.
- seo_title: máximo 60 caracteres.
- No inventes especificaciones no proporcionadas.

Producto:
- nombre: ${body.name}
- categoría: ${body.category ?? "N/A"}
- features: ${(body.features ?? []).join(", ") || "N/A"}
`.trim();

    const ollamaResponse = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      model: "qwen2.5:3b",
      prompt,
      stream: false,
      }),
    });

    if (!ollamaResponse.ok) {
      const detail = await ollamaResponse.text();
      return NextResponse.json(
        { message: "Error llamando a Ollama.", detail },
        { status: 502 },
      );
    }

    const data = await ollamaResponse.json();
    const text = data?.response;

    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { message: "Ollama no devolvió texto válido." },
        { status: 502 },
      );
    }

    let parsed: ProductCopyResponse;
    try {
      parsed = JSON.parse(text) as ProductCopyResponse;
    } catch {
      return NextResponse.json(
        { message: "La IA no devolvió JSON válido.", raw: text },
        { status: 502 },
      );
    }

    if (
      !parsed.short_description ||
      !Array.isArray(parsed.bullet_points) ||
      !parsed.seo_title
    ) {
      return NextResponse.json(
        { message: "JSON incompleto.", raw: parsed },
        { status: 502 },
      );
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error inesperado.", error: String(error) },
      { status: 500 },
    );
  }
}