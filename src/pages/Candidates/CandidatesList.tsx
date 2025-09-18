import React, { useRef, useState, useMemo } from 'react';
import { useCandidates } from '../../hooks/useCandidates';
import type { Candidate, Job, Stage } from '../../types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useJobs } from '../../hooks/useJobs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { candidatesService } from '../../services/candidatesService';
import Modal from '../../components/ui/Modal';
import CandidateForm from '../../components/CandidateForm';
import { type SubmitHandler } from 'react-hook-form';
import FeedbackPopup from '../../components/ui/FeedbackPopup';

const STAGES: Stage[] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

type CandidateFormValues = {
  name: string;
  email: string;
  profile: string;
  jobId?: string;
};

const CandidatesListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

  const { data, isLoading, isError, error } = useCandidates({ 
    pageSize: 10000,
    stage: stageFilter
  });
  
  const { data: jobsData } = useJobs({ status: 'active', pageSize: 1000 });
  const activeJobs = jobsData?.items || [];

  const createCandidateMutation = useMutation({
    mutationFn: (newCandidate: Partial<Candidate>) => candidatesService.create(newCandidate),
    onSuccess: () => {
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      triggerFeedback('Candidate added successfully!', 'success');
    },
    onError: (err) => {
      setIsModalOpen(false);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      triggerFeedback(`Error: ${errorMessage}`, 'error', 4000);
    }
  });

  const handleCreateSubmit: SubmitHandler<CandidateFormValues> = (data) => {
    createCandidateMutation.mutate(data);
  };

  const triggerFeedback = (message: string, type: 'success' | 'error' = 'success', duration = 3000) => {
    setFeedbackMessage(message);
    setFeedbackType(type);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), duration);
  };

  const filteredCandidates = useMemo(() => {
    if (!data?.items) return [];
    if (!search) return data.items;
    return data.items.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredCandidates.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 72,
    overscan: 5,
  });

  const renderContent = () => {
    if (isLoading) return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Loading candidates...</p>
        </div>
      </div>
    );
    
    if (isError) return (
      <div className="rounded-xl bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-8 text-center">
        <p className="text-red-400">Error: {error.message}</p>
      </div>
    );
    
    if (!data || filteredCandidates.length === 0) {
      return (
        <div className="text-center p-12">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-gray-400">No candidates found for the current filters.</p>
        </div>
      );
    }

    return (
      <div 
        ref={parentRef} 
        className="h-[600px] overflow-auto rounded-xl border border-white/10 bg-white/[0.01] backdrop-blur-sm custom-scrollbar"
      >
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
          {rowVirtualizer.getVirtualItems().map(virtualItem => {
            const candidate = filteredCandidates[virtualItem.index];
            const stageColors = {
              applied: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
              screen: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
              tech: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
              offer: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
              hired: 'bg-green-500/20 text-green-400 border-green-500/30',
              rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
            };
            
            return (
              <Link
                key={candidate.id}
                to={`/candidates/${candidate.id}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start}px)`,
                }}
                className="group p-4 border-b border-white/5 flex justify-between items-center hover:bg-white/[0.03] transition-all duration-200"
              >
                <div>
                  <p className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                    {candidate.name}
                  </p>
                  <p className="text-sm text-gray-400">{candidate.email}</p>
                </div>
                <span className={`
                  text-xs capitalize px-3 py-1.5 rounded-full border backdrop-blur-sm
                  ${stageColors[candidate.stage as keyof typeof stageColors]}
                `}>
                  {candidate.stage}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Candidates</h1>
          <p className="text-sm text-gray-400">
            Manage and track your candidate pipeline
          </p>
        </div>

        <Card className="shadow-sm bg-white/[0.02] backdrop-blur-2xl border border-white/10">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Search (Name/Email)
                </Label>
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="e.g., Jane Doe"
                    className="pl-10 h-11 bg-white/[0.03] backdrop-blur-2xl border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stageFilter" className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Filter by Stage
                </Label>
                <Select 
                  value={stageFilter || 'all'} 
                  onValueChange={(value) => setStageFilter(value === 'all' ? '' : value)}
                >
                  <SelectTrigger 
                    id="stageFilter"
                    className="h-11 bg-white/[0.03] backdrop-blur-2xl border-white/10 text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 capitalize [&>span]:text-white"
                  >
                    <SelectValue placeholder="All Stages" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f1629]/50 backdrop-blur-2xl border-white/10 shadow-xl">
                    <SelectItem value="all" className="text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-400 transition-colors">
                      All Stages
                    </SelectItem>
                    {STAGES.map(s => (
                      <SelectItem 
                        key={s} 
                        value={s} 
                        className="text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-400 transition-colors capitalize"
                      >
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

    
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {data && (
                  <span>Showing {filteredCandidates.length} of {data.items.length} candidates</span>
                )}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-105 rounded-lg"
              >
                <UserPlusIcon className="h-5 w-5" />
                Add Candidate
              </button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10">
          <CardContent className="p-6">
            {renderContent()}
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Candidate">
        <CandidateForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={createCandidateMutation.isPending}
          jobs={activeJobs}
          showJobSelector={true}
        />
      </Modal>
      <FeedbackPopup message={feedbackMessage} show={showFeedback} type={feedbackType} />
    </>
  );
};

export default CandidatesListPage;