const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors({ origin: true, credentials: true }));

const stripe = require("stripe")("sk_test_51OoRtGCktDADDsvxDKQ2k3sfgzxZQ85D8DhR2o31Gms7NhM5W5IG981xNdIiSrdpwagWrfI7OisI84DUEEujTQ1V00MiacYGbF");

app.post("/checkout", async (req, res, next) => {
    try {
        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
        },
        shipping_options: [
            {
                shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: 0,
                    currency: 'usd',
                },
                display_name: 'Free shipping',
                // Delivers between 5-7 business days
                delivery_estimate: {
                    minimum: {
                    unit: 'business_day',
                    value: 5,
                    },
                    maximum: {
                    unit: 'business_day',
                    value: 7,
                    },
                }
                }
            },
            {
                shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                    amount: 1500,
                    currency: 'usd',
                },
                display_name: 'Next day air',
                // Delivers in exactly 1 business day
                delivery_estimate: {
                    minimum: {
                    unit: 'business_day',
                    value: 1,
                    },
                    maximum: {
                    unit: 'business_day',
                    value: 1,
                    },
                }
                }
            },
        ],
        line_items:  req.body.items.map((item) => ({
            price_data: {
                currency: 'usd',
                product_data: {
                  name: item.variant.title,
                  images: [item.variant.img]
                },
                unit_amount: item.variant.price * 100,
              },
              quantity: item.quantity,
        })),
        mode: "payment",
        success_url: "http://localhost:4242/success.html",
        cancel_url: "http://localhost:4242/cancel.html",
        });

        res.status(200).json(session);
    } catch (error) {
        next(error);
    }
});

app.post('/webhook', bodyparser.raw({type: 'application/json'}), (request, response) => {
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, request.headers['stripe-signature'], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // El correo electrónico del cliente está en session.customer_email
    console.log('Customer email:', session.customer_email);

    // Aquí puedes guardar el pedido en la base de datos
    // ...
  }

  response.json({received: true});
});

app.listen(4242, () => console.log('app is running on 4242'));