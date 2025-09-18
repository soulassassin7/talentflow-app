import React, { useMemo, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import {  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { nanoid } from 'nanoid';

import { useJobs } from '../../hooks/useJobs';
import { jobsService } from '../../services/jobsService';
import type { JobsResponse, Job } from '../../types';

import DndJobCard from '../../components/DndJobCard';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import Modal from '../../components/ui/Modal';
import JobForm from '../../components/JobForm';
import { type SubmitHandler } from 'react-hook-form';
import FeedbackPopup from '../../components/ui/FeedbackPopup';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue} from "@/components/ui/select";
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';


function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
    let timeout: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<F>): void => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), waitFor);
    };
}

type FormValues = {
  title: string;
  slug: string;
  tags: string;
  summary: string;
};

const generateSlug = (title: string): string => {
    return title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

const JobsListPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeId, setActiveId,] = useState<string | null>(null);
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = Number(searchParams.get('pageSize')) || 9;
    const status = searchParams.has('status') ? searchParams.get('status') || '' : 'active';
    const search = searchParams.get('search') || '';

    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [feedbackType, setFeedbackType] = useState<'success' | 'error' | 'info' | 'warning'>('success');


    const triggerFeedback = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
        setFeedbackMessage(message);
        setFeedbackType(type);
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 2000);
    };


    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingJob, setEditingJob] = useState<Job | null>(null);

    const params = useMemo(() => ({ page, pageSize, search, status }), [page, pageSize, search, status]);
    const { data, isLoading, isError, error } = useJobs(params);
    const queryKey = ['jobs', params];

