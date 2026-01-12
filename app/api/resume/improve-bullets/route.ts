// app/api/resume/improve-bullets/route.ts
// Smart improve multiple bullets based on analysis

import { NextRequest } from 'next/server'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'
import { smartOptimizeBullet } from '@/lib/engines/resumeContentEngine'
import { analyzeBullet } from '@/lib/utils/bulletAnalyzer'

interface BulletToImprove {
  text: string
  company?: string
  position?: string
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    const body = await req.json()
    const { bullets, industry }: { bullets: BulletToImprove[]; industry?: string } = body

    if (!bullets || !Array.isArray(bullets) || bullets.length === 0) {
      return badRequestResponse('At least one bullet is required')
    }

    if (bullets.length > 10) {
      return badRequestResponse('Maximum 10 bullets can be improved at once')
    }

    // Analyze and improve each bullet
    const improvements = await Promise.all(
      bullets.map(async (bullet) => {
        const analysis = analyzeBullet(bullet.text)

        // Determine weaknesses from analysis
        const weaknesses = {
          needsActionVerb: !analysis.startsWithActionVerb,
          needsMetrics: !analysis.hasMetrics,
          weakWords: analysis.weakWords,
        }

        const improved = await smartOptimizeBullet(
          bullet.text,
          weaknesses,
          {
            company: bullet.company,
            position: bullet.position,
            industry,
          }
        )

        return {
          original: bullet.text,
          improved: improved || bullet.text,
          analysis: {
            originalScore: analysis.score,
            weaknesses: {
              needsActionVerb: weaknesses.needsActionVerb,
              needsMetrics: weaknesses.needsMetrics,
              weakWordsFound: weaknesses.weakWords.length,
            },
          },
        }
      })
    )

    return successResponse({
      improvements,
      count: improvements.length,
    })
  } catch (error: any) {
    console.error('[Improve Bullets Error]:', error)
    return serverErrorResponse(error.message || 'Failed to improve bullets')
  }
}
