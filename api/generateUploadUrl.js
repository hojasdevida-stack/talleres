import { bucket } from '../lib/firebaseAdmin.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  // --- INICIO DE LA CORRECCIÓN DE CORS ---
  // Estas cabeceras le dan permiso al navegador para comunicarse con la API desde cualquier origen.
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Permite cualquier dominio
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // El navegador envía una petición "previa" (preflight) de tipo OPTIONS para verificar los permisos.
  // Respondemos afirmativamente a esta petición.
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
    const { fileName, fileType } = req.body;
    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'Faltan el nombre o el tipo de archivo.' });
    }

    const fileExtension = fileName.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `cvs/${uniqueFileName}`;

    const file = bucket.file(filePath);
    const options = {
      version: 'v4',
      action: 'write',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutos de validez
      contentType: fileType,
    };

    const [uploadUrl] = await file.getSignedUrl(options);

    res.status(200).json({ uploadUrl, finalFileName: uniqueFileName });

  } catch (error) {
    console.error('Error al generar la URL firmada:', error);
    res.status(500).json({ error: 'No se pudo generar el permiso de subida.' });
  }
}

