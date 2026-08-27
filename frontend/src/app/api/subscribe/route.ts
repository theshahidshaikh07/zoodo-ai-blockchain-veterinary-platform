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

        // 1. If an Audience ID is configured, add them directly to the Resend Audience
        if (resendAudienceId) {
          await resend.contacts.create({
            email,
            unsubscribed: false,
            audienceId: resendAudienceId,
          });
        }

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

    // Fallback: If Brevo is configured, attempt Brevo
    const apiKey = process.env.BREVO_API_KEY;
    const listIdRaw = process.env.BREVO_LIST_ID;
    const normalizedListId = listIdRaw?.trim().replace(/^#/, "");
    const listId = normalizedListId ? Number(normalizedListId) : NaN;

    if (apiKey && Number.isFinite(listId)) {
      const response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
        body: JSON.stringify({
          email,
          listIds: [listId],
          updateEnabled: true,
        }),
        cache: "no-store",
      });

      if (response.ok) {
        return NextResponse.json({
          success: true,
          message: "You are subscribed. Please check your inbox to confirm.",
        });
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
