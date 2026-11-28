# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Contact enquiries

The enquiry form sends mail through Resend on the server. Configure the `RESEND_API_KEY` secret and `ENQUIRY_FROM_EMAIL` (a sender address on a domain verified in Resend) in the deployment environment. For local development, provide the same environment variables to the development server. Enquiries are delivered to `info.quadtricks@gmail.com`, with the visitor's address set as the reply-to address. The form reports an error if the service is not configured or the provider rejects the request.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
