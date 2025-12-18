// components/resume/analysis/RadarChart.tsx
'use client'

import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

interface SkillData {
  subject: string
  A: number // Current
  fullMark: number
}

interface SkillsRadarProps {
  data: SkillData[]
}

export default function SkillsRadarChart({ data }: SkillsRadarProps) {
  // Default data if empty to prevent chart crash
  const chartData = data.length > 0 ? data : [
    { subject: 'Technical', A: 0, fullMark: 100 },
    { subject: 'Soft Skills', A: 0, fullMark: 100 },
    { subject: 'Tools', A: 0, fullMark: 100 },
    { subject: 'Domain', A: 0, fullMark: 100 },
    { subject: 'Communication', A: 0, fullMark: 100 },
  ]

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadar cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#ffffff30" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#ffffff90', fontSize: 12 }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#6C47FF"
            strokeWidth={2}
            fill="#6C47FF"
            fillOpacity={0.4}
          />
        </RechartsRadar>
      </ResponsiveContainer>
    </div>
  )
}