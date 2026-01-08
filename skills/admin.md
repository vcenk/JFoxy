# Admin Dashboard Skills Agent

Use this agent for admin-only features and system management.

## Scope
- Platform analytics and monitoring
- Resume examples generation and management
- Subscription plans management
- Credit packs administration
- System administration

## Key Files

### Admin Pages
- `app/dashboard/admin/page.tsx` - Admin overview dashboard
- `app/dashboard/admin/examples/page.tsx` - Resume examples management
- `app/dashboard/admin/plans/page.tsx` - Subscription plans management

### Admin Components
- `components/admin/ResumePreviewModal.tsx` - Resume example preview

### AI Engines
- `lib/engines/resumeExampleGenerator.ts` - AI-powered resume example generation

### Data
- `lib/data/jobTitleTaxonomy.ts` - 200+ job titles for example generation

## API Endpoints

### Analytics
- `GET /api/admin/analytics` - Platform analytics

### Resume Examples
- `GET /api/admin/examples` - List all resume examples
- `GET /api/admin/examples/[id]` - Get/update/delete specific example
- `POST /api/admin/generate-examples` - Generate single example
- `POST /api/admin/generate-examples/batch` - Batch generation

### Plans & Billing
- `GET /api/admin/plans` - Get subscription plans
- `POST /api/admin/plans` - Create/update plans
- `GET /api/admin/credit-packs` - Get credit packs
- `POST /api/admin/credit-packs` - Create/update credit packs

## Database Schema

### Tables
- `profiles` (`database/schemas/01_profiles.sql`)
  - `is_admin` flag for admin access

- `resume_examples` (`database/schemas/11_resume_library.sql`)
  - Public resume examples library
  - Job title, industry, experience level
  - Generated content and scores

## Features

### Overview Dashboard
- **Platform Analytics**
  - Total users
  - Active users (DAU, WAU, MAU)
  - New registrations

- **Usage Statistics**
  - Mock interviews conducted
  - Practice sessions completed
  - Resumes created
  - Cover letters generated

### Resume Examples Management
- **Example Generation**
  - Generate by job title from taxonomy
  - AI-powered content creation using `resumeExampleGenerator.ts`
  - Batch generation for multiple titles

- **Example Library**
  - View all generated examples
  - Filter by: Job title, Industry, Experience level
  - Search functionality
  - Preview full resume content

- **Example Operations**
  - Publish/unpublish examples
  - Edit example content
  - Delete examples
  - Duplicate examples

### Subscription Plans Management
- **Plan Configuration**
  - Create new pricing tiers
  - Update existing plans
  - Set feature limits
  - Configure credit allocations
  - Set monthly/annual pricing

- **Plan Features**
  - Mock interview limits
  - Practice session limits
  - Resume creation limits
  - Cover letter limits

### Credit Packs Management
- Create one-time credit packs
- Set pricing and quantities
- Enable/disable packs

## Common Tasks
- Generate new resume examples
- Update subscription plans
- Monitor platform usage
- Create promotional offers
- Update pricing
- Manage resume example library

## Related Systems
- OpenAI GPT-4 for example generation
- Stripe for subscription management
- All application features (for analytics)

## Design Patterns
- Role-based access control (admin check)
- Admin-only route protection
- Batch processing for operations
- Analytics aggregation

## Security Considerations
- Admin-only access verification via `is_admin` profile flag
- Secure API endpoints with admin checks
- Rate limiting for bulk operations
