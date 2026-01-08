# Authentication Skills Agent

Use this agent for all authentication and onboarding related tasks.

## Scope
- User registration and login flows
- Password reset and recovery
- Email verification
- Session management
- Landing page features and marketing content
- Public pages (legal, blog)

## Key Files

### Auth Pages
- `app/auth/login/page.tsx` - Login page
- `app/auth/register/page.tsx` - Registration page
- `app/auth/forgot-password/page.tsx` - Password recovery request
- `app/auth/reset-password/page.tsx` - Password reset with token

### Landing Page
- `app/page.tsx` - Main landing page
- `components/landing/Navbar.tsx` - Navigation bar
- `components/landing/Hero.tsx` - Hero section
- `components/landing/Features.tsx` - Feature highlights
- `components/landing/Benefits.tsx` - Benefits section
- `components/landing/HowItWorks.tsx` - How it works flow
- `components/landing/Pricing.tsx` - Pricing plans display
- `components/landing/Blog.tsx` - Blog preview section
- `components/landing/FinalCTA.tsx` - Final call-to-action
- `components/landing/Footer.tsx` - Footer with links
- `components/landing/Background.tsx` - Animated background
- `components/landing/BrandSignature.tsx` - Brand logo/signature
- `components/landing/InteractiveAvatar.tsx` - Interactive demo avatar
- `components/landing/ScrollVelocity.tsx` - Scroll-based animations

### Public Pages
- `app/(legal)/terms/page.tsx` - Terms of service
- `app/(legal)/privacy/page.tsx` - Privacy policy
- `app/(legal)/cookies/page.tsx` - Cookie policy
- `app/blog/[slug]/page.tsx` - Blog post pages

### Auth Infrastructure
- `middleware.ts` - Auth protection middleware (root level)
- `lib/clients/supabaseClient.ts` - Supabase client (browser)
- `lib/clients/supabaseServerClient.ts` - Supabase server client
- `lib/clients/supabaseBrowserClient.ts` - Supabase browser client
- `app/providers.tsx` - App-level providers

### Public Resume Pages
- `app/resume/examples/page.tsx` - Public resume examples gallery
- `app/resume/templates/page.tsx` - Public templates showcase
- `app/resume-synonyms/page.tsx` - Power words/synonyms tool
- `app/resume-synonyms/[word]/page.tsx` - Individual word synonyms

## API Endpoints

### Public APIs
- `GET /api/public/plans` - Get available subscription plans

### Auth (via Supabase)
- Supabase Auth handles: signUp, signIn, signOut, resetPassword, updateUser

## Middleware Protection

Protected routes defined in `middleware.ts`:
- `/dashboard/*`
- `/resume/*` (dashboard routes)
- `/coaching/*`
- `/practice/*`
- `/mock/*`
- `/market-insights/*`
- `/cover-letter/*`
- `/account/*`

Behavior:
- Unauthenticated users redirected to `/auth/login` with `redirectTo` param
- Authenticated users on `/auth/*` redirected to `/dashboard`

## Database Schema

### Tables
- `profiles` (`database/schemas/01_profiles.sql`)
  - User profile data
  - Subscription info
  - Usage counters
  - Preferences

## Common Tasks
- Update login/registration forms
- Modify password reset flow
- Update landing page content
- Add new landing page sections
- Update pricing display
- Modify features showcase
- Add new legal pages
- Update navigation

## Related Systems
- Supabase Auth for authentication
- Supabase for session management
- Stripe for pricing/subscription display

## Design Patterns
- Form validation with Zod and react-hook-form
- Error handling for auth failures
- Protected route middleware
- Session persistence via Supabase cookies
- Responsive design for auth pages
- Framer Motion for landing page animations
