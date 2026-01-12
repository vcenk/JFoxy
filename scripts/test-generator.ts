// scripts/test-generator.ts
// Test script for generating 10 resume examples

// CRITICAL: Load environment variables FIRST before any other imports
// This ensures OpenAI client gets the API key when it's instantiated
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

// Verify OpenAI API key is configured BEFORE importing modules that use it
if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') {
  console.error('\n❌ ERROR: OPENAI_API_KEY is not configured in .env.local')
  console.error('Please add OPENAI_API_KEY=your-api-key-here to your .env.local file\n')
  process.exit(1)
}

console.log('✅ OpenAI API key is configured\n')

// NOW import modules that depend on environment variables
import { generateResumeExample, type ResumeGenerationRequest } from '../lib/engines/resumeExampleGenerator'
import type { ExperienceLevel } from '../lib/data/jobTitleTaxonomy'

// Test with 10 diverse job titles
const testRequests: ResumeGenerationRequest[] = [
  {
    jobTitle: 'Software Engineer',
    industry: 'technology',
    experienceLevel: 'mid',
  },
  {
    jobTitle: 'Financial Analyst',
    industry: 'finance',
    experienceLevel: 'entry',
  },
  {
    jobTitle: 'Digital Marketing Manager',
    industry: 'marketing',
    experienceLevel: 'senior',
  },
  {
    jobTitle: 'Registered Nurse',
    industry: 'healthcare',
    experienceLevel: 'mid',
  },
  {
    jobTitle: 'Sales Representative',
    industry: 'sales',
    experienceLevel: 'entry',
  },
  {
    jobTitle: 'Operations Manager',
    industry: 'operations',
    experienceLevel: 'senior',
  },
  {
    jobTitle: 'HR Manager',
    industry: 'human_resources',
    experienceLevel: 'mid',
  },
  {
    jobTitle: 'Customer Service Representative',
    industry: 'customer_service',
    experienceLevel: 'entry',
  },
  {
    jobTitle: 'Teacher',
    industry: 'education',
    experienceLevel: 'mid',
  },
  {
    jobTitle: 'Mechanical Engineer',
    industry: 'engineering',
    experienceLevel: 'senior',
  },
]

