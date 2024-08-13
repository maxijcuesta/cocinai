# CocinAI

CocinAI es un generador de recetas impulsado por inteligencia artificial. Este proyecto utiliza la API de OpenAI para sugerir recetas creativas basadas en los ingredientes que tienes a mano. Además, genera una imagen del plato sugerido y permite descargar la receta en formato PDF.

## Características

- **Generación de recetas**: Introduce los ingredientes y obtén una receta personalizada.
- **Generación de imágenes**: Obtén una imagen del plato generado por IA.
- **Descarga en PDF**: Descarga la receta y la imagen en un archivo PDF.

## Comenzando

Para ejecutar el servidor de desarrollo localmente:

```bash
npm run dev
# or
yarn dev

Abre http://localhost:3000 en tu navegador para ver la aplicación en acción.

Requisitos Previos

	•	Node.js v14 o superior
	•	Una API Key de OpenAI configurada en un archivo .env.local como OPENAI_API_KEY.

Variables de Entorno

Crea un archivo .env.local en la raíz del proyecto y añade tu API Key de OpenAI:

OPENAI_API_KEY=tu_api_key_aqui

Despliegue en Vercel

El despliegue más sencillo para tu aplicación Next.js es utilizando la Plataforma Vercel desde los creadores de Next.js.

Licencia

Este proyecto se distribuye bajo la Licencia MIT.