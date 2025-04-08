'use client'

import { useState, useRef } from 'react'
import { sendEmail } from './actions'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Mail, Send, Loader2, Paperclip, X } from 'lucide-react'
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
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')

    const formData = new FormData(event.currentTarget)
    formData.set('body', body)
    
    // Add files to formData
    files.forEach((file, index) => {
      formData.append(`attachment${index}`, file)
    })
    
    const result = await sendEmail(formData)

    if (result.success) {
      setStatus('success')
      setBody('')
      setFiles([])
    } else {
      setStatus('error')
    }

    // Reset status after 5 seconds
    setTimeout(() => setStatus('idle'), 5000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles(prev => [...prev, ...newFiles])
      
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
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
              <div className="min-h-[200px]">
                <ReactQuill
                  theme="snow"
                  value={body}
                  onChange={setBody}
                  placeholder="Type your message here..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  id="attachments"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Paperclip className="h-4 w-4" />
                  Attach Files
                </Button>
              </div>
              {files.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="text-sm font-medium">Attached Files:</p>
                  <ul className="space-y-1">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
                        <span className="text-sm truncate max-w-[80%]">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove {file.name}</span>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
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
            <p className="text-green-600 text-center mt-4 mb-4">Email sent successfully!</p>
          )}
          {status === 'error' && (
            <p className="text-red-600 text-center mt-4 mb-4">Failed to send email. Please try again.</p>
          )}
        </form>
      </Card>
    </div>
  )
}