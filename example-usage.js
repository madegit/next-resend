// Example usage in your Vite app

import EmailService from './email-service.js'

const emailService = new EmailService('http://localhost:3000') // Your Next.js app URL

// Example 1: Send simple email
async function sendSimpleEmail() {
  const result = await emailService.sendEmail({
    to: 'recipient@example.com',
    subject: 'Hello from Vite App',
    body: '<h1>Hello!</h1><p>This email was sent from my Vite app using the Next.js API.</p>'
  })

  if (result.success) {
    console.log('Email sent successfully!')
  } else {
    console.error('Failed to send email:', result.error)
  }
}

// Example 2: Send email with file attachments
async function sendEmailWithFiles() {
  const fileInput = document.getElementById('file-input') // Your file input element
  const files = Array.from(fileInput.files)

  const result = await emailService.sendEmailWithAttachments({
    to: 'recipient@example.com',
    subject: 'Email with attachments',
    body: '<p>Please find the attached files.</p>',
    attachments: files
  })

  if (result.success) {
    console.log('Email with attachments sent successfully!')
  } else {
    console.error('Failed to send email:', result.error)
  }
}

// Example 3: Convert file to base64 and send
async function sendEmailWithBase64() {
  const file = document.getElementById('file-input').files[0]
  
  if (file) {
    const base64Content = await fileToBase64(file)
    
    const result = await emailService.sendEmailWithBase64Attachments({
      to: 'recipient@example.com',
      subject: 'Email with base64 attachment',
      body: '<p>File attached as base64.</p>',
      attachments: [{
        filename: file.name,
        content: base64Content
      }]
    })

    if (result.success) {
      console.log('Email sent successfully!')
    } else {
      console.error('Failed to send email:', result.error)
    }
  }
}

// Helper function to convert file to base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result.split(',')[1] // Remove data:type;base64, prefix
      resolve(base64)
    }
    reader.onerror = error => reject(error)
  })
}

// Example 4: Check API health
async function checkApiHealth() {
  const result = await emailService.checkHealth()
  console.log('API Health:', result)
}