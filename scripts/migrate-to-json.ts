// scripts/migrate-to-json.ts
// Migration script to convert plain text resume content to JSON format

import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import { plainTextToJSON } from '@/lib/utils/richTextHelpers'

async function migrateResumesToJSON() {
  console.log('🚀 Starting migration to JSON-based rich text format...')

  try {
    // Fetch all resumes
    const { data: resumes, error } = await supabaseAdmin
      .from('resumes')
      .select('*')

    if (error) {
      console.error('❌ Error fetching resumes:', error)
      return
    }

    if (!resumes || resumes.length === 0) {
      console.log('ℹ️  No resumes found to migrate')
      return
    }

    console.log(`📊 Found ${resumes.length} resumes to migrate`)

    let successCount = 0
    let skipCount = 0
    let errorCount = 0

    for (const resume of resumes) {
      try {
        const content = resume.content

        if (!content) {
          console.log(`⏭️  Skipping resume ${resume.id} - no content`)
          skipCount++
          continue
        }

        let needsUpdate = false
        const updatedContent = { ...content }

        // Migrate summary if it's a plain string
        if (content.summary && typeof content.summary === 'string') {
          console.log(`  📝 Migrating summary for resume ${resume.id}`)
          updatedContent.summary = plainTextToJSON(content.summary)
          needsUpdate = true
        }

        // Migrate experience bullets if they're plain strings
        if (content.experience && Array.isArray(content.experience)) {
          content.experience.forEach((exp: any, expIndex: number) => {
            if (exp.bullets && Array.isArray(exp.bullets)) {
              const hasPlainTextBullets = exp.bullets.some(
                (bullet: any) => typeof bullet === 'string'
              )

              if (hasPlainTextBullets) {
                console.log(`  🔧 Migrating bullets for experience ${expIndex} in resume ${resume.id}`)
                updatedContent.experience[expIndex].bullets = exp.bullets.map((bullet: any) =>
                  typeof bullet === 'string' ? plainTextToJSON(bullet) : bullet
                )
                needsUpdate = true
              }
            }
          })
        }

        // Update database if changes were made
        if (needsUpdate) {
          const { error: updateError } = await supabaseAdmin
            .from('resumes')
            .update({ content: updatedContent })
            .eq('id', resume.id)

          if (updateError) {
            console.error(`❌ Error migrating resume ${resume.id}:`, updateError)
            errorCount++
          } else {
            console.log(`✅ Successfully migrated resume ${resume.id}`)
            successCount++
          }
        } else {
          console.log(`⏭️  Skipping resume ${resume.id} - already in JSON format`)
          skipCount++
        }
      } catch (error) {
        console.error(`❌ Exception while migrating resume ${resume.id}:`, error)
        errorCount++
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('📈 Migration Summary:')
    console.log(`  ✅ Successfully migrated: ${successCount}`)
    console.log(`  ⏭️  Skipped (already migrated or no content): ${skipCount}`)
    console.log(`  ❌ Errors: ${errorCount}`)
    console.log('='.repeat(50))

    if (errorCount === 0) {
      console.log('\n🎉 Migration completed successfully!')
    } else {
      console.log('\n⚠️  Migration completed with some errors. Please review the logs above.')
    }
  } catch (error) {
    console.error('❌ Critical error during migration:', error)
  }
}

// Run the migration
migrateResumesToJSON()
  .then(() => {
    console.log('\n✨ Migration script finished')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 Migration script failed:', error)
    process.exit(1)
  })
