# BrevEdu Platform

A modern learning platform built with React, TypeScript, and Firebase that delivers bite-sized video lessons with AI-powered practice sessions.

## Features

- 🎯 **Bite-sized Learning**: 5-minute video lessons designed for busy professionals
- 🤖 **AI Practice Sessions**: Interactive conversations powered by Tavus AI
- 👥 **User Management**: Firebase Authentication with role-based access
- 💎 **Premium Content**: Subscription-based access to advanced courses
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- ⚡ **Fast Performance**: Built with Vite for optimal loading speeds

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage)
- **AI Integration**: Tavus API for conversational practice
- **Build Tool**: Vite
- **Icons**: Phosphor Icons
- **Video Player**: Plyr React

## Fonts

The application uses the following custom fonts:

- **Rooftop**: Primary font for body text and headings
- **ManyChatGravity**: Used for special headings
- **CoFo Sans Mono**: Used for monospace text

All fonts are self-hosted in the `/public/fonts` directory.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd brevedu-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication, Firestore, and Storage
   - Update the Firebase config in `.env`

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and services
├── pages/              # Page components
├── services/           # Business logic services
├── styles/             # Global styles and themes
├── types/              # TypeScript type definitions
└── data/               # Mock data and constants
```

## Environment Variables

Key environment variables needed:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Application URLs
VITE_APP_URL=http://localhost:5173

# Tavus AI (Optional)
TAVUS_API_KEY=your_tavus_api_key
```

## Deployment

The application is configured to work with various deployment platforms:

### Netlify/Vercel
```bash
npm run build
```
Deploy the `dist` folder.

### GitHub Pages
The build is configured with relative paths and will work in subdirectories.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@brevedu.com or create an issue in the repository.