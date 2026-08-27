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

        // 1. Auto-discover Audience ID from Resend if not set
        let targetAudienceId = resendAudienceId;
        if (!targetAudienceId) {
          try {
            const audRes = await fetch("https://api.resend.com/audiences", {
              headers: { "Authorization": `Bearer ${resendApiKey.trim()}` }
            });
            const audData = await audRes.json().catch(() => ({}));
            if (audData?.data && Array.isArray(audData.data) && audData.data.length > 0) {
              targetAudienceId = audData.data[0].id;
              console.log("[Resend] Automatically discovered Audience ID:", targetAudienceId);
            }
          } catch (e) {
            console.error("[Resend] Could not auto-discover audience:", e);
          }
        }

        // 2. Add contact to the Audience using both audience endpoint and global contacts
        try {
          const url = targetAudienceId
            ? `https://api.resend.com/audiences/${targetAudienceId}/contacts`
            : "https://api.resend.com/contacts";

          const contactRes = await fetch(url, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey.trim()}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.trim(),
              unsubscribed: false,
              ...(targetAudienceId ? { audience_id: targetAudienceId } : {}),
            }),
          });
          const contactData = await contactRes.json().catch(() => ({}));
          console.log("[Resend Contacts Result]", contactRes.status, contactData);
        } catch (contactErr) {
          console.error("[Resend Contacts Error]", contactErr);
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
        return NextResponse.json({
          success: true,
          message: "You are subscribed. Welcome to Zoodo!",
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
