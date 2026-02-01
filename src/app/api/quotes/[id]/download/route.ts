import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import {
  generateQuotationPDF,
  formatDate,
  QuotationData,
  LineItem,
} from '@/lib/pdf';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    // Get quote and settings
    const [quote, settings] = await Promise.all([
      prisma.quote.findUnique({ where: { id } }),
      prisma.settings.findFirst(),
    ]);

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (!quote.quotationNumber || !quote.lineItems) {
      return NextResponse.json(
        { error: 'Quotation has not been generated yet' },
        { status: 400 }
      );
    }

    if (!settings) {
      return NextResponse.json({ error: 'Company settings not configured' }, { status: 400 });
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

    // Return PDF as download
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${quote.quotationNumber}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading quotation:', error);
    return NextResponse.json(
      { error: 'Failed to download quotation' },
      { status: 500 }
    );
  }
}
