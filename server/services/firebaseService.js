// firebaseService.js
var admin = require('firebase-admin');
var cron = require('node-cron');
var serviceAccount = require('../ukiy0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ukiy0-75249-default-rtdb.europe-west1.firebasedatabase.app"
});

exports.saveOrder = async (orderData) => {
  var db = admin.database();
  var ref = db.ref('orders');
  var newOrderRef = ref.push();
  console.log(orderData.items[0].image);
  console.log(orderData);
  await newOrderRef.set(orderData);
  return newOrderRef.key;
};


// Método para poner productos en oferta
exports.putProductsOnSale = async () => {
  console.log('Poniendo productos en oferta');
  var db = admin.database();
  var ref = db.ref('product');
  
  // Obtén todos los productos
  ref.once('value', (snapshot) => {
    let products = snapshot.val();
    let productsOnSale = [];
    let productsNotOnSale = [];

    // Separa los productos en oferta de los que no están en oferta
    for (let id in products) {
      if (products[id].offerPrice != null) {
        productsOnSale.push({ id, ...products[id] });
      } else {
        productsNotOnSale.push({ id, ...products[id] });
      }
    }

    // Restablece el precio de los productos que están actualmente en oferta
    for (let product of productsOnSale) {
      product.price = +(product.offerPrice * 1.1).toFixed(2); // Aumenta el precio en un 10% y mantiene dos decimales // Aumenta el precio en un 10%
      product.offerPrice = null;
      ref.child(product.id).set(product);
    }

    let productsNotOnSaleCopy = [...productsNotOnSale];


    for (let i = 0; i < Math.min(3, productsNotOnSaleCopy.length); i++) {
      const randomIndex = Math.floor(Math.random() * productsNotOnSaleCopy.length);
      const product = productsNotOnSaleCopy.splice(randomIndex, 1)[0];
      product.offerPrice = +(product.price * 0.9).toFixed(2); // Reduce el precio en un 10% y mantiene dos decimales
      ref.child(product.id).set(product);
    }
  });
};

