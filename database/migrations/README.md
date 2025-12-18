# Database Migration Guide

## Migration: Base vs Tailored Resume Architecture

### 📋 What This Migration Does

This migration adds support for **Base (Master) Resumes** and **Tailored Resumes** to your Joblander application.

**New Columns Added:**
- `is_base_version` - Flag to mark master resumes
- `source_resume_id` - Reference to the parent base resume (for tailored versions)
- `job_description_id` - Link to the JD this resume is tailored for
- `jd_match_score` - Job description match score (0-100) for display in UI

**Security Fixes:**
- ✅ Replaced insecure `resume_relationships` VIEW with secure `get_resume_relationships()` function
- ✅ Added `count_tailored_resumes()` helper function
- ✅ Updated RLS policies

---

## 🔧 Issues Fixed

### Issue #1: Migration Safety
**Problem:** If columns already exist in your database, the migration could fail.
**Solution:** Used `IF NOT EXISTS` checks to make the migration **idempotent** (safe to run multiple times).

### Issue #2: Unrestricted VIEW Security
**Problem:** The original `resume_relationships` VIEW showed as "unrestricted" in Supabase because VIEWs don't automatically inherit RLS policies.
**Solution:** Replaced the VIEW with a **SECURITY DEFINER function** that:
- Checks authentication (`auth.uid() IS NULL` → exception)
- Filters results by `user_id = auth.uid()`
- Only returns data for the authenticated user

---

## 🚀 How to Run the Migration

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/[your-project]/sql
   ```

2. **Copy the entire migration file:**
   ```
   database/migrations/add_base_tailored_resume_columns.sql
   ```

3. **Paste into the SQL Editor and click "Run"**

4. **Verify Success:**
   Uncomment and run the verification queries at the bottom of the migration file:
   ```sql
   -- Verify columns were added
   SELECT
     column_name,
     data_type,
     is_nullable,
     column_default
   FROM information_schema.columns
   WHERE table_schema = 'public'
     AND table_name = 'resumes'
     AND column_name IN ('is_base_version', 'source_resume_id', 'job_description_id', 'jd_match_score')
   ORDER BY ordinal_position;
   ```

   **Expected Output:** 4 rows showing the new columns

5. **Test the Security Function:**
   ```sql
   SELECT * FROM get_resume_relationships();
   ```

   **Expected Output:** Your base resumes and their tailored versions (or empty if no data yet)

### Option 2: Supabase CLI

```bash
# Make sure you're in the project root
cd /path/to/Joblander

# Run the migration
supabase db push

# Or run the specific file
supabase db execute -f database/migrations/add_base_tailored_resume_columns.sql
```

---

## ✅ Post-Migration Checklist

- [ ] Columns `is_base_version`, `source_resume_id`, `job_description_id`, `jd_match_score` exist
- [ ] Indexes created (check with verification query)
- [ ] Function `get_resume_relationships()` exists and is executable
- [ ] Function `count_tailored_resumes(UUID)` exists and is executable
- [ ] Old VIEW `resume_relationships` removed (should not appear in Supabase dashboard)
- [ ] RLS policies updated
- [ ] Test creating a base resume in the app
- [ ] Test creating a tailored resume from a base resume

---

## 🔐 Security Details

### Before Migration (Insecure):
```sql
-- ❌ VIEW with no RLS - shows as "unrestricted"
CREATE VIEW resume_relationships AS
SELECT ...
FROM resumes ...;
GRANT SELECT ON resume_relationships TO authenticated;
```

**Problem:** Anyone authenticated could theoretically query this VIEW without user filtering.

### After Migration (Secure):
```sql
-- ✅ SECURITY DEFINER function with explicit user filtering
CREATE FUNCTION get_resume_relationships()
RETURNS TABLE (...)
SECURITY DEFINER
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  RETURN QUERY
  SELECT ... WHERE user_id = auth.uid();
