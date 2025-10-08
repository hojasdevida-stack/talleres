import admin from 'firebase-admin';

// TAREA CRÍTICA: El nombre del bucket debe tener el formato de URL.
// Es muy probable que 'talleristas' sea tu colección de datos, no el bucket de archivos.
// Por favor, verifica y reemplaza el siguiente valor con el ID de tu bucket
// que encuentras en la sección "Storage" de tu consola de Firebase.
// Debería ser algo como "nombre-de-tu-proyecto.appspot.com".
const BUCKET_NAME = 'talleristas-a5319.appspot.com'; // <-- ¡CORREGIDO CON EL VALOR DE TU CAPTURA!

if (!admin.apps.length) {
  try {
    const encodedServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const decodedServiceAccount = Buffer.from(encodedServiceAccount, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decodedServiceAccount);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // Añadimos la URL del bucket de almacenamiento a la configuración.
      storageBucket: BUCKET_NAME
    });
  } catch (error)
 {
    console.error('Error al inicializar Firebase Admin SDK:', error.stack);
  }
}

const db = admin.firestore();
// Exportamos también el bucket de storage para poder usarlo en otras APIs.
const bucket = admin.storage().bucket();

export { db, bucket };

