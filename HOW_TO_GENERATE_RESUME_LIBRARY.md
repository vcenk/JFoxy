# How to Generate 200 Resume Examples

This guide explains how to generate the resume example library for your JobFoxy application.

## Prerequisites

### 1. Database Schema
First, apply the resume library database schema:

```sql
-- Run this in your Supabase SQL editor
-- File: database/schemas/11_resume_library.sql
```

Go to your Supabase Dashboard → SQL Editor → Paste the contents of `database/schemas/11_resume_library.sql` → Run

### 2. Environment Variables
Ensure your `.env.local` file has:

```env
# Required
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_SUPABASE_URL=https://...
SUPABASE_SERVICE_ROLE_KEY=...

# Optional (defaults provided)
OPENAI_MODEL_MAIN=gpt-4o-mini
OPENAI_MODEL_HEAVY=gpt-4o
```

## Generation Process

### Option 1: Generate All 200 Examples (Recommended)

This will generate one example for each of the 200 job titles in the taxonomy.

```bash
# Run the production generation script
npx tsx scripts/generate-library.ts
```

**What to Expect:**
- ⏱️ **Time**: ~1.5-2 hours (with 1-second delay between requests)
- 💰 **Cost**: ~$10-15 total (approximately $0.05 per example)
- 📊 **Output**: 200 resume examples saved to database
- ✅ **Auto-Publish**: High-quality examples (score >= 85) automatically published

**Progress Updates:**
- You'll see real-time progress for each example
- Every 20 examples, you'll get a summary with time/cost estimates
- Final summary shows success rate, quality metrics, and total cost

### Option 2: Generate a Smaller Batch (Testing)

If you want to test with fewer examples first:

```bash
# Modify the script to limit the number
# Open scripts/generate-library.ts and change line ~58:
for (let i = 0; i < 50; i++) {  // Change from jobTitleSlugs.length to 50
```

Then run:
```bash
npx tsx scripts/generate-library.ts
```

### Option 3: Use the Admin Dashboard (Manual)

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/dashboard/admin/examples`

3. Use the generation form to create examples one at a time

## What Happens During Generation

For each job title, the script:

1. ✅ **Selects** a random experience level (entry/mid/senior/executive)
2. 🤖 **Generates** a complete resume using GPT-4o with:
   - Professional summary
   - Work experience (2-4 positions)
   - Education
   - Skills (technical & soft)
   - Quantified achievements
   - Power words
3. 📊 **Analyzes** the resume for:
   - ATS compatibility score
   - Quality score (power words, quantification, keywords)
   - Keyword density
4. 🔍 **Creates** SEO metadata:
   - Meta title & description
   - H1 and H2 headings
   - Target keywords
   - SEO-friendly slug
5. 💾 **Saves** to database with:
   - Auto-publish if quality >= 85
   - Full resume content (JSON)
   - Plain text version
   - All metadata and scores

## Monitoring Generation

### Real-Time Output

```
[1/200] Generating: Software Engineer
   Industry: technology | Level: mid
   ✅ Success! Quality: 96/100 | ATS: 90/100 | Cost: $0.048
   📝 Saved to database | Published: Yes
   ⏳ Waiting 1 second...
```

### Progress Checkpoints (Every 20 Examples)

```
📊 Progress: 20/200 (10.0%)
⏱️  Elapsed: 7.2m | Estimated remaining: 64.8m
💰 Cost so far: $1.02
✅ Success: 19 | ❌ Failed: 1
```

### Final Summary

```
================================================================================
📈 GENERATION COMPLETE!
================================================================================

✅ Successfully Generated: 198/200
❌ Failed: 2/200

📊 Quality Metrics:
   Average Quality Score: 91.5/100
   Average ATS Score: 92.1/100
   Auto-Published: 132 (66.7%)

💰 Cost Analysis:
   Total Cost: $10.23
   Average Cost per Example: $0.052

⏱️  Time Analysis:
   Total Time: 89.3 minutes
   Average Time per Example: 27.1 seconds
```

## After Generation

### 1. Review in Admin Dashboard

Visit `http://localhost:3000/dashboard/admin/examples` to:
- View all generated examples
- Filter by industry, level, quality
- Toggle publish status
- Delete low-quality examples

### 2. Check Quality Distribution

Look for:
- ✅ Most examples with quality >= 85 (auto-published)
- ✅ Average ATS score >= 80
- ✅ Good distribution across industries

### 3. Manually Review Unpublished Examples

Examples with quality score < 85 are saved as drafts. You can:
- Review and manually publish if good quality
- Delete if quality is too low
- Regenerate if needed

## Troubleshooting

### OpenAI API Errors

**Rate Limit Error:**
```
Error: 429 Too many requests
```
**Solution**: The script has 1-second delays built-in. If you hit rate limits, increase the delay in the script (line ~132).

**Invalid API Key:**
```
Error: 401 Unauthorized
```
**Solution**: Check your `OPENAI_API_KEY` in `.env.local`

### Database Errors

**Table doesn't exist:**
```
Error: relation "resume_examples" does not exist
```
**Solution**: Apply the database schema first (see Prerequisites #1)

**RLS Policy Error:**
```
Error: new row violates row-level security policy
```
**Solution**: Make sure you're using `SUPABASE_SERVICE_ROLE_KEY` (not the anon key)

### Script Crashes Midway

If the script crashes after generating some examples:

1. Check how many were saved:
   ```sql
   SELECT COUNT(*) FROM resume_examples;
   ```

2. Modify the script to skip already generated ones:
   ```typescript
   // Add this before the loop:
   const { data: existing } = await supabase
     .from('resume_examples')
     .select('slug')

   const existingSlugs = new Set(existing?.map(e => e.slug) || [])
   const toGenerate = jobTitleSlugs.filter(slug => !existingSlugs.has(slug))
   ```

3. Restart the script

## Cost Optimization

### Reduce Costs

If you want to reduce costs:

1. **Use GPT-4o-mini instead** (75% cheaper):
   ```typescript
   // In lib/engines/resumeExampleGenerator.ts, line 270:
   model: 'gpt-4o-mini', // Instead of 'gpt-4o'
   ```

2. **Reduce max_tokens**:
   ```typescript
   max_tokens: 2000, // Instead of 2500
   ```

3. **Generate fewer examples**:
   ```bash
   # Only generate top 50 most-searched job titles
   ```

### Expected Costs

| Model | Cost per Example | 200 Examples Total |
|-------|-----------------|-------------------|
| GPT-4o | ~$0.05 | ~$10 |
| GPT-4o-mini | ~$0.01 | ~$2 |

## Next Steps After Generation

1. ✅ Review generated examples in admin dashboard
2. ✅ Create public pages to display examples (e.g., `/resume-examples/[slug]`)
3. ✅ Add search and filtering on public site
4. ✅ Set up sitemap for SEO
5. ✅ Monitor which examples get the most views
6. ✅ Regenerate low-performing examples

## Questions?

If you encounter issues:
1. Check the error message in console
2. Review the "Troubleshooting" section above
3. Check database logs in Supabase dashboard
4. Review OpenAI API usage dashboard for quota/billing issues
