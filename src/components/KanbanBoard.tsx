import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Candidate, Stage } from '../types';
import KanbanColumn from './KanbanColumn';
import CandidateCard from './CandidateCard';
import Modal from './ui/Modal';
import NoteForm from './NoteForm';

const STAGES: Stage[] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

interface KanbanBoardProps {
  initialCandidates: Candidate[];
  onCandidateMove: (candidateId: string, newStage: Stage, note?: string) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialCandidates, onCandidateMove }) => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [moveDetails, setMoveDetails] = useState<{ candidateId: string; newStage: Stage } | null>(null);

  const originalContainerRef = useRef<Stage | undefined>(undefined);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const topScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCandidates(initialCandidates);
  }, [initialCandidates]);

  const groupByStage = (arr: Candidate[]) => {
    const initialGroups: Record<Stage, Candidate[]> = {
      applied: [], screen: [], tech: [], offer: [], hired: [], rejected: [],
    };
    for (const c of arr) {
      initialGroups[c.stage]?.push(c);
    }
    return initialGroups;
  };

  const groupedCandidates = useMemo(() => groupByStage(candidates), [candidates]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: undefined })
  );

  const findContainer = (id: string | number | undefined): Stage | undefined => {
    if (!id) return undefined;
    if (STAGES.includes(id as Stage)) return id as Stage;
    const found = candidates.find(c => c.id === id);
    return found?.stage;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    originalContainerRef.current = findContainer(active.id as string);
    setActiveCandidate(candidates.find(c => c.id === active.id) || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeContainer = findContainer(activeId);
    const overContainer = findContainer(overId);

    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) return;

    setCandidates(prev => {
      const groups = groupByStage(prev);

      const newGroups: Record<Stage, Candidate[]> = {
        applied: [...groups.applied],
        screen: [...groups.screen],
        tech: [...groups.tech],
        offer: [...groups.offer],
        hired: [...groups.hired],
        rejected: [...groups.rejected],
      };

      const moving = prev.find(p => p.id === activeId);
      if (!moving) return prev;

      newGroups[activeContainer] = newGroups[activeContainer].filter(i => i.id !== activeId);

      const overItems = newGroups[overContainer];
      let insertIndex = overItems.length; 

      if (!STAGES.includes(overId as Stage)) {
        const idx = overItems.findIndex(i => i.id === overId);
        if (idx >= 0) insertIndex = idx;
      }

      const movedCandidate = { ...moving, stage: overContainer };
      newGroups[overContainer] = [
        ...overItems.slice(0, insertIndex),
        movedCandidate,
        ...overItems.slice(insertIndex),
      ];

      return [
        ...newGroups.applied,
        ...newGroups.screen,
        ...newGroups.tech,
        ...newGroups.offer,
        ...newGroups.hired,
        ...newGroups.rejected,
      ];
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) {
      setActiveCandidate(null);
      originalContainerRef.current = undefined;
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const previousContainer = originalContainerRef.current;
    const finalContainer = findContainer(overId);

    if (previousContainer && finalContainer && previousContainer !== finalContainer) {
      setMoveDetails({ candidateId: activeId, newStage: finalContainer });
      setTimeout(() => setIsNoteModalOpen(true), 200);
    } else if (previousContainer && finalContainer && previousContainer === finalContainer) {
      setCandidates(prev => {
        const groups = groupByStage(prev);
        const items = groups[finalContainer];
        const oldIndex = items.findIndex(i => i.id === activeId);
        const newIndex = items.findIndex(i => i.id === overId);
        if (oldIndex === -1 || newIndex === -1) return prev;
        const newItems = arrayMove(items, oldIndex, newIndex);

        const replaced: Candidate[] = [
          ...(finalContainer === 'applied' ? newItems : groups.applied),
          ...(finalContainer === 'screen' ? newItems : groups.screen),
          ...(finalContainer === 'tech' ? newItems : groups.tech),
          ...(finalContainer === 'offer' ? newItems : groups.offer),
          ...(finalContainer === 'hired' ? newItems : groups.hired),
          ...(finalContainer === 'rejected' ? newItems : groups.rejected),
        ];
        return replaced;
      });
    }

    setActiveCandidate(null);
    originalContainerRef.current = undefined;
  };

  const handleNoteSubmit = ({ note }: { note: string }) => {
    if (moveDetails) {
      onCandidateMove(moveDetails.candidateId, moveDetails.newStage, note);
    }
    setIsNoteModalOpen(false);
    setMoveDetails(null);
  };

  const handleNoteCancel = () => {
    if (moveDetails) {
      onCandidateMove(moveDetails.candidateId, moveDetails.newStage);
    }
    setIsNoteModalOpen(false);
    setMoveDetails(null);
  };

  const handleMainScroll = () => {
    if (topScrollRef.current && scrollContainerRef.current) {
      topScrollRef.current.scrollLeft = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleTopScroll = () => {
    if (scrollContainerRef.current && topScrollRef.current) {
      scrollContainerRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  return (
    <>
      <div>
        <div
          ref={topScrollRef}
          className="overflow-x-auto mb-2 kanban-scrollbar"
          style={{ height: '12px' }}
          onScroll={handleTopScroll}
        >
          <div style={{ width: `${STAGES.length * 304}px`, height: '1px' }}></div>
        </div>

        <div
          ref={scrollContainerRef}
          className="overflow-x-auto pb-2 hide-scrollbar"
          onScroll={handleMainScroll}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="flex space-x-4 p-2 min-w-max">
              {STAGES.map(stage => (
                <SortableContext
                  key={stage}
                  items={groupedCandidates[stage].map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <KanbanColumn
                    stage={stage}
                    candidates={groupedCandidates[stage]}
                  />
                </SortableContext>
              ))}
            </div>

            <DragOverlay>
              {activeCandidate ? <CandidateCard candidate={activeCandidate} isDragging /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      <Modal isOpen={isNoteModalOpen} onClose={handleNoteCancel} title="Add Comment">
        <NoteForm
          onSubmit={handleNoteSubmit}
          onCancel={handleNoteCancel}
          isSubmitting={false}
          label="Add comment about this stage change (optional)"
          submitButtonText="Save & Move"
        />
      </Modal>
    </>
  );
};

export default KanbanBoard;
