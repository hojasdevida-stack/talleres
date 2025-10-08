import admin from 'firebase-admin';

// CORRECCIÓN: Apuntamos al único bucket correcto.
const BUCKET_NAME = 'talleristas-a1d45.appspot.com';

if (!admin.apps.length) {
  try {
    const encodedServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const decodedServiceAccount = Buffer.from(encodedServiceAccount, 'base64').toString('utf-8');
    const serviceAccount = JSON.parse(decodedServiceAccount);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      // CORRECCIÓN: Le decimos a Admin SDK cuál es el bucket correcto.
      storageBucket: BUCKET_NAME
    });
  } catch (error) {
    console.error('Error al inicializar Firebase Admin SDK:', error.stack);
  }
}

const db = admin.firestore();
// Exportamos el bucket para usarlo en la generación de URLs firmadas.
const bucket = admin.storage().bucket();

export { db, bucket };

