// app/api/resume/parse/route.ts
// Parse uploaded resume file (PDF, DOCX, TXT) into structured format

import { NextRequest } from 'next/server'
import { parseResume } from '@/lib/engines/resumeParsingEngine'
import { supabaseAdmin } from '@/lib/clients/supabaseClient'
import {
  getAuthUser,
  unauthorizedResponse,
  badRequestResponse,
  serverErrorResponse,
  successResponse,
} from '@/lib/utils/apiHelpers'
import mammoth from 'mammoth'
import { extractText } from 'unpdf'

/**
 * Extract text from PDF using unpdf (ESM-native, Next.js compatible)
 */
async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    console.log('[PDF Parse] Using unpdf to extract text from buffer size:', buffer.length)

    // Convert Buffer to Uint8Array for unpdf
    const uint8Array = new Uint8Array(buffer)

    // Extract text using unpdf
    const { text } = await extractText(uint8Array, { mergePages: true })

    console.log('[PDF Parse] Extraction successful, text length:', text?.length || 0)

    if (!text || text.trim().length === 0) {
      throw new Error('PDF parser returned no text')
    }

    return text
  } catch (error: any) {
    console.error('[PDF Parse] Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    })
    throw error
  }
}

/**
 * Extract text from uploaded file based on type
 */
async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase()

  try {
    // Handle PDF files
    if (fileName.endsWith('.pdf')) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      console.log('[File Extraction] Processing PDF, buffer size:', buffer.length)
      const text = await extractPdfText(buffer)

      return text
    }

    // Handle DOCX files
    if (fileName.endsWith('.docx')) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const result = await mammoth.extractRawText({ buffer })
      return result.value
    }

    // Handle TXT files
    if (fileName.endsWith('.txt')) {
      return await file.text()
    }

    throw new Error('Unsupported file type. Only PDF, DOCX, and TXT files are supported.')
  } catch (error: any) {
    console.error('[File Extraction Error]:', error)
    throw new Error(`Failed to extract text from file: ${error.message}`)
  }
}

export async function POST(req: NextRequest) {
  // Authenticate user
  const user = await getAuthUser(req)
  if (!user) {
    return unauthorizedResponse()
  }

  try {
    // Parse FormData
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return badRequestResponse('No file uploaded')
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return badRequestResponse('File size exceeds 10MB limit')
    }

    // Validate file type
    const fileName = file.name.toLowerCase()
    const validExtensions = ['.pdf', '.docx', '.txt']
    const isValidType = validExtensions.some(ext => fileName.endsWith(ext))

    if (!isValidType) {
      return badRequestResponse('Invalid file type. Only PDF, DOCX, and TXT files are supported.')
    }

    // Extract text from file
    console.log('[Resume Parse] Extracting text from:', file.name)
    const resumeText = await extractTextFromFile(file)

    if (!resumeText || resumeText.trim().length < 100) {
      return badRequestResponse('Resume text is too short or empty. Please upload a complete resume.')
    }

    console.log('[Resume Parse] Extracted text length:', resumeText.length)

    // Parse resume using AI engine
    const parsed = await parseResume(resumeText)

    if (!parsed) {
      return serverErrorResponse('Failed to parse resume. Please try again or create a resume manually.')
    }

    // Generate title from filename (remove extension)
    const title = file.name.replace(/\.[^/.]+$/, '') || 'Untitled Resume'

    // Save to database
    const { data: resume, error } = await supabaseAdmin
      .from('resumes')
      .insert({
        user_id: user.id,
        title,
        content: parsed,
        raw_text: resumeText,
        is_base_version: true, // Imported resumes are base versions by default
      })
      .select()
      .single()

    if (error) {
      console.error('[Resume Save Error]:', error)
      return serverErrorResponse('Failed to save resume')
    }

    console.log('[Resume Parse] Successfully created resume:', resume.id)

    return successResponse({
      resume,
      parsed,
    })
  } catch (error: any) {
    console.error('[Resume Parse API Error]:', error)
    return serverErrorResponse(error.message || 'Failed to process resume')
  }
}