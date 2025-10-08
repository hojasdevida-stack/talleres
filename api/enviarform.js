import { db } from '../lib/firebaseAdmin.js';

export default async function handler(req, res) {
  // --- INICIO DE LA CORRECCIÓN DE CORS ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  // --- FIN DE LA CORRECCIÓN DE CORS ---

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} no permitido.` });
  }

  try {
    const data = req.body;
    
    if (!data.nombres || !data.apellidos || !data.numero_documento || !data.email || !data.telefono) {
      return res.status(400).json({ error: 'Faltan campos obligatorios en la información personal.' });
    }

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
      url_cv: data.nombre_cv_unico ? `https://storage.googleapis.com/talleristas-a5319.appspot.com/cvs/${data.nombre_cv_unico}` : '',
      fechaDeRegistro: new Date(),
    };

    const docRef = await db.collection('talleristas').add(nuevoTallerista);
    return res.status(201).json({ success: true, id: docRef.id });

  } catch (error) {
    console.error('Error al guardar en Firestore:', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor al guardar los datos.' });
  }
}

