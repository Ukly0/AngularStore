const emailService = require('../services/emailService'); // Asegúrate de que esta ruta sea correcta

exports.sendOfferEmail = (to) => {
  const subject = 'Productos en oferta';
  const html = '<p>Los productos han sido puestos en oferta.</p>';
  emailService.sendEmail(to, subject, html);
};



exports.sendPurchaseConfirmationEmail = (to, order) => {
    const subject = '👌 Ukiy0 - Purchase Confirmation';
    const headerImageUrl = 'https://firebasestorage.googleapis.com/v0/b/ukiy0-75249.appspot.com/o/images%2Flogo.png?alt=media&token=498887f5-eee7-4eb0-8b7e-99031ddf7e1f';
    let itemsHtml = '';
    for (let item of order.items) {
      itemsHtml += `
        <table style="margin: 0 auto; border-collapse: collapse; width: 30%; ">
          <tr>
            <td colspan="2" style="border: 3px solid black; padding: 10px; background-color: black; color: white; font-weight: bold; font-weight: bold;">${item.name}</td>
          </tr>
          <tr>
            <td style="border: 3px solid black; padding: 10px; font-weight: bold;">Size</td>
            <td style="border: 3px solid black; padding: 10px;">${item.size}</td>
          </tr>
          <tr>
            <td style="border: 3px solid black; padding: 10px; font-weight: bold;">Color</td>
            <td style="border: 3px solid black; padding: 10px;">${item.color}</td>
          </tr>
          <tr>
            <td style="border: 3px solid black; padding: 10px; font-weight: bold;">Quantity</td>
            <td style="border: 3px solid black; padding: 10px;">${item.quantity}</td>
          </tr>
          <tr>
            <td style="border: 3px solid black; padding: 10px; font-weight: bold;">Price</td>
            <td style="border: 3px solid black; padding: 10px;">$${item.price.toFixed(2)}</td>
          </tr>
        </table>
      `;
    }
    const html = `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <img src="${headerImageUrl}" alt="Header Image" style="width: 20%; height: auto;  background-color: white;">
        <h1>Thank you for your purchase.</h1>
        <h2>Order Number: <b>${order.orderNumber}</b></h2>
        <h3>Purchase Details:</h3>
        ${itemsHtml}
        <h2>Total: $${order.total.toFixed(2)}</h2>
      </div>
    `;
    emailService.sendEmail(to, subject, html);
};