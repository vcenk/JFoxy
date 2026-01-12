// scripts/generate-library.ts
// Production script to generate 200 resume examples for the library

// Load environment variables FIRST
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

// Verify OpenAI API key
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
  console.error('\n❌ ERROR: OPENAI_API_KEY is not configured in .env.local')
  process.exit(1)
}

import { generateResumeExample, type ResumeGenerationRequest } from '../lib/engines/resumeExampleGenerator'
import { JOB_TITLE_TAXONOMY, type ExperienceLevel } from '../lib/data/jobTitleTaxonomy'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

interface GenerationResult {
  success: boolean
  jobTitle: string
  slug: string
  qualityScore?: number
  atsScore?: number
  cost?: number
  error?: string
}

// Randomly pick an experience level for variety
function getRandomExperienceLevel(suitableLevels: ExperienceLevel[]): ExperienceLevel {
  return suitableLevels[Math.floor(Math.random() * suitableLevels.length)]
}

async function generateLibrary() {
  // CONFIGURATION: Set how many examples to generate
  const BATCH_SIZE = 50 // Change this to 200 for full generation

  console.log('\n🚀 Starting Resume Library Generation')
  console.log('=' .repeat(80))
  console.log(`📊 Target: ${BATCH_SIZE} resume examples (test batch)`)
  console.log(`⏱️  Estimated time: ~${Math.round(BATCH_SIZE * 30 / 60)} minutes`)
  console.log(`💰 Estimated cost: $${(BATCH_SIZE * 0.05).toFixed(2)}`)
  console.log('=' .repeat(80) + '\n')

  const jobTitleSlugs = Object.keys(JOB_TITLE_TAXONOMY)
  const results: GenerationResult[] = []
  let totalCost = 0
  let successCount = 0
  let failCount = 0

  console.log(`✅ Found ${jobTitleSlugs.length} total job titles`)
  console.log(`📝 Generating first ${BATCH_SIZE} examples\n`)

  // Ask for confirmation
  console.log(`⚠️  This will generate ${BATCH_SIZE} resume examples and save them to the database.`)
  console.log('⚠️  Press Ctrl+C to cancel, or wait 5 seconds to continue...\n')
  await new Promise(resolve => setTimeout(resolve, 5000))

  const startTime = Date.now()

  for (let i = 0; i < Math.min(BATCH_SIZE, jobTitleSlugs.length); i++) {
    const slug = jobTitleSlugs[i]
    const jobData = JOB_TITLE_TAXONOMY[slug]

    console.log(`\n[${i + 1}/${BATCH_SIZE}] Generating: ${jobData.canonicalTitle}`)

    // Pick random experience level for variety
    const experienceLevel = getRandomExperienceLevel(jobData.suitableLevels)
    console.log(`   Industry: ${jobData.industry} | Level: ${experienceLevel}`)

    try {
      // Generate the resume example
      const result = await generateResumeExample({
        jobTitle: jobData.canonicalTitle,
        industry: jobData.industry,
        experienceLevel,
      })

      // Save to database
      const { data: savedExample, error: dbError } = await supabase
        .from('resume_examples')
        .insert({
          slug: result.slug,
          job_title: result.jobTitle,
          industry: result.industry,
          experience_level: result.experienceLevel,
          content: result.content,
          raw_text: result.rawText,
          ats_score: result.atsScore,
          keywords: result.keywords,
          power_words_count: result.powerWordsCount,
          quantified_achievements_count: result.quantifiedAchievementsCount,
          meta_title: result.metaTitle,
          meta_description: result.metaDescription,
          h1_heading: result.h1Heading,
          h2_headings: result.h2Headings,
          target_keywords: result.targetKeywords,
          quality_score: result.qualityScore,
          is_published: result.qualityScore >= 85, // Auto-publish high quality
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (dbError) {
        console.error(`   ❌ Database error: ${dbError.message}`)
        failCount++
        results.push({
          success: false,
          jobTitle: jobData.canonicalTitle,
          slug: result.slug,
          error: `Database error: ${dbError.message}`,
        })
      } else {
        successCount++
        totalCost += result.generationCost
        console.log(`   ✅ Success! Quality: ${result.qualityScore}/100 | ATS: ${result.atsScore}/100 | Cost: $${result.generationCost.toFixed(3)}`)
        console.log(`   📝 Saved to database | Published: ${result.qualityScore >= 85 ? 'Yes' : 'No'}`)

        results.push({
          success: true,
          jobTitle: jobData.canonicalTitle,
          slug: result.slug,
          qualityScore: result.qualityScore,
          atsScore: result.atsScore,
          cost: result.generationCost,
        })
      }

      // Rate limiting: Wait 1 second between requests
      if (i < BATCH_SIZE - 1) {
        console.log(`   ⏳ Waiting 1 second...`)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    } catch (error: any) {
      console.error(`   ❌ Generation failed: ${error.message}`)
      failCount++
      results.push({
        success: false,
        jobTitle: jobData.canonicalTitle,
        slug: slug,
        error: error.message,
      })
    }

    // Progress update every 10 examples (since we're doing 50 total)
    if ((i + 1) % 10 === 0) {
      const elapsed = (Date.now() - startTime) / 1000
      const avgTime = elapsed / (i + 1)
      const remaining = (BATCH_SIZE - i - 1) * avgTime
      console.log(`\n📊 Progress: ${i + 1}/${BATCH_SIZE} (${((i + 1) / BATCH_SIZE * 100).toFixed(1)}%)`)
      console.log(`⏱️  Elapsed: ${(elapsed / 60).toFixed(1)}m | Estimated remaining: ${(remaining / 60).toFixed(1)}m`)
      console.log(`💰 Cost so far: $${totalCost.toFixed(2)}`)
      console.log(`✅ Success: ${successCount} | ❌ Failed: ${failCount}\n`)
    }
  }

  const totalTime = (Date.now() - startTime) / 1000

  // Print final summary
  console.log('\n\n' + '='.repeat(80))
  console.log('📈 GENERATION COMPLETE!')
  console.log('='.repeat(80))
  console.log(`\n✅ Successfully Generated: ${successCount}/${BATCH_SIZE}`)
  console.log(`❌ Failed: ${failCount}/${BATCH_SIZE}`)

  if (successCount > 0) {
    const successfulResults = results.filter(r => r.success) as Array<{
      qualityScore: number
      atsScore: number
      cost: number
    }>

    const avgQuality = successfulResults.reduce((sum, r) => sum + r.qualityScore, 0) / successCount
    const avgATS = successfulResults.reduce((sum, r) => sum + r.atsScore, 0) / successCount
    const autoPublished = successfulResults.filter(r => r.qualityScore >= 85).length

    console.log(`\n📊 Quality Metrics:`)
    console.log(`   Average Quality Score: ${avgQuality.toFixed(1)}/100`)
    console.log(`   Average ATS Score: ${avgATS.toFixed(1)}/100`)
    console.log(`   Auto-Published: ${autoPublished} (${(autoPublished / successCount * 100).toFixed(1)}%)`)

    console.log(`\n💰 Cost Analysis:`)
    console.log(`   Total Cost: $${totalCost.toFixed(2)}`)
    console.log(`   Average Cost per Example: $${(totalCost / successCount).toFixed(3)}`)

    console.log(`\n⏱️  Time Analysis:`)
    console.log(`   Total Time: ${(totalTime / 60).toFixed(1)} minutes`)
    console.log(`   Average Time per Example: ${(totalTime / successCount).toFixed(1)} seconds`)
  }

  // Print failures if any
  if (failCount > 0) {
    console.log(`\n❌ FAILURES (${failCount}):`)
    results
      .filter(r => !r.success)
      .forEach(r => {
        console.log(`   - ${r.jobTitle} (${r.slug}): ${r.error}`)
      })
  }

  console.log('\n' + '='.repeat(80))
  console.log('🎉 Library generation complete!')
  console.log('=' .repeat(80) + '\n')
}

// Run the generation
generateLibrary().catch(error => {
  console.error('💥 Generation script failed:', error)
  process.exit(1)
})
