import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, BorderStyle, Table, TableRow, TableCell, WidthType, ShadingType } from "docx";
import { ParsedResume } from "@/lib/types/resume";
import { DesignerSettings } from "@/lib/types/designer";
import { ResumeDesign, DEFAULT_DESIGN, SectionKey } from "@/lib/pdf/types";
import { AnalysisData } from "@/components/resume/analysis/AnalysisDashboard";
import { jsonToPlainText } from "@/lib/utils/richTextHelpers";
import { formatDate } from "@/lib/pdf/utils/dateFormatter";
import { getColorPreset, FONT_SIZE_PRESETS, MARGIN_PRESETS as PDF_MARGIN_PRESETS, SPACING_PRESETS } from "@/lib/pdf/styles/presets";

// Helper to save Blob
const saveBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

const PX_TO_TWIPS = 15;
const PT_TO_HALF_PT = 2; // DOCX uses half-points for font sizes

// Convert hex color to DOCX format (remove # if present)
const hexToDocx = (hex: string): string => hex.replace('#', '');

const getDocxPageProperties = (design?: ResumeDesign) => {
  if (!design) {
    return {};
  }

  const margins = PDF_MARGIN_PRESETS[design.margins] ?? PDF_MARGIN_PRESETS.normal;
  const marginTwips = Math.max(0, Math.round(margins.top * PX_TO_TWIPS));
  const pageSize =
    design.paperSize === "a4"
      ? { width: 11906, height: 16838 }
      : { width: 12240, height: 15840 };

  return {
    page: {
      size: pageSize,
      margin: {
        top: marginTwips,
        right: Math.round(margins.right * PX_TO_TWIPS),
        bottom: Math.round(margins.bottom * PX_TO_TWIPS),
        left: Math.round(margins.left * PX_TO_TWIPS),
      },
    },
  };
};

// Default colors (fallback)
const PURPLE = "6A47FF";
const DARK_GREY = "333333";
const LIGHT_GREY = "666666";
const WHITE = "FFFFFF";

