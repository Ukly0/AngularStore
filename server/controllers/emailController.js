const emailService = require("../services/emailService"); // Asegúrate de que esta ruta sea correcta

exports.sendOfferEmail = (to) => {
  const subject = "Productos en oferta";
  const html = "<p>Los productos han sido puestos en oferta.</p>";
  emailService.sendEmail(to, subject, html);
};

exports.sendPurchaseConfirmationEmail = (to, order) => {
  const subject = "👌 Ukiy0 - Purchase Confirmation";
  const headerImageUrl =
    "https://firebasestorage.googleapis.com/v0/b/ukiy0-75249.appspot.com/o/images%2Flogo.png?alt=media&token=498887f5-eee7-4eb0-8b7e-99031ddf7e1f";
  let itemsHtml = "";
  for (let item of order.items) {
    itemsHtml += `
        <table style="margin: 0 auto; border-collapse: collapse; width: 50%; ">
          <tr>
            <td colspan="2" style="border: 3px solid black; padding: 10px; background-color: black; color: white; font-weight: bold; font-weight: bold;">${
              item.name
            }</td>
          </tr>
          <tr>
            <td style="border: 3px solid black; padding: 10px; font-weight: bold;">Size</td>
            <td style="border: 3px solid black; padding: 10px;">${
              item.size
            }</td>
          </tr>
          <tr>
            <td style="border: 3px solid black; padding: 10px; font-weight: bold;">Color</td>
            <td style="border: 3px solid black; padding: 10px;">${
              item.color
            }</td>
          </tr>
          <tr>
            <td style="border: 3px solid black; padding: 10px; font-weight: bold;">Quantity</td>
            <td style="border: 3px solid black; padding: 10px;">${
              item.quantity
            }</td>
          </tr>
          <tr>
            <td style="border: 3px solid black; padding: 10px; font-weight: bold;">Price</td>
            <td style="border: 3px solid black; padding: 10px;">$${item.price.toFixed(
              2
            )}</td>
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

exports.sendupdate = (req, res) => {
  console.log("Enviado UPdate");
  const order = req.body.order;
  const changes = req.body.changes;
  const newStatus = changes.status ? changes.status["new"] : null;
  const newTracking = changes.tracking ? changes.tracking["new"] : null;
  const subject = "Order Update";
  const headerImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/ukiy0-75249.appspot.com/o/images%2Flogo.png?alt=media&token=498887f5-eee7-4eb0-8b7e-99031ddf7e1f";
  let html;
  if (newStatus || newTracking) {
    html = `
    
    <div style="font-family: 'Poppins', Arial, sans-serif; margin: 0 auto; padding: 20px; max-width: 600px;">
        <img src="${headerImageUrl}" alt="Header Image" style="width: 30%; height: auto;  background-color: white;">
        <h2 style="font-size: 24px;">Expedited for Delivery</h2>
        <p style="font-size: 18px;">Hello, ${order.email}</p>
        ${newStatus ? `<p style="font-size: 18px;">Your order ${order.orderNumber} is currently in the process of delivery with status: ${newStatus}. Please ensure someone is available to receive the package. Get ready to receive your item(s)!</p>` : ''}
        ${newTracking ? `<h3 style="font-size: 20px;">Track your order</h3><p style="font-size: 18px;"><a href="${newTracking}" target="_blank">Click here to track your order</a></p>` : ''}
        <h3 style="font-size: 20px;">Order Details</h3>
        <p style="font-size: 18px;">Placed on: ${order.date}</p>
        ${order.items.map(item => `<p style="font-size: 18px;">${item.name} (${item.color}, ${item.size}) x${item.quantity}</p>`).join('')}
        <p style="font-size: 18px;">Order Number: ${order.orderNumber}</p>
        <p style="font-weight: 400;font-size: 18px;">Order Total: $${order.total.toFixed(2)}</p>
    </div>`;
  }
  emailService.sendEmail(order.email, subject, html);
};
