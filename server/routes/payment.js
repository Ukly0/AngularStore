const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const stripeService = require("../services/stripeService");
const bodyParser = require('body-parser');

router.post("/checkout", paymentController.createCheckoutSession);

router.post("/webhook", bodyParser.raw({type: 'application/json'}), paymentController.handleWebhook);

router.get("/checkout-session", async (req, res, next) => {
  try {
    const session = await stripeService.getCheckoutSession(req.query.sessionId);
    res.status(200).json(session);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
