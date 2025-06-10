import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceDetails {
  orderId: string;
  customerName: string;
  items: InvoiceItem[];
  total: number;
  fulfilledAt: string; // ISO date string
}

/**
 * Generates a PDF invoice as a Uint8Array buffer.
 * @param details Invoice details
 * @returns Promise<Uint8Array> (PDF buffer)
 */
export async function generateInvoicePDF(details: InvoiceDetails): Promise<Uint8Array> {
  try {
    // Defensive defaults and sanitization
    const orderId = details.orderId || 'N/A';
    console.log('🔍 [invoiceGenerator.ts] const orderId = details.orderId || 'N/A';');
    const customerName = details.customerName || 'N/A';
    console.log('🔍 [invoiceGenerator.ts] const customerName = details.customerName || 'N/A';');
    const fulfilledAt = details.fulfilledAt ? new Date(details.fulfilledAt) : null;
    console.log('🔍 [invoiceGenerator.ts] const fulfilledAt = details.fulfilledAt ? new Date(details.fulfilledAt) : null;');
    const dateString = fulfilledAt && !isNaN(fulfilledAt.getTime()) ? fulfilledAt.toLocaleDateString() : 'N/A';
    console.log('🔍 [invoiceGenerator.ts] const dateString = fulfilledAt && !isNaN(fulfilledAt.getTime()) ? fulfilledAt.toLocaleDateString() : 'N/A';');
    const items = Array.isArray(details.items) ? details.items : [];
    console.log('🔍 [invoiceGenerator.ts] const items = Array.isArray(details.items) ? details.items : [];');
    const total = typeof details.total === 'number' && isFinite(details.total) ? details.total : 0.0;
    console.log('🔍 [invoiceGenerator.ts] const total = typeof details.total === 'number' && isFinite(details.total) ? details.total : 0.0;');

    const pdfDoc = await PDFDocument.create();
    console.log('🔍 [invoiceGenerator.ts] const pdfDoc = await PDFDocument.create();');
    const page = pdfDoc.addPage([600, 800]);
    console.log('🔍 [invoiceGenerator.ts] const page = pdfDoc.addPage([600, 800]);');
    const { width } = page.getSize();
    console.log('🔍 [invoiceGenerator.ts] const { width } = page.getSize();');
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    console.log('🔍 [invoiceGenerator.ts] const font = await pdfDoc.embedFont(StandardFonts.Helvetica);');

    let y = 760;
    console.log('🔍 [invoiceGenerator.ts] let y = 760;');
    // Branding
    page.drawText('COMPANY NAME', { x: 40, y, size: 20, font, color: rgb(0.1, 0.2, 0.5) });
    page.drawRectangle({ x: width - 100, y: y - 10, width: 60, height: 40, color: rgb(0.9, 0.9, 0.9) });
    page.drawText('Logo', { x: width - 90, y: y + 10, size: 12, font, color: rgb(0.5, 0.5, 0.5) });
    y -= 40;
    console.log('🔍 [invoiceGenerator.ts] y -= 40;');

    // Invoice header
    page.drawText(`Invoice #${orderId}`, { x: 40, y, size: 16, font });
    page.drawText(`Date: ${dateString}`, { x: width - 220, y, size: 12, font });
    y -= 30;
    console.log('🔍 [invoiceGenerator.ts] y -= 30;');
    page.drawText(`Billed To: ${customerName}`, { x: 40, y, size: 12, font });
    y -= 30;
    console.log('🔍 [invoiceGenerator.ts] y -= 30;');

    // Table header
    page.drawText('Description', { x: 40, y, size: 12, font });
    page.drawText('Qty', { x: 300, y, size: 12, font });
    page.drawText('Unit Price', { x: 360, y, size: 12, font });
    page.drawText('Amount', { x: 470, y, size: 12, font });
    y -= 18;
    console.log('🔍 [invoiceGenerator.ts] y -= 18;');
    page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 10;
    console.log('🔍 [invoiceGenerator.ts] y -= 10;');

    // Items
    items.forEach(item => {
      const desc = item?.description || 'N/A';
      console.log('🔍 [invoiceGenerator.ts] const desc = item?.description || 'N/A';');
      const qty = typeof item?.quantity === 'number' && isFinite(item.quantity) ? item.quantity : 0;
      console.log('🔍 [invoiceGenerator.ts] const qty = typeof item?.quantity === 'number' && isFinite(item.quantity) ? item.quantity : 0;');
      const unitPrice = typeof item?.unitPrice === 'number' && isFinite(item.unitPrice) ? item.unitPrice : 0.0;
      console.log('🔍 [invoiceGenerator.ts] const unitPrice = typeof item?.unitPrice === 'number' && isFinite(item.unitPrice) ? item.unitPrice : 0.0;');
      page.drawText(desc, { x: 40, y, size: 12, font });
      page.drawText(qty.toString(), { x: 300, y, size: 12, font });
      page.drawText(`$${unitPrice.toFixed(2)}`, { x: 360, y, size: 12, font });
      page.drawText(`$${(qty * unitPrice).toFixed(2)}`, { x: 470, y, size: 12, font });
      y -= 18;
      console.log('🔍 [invoiceGenerator.ts] y -= 18;');
    });

    y -= 10;
    console.log('🔍 [invoiceGenerator.ts] y -= 10;');
    page.drawLine({ start: { x: 40, y }, end: { x: width - 40, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 20;
    console.log('🔍 [invoiceGenerator.ts] y -= 20;');

    // Total
    page.drawText('Total:', { x: 360, y, size: 14, font, color: rgb(0.1, 0.2, 0.5) });
    page.drawText(`$${total.toFixed(2)}`, { x: 470, y, size: 14, font, color: rgb(0.1, 0.2, 0.5) });

    // Footer
    page.drawText('Thank you for your business!', { x: 40, y: 40, size: 12, font, color: rgb(0.2, 0.5, 0.2) });

    return await pdfDoc.save();
  } catch (err) {
    throw new Error('Failed to generate PDF invoice');
  }
}
