# Dashboard Skills Agent

Use this agent for main dashboard and home page features.

## Scope
- Main dashboard layout and navigation
- Readiness score calculation
- Activity feed
- Statistics display
- Quick access cards
- User greeting and personalization
- Dashboard API for metrics

## Key Files

### Dashboard Pages
- `app/dashboard/page.tsx` - Main dashboard page
- `app/dashboard/layout.tsx` - Dashboard layout wrapper with navigation

### API
- `app/api/dashboard/stats/route.ts` - Dashboard statistics API

## Features

### Dashboard Layout
- Sidebar navigation to all features
- User profile/account access
- Responsive design

### Readiness Score
- Overall interview preparation score
- Aggregates data from:
  - Resume completeness
  - Practice session performance
  - Mock interview scores
  - Coaching completeness

### Recent Activity
- Track recent sessions and usage
- Last updated timestamps
- Quick access to continue work

### Statistics Dashboard
- Usage metrics and counts
- Sessions completed
- Resumes created
- Interviews conducted

### Quick Access Cards
- Links to all features:
  - Resume Builder
  - Practice Sessions
  - Mock Interviews
  - Coaching Tools
  - Cover Letters
  - Market Insights

### Time-based Greeting
- Personalized greetings based on time of day
- User name display

## Common Tasks
- Update dashboard layout
- Add new metric cards
- Modify readiness score calculation
- Update activity feed logic
- Add new quick access features
- Implement dashboard filters
- Update statistics API
- Improve dashboard performance

## Related Systems
- All feature modules (resume, practice, mock, coaching)
- Usage tracking database
- User preferences

## Database Dependencies
- `profiles` - User data and subscription
- `resumes` - Resume count and scores
- `practice_sessions` - Practice stats
- `mock_interview_sessions` - Mock interview stats

## Design Patterns
- Server-side data fetching
- Card-based UI design
- Responsive grid layout
- Real-time statistics (where applicable)
