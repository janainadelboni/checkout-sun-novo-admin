import { useState } from 'react'
import { Button, Dropdown, message } from 'antd'
import { X, Plus } from 'lucide-react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function DragIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="rgba(0,0,0,0.3)">
      <circle cx="4" cy="2.5" r="1.3" />
      <circle cx="10" cy="2.5" r="1.3" />
      <circle cx="4" cy="7" r="1.3" />
      <circle cx="10" cy="7" r="1.3" />
      <circle cx="4" cy="11.5" r="1.3" />
      <circle cx="10" cy="11.5" r="1.3" />
    </svg>
  )
}

function SortableItem({
  id, children, onRemove, isEditing,
}: {
  id: string; children: React.ReactNode; onRemove: () => void; isEditing: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id, disabled: !isEditing,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? { ...attributes, ...listeners } : {})}
      className={`relative group ${isEditing ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      {isEditing && (
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-white rounded border border-[rgba(0,0,0,0.1)] w-7 h-7 flex items-center justify-center shadow-sm">
            <DragIcon />
          </div>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onRemove}
            className="bg-white rounded border border-[rgba(0,0,0,0.1)] w-7 h-7 flex items-center justify-center cursor-pointer shadow-sm hover:border-red-300"
            title="Remover"
          >
            <X size={14} className="text-sm text-red-400" />
          </button>
        </div>
      )}
      {children}
    </div>
  )
}

export type SectionItem = {
  id: string
  label?: string
  component: React.ReactNode
}

export default function DraggableSections({
  sections: initialSections,
  isEditing,
}: {
  sections: SectionItem[]
  isEditing: boolean
}) {
  const [visibleIds, setVisibleIds] = useState(initialSections.map((s) => s.id))

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setVisibleIds((prev) => {
        const oldIndex = prev.indexOf(active.id as string)
        const newIndex = prev.indexOf(over.id as string)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  const handleRemove = (id: string) => {
    const section = initialSections.find((s) => s.id === id)
    setVisibleIds((prev) => prev.filter((i) => i !== id))
    message.info({
      content: `"${section?.label || id}" removido. Você pode restaurá-lo no botão ao final da página.`,
      duration: 4,
    })
  }

  const handleRestore = (id: string) => {
    setVisibleIds((prev) => [...prev, id])
  }

  const visibleSections = visibleIds
    .map((id) => initialSections.find((s) => s.id === id))
    .filter(Boolean) as SectionItem[]

  const removedSections = initialSections.filter((s) => !visibleIds.includes(s.id))

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={visibleIds} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-6">
          {visibleSections.map((section) => (
            <SortableItem
              key={section.id}
              id={section.id}
              onRemove={() => handleRemove(section.id)}
              isEditing={isEditing}
            >
              {section.component}
            </SortableItem>
          ))}

          {/* Restore button */}
          {isEditing && removedSections.length > 0 && (
            <Dropdown
              menu={{
                items: removedSections.map((s) => ({
                  key: s.id,
                  label: s.label || s.id,
                  onClick: () => handleRestore(s.id),
                })),
              }}
              trigger={['click']}
            >
              <Button
                type="dashed"
                icon={<Plus size={14}  />}
                className="w-full"
              >
                Restaurar seção ({removedSections.length})
              </Button>
            </Dropdown>
          )}
        </div>
      </SortableContext>
    </DndContext>
  )
}
