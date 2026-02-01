import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import {
  generateQuotationPDF,
  generateQuotationNumber,
  calculateQuotationTotals,
  formatDate,
  getValidUntilDate,
  QuotationData,
  LineItem,
} from '@/lib/pdf';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    
    // Get quote and settings
    const [quote, settings] = await Promise.all([
      prisma.quote.findUnique({ where: { id } }),
      prisma.settings.findFirst(),
    ]);

    if (!quote) {
      return NextResponse.json({ error: 'Quote not found' }, { status: 404 });
    }

    if (!settings) {
      return NextResponse.json({ error: 'Company settings not configured' }, { status: 400 });
    }

    // Validate line items
    const lineItems: LineItem[] = body.lineItems || [];
    if (lineItems.length === 0) {
      return NextResponse.json({ error: 'At least one line item is required' }, { status: 400 });
    }

    // Calculate totals
    const taxRate = body.taxRate ?? settings.defaultTaxRate ?? 0;
    const discount = body.discount ?? 0;
    const totals = calculateQuotationTotals(lineItems, taxRate, discount);

    // Generate quotation number if not exists
    let quotationNumber = quote.quotationNumber;
    if (!quotationNumber) {
      const newCounter = (settings.quotationCounter || 1000) + 1;
      quotationNumber = generateQuotationNumber(
        settings.quotationPrefix || 'QTN',
        newCounter
      );
      
      // Update settings counter
      await prisma.settings.update({
        where: { id: settings.id },
        data: { quotationCounter: newCounter },
      });
    }

    // Prepare dates
    const quotationDate = new Date();
    const validityDays = settings.quotationValidity || 30;
    const validUntil = getValidUntilDate(validityDays);

    // Prepare PDF data
    const pdfData: QuotationData = {
      // Company Info
      companyName: settings.companyName,
      companyAddress: settings.address || '',
      companyPhone: settings.phones?.[0] || '',
      companyEmail: settings.email || '',
      companyWebsite: settings.website || '',
      
      // Quotation Info
      quotationNumber,
      quotationDate: formatDate(quotationDate),
      validUntil: formatDate(validUntil),
      
      // Client Info
      clientName: quote.name,
      clientEmail: quote.email,
      clientPhone: quote.phone || '',
      clientAddress: quote.location || undefined,
      
      // Project Info
      projectName: quote.service || undefined,
      projectLocation: quote.location || undefined,
      
      // Line Items
      lineItems,
      
      // Totals
      subtotal: totals.subtotal,
      taxRate,
      tax: totals.tax,
      discount,
      totalAmount: totals.totalAmount,
      currency: body.currency || settings.currency || 'ZMW',
      
      // Notes
      notes: body.quotationNotes || undefined,
      termsConditions: body.termsConditions || settings.defaultTerms || undefined,
    };

    // Generate PDF
    const pdfBuffer = await generateQuotationPDF(pdfData);

    // Update quote in database - store lineItems as JSON string for SQLite
    await prisma.quote.update({
      where: { id },
      data: {
        quotationNumber,
        quotationDate,
        validUntil,
        lineItems: JSON.stringify(lineItems),
        subtotal: totals.subtotal,
        tax: totals.tax,
        taxRate,
        discount,
        totalAmount: totals.totalAmount,
        currency: pdfData.currency,
        termsConditions: pdfData.termsConditions,
        quotationNotes: pdfData.notes,
        pdfGenerated: true,
        status: quote.status === 'new' ? 'quoted' : quote.status,
      },
    });

    // Return PDF as base64
    return NextResponse.json({
      success: true,
      quotationNumber,
      pdf: pdfBuffer.toString('base64'),
      totals: {
        subtotal: totals.subtotal,
        tax: totals.tax,
        totalAmount: totals.totalAmount,
      },
    });
  } catch (error) {
    console.error('Error generating quotation:', error);
    return NextResponse.json(
      { error: 'Failed to generate quotation' },
      { status: 500 }
    );
  }
}
