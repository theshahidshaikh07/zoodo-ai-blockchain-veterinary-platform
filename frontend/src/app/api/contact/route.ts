import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Zoodo Contact <onboarding@resend.dev>',
      to: 'zoodo.care@gmail.com',
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #ffffff; margin: 0; padding: 20px 0;">
          <div style="max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background-color: #0f172a; padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 24px; font-weight: bold;">New Contact Form Submission</h1>
              <p style="color: #cbd5e1; margin: 0; font-size: 14px;">Zoodo Platform &bull; Incoming Message</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 30px 20px; background-color: #f8fafc;">
              
              <!-- Card: Name -->
              <div style="background-color: #ffffff; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-weight: bold; font-size: 14px; color: #0f172a; margin-bottom: 8px;">Name:</div>
                <div style="font-size: 16px; color: #334155; margin: 0;">${name}</div>
              </div>
              
              <!-- Card: Email -->
              <div style="background-color: #ffffff; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-weight: bold; font-size: 14px; color: #0f172a; margin-bottom: 8px;">Email:</div>
                <div style="font-size: 16px; margin: 0;"><a href="mailto:${email}" style="color: #2563eb; text-decoration: underline;">${email}</a></div>
              </div>

              <!-- Card: Subject -->
              <div style="background-color: #ffffff; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-weight: bold; font-size: 14px; color: #0f172a; margin-bottom: 8px;">Subject:</div>
                <div style="font-size: 16px; color: #334155; margin: 0;">${subject}</div>
              </div>
              
              <!-- Card: Message -->
              <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border-left: 4px solid #0f172a; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <div style="font-weight: bold; font-size: 14px; color: #0f172a; margin-bottom: 8px;">Message:</div>
                <div style="font-size: 16px; color: #334155; margin: 0; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</div>
              </div>

            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: error.message || 'Something went wrong' }, { status: 500 });
  }
}
