import { AtSign, Github, File, Twitter } from "lucide-react";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Next/Resend</h1>
        

        <p className="text-center text-gray-600 dark:text-gray-400">
          A simple fast and secure email sender built with Next.js and Resend.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="/sendmail"
          >
            <AtSign className="w-5 h-5" />
            Send an Email
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://github.com/madegit/next-resend"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-5 h-5 mr-2" />
            Github Repo
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://resend.com/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <File className="w-4 h-4" />
          Resend Documentation
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://twitter.com/madethecreator"
          target="_blank"
          rel="noopener noreferrer">
        
          <Twitter className="w-4 h-4" />
         by @madethecreator
        </a>
      </footer>
    </div>
  );
}