# SMASH Tech Fest - Event Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

Welcome to the **SMASH Tech Fest** event management platform! This application is designed to provide a seamless experience for managing and participating in tech events. Hosted live at [https://www.smash.net.in/](https://www.smash.net.in/), this platform offers features for event discovery, registration, and administration.

**Project Size (Approximate):** ~5MB (without dependencies). _Note: Actual size may vary after installation of dependencies._

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Environment Variables](#environment-variables)
- [Learn More](#learn-more)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)
- [Creators](#creators)

## Getting Started

Follow these instructions to get a local development environment running.

### Prerequisites

Make sure you have the following installed:

- **Node.js**: (Recommended version >= 18) - [Download Node.js](https://nodejs.org/)
- **npm**, **yarn**, **pnpm**, or **bun**: Choose your preferred Node.js package manager. This project is using `npm`.

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repository-url>
   cd techfest
   ```

2. **Install dependencies using npm:**

   ```bash
   npm install
   ```

### Running the Development Server

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open your browser and navigate to** [http://localhost:3000](http://localhost:3000) to view the application.

   The page will auto-reload as you make edits to the files.

## Key Features

- **Event Discovery**: Browse a curated list of tech events.
- **Event Details**: View detailed information about each event, including schedules, speakers, and descriptions.
- **User Authentication**: Secure user registration and login powered by Supabase.
- **Profile Management**: Users can manage their profiles and event registrations.
- **Admin Dashboard**: Administrative interface for managing events, users, and platform settings.
- **Server-Side Authentication**: Enhanced security with complete server-side authentication using Supabase.
- **Responsive Design**: Optimized for various screen sizes and devices.
- **Payment Integration**: (Future Feature) Seamless payment processing for paid events.
- **Real-time Updates**: (Future Feature) Real-time event updates and notifications.

## Technology Stack

This project is built using the following technologies:

- **Frontend Framework**: [Next.js](https://nextjs.org/) (v15.1.7) - React framework for building performant web applications.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4.0.7) - Utility-first CSS framework for rapid UI development.
- **Component Library**: [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components for building high-quality user interfaces.
- **Animation**: [GSAP](https://greensock.com/gsap/) and [Framer Motion](https://www.framer.com/motion/) - For smooth and engaging animations.
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) - Small, fast and scalable bearbones state-management solution.
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/) for form validation.
- **Database & Backend**: [Supabase](https://supabase.com/) - Open source Firebase alternative for backend services, including database, authentication, and more.
- **Icons**: [Lucide React](https://lucide.dev/) - Beautifully simple icons.
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/) - Performant and customizable carousel component.
- **UI Utilities**: [class-variance-authority](https://cva.style/), [clsx](https://www.npmjs.com/package/clsx), [tailwind-merge](https://www.npmjs.com/package/tailwind-merge), [sonner](https://sonner.emilkowalski.com/)

## Environment Variables

To run this project, you will need to set up environment variables. Create a `.env.local` file in the root directory and add the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Replace `your_supabase_url`, `your_supabase_anon_key`, and `your_supabase_service_role_key` with your actual Supabase project credentials. You can find these in your Supabase project settings under "Project settings" -> "API".

## Learn More

To learn more about the technologies used in this project, refer to the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [React Documentation](https://reactjs.org/docs) - Learn about React, the core library behind Next.js.
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Explore the utility-first CSS framework.
- [Supabase Documentation](https://supabase.com/docs) - Discover the features of Supabase.
- [Radix UI Documentation](https://www.radix-ui.com/docs) - Learn about Radix UI components.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js. Vercel provides seamless deployment and hosting for Next.js applications.

Alternatively, you can deploy to other platforms that support Node.js server deployments. Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push your changes to your fork.
5. Submit a pull request.

Please ensure your code adheres to the project's coding standards and includes appropriate tests.

## License

[MIT License](LICENSE)

Copyright (c) 2024 [Your Name/Organization]

## Support

For any questions, issues, or support requests, please contact [support@smash.net.in](mailto:support@smash.net.in).

## Creators

- Sanu K Joseph
- Aswin K O

---

**Live Demo:** [https://www.smash.net.in/](https://www.smash.net.in/)

Thank you for visiting the SMASH Tech Fest project! We hope you find it useful and engaging.
