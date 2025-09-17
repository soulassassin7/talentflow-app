
import React, {useState} from 'react';
import { useParams, useNavigate ,Link} from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { ArrowLeftIcon ,DocumentPlusIcon} from '@heroicons/react/24/solid';
import { useJob } from '../../hooks/useJob';
import { useCandidates } from '../../hooks/useCandidates';
import KanbanBoard from '../../components/KanbanBoard';
import { candidatesService } from '../../services/candidatesService';
import type { Stage } from '../../types';
import FeedbackPopup from '../../components/ui/FeedbackPopup';

const JobDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
 
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: job, isLoading: isLoadingJob, isError: isErrorJob } = useJob({slug});
  const { data: candidatesData, isLoading: isLoadingCandidates, isError: isErrorCandidates } = useCandidates({
    jobId: job?.id,
    pageSize: 1000,
    enabled: !!job?.id
  });

  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const triggerFeedback = (message: string, duration = 2000) => {
    setFeedbackMessage(message);
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
    }, duration);
  };

  const updateCandidateMutation = useMutation({
    mutationFn: (data: { candidateId: string; stage: Stage; note?: string }) =>
      candidatesService.patch(data.candidateId, { stage: data.stage, note: data.note }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['candidates', { jobId: job?.id }] });
      if (variables.note && variables.note.trim() !== '') {
        triggerFeedback('Note saved successfully!', 1000);
        setTimeout(() => {
          triggerFeedback('Candidate stage updated!!', 1000);
        }, 1500);
      } else {
        triggerFeedback('Candidate stage updated!',1000);
      }
    },
    onError: (error) => {
      console.error("Failed to update candidate, state will be refetched.", error);
      queryClient.invalidateQueries({ queryKey: ['candidates', { jobId: job?.id }] });
    }
  });
  
  const handleCandidateMove = (candidateId: string, newStage: Stage, note?: string) => {
    updateCandidateMutation.mutate({ candidateId, stage: newStage, note });
  };

  if (isLoadingJob) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-400">Loading job...</p>
      </div>
    </div>
  );
  
  if (isErrorJob || !job) return (
    <div className="rounded-2xl bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-12">
      <p className="text-red-400 text-center">Error: Job not found.</p>
    </div>
  );

  const JobHeader = () => (
  <div className="rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-6 shadow-xl">
    <div className="flex justify-between items-start">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-white">{job.title}</h1>
        <p className="mt-2 text-sm text-gray-400 max-w-2xl">{job.summary}</p>

        <div className="mt-4 flex items-center gap-3">
          {job.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 text-xs font-medium bg-white/[0.05] backdrop-blur-2xl text-gray-300 rounded-md border border-white/10 hover:border-emerald-500/30 transition-colors">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <span className={`
          px-3 py-1 text-sm font-semibold rounded-full backdrop-blur-sm border
          ${job.status === 'active' 
            ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
          }
        `}>
          {job.status}
        </span>
        
        <Link
          to={`/assessments/${job.slug}`}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-105 rounded-lg"
        >
          <DocumentPlusIcon className="h-5 w-5" />
          Build/Edit Assessment
        </Link>
      </div>
    </div>
  </div>
);

  return (
    <>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button 
        onClick={() => navigate(-1)} 
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-emerald-400 transition-colors group"
      >
        <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Jobs Board
      </button>
      
      <JobHeader />
      
      <div className="rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 shadow-xl">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-semibold text-white">Candidate Pipeline</h2>
          {(isLoadingCandidates || isErrorCandidates) ? (
            <p className="text-sm text-gray-400 mt-1">
              {isErrorCandidates ? 'Error loading candidates.' : 'Loading candidates...'}
            </p>
          ) : (
            <p className="text-sm text-gray-400 mt-1">{candidatesData?.total ?? 0} total candidates</p>
          )}
        </div>
        
        <div className="p-6">
          <KanbanBoard
            initialCandidates={candidatesData?.items || []}
            onCandidateMove={handleCandidateMove}
          />
        </div>
      </div>
    </div>
    <FeedbackPopup message={feedbackMessage} show={showFeedback} />
    </>
  );
};

export default JobDetailsPage;