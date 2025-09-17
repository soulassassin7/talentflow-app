
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CandidateCard from './CandidateCard';
import type { Candidate } from '../types';

interface DndCandidateCardProps {
  candidate: Candidate;
}

const DndCandidateCard: React.FC<DndCandidateCardProps> = ({ candidate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: candidate.id,
    data: {
      stage: candidate.stage
    }
  });

  const style = { 
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
   };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CandidateCard candidate={candidate} />
    </div>
  );
};

export default DndCandidateCard;