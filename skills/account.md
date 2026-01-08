# Account & Settings Skills Agent

Use this agent for user account management and settings features.

## Scope
- Profile management
- Subscription management
- Billing and payments
- User preferences
- Integrations (LinkedIn)
- Market insights dashboard

## Key Files

### Account Pages
- `app/dashboard/account/page.tsx` - Account settings page
- `app/dashboard/market-insights/page.tsx` - Market insights dashboard

### Account Components
- `components/account/IntegrationsTab.tsx` - Third-party integrations management

### Billing Infrastructure
- `lib/clients/stripeClient.ts` - Stripe integration

### Database
- `database/schemas/01_profiles.sql` - User profiles with subscription data

## API Endpoints

### Billing
- `POST /api/billing/create-checkout-session` - Stripe checkout for subscription
- `POST /api/billing/create-checkout` - Alternative checkout endpoint
- `POST /api/billing/create-portal-session` - Stripe billing portal
- `POST /api/billing/webhook` - Stripe webhook handler

## Database Schema

### Tables
- `profiles` (`database/schemas/01_profiles.sql`)
  - User profile data (name, email)
  - Subscription tier and status
  - Usage counters (monthly limits)
  - Preferences (voice, avatar, notifications)
  - Stripe customer ID

- `usage_tracking` (`database/schemas/10_usage_tracking.sql`)
  - API usage tracking
  - Feature usage counts
  - Credit consumption

- `market_data` (`database/schemas/09_market_data.sql`)
  - Cached market insights data

## Features

### Profile Management
- Edit full name
- View email (from Supabase Auth)
- View account creation date
- Timezone settings

### Subscription Management
- View current plan (Free, Pro, Enterprise)
- Plan details and feature limits
- Upgrade/downgrade options
- View next billing date
- Cancel subscription

### Billing (Stripe Integration)
- Payment method management
- Billing history
- Invoice viewing
- Stripe customer portal integration

### Preferences

#### Voice Settings
- ElevenLabs voice selection for mock interviews
- Gender preference (Male, Female)
- Voice preview

#### Notifications
- Email notifications toggle
- Practice reminders
- Achievement notifications

### Integrations
- **LinkedIn**
  - Import profile data to resume
  - Handled via `components/resume/LinkedInImportModal.tsx`

### Market Insights
- Salary data by role/location
- Skills radar
- Job trends

## Common Tasks
- Add new subscription plans
- Update billing flow
- Add new preferences
- Update notification logic
- Improve settings UI
- Add data export feature
- Implement account deletion flow

## Related Systems
- Stripe for payments and subscriptions
- ElevenLabs for voice settings
- Supabase Auth for account management
- LinkedIn for profile import

## Design Patterns
- Settings state management
- Stripe webhook handling
- Preference cascading (user > plan > default)
- Subscription lifecycle management

## Security Considerations
- Payment data handled by Stripe (PCI compliant)
- Secure password updates via Supabase Auth
- Row Level Security for user data
