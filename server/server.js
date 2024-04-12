const express = require("express");
const cors = require("cors");
const cron = require('node-cron');
const firebaseService = require('./services/firebaseService'); // Asegúrate de que esta ruta sea correcta
const moment = require('moment-timezone');


// Importar rutas
const paymentRoutes = require('./routes/payment');

const app = express();

app.use((req, res, next) => {
  if (req.originalUrl === '/payment/webhook') {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(express.static("public"));
app.use(cors({ origin: true, credentials: true }));


// Usar rutas
app.use('/payment', paymentRoutes);

// Cambia cada minuto las ofertas de los productos
cron.schedule('* * * * *', () => firebaseService.putProductsOnSale());

//Cambia cada lunes a las 00:01 las ofertas de los productos teniendo en cuenta la hora de Washington
// cron.schedule('1 0 * * 1', () => {
//   const washingtonTime = moment().tz('America/New_York').format('dddd HH:mm:ss');
//   if (washingtonTime.startsWith('Monday 00:01')) {
//     firebaseService.putProductsOnSale();
//   }
// });



app.listen(4242, () => console.log('app is running on 4242'));