const stripe = require("stripe")("sk_test_51OoRtGCktDADDsvxDKQ2k3sfgzxZQ85D8DhR2o31Gms7NhM5W5IG981xNdIiSrdpwagWrfI7OisI84DUEEujTQ1V00MiacYGbF");
const firebaseService = require('../services/firebaseService');
const  emailController = require('../controllers/emailController');

images = [];
exports.createCheckoutSession = async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: req.body.email,
        shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'ES', 'FR', 'DE', 'IT', 'GB'],
        

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
        line_items: req.body.items.map((item) => {
            // Add the image to the array
            images.push(item.variant.img);
        
            return {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: item.variant.title + ' - ' + item.variant.selectedSize + ' - ' + item.variant.selectedColor,
                  images: [item.variant.img]
                },
                unit_amount: Math.round((item.variant.offerPrice || item.variant.price) * 100), // Use offerPrice if it exists, otherwise use price
              },
              quantity: item.quantity,
            };
          }),
        mode: "payment",
        success_url: "https://ukiy0-7lwmd6wgrq-no.a.run.app/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://ukiy0-7lwmd6wgrq-no.a.run.app/cancel.html",
        });

        res.status(200).json(session);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });

    }
};

exports.constructEvent = async (body, signature, secret) => {
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(body, signature, secret);
    } catch (err) {
        throw new Error(`Webhook Error: ${err.message}`);
    }
   
    // Check if the event is a successful payment
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // Fetch the line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        
        let customerEmail;

        if (session.customer) {
            const customer = await stripe.customers.retrieve(session.customer);
            customerEmail = customer.email;
        } else if (session.customer_details && session.customer_details.email) {
            // If the customer entered their email manually during checkout, use that email
            customerEmail = session.customer_details.email;
        }
        // Extract the order information
        const order = {
            id: session.id,
            email: customerEmail,
            date: new Date().toLocaleDateString(),
            orderNumber: generateOrderNumber(),
            items: lineItems.data.map(item => ({
                name: item.description,
                size: item.description.split(' - ')[1],
                color: item.description.split(' - ')[2],
                quantity: item.quantity,
                price: item.amount_total / 100, // Convert from cents to dollars
                image: images.shift(), // Add the image here
                
            })),
            status: 'Pending',
            total: session.amount_total / 100, // Convert from cents to dollars
            // Add any other information you want to save here
        };

        // Save the order
        firebaseService.saveOrder(order);
        emailController.sendPurchaseConfirmationEmail(customerEmail, order);
        this.images = [];
    }

    return event;
};

function generateOrderNumber() {
    const datePart = new Date().toISOString().replace(/[^0-9]/g, "");
    const randomPart = Math.floor(Math.random() * 10000);
    return + datePart  + randomPart;
}


const createOrder = async (session, items) => {
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 5 });
    const order = {
      email: session.customer_details.email,
      id: session.id,
      orderNumber: generateOrderNumber(),
      items: lineItems.data.map((item, index) => ({
        name: item.description,
        size: item.description.split(' - ')[1],
        color: item.description.split(' - ')[2],
        quantity: item.quantity,
        price: item.amount_total / 100, // Convert from cents to dollars
        image: items[index].variant.img, // Add the image here
      })),
      total: session.amount_total / 100, // Convert from cents to dollars
    };
    return order;
  };