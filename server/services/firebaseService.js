// firebaseService.js
var admin = require('firebase-admin');

var serviceAccount = require('../ukiy0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ukiy0-75249-default-rtdb.europe-west1.firebasedatabase.app"
});

exports.saveOrder = async (orderData) => {
  var db = admin.database();
  var ref = db.ref('orders');
  var newOrderRef = ref.push();
  console.log('newOrderRef');
  await newOrderRef.set(orderData);
  return newOrderRef.key;
};