END;
$$;
```

**How it works:**
1. Function checks if user is authenticated
2. Only returns rows where `user_id = auth.uid()`
3. No "unrestricted" warning in Supabase
4. Respects RLS at the function level

---

## 📊 Database Architecture

### Base Resume Workflow
```
┌─────────────────────┐
│   Base Resume       │
│  is_base_version: t │
│  source_resume: NULL│
└─────────────────────┘
         │
         ├── Tailored Resume 1 (for Job A)
         ├── Tailored Resume 2 (for Job B)
         └── Tailored Resume 3 (for Job C)
```

### Tailored Resume Workflow
```
User creates tailored version:
1. Select base resume
2. Select/paste job description
3. System creates new resume:
   ├─ is_base_version: false
   ├─ source_resume_id: [base_id]
   └─ job_description_id: [jd_id]
```

---

## 📝 Usage Examples

### Query Base Resumes and Their Tailored Versions
```sql
SELECT * FROM get_resume_relationships();
```

### Count Tailored Versions of a Base Resume
```sql
SELECT count_tailored_resumes('your-base-resume-uuid-here');
```

### Find All Base Resumes
```sql
SELECT id, title, created_at
FROM resumes
WHERE is_base_version = true
ORDER BY created_at DESC;
```

### Find All Tailored Resumes for a Specific Base
```sql
SELECT
  r.id,
  r.title,
  jd.title AS job_title,
  jd.company,
  r.jd_match_score
FROM resumes r
LEFT JOIN job_descriptions jd ON r.job_description_id = jd.id
WHERE r.source_resume_id = 'your-base-resume-uuid'
ORDER BY r.created_at DESC;
```

---

## 🐛 Troubleshooting

### "Column already exists" Error
**Cause:** You already ran part of the migration.
**Solution:** The migration is idempotent. Just run it again - it will skip existing columns.

### "Function already exists" Error
**Cause:** Previous migration attempt.
**Solution:** The migration uses `CREATE OR REPLACE FUNCTION`, so it's safe to re-run.

### "VIEW resume_relationships still shows unrestricted"
**Cause:** Old VIEW wasn't dropped.
**Solution:** Run this manually:
```sql
DROP VIEW IF EXISTS public.resume_relationships CASCADE;
```

### Can't see the functions in Supabase
**Cause:** Supabase sometimes caches schema.
**Solution:** Refresh the browser page or check the Functions tab manually.

---

## 🔄 Rollback (If Needed)

If you need to undo this migration:

```sql
-- Drop new columns
ALTER TABLE public.resumes DROP COLUMN IF EXISTS is_base_version;
ALTER TABLE public.resumes DROP COLUMN IF EXISTS source_resume_id;
ALTER TABLE public.resumes DROP COLUMN IF EXISTS job_description_id;
ALTER TABLE public.resumes DROP COLUMN IF EXISTS jd_match_score;

-- Drop functions
DROP FUNCTION IF EXISTS public.get_resume_relationships();
DROP FUNCTION IF EXISTS public.count_tailored_resumes(UUID);

-- Drop indexes
DROP INDEX IF EXISTS idx_resumes_is_base_version;
DROP INDEX IF EXISTS idx_resumes_source_resume_id;
DROP INDEX IF EXISTS idx_resumes_job_description_id;
DROP INDEX IF EXISTS idx_resumes_user_base;
DROP INDEX IF EXISTS idx_resumes_jd_match_score;
```

---

## 📚 Related Files

- **Schema:** `database/schemas/02_resumes.sql` (updated for new installs)
- **Migration:** `database/migrations/add_base_tailored_resume_columns.sql`
- **UI:** `app/dashboard/resume/page.tsx` (Resume Library)
- **UI:** `app/dashboard/resume/[id]/page.tsx` (Resume Editor)
- **API:** `app/api/resume/create/route.ts`
- **API:** `app/api/resume/list/route.ts`

---

## 💡 Questions?

If you encounter any issues:
1. Check Supabase logs for errors
2. Verify your PostgreSQL version supports the features used
3. Ensure RLS is enabled on the `resumes` table
4. Check that `auth.users` table exists (Supabase should create this)

---

**Migration Created:** 2025-12-12
**Compatible With:** PostgreSQL 13+, Supabase
