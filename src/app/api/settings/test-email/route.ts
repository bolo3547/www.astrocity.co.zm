import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { testEmailConnection } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { smtpHost, smtpPort, smtpUser, smtpPass, smtpFrom } = body;

    // Validate required fields
    if (!smtpHost || !smtpUser || !smtpPass || !smtpFrom) {
      return NextResponse.json(
        { error: 'Missing required SMTP configuration' },
        { status: 400 }
      );
    }

    // Test the connection
    const result = await testEmailConnection({
      host: smtpHost,
      port: smtpPort || 587,
      user: smtpUser,
      pass: smtpPass,
      from: smtpFrom,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Email connection test successful!',
      });
    } else {
      return NextResponse.json(
        { error: result.error || 'Email connection test failed' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error testing email:', error);
    return NextResponse.json(
      { error: 'Failed to test email connection' },
      { status: 500 }
    );
  }
}
