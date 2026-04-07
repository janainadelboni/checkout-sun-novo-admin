import { useState } from 'react'
import { Typography, Tooltip, Dropdown, Checkbox } from 'antd'
import { QuestionCircleOutlined, HolderOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
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
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const { Title, Text } = Typography

export type KpiItem = {
  id: string
  label: string
  valor: string
  tooltip?: string
}

function SortableCard({
  item, isEditing, onRemove,
}: {
  item: KpiItem; isEditing: boolean; onRemove: () => void
}) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: item.id, disabled: !isEditing })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 0,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? { ...attributes, ...listeners } : {})}
      className={`flex-1 min-w-0 rounded-lg px-4 py-3 flex flex-col gap-0.5 relative transition-colors group ${
        isEditing
          ? 'bg-[#e8edf5] cursor-grab active:cursor-grabbing'
          : 'bg-[#f5f7fa]'
      }`}
    >
      {isEditing && (
        <>
          <div className="absolute top-2 right-2 text-[rgba(0,0,0,0.25)]">
            <HolderOutlined className="text-base" />
          </div>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onRemove}
            className="absolute top-2 right-8 opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full w-5 h-5 flex items-center justify-center cursor-pointer border border-[rgba(0,0,0,0.1)] hover:border-red-300"
            title="Remover"
          >
            <CloseOutlined className="text-[10px] text-red-400" />
          </button>
        </>
      )}
      <div className="flex items-center gap-1">
        <Text type="secondary" className="text-xs">{item.label}</Text>
        {item.tooltip && (
          <Tooltip title={item.tooltip}>
            <QuestionCircleOutlined className="text-[rgba(0,0,0,0.25)] text-xs cursor-help" />
          </Tooltip>
        )}
      </div>
      <Title level={3} className="!mb-0 !mt-0">{item.valor}</Title>
    </div>
  )
}

export default function DraggableKpiCards({
  items: initialItems,
  isEditing = false,
}: {
  items: KpiItem[]
  isEditing?: boolean
}) {
  const [visibleIds, setVisibleIds] = useState(initialItems.map((i) => i.id))

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
    setVisibleIds((prev) => prev.filter((i) => i !== id))
  }

  const handleToggle = (id: string) => {
    setVisibleIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    )
  }

  const visibleItems = visibleIds
    .map((id) => initialItems.find((i) => i.id === id))
    .filter(Boolean) as KpiItem[]

  const dropdownItems = initialItems.map((item) => ({
    key: item.id,
    label: (
      <div className="flex items-center gap-2" onClick={(e) => { e.stopPropagation(); handleToggle(item.id) }}>
        <Checkbox checked={visibleIds.includes(item.id)} />
        <span className="text-sm">{item.label}</span>
      </div>
    ),
  }))

  return (
    <div className="flex gap-3 items-stretch">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={visibleIds} strategy={horizontalListSortingStrategy}>
          {visibleItems.map((item) => (
            <SortableCard key={item.id} item={item} isEditing={isEditing} onRemove={() => handleRemove(item.id)} />
          ))}
        </SortableContext>
      </DndContext>
      {/* Edit dropdown to add/remove cards */}
      {isEditing && (
        <Dropdown menu={{ items: dropdownItems }} trigger={['click']} placement="bottomRight">
          <button className="w-8 shrink-0 rounded-lg border-2 border-dashed border-[rgba(0,0,0,0.15)] flex items-center justify-center cursor-pointer bg-transparent hover:border-[#0d2772] hover:text-[#0d2772] text-[rgba(0,0,0,0.25)] transition-colors">
            <EditOutlined className="text-sm" />
          </button>
        </Dropdown>
      )}
    </div>
  )
}
