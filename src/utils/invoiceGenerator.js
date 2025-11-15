// Invoice generation utilities

export const generateInvoiceHTML = (order, user) => {
  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${order.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; }
        .invoice-container { max-width: 800px; margin: 0 auto; border: 2px solid #d4af37; padding: 40px; }
        .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 3px solid #d4af37; padding-bottom: 20px; }
        .company { font-size: 28px; font-weight: bold; color: #d4af37; }
        .invoice-title { font-size: 36px; color: #d4af37; font-weight: bold; }
        .invoice-meta { text-align: right; }
        .section { margin-bottom: 30px; }
        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #d4af37; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .info-box { background: #f9f9f9; padding: 15px; border-radius: 5px; }
        .info-label { font-weight: bold; color: #666; font-size: 12px; margin-bottom: 5px; }
        .info-value { color: #333; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        th { background: #d4af37; color: white; padding: 12px; text-align: left; font-weight: bold; }
        td { padding: 12px; border-bottom: 1px solid #e0e0e0; }
        tr:hover { background: #f9f9f9; }
        .text-right { text-align: right; }
        .totals { margin-top: 20px; text-align: right; }
        .total-row { display: flex; justify-content: flex-end; gap: 100px; padding: 8px 0; }
        .total-label { font-weight: 600; color: #666; }
        .total-value { font-weight: 600; color: #333; min-width: 120px; text-align: right; }
        .grand-total { border-top: 2px solid #d4af37; padding-top: 12px; margin-top: 12px; font-size: 20px; }
        .grand-total .total-label { color: #d4af37; font-weight: bold; }
        .grand-total .total-value { color: #d4af37; font-weight: bold; }
        .footer { margin-top: 50px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #e0e0e0; padding-top: 20px; }
        .payment-info { background: #fff3cd; border: 1px solid #ffecb5; padding: 15px; border-radius: 5px; margin-top: 20px; }
        .status-badge { display: inline-block; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-processing { background: #cfe2ff; color: #084298; }
        .status-shipped { background: #d1ecf1; color: #0c5460; }
        .status-delivered { background: #d4edda; color: #155724; }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div>
            <div class="company">ELITE STORE</div>
            <div style="color: #666; font-size: 14px; margin-top: 5px;">Premium E-Commerce Platform</div>
          </div>
          <div class="invoice-meta">
            <div class="invoice-title">INVOICE</div>
            <div style="margin-top: 10px; color: #666;">
              <div><strong>Invoice #:</strong> ${order.id}</div>
              <div><strong>Date:</strong> ${invoiceDate}</div>
            </div>
          </div>
        </div>

        <div class="info-grid">
          <div class="section">
            <div class="section-title">Bill To</div>
            <div class="info-box">
              <div class="info-label">CUSTOMER NAME</div>
              <div class="info-value">${user.firstName} ${user.lastName}</div>
              <div class="info-label" style="margin-top: 10px;">EMAIL</div>
              <div class="info-value">${user.email}</div>
              <div class="info-label" style="margin-top: 10px;">PHONE</div>
              <div class="info-value">${user.phone || 'N/A'}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Ship To</div>
            <div class="info-box">
              <div class="info-label">ADDRESS</div>
              <div class="info-value">
                ${order.shippingAddress?.street || user.address || 'N/A'}<br>
                ${order.shippingAddress?.city || user.city || ''} ${order.shippingAddress?.state || user.state || ''}<br>
                ${order.shippingAddress?.zipCode || user.zipCode || ''}<br>
                ${order.shippingAddress?.country || user.country || 'India'}
              </div>
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Order Details</div>
          <div style="display: flex; gap: 20px; margin-bottom: 15px;">
            <div>
              <span class="info-label">ORDER STATUS: </span>
              <span class="status-badge status-${order.status.toLowerCase()}">${order.status.toUpperCase()}</span>
            </div>
            <div>
              <span class="info-label">PAYMENT METHOD: </span>
              <strong>${order.paymentMethod}</strong>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="text-right">Qty</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>
                    <strong>${item.name}</strong>
                  </td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">₹${item.price.toFixed(2)}</td>
                  <td class="text-right">₹${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div class="total-row">
              <div class="total-label">Subtotal:</div>
              <div class="total-value">₹${order.subtotal.toFixed(2)}</div>
            </div>
            <div class="total-row">
              <div class="total-label">Shipping:</div>
              <div class="total-value">${order.shipping === 0 ? 'FREE' : '₹' + order.shipping.toFixed(2)}</div>
            </div>
            <div class="total-row grand-total">
              <div class="total-label">Grand Total:</div>
              <div class="total-value">₹${order.total.toFixed(2)}</div>
            </div>
          </div>
        </div>

        ${order.paymentMethod === 'Cash on Delivery' ? `
          <div class="payment-info">
            <strong>⚠️ Payment Method: Cash on Delivery (COD)</strong><br>
            <div style="margin-top: 8px; font-size: 13px;">
              Please keep ₹${order.total.toFixed(2)} ready for payment upon delivery.
            </div>
          </div>
        ` : ''}

        <div class="footer">
          <p><strong>Thank you for your business!</strong></p>
          <p style="margin-top: 10px;">For any queries, contact us at support@elitestore.com or call +91-XXXXXXXXXX</p>
          <p style="margin-top: 5px;">Elite Store - Your Premium Shopping Destination</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const downloadInvoice = (order, user) => {
  const invoiceHTML = generateInvoiceHTML(order, user);
  
  // Create a blob from the HTML
  const blob = new Blob([invoiceHTML], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${order.id}-${Date.now()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  URL.revokeObjectURL(url);
};

export const sendInvoiceEmail = (order, user) => {
  // In a real application, this would call a backend API to send email
  // For demo purposes, we'll just log it and show a success message
  console.log('Sending invoice email to:', user.email);
  console.log('Order details:', order);
  
  // Simulate email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Invoice sent to ${user.email}`
      });
    }, 1000);
  });
};