const reorderMutation = useMutation({
    mutationFn: ({ id, fromOrder, toOrder }: { id: string; fromOrder: number; toOrder: number }) =>
        jobsService.reorder(id, { fromOrder, toOrder }),
    onMutate: async (variables) => {
        await queryClient.cancelQueries({ queryKey });
        const previousJobs = queryClient.getQueryData<JobsResponse>(queryKey);
        if (previousJobs) {
            const oldIndex = previousJobs.items.findIndex(job => job.id === variables.id);
            const newIndex = previousJobs.items.findIndex(job => job.order === variables.toOrder);
            if (oldIndex > -1 && newIndex > -1) {
                const newItems = arrayMove(previousJobs.items, oldIndex, newIndex);
                queryClient.setQueryData<JobsResponse>(queryKey, { ...previousJobs, items: newItems });
            }
        }
        return { previousJobs };
    },
    onSuccess: () => {
        triggerFeedback('Jobs reordered successfully!', 'success');
    },
    onError: (err, _variables, context) => {
        console.error('Reorder failed, rolling back.', err);
        if (context?.previousJobs) {
            queryClient.setQueryData(queryKey, context.previousJobs);
        }
        triggerFeedback('Reordering Failed', 'error');
    },
    onSettled: () => {
        queryClient.invalidateQueries({ queryKey });
    },
});


    const upsertJobMutation = useMutation({
        mutationFn: (job: Partial<Job>) => {
            if (editingJob) {
                return jobsService.patch(editingJob.id, job);
            }
            return jobsService.create(job);
        },
        onSuccess: (_data, variables) => {
            setIsModalOpen(false);
            setEditingJob(null);
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            const message = variables.createdAt ? 'Job created successfully!' : 'Job updated successfully!';
            triggerFeedback(message, 'success');
        },
        onError: (error) => {
            console.error("Failed to save job:", error);
            
            setIsModalOpen(false);
            setEditingJob(null);
            
            const message = editingJob ? 'Failed to update job' : 'Failed to create job';
            triggerFeedback(message, 'error');
        }
    });

    const archiveJobMutation = useMutation({
        mutationFn: ({ job, newStatus }: { job: Job, newStatus: 'archived' | 'active' }) => {
            return jobsService.patch(job.id, { status: newStatus });
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            const message = variables.newStatus === 'archived' ? 'Job archived.' : 'Job restored.';
            triggerFeedback(message, 'success');
        },
        onError: (error, variables) => {
            console.error("Failed to archive job:", error);
            const action = variables.newStatus === 'archived' ? 'archive' : 'restore';
            triggerFeedback(`Failed to ${action} job`, 'error');
        }
    });

    const deleteJobMutation = useMutation({
        mutationFn: (jobId: string) => jobsService.delete(jobId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['jobs'] });
            triggerFeedback('Job deleted successfully!', 'success');
        },
        onError: (error) => {
            console.error("Failed to delete job:", error);
            triggerFeedback('Failed to delete job', 'error');
        }
    });

    const handleDeleteJob = (job: Job) => {
            deleteJobMutation.mutate(job.id);
    };

    const handleUpdateParams = (newParams: Record<string, string | number>) => {
        setSearchParams(prev => {
            Object.entries(newParams).forEach(([key, value]) => {
                prev.set(key, String(value));
            });
            return prev;
        });
    };

        const handleStatusChange = (value: string) => {
    handleUpdateParams({ status: value === 'all' ? '' : value, page: 1 });
};

    const handlePageSizeChange = (value: string) => {
        handleUpdateParams({ pageSize: value, page: 1 });
    };

    const debouncedSearch = useCallback(debounce((value: string) => {
        handleUpdateParams({ search: value, page: 1 });
    }, 300), [setSearchParams]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value);
    };

    const handlePageChange = (newPage: number) => {
        handleUpdateParams({ page: newPage });
    };

    const handleOpenCreateModal = () => {
        setEditingJob(null);
        setIsModalOpen(true);
    };
    
    const handleOpenEditModal = (job: Job) => {
        setEditingJob(job);
        setIsModalOpen(true);
    };

    const handleArchiveJob = (job: Job) => {
    const newStatus = job.status === 'active' ? 'archived' : 'active';
    archiveJobMutation.mutate({ job, newStatus });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingJob(null);
    };

    const handleFormSubmit: SubmitHandler<FormValues> = (formData) => {
        const allJobs = queryClient.getQueryData<JobsResponse>(['jobs', { page: 1, pageSize: 1000, search: '', status: '' }])?.items || data?.items || [];
        let newSlug = formData.slug || generateSlug(formData.title);

        if (!editingJob) {
            const existingSlugs = new Set(allJobs.map(job => job.slug));
            let counter = 1;
            let finalSlug = newSlug;
            while (existingSlugs.has(finalSlug)) {
                counter++;
                finalSlug = `${newSlug}-${counter}`;
            }
            newSlug = finalSlug;
        }
        
        const jobData: Partial<Job> = {
            
            title: formData.title,
            slug: newSlug,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
            summary: formData.summary,
        };

        if (!editingJob) {
            jobData.id = nanoid();
            jobData.status = 'active';
            jobData.createdAt = Date.now();
        }
        
        upsertJobMutation.mutate(jobData);
    };

    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 10 } }));
    

    
    const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null); 
    
    if (over && active.id !== over.id && data) {
        const oldIndex = data.items.findIndex((job) => job.id === active.id);
        const newIndex = data.items.findIndex((job) => job.id === over.id);
        const jobToMove = data.items[oldIndex];
        const targetJob = data.items[newIndex];
        reorderMutation.mutate({ 
            id: jobToMove.id, 
            fromOrder: jobToMove.order, 
            toOrder: targetJob.order 
        });
    }
};


    const renderContent = () => {
    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-sm text-gray-400">Loading jobs...</p>
            </div>
        </div>
    );
    
    if (isError) return (
        <div className="rounded-2xl bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-12">
            <p className="text-red-400 text-center">Error: {error.message}</p>
        </div>
    );
    
    if (!data || data.items.length === 0) return (
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-16 text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No jobs yet</h3>
            <p className="text-gray-400 mb-6">Get started by creating your first job posting.</p>
            <Button 
                onClick={handleOpenCreateModal}
                className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-105"
            >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Job
            </Button>
        </div>
    );

    return (
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
        >
            <SortableContext 
                items={data.items.map(j => j.id)} 
                strategy={rectSortingStrategy}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.items.map((job: Job) => (
                        <DndJobCard
                            key={job.id}
                            job={job}
                            onEdit={handleOpenEditModal}
                            onArchive={handleArchiveJob}
                            onDelete={handleDeleteJob}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
};

    const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

   return (
    <>
    <div className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Jobs</h1>
                <p className="text-sm text-gray-400">
                    Manage and organize your job postings
                </p>
            </div>

            <div className="mb-8 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-6 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="lg:col-span-2 space-y-2">
                        <Label htmlFor="search" className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Search
                        </Label>
                        <div className="relative">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input 
                                type="text" 
                                id="search" 
                                placeholder="Search by title or tags..."
                                defaultValue={search}
                                onChange={handleSearchChange}
                                className="pl-10 h-11 bg-white/[0.03] backdrop-blur-2xl border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="status" className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                        </Label>
                        <Select value={status || 'all'} onValueChange={handleStatusChange}>
                            <SelectTrigger 
                                id="status" 
                                className="h-11 bg-white/[0.03] backdrop-blur-2xl border-white/10 text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 [&>span]:text-white"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0f1629]/50 backdrop-blur-2xl border-white/10 shadow-xl">
                                <SelectItem value="all" className="text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-400 transition-colors">All Jobs</SelectItem>
                                <SelectItem value="active" className="text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-400 transition-colors">Active</SelectItem>
                                <SelectItem value="archived" className="text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-400 transition-colors">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="pageSize" className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Per Page
                        </Label>
                        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
                            <SelectTrigger 
                                id="pageSize" 
                                className="h-11 bg-white/[0.03] backdrop-blur-2xl border-white/10 text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 [&>span]:text-white"
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0f1629]/50 backdrop-blur-2xl border-white/10 shadow-xl">
                                <SelectItem value="9" className="text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-400 transition-colors">9</SelectItem>
                                <SelectItem value="18" className="text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-400 transition-colors">18</SelectItem>
                                <SelectItem value="27" className="text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-400 transition-colors">27</SelectItem>
                                <SelectItem value="30" className="text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-400 transition-colors">30</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/10 flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                        {data && (
                            <span>{data.total} {data.total === 1 ? 'job' : 'jobs'} found</span>
                        )}
                    </div>
                    <Button 
                        onClick={handleOpenCreateModal}
                        className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-105"
                    >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Create Job
                    </Button>
                </div>
            </div>
            
            <div className="mb-8">
                {renderContent()}
            </div>
            
            {data && data.total > pageSize && (
                <div className="rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-4 shadow-xl">
                    <div className="flex items-center justify-between">
                        <Button 
                            onClick={() => handlePageChange(page - 1)} 
                            disabled={page === 1}
                            variant="ghost"
                            className="text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30"
                        >
                            <ChevronLeftIcon className="h-4 w-4 mr-1" />
                            Previous
                        </Button>
                        
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Page</span>
                            <span className="font-semibold text-white">{page}</span>
                            <span className="text-gray-400">of</span>
                            <span className="font-semibold text-white">{totalPages}</span>
                        </div>
                        
                        <Button 
                            onClick={() => handlePageChange(page + 1)} 
                            disabled={page === totalPages}
                            variant="ghost"
                            className="text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-30"
                        >
                            Next
                            <ChevronRightIcon className="h-4 w-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingJob ? 'Edit Job' : 'Create New Job'}>
                <JobForm onSubmit={handleFormSubmit} onCancel={handleCloseModal} job={editingJob} isSubmitting={upsertJobMutation.isPending} />
            </Modal>
        </div>
    </div>
    <FeedbackPopup 
    message={feedbackMessage} 
    show={showFeedback} 
    type={feedbackType} 
/>
    </>
);
};
export default JobsListPage;