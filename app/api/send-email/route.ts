import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

if (!process.env.FROM_EMAIL) {
  throw new Error("FROM_EMAIL environment variable is not set");
}

const fromEmail = process.env.FROM_EMAIL;

// Enable CORS for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let to: string;
    let subject: string;
    let body: string;
    let attachments: any[] = [];

    if (contentType.includes("multipart/form-data")) {
      // Handle FormData (with file attachments)
      const formData = await request.formData();
      to = formData.get("to") as string;
      subject = formData.get("subject") as string;
      body = formData.get("body") as string;

      // Process attachments
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("attachment") && value instanceof File) {
          const buffer = await value.arrayBuffer();
          attachments.push({
            filename: value.name,
            content: Buffer.from(buffer),
          });
        }
      }
    } else {
      // Handle JSON data (no file attachments)
      const data = await request.json();
      to = data.to;
      subject = data.subject;
      body = data.body;

      // Handle base64 encoded attachments if provided
      if (data.attachments && Array.isArray(data.attachments)) {
        attachments = data.attachments.map((att: any) => ({
          filename: att.filename,
          content: Buffer.from(att.content, "base64"),
        }));
      }
    }

    // Validate required fields
    if (!to || !subject || !body) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: to, subject, body" },
        { status: 400, headers: corsHeaders },
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: body,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      console.error("Error sending email:", error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500, headers: corsHeaders },
      );
    }

    console.log("Email sent successfully:", data);
    return NextResponse.json(
      { success: true, data },
      { status: 200, headers: corsHeaders },
    );
  } catch (error) {
    console.error("Error in send-email API:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500, headers: corsHeaders },
    );
  }
}

// GET endpoint to check if the API is working
export async function GET() {
  return NextResponse.json(
    {
      message: "Email API is working",
      fromEmail: fromEmail,
      timestamp: new Date().toISOString(),
    },
    { status: 200, headers: corsHeaders },
  );
}
