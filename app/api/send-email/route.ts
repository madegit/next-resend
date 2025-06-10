import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

if (!process.env.FROM_EMAIL) {
  throw new Error("FROM_EMAIL environment variable is not set")
}

const fromEmail = process.env.FROM_EMAIL

// Enable CORS for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders })
}

export async function POST(request: NextRequest) {
  try {
    console.log("=== Email API Request Received ===")
    console.log("Timestamp:", new Date().toISOString())
    console.log("Request URL:", request.url)
    console.log("Request Method:", request.method)

    const contentType = request.headers.get("content-type") || ""
    console.log("Content-Type:", contentType)

    let to: string
    let subject: string
    let body: string
    let attachments: any[] = []

    if (contentType.includes("multipart/form-data")) {
      console.log("Processing FormData request...")

      // Handle FormData (with file attachments)
      const formData = await request.formData()
      to = formData.get("to") as string
      subject = formData.get("subject") as string
      body = formData.get("body") as string

      console.log("FormData contents:")
      console.log("- To:", to)
      console.log("- Subject:", subject)
      console.log("- Body length:", body?.length || 0)
      console.log("- Body preview:", body?.substring(0, 100) + (body?.length > 100 ? "..." : ""))

      // Process attachments
      let attachmentCount = 0
      for (const [key, value] of formData.entries()) {
        if (key.startsWith("attachment") && value instanceof File) {
          const buffer = await value.arrayBuffer()
          attachments.push({
            filename: value.name,
            content: Buffer.from(buffer),
          })
          attachmentCount++
          console.log(`- Attachment ${attachmentCount}: ${value.name} (${value.size} bytes, ${value.type})`)
        }
      }
      console.log("- Total attachments:", attachmentCount)
    } else {
      console.log("Processing JSON request...")

      // Handle JSON data (no file attachments)
      const data = await request.json()
      to = data.to
      subject = data.subject
      body = data.body

      console.log("JSON request contents:")
      console.log("- To:", to)
      console.log("- Subject:", subject)
      console.log("- Body length:", body?.length || 0)
      console.log("- Body preview:", body?.substring(0, 100) + (body?.length > 100 ? "..." : ""))

      // Handle base64 encoded attachments if provided
      if (data.attachments && Array.isArray(data.attachments)) {
        attachments = data.attachments.map((att: any) => ({
          filename: att.filename,
          content: Buffer.from(att.content, "base64"),
        }))
        console.log("- Base64 attachments:", data.attachments.length)
        data.attachments.forEach((att: any, index: number) => {
          console.log(`  - Attachment ${index + 1}: ${att.filename} (base64 length: ${att.content?.length || 0})`)
        })
      } else {
        console.log("- No attachments provided")
      }
    }

    // Validate required fields
    if (!to || !subject || !body) {
      console.log("❌ Validation failed - Missing required fields")
      console.log("- To provided:", !!to)
      console.log("- Subject provided:", !!subject)
      console.log("- Body provided:", !!body)

      return NextResponse.json(
        { success: false, error: "Missing required fields: to, subject, body" },
        { status: 400, headers: corsHeaders },
      )
    }

    console.log("✅ Validation passed - Sending email...")
    console.log("Email details:")
    console.log("- From:", fromEmail)
    console.log("- To:", to)
    console.log("- Subject:", subject)
    console.log("- Has attachments:", attachments.length > 0)
    console.log("- Attachment count:", attachments.length)

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: body,
      attachments: attachments.length > 0 ? attachments : undefined,
    })

    if (error) {
      console.error("❌ Resend API Error:", error)
      console.error("Error details:", JSON.stringify(error, null, 2))
      return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders })
    }

    console.log("✅ Email sent successfully!")
    console.log("Resend response:", JSON.stringify(data, null, 2))
    console.log("=== Email API Request Completed ===\n")

    return NextResponse.json({ success: true, data }, { status: 200, headers: corsHeaders })
  } catch (error) {
    console.error("❌ Unexpected error in send-email API:")
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    console.log("=== Email API Request Failed ===\n")

    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500, headers: corsHeaders },
    )
  }
}

// GET endpoint to check if the API is working
export async function GET() {
  console.log("=== Email API Health Check ===")
  console.log("Timestamp:", new Date().toISOString())
  console.log("From Email configured:", fromEmail)
  console.log("Resend API Key configured:", !!process.env.RESEND_API_KEY)

  const response = {
    message: "Email API is working",
    fromEmail: fromEmail,
    timestamp: new Date().toISOString(),
    environment: {
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasFromEmail: !!process.env.FROM_EMAIL,
      nodeEnv: process.env.NODE_ENV,
    },
  }

  console.log("Health check response:", JSON.stringify(response, null, 2))
  console.log("=== Health Check Completed ===\n")

  return NextResponse.json(response, { status: 200, headers: corsHeaders })
}
