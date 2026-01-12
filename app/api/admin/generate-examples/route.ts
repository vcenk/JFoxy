// app/api/admin/generate-examples/route.ts
// API endpoints for generating resume examples (admin only)

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  generateResumeExample,
  batchGenerateExamples,
  type ResumeGenerationRequest,
} from '@/lib/engines/resumeExampleGenerator'
import { getAllJobTitleSlugs, getJobTitle } from '@/lib/data/jobTitleTaxonomy'
import type { ExperienceLevel } from '@/lib/data/jobTitleTaxonomy'

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

  // Check if user has admin role
  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('email, is_admin')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { isAdmin: false, error: 'Profile not found' }
  }

  // Check if user is admin (you can customize this logic)
  const isAdmin =
    profile.is_admin === true ||
    (profile.email && profile.email.endsWith('@jobfoxy.com')) // Example: Only @jobfoxy.com emails are admins

  if (!isAdmin) {
    return { isAdmin: false, error: 'Forbidden: Admin access required' }
  }

  return { isAdmin: true, userId: user.id }
}

// ============================================
// POST /api/admin/generate-examples
// Generate a single resume example
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await verifyAdmin(request)
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error }, { status: 403 })
    }

    const body = await request.json()

    const { jobTitleSlug, experienceLevel, templateId } = body

    // Validate required fields
    if (!jobTitleSlug || !experienceLevel) {
      return NextResponse.json(
        { error: 'Missing required fields: jobTitleSlug, experienceLevel' },
        { status: 400 }
      )
    }

    // Validate experience level
    const validLevels: ExperienceLevel[] = ['entry', 'mid', 'senior', 'executive']
    if (!validLevels.includes(experienceLevel)) {
      return NextResponse.json(
        { error: `Invalid experienceLevel. Must be one of: ${validLevels.join(', ')}` },
        { status: 400 }
      )
    }

    // Get job title data from taxonomy
    const jobTitleData = getJobTitle(jobTitleSlug)
    if (!jobTitleData) {
      return NextResponse.json(
        { error: `Job title slug "${jobTitleSlug}" not found in taxonomy` },
        { status: 404 }
      )
    }

    // Check if this experience level is suitable for this job title
    if (!jobTitleData.suitableLevels.includes(experienceLevel)) {
      return NextResponse.json(
        {
          error: `Experience level "${experienceLevel}" is not suitable for "${jobTitleData.canonicalTitle}". Suitable levels: ${jobTitleData.suitableLevels.join(', ')}`,
        },
        { status: 400 }
      )
    }

    // Build generation request
    const generationRequest: ResumeGenerationRequest = {
      jobTitle: jobTitleData.canonicalTitle,
      industry: jobTitleData.industry,
      experienceLevel,
      templateId,
    }

    console.log('🎯 Generating resume example:', generationRequest)

    // Generate the resume example
    const startTime = Date.now()
    const result = await generateResumeExample(generationRequest)
    const generationTime = Date.now() - startTime

    console.log(
      `✅ Resume generated successfully in ${generationTime}ms | ATS Score: ${result.atsScore} | Quality: ${result.qualityScore}`
    )

    // Save to database (resume_examples table)
    const { data: savedExample, error: saveError } = await supabaseAdmin
      .from('resume_examples')
      .insert({
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
        is_published: result.qualityScore >= 85, // Auto-publish high quality examples
        generation_cost: result.generationCost,
        generation_time_ms: generationTime,
        created_by: authResult.userId,
      })
      .select()
      .single()

    if (saveError) {
      console.error('❌ Error saving resume example:', saveError)
      return NextResponse.json(
        { error: 'Failed to save resume example', details: saveError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      example: savedExample,
      metadata: {
        generationTime,
        cost: result.generationCost,
        atsScore: result.atsScore,
        qualityScore: result.qualityScore,
        autoPublished: result.qualityScore >= 85,
      },
    })
  } catch (error: any) {
    console.error('❌ Error in generate-examples POST:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// ============================================
// GET /api/admin/generate-examples
// Get generation statistics and available job titles
// ============================================

export async function GET(request: NextRequest) {
  try {
    // Verify admin access
    const authResult = await verifyAdmin(request)
    if (!authResult.isAdmin) {
      return NextResponse.json({ error: authResult.error }, { status: 403 })
    }

    // Get generation statistics
    const { data: stats, error: statsError } = await supabaseAdmin
      .from('resume_examples')
      .select('quality_score, ats_score, generation_cost, is_published')

    if (statsError) {
      console.error('Error fetching stats:', statsError)
      return NextResponse.json({ error: 'Failed to fetch statistics' }, { status: 500 })
    }

    // Calculate statistics
    const totalExamples = stats?.length || 0
    const publishedCount = stats?.filter((s) => s.is_published).length || 0
    const avgQuality =
      stats && stats.length > 0
        ? stats.reduce((sum, s) => sum + (s.quality_score || 0), 0) / stats.length
        : 0
    const avgATS =
      stats && stats.length > 0
        ? stats.reduce((sum, s) => sum + (s.ats_score || 0), 0) / stats.length
        : 0
    const totalCost =
      stats?.reduce((sum, s) => sum + (s.generation_cost || 0), 0) || 0

    // Get available job titles
    const availableJobTitles = getAllJobTitleSlugs()

    return NextResponse.json({
      statistics: {
        totalExamples,
        publishedCount,
        pendingReview: totalExamples - publishedCount,
        avgQualityScore: Math.round(avgQuality),
        avgATSScore: Math.round(avgATS),
        totalCost: totalCost.toFixed(2),
        costPerExample: totalExamples > 0 ? (totalCost / totalExamples).toFixed(2) : '0.00',
      },
      availableJobTitles: {
        total: availableJobTitles.length,
        slugs: availableJobTitles,
      },
    })
  } catch (error: any) {
    console.error('❌ Error in generate-examples GET:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
