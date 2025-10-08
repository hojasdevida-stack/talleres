import { db } from '../lib/firebaseAdmin.js';

export default async function handler(req, res) {
  // Configuración de CORS para permitir peticiones desde el navegador
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permite cualquier origen
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // El navegador envía una petición OPTIONS preliminar para verificar CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} no permitido.` });
  }

  try {
    const data = req.body;
    
    // Validación de campos esenciales en el servidor
    if (!data.nombres || !data.apellidos || !data.numero_documento || !data.email || !data.telefono || !data.url_cv) {
      return res.status(400).json({ error: 'Faltan campos obligatorios. Por favor, revise el formulario.' });
    }

    // Objeto que se guardará en Firestore, adaptado al formulario de contingencia
    const nuevoTallerista = {
      nombres: data.nombres || '',
      apellidos: data.apellidos || '',
      tipo_documento: data.tipo_documento || '',
      numero_documento: data.numero_documento || '',
      email: data.email || '',
      telefono: data.telefono || '',
      departamento: data.departamento || '',
      municipio: data.municipio || '',
      direccion: data.direccion || '',
      perfil: data.perfil || '',
      titulo_profesional: data.titulo_profesional || '',
      posgrado: data.posgrado || '',
      experiencia_general: data.experiencia_general || '',
      experiencia_especifica: data.experiencia_especifica || '',
      experiencia_tecnologica: data.experiencia_tecnologica || '',
      metodologias: data.metodologias || '',
      proyecto_relevante: data.proyecto_relevante || '',
      // Se guarda el enlace al CV directamente
      url_cv: data.url_cv || '',
      fechaDeRegistro: new Date(),
    };

    const docRef = await db.collection('talleristas').add(nuevoTallerista);
    return res.status(201).json({ success: true, id: docRef.id });

  } catch (error) {
    console.error('Error al guardar en Firestore:', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor al guardar los datos.' });
  }
}
