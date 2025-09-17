import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Candidate } from '../types';

interface CandidateCardProps {
  candidate: Candidate;
  isDragging?:boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/candidates/${candidate.id}`);
  };

  const getStageColor = (stage: string) => {
    const colors = {
      applied: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      screen: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      tech: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      offer: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      hired: 'bg-green-500/20 text-green-400 border-green-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        group relative rounded-lg bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-4 mb-3
        hover:bg-white/[0.05] transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 
        hover:border-emerald-500/20 cursor-pointer hover:scale-[1.02] active:scale-[0.98]
      "
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors">
            {candidate.name}
          </p>
          <p className="text-xs text-gray-400 mt-1">{candidate.email}</p>
        </div>

        <div className={`
          w-2 h-2 rounded-full mt-1.5
          ${candidate.stage === 'applied' && 'bg-blue-400'}
          ${candidate.stage === 'screen' && 'bg-purple-400'}
          ${candidate.stage === 'tech' && 'bg-orange-400'}
          ${candidate.stage === 'offer' && 'bg-emerald-400'}
          ${candidate.stage === 'hired' && 'bg-green-400'}
          ${candidate.stage === 'rejected' && 'bg-red-400'}
        `} />
      </div>

      {candidate.stage && (
        <div className="mt-2">
          <span className={`
            inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm border
            ${getStageColor(candidate.stage)}
          `}>
            {candidate.stage}
          </span>
        </div>
      )}
      
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
    </div>
  );
};

export default CandidateCard;