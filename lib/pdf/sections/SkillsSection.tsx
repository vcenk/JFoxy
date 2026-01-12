// lib/pdf/sections/SkillsSection.tsx
// Skills section for PDF resume

import React from 'react'
import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { SkillsData, SkillCategory } from '@/lib/types/resume'
import { ResumeDesign } from '../types'
import { computeStyles, getFontFamily } from '../styles'

interface SkillsSectionProps {
  skills: SkillsData
  design: ResumeDesign
}

export function SkillsSection({ skills, design }: SkillsSectionProps) {
  const sectionSettings = design.sectionSettings.skills

  // Don't render if section disabled
  if (sectionSettings?.enabled === false) {
    return null
  }

  const computed = computeStyles(design)
  const fontFamily = getFontFamily(design.fontFamily)
  const columns = sectionSettings?.columns || 2

  const styles = StyleSheet.create({
    container: {
      marginBottom: computed.spacing.section,
    },
    header: {
      fontFamily,
      fontSize: computed.fonts.section,
      fontWeight: 700,
      color: computed.colors.primary,
      marginBottom: 8,
      ...(design.headingStyle === 'caps' && {
        textTransform: 'uppercase',
        letterSpacing: 1,
      }),
      ...(design.headingStyle === 'underline' && {
        borderBottomWidth: 1,
        borderBottomColor: computed.colors.accent,
        paddingBottom: 3,
      }),
    },
    content: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -4, // Negative margin for gutter
    },
    columnItem: {
      paddingHorizontal: 4, // Gutter
      marginBottom: computed.spacing.item,
      width: columns === 1 ? '100%' : columns === 2 ? '50%' : '33.33%',
    },
    categoryName: {
      fontFamily,
      fontSize: computed.fonts.body,
      fontWeight: 700,
      color: computed.colors.text,
      marginBottom: 2,
    },
    skillsInline: {
      fontFamily,
      fontSize: computed.fonts.body,
      color: computed.colors.text,
      lineHeight: 1.4,
    },
  })

  const title = sectionSettings?.customTitle || 'Skills'

  // Collect all skills from different sources
  const skillCategories: { name: string; skills: string[] }[] = []

  // Process technical skills
  if (skills.technical && skills.technical.length > 0) {
    const enabledSkills = skills.technical
      .filter((s: SkillCategory) => s.enabled !== false)
      .map((s: SkillCategory) => s.name)
    if (enabledSkills.length > 0) {
      skillCategories.push({ name: 'Technical Skills', skills: enabledSkills })
    }
  } else if (skills.technicalLegacy && skills.technicalLegacy.length > 0) {
    skillCategories.push({ name: 'Technical Skills', skills: skills.technicalLegacy })
  }

  // Process soft skills
  if (skills.soft && skills.soft.length > 0) {
    const enabledSkills = skills.soft
      .filter((s: SkillCategory) => s.enabled !== false)
      .map((s: SkillCategory) => s.name)
    if (enabledSkills.length > 0) {
      skillCategories.push({ name: 'Soft Skills', skills: enabledSkills })
    }
  } else if (skills.softLegacy && skills.softLegacy.length > 0) {
    skillCategories.push({ name: 'Soft Skills', skills: skills.softLegacy })
  }

  // Process other skills
  if (skills.other && skills.other.length > 0) {
    const enabledSkills = skills.other
      .filter((s: SkillCategory) => s.enabled !== false)
      .map((s: SkillCategory) => s.name)
    if (enabledSkills.length > 0) {
      skillCategories.push({ name: 'Other Skills', skills: enabledSkills })
    }
  } else if (skills.otherLegacy && skills.otherLegacy.length > 0) {
    skillCategories.push({ name: 'Other Skills', skills: skills.otherLegacy })
  }

  // Don't render if no skills
  if (skillCategories.length === 0) {
    return null
  }

  // If only one category, always render full width (inline) regardless of column setting
  // to avoid awkward single column in a 3-column grid
  const singleCategory = skillCategories.length === 1

  if (singleCategory) {
     const allSkills = skillCategories.flatMap((c) => c.skills)
     return (
      <View style={styles.container}>
        <Text style={styles.header}>{title}</Text>
        <Text style={styles.skillsInline}>
          {allSkills.join(' • ')}
        </Text>
      </View>
     )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      
      <View style={styles.content}>
        {skillCategories.map((category) => (
          <View key={category.name} style={styles.columnItem}>
            <Text style={styles.categoryName}>{category.name}:</Text>
            <Text style={styles.skillsInline}>
              {category.skills.join(', ')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )
}
