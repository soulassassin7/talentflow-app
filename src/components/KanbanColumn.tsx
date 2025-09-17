import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Candidate, Stage } from '../types';
import DndCandidateCard from './DndCandidateCard';

interface KanbanColumnProps {
  stage: Stage;
  candidates: Candidate[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ stage, candidates }) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  
  const getStageStyles = (stage: string) => {
    const styles = {
      applied: {
        border: 'border-blue-500/30',
        badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        glow: 'shadow-blue-500/10',
        dropGlow: 'border-blue-500/50 bg-blue-500/5 shadow-lg shadow-blue-500/10'
      },
      screen: {
        border: 'border-purple-500/30',
        badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        glow: 'shadow-purple-500/10',
        dropGlow: 'border-purple-500/50 bg-purple-500/5 shadow-lg shadow-purple-500/10'
      },
      tech: {
        border: 'border-orange-500/30',
        badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        glow: 'shadow-orange-500/10',
        dropGlow: 'border-orange-500/50 bg-orange-500/5 shadow-lg shadow-orange-500/10'
      },
      offer: {
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
        glow: 'shadow-emerald-500/10',
        dropGlow: 'border-emerald-500/50 bg-emerald-500/5 shadow-lg shadow-emerald-500/10'
      },
      hired: {
        border: 'border-green-500/30',
        badge: 'bg-green-500/20 text-green-400 border-green-500/30',
        glow: 'shadow-green-500/10',
        dropGlow: 'border-green-500/50 bg-green-500/5 shadow-lg shadow-green-500/10'
      },
      rejected: {
        border: 'border-red-500/30',
        badge: 'bg-red-500/20 text-red-400 border-red-500/30',
        glow: 'shadow-red-500/10',
        dropGlow: 'border-red-500/50 bg-red-500/5 shadow-lg shadow-red-500/10'
      }
    };
    return styles[stage as keyof typeof styles] || {
      border: 'border-gray-500/30',
      badge: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
      glow: 'shadow-gray-500/10',
      dropGlow: 'border-gray-500/50 bg-gray-500/5 shadow-lg shadow-gray-500/10'
    };
  };
  
  const stageStyles = getStageStyles(stage);
  
  return (
    <div 
      ref={setNodeRef}
      className={`
        rounded-xl bg-white/[0.02] backdrop-blur-2xl border p-4 w-72 flex-shrink-0 
        transition-all duration-300 shadow-lg
        ${isOver ? stageStyles.dropGlow : `${stageStyles.border} ${stageStyles.glow}`}
      `}
    >
      <h3 className="font-semibold text-md text-white mb-4 capitalize flex justify-between items-center">
        <span className={`
          px-2.5 py-1 rounded-md text-sm font-medium border backdrop-blur-sm
          ${stageStyles.badge}
        `}>
          {stage}
        </span>
        <span className="text-xs bg-white/10 backdrop-blur-sm text-gray-300 rounded-full px-2.5 py-1 border border-white/10">
          {candidates.length}
        </span>
      </h3>

      <div className={`
        space-y-3 min-h-[120px] rounded-lg p-2 
        transition-all duration-300
        ${isOver ? 'bg-white/[0.05]' : 'bg-white/[0.01]'}
      `}>
        {candidates.map(candidate => (
          <DndCandidateCard key={candidate.id} candidate={candidate} />
        ))}
        {candidates.length === 0 && (
          <div className={`
            text-center text-sm py-8 rounded-lg border-2 border-dashed
            transition-all duration-300
            ${isOver 
              ? `${stageStyles.border} ${stageStyles.badge}` 
              : 'border-white/10 text-gray-500'
            }
          `}>
            {isOver ? 'Release to drop' : 'Drop candidates here'}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;