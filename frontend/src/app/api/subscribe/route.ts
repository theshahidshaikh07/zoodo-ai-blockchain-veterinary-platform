import { NextResponse } from "next/server";

type SubscribeBody = {
  email?: string;
  honeypot?: string;
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  try {
    const { email, honeypot }: SubscribeBody = await req.json();

    // Bot trap: fail silently to avoid bot probing.
    if (honeypot) {
      return NextResponse.json({ success: true, message: "Subscribed" });
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Use Resend for subscription (Zero IP restrictions)
    const resendApiKey = process.env.RESEND_API_KEY;
    const resendAudienceId = process.env.RESEND_AUDIENCE_ID;

    if (resendApiKey) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(resendApiKey);

        // 1. Add contact directly to Resend Audience table
        await resend.contacts.create({
          email,
          unsubscribed: false,
          ...(resendAudienceId ? { audienceId: resendAudienceId } : {}),
        });

        // 2. Notify Zoodo admin about the new subscriber
        await resend.emails.send({
          from: "Zoodo <onboarding@resend.dev>",
          to: "zoodo.care@gmail.com",
          subject: `New Newsletter Subscriber: ${email}`,
          html: `<p>A new visitor has subscribed to the Zoodo newsletter: <strong>${email}</strong></p>`,
        });

        return NextResponse.json({
          success: true,
          message: "You are subscribed. Welcome to Zoodo!",
        });
      } catch (resendError: any) {
        console.error("Resend subscription error:", resendError);
        // If already subscribed in Resend, return success
        if (resendError?.message?.includes("already exists") || resendError?.statusCode === 409) {
          return NextResponse.json({
            success: true,
            message: "You are already subscribed.",
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "You are subscribed. Welcome to Zoodo!",
    });
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
