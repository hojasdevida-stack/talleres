// /api/generateUploadUrl.js

import { bucket } from '../lib/firebaseAdmin.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} no permitido.` });
  }

  try {
    const { fileName, fileType } = req.body;

    if (!fileName || !fileType) {
      return res.status(400).json({ error: 'El nombre y el tipo de archivo son requeridos.' });
    }

    // 1. Generar un nombre de archivo único para evitar colisiones.
    const uniqueId = uuidv4();
    const fileExtension = fileName.split('.').pop();
    const finalFileName = `${uniqueId}.${fileExtension}`;
    const filePath = `cvs/${finalFileName}`; // Guardaremos los CVs en una carpeta 'cvs'

    // 2. Configurar las opciones para la URL firmada.
    const options = {
      version: 'v4',
      action: 'write', // 'write' significa que es para subir/escribir un archivo.
      expires: Date.now() + 15 * 60 * 1000, // La URL expira en 15 minutos.
      contentType: fileType,
    };

    // 3. Generar la URL firmada.
    const [uploadUrl] = await bucket.file(filePath).getSignedUrl(options);

    // 4. Devolver la URL y el nombre final al frontend.
    res.status(200).json({ uploadUrl, finalFileName });

  } catch (error) {
    console.error('Error al generar la URL de subida:', error);
    res.status(500).json({ error: 'No se pudo generar el enlace para subir el archivo.' });
  }
}

