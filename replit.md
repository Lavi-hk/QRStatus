# FacultyQRStatus

## Overview

FacultyQRStatus is a QR-enabled real-time faculty availability system that leverages binary status encoding to inform students of a teacher's readiness for in-person interaction, thereby preempting unproductive visits and minimizing on-campus inefficiencies. Faculty members can manage their status (available, busy, away) and share it with students through QR codes. Students can view real-time faculty availability and scan QR codes to access specific faculty status pages. The application features real-time updates via WebSocket connections and provides both faculty management and student viewing interfaces.

## Recent Changes (January 2025)

✓ Successfully deployed complete FacultyQRStatus application
✓ Implemented faculty dashboard with real-time status updates
✓ Added QR code generation and management system
✓ Created student view with QR scanner functionality
✓ Built individual faculty status pages accessible via QR codes
✓ Integrated WebSocket real-time communication
✓ Applied responsive design with proper status indicators
✓ User confirmed application works perfectly

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite for development and building
- **UI Library**: Radix UI components with shadcn/ui component system
- **Styling**: Tailwind CSS with custom CSS variables for theming and status colors
- **Routing**: Wouter for client-side routing with distinct routes for faculty dashboard, student view, and individual faculty status pages
- **State Management**: TanStack Query for server state management and caching
- **Real-time Updates**: Custom WebSocket hook for live status updates across all connected clients

### Backend Architecture
- **Server Framework**: Express.js with TypeScript
- **Data Storage**: In-memory storage with sample seed data (designed to be replaced with database integration)
- **Real-time Communication**: WebSocket server for broadcasting faculty status changes
- **API Design**: RESTful endpoints for faculty CRUD operations with real-time WebSocket broadcasts
- **Request Logging**: Custom middleware for API request/response logging with performance metrics

### Database Schema
- **Faculty Table**: Stores faculty information including personal details, contact info, current status, custom messages, and timestamps
- **Status Types**: Three availability states - available, busy, away
- **ORM**: Drizzle ORM configured for PostgreSQL with schema validation using Zod

### Authentication and Authorization
- **Current State**: No authentication implemented - system uses first faculty member for demo purposes
- **Session Management**: Basic session middleware setup (connect-pg-simple) prepared for future authentication

### Component Architecture
- **Reusable Components**: Faculty cards, status cards, QR scanner with consistent styling
- **UI Components**: Complete shadcn/ui component library with customized variants
- **Mobile Responsive**: Responsive design with mobile-specific layouts and interactions

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL via Neon Database serverless driver
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Real-time**: Native WebSocket implementation
- **QR Code**: QRCode library for generating faculty QR codes

### UI and Styling
- **Component Library**: Radix UI primitives for accessible components
- **Icons**: Lucide React for consistent iconography
- **Styling**: Tailwind CSS with PostCSS for processing
- **Carousel**: Embla Carousel for interactive components

### Development Tools
- **Build Tool**: Vite with React plugin and TypeScript support
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Validation**: Zod for schema validation and type safety
- **Date Handling**: date-fns for date formatting and manipulation

### Replit Integration
- **Development**: Replit-specific plugins for error handling and cartographer integration
- **Deployment**: Configured for Replit hosting with environment-specific builds