async function runTest() {
  console.log('🧪 Starting Resume Generation Test...')
  console.log(`📊 Testing with ${testRequests.length} diverse job titles\n`)

  const results = []
  let totalCost = 0
  let totalTime = 0

  for (let i = 0; i < testRequests.length; i++) {
    const request = testRequests[i]
    console.log(`\n[${i + 1}/${testRequests.length}] Generating: ${request.jobTitle} (${request.experienceLevel})`)

    try {
      const startTime = Date.now()
      const result = await generateResumeExample(request)
      const generationTime = Date.now() - startTime

      totalCost += result.generationCost
      totalTime += generationTime

      results.push({
        jobTitle: result.jobTitle,
        industry: result.industry,
        experienceLevel: result.experienceLevel,
        atsScore: result.atsScore,
        qualityScore: result.qualityScore,
        cost: result.generationCost,
        time: generationTime,
        slug: result.slug,
      })

      console.log(`✅ Generated successfully!`)
      console.log(`   ATS Score: ${result.atsScore}/100`)
      console.log(`   Quality Score: ${result.qualityScore}/100`)
      console.log(`   Cost: $${result.generationCost.toFixed(3)}`)
      console.log(`   Time: ${generationTime}ms`)
      console.log(`   Slug: ${result.slug}`)

      // Wait 1 second between requests to avoid rate limiting
      if (i < testRequests.length - 1) {
        console.log('   ⏳ Waiting 1 second...')
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    } catch (error: any) {
      console.error(`❌ Failed: ${error.message}`)
      results.push({
        jobTitle: request.jobTitle,
        industry: request.industry,
        experienceLevel: request.experienceLevel,
        error: error.message,
      })
    }
  }

  // Print summary
  console.log('\n\n' + '='.repeat(80))
  console.log('📈 TEST SUMMARY')
  console.log('='.repeat(80))
  console.log(`\nTotal Examples Generated: ${results.filter((r) => !('error' in r)).length}/${testRequests.length}`)
  console.log(`Failed: ${results.filter((r) => 'error' in r).length}`)

  if (results.length > 0) {
    const successfulResults = results.filter((r) => !('error' in r)) as Array<{
      atsScore: number
      qualityScore: number
      cost: number
      time: number
    }>

    if (successfulResults.length > 0) {
      const avgATS = successfulResults.reduce((sum, r) => sum + r.atsScore, 0) / successfulResults.length
      const avgQuality =
        successfulResults.reduce((sum, r) => sum + r.qualityScore, 0) / successfulResults.length
      const avgTime = totalTime / successfulResults.length

      console.log(`\nAverage ATS Score: ${avgATS.toFixed(1)}/100`)
      console.log(`Average Quality Score: ${avgQuality.toFixed(1)}/100`)
      console.log(`Total Cost: $${totalCost.toFixed(2)}`)
      console.log(`Average Cost per Example: $${(totalCost / successfulResults.length).toFixed(3)}`)
      console.log(`Total Time: ${(totalTime / 1000).toFixed(1)}s`)
      console.log(`Average Time per Example: ${(avgTime / 1000).toFixed(1)}s`)

      // Quality distribution
      const highQuality = successfulResults.filter((r) => r.qualityScore >= 85).length
      const mediumQuality = successfulResults.filter((r) => r.qualityScore >= 70 && r.qualityScore < 85).length
      const lowQuality = successfulResults.filter((r) => r.qualityScore < 70).length

      console.log(`\nQuality Distribution:`)
      console.log(`  High (85+): ${highQuality} (${((highQuality / successfulResults.length) * 100).toFixed(1)}%)`)
      console.log(
        `  Medium (70-84): ${mediumQuality} (${((mediumQuality / successfulResults.length) * 100).toFixed(1)}%)`
      )
      console.log(`  Low (<70): ${lowQuality} (${((lowQuality / successfulResults.length) * 100).toFixed(1)}%)`)

      // Auto-publish count
      const autoPublish = successfulResults.filter((r) => r.qualityScore >= 85).length
      console.log(`\nAuto-Publish: ${autoPublish} examples (${((autoPublish / successfulResults.length) * 100).toFixed(1)}%)`)

      // Success criteria check
      console.log(`\n✅ Success Criteria Check:`)
      console.log(`  Average Quality >= 80: ${avgQuality >= 80 ? '✅ PASS' : '❌ FAIL'} (${avgQuality.toFixed(1)})`)
      console.log(`  Average ATS >= 80: ${avgATS >= 80 ? '✅ PASS' : '❌ FAIL'} (${avgATS.toFixed(1)})`)
      console.log(
        `  Cost per example < $0.50: ${totalCost / successfulResults.length < 0.5 ? '✅ PASS' : '❌ FAIL'} ($${(totalCost / successfulResults.length).toFixed(3)})`
      )
      console.log(`  Generation time < 30s: ${avgTime < 30000 ? '✅ PASS' : '❌ FAIL'} (${(avgTime / 1000).toFixed(1)}s)`)
    }
  }

  // Print failures
  if (results.some((r) => 'error' in r)) {
    console.log(`\n❌ FAILURES:`)
    results
      .filter((r) => 'error' in r)
      .forEach((r: any) => {
        console.log(`  - ${r.jobTitle} (${r.industry}, ${r.experienceLevel}): ${r.error}`)
      })
  }

  console.log('\n' + '='.repeat(80))
  console.log('🎯 Test complete!')
  console.log('='.repeat(80))
}

// Run the test
runTest().catch((error) => {
  console.error('💥 Test script failed:', error)
  process.exit(1)
})
