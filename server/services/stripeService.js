const stripe = require("stripe")("sk_test_51OoRtGCktDADDsvxDKQ2k3sfgzxZQ85D8DhR2o31Gms7NhM5W5IG981xNdIiSrdpwagWrfI7OisI84DUEEujTQ1V00MiacYGbF");
const bodyparser = require("body-parser");

exports.createCheckoutSession = async (req, res) => {
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
        console.log(error);
        res.status(500).json({ error: error.message });

    }
};

exports.constructEvent = (body, signature, secret) => {
    let event;
    console.log('Estoy aqui');
    try {
        event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch (err) {
        throw new Error(`Webhook Error: ${err.message}`);
    }
    console.log('event', event);
    // Check if the event is a successful payment
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Checkout session completed!', session);
        // Extract the order information
        const order = {
            id: session.id,
            items: session.display_items.map(item => ({
                name: item.custom.name,
                quantity: item.quantity,
                price: item.amount_subtotal / 100, // Convert from cents to dollars
            })),
            total: session.amount_total / 100, // Convert from cents to dollars
            // Add any other information you want to save here
        };

        // Save the order
        firebaseService.saveOrder(order);
    }

    return event;
};