import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
  generateQuotationPDF,
  formatDate,
  QuotationData,
  LineItem,
} from '@/lib/pdf';

// Public endpoint for clients to download their quotation PDF
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get quote and settings
    const [quote, settings] = await Promise.all([
      prisma.quote.findUnique({ where: { id } }),
      prisma.settings.findFirst(),
    ]);

    if (!quote) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head><title>Not Found</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Quote Not Found</h1>
          <p>The quotation you're looking for doesn't exist or has been removed.</p>
        </body>
        </html>`,
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (!quote.quotationNumber || !quote.lineItems) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head><title>Not Ready</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Quotation Not Ready</h1>
          <p>This quotation is still being prepared. Please try again later.</p>
        </body>
        </html>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    if (!settings) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
          <h1>Service Unavailable</h1>
          <p>We're experiencing technical difficulties. Please contact us directly.</p>
        </body>
        </html>`,
        { status: 500, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const lineItems = typeof quote.lineItems === 'string' 
      ? JSON.parse(quote.lineItems) as LineItem[]
      : (quote.lineItems as unknown as LineItem[]);

    const phones = typeof settings.phones === 'string' 
      ? JSON.parse(settings.phones) as string[]
      : (settings.phones || []);

    // Prepare PDF data
    const pdfData: QuotationData = {
      companyName: settings.companyName,
      companyAddress: settings.address || '',
      companyPhone: phones[0] || '',
      companyEmail: settings.email || '',
      companyWebsite: settings.website || '',
      
      quotationNumber: quote.quotationNumber,
      quotationDate: formatDate(quote.quotationDate || new Date()),
      validUntil: formatDate(quote.validUntil || new Date()),
      
      clientName: quote.name,
      clientEmail: quote.email,
      clientPhone: quote.phone || '',
      clientAddress: quote.location || undefined,
      
      projectName: quote.service || undefined,
      projectLocation: quote.location || undefined,
      
      lineItems,
      
      subtotal: quote.subtotal || 0,
      taxRate: quote.taxRate || 0,
      tax: quote.tax || 0,
      discount: quote.discount || 0,
      totalAmount: quote.totalAmount || 0,
      currency: quote.currency || 'ZMW',
      
      notes: quote.quotationNotes || undefined,
      termsConditions: quote.termsConditions || undefined,
    };

    // Generate PDF
    const pdfBuffer = await generateQuotationPDF(pdfData);

    // Return PDF as downloadable file
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Quotation-${quote.quotationNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'private, max-age=3600', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Error downloading quotation:', error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
        <h1>Download Failed</h1>
        <p>We couldn't generate your quotation. Please try again or contact us.</p>
      </body>
      </html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}
