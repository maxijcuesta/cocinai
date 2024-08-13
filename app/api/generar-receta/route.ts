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

    if (!ingredientes) {
      console.error('No se proporcionaron ingredientes');
      return NextResponse.json({ error: 'Se requieren ingredientes' }, { status: 400 });
    }

    // Limitar a un máximo de 4 ingredientes
    if (ingredientes.length > 4) {
      ingredientes = ingredientes.slice(0, 4);
      console.warn('Se han ingresado más de 4 ingredientes, solo se considerarán los primeros 4:', ingredientes);
    }

    // Construir el prompt para la receta de manera concisa
    let prompt = `Receta con: ${ingredientes.join(', ')}`;

    const respuestaReceta = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'Eres un cocinero que genera recetas basadas en los ingredientes dados.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const receta = respuestaReceta.choices[0].message.content || null;

    if (!receta) {
      console.error("No se pudo generar la receta.");
      return NextResponse.json({ error: 'No se pudo generar la receta' }, { status: 500 });
    }

    // Extraer el título del plato desde la receta
    const tituloPlato = receta.split('\n')[0];  // Asumiendo que el título es la primera línea de la receta
    console.log("Título del plato:", tituloPlato);

    // Usar solo el título del plato para generar la imagen
    const respuestaImagen = await openai.images.generate({
      prompt: `Una foto del plato: ${tituloPlato}`,
      n: 1,
      size: "1024x1024"
    });

    const urlImagen = respuestaImagen.data[0].url;

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