const stripeService = require('../services/stripeService');
const firebaseService = require('../services/firebaseService');


exports.createCheckoutSession = async (req, res, next) => {
    try {
        const session = await stripeService.createCheckoutSession(req, res);
        res.status(200).json(session);

    } catch (error) {
        next(error);
    }
};

exports.handleWebhook = (req, res) => {
    const sig = req.headers["stripe-signature"];
    const secret = "";
    console.log('webhook');
    try {
      const event = stripeService.constructEvent(req.body.toString('utf8'), sig, secret);
      console.log('evento', event);
      // Si todo va bien, envía una respuesta de éxito
      res.status(200).send("Success");
    } catch (err) {
      // Si algo va mal, envía una respuesta de error
      console.error(err);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  };


exports.getCheckoutSession = async (req, res, next) => { // Nueva función
    try {
        const session = await stripeService.getCheckoutSession(req.query.sessionId);
        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
};


