
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import JobCard from './JobCard';
import type { Job } from '../types';

interface DndJobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onArchive: (job: Job) => void;
  onDelete: (job: Job) => void;
}

const DndJobCard: React.FC<DndJobCardProps> = ({ job, onEdit, onArchive, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <JobCard
        job={job}
        onEdit={onEdit}
        onArchive={onArchive}
        onDelete={onDelete}
      />
    </div>
  );
};

export default DndJobCard;