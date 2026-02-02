---
title: PDF Generator - AI-Powered Document Creation
slug: pdf-generator-web-app
summary: A full-stack web application that leverages AI to generate professional PDFs from natural language descriptions. Built with Next.js 16, TypeScript, and integrated with Claude and GPT models.
technologies:
  - next.js
  - react
  - typescript
  - tailwind
  - radix-ui
  - react-pdf
  - ai-sdk
  - anthropic-claude
  - openai
  - better-auth
  - postgresql
  - vercel
  - zod
  - zustand
  - swr
  - monaco-editor
featuredImage: ../../images/project-toodyloo.jpg
liveUrl: https://pdf-generator-web-app.vercel.app
repoUrl: https://github.com/aaronm-git/pdf-generator-web-app
completedOn: 2025-01-30T00:00:00.000Z
isActive: true
featured: false
sortOrder: 0
---

PDF Generator is an intelligent document creation platform that transforms natural language descriptions into professionally formatted PDFs. Built with modern full-stack technologies, it demonstrates seamless AI integration, robust authentication, and production-grade database architecture.

- - -

## Overview

This application showcases how to build a practical AI-powered SaaS product with real-world features including user authentication, document management, database persistence, and flexible AI model selection. Users can describe what they need and the AI generates complete, styled PDFs in seconds.

- **AI-Powered Generation**: Natural language to professional PDFs in seconds
- **Multi-Model Support**: Choose between Claude (Anthropic) and GPT (OpenAI)
- **User Authentication**: Secure accounts with Better Auth
- **Document Management**: History, preview, and download capabilities
- **Custom API Keys**: Users can bring their own API credentials
- **Production Architecture**: PostgreSQL database with type-safe queries
- **Responsive Design**: Works seamlessly on desktop and mobile

- - -

### 🛠️ Technical Breakdown

**Tech Stack:**
I built the PDF Generator using **Next.js 16**, **React 19**, **TypeScript**, **Tailwind CSS**, **Radix UI**, **React PDF**, **AI SDK**, **Better Auth**, **PostgreSQL**, **Zod**, **Zustand**, **SWR**, and **Monaco Editor**.

- Built the full-stack app with **Next.js 16** for server-side rendering and API routes
- Implemented **TypeScript** for end-to-end type safety
- Used **React 19** for modern component architecture
- Styled with **Tailwind CSS 4** for responsive, polished UI
- Built accessible UI components with **Radix UI**
- Integrated **React PDF** for PDF rendering and generation in the browser
- Connected **AI SDK** to support both **Anthropic Claude** and **OpenAI GPT** models
- Implemented **Better Auth** for secure user authentication and session management
- Stored user data and documents in **PostgreSQL** with type-safe database layer
- Used **Zod** for runtime validation of user inputs and API responses
- Managed client state with **Zustand** for simplicity and performance
- Fetched data efficiently with **SWR** for caching and revalidation
- Added **Monaco Editor** for advanced text editing capabilities
- Deployed on **Vercel** for automatic scaling and global CDN

## Key Features

- **Natural Language Input**: Describe PDFs in plain English—no design skills needed
- **AI-Powered Styling**: Claude or GPT automatically formats documents professionally
- **Dual Model Support**: Switch between Anthropic Claude and OpenAI GPT
- **Document History**: View all previously generated PDFs
- **One-Click Download**: Export generated PDFs instantly
- **User Accounts**: Secure authentication with email/password
- **Personal API Keys**: Users can add their own AI API credentials in settings
- **Dark Mode**: System-aware theme switching for comfortable usage
- **Real-Time Preview**: See document generation progress
- **Mobile Responsive**: Works perfectly on phones, tablets, and desktops
- **Error Handling**: Clear feedback if generation fails
- **Generation Tracking**: Keep history of all PDF generations

## Technical Highlights

### AI Integration Pattern
- **Multi-Model Support**: Abstracted AI calls to support multiple providers
- **Server-Side Processing**: API routes handle all AI requests securely
- **Cost Efficiency**: Users can provide their own API keys to control costs
- **Error Recovery**: Graceful handling of API failures with user feedback

### Authentication & Data Security
- **Better Auth Integration**: Production-ready authentication without complexity
- **Session Management**: Secure, encrypted user sessions
- **Encrypted API Keys**: User API keys are encrypted at rest in the database
- **Type-Safe Queries**: Zod validation prevents injection attacks

### PDF Generation Architecture
- **Client-Side Rendering**: React PDF generates PDFs directly in the browser
- **Stream Processing**: Handle large documents efficiently
- **Format Preservation**: Maintain styling through the generation pipeline
- **Memory Optimization**: Efficient handling of document generation

### Database Schema
- **Users Table**: Managed by Better Auth with email and hashed passwords
- **Documents Table**: Stores generated PDFs with metadata
- **History Table**: Tracks generation attempts and AI model usage
- **API Keys Table**: Encrypted user-provided API credentials

## Obstacles and Solutions

### Obstacle: Multi-Model AI Integration

Integrating both Anthropic Claude and OpenAI GPT models while maintaining clean abstractions and error handling was complex.

### Solution:

I used the **AI SDK** which provides a unified interface for multiple AI providers:
- Abstracted model selection behind a simple API
- Implemented fallback behavior if one service is unavailable
- Added model-specific configuration for optimal results
- Handled different response formats from different providers

- - -

### Obstacle: Secure User API Key Storage

Users wanted the ability to bring their own API keys, but storing secrets securely required careful implementation.

### Solution:

I implemented:
- **Encryption at rest**: API keys encrypted with `node:crypto` before database storage
- **Never-log-keys**: API keys never appear in logs or error messages
- **Secure transmission**: HTTPS-only communication with careful header handling
- **User education**: Clear warnings about API key security
- **Audit trail**: Track when API keys are added/rotated

- - -

### Obstacle: Database Compatibility

The project needed to work with PostgreSQL using Neon, requiring careful connection handling and query patterns.

### Solution:

I implemented:
- **Connection pooling**: Proper Neon serverless connection management
- **Type-safe queries**: Avoided SQL injection with parameterized queries
- **Error handling**: Graceful degradation when database is unavailable
- **Migration support**: Database schema versioning and updates

- - -

## Deployment & Performance

- Deployed on **Vercel** for automatic scaling and zero-config edge runtime
- Edge Functions for secure API key handling
- Automatic image optimization
- Built-in CORS and security headers
- Global CDN for low-latency PDF delivery

## Future Enhancements

- PDF template library for common document types
- Batch generation for multiple documents
- Team collaboration and document sharing
- More AI model providers (Gemini, etc.)
- Document editing after generation
- Custom branding and watermarks
- Export to other formats (DOCX, PPTX)

### Author

Aaron Molina - Senior Frontend Developer

[Contact Me](https://aaronmolina.me/contact)

- - -

## Credits

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Vercel](https://vercel.com/)
- [Anthropic Claude](https://www.anthropic.com/)
- [OpenAI](https://openai.com/)
- [AI SDK](https://sdk.vercel.ai/)
- [Better Auth](https://www.better-auth.com/)
- [React PDF](https://react-pdf.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Zod](https://zod.dev/)
- [Zustand](https://github.com/pmndrs/zustand)
