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
    // Helper to extract skill names from SkillCategory objects or strings
    const getSkillNames = (skills: any[]): string[] => {
      return skills
        .filter((s: any) => s.enabled !== false)
        .map((s: any) => typeof s === 'string' ? s : s.name)
        .filter(Boolean);
    };

    const technicalSkills = data.skills.technical ? getSkillNames(data.skills.technical) : [];
    const softSkills = data.skills.soft ? getSkillNames(data.skills.soft) : [];
    const otherSkills = data.skills.other ? getSkillNames(data.skills.other) : [];

    const hasSkills = technicalSkills.length || softSkills.length || otherSkills.length;
    if (hasSkills) {
      const customTitle = effectiveDesign.sectionSettings.skills?.customTitle;
      children.push(createSectionHeader(customTitle || "Skills"));

      if (technicalSkills.length) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Technical: ", bold: true, font: RESUME_FONT, size: bodyFontSize, color: accentColor }),
              new TextRun({ text: technicalSkills.join(", "), font: RESUME_FONT, size: bodyFontSize, color: textColor }),
            ],
            spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
          })
        );
      }
      if (softSkills.length) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Soft Skills: ", bold: true, font: RESUME_FONT, size: bodyFontSize, color: accentColor }),
              new TextRun({ text: softSkills.join(", "), font: RESUME_FONT, size: bodyFontSize, color: textColor }),
            ],
            spacing: { after: Math.round(spacing.bullet * PX_TO_TWIPS) },
          })
        );
      }
      if (otherSkills.length) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Other: ", bold: true, font: RESUME_FONT, size: bodyFontSize, color: accentColor }),
              new TextRun({ text: otherSkills.join(", "), font: RESUME_FONT, size: bodyFontSize, color: textColor }),
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

