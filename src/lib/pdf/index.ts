import jsPDF from 'jspdf';

export interface LineItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

export interface QuotationData {
  // Company Info
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  // Client Info
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress?: string;
  // Project Info
  projectName?: string;
  projectLocation?: string;
  // Quotation Details
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  // Line Items
  lineItems: LineItem[];
  // Totals
  currency: string;
  subtotal: number;
  discount: number;
  taxRate: number;
  tax: number;
  totalAmount: number;
  // Additional
  termsConditions?: string;
  notes?: string;
}

function formatCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function generateQuotationPDF(data: QuotationData): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Colors
  const navyColor: [number, number, number] = [15, 23, 42];
  const solarColor: [number, number, number] = [59, 130, 246];
  const grayColor: [number, number, number] = [107, 114, 128];
  const lightGray: [number, number, number] = [243, 244, 246];

  // ============ WATERMARK ============
  if (data.companyWebsite) {
    doc.saveGraphicsState();
    const watermarkText = data.companyWebsite.replace(/^https?:\/\//, '').replace(/\/$/, '');
    doc.setFontSize(80);
    doc.setTextColor(180, 180, 180);
    
    // Calculate center position
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    
    // Set opacity using GState
    const gState = doc.GState({ opacity: 0.15 });
    doc.setGState(gState);
    
    // Draw rotated text
    doc.text(watermarkText, centerX, centerY, {
      align: 'center',
      angle: -45,
    });
    
    doc.restoreGraphicsState();
  }

  // ============ HEADER ============
  // Company name
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navyColor);
  doc.text(data.companyName, margin, y + 8);
  
  // QUOTATION label on right
  doc.setFontSize(28);
  doc.setTextColor(...solarColor);
  doc.text('QUOTATION', pageWidth - margin, y + 8, { align: 'right' });
  
  y += 15;
  
  // Company details
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(data.companyAddress, margin, y);
  y += 4;
  doc.text(`Tel: ${data.companyPhone} | Email: ${data.companyEmail}`, margin, y);
  if (data.companyWebsite) {
    y += 4;
    doc.text(data.companyWebsite, margin, y);
  }
  
  y += 12;
  
  // Divider line
  doc.setDrawColor(...solarColor);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  
  y += 10;

  // ============ QUOTATION INFO BOX ============
  const infoBoxWidth = 70;
  const infoBoxX = pageWidth - margin - infoBoxWidth;
  
  // Background box
  doc.setFillColor(...lightGray);
  doc.roundedRect(infoBoxX, y - 5, infoBoxWidth, 30, 2, 2, 'F');
  
  // Quotation details
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navyColor);
  doc.text('Quotation No:', infoBoxX + 5, y + 2);
  doc.text('Date:', infoBoxX + 5, y + 10);
  doc.text('Valid Until:', infoBoxX + 5, y + 18);
  
  doc.setFont('helvetica', 'normal');
  doc.text(data.quotationNumber, infoBoxX + 35, y + 2);
  doc.text(data.quotationDate, infoBoxX + 35, y + 10);
  doc.text(data.validUntil, infoBoxX + 35, y + 18);

  // ============ CLIENT INFO ============
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...navyColor);
  doc.text('Bill To:', margin, y);
  
  y += 6;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(data.clientName, margin, y);
  
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  
  if (data.clientAddress) {
    doc.text(data.clientAddress, margin, y);
    y += 4;
  }
  doc.text(`Email: ${data.clientEmail}`, margin, y);
  y += 4;
  doc.text(`Phone: ${data.clientPhone}`, margin, y);
  
  y += 15;

  // ============ PROJECT INFO ============
  if (data.projectName || data.projectLocation) {
    doc.setFillColor(...lightGray);
    doc.roundedRect(margin, y - 3, contentWidth, 14, 2, 2, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navyColor);
    
    let projectText = '';
    if (data.projectName) {
      projectText = `Project: ${data.projectName}`;
    }
    if (data.projectLocation) {
      projectText += projectText ? ` | Location: ${data.projectLocation}` : `Location: ${data.projectLocation}`;
    }
    doc.text(projectText, margin + 5, y + 5);
    
    y += 18;
  }

  // ============ LINE ITEMS TABLE ============
  // Table header
  const colWidths = [85, 20, 20, 25, 25]; // Description, Qty, Unit, Unit Price, Total
  const tableX = margin;
  
  doc.setFillColor(...navyColor);
  doc.rect(tableX, y, contentWidth, 8, 'F');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  
  let colX = tableX + 3;
  doc.text('Description', colX, y + 5.5);
  colX += colWidths[0];
  doc.text('Qty', colX, y + 5.5, { align: 'center' });
  colX += colWidths[1];
  doc.text('Unit', colX, y + 5.5, { align: 'center' });
  colX += colWidths[2];
  doc.text('Unit Price', colX + colWidths[3]/2, y + 5.5, { align: 'center' });
  colX += colWidths[3];
  doc.text('Total', colX + colWidths[4]/2, y + 5.5, { align: 'center' });
  
  y += 8;
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...navyColor);
  
  data.lineItems.forEach((item, index) => {
    const rowHeight = 8;
    
    // Check if we need a new page
    if (y + rowHeight > pageHeight - 60) {
      doc.addPage();
      y = margin;
      
      // Re-add watermark on new page
      if (data.companyWebsite) {
        doc.saveGraphicsState();
        const watermarkText = data.companyWebsite.replace(/^https?:\/\//, '').replace(/\/$/, '');
        doc.setFontSize(60);
        doc.setTextColor(200, 200, 200);
        const gState = doc.GState({ opacity: 0.08 });
        doc.setGState(gState);
        doc.text(watermarkText, pageWidth / 2, pageHeight / 2, { align: 'center', angle: -45 });
        doc.restoreGraphicsState();
      }
    }
    
    // Alternating row background
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 250);
      doc.rect(tableX, y, contentWidth, rowHeight, 'F');
    }
    
    // Row border
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.1);
    doc.line(tableX, y + rowHeight, tableX + contentWidth, y + rowHeight);
    
    doc.setFontSize(8);
    doc.setTextColor(...navyColor);
    
    colX = tableX + 3;
    
    // Description (with text wrapping if needed)
    const descLines = doc.splitTextToSize(item.description, colWidths[0] - 6);
    doc.text(descLines[0], colX, y + 5.5);
    
    colX += colWidths[0];
    doc.text(item.quantity.toString(), colX, y + 5.5, { align: 'center' });
    
    colX += colWidths[1];
    doc.text(item.unit, colX, y + 5.5, { align: 'center' });
    
    colX += colWidths[2];
    doc.text(formatCurrency(item.unitPrice, data.currency), colX + colWidths[3] - 3, y + 5.5, { align: 'right' });
    
    colX += colWidths[3];
    doc.text(formatCurrency(item.total, data.currency), colX + colWidths[4] - 3, y + 5.5, { align: 'right' });
    
    y += rowHeight;
  });
  
  y += 5;

  // ============ TOTALS SECTION ============
  const totalsX = pageWidth - margin - 80;
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  
  // Subtotal
  doc.text('Subtotal:', totalsX, y + 5);
  doc.setTextColor(...navyColor);
  doc.text(formatCurrency(data.subtotal, data.currency), pageWidth - margin, y + 5, { align: 'right' });
  y += 6;
  
  // Discount (if any)
  if (data.discount > 0) {
    doc.setTextColor(...grayColor);
    doc.text('Discount:', totalsX, y + 5);
    doc.setTextColor(220, 38, 38); // Red
    doc.text(`-${formatCurrency(data.discount, data.currency)}`, pageWidth - margin, y + 5, { align: 'right' });
    y += 6;
  }
  
  // Tax
  doc.setTextColor(...grayColor);
  doc.text(`VAT (${data.taxRate}%):`, totalsX, y + 5);
  doc.setTextColor(...navyColor);
  doc.text(formatCurrency(data.tax, data.currency), pageWidth - margin, y + 5, { align: 'right' });
  y += 8;
  
  // Total
  doc.setFillColor(...navyColor);
  doc.roundedRect(totalsX - 5, y, 85, 10, 1, 1, 'F');
  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text('TOTAL:', totalsX, y + 7);
  doc.text(formatCurrency(data.totalAmount, data.currency), pageWidth - margin - 3, y + 7, { align: 'right' });
  
  y += 20;

  // ============ TERMS & CONDITIONS ============
  if (data.termsConditions) {
    // Check if we need a new page
    if (y > pageHeight - 60) {
      doc.addPage();
      y = margin;
    }
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navyColor);
    doc.text('Terms & Conditions', margin, y);
    
    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    
    const termsLines = doc.splitTextToSize(data.termsConditions, contentWidth);
    termsLines.forEach((line: string) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 4;
    });
  }

  // ============ NOTES ============
  if (data.notes) {
    y += 5;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...navyColor);
    doc.text('Notes', margin, y);
    
    y += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...grayColor);
    
    const notesLines = doc.splitTextToSize(data.notes, contentWidth);
    notesLines.forEach((line: string) => {
      doc.text(line, margin, y);
      y += 4;
    });
  }

  // ============ FOOTER ============
  const footerY = pageHeight - 15;
  
  doc.setDrawColor(...lightGray);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`${data.companyName} | ${data.companyEmail} | ${data.companyPhone}`, pageWidth / 2, footerY + 4, { align: 'center' });

  // Return as Buffer
  const arrayBuffer = doc.output('arraybuffer');
  return Buffer.from(arrayBuffer);
}

export function generateQuotationNumber(prefix: string, counter: number): string {
  const year = new Date().getFullYear();
  const paddedCounter = counter.toString().padStart(4, '0');
  return `${prefix}-${year}-${paddedCounter}`;
}

export function calculateQuotationTotals(
  lineItems: LineItem[],
  taxRate: number = 0,
  discount: number = 0
): {
  subtotal: number;
  tax: number;
  totalAmount: number;
} {
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * (taxRate / 100);
  const totalAmount = afterDiscount + tax;
  
  return {
    subtotal,
    tax,
    totalAmount,
  };
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getValidUntilDate(days: number = 30): Date {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
