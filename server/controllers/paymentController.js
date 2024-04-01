const stripeService = require('../services/stripeService');
require('dotenv').config();


exports.createCheckoutSession = async (req, res, next) => {
    try {
        const session = await stripeService.createCheckoutSession(req, res);
        res.status(200).json(session);

    } catch (error) {
        next(error);
    }
};

// paymentController.js
exports.handleWebhook = (req, res) => {
    const sig = req.headers['stripe-signature'];
    const secret = process.env.SECRET_WEBHOOK;
    let event;
  
    try {
      event = stripeService.constructEvent(req.body, sig, secret);
    } catch (err) {
      console.log(`❌ Error message: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  
    console.log('✅ Success:', event.id);
    res.json({received: true});
  };


exports.getCheckoutSession = async (req, res, next) => { // Nueva función
    try {
        const session = await stripeService.getCheckoutSession(req.query.sessionId);
        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
};


