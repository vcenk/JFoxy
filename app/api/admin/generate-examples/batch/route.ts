// app/api/admin/generate-examples/batch/route.ts
// Batch generation endpoint for creating multiple resume examples

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  batchGenerateExamples,
  type ResumeGenerationRequest,
} from '@/lib/engines/resumeExampleGenerator'
import { getJobTitle, getAllIndustries } from '@/lib/data/jobTitleTaxonomy'
import type { ExperienceLevel, Industry } from '@/lib/data/jobTitleTaxonomy'

// ============================================
// ADMIN AUTHENTICATION HELPER
// ============================================

async function verifyAdmin(request: NextRequest) {
  // Get the JWT token from the Authorization header
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return { isAdmin: false, error: 'Unauthorized: No token provided' }
  }

  // Verify the token and get the user
  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token)

  if (authError || !user) {
    return { isAdmin: false, error: 'Unauthorized: Invalid token' }
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('email, is_admin')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { isAdmin: false, error: 'Profile not found' }
  }

  const isAdmin =
    profile.is_admin === true ||
    (profile.email && profile.email.endsWith('@jobfoxy.com'))

  if (!isAdmin) {
    return { isAdmin: false, error: 'Forbidden: Admin access required' }
  }

  return { isAdmin: true, userId: user.id }
}

// ============================================
// POST /api/admin/generate-examples/batch
// Generate multiple resume examples in batch
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await verifyAdmin(request)
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error }, { status: 403 })
    }

    const body = await request.json()
    const { requests, batchSize = 10 } = body

    // Validate requests array
    if (!requests || !Array.isArray(requests) || requests.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid requests array' },
        { status: 400 }
      )
    }

    // Limit batch size to prevent overwhelming the system
    if (requests.length > 100) {
      return NextResponse.json(
        { error: 'Batch size limit exceeded. Maximum 100 requests per batch.' },
        { status: 400 }
      )
    }

    console.log(`🚀 Starting batch generation: ${requests.length} examples`)

    // Validate and transform each request
    const validLevels: ExperienceLevel[] = ['entry', 'mid', 'senior', 'executive']
    const generationRequests: ResumeGenerationRequest[] = []

    for (const req of requests) {
      const { jobTitleSlug, experienceLevel, templateId } = req

      if (!jobTitleSlug || !experienceLevel) {
        return NextResponse.json(
          { error: `Invalid request: missing jobTitleSlug or experienceLevel in ${JSON.stringify(req)}` },
          { status: 400 }
        )
      }

      if (!validLevels.includes(experienceLevel)) {
        return NextResponse.json(
          { error: `Invalid experienceLevel "${experienceLevel}" in request` },
          { status: 400 }
        )
      }

      const jobTitleData = getJobTitle(jobTitleSlug)
      if (!jobTitleData) {
        return NextResponse.json(
          { error: `Job title slug "${jobTitleSlug}" not found` },
          { status: 404 }
        )
      }

      if (!jobTitleData.suitableLevels.includes(experienceLevel)) {
        return NextResponse.json(
          { error: `Experience level "${experienceLevel}" not suitable for "${jobTitleData.canonicalTitle}"` },
          { status: 400 }
        )
      }

      generationRequests.push({
        jobTitle: jobTitleData.canonicalTitle,
        industry: jobTitleData.industry,
        experienceLevel,
        templateId,
      })
    }

    // Generate all examples in batch
    const startTime = Date.now()
    const results = await batchGenerateExamples(generationRequests)
    const totalTime = Date.now() - startTime

    console.log(
      `✅ Batch generation completed: ${results.length} examples in ${totalTime}ms (${(totalTime / results.length).toFixed(0)}ms avg)`
    )

    // Save all results to database
    const examplestoInsert = results.map((result) => ({
      slug: result.slug,
      job_title: result.jobTitle,
      industry: result.industry,
      experience_level: result.experienceLevel,
      content: result.content,
      ats_score: result.atsScore,
      quality_score: result.qualityScore,
      meta_title: result.metaTitle,
      meta_description: result.metaDescription,
      h1_heading: result.h1Heading,
      h2_headings: result.h2Headings,
      target_keywords: result.targetKeywords,
      canonical_url: result.canonicalUrl,
      is_published: result.qualityScore >= 85,
      generation_cost: result.generationCost,
      generation_time_ms: Math.round(totalTime / results.length),
      created_by: authResult.userId,
    }))

    const { data: savedExamples, error: saveError } = await supabaseAdmin
      .from('resume_examples')
      .insert(examplestoInsert)
      .select()

    if (saveError) {
      console.error('❌ Error saving batch examples:', saveError)
      return NextResponse.json(
        { error: 'Failed to save examples', details: saveError.message },
        { status: 500 }
      )
    }

    // Calculate batch statistics
    const totalCost = results.reduce((sum, r) => sum + r.generationCost, 0)
    const avgQuality = results.reduce((sum, r) => sum + r.qualityScore, 0) / results.length
    const avgATS = results.reduce((sum, r) => sum + r.atsScore, 0) / results.length
    const autoPublished = results.filter((r) => r.qualityScore >= 85).length

    return NextResponse.json({
      success: true,
      batchResults: {
        totalGenerated: results.length,
        totalSaved: savedExamples?.length || 0,
        autoPublished,
        pendingReview: results.length - autoPublished,
      },
      statistics: {
        totalCost: totalCost.toFixed(2),
        avgCostPerExample: (totalCost / results.length).toFixed(2),
        avgQualityScore: Math.round(avgQuality),
        avgATSScore: Math.round(avgATS),
        totalTime,
        avgTimePerExample: Math.round(totalTime / results.length),
      },
      examples: savedExamples,
    })
  } catch (error: any) {
    console.error('❌ Error in batch generation:', error)
    return NextResponse.json(
      { error: 'Batch generation failed', details: error.message },
      { status: 500 }
    )
  }
}

// ============================================
// GET /api/admin/generate-examples/batch
// Get batch generation templates and suggestions
// ============================================

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await verifyAdmin(request)
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const industry = searchParams.get('industry') as Industry | null
    const experienceLevel = searchParams.get('experienceLevel') as ExperienceLevel | null

    // Return batch generation templates
    const templates = {
      diverseMix: {
        name: 'Diverse Mix',
        description: 'Generate examples across all industries and experience levels',
        count: 40,
        distribution: 'Mix of entry (25%), mid (35%), senior (30%), executive (10%)',
      },
      industryFocus: {
        name: 'Industry Focus',
        description: 'Generate examples for a specific industry',
        count: 20,
        distribution: 'All experience levels within chosen industry',
      },
      experienceLevelFocus: {
        name: 'Experience Level Focus',
        description: 'Generate examples for a specific experience level',
        count: 30,
        distribution: 'All industries at chosen experience level',
      },
      highDemand: {
        name: 'High Demand Jobs',
        description: 'Generate examples for most searched job titles',
        count: 50,
        distribution: 'Top 50 most common job searches',
      },
    }

    const availableIndustries = getAllIndustries()
    const validLevels: ExperienceLevel[] = ['entry', 'mid', 'senior', 'executive']

    return NextResponse.json({
      templates,
      filters: {
        industries: availableIndustries,
        experienceLevels: validLevels,
      },
      instructions: {
        endpoint: '/api/admin/generate-examples/batch',
        method: 'POST',
        bodyFormat: {
          requests: [
            {
              jobTitleSlug: 'software-engineer',
              experienceLevel: 'mid',
              templateId: 'optional-template-id',
            },
          ],
          batchSize: 10,
        },
      },
    })
  } catch (error: any) {
    console.error('❌ Error in batch GET:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
