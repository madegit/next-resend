'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

if (!process.env.FROM_EMAIL) {
  throw new Error('FROM_EMAIL environment variable is not set')
}

const fromEmail = process.env.FROM_EMAIL

export async function sendEmail(formData: FormData) {
  const to = formData.get('to') as string
  const subject = formData.get('subject') as string
  const body = formData.get('body') as string

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html: body,
    })

    if (error) {
      console.error('Error sending email:', error)
      return { success: false, error: error.message }
    }

    console.log('Email sent successfully:', data)
    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}