'use client'

import { useState } from 'react'
import { sendEmail } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Send, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

if (!process.env.NEXT_PUBLIC_FROM_EMAIL) {
  throw new Error('NEXT_PUBLIC_FROM_EMAIL environment variable is not set')
}

const fromEmail = process.env.NEXT_PUBLIC_FROM_EMAIL

export default function EmailForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [body, setBody] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')

    const formData = new FormData(event.currentTarget)
    formData.set('body', body)
    const result = await sendEmail(formData)

    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
    }

    // Reset status after 5 seconds
    setTimeout(() => setStatus('idle'), 5000)
  }

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Send Email
          </CardTitle>
          <CardDescription>
            Compose and send an email from {fromEmail}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="to">To</Label>
              <Input
                type="email"
                id="to"
                name="to"
                placeholder="recipient@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                type="text"
                id="subject"
                name="subject"
                placeholder="Enter email subject"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <ReactQuill
                theme="snow"
                value={body}
                onChange={setBody}
                placeholder="Type your message here..."
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="w-full"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </CardFooter>
          {status === 'success' && (
            <p className="text-green-600 text-center mt-4">Email sent successfully!</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-center mt-4">Failed to send email. Please try again.</p>
          )}
        </form>
      </Card>
    </div>
  )
}