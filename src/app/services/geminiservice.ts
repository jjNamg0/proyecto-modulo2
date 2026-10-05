import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

export interface FiltrosIA {
  ciudad: string;
  pais: string;
  ubicacion: string;
  tipo: string;
  huespedes: number | null;
  precioMaximo: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class Geminiservice {

  private ai = new GoogleGenAI({
    apiKey: 'ACA VA LA CLAVE QUE ESTA EN WATS'
  });

  async preguntar(pregunta: string): Promise<string> {

    const respuesta = await this.ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: pregunta
    });

    return respuesta.text || 'No recibí una respuesta.';
  }

  async interpretarPregunta(pregunta: string): Promise<FiltrosIA> {

    const instruccion = `
Analiza la siguiente pregunta de un usuario que busca alojamientos.

Debes identificar solamente estos datos:

- ciudad
- pais
- ubicacion
- tipo
- huespedes
- precioMaximo

Si ciudad, pais, ubicacion o tipo no aparecen en la pregunta, déjalos como una cadena vacía.

Si huespedes o precioMaximo no aparecen en la pregunta, usa null.

huespedes debe ser un número.

precioMaximo debe ser un número sin símbolos de moneda.a.

Responde UNICAMENTE con JSON válido.
No agregues explicaciones.
No uses Markdown.

Ejemplo:

{
  "ciudad": "Bogotá",
  "pais": "",
  "ubicacion": "",
  "tipo": "Apartamento",
  "huespedes": 2,
  "precioMaximo": 300000
}

Pregunta del usuario:
${pregunta}
`;

    const respuesta = await this.ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: instruccion
    });

    const texto = respuesta.text || '{}';

    return JSON.parse(texto);
  }
}
