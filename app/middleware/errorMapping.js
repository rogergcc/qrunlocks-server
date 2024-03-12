module.exports  = {
   ECONNREFUSED: {
     message: 'La conexión con el servidor fue rechazada. Por favor, verifica que el servidor esté en ejecución y la conexión de red.',
     type: 'ECONNREFUSED',
   },
   ETIMEDOUT: {
     message: 'La conexión con el servidor se agotó debido a un tiempo de espera. Por favor, verifica la conexión de red y vuelve a intentarlo.',
     type: 'ETIMEDOUT',
   },
   ENOTFOUND: {
     message: 'No se pudo encontrar el host "{{hostname}}". Por favor, verifica que la URL sea correcta.',
     type: 'ENOTFOUND',
   },
   EPROTO: {
     message: 'El servidor remoto no admite HTTPS. Verifica que estás intentando conectarte a un servidor compatible con HTTPS.',
     type: 'EPROTO',
   },
   HPE_INVALID_CONSTANT: {
     message: 'El servidor remoto está mal configurado. Por favor, contacta al administrador del servidor.',
     type: 'HPE_INVALID_CONSTANT',
   },
   // Puedes agregar más tipos de errores según sea necesario
 };
