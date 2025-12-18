// app/api/resume/render-theme/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { ParsedResume } from '@/lib/types/resume';
import { mapJobFoxyToJSONResume } from '@/lib/utils/resumeMapper';
import { Resume as JsonResumeSchema } from '@/lib/utils/jsonResumeSchema';

// Define a type for the theme module's default export (render function)
type JsonResumeThemeModule = {
  render: (resume: JsonResumeSchema) => string;
};

// Static map of available themes to their import functions
// This is necessary for Next.js/Webpack to correctly bundle these dependencies
const THEME_IMPORTS: Record<string, () => Promise<any>> = {
  'even': () => import('jsonresume-theme-even'),
  'flat': () => import('jsonresume-theme-flat'),
  'elegant': () => import('jsonresume-theme-elegant'),
  'modern': () => import('jsonresume-theme-modern'),
  'stackoverflow': () => import('jsonresume-theme-stackoverflow'),
  'class': () => import('jsonresume-theme-class'),
  'eloquent': () => import('jsonresume-theme-eloquent'),
  'kendall': () => import('jsonresume-theme-kendall'),
  'spartacus': () => import('jsonresume-theme-spartacus'),
};

export async function POST(req: NextRequest) {
  try {
    const { resumeData, themeName }: { resumeData: ParsedResume; themeName: string } = await req.json();

    if (!resumeData || !themeName) {
      return NextResponse.json({ error: 'Missing resumeData or themeName' }, { status: 400 });
    }

    // Map JobFoxy ParsedResume to JSON Resume Schema
    const jsonResume = mapJobFoxyToJSONResume(resumeData);

    const themeImportFn = THEME_IMPORTS[themeName.toLowerCase()];

    if (!themeImportFn) {
      console.error(`Theme "${themeName}" is not in the allowed list.`);
      return NextResponse.json({ error: `Theme "${themeName}" not found.` }, { status: 404 });
    }

    let themeModule: JsonResumeThemeModule;
    try {
      themeModule = await themeImportFn();
    } catch (importError) {
      console.error(`Failed to load theme: jsonresume-theme-${themeName}`, importError);
      return NextResponse.json({ error: `Failed to load theme module for "${themeName}".` }, { status: 500 });
    }

    // Render the resume using the theme
    // Some themes export 'render' directly, others might export it as 'default' or similar
    // We try to find the render function
    const renderFn = themeModule.render || (themeModule as any).default?.render;

    if (typeof renderFn !== 'function') {
         console.error(`Theme "${themeName}" does not export a valid render function.`);
         return NextResponse.json({ error: `Theme "${themeName}" is invalid (no render function).` }, { status: 500 });
    }

    try {
      const renderedHtml = renderFn(jsonResume);
      // Return the rendered HTML
      return new NextResponse(renderedHtml, {
        headers: {
          'Content-Type': 'text/html',
        },
        status: 200,
      });
    } catch (renderError: any) {
      console.error(`Error executing render function for theme "${themeName}":`, renderError);
      return NextResponse.json({ 
        error: `Error executing render function for theme "${themeName}": ${renderError?.message || String(renderError)}` 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error rendering resume with theme:', error);
    return NextResponse.json({ 
      error: `Internal Server Error: ${error?.message || String(error)}` 
    }, { status: 500 });
  }
}

