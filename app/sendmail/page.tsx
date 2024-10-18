import EmailForm from './EmailForm'

export default function SendMailPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="font-[family-name:var(--font-geist-sans)] max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 tracking-tighter mb-8">
         Our Email Sender
        </h1>
        <EmailForm />
      </div>
    </div>
  )
}