"use client";  // Convierte el componente en un Client Component

import React, { useState } from 'react';
import jsPDF from 'jspdf';
import { marked } from 'marked';

export default function Home() {
  const [ingredientes, setIngredientes] = useState<string>('');
  const [receta, setReceta] = useState<string | null>(null);
  const [urlImagen, setUrlImagen] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);  // Inicia el spinner

    try {
      const response = await fetch('/api/generar-receta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredientes: ingredientes.split(',') }),
      });

      const data = await response.json();
      setReceta(data.receta);
      setUrlImagen(data.urlImagen);
    } catch (error) {
      console.error('Error al generar la receta:', error);
    } finally {
      setLoading(false);  // Detiene el spinner
    }
  };

  const descargarPDF = () => {
    const doc = new jsPDF();

    // Extraer el título de la receta desde el texto, buscando el primer texto entre comillas
    let tituloRecetaMatch = receta?.match(/"(.*?)"/);
    let tituloReceta = tituloRecetaMatch ? tituloRecetaMatch[1] : 'receta';

    // Remover caracteres especiales o no deseados del título
    tituloReceta = tituloReceta.replace(/[^\w\s]/gi, '').trim();

    // Agregar el título de la receta como encabezado en el PDF
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(tituloReceta, 10, 20);

    // Agregar el texto completo de la receta al PDF
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(receta || '', 10, 40, { maxWidth: 190 });

    // Guardar el PDF con el nombre de la receta
    doc.save(`${tituloReceta}.pdf`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center">Generador de Recetas con IA</h1>
      <p className="text-xl mb-4 text-center">Descubre nuevas ideas culinarias a partir de los ingredientes que tienes a mano. Con la ayuda de la inteligencia artificial, CocinAI te sugiere recetas creativas y deliciosas, adaptadas a tus preferencias. </p>
      {loading ? (
        <div className="flex justify-center items-center">
          <img src="/spinner.svg" alt="Cargando..." className="w-12 h-12"/>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={ingredientes}
              onChange={(e) => setIngredientes(e.target.value)}
              placeholder="Ingresa hasta 4 ingredientes separados por comas"
              className="border border-gray-300 rounded-md w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="submit"
              className="bg-black text-white rounded-md px-4 py-2 hover:bg-gray-800"
            >
              Generar Receta
            </button>
          </form>

          {receta && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Receta Generada</h2>
              <div
                className="prose"
                dangerouslySetInnerHTML={{ __html: marked(receta) }}
              />
              {urlImagen && (
                <img
                  id="imagen-receta"
                  src={urlImagen}
                  alt="Receta"
                  className="w-64 h-auto mt-4 rounded-md"
                />
              )}
              <button
                onClick={descargarPDF}
                className="mt-4 bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
              >
                Descargar PDF
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}