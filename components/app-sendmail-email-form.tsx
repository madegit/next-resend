'use client'

import { useState } from 'react'
import { sendEmail } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Send, Loader2 } from 'lucide-react'
import { toast } from "@/components/ui/use-toast"

export function EmailFormComponent() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')

    const formData = new FormData(event.currentTarget)
    const result = await sendEmail(formData)

    if (result.success) {
      setStatus('success')
      toast({
        title: "Email Sent",
        description: "Your email has been sent successfully.",
        duration: 5000,
      })
    } else {
      setStatus('error')
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
        duration: 5000,
      })
    }

    setStatus('idle')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Mail className="w-6 h-6" />
          Send Email
        </CardTitle>
        <CardDescription>
          Compose and send an email from reach@nairable.com
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
            <Textarea
              id="body"
              name="body"
              placeholder="Type your message here..."
              required
              rows={8}
              className="resize-none"
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
      </form>
    </Card>
  )
}