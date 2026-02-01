import nodemailer from 'nodemailer';

export interface EmailConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export interface QuotationEmailData {
  to: string;
  clientName: string;
  quotationNumber: string;
  companyName: string;
  companyEmail: string;
  companyPhone?: string;
  totalAmount: string;
  validUntil: string;
  pdfBuffer: Buffer;
}

function createTransporter(config: EmailConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

export async function sendQuotationEmail(
  config: EmailConfig,
  data: QuotationEmailData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter(config);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Quotation from ${data.companyName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #0f172a; padding: 30px 40px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">${data.companyName}</h1>
              <p style="margin: 8px 0 0; color: #94a3b8; font-size: 14px;">Solar & Water Solutions</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #0f172a; font-size: 20px;">Your Quotation is Ready</h2>
              
              <p style="margin: 0 0 20px; color: #475569; font-size: 15px; line-height: 1.6;">
                Dear ${data.clientName},
              </p>
              
              <p style="margin: 0 0 20px; color: #475569; font-size: 15px; line-height: 1.6;">
                Thank you for your interest in our services. Please find attached your quotation as requested.
              </p>
              
              <!-- Quotation Summary Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 13px;">Quotation Number</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <strong style="color: #0f172a; font-size: 14px;">${data.quotationNumber}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 13px;">Total Amount</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <strong style="color: #1e40af; font-size: 16px;">${data.totalAmount}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #64748b; font-size: 13px;">Valid Until</span>
                        </td>
                        <td style="padding: 8px 0; text-align: right;">
                          <strong style="color: #0f172a; font-size: 14px;">${data.validUntil}</strong>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 0 0 20px; color: #475569; font-size: 15px; line-height: 1.6;">
                The quotation PDF is attached to this email. Please review the details and feel free to contact us if you have any questions or require modifications.
              </p>
              
              <p style="margin: 0 0 30px; color: #475569; font-size: 15px; line-height: 1.6;">
                We look forward to working with you!
              </p>
              
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #16a34a; border-radius: 6px;">
                    <a href="mailto:${data.companyEmail}?subject=Re: Quotation ${data.quotationNumber}" 
                       style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px;">
                      Reply to This Quote
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 25px 40px; border-radius: 0 0 8px 8px; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px; color: #64748b; font-size: 13px;">
                <strong>${data.companyName}</strong>
              </p>
              <p style="margin: 0 0 5px; color: #64748b; font-size: 12px;">
                Email: ${data.companyEmail}
              </p>
              ${data.companyPhone ? `<p style="margin: 0; color: #64748b; font-size: 12px;">Phone: ${data.companyPhone}</p>` : ''}
            </td>
          </tr>
        </table>
        
        <!-- Disclaimer -->
        <p style="margin: 20px 0 0; color: #94a3b8; font-size: 11px; text-align: center;">
          This email and any attachments are confidential and intended solely for the addressee.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const textContent = `
Your Quotation from ${data.companyName}

Dear ${data.clientName},

Thank you for your interest in our services. Please find attached your quotation as requested.

Quotation Summary:
- Quotation Number: ${data.quotationNumber}
- Total Amount: ${data.totalAmount}
- Valid Until: ${data.validUntil}

The quotation PDF is attached to this email. Please review the details and feel free to contact us if you have any questions or require modifications.

We look forward to working with you!

Best regards,
${data.companyName}
Email: ${data.companyEmail}
${data.companyPhone ? `Phone: ${data.companyPhone}` : ''}
    `;

    const info = await transporter.sendMail({
      from: `"${data.companyName}" <${config.from}>`,
      to: data.to,
      subject: `Your Quotation ${data.quotationNumber} from ${data.companyName}`,
      text: textContent,
      html: htmlContent,
      attachments: [
        {
          filename: `${data.quotationNumber}.pdf`,
          content: data.pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

export async function testEmailConnection(config: EmailConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createTransporter(config);
    await transporter.verify();
    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Connection failed' 
    };
  }
}

export interface NewQuoteNotificationData {
  referenceNo: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service: string;
  location?: string;
  message?: string;
  companyName: string;
  adminUrl: string;
}

export async function sendNewQuoteNotification(
  config: EmailConfig,
  data: NewQuoteNotificationData
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transporter = createTransporter(config);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request - ${data.referenceNo}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #16a34a; padding: 30px 40px; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">🔔 New Quote Request</h1>
              <p style="margin: 8px 0 0; color: #dcfce7; font-size: 14px;">Reference: ${data.referenceNo}</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #475569; font-size: 15px; line-height: 1.6;">
                A new quote request has been submitted on ${data.companyName} website.
              </p>
              
              <!-- Customer Details Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <h3 style="margin: 0 0 15px; color: #0f172a; font-size: 16px;">Customer Details</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 13px;">Name</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <strong style="color: #0f172a; font-size: 14px;">${data.name}</strong>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 13px;">Email</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <a href="mailto:${data.email}" style="color: #1e40af; font-size: 14px; text-decoration: none;">${data.email}</a>
                        </td>
                      </tr>
                      ${data.phone ? `
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 13px;">Phone</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <a href="tel:${data.phone}" style="color: #1e40af; font-size: 14px; text-decoration: none;">${data.phone}</a>
                        </td>
                      </tr>
                      ` : ''}
                      ${data.company ? `
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 13px;">Company</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <strong style="color: #0f172a; font-size: 14px;">${data.company}</strong>
                        </td>
                      </tr>
                      ` : ''}
                      <tr>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                          <span style="color: #64748b; font-size: 13px;">Service Required</span>
                        </td>
                        <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
                          <strong style="color: #16a34a; font-size: 14px;">${data.service}</strong>
                        </td>
                      </tr>
                      ${data.location ? `
                      <tr>
                        <td style="padding: 8px 0;">
                          <span style="color: #64748b; font-size: 13px;">Location</span>
                        </td>
                        <td style="padding: 8px 0; text-align: right;">
                          <strong style="color: #0f172a; font-size: 14px;">${data.location}</strong>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
              
              ${data.message ? `
              <!-- Message Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fffbeb; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 10px; color: #92400e; font-size: 14px;">Customer Message</h3>
                    <p style="margin: 0; color: #78350f; font-size: 14px; line-height: 1.6;">${data.message}</p>
                  </td>
                </tr>
              </table>
              ` : ''}
              
              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${data.adminUrl}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 30px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                      View in Admin Panel →
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 20px 0 0; color: #94a3b8; font-size: 13px; text-align: center;">
                This notification was sent automatically from ${data.companyName} website.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const textContent = `
New Quote Request - ${data.referenceNo}

A new quote request has been submitted on ${data.companyName} website.

Customer Details:
- Name: ${data.name}
- Email: ${data.email}
${data.phone ? `- Phone: ${data.phone}` : ''}
${data.company ? `- Company: ${data.company}` : ''}
- Service Required: ${data.service}
${data.location ? `- Location: ${data.location}` : ''}

${data.message ? `Customer Message:\n${data.message}` : ''}

View in Admin Panel: ${data.adminUrl}
    `;

    const info = await transporter.sendMail({
      from: `"${data.companyName}" <${config.from}>`,
      to: config.from, // Send to admin email
      subject: `🔔 New Quote Request: ${data.referenceNo} - ${data.name}`,
      text: textContent,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Admin notification email error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send notification' 
    };
  }
}
