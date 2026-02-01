import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { quoteSchema } from '@/lib/validations';
import { sendNewQuoteNotification } from '@/lib/email';

// Generate a simple reference number
function generateReferenceNo() {
  const prefix = 'QR';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = quoteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    // Create quote with reference number
    const quote = await prisma.quote.create({
      data: {
        ...result.data,
        referenceNo: generateReferenceNo(),
      },
    });

    // Send admin notification email (non-blocking)
    sendAdminNotification(quote, request.headers.get('host') || 'localhost:3000');

    return NextResponse.json({ 
      success: true, 
      id: quote.id,
      referenceNo: quote.referenceNo,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating quote:', error);
    return NextResponse.json(
      { error: 'Failed to submit quote request' },
      { status: 500 }
    );
  }
}

// Send notification to admin (runs in background, doesn't block response)
async function sendAdminNotification(quote: { 
  id: string;
  referenceNo: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  location: string | null;
  message: string | null;
}, host: string) {
  try {
    const settings = await prisma.settings.findFirst();
    
    // Only send if SMTP is configured
    if (!settings?.smtpHost || !settings?.smtpUser || !settings?.smtpPass || !settings?.smtpFrom) {
      console.log('SMTP not configured, skipping admin notification');
      return;
    }

    const protocol = host.includes('localhost') ? 'http' : 'https';
    const adminUrl = `${protocol}://${host}/admin/quotes/${quote.id}`;

    await sendNewQuoteNotification(
      {
        host: settings.smtpHost,
        port: settings.smtpPort || 587,
        user: settings.smtpUser,
        pass: settings.smtpPass,
        from: settings.smtpFrom,
      },
      {
        referenceNo: quote.referenceNo,
        name: quote.name,
        email: quote.email,
        phone: quote.phone || undefined,
        company: quote.company || undefined,
        service: quote.service || 'Not specified',
        location: quote.location || undefined,
        message: quote.message || undefined,
        companyName: settings.companyName,
        adminUrl,
      }
    );
    
    console.log(`Admin notification sent for quote ${quote.referenceNo}`);
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    // Don't throw - we don't want to fail the quote submission if email fails
  }
}

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotes' },
      { status: 500 }
    );
  }
}
