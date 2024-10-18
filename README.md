# Next Resend Email Sender

This is a simple, fast, and secure email sender built with Next.js and Resend. It provides a user-friendly interface for sending emails using the Resend API.

## Features

- Send emails using Resend API
- WYSIWYG editor for composing email body
- Responsive design
- Environment variable configuration for easy setup and deployment

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have a Resend account and API key
- You have Node.js installed (version 14.x or later)
- You have npm or yarn installed

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/madegit/next-resend.git
   cd next-resend
   ```

2. Install the dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:

   Copy the `.env.example` file to `.env.local` and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   Then edit `.env.local` with your actual values:

   ```
   RESEND_API_KEY=your_resend_api_key_here
   FROM_EMAIL=your_verified_email@yourdomain.com
   NEXT_PUBLIC_FROM_EMAIL=your_verified_email@yourdomain.com
   ```

## Usage

To run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

You can deploy this app to various platforms. Here are instructions for deploying to Vercel:

1. Push your code to a GitHub repository.

2. Go to [Vercel](https://vercel.com) and sign up or log in.

3. Click on "New Project" and import your GitHub repository.

4. In the "Environment Variables" section, add the following variables:
   - `RESEND_API_KEY`
   - `FROM_EMAIL`
   - `NEXT_PUBLIC_FROM_EMAIL`

5. Click "Deploy" and wait for the deployment to complete.

## Contributing

Contributions to this project are welcome. Please ensure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contact

If you have any questions, feel free to reach out to me on Twitter [@madethecreator](https://twitter.com/madethecreator).
