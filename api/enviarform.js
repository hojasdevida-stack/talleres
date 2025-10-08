// /api/enviarform.js

// Usamos import (ESM) y nos aseguramos de incluir la extensión .js en la ruta.
import { db } from '../lib/firebaseAdmin.js';

// Usamos 'export default' para la función del handler, el estándar en Vercel para ESM.
export default async function handler(req, res) {
  // 1. Aseguramos que solo se acepten peticiones POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} no permitido.` });
  }

  try {
    // 2. Extraemos todos los campos del cuerpo de la solicitud
    const {
      nombres,
      apellidos,
      tipo_documento,
      numero_documento,
      email,
      telefono,
      departamento,
      municipio,
      direccion,
      perfil,
      titulo_profesional,
      posgrado,
      experiencia_general,
      experiencia_especifica,
      experiencia_tecnologica,
      metodologias,
      proyecto_relevante,
      cv, // Este es el nombre del archivo adjunto
      accept_policy
    } = req.body;

    // 3. Validación robusta en el servidor de los campos críticos
    if (!nombres || !apellidos || !numero_documento || !email || !telefono || !departamento || !municipio || !direccion || !perfil || !cv || cv === 'No adjuntado' || accept_policy !== 'on') {
      return res.status(400).json({ error: 'Faltan campos obligatorios. Por favor, complete toda la información requerida.' });
    }

    // 4. Preparamos el objeto completo que se guardará en Firestore
    const nuevoTallerista = {
      nombres,
      apellidos,
      nombreCompleto: `${nombres} ${apellidos}`, // Unimos para facilitar búsquedas futuras
      tipo_documento,
      numero_documento,
      email,
      telefono,
      departamento,
      municipio,
      direccion,
      perfil,
      titulo_profesional: titulo_profesional || 'No especificado',
      posgrado: posgrado || 'No especificado',
      experiencia_general: experiencia_general || 'No especificado',
      experiencia_especifica: experiencia_especifica || 'No especificado',
      experiencia_tecnologica: experiencia_tecnologica || 'No especificado',
      metodologias: metodologias || 'No especificado',
      proyecto_relevante: proyecto_relevante || '', // Aseguramos que no sea undefined
      nombre_cv: cv, // Guardamos el nombre del archivo
      politica_aceptada: accept_policy === 'on',
      fechaDeRegistro: new Date(), // Usamos la fecha del servidor, más confiable
    };

    // 5. Insertamos el nuevo documento en la colección 'talleristas'
    const docRef = await db.collection('talleristas').add(nuevoTallerista);

    // 6. Respondemos con éxito
    return res.status(201).json({ success: true, id: docRef.id });

  } catch (error) {
    // 7. Manejo de errores inesperados
    console.error('Error crítico al guardar en Firestore:', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor. Por favor, contacte al administrador.' });
  }
};

