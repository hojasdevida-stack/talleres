const admin = require('firebase-admin');

// Para evitar errores en entornos de recarga en caliente (hot-reloading),
// verificamos si la app ya ha sido inicializada.
if (!admin.apps.length) {
  try {
    // 1. Leemos la clave de servicio codificada en Base64 desde las variables de entorno.
    const encodedServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    // 2. Decodificamos la clave de Base64 a una cadena de texto UTF-8 (el JSON original).
    const decodedServiceAccount = Buffer.from(encodedServiceAccount, 'base64').toString('utf-8');
    
    // 3. Parseamos la cadena JSON decodificada para obtener el objeto de credenciales.
    const serviceAccount = JSON.parse(decodedServiceAccount);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } catch (error) {
    console.error('Error al inicializar Firebase Admin SDK:', error.stack);
    // Este error usualmente ocurre si la variable de entorno no está configurada o es inválida.
  }
}

// Exportamos la instancia de la base de datos (Firestore) para usarla en otros archivos.
const db = admin.firestore();

module.exports = { db };
