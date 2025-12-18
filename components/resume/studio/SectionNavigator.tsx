// components/resume/studio/SectionNavigator.tsx
// Left Sidebar: Section Navigator with drag-and-drop

'use client'

import { useResume } from '@/contexts/ResumeContext'
import {
  User,
  Target,
  FileText,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Award,
  Trophy,
  Heart,
  BookOpen,
  Globe,
  GripVertical,
} from 'lucide-react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const SECTION_ICONS = {
  contact: User,
  targetTitle: Target,
  summary: FileText,
  experience: Briefcase,
  education: GraduationCap,
  skills: Code,
  projects: FolderOpen,
  certifications: Award,
  awards: Trophy,
  volunteer: Heart,
  publications: BookOpen,
  languages: Globe,
}

const SECTION_LABELS = {
  contact: 'Contact Info',
  targetTitle: 'Target Title',
  summary: 'Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  awards: 'Awards',
  volunteer: 'Volunteer',
  publications: 'Publications',
  languages: 'Languages',
}

interface SortableSectionItemProps {
  section: string
  isActive: boolean
  onClick: () => void
}

const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  section,
  isActive,
  onClick,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: section,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const Icon = SECTION_ICONS[section as keyof typeof SECTION_ICONS]

  return (
    <div ref={setNodeRef} style={style}>
      <button
        onClick={onClick}
        className={`
          w-full flex items-center space-x-3 px-4 py-3 rounded-xl
          transition-all duration-200 group
          ${
            isActive
              ? 'bg-purple-500/30 border border-purple-500/50 text-white shadow-lg shadow-purple-500/20'
              : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
          }
        `}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={`cursor-grab active:cursor-grabbing ${
            isActive ? 'text-purple-300' : 'text-white/40 group-hover:text-white/60'
          }`}
        >
          <GripVertical className="w-4 h-4" />
        </div>

        {/* Icon */}
        <Icon className="w-5 h-5" />

        {/* Label */}
        <span className="text-sm font-medium flex-1 text-left">
          {SECTION_LABELS[section as keyof typeof SECTION_LABELS]}
        </span>
      </button>
    </div>
  )
}

export const SectionNavigator = () => {
  const { sectionOrder, setSectionOrder, activeSection, setActiveSection, setInspectorTab } =
    useResume()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sectionOrder.indexOf(active.id as string)
      const newIndex = sectionOrder.indexOf(over.id as string)

      setSectionOrder(arrayMove(sectionOrder, oldIndex, newIndex))
    }
  }

  return (
    <div className="w-60 h-full bg-black/40 backdrop-blur-xl border-r border-white/10 p-4 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-1">Sections</h2>
        <p className="text-xs text-white/50">Click to edit • Drag to reorder</p>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {sectionOrder.map(section => (
              <SortableSectionItem
                key={section}
                section={section}
                isActive={activeSection === section}
                onClick={() => {
                  setActiveSection(section as any)
                  setInspectorTab('content')
                }}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-8 p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl border border-purple-500/30">
        <p className="text-xs text-purple-200">
          💡 <strong>Tip:</strong> Arrange sections in the order recruiters expect to see them.
        </p>
      </div>
    </div>
  )
}
