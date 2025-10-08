// /api/enviarform.js

// Importamos la instancia de la base de datos que ya configuramos.
import { db } from '../lib/firebaseAdmin';

// Esta es la función principal que Vercel ejecutará.
export default async function handler(req, res) {
  // --- ANÁLISIS DE ROBUSTEZ 1: Verificar el Método HTTP ---
  // Solo debemos permitir peticiones de tipo POST. Si es GET, DELETE, etc., la rechazamos.
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Método ${req.method} no permitido.` });
  }

  try {
    // --- ANÁLISIS DE ROBUSTEZ 2: Validación de Datos del Lado del Servidor ---
    // Un punto no negociable. NUNCA confíes en la validación del frontend.
    // El servidor debe verificar que los datos esenciales están presentes.
    const { nombre, cedula, email, telefono, ciudad, departamento, descripcion, experiencia } = req.body;

    if (!nombre || !cedula || !email || !telefono) {
      return res.status(400).json({ error: 'Los campos nombre, cédula, email y teléfono son obligatorios.' });
    }
    
    // Preparamos el objeto que se guardará en la base de datos.
    const nuevoTallerista = {
      nombre,
      cedula,
      email,
      telefono,
      ciudad: ciudad || '', // Aseguramos que no haya valores 'undefined'
      departamento: departamento || '',
      descripcion: descripcion || '',
      experiencia: experiencia || '',
      // Añadimos una marca de tiempo del servidor, que es más fiable que la del cliente.
      fechaDeRegistro: new Date(),
    };

    // --- Interacción con la Base de Datos ---
    // Usamos .collection() para apuntar a 'talleristas' y .add() para insertar
    // un nuevo documento con un ID autogenerado.
    const docRef = await db.collection('talleristas').add(nuevoTallerista);

    // Si todo sale bien, respondemos con un éxito (201 Created) y el ID del nuevo documento.
    return res.status(201).json({ success: true, id: docRef.id });

  } catch (error) {
    // --- ANÁLISIS DE ROBUSTEZ 3: Manejo de Errores Inesperados ---
    // Si algo falla (ej. la base de datos está caída), capturamos el error
    // y enviamos una respuesta genérica para no exponer detalles internos.
    console.error('Error al guardar en Firestore:', error);
    return res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
  }
}