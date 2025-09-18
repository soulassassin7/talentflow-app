import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Job } from '../types';
import { PencilSquareIcon, ArchiveBoxIcon, ArrowUturnDownIcon, TrashIcon } from '@heroicons/react/24/outline';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onArchive: (job: Job) => void;
  onDelete: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onArchive, onDelete }) => {
  const navigate = useNavigate();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(job);
  };

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive(job);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(job);
  };

  const handleCardClick = () => {
    navigate(`/jobs/${job.slug}`);
  };

  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      onClick={handleCardClick}
      className="
        group relative rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-6 
        hover:bg-white/[0.05] transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 
        hover:border-emerald-500/20 flex flex-col justify-between h-full cursor-pointer
        hover:scale-[1.02] active:scale-[0.98]
      "
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-lg text-white pr-2 line-clamp-2">{job.title}</h3>
          <span className={`
            px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 backdrop-blur-sm border
            ${job.status === 'active' 
              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }
          `}>
            {job.status}
          </span>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 mb-4">
          {job.tags.map(tag => (
            <span 
              key={tag} 
              className="px-2.5 py-1 text-xs font-medium bg-white/[0.05] backdrop-blur-2xl text-gray-300 rounded-md border border-white/10 hover:border-emerald-500/30 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* MODIFIED: Added a div for the "Posted on" date */}
        <div className="flex justify-between items-center pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
            Posted on {formattedDate}
          </p>

          <div className="flex justify-end gap-2">
            <button 
              onClick={handleEditClick} 
              title="Edit Job" 
              className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all duration-200"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={handleArchiveClick} 
              title={job.status === 'active' ? 'Archive Job' : 'Restore Job'} 
              className="p-2 rounded-lg text-gray-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all duration-200"
            >
              {job.status === 'active' ? <ArchiveBoxIcon className="h-5 w-5" /> : <ArrowUturnDownIcon className="h-5 w-5" />}
            </button>
            <button 
              onClick={handleDeleteClick} 
              title="Delete Job" 
              className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
    </div>
  );
};


export default JobCard;