// --- Analysis Report Export (Comprehensive) ---
export const exportAnalysisReportToDocx = async (data: AnalysisData, jobTitle: string, company: string) => {
  const children: any[] = [];

  // Color constants
  const GREEN = "22C55E";
  const RED = "EF4444";
  const ORANGE = "F59E0B";
  const BLUE = "3B82F6";

  // Helper: Get score color
  const getScoreColor = (score: number): string => {
    if (score >= 70) return GREEN;
    if (score >= 50) return ORANGE;
    return RED;
  };

  // Helper: Create section header
  const createSectionHeader = (title: string) => {
    return new Paragraph({
      children: [
        new TextRun({ text: title.toUpperCase(), bold: true, size: 24, color: PURPLE })
      ],
      spacing: { before: 300, after: 120 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: PURPLE } }
    });
  };

  // Helper: Create bullet list
  const createBulletList = (items: string[], color: string = DARK_GREY) => {
    return items.map(item => new Paragraph({
      children: [
        new TextRun({ text: "•  ", bold: true, color: PURPLE }),
        new TextRun({ text: item, color })
      ],
      spacing: { after: 80 },
      indent: { left: 200 }
    }));
  };

  // Helper: No border cell
  const noBorderCell = (content: Paragraph[], width?: number) => new TableCell({
    children: content,
    width: width ? { size: width, type: WidthType.PERCENTAGE } : undefined,
    borders: {
      top: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
    }
  });

  // ============================================
  // SECTION 1: HEADER
  // ============================================
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({ text: "RESUME ANALYSIS REPORT", bold: true, size: 40, color: PURPLE }),
      ]
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({ text: jobTitle || "Job Analysis", bold: true, size: 28, color: DARK_GREY }),
        new TextRun({ text: company ? ` at ${company}` : "", size: 28, color: LIGHT_GREY }),
      ]
    })
  );
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({ text: `Generated on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, size: 18, color: "AAAAAA" })
      ]
    })
  );

  // ============================================
  // SECTION 2: EXECUTIVE SCORE DASHBOARD
  // ============================================
  const createScoreCell = (label: string, score: number, explanation?: string) => {
    const color = getScoreColor(score);
    const cellChildren = [
      new Paragraph({
        children: [new TextRun({ text: `${score}%`, color, bold: true, size: 56 })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 }
      }),
      new Paragraph({
        children: [new TextRun({ text: label.toUpperCase(), size: 18, color: LIGHT_GREY, bold: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 }
      })
    ];

    if (explanation) {
      cellChildren.push(new Paragraph({
        children: [new TextRun({ text: explanation.substring(0, 150) + (explanation.length > 150 ? '...' : ''), size: 16, color: LIGHT_GREY, italics: true })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 }
      }));
    }

    return new TableCell({
      children: cellChildren,
      shading: { fill: "F8F8F8", type: ShadingType.SOLID },
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
      },
      margins: { top: 200, bottom: 200, left: 100, right: 100 }
    });
  };

  const scoreTable = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          createScoreCell("ATS Score", data.ats_score, data.ats_score_explanation),
          createScoreCell("Job Match", data.jd_match_score || 0, data.job_match_explanation),
          createScoreCell("Skills Fit", data.skills_fit_score || 0, data.skills_fit_explanation),
        ]
      })
    ],
  });

  children.push(scoreTable);
  children.push(new Paragraph({ text: "", spacing: { after: 300 } }));

  // ============================================
  // SECTION 3: COACHING SUMMARY
  // ============================================
  const coachingSummary = typeof data.coaching_summary === 'string'
    ? data.coaching_summary
    : data.coaching_summary?.insight;

  if (coachingSummary) {
    children.push(createSectionHeader("Executive Summary"));
    children.push(new Paragraph({
      children: [new TextRun({ text: coachingSummary, size: 22 })],
      spacing: { after: 200 }
    }));
  }

  // ============================================
  // SECTION 4: JD REQUIREMENTS ANALYSIS
  // ============================================
  if (data.jd_requirements && data.jd_requirements.length > 0) {
    children.push(createSectionHeader("Job Requirements Analysis"));

    // Summary stats
    const matched = data.jd_requirements.filter(r => r.status === 'matched').length;
    const partial = data.jd_requirements.filter(r => r.status === 'partial').length;
    const missing = data.jd_requirements.filter(r => r.status === 'missing').length;
    const total = data.jd_requirements.length;

    children.push(new Paragraph({
      children: [
        new TextRun({ text: `${matched} of ${total} requirements matched`, bold: true, color: GREEN }),
        new TextRun({ text: ` • ${partial} partial • ${missing} missing`, color: LIGHT_GREY })
      ],
      spacing: { after: 200 }
    }));

    // Requirements table
    const reqRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Requirement", run: { bold: true, size: 18, color: WHITE } })],
            shading: { fill: PURPLE, type: ShadingType.SOLID },
            width: { size: 40, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: "Category", run: { bold: true, size: 18, color: WHITE } })],
            shading: { fill: PURPLE, type: ShadingType.SOLID },
            width: { size: 15, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: "Importance", run: { bold: true, size: 18, color: WHITE } })],
            shading: { fill: PURPLE, type: ShadingType.SOLID },
            width: { size: 15, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: "Status", run: { bold: true, size: 18, color: WHITE } })],
            shading: { fill: PURPLE, type: ShadingType.SOLID },
            width: { size: 15, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: "Evidence", run: { bold: true, size: 18, color: WHITE } })],
            shading: { fill: PURPLE, type: ShadingType.SOLID },
            width: { size: 15, type: WidthType.PERCENTAGE }
          }),
        ]
      })
    ];

    data.jd_requirements.forEach(req => {
      const statusColor = req.status === 'matched' ? GREEN : req.status === 'partial' ? ORANGE : RED;
      reqRows.push(new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: req.requirement, run: { size: 18 } })] }),
          new TableCell({ children: [new Paragraph({ text: req.category, run: { size: 18, italics: true } })] }),
          new TableCell({ children: [new Paragraph({ text: req.importance, run: { size: 18 } })] }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: req.status.toUpperCase(), bold: true, size: 18, color: statusColor })]
            })]
          }),
          new TableCell({ children: [new Paragraph({ text: req.evidence || '-', run: { size: 16, italics: true, color: LIGHT_GREY } })] }),
        ]
      }));
    });

    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: reqRows
    }));
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // ============================================
  // SECTION 5: KEYWORD ANALYSIS
  // ============================================
  if ((data.matched_keywords && data.matched_keywords.length > 0) || (data.missing_keywords && data.missing_keywords.length > 0)) {
    children.push(createSectionHeader("Keyword Analysis"));

    // Keyword strategy if available
    if (data.keyword_strategy) {
      children.push(new Paragraph({
        children: [new TextRun({ text: data.keyword_strategy, size: 20, italics: true, color: LIGHT_GREY })],
        spacing: { after: 150 }
      }));
    }

    // Two column table for keywords
    const matchedList = (data.matched_keywords || []).slice(0, 20);
    const missingList = (data.missing_keywords || []).slice(0, 20);

    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `MATCHED (${data.matched_keywords?.length || 0})`, bold: true, size: 20, color: GREEN })] })],
              shading: { fill: "F0FDF4", type: ShadingType.SOLID },
              width: { size: 50, type: WidthType.PERCENTAGE }
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: `MISSING (${data.missing_keywords?.length || 0})`, bold: true, size: 20, color: RED })] })],
              shading: { fill: "FEF2F2", type: ShadingType.SOLID },
              width: { size: 50, type: WidthType.PERCENTAGE }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ text: matchedList.join(", ") || "None", run: { size: 18 } })],
              margins: { top: 100, bottom: 100, left: 100, right: 100 }
            }),
            new TableCell({
              children: [new Paragraph({ text: missingList.join(", ") || "None", run: { size: 18 } })],
              margins: { top: 100, bottom: 100, left: 100, right: 100 }
            })
          ]
        })
      ]
    }));
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // ============================================
  // SECTION 6: ATS HEALTH CHECK
  // ============================================
  if (data.ats_health_check || (data.ats_warnings && data.ats_warnings.length > 0) || (data.ats_good_practices && data.ats_good_practices.length > 0)) {
    children.push(createSectionHeader("ATS Health Check"));

    if (data.ats_health_check) {
      children.push(new Paragraph({
        children: [new TextRun({ text: data.ats_health_check, size: 20 })],
        spacing: { after: 150 }
      }));
    }

    // Critical warnings
    const criticalWarnings = data.ats_warnings?.filter(w => w.severity === 'critical') || [];
    if (criticalWarnings.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: "🚨 CRITICAL ISSUES", bold: true, size: 20, color: RED })],
        spacing: { before: 150, after: 80 }
      }));
      criticalWarnings.forEach(w => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `Issue: `, bold: true, size: 18 }),
            new TextRun({ text: w.issue, size: 18 })
          ],
          indent: { left: 200 },
          spacing: { after: 40 }
        }));
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `Fix: `, bold: true, size: 18, color: GREEN }),
            new TextRun({ text: w.recommendation, size: 18, italics: true })
          ],
          indent: { left: 200 },
          spacing: { after: 100 }
        }));
      });
    }

    // Regular warnings
    const regularWarnings = data.ats_warnings?.filter(w => w.severity === 'warning') || [];
    if (regularWarnings.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: "⚠️ WARNINGS", bold: true, size: 20, color: ORANGE })],
        spacing: { before: 150, after: 80 }
      }));
      regularWarnings.forEach(w => {
        children.push(new Paragraph({
          children: [
            new TextRun({ text: `• ${w.issue}`, size: 18 }),
            new TextRun({ text: ` → ${w.recommendation}`, size: 18, italics: true, color: LIGHT_GREY })
          ],
          indent: { left: 200 },
          spacing: { after: 60 }
        }));
      });
    }

    // Good practices
    if (data.ats_good_practices && data.ats_good_practices.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: "✅ WHAT YOU'RE DOING RIGHT", bold: true, size: 20, color: GREEN })],
        spacing: { before: 150, after: 80 }
      }));
      children.push(...createBulletList(data.ats_good_practices, GREEN));
    }

    // Formatting issues
    if (data.formatting_issues && data.formatting_issues.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: "📋 FORMATTING ISSUES", bold: true, size: 20, color: ORANGE })],
        spacing: { before: 150, after: 80 }
      }));
      children.push(...createBulletList(data.formatting_issues));
    }

    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // ============================================
  // SECTION 7: SKILLS ANALYSIS
  // ============================================
  if (data.skills_fit_explanation || data.skills_breakdown_coaching || (data.missing_skills && data.missing_skills.length > 0)) {
    children.push(createSectionHeader("Skills Analysis"));

    if (data.skills_fit_explanation) {
      children.push(new Paragraph({
        children: [new TextRun({ text: data.skills_fit_explanation, size: 20 })],
        spacing: { after: 150 }
      }));
    }

    // Skills gap
    if (data.missing_skills && data.missing_skills.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: "Skills Gap - Consider adding:", bold: true, size: 20, color: ORANGE })],
        spacing: { before: 100, after: 80 }
      }));
      children.push(...createBulletList(data.missing_skills.slice(0, 10)));
    }

    // Skills breakdown by category
    if (data.skills_breakdown_coaching) {
      const categories = [
        { key: 'technical', label: 'Technical Skills', color: PURPLE },
        { key: 'tools', label: 'Tools & Technologies', color: BLUE },
        { key: 'domain', label: 'Domain Knowledge', color: GREEN },
        { key: 'soft_skills', label: 'Soft Skills', color: ORANGE }
      ];

      categories.forEach(cat => {
        const content = data.skills_breakdown_coaching?.[cat.key as keyof typeof data.skills_breakdown_coaching];
        if (content) {
          children.push(new Paragraph({
            children: [new TextRun({ text: cat.label, bold: true, size: 20, color: cat.color })],
            spacing: { before: 120, after: 60 }
          }));
          children.push(new Paragraph({
            children: [new TextRun({ text: content, size: 18, color: LIGHT_GREY })],
            indent: { left: 200 },
            spacing: { after: 80 }
          }));
        }
      });
    }

    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // ============================================
  // SECTION 8: SECTION FEEDBACK
  // ============================================
  if (data.section_feedback && data.section_feedback.length > 0) {
    children.push(createSectionHeader("Section-by-Section Feedback"));

    const feedbackRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Section", run: { bold: true, size: 18, color: WHITE } })],
            shading: { fill: PURPLE, type: ShadingType.SOLID },
            width: { size: 20, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: "Score", run: { bold: true, size: 18, color: WHITE } })],
            shading: { fill: PURPLE, type: ShadingType.SOLID },
            width: { size: 15, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: "Feedback", run: { bold: true, size: 18, color: WHITE } })],
            shading: { fill: PURPLE, type: ShadingType.SOLID },
            width: { size: 65, type: WidthType.PERCENTAGE }
          }),
        ]
      })
    ];

    data.section_feedback.forEach(sf => {
      const scoreColor = getScoreColor(sf.score);
      feedbackRows.push(new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: sf.section, run: { size: 18, bold: true } })] }),
          new TableCell({
            children: [new Paragraph({
              children: [new TextRun({ text: `${sf.score}%`, bold: true, size: 20, color: scoreColor })]
            })]
          }),
          new TableCell({ children: [new Paragraph({ text: sf.feedback, run: { size: 18 } })] }),
        ]
      }));
    });

    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: feedbackRows
    }));
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // ============================================
  // SECTION 9: POWER WORDS ANALYSIS
  // ============================================
  if (data.power_words && data.power_words.suggestions && data.power_words.suggestions.length > 0) {
    children.push(createSectionHeader("Power Words & Language"));

    children.push(new Paragraph({
      children: [
        new TextRun({ text: `Language Score: `, size: 20 }),
        new TextRun({ text: `${data.power_words.score}%`, bold: true, size: 24, color: getScoreColor(data.power_words.score) }),
        new TextRun({ text: ` • Improvement Potential: `, size: 20 }),
        new TextRun({ text: data.power_words.improvementPotential.toUpperCase(), bold: true, size: 20, color: data.power_words.improvementPotential === 'high' ? RED : data.power_words.improvementPotential === 'medium' ? ORANGE : GREEN })
      ],
      spacing: { after: 150 }
    }));

    // Suggestions table
    const pwRows = [
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: "Weak Word", run: { bold: true, size: 18, color: WHITE } })],
            shading: { fill: RED, type: ShadingType.SOLID },
            width: { size: 30, type: WidthType.PERCENTAGE }
          }),
          new TableCell({
            children: [new Paragraph({ text: "Suggested Alternatives", run: { bold: true, size: 18, color: WHITE } })],
            shading: { fill: GREEN, type: ShadingType.SOLID },
            width: { size: 70, type: WidthType.PERCENTAGE }
          }),
        ]
      })
    ];

    data.power_words.suggestions.slice(0, 10).forEach(s => {
      pwRows.push(new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph({ text: s.weak, run: { size: 18, color: RED } })],
            shading: { fill: "FEF2F2", type: ShadingType.SOLID }
          }),
          new TableCell({
            children: [new Paragraph({ text: s.alternatives.join(", "), run: { size: 18, color: GREEN } })],
            shading: { fill: "F0FDF4", type: ShadingType.SOLID }
          }),
        ]
      }));
    });

    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: pwRows
    }));
    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // ============================================
  // SECTION 10: QUANTIFICATION ANALYSIS
  // ============================================
  if (data.quantification) {
    children.push(createSectionHeader("Quantification & Metrics"));

    children.push(new Paragraph({
      children: [
        new TextRun({ text: `Metrics Score: `, size: 20 }),
        new TextRun({ text: `${data.quantification.score}%`, bold: true, size: 24, color: getScoreColor(data.quantification.score) }),
        new TextRun({ text: data.quantification.hasMetrics ? " • Metrics found in resume" : " • No metrics detected", size: 20, color: data.quantification.hasMetrics ? GREEN : ORANGE })
      ],
      spacing: { after: 120 }
    }));

    if (data.quantification.metricTypes && data.quantification.metricTypes.length > 0) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: "Types of metrics found: ", bold: true, size: 18 }),
          new TextRun({ text: data.quantification.metricTypes.join(", "), size: 18, color: GREEN })
        ],
        spacing: { after: 100 }
      }));
    }

    if (data.quantification.suggestions && data.quantification.suggestions.length > 0) {
      children.push(new Paragraph({
        children: [new TextRun({ text: "Suggestions to add metrics:", bold: true, size: 18 })],
        spacing: { before: 100, after: 80 }
      }));
      children.push(...createBulletList(data.quantification.suggestions));
    }

    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // ============================================
  // SECTION 11: BULLET IMPROVEMENTS
  // ============================================
  if (data.bullet_improvements && data.bullet_improvements.length > 0) {
    children.push(createSectionHeader("Bullet Point Improvements"));

    data.bullet_improvements.forEach((imp, i) => {
      children.push(new Paragraph({
        children: [new TextRun({ text: `Improvement ${i + 1}`, bold: true, size: 22, color: PURPLE })],
        spacing: { before: 150, after: 80 }
      }));

      // Before/After table
      children.push(new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: "BEFORE", run: { bold: true, size: 16, color: RED } })],
                shading: { fill: "FEF2F2", type: ShadingType.SOLID },
                width: { size: 12, type: WidthType.PERCENTAGE }
              }),
              new TableCell({
                children: [new Paragraph({ text: imp.before, run: { size: 18 } })],
                shading: { fill: "FEF2F2", type: ShadingType.SOLID }
              })
            ]
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph({ text: "AFTER", run: { bold: true, size: 16, color: GREEN } })],
                shading: { fill: "F0FDF4", type: ShadingType.SOLID },
                width: { size: 12, type: WidthType.PERCENTAGE }
              }),
              new TableCell({
                children: [new Paragraph({ text: imp.after, run: { size: 18 } })],
                shading: { fill: "F0FDF4", type: ShadingType.SOLID }
              })
            ]
          })
        ]
      }));

      children.push(new Paragraph({
        children: [
          new TextRun({ text: "Why: ", bold: true, size: 18, color: LIGHT_GREY }),
          new TextRun({ text: imp.reason, size: 18, italics: true, color: LIGHT_GREY })
        ],
        indent: { left: 200 },
        spacing: { before: 60, after: 120 }
      }));
    });

    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // ============================================
  // SECTION 12: STRENGTHS & WEAKNESSES
  // ============================================
  if ((data.strengths && data.strengths.length > 0) || (data.weaknesses && data.weaknesses.length > 0)) {
    children.push(createSectionHeader("Strengths & Areas for Improvement"));

    children.push(new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "✅ STRENGTHS", bold: true, size: 20, color: GREEN })] })],
              shading: { fill: "F0FDF4", type: ShadingType.SOLID },
              width: { size: 50, type: WidthType.PERCENTAGE }
            }),
            new TableCell({
              children: [new Paragraph({ children: [new TextRun({ text: "⚠️ AREAS FOR IMPROVEMENT", bold: true, size: 20, color: ORANGE })] })],
              shading: { fill: "FEF7E7", type: ShadingType.SOLID },
              width: { size: 50, type: WidthType.PERCENTAGE }
            })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({
              children: (data.strengths || []).slice(0, 8).map(s => new Paragraph({
                children: [new TextRun({ text: `• ${s}`, size: 18 })],
                spacing: { after: 60 }
              })),
              margins: { top: 100, bottom: 100, left: 100, right: 100 }
            }),
            new TableCell({
              children: (data.weaknesses || []).slice(0, 8).map(w => new Paragraph({
                children: [new TextRun({ text: `• ${w}`, size: 18 })],
                spacing: { after: 60 }
              })),
              margins: { top: 100, bottom: 100, left: 100, right: 100 }
            })
          ]
        })
      ]
    }));

    children.push(new Paragraph({ text: "", spacing: { after: 200 } }));
  }

  // ============================================
  // SECTION 13: NEXT STEPS / ACTION ITEMS
  // ============================================
  const actionItems: string[] = [];

  // Collect action items from various sources
  const criticalWarnings = data.ats_warnings?.filter(w => w.severity === 'critical') || [];
  criticalWarnings.forEach(w => actionItems.push(`[CRITICAL] ${w.recommendation}`));

  if (data.missing_keywords && data.missing_keywords.length > 0) {
    actionItems.push(`Add missing keywords: ${data.missing_keywords.slice(0, 5).join(', ')}`);
  }

  if (data.missing_skills && data.missing_skills.length > 0) {
    actionItems.push(`Highlight skills: ${data.missing_skills.slice(0, 3).join(', ')}`);
  }

  if (data.power_words?.improvementPotential === 'high') {
    actionItems.push('Replace weak action verbs with power words');
  }

  if (data.quantification && data.quantification.score < 50) {
    actionItems.push('Add quantifiable achievements (%, $, numbers)');
  }

  if (actionItems.length > 0) {
    children.push(createSectionHeader("Recommended Next Steps"));

    actionItems.slice(0, 10).forEach((item, i) => {
      const isHighPriority = item.includes('[CRITICAL]');
      children.push(new Paragraph({
        children: [
          new TextRun({ text: `${i + 1}. `, bold: true, size: 20, color: PURPLE }),
          new TextRun({ text: item.replace('[CRITICAL] ', ''), size: 20, color: isHighPriority ? RED : DARK_GREY, bold: isHighPriority })
        ],
        spacing: { after: 100 }
      }));
    });
  }

  // ============================================
  // FOOTER
  // ============================================
  children.push(new Paragraph({ text: "", spacing: { after: 400 } }));
  children.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: "E0E0E0" } },
    spacing: { before: 200 },
    children: [
      new TextRun({ text: "Generated by JobFoxy AI Analysis", size: 16, color: "AAAAAA" }),
      new TextRun({ text: " • ", size: 16, color: "AAAAAA" }),
      new TextRun({ text: "www.jobfoxy.com", size: 16, color: PURPLE })
    ]
  }));

  // Create and save document
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 720,
            right: 720,
            bottom: 720,
            left: 720
          }
        }
      },
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const safeTitle = jobTitle.replace(/[^a-z0-9]/gi, '_').substring(0, 30) || 'Analysis';
  saveBlob(blob, `JobFoxy_Analysis_${safeTitle}.docx`);
};
