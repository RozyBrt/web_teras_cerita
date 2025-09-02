# Overview

"Ruang Tenang" (Peaceful Space) is a mental health support web application designed to provide users with a safe, digital environment for emotional support and stress assessment. The application features an AI-powered chatbot that provides positive affirmations and empathetic responses, a stress assessment questionnaire, emergency contact functionality, and access to professional mental health resources.

The application is built as a full-stack TypeScript application with a React frontend using shadcn/ui components and a Node.js Express backend. It follows a calming, minimalist design philosophy with soft colors and gentle user interactions to create a therapeutic digital environment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React with TypeScript and utilizes a modern component-based architecture:

- **UI Framework**: React with Vite for fast development and optimized builds
- **Component Library**: shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming and a calming color palette
- **State Management**: React Query (TanStack Query) for server state management and local React state for UI interactions
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form handling

The application follows a modal-based interaction pattern where different features (chat, emergency contact, stress assessment) are presented as overlay components rather than separate pages, maintaining the peaceful, non-disruptive user experience.

## Backend Architecture

The backend uses a RESTful API architecture built with Express.js:

- **Framework**: Express.js with TypeScript for type safety
- **API Design**: RESTful endpoints for chat sessions, emergency requests, and stress assessments
- **Data Validation**: Zod schemas for runtime type checking and validation
- **Storage Abstraction**: Interface-based storage layer supporting both in-memory storage (development) and database storage (production)
- **Development Setup**: Vite integration for hot module replacement in development

The backend implements middleware for request logging and error handling, with structured JSON responses throughout the API.

## Data Storage Solutions

The application uses a flexible storage architecture:

- **Database**: PostgreSQL with Neon Database for serverless deployment
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Schema Design**: Four main entities - users, chat sessions, stress assessments, and emergency requests
- **Development Storage**: In-memory storage implementation for development and testing
- **Session Management**: JSON-serialized message storage for chat sessions

The database schema includes proper indexing and relationships, with timestamps for all records and UUID primary keys for security.

## Authentication and Authorization

Currently implements a basic user system with plans for session-based authentication:

- **User Management**: Basic user creation and retrieval functionality
- **Session Handling**: Designed for cookie-based session management
- **Security**: Prepared for PostgreSQL session storage using connect-pg-simple

## External Dependencies

### Email Service Integration
- **SendGrid**: Configured for emergency notification emails to administrators
- **Email Templates**: HTML-formatted emergency alerts with priority indicators
- **Fallback Configuration**: Environment variable-based SMTP configuration for flexibility

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production
- **Connection Pooling**: @neondatabase/serverless for optimized database connections

### UI and Design Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variants
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens

### Development and Build Tools
- **TypeScript**: Full-stack type safety with shared schemas
- **Vite**: Frontend build tool with HMR and optimized production builds
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Backend bundling for production deployment

### Form and Validation
- **React Hook Form**: Performant form handling with minimal re-renders
- **Zod**: Runtime validation and TypeScript type inference
- **Drizzle Zod**: Integration between Drizzle schemas and Zod validation

The application is designed for deployment on platforms like Replit with environment variable configuration for all external services and database connections.