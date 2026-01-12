// lib/pdf/sections/HeaderSection.tsx
// Contact/Header section for PDF resume

import React from 'react'
import { View, Text, Link, StyleSheet } from '@react-pdf/renderer'
import { ContactInfo } from '@/lib/types/resume'
import { ResumeDesign } from '../types'
import { computeStyles, getFontFamily } from '../styles'

interface HeaderSectionProps {
  data: ContactInfo
  targetTitle?: string
  design: ResumeDesign
}

export function HeaderSection({ data, targetTitle, design }: HeaderSectionProps) {
  const computed = computeStyles(design)
  const fontFamily = getFontFamily(design.fontFamily)
  const headerAlignment = design.headerAlignment || 'center'
  const isLeftAligned = headerAlignment === 'left'

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'column',
      marginBottom: computed.spacing.section,
      alignItems: isLeftAligned ? 'flex-start' : 'center',
      width: '100%',
    },
    name: {
      fontFamily,
      fontSize: computed.fonts.name,
      fontWeight: 700,
      color: computed.colors.primary,
      marginBottom: 10,
      textAlign: isLeftAligned ? 'left' : 'center',
      width: '100%',
    },
    targetTitle: {
      fontFamily,
      fontSize: computed.fonts.section,
      color: computed.colors.muted,
      marginBottom: 12,
      textAlign: isLeftAligned ? 'left' : 'center',
      width: '100%',
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: isLeftAligned ? 'flex-start' : 'center',
      alignItems: 'center',
      width: '100%',
      marginTop: 8,
    },
    contactItem: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.text,
    },
    separator: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.muted,
      marginLeft: 8,
      marginRight: 8,
    },
    link: {
      fontFamily,
      fontSize: computed.fonts.small,
      color: computed.colors.accent,
      textDecoration: 'none',
    },
  })

  // Build contact items
  const contactItems: React.ReactNode[] = []

  const addItem = (content: React.ReactNode) => {
    if (contactItems.length > 0) {
      contactItems.push(
        <Text key={`sep-${contactItems.length}`} style={styles.separator}>|</Text>
      )
    }
    contactItems.push(content)
  }

  // Location
  if (data.location && data.locationEnabled !== false) {
    addItem(
      <Text key="location" style={styles.contactItem}>
        {data.location}
      </Text>
    )
  }

  // Email
  if (data.email && data.emailEnabled !== false) {
    addItem(
      <Link key="email" src={`mailto:${data.email}`} style={styles.link}>
        {data.email}
      </Link>
    )
  }

  // Phone
  if (data.phone && data.phoneEnabled !== false) {
    addItem(
      <Text key="phone" style={styles.contactItem}>
        {data.phone}
      </Text>
    )
  }

  // LinkedIn
  if (data.linkedin && data.linkedinEnabled !== false) {
    // Clean the username - remove any URL prefix (with or without protocol)
    const cleanUsername = data.linkedin
      .replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/in\//, '')
      .replace(/\/$/, '')
    const linkedinUrl = `https://linkedin.com/in/${cleanUsername}`
    addItem(
      <Link key="linkedin" src={linkedinUrl} style={styles.link}>
        linkedin.com/in/{cleanUsername}
      </Link>
    )
  }

  // GitHub
  if (data.github && data.githubEnabled !== false) {
    // Clean the username - remove any URL prefix (with or without protocol)
    const cleanUsername = data.github
      .replace(/^(https?:\/\/)?(www\.)?github\.com\//, '')
      .replace(/\/$/, '')
    const githubUrl = `https://github.com/${cleanUsername}`
    addItem(
      <Link key="github" src={githubUrl} style={styles.link}>
        github.com/{cleanUsername}
      </Link>
    )
  }

  // Portfolio
  if (data.portfolio && data.portfolioEnabled !== false) {
    const cleanPortfolio = data.portfolio.replace(/^https?:\/\//, '').replace(/\/$/, '')
    const portfolioUrl = `https://${cleanPortfolio}`
    addItem(
      <Link key="portfolio" src={portfolioUrl} style={styles.link}>
        {cleanPortfolio}
      </Link>
    )
  }

  // Build name display
  const displayName = data.name || [data.firstName, data.lastName].filter(Boolean).join(' ')

  return (
    <View style={styles.container}>
      {displayName && data.nameEnabled !== false && (
        <Text style={styles.name}>{displayName}</Text>
      )}
      {targetTitle && (
        <Text style={styles.targetTitle}>{targetTitle}</Text>
      )}
      {contactItems.length > 0 && (
        <View style={styles.contactRow}>
          {contactItems}
        </View>
      )}
    </View>
  )
}
