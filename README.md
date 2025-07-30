# Waqti Platform - Time-Based Service Exchange

## Overview
Waqti is a professional platform for exchanging services using time as currency. Users can offer their skills and earn time credits to get services they need without using money.

## Features

### 🚀 Core Features
- **Time Exchange System**: Trade services using time credits
- **User Authentication**: Secure login/signup with email verification
- **Role-based Access**: Freelancer and Client roles with appropriate permissions
- **Verification System**: Multi-step identity verification for freelancers
- **Project Management**: Post projects, receive offers, manage contracts
- **Messaging System**: Real-time chat between users
- **Escrow System**: Secure payment holding and release
- **Admin Panel**: Comprehensive admin dashboard for platform management

### 🔐 Security Features
- Row Level Security (RLS) with Supabase
- Secure file uploads and storage
- Protected routes and API endpoints
- Email verification and phone verification
- Encrypted sensitive data

### 🌐 Multi-language Support
- Full Arabic and English support
- RTL layout for Arabic
- Translation-ready architecture

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd waqti-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

5. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout/         # Layout components
│   ├── verification/   # Verification flow components
│   └── ...
├── pages/              # Application pages
├── types/              # TypeScript type definitions
├── context/            # React Context providers
├── lib/                # Utility libraries
└── data/               # Mock data
```

## Key Components

### Authentication Flow
1. **Registration**: Email/password with role selection
2. **Email Verification**: Code-based verification
3. **Role Selection**: Choose between Freelancer/Client
4. **Verification Process**: Multi-step verification for freelancers

### Freelancer Verification Steps
1. **Account Data**: Username, account type, terms acceptance
2. **Profile**: Job title, specialization, skills, introduction
3. **Business Gallery**: Portfolio items, certificates, testimonials
4. **Admission Test**: Quiz system for platform approval

### Admin Features
- User management and verification tracking
- Escrow management and dispute resolution
- Platform analytics and reporting
- Content management system

## Security

The platform implements comprehensive security measures:
- Supabase Row Level Security (RLS)
- Secure file upload and storage
- Email and phone verification
- Protected API endpoints
- Input validation and sanitization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions:
- Email: support@waqti.com
- Create an issue in the repository

---

**Waqti Platform** - Where Time Meets Value 🚀