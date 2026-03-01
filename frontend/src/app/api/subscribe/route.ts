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

    const apiKey = process.env.BREVO_API_KEY;
    const listIdRaw = process.env.BREVO_LIST_ID;
    const normalizedListId = listIdRaw?.trim().replace(/^#/, "");
    const listId = normalizedListId ? Number(normalizedListId) : NaN;

    if (apiKey?.startsWith("xsmtpsib-")) {
      return NextResponse.json(
        {
          success: false,
          message: "BREVO_API_KEY appears to be an SMTP key. Use a Brevo API key (xkeysib-...).",
        },
        { status: 500 }
      );
    }

    if (!apiKey || !Number.isFinite(listId)) {
      return NextResponse.json(
        { success: false, message: "Subscribe service is not configured." },
        { status: 500 }
      );
    }

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

    const errorData = await response.json().catch(() => ({}));
    const code = typeof errorData?.code === "string" ? errorData.code : "";
    const providerMessage = typeof errorData?.message === "string" ? errorData.message : "";

    // Existing contacts should not block a successful UX.
    if (code === "duplicate_parameter") {
      return NextResponse.json({
        success: true,
        message: "You are already subscribed.",
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: providerMessage || "Unable to subscribe right now. Please try again.",
        code: code || "brevo_error",
      },
      { status: response.status >= 400 && response.status < 500 ? response.status : 502 }
    );
  } catch (error) {
    console.error("Subscribe API error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