// --- Resume Export ---
export const exportResumeToDocx = async (
  data: ParsedResume,
  title: string = "Resume",
  design?: ResumeDesign
) => {
  const children: Paragraph[] = [];
  const RESUME_FONT = "Arial"; // Mapping fonts is complex, sticking to Arial for safety

  // Merge with defaults
  const effectiveDesign: ResumeDesign = {
    ...DEFAULT_DESIGN,
    ...design,
    sectionSettings: {
      ...DEFAULT_DESIGN.sectionSettings,
      ...design?.sectionSettings,
    },
  };

  // Get color preset and font sizes
  const colorPreset = getColorPreset(effectiveDesign.colorPresetId);
  const fontSizes = FONT_SIZE_PRESETS[effectiveDesign.fontSize] || FONT_SIZE_PRESETS.normal;
  const spacing = SPACING_PRESETS[effectiveDesign.sectionSpacing] || SPACING_PRESETS.normal;

  // Convert colors to DOCX format
  const accentColor = hexToDocx(effectiveDesign.customAccentColor || colorPreset.accent);
  const primaryColor = hexToDocx(colorPreset.primary);
  const textColor = hexToDocx(colorPreset.text);
  const mutedColor = hexToDocx(colorPreset.muted);

  // Font sizes in half-points (DOCX format)
  const nameFontSize = fontSizes.name * PT_TO_HALF_PT;
  const sectionFontSize = fontSizes.section * PT_TO_HALF_PT;
  const bodyFontSize = fontSizes.body * PT_TO_HALF_PT;
  const smallFontSize = fontSizes.small * PT_TO_HALF_PT;

  // Settings
  const dateFormat = effectiveDesign.dateFormat || "MM/YYYY";
  const headerAlignment = effectiveDesign.headerAlignment === 'left' ? AlignmentType.LEFT : AlignmentType.CENTER;

  // Helper to check if section is enabled
  const isSectionEnabled = (key: SectionKey): boolean => {
    return effectiveDesign.sectionSettings[key]?.enabled !== false;
  };

  // Header (Contact Info)
  if (data.contact) {
    const { name, email, phone, location, linkedin, portfolio } = data.contact;

    // Name
    if (name) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: effectiveDesign.headingStyle === 'caps' ? name.toUpperCase() : name,
              color: primaryColor,
              size: nameFontSize,
              bold: true,
              font: RESUME_FONT,
            })
          ],
          alignment: headerAlignment,
          spacing: { after: Math.round(spacing.item * PX_TO_TWIPS / 2) },
        })
      );
    }

    // Contact Details Line
    const details = [email, phone, location, linkedin, portfolio].filter(Boolean).join(" | ");
    if (details) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: details,
              color: mutedColor,
              size: smallFontSize,
              font: RESUME_FONT,
            })
          ],
          alignment: headerAlignment,
          spacing: { after: Math.round(spacing.section * PX_TO_TWIPS) },
        })
      );
    }
  }

  // Target Title
  if (data.targetTitle) {
      children.push(
          new Paragraph({
              children: [
                new TextRun({
                  text: effectiveDesign.headingStyle === 'caps' ? data.targetTitle.toUpperCase() : data.targetTitle,
                  color: accentColor,
                  bold: true,
                  size: sectionFontSize + 4,
                  font: RESUME_FONT,
                })
              ],
              alignment: headerAlignment,
              spacing: { before: Math.round(spacing.item * PX_TO_TWIPS), after: Math.round(spacing.section * PX_TO_TWIPS) },
          })
      );
  }

  // Helper for Section Headers
  const createSectionHeader = (title: string) => {
    const displayTitle = effectiveDesign.headingStyle === 'caps' ? title.toUpperCase() : title;
    return new Paragraph({
      children: [
        new TextRun({
          text: displayTitle,
          color: accentColor,
          bold: effectiveDesign.headingStyle === 'bold' || effectiveDesign.headingStyle === 'caps',
          size: sectionFontSize,
          font: RESUME_FONT,
        })
      ],
      spacing: { before: Math.round(spacing.section * PX_TO_TWIPS), after: Math.round(spacing.item * PX_TO_TWIPS) },
      border: effectiveDesign.headingStyle === 'underline' ? {
        bottom: {
          color: accentColor,
          space: 1,
          style: BorderStyle.SINGLE,
          size: 6,
        },
      } : undefined,
    });
  };

  // Summary
  if (data.summary && isSectionEnabled('summary')) {
    const customTitle = effectiveDesign.sectionSettings.summary?.customTitle;
    children.push(createSectionHeader(customTitle || "Professional Summary"));
    const summaryText = jsonToPlainText(data.summary);
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: summaryText,
            font: RESUME_FONT,
            size: bodyFontSize,
            color: textColor,
          })
        ],
        spacing: { after: Math.round(spacing.item * PX_TO_TWIPS) },
      })
    );
  }

  // Experience
  if (data.experience && data.experience.length > 0 && isSectionEnabled('experience')) {
    const customTitle = effectiveDesign.sectionSettings.experience?.customTitle;
    children.push(createSectionHeader(customTitle || "Experience"));
    data.experience.forEach((exp: any) => {
      // Skip disabled entries
      if (exp.enabled === false) return;

      const dateStr = `${formatDate(exp.startDate, dateFormat as any)} - ${exp.current ? "Present" : formatDate(exp.endDate, dateFormat as any)}`;

      // Company & Date Line
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.company,
              bold: true,
              size: bodyFontSize,
              font: RESUME_FONT,
              color: textColor,
            }),
            new TextRun({
              text: `\t${exp.location || ""}\t${dateStr}`,
              font: RESUME_FONT,
              size: bodyFontSize,
              color: mutedColor,
            }),
          ],
          tabStops: [
            { type: TabStopType.CENTER, position: 4500 },
            { type: TabStopType.RIGHT, position: 9000 },
          ],
          spacing: { before: Math.round(spacing.item * PX_TO_TWIPS) },
        })
      );

      // Position Line
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: exp.position,
              italics: true,
              font: RESUME_FONT,
              size: bodyFontSize,
              color: textColor,
            })
          ],
          spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
        })
      );

      // Bullets (handle both old RichText and new BulletItem formats)
      if (exp.bullets) {
        exp.bullets.forEach((bullet: any) => {
          // Skip disabled bullets in new format
          if (bullet.enabled === false) return;
          // Handle both formats: BulletItem has .content, old format is direct RichText
          const bulletContent = bullet.content || bullet;
          const bulletText = jsonToPlainText(bulletContent);
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: bulletText,
                  font: RESUME_FONT,
                  size: bodyFontSize,
                  color: textColor,
                })
              ],
              bullet: { level: 0 },
              spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS / 2) },
            })
          );
        });
      }
    });
  }

  // Education
  if (data.education && data.education.length > 0 && isSectionEnabled('education')) {
    const customTitle = effectiveDesign.sectionSettings.education?.customTitle;
    children.push(createSectionHeader(customTitle || "Education"));
    data.education.forEach((edu: any) => {
      // Skip disabled entries
      if (edu.enabled === false) return;

      const dateStr = formatDate(edu.graduationDate, dateFormat as any);

      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: edu.institution,
              bold: true,
              size: bodyFontSize,
              font: RESUME_FONT,
              color: textColor,
            }),
            new TextRun({
              text: `\t${dateStr}`,
              font: RESUME_FONT,
              size: bodyFontSize,
              color: mutedColor,
            }),
          ],
          tabStops: [
            { type: TabStopType.RIGHT, position: 9000 },
          ],
          spacing: { before: Math.round(spacing.item * PX_TO_TWIPS) },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
                text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ""}`,
                italics: true,
                font: RESUME_FONT,
                size: bodyFontSize,
                color: textColor,
            })
          ],
          spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
        })
      );
    });
  }

  // Skills
  if (data.skills && isSectionEnabled('skills')) {
    const hasSkills = data.skills.technical?.length || data.skills.soft?.length || data.skills.other?.length;
    if (hasSkills) {
      const customTitle = effectiveDesign.sectionSettings.skills?.customTitle;
      children.push(createSectionHeader(customTitle || "Skills"));

      if (data.skills.technical?.length) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Technical: ", bold: true, font: RESUME_FONT, size: bodyFontSize, color: accentColor }),
              new TextRun({ text: data.skills.technical.join(", "), font: RESUME_FONT, size: bodyFontSize, color: textColor }),
            ],
            spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
          })
        );
      }
      if (data.skills.soft?.length) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Soft Skills: ", bold: true, font: RESUME_FONT, size: bodyFontSize, color: accentColor }),
              new TextRun({ text: data.skills.soft.join(", "), font: RESUME_FONT, size: bodyFontSize, color: textColor }),
            ],
            spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
          })
        );
      }
      if (data.skills.other?.length) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Other: ", bold: true, font: RESUME_FONT, size: bodyFontSize, color: accentColor }),
              new TextRun({ text: data.skills.other.join(", "), font: RESUME_FONT, size: bodyFontSize, color: textColor }),
            ],
            spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
          })
        );
      }
    }
  }

  // Projects
  if (data.projects && data.projects.length > 0 && isSectionEnabled('projects')) {
    const customTitle = effectiveDesign.sectionSettings.projects?.customTitle;
    children.push(createSectionHeader(customTitle || "Projects"));
    data.projects.forEach((proj: any) => {
      if (proj.enabled === false) return;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: proj.name, bold: true, size: bodyFontSize, font: RESUME_FONT, color: textColor }),
            new TextRun({ text: `\t${proj.link || ""}`, italics: true, font: RESUME_FONT, size: smallFontSize, color: accentColor }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
          spacing: { before: Math.round(spacing.item * PX_TO_TWIPS) },
        })
      );
      if (proj.description) {
        children.push(new Paragraph({
          children: [new TextRun({ text: proj.description, font: RESUME_FONT, size: bodyFontSize, color: textColor })],
          spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
        }));
      }
      if (proj.technologies?.length) {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `Technologies: ${proj.technologies.join(", ")}`, italics: true, font: RESUME_FONT, size: smallFontSize, color: mutedColor })
          ],
          spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
        }));
      }
    });
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0 && isSectionEnabled('certifications')) {
    const customTitle = effectiveDesign.sectionSettings.certifications?.customTitle;
    children.push(createSectionHeader(customTitle || "Certifications"));
    data.certifications.forEach((cert: any) => {
      if (cert.enabled === false) return;
      const dateStr = formatDate(cert.date, dateFormat as any);
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, font: RESUME_FONT, size: bodyFontSize, color: textColor }),
            new TextRun({ text: cert.issuer ? ` - ${cert.issuer}` : "", font: RESUME_FONT, size: bodyFontSize, color: mutedColor }),
            new TextRun({ text: `\t${dateStr}`, font: RESUME_FONT, size: bodyFontSize, color: mutedColor }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
          spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
        })
      );
    });
  }

  // Awards
  if (data.awards && data.awards.length > 0 && isSectionEnabled('awards')) {
    const customTitle = effectiveDesign.sectionSettings.awards?.customTitle;
    children.push(createSectionHeader(customTitle || "Awards"));
    data.awards.forEach((award: any) => {
      if (award.enabled === false) return;
      const dateStr = formatDate(award.date, dateFormat as any);
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: award.title, bold: true, font: RESUME_FONT, size: bodyFontSize, color: textColor }),
            new TextRun({ text: award.issuer ? ` - ${award.issuer}` : "", font: RESUME_FONT, size: bodyFontSize, color: mutedColor }),
            new TextRun({ text: `\t${dateStr}`, font: RESUME_FONT, size: bodyFontSize, color: mutedColor }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
          spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
        })
      );
      if (award.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: award.description, font: RESUME_FONT, size: bodyFontSize, color: textColor })],
            spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
          })
        );
      }
    });
  }

  // Languages
  if (data.languages && data.languages.length > 0 && isSectionEnabled('languages')) {
    const customTitle = effectiveDesign.sectionSettings.languages?.customTitle;
    children.push(createSectionHeader(customTitle || "Languages"));
    const languageList = data.languages
      .filter((lang: any) => lang.enabled !== false)
      .map((lang: any) =>
        `${lang.language}${lang.fluency ? ` (${lang.fluency})` : ""}`
      ).join(", ");
    children.push(
      new Paragraph({
        children: [new TextRun({ text: languageList, font: RESUME_FONT, size: bodyFontSize, color: textColor })],
        spacing: { after: Math.round(spacing.item * PX_TO_TWIPS) },
      })
    );
  }

  // Volunteer
  if (data.volunteer && data.volunteer.length > 0 && isSectionEnabled('volunteer')) {
    const customTitle = effectiveDesign.sectionSettings.volunteer?.customTitle;
    children.push(createSectionHeader(customTitle || "Volunteer Experience"));
    data.volunteer.forEach((vol: any) => {
      if (vol.enabled === false) return;
      const dateStr = `${formatDate(vol.startDate, dateFormat as any)} - ${vol.current ? "Present" : formatDate(vol.endDate, dateFormat as any)}`;
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: vol.organization, bold: true, font: RESUME_FONT, size: bodyFontSize, color: textColor }),
            new TextRun({ text: `\t${dateStr}`, font: RESUME_FONT, size: bodyFontSize, color: mutedColor }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
          spacing: { before: Math.round(spacing.item * PX_TO_TWIPS) },
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: vol.role, font: RESUME_FONT, size: bodyFontSize, italics: true, color: textColor })],
          spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
        })
      );
      if (vol.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: vol.description, font: RESUME_FONT, size: bodyFontSize, color: textColor })],
            spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
          })
        );
      }
    });
  }

  // Publications
  if (data.publications && data.publications.length > 0 && isSectionEnabled('publications')) {
    const customTitle = effectiveDesign.sectionSettings.publications?.customTitle;
    children.push(createSectionHeader(customTitle || "Publications"));
    data.publications.forEach((pub: any) => {
      if (pub.enabled === false) return;
      const dateStr = formatDate(pub.date, dateFormat as any);
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: pub.title, bold: true, font: RESUME_FONT, size: bodyFontSize, color: textColor }),
            new TextRun({ text: `\t${dateStr}`, font: RESUME_FONT, size: bodyFontSize, color: mutedColor }),
          ],
          tabStops: [{ type: TabStopType.RIGHT, position: 9000 }],
          spacing: { before: Math.round(spacing.item * PX_TO_TWIPS) },
        })
      );
      if (pub.publisher) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: pub.publisher, font: RESUME_FONT, size: bodyFontSize, italics: true, color: textColor })],
          })
        );
      }
      if (pub.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: pub.description, font: RESUME_FONT, size: bodyFontSize, color: textColor })],
            spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
          })
        );
      }
      if (pub.link) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: pub.link, font: RESUME_FONT, size: smallFontSize, color: accentColor })],
            spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
          })
        );
      }
    });
  }

  const doc = new Document({
    sections: [{
      properties: getDocxPageProperties(effectiveDesign),
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveBlob(blob, `${title}.docx`);
};

// --- Cover Letter Export ---
export const exportCoverLetterToDocx = async (
  content: string,
  jobTitle: string,
  company: string,
  displayName?: string,
  contactLine?: string
) => {
  const CL_FONT = "Times New Roman";
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const children: Paragraph[] = [];

  // Contact Header - Centered (matches preview) - tighter spacing
  if (displayName) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: displayName,
            size: 32, // 16pt
            bold: true,
            color: PURPLE,
            font: CL_FONT,
          }),
        ],
      })
    );

    if (contactLine) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: contactLine,
              size: 18, // 9pt
              color: LIGHT_GREY,
              font: CL_FONT,
            }),
          ],
        })
      );
    }

    // Divider
    children.push(
      new Paragraph({
        border: {
          bottom: { color: "E0E0E0", space: 1, style: BorderStyle.SINGLE, size: 6 }
        },
        spacing: { after: 200 }
      })
    );
  }

  // Date
  children.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: dateStr,
          size: 20, // 10pt
          color: LIGHT_GREY,
          font: CL_FONT,
        }),
      ],
    })
  );

  // Job Info Block
  if (jobTitle) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: `Re: ${jobTitle}`,
            size: 20, // 10pt
            bold: true,
            color: DARK_GREY,
            font: CL_FONT,
          }),
        ],
      })
    );
  }

  if (company) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: company,
            size: 20, // 10pt
            color: LIGHT_GREY,
            font: CL_FONT,
          }),
        ],
      })
    );
  }

  // Body Content - tighter spacing
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      children.push(new Paragraph({ text: "", spacing: { after: 60 } }));
    } else {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: trimmed,
              font: CL_FONT,
              size: 20, // 10pt
              color: "282828"
            })
          ],
          spacing: { after: 120, line: 276 }, // 1.15 line spacing
          alignment: AlignmentType.LEFT
        })
      );
    }
  });

  // Signature Block (matches preview)
  if (displayName) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { before: 240, after: 120 },
        children: [
          new TextRun({
            text: "Sincerely,",
            size: 20, // 10pt
            italics: true,
            color: DARK_GREY,
            font: CL_FONT,
          }),
        ],
      })
    );

    children.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: displayName,
            size: 20, // 10pt
            bold: true,
            color: DARK_GREY,
            font: CL_FONT,
          }),
        ],
      })
    );
  }

  // Footer
  children.push(
    new Paragraph({
      text: "Generated by JobFoxy",
      alignment: AlignmentType.CENTER,
      spacing: { before: 240 },
      run: {
        size: 14, // 7pt
        color: "AAAAAA",
        font: "Arial"
      }
    })
  );

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = jobTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
  saveBlob(blob, `CoverLetter_${safeTitle}.docx`);
};

// --- Analysis Report Export ---
export const exportAnalysisReportToDocx = async (data: AnalysisData, jobTitle: string, company: string) => {
  const children: any[] = [];

  // 1. Report Header
  children.push(
      new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 100 },
          children: [
              new TextRun({ text: "JOB FIT ANALYSIS", bold: true, size: 36, color: PURPLE }),
          ]
      })
  );
  children.push(
      new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [
              new TextRun({ text: `${jobTitle}`, bold: true, size: 24, color: DARK_GREY }),
              new TextRun({ text: company ? ` at ${company}` : "", size: 24, color: LIGHT_GREY }),
              new TextRun({ text: `\nGenerated on ${new Date().toLocaleDateString()}`, break: 1, size: 18, color: "AAAAAA" })
          ]
      })
  );

  // 2. Score Cards (Table)
  const createScoreCell = (label: string, score: number) => {
      let color = "FF0000"; // Red
      if (score >= 70) color = "008000"; // Green
      else if (score >= 50) color = "FFA500"; // Orange

      return new TableCell({
          children: [
              new Paragraph({ 
                  text: `${score}%`, 
                  alignment: AlignmentType.CENTER,
                  heading: HeadingLevel.HEADING_1,
                  run: { color: color, bold: true, size: 60 }
              }),
              new Paragraph({ 
                  text: label, 
                  alignment: AlignmentType.CENTER,
                  run: { size: 20, color: LIGHT_GREY }
              })
          ],
          borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
          },
      });
  };

  const scoreTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
          new TableRow({
              children: [
                  createScoreCell("ATS Score", data.ats_score),
                  createScoreCell("Job Match", data.jd_match_score || 0),
                  createScoreCell("Skills Fit", data.skills_fit_score || 0),
              ]
          })
      ],
  });

  children.push(scoreTable);
  children.push(new Paragraph({ text: "", spacing: { after: 400 } })); // Spacer

  // 3. Sections Helper
  const addAnalysisSection = (title: string, content: string | string[], icon: string = "•") => {
      if (!content || (Array.isArray(content) && content.length === 0)) return;

      // Section Header
      children.push(
          new Paragraph({
              text: title.toUpperCase(),
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 240, after: 120 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "E0E0E0" } },
              run: { color: PURPLE, bold: true, size: 24 }
          })
      );

      // Content
      if (Array.isArray(content)) {
          content.forEach(item => {
              children.push(new Paragraph({ 
                  children: [
                      new TextRun({ text: `${icon}  `, bold: true, color: PURPLE }),
                      new TextRun({ text: item })
                  ],
                  spacing: { after: 100 }
              }));
          });
      } else {
          children.push(new Paragraph({ 
              text: content,
              spacing: { after: 120 }
          }));
      }
  };

  // 4. Content Modules
  const coachingSummary = typeof data.coaching_summary === 'string' ? data.coaching_summary : data.coaching_summary?.insight;
  if (coachingSummary) {
    addAnalysisSection("Coaching Summary", coachingSummary);
  }
  
  if (data.ats_score_explanation) {
      addAnalysisSection("ATS Score Explanation", data.ats_score_explanation);
  }

  // Keywords Grid Strategy
  if ((data.matched_keywords && data.matched_keywords.length > 0) || (data.missing_keywords && data.missing_keywords.length > 0)) {
      children.push(
          new Paragraph({
              text: "KEYWORD ANALYSIS",
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 240, after: 120 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "E0E0E0" } },
              run: { color: PURPLE, bold: true, size: 24 }
          })
      );
      
      const matched = (data.matched_keywords || []).join(", ");
      const missing = (data.missing_keywords || []).join(", ");

      children.push(new Paragraph({ 
          children: [
              new TextRun({ text: "Matched Keywords: ", bold: true, color: "008000" }),
              new TextRun(matched || "None")
          ],
          spacing: { after: 120 }
      }));

      children.push(new Paragraph({ 
          children: [
              new TextRun({ text: "Missing Keywords: ", bold: true, color: "FF0000" }),
              new TextRun(missing || "None")
          ],
          spacing: { after: 120 }
      }));
  }
  
  // Bullet Improvements
  if (data.bullet_improvements && data.bullet_improvements.length > 0) {
      children.push(
          new Paragraph({
              text: "IMPROVEMENT SUGGESTIONS",
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 300, after: 120 },
              border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "E0E0E0" } },
              run: { color: PURPLE, bold: true, size: 24 }
          })
      );
      
      data.bullet_improvements.forEach((imp, i) => {
          children.push(new Paragraph({
              children: [
                  new TextRun({
                      text: `Suggestion ${i+1}`,
                      bold: true,
                      size: 22,
                      color: DARK_GREY
                  })
              ],
              spacing: { before: 200, after: 60 }
          }));

          // Comparison Table
          const comparisonTable = new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                  new TableRow({
                      children: [
                          new TableCell({
                              children: [new Paragraph({ text: "BEFORE", run: { bold: true, color: "FF0000" } })],
                              width: { size: 10, type: WidthType.PERCENTAGE },
                              borders: { bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE } }
                          }),
                          new TableCell({
                              children: [new Paragraph({ text: imp.before })],
                              borders: { bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE } }
                          })
                      ]
                  }),
                  new TableRow({
                    children: [
                        new TableCell({
                            children: [new Paragraph({ text: "AFTER", run: { bold: true, color: "008000" } })],
                            width: { size: 10, type: WidthType.PERCENTAGE },
                            borders: { bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE } }
                        }),
                        new TableCell({
                            children: [new Paragraph({ text: imp.after })],
                            borders: { bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, top: { style: BorderStyle.NONE } }
                        })
                    ]
                })
              ]
          });
          children.push(comparisonTable);
          
          children.push(new Paragraph({
              children: [
                  new TextRun({
                      text: ` Why: ${imp.reason}`,
                      italics: true,
                      color: LIGHT_GREY
                  })
              ],
              spacing: { after: 120, before: 60 },
              indent: { left: 720 } 
          }));
      });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = jobTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 20);
  saveBlob(blob, `Analysis_${safeTitle}.docx`);
};
