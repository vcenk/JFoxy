# Database Documentation

This directory contains all database schemas and types for the Joblander application.

## Structure

```
/database
  /schemas          - SQL schema definitions
  /types            - TypeScript type definitions
  /migrations       - Database migrations (future)
  /seeds            - Seed data (future)
```

## Database Tables

### Core User Tables
1. **profiles** - User profiles with subscription info
2. **resumes** - Resume documents with AI analysis
3. **job_descriptions** - Job postings for matching

### Practice & Mock Interview
4. **practice_sessions** - Interview practice sessions
5. **practice_questions** - Question bank for practice
6. **practice_answers** - User answers with AI scoring
7. **mock_interviews** - Full mock interview sessions
8. **mock_interview_exchanges** - Q&A exchanges in mock interviews

### Coaching Features
9. **star_stories** - STAR method stories
10. **swot_analyses** - SWOT analysis data
11. **gap_defenses** - Gap defense scripts
12. **intro_pitches** - Intro pitch scripts

### Other Features
13. **cover_letters** - AI-generated cover letters
14. **market_data** - Cached market insights
15. **usage_tracking** - API usage tracking for billing

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key to `.env.local`

### 2. Run Schema Files
In Supabase SQL Editor, run these files in order:

```sql
-- 1. Run each schema file in order (01-10)
-- Copy/paste the contents of each .sql file

-- Files to run:
01_profiles.sql
02_resumes.sql
03_job_descriptions.sql
04_practice_sessions.sql
05_mock_interviews.sql
06_coaching_star_stories.sql
07_coaching_swot_and_gaps.sql
08_cover_letters.sql
09_market_data.sql
10_usage_tracking.sql
```

### 3. Generate TypeScript Types (Optional)
To auto-generate types from your Supabase database:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > database/types/supabase.types.ts
```

## Key Features

### Row Level Security (RLS)
All tables have RLS policies ensuring:
- Users can only access their own data
- Admin/service role can insert usage tracking
- Market data is publicly readable

### Auto Timestamps
All tables have:
- `created_at` - Auto-set on insert
- `updated_at` - Auto-updated on every update

### Relationships
- Foreign keys ensure referential integrity
- ON DELETE CASCADE for user-owned data
- ON DELETE SET NULL for optional references

### Indexes
Optimized indexes for:
- User lookups
- Date-based queries
- Status filtering
- Relationship joins

## Usage in Code

```typescript
// Import types
import type { Profile, Resume, PracticeSession } from '@/database/types/database.types'

// Use with Supabase client
import { supabase } from '@/lib/clients/supabaseClient'

const { data: profile } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single()

// profile is typed as Profile
```

## Monthly Reset
Usage counters in profiles table are reset monthly via cron:

```sql
-- Run this as a scheduled function in Supabase
SELECT reset_monthly_usage();
```

Set this up in Supabase Dashboard → Database → Cron Jobs
