import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { useCandidate } from '../../hooks/useCandidate';
import { useJob } from '../../hooks/useJob';
import NoteForm from '../../components/NoteForm';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { candidatesService } from '../../services/candidatesService';

const CandidateProfilePage: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const queryClient = useQueryClient();
  
  const { data: candidate, isLoading, isError, error } = useCandidate(candidateId);
  const { data: job } = useJob({ id: candidate?.jobId });
  
  const [isAddingNote, setIsAddingNote] = useState(false);

  const addNoteMutation = useMutation({
    mutationFn: (note: string) => {
      const noteEntry = {
        stage: candidate!.stage,
        note: note,
        addNoteOnly: true 
      };
      return candidatesService.patch(candidateId!, noteEntry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidate', candidateId] });
      setIsAddingNote(false);
    }
  });

  const handleAddNote = (noteContent: string) => {
    if (noteContent.trim() && candidateId) {
      setIsAddingNote(true);
      addNoteMutation.mutate(noteContent);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Loading candidate profile...</p>
        </div>
      </div>
    );
  }

  if (isError || !candidate) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="rounded-2xl bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-8">
          <p className="text-red-400">Error: {error?.message || 'Candidate not found.'}</p>
        </div>
      </div>
    );
  }

  const NoteWithMentions = ({ text }: { text: string }) => {
    const parts = text.split(/(@\w+)/g);
    return (
      <p className='text-sm text-gray-300 bg-white/[0.03] backdrop-blur-sm p-3 rounded-lg border border-white/10'>
        {parts.map((part, index) =>
          part.startsWith('@') ? 
            <strong key={index} className='font-semibold text-emerald-400'>{part}</strong>
            : <span key={index}>{part}</span>
        )}
      </p>
    );
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link 
        to="/candidates" 
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-emerald-400 transition-colors group"
      >
        <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to All Candidates
      </Link>

      <div className="rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-6 shadow-xl">
        <h1 className="text-2xl font-bold text-white">{candidate.name}</h1>
        <p className="text-md text-gray-400">{candidate.email}</p>
        <p className="mt-4 text-sm text-gray-300 border-l-4 border-emerald-500/30 pl-4">
          {candidate.profile}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6V5a2 2 0 012-2h4a2 2 0 012 2v1h3a1 1 0 011 1v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a1 1 0 011-1h3zm2 0h4V5H8v1z" />
            </svg>
            <span className="text-gray-400">
              Applied for:{' '}
              {job ? (
                <Link 
                  to={`/jobs/${job.slug}`}
                  className="text-white font-semibold hover:text-emerald-400 transition-colors"
                >
                  {job.title}
                </Link>
              ) : (
                <span className="text-white font-semibold">...</span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-400">Current Stage:</span>
            <span className={`
              capitalize px-3 py-1 rounded-full border backdrop-blur-sm text-sm
              ${getStageColor(candidate.stage)}
            `}>
              {candidate.stage}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-6">History & Comments</h2>
        <div className="flow-root">
          <ul className="-mb-8">
            {candidate.timeline && candidate.timeline.length > 0 ? (
              candidate.timeline.map((event, eventIdx) => (
                <li key={event.timestamp}>
                  <div className="relative pb-8">
                    {eventIdx !== candidate.timeline.length - 1 && (
                      <span 
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-white/10" 
                        aria-hidden="true" 
                      />
                    )}
                    <div className="relative flex space-x-3 items-start">
                      <div>
                        <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-[#050510] ${
                          event.from === event.to ? 'bg-gray-500/20' : 'bg-emerald-500/20'
                        }`}>
                          {event.from === event.to ? (
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                          ) : (
                            <ArrowRightIcon className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                          )}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1 pt-1.5">
                        <div className="flex justify-between items-center flex-wrap">
                          <p className="text-sm text-gray-300">
                            {event.from === event.to ? (
                              <span>Added a note</span>
                            ) : (
                              <>
                                Moved from <strong className="font-semibold capitalize text-white">{event.from}</strong> to <strong className="font-semibold capitalize text-white">{event.to}</strong>
                              </>
                            )}
                          </p>
                          <p className="mt-1 text-xs text-gray-500 whitespace-nowrap">
                            {new Date(event.timestamp).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        {event.note && (
                          <div className="mt-2 pl-7">
                            <NoteWithMentions text={event.note} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-gray-400">No history recorded for this candidate.</p>
              </div>
            )}
          </ul>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10">
          <NoteForm
            onSubmit={(data) => handleAddNote(data.note)}
            onCancel={() => {}}
            isSubmitting={isAddingNote || addNoteMutation.isPending}
            label="Add a note (e.g., @hr review candidate background)"
            submitButtonText="Add Note"
            showCancelButton={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateProfilePage;