import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import {
  generateQuotationPDF,
  formatDate,
  QuotationData,
  LineItem,
} from '@/lib/pdf';
import { sendQuotationEmail } from '@/lib/email';

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
        { error: 'Quotation has not been generated yet. Please generate it first.' },
        { status: 400 }
      );
    }

    if (!settings) {
      return NextResponse.json({ error: 'Company settings not configured' }, { status: 400 });
    }

    // Validate email configuration
    if (!settings.smtpHost || !settings.smtpUser || !settings.smtpPass || !settings.smtpFrom) {
      return NextResponse.json(
        { error: 'Email settings not configured. Please configure SMTP settings in admin panel.' },
        { status: 400 }
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

    // Format currency for email
    const formatCurrency = (amount: number) => 
      `${quote.currency || 'ZMW'} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Send email
    const emailResult = await sendQuotationEmail(
      {
        host: settings.smtpHost,
        port: settings.smtpPort || 587,
        user: settings.smtpUser,
        pass: settings.smtpPass,
        from: settings.smtpFrom,
      },
      {
        to: quote.email,
        clientName: quote.name,
        quotationNumber: quote.quotationNumber,
        companyName: settings.companyName,
        companyEmail: settings.email || settings.smtpFrom,
        companyPhone: settings.phones?.[0],
        totalAmount: formatCurrency(quote.totalAmount || 0),
        validUntil: formatDate(quote.validUntil || new Date()),
        pdfBuffer,
      }
    );

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || 'Failed to send email' },
        { status: 500 }
      );
    }

    // Update quote with sent timestamp
    await prisma.quote.update({
      where: { id },
      data: {
        pdfSentAt: new Date(),
        status: quote.status === 'quoted' ? 'sent' : quote.status,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Quotation sent successfully to ${quote.email}`,
      messageId: emailResult.messageId,
    });
  } catch (error) {
    console.error('Error sending quotation:', error);
    return NextResponse.json(
      { error: 'Failed to send quotation' },
      { status: 500 }
    );
  }
}
