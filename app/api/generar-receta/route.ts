import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    console.log("Procesando solicitud POST...");

    let { ingredientes } = await req.json();
    console.log("Ingredientes recibidos:", ingredientes);

    if (!ingredientes || ingredientes.length === 0) {
      return NextResponse.json({ error: 'Se requieren ingredientes' }, { status: 400 });
    }

    // Limitar a un máximo de 4 ingredientes
    ingredientes = ingredientes.slice(0, 4);

    // Construir el prompt para la receta
    const promptReceta = `Receta con: ${ingredientes.join(', ')}`;

    // Generar la receta y la imagen en paralelo
    const [respuestaReceta, respuestaImagen] = await Promise.all([
      openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un cocinero que genera recetas basadas en los ingredientes dados.',
          },
          {
            role: 'user',
            content: promptReceta,
          },
        ],
      }),
      openai.images.generate({
        prompt: `Un plato de comida con ${ingredientes.join(', ')}`,
        n: 1,
        size: "512x512", 
      }),
    ]);

    const receta = respuestaReceta.choices[0].message?.content || null;
    if (!receta) {
      return NextResponse.json({ error: 'No se pudo generar la receta' }, { status: 500 });
    }

    const urlImagen = respuestaImagen.data[0]?.url || null;
    if (!urlImagen) {
      return NextResponse.json({ error: 'No se pudo generar la imagen' }, { status: 500 });
    }

    return NextResponse.json({ receta, urlImagen });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error en la API:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error('Error desconocido:', error);
      return NextResponse.json({ error: 'Ha ocurrido un error desconocido' }, { status: 500 });
    }
  }
}