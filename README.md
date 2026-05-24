# inv4u

A Next.js project with Tailwind CSS.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Pages and application routes
- `/components` - React components
- `/lib` - External connections and utilities
- `/types` - TypeScript type definitions
- `/public` - Static files
- `/styles` - Global styles

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_KEY` - Supabase service key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number
- `ELEVENLABS_API_KEY` - ElevenLabs API key
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `STRIPE_SECRET_KEY` - Stripe secret key

## Development

Edit `app/page.tsx` to get started.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
