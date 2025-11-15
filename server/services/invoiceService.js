import PDFDocument from 'pdfkit';

/**
 * Generate invoice PDF as buffer
 * @param {Object} order - Order object with populated user
 * @returns {Promise<Buffer>} PDF buffer
 */
export async function generateInvoicePDFBuffer(order) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 50,
        bufferPages: true
      });
      
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Colors
      const goldColor = '#d4af37';
      const darkGray = '#333';
      const lightGray = '#666';

      // Header
      doc
        .fontSize(28)
        .fillColor(goldColor)
        .font('Helvetica-Bold')
        .text('ELITE STORE', { align: 'left' })
        .moveDown(0.3);

      doc
        .fontSize(10)
        .fillColor(lightGray)
        .font('Helvetica')
        .text('Premium E-Commerce Platform', { align: 'left' })
        .moveDown(1);

      // Invoice Title and Details
      const invoiceY = doc.y;
      doc
        .fontSize(32)
        .fillColor(goldColor)
        .font('Helvetica-Bold')
        .text('INVOICE', 400, invoiceY, { align: 'right' });

      doc
        .fontSize(10)
        .fillColor(darkGray)
        .font('Helvetica')
        .text(`Invoice #: ${order._id}`, 400, invoiceY + 40, { align: 'right' })
        .text(`Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}`, 400, invoiceY + 55, { align: 'right' });

      doc.moveDown(2);

      // Bill To & Ship To Section
      const detailsY = doc.y;
      
      // Bill To
      doc
        .fontSize(12)
        .fillColor(goldColor)
        .font('Helvetica-Bold')
        .text('BILL TO', 50, detailsY);

      doc
        .fontSize(10)
        .fillColor(darkGray)
        .font('Helvetica')
        .text(`${order.user?.firstName || ''} ${order.user?.lastName || ''}`, 50, detailsY + 20)
        .text(order.user?.email || '', 50, detailsY + 35);

      if (order.user?.phone) {
        doc.text(order.user.phone, 50, detailsY + 50);
      }

      // Ship To
      doc
        .fontSize(12)
        .fillColor(goldColor)
        .font('Helvetica-Bold')
        .text('SHIP TO', 300, detailsY);

      const shippingAddress = typeof order.shippingAddress === 'string'
        ? order.shippingAddress
        : [
            order.shippingAddress?.street,
            order.shippingAddress?.city,
            order.shippingAddress?.state,
            order.shippingAddress?.zipCode,
            order.shippingAddress?.country || 'India'
          ].filter(Boolean).join(', ');

      doc
        .fontSize(10)
        .fillColor(darkGray)
        .font('Helvetica')
        .text(shippingAddress, 300, detailsY + 20, { width: 250 });

      doc.moveDown(4);

      // Order Details
      doc
        .fontSize(12)
        .fillColor(goldColor)
        .font('Helvetica-Bold')
        .text('ORDER DETAILS', 50, doc.y);

      doc.moveDown(0.5);

      const statusText = (order.status || 'Pending').toUpperCase();
      const paymentText = order.paymentMethod || 'N/A';
      
      doc
        .fontSize(10)
        .fillColor(darkGray)
        .font('Helvetica')
        .text(`Status: ${statusText}`, 50, doc.y)
        .text(`Payment Method: ${paymentText}`, 250, doc.y - 12);

      doc.moveDown(2);

      // Items Table
      const tableTop = doc.y;
      const itemNameX = 50;
      const qtyX = 320;
      const priceX = 400;
      const totalX = 480;

      // Table Header
      doc
        .rect(50, tableTop, 545, 25)
        .fillColor(goldColor)
        .fill();

      doc
        .fontSize(11)
        .fillColor('#fff')
        .font('Helvetica-Bold')
        .text('ITEM', itemNameX, tableTop + 8)
        .text('QTY', qtyX, tableTop + 8, { width: 60, align: 'right' })
        .text('PRICE', priceX, tableTop + 8, { width: 70, align: 'right' })
        .text('TOTAL', totalX, tableTop + 8, { width: 65, align: 'right' });

      // Table Rows
      let itemY = tableTop + 35;
      doc
        .fontSize(10)
        .fillColor(darkGray)
        .font('Helvetica');

      order.items.forEach((item, index) => {
        const itemPrice = Number(item.price) || 0;
        const itemQty = Number(item.quantity) || 0;
        const itemTotal = itemPrice * itemQty;

        // Alternate row background
        if (index % 2 === 0) {
          doc
            .rect(50, itemY - 5, 545, 20)
            .fillColor('#f9f9f9')
            .fill();
        }

        doc
          .fillColor(darkGray)
          .text(item.name || 'N/A', itemNameX, itemY, { width: 260 })
          .text(itemQty.toString(), qtyX, itemY, { width: 60, align: 'right' })
          .text(`₹${itemPrice.toFixed(2)}`, priceX, itemY, { width: 70, align: 'right' })
          .text(`₹${itemTotal.toFixed(2)}`, totalX, itemY, { width: 65, align: 'right' });

        itemY += 25;
      });

      // Draw table border
      doc
        .strokeColor('#ddd')
        .lineWidth(1)
        .rect(50, tableTop, 545, itemY - tableTop + 5)
        .stroke();

      // Totals Section
      const totalsX = 380;
      const totalsY = itemY + 30;

      doc
        .fontSize(10)
        .fillColor(darkGray)
        .font('Helvetica')
        .text('Subtotal:', totalsX, totalsY, { width: 100, align: 'right' })
        .text(`₹${Number(order.subtotal || 0).toFixed(2)}`, totalsX + 110, totalsY, { align: 'right' });

      doc
        .text('Shipping:', totalsX, totalsY + 18, { width: 100, align: 'right' })
        .text(
          order.shipping === 0 ? 'FREE' : `₹${Number(order.shipping || 0).toFixed(2)}`,
          totalsX + 110,
          totalsY + 18,
          { align: 'right' }
        );

      if (order.tax && order.tax > 0) {
        doc
          .text('Tax:', totalsX, totalsY + 36, { width: 100, align: 'right' })
          .text(`₹${Number(order.tax).toFixed(2)}`, totalsX + 110, totalsY + 36, { align: 'right' });
      }

      // Grand Total
      doc
        .strokeColor(goldColor)
        .lineWidth(2)
        .moveTo(totalsX, totalsY + 50)
        .lineTo(545, totalsY + 50)
        .stroke();

      doc
        .fontSize(14)
        .fillColor(goldColor)
        .font('Helvetica-Bold')
        .text('Grand Total:', totalsX, totalsY + 60, { width: 100, align: 'right' })
        .text(`₹${Number(order.total || 0).toFixed(2)}`, totalsX + 110, totalsY + 60, { align: 'right' });

      // Payment Information
      if (order.paymentMethod === 'Cash on Delivery') {
        doc.moveDown(3);
        doc
          .fontSize(10)
          .fillColor('#856404')
          .font('Helvetica-Bold')
          .text('⚠ PAYMENT METHOD: CASH ON DELIVERY', 50, doc.y, { width: 500 });

        doc
          .fontSize(9)
          .fillColor(lightGray)
          .font('Helvetica')
          .text(`Please keep ₹${Number(order.total || 0).toFixed(2)} ready for payment upon delivery.`, 50, doc.y + 5, { width: 500 });
      }

      // Footer
      doc.moveDown(3);
      const footerY = doc.page.height - 100;
      
      doc
        .strokeColor('#ddd')
        .lineWidth(1)
        .moveTo(50, footerY)
        .lineTo(545, footerY)
        .stroke();

      doc
        .fontSize(10)
        .fillColor(darkGray)
        .font('Helvetica-Bold')
        .text('Thank you for your business!', 50, footerY + 15, { align: 'center', width: 495 });

      doc
        .fontSize(9)
        .fillColor(lightGray)
        .font('Helvetica')
        .text('For any queries, contact us at support@elitestore.com or call +91-XXXXXXXXXX', 50, footerY + 32, { align: 'center', width: 495 })
        .text('Elite Store - Your Premium Shopping Destination', 50, footerY + 47, { align: 'center', width: 495 });

      // Finalize PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
