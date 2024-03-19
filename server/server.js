const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

// Importar rutas
const paymentRoutes = require('./routes/payment');
const stripeService = require('./services/stripeService');

const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));

// Usar rutas
app.use('/payment', paymentRoutes);

// Usa el middleware raw de body-parser, que te da el cuerpo sin procesar como un Buffer
app.post('/webhook', (req, res) => {
    console.log(req)
    const sig = req.headers["stripe-signature"];
    const secret = "whsec_MnriXHXTpPcQuiFBrKk5CAjZH7PLCY9P";
    console.log('webhook');
    try {
      const event = stripeService.constructEvent(req, sig, secret);
      console.log('evento', event);
      // Si todo va bien, envía una respuesta de éxito
      res.status(200).send("Success");
    } catch (err) {
      // Si algo va mal, envía una respuesta de error
      console.error(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  });

app.listen(4242, () => console.log('app is running on 4242'));