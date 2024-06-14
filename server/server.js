const express = require("express");
const cors = require("cors");
const cron = require('node-cron');
const firebaseService = require('./services/firebaseService'); // Asegúrate de que esta ruta sea correcta
const moment = require('moment-timezone');
const path = require('path');

// Importar rutas
const paymentRoutes = require('./routes/payment');
const emailRoutes = require('./routes/email');
const app = express();

app.use(express.static('dist/ukiy0'));

// Middleware para manejar el cuerpo de la solicitud para la ruta /payment/webhook
app.use('/payment/webhook', express.raw({type: 'application/json'}));

// Middleware para manejar el cuerpo de la solicitud para todas las demás rutas
app.use(express.json());

app.get('/*', function(req, res) {
  res.sendFile('index.html', {root: 'dist/ukiy0/'});
});

app.use(cors({ origin: true, credentials: true }));


// Usar rutas
app.use('/payment', paymentRoutes);
app.use('/email', emailRoutes);
// Cambia cada minuto las ofertas de los productos
//cron.schedule('* * * * *', () => firebaseService.putProductsOnSale());

//Cambia cada lunes a las 00:01 las ofertas de los productos teniendo en cuenta la hora de Washington
cron.schedule('1 0 * * 1', () => {
   const washingtonTime = moment().tz('America/New_York').format('dddd HH:mm:ss');
   if (washingtonTime.startsWith('Monday 00:01')) {
     firebaseService.putProductsOnSale();
   }
 });
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Hello world listening on port', port);
});