# BrevEdu Platform

A modern learning platform that delivers focused education through bite-sized video lessons with AI-powered practice sessions.

## Features

- 🎯 **5-Minute Lessons**: Bite-sized video content designed for busy professionals
- 🤖 **AI Practice Sessions**: Interactive conversations powered by Tavus AI
- 📱 **Mobile-First Design**: Responsive design optimized for all devices
- 🔐 **User Management**: Firebase Authentication with role-based access
- 💎 **Subscription Tiers**: Free and Premium access levels
- 📊 **Analytics**: Comprehensive tracking with Firebase Analytics
- 🎨 **Modern UI**: Beautiful, production-ready design with Tailwind CSS

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication, Firestore, and Storage enabled
- Tavus AI account (for AI practice features)

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone <your-repo-url>
   cd brevedu-platform
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Environment Configuration

### Required Variables

Copy `.env.example` to `.env` and configure these essential variables:

```bash
# Firebase (already configured, but can be overridden)
VITE_FIREBASE_PROJECT_ID=your_project_id

# Tavus AI Integration
TAVUS_API_KEY=your_tavus_api_key
TAVUS_DEFAULT_TTL=3600
TAVUS_MAX_RETRIES=3

# Feature Flags
ENABLE_TAVUS_CONFIRMATION=true
TAVUS_TTL_ENABLED=true
TAVUS_OFFLINE_QUEUE=true
```

### Environment Files

- `.env.example` - Template with all available variables
- `.env.local.example` - Local development overrides
- `.env.production.example` - Production configuration

### Tavus AI Setup

1. **Create Tavus Account**: Sign up at [Tavus.io](https://tavus.io)
2. **Get API Key**: Generate an API key from your Tavus dashboard
3. **Configure Settings**: In the admin panel, go to AI Settings and configure:
   - Replica ID
   - Persona ID
   - API Key

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
```

### Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utilities and services
├── pages/              # Page components
├── services/           # Business logic services
├── styles/             # CSS and styling
└── types/              # TypeScript type definitions
```

### Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Auth, Firestore, Storage, Analytics)
- **AI Integration**: Tavus AI for conversational practice
- **Video**: Plyr for video playback
- **Icons**: Lucide React
- **Testing**: Vitest, Testing Library

## Deployment

### Firebase Setup

1. **Create Firebase Project**
2. **Enable Services**:
   - Authentication (Email/Password)
   - Firestore Database
   - Storage
   - Analytics
3. **Configure Security Rules**
4. **Deploy using Firebase Hosting or your preferred platform**

### Production Checklist

- [ ] Configure production environment variables
- [ ] Set up Tavus AI production credentials
- [ ] Configure Firebase security rules
- [ ] Set up monitoring and analytics
- [ ] Configure CDN for static assets
- [ ] Set up error tracking (Sentry)
- [ ] Configure backup strategies

## Features Guide

### User Roles

- **Anonymous**: Can view anonymous-level courses
- **Free**: Access to free courses + 1 daily AI practice session
- **Premium**: Access to all courses + 3 daily AI practice sessions
- **Admin**: Full access + course management

### AI Practice Sessions

- Powered by Tavus AI for natural conversations
- 3-minute session limit with TTL enforcement
- Offline queue support for poor connections
- Usage tracking and daily limits
- Completion scoring and progress tracking

### Course Management

- Admin panel for course creation/editing
- Support for YouTube nocookie embeds
- AI conversation context configuration
- Access level controls
- Draft/published states

## API Reference

### Tavus Integration

The platform integrates with Tavus AI for conversational practice:

- **Session Creation**: Dynamic conversation generation
- **Context Management**: Course-specific AI behavior
- **Usage Tracking**: Daily limits and analytics
- **Offline Support**: Queue operations when offline

### Firebase Services

- **Authentication**: User management and roles
- **Firestore**: Course data and user progress
- **Storage**: Image uploads and assets
- **Analytics**: User behavior and engagement

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## Testing

### Running Tests

```bash
npm run test              # Unit tests
npm run test:ui           # Interactive test UI
npm run test:coverage     # Coverage report
npm run test:integration  # Integration tests
```

### Manual Testing

See `src/lib/__tests__/manual-test-guide.md` for comprehensive manual testing procedures.

## Troubleshooting

### Common Issues

1. **Tavus API Errors**: Check API key and network connectivity
2. **Firebase Errors**: Verify project configuration and security rules
3. **Build Errors**: Ensure all environment variables are set
4. **Video Playback**: Confirm YouTube nocookie URLs are used

### Debug Mode

Enable debug mode for detailed logging:

```bash
VITE_DEBUG_MODE=true
VITE_CONSOLE_LOGGING=true
```

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Check the documentation
- Review the troubleshooting guide
- Open an issue on GitHub
- Contact support@brevedu.com
