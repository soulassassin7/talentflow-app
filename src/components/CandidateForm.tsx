import React, { useEffect } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import type { Candidate, Job } from '../types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FormValues = {
    name: string;
    email: string;
    profile: string;
    jobId?: string; // This can now be part of the form
};

interface CandidateFormProps {
    onSubmit: SubmitHandler<FormValues>;
    onCancel: () => void;
    isSubmitting: boolean;
    // MODIFIED: Add new optional props
    jobs?: Job[];
    showJobSelector?: boolean;
}

const CandidateForm: React.FC<CandidateFormProps> = ({ onSubmit, onCancel, isSubmitting, jobs = [], showJobSelector = false }) => {
    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<FormValues>();

    useEffect(() => {
        reset({ name: '', email: '', profile: '', jobId: undefined });
    }, [reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* MODIFIED: Conditionally render the job selector */}
            {showJobSelector && (
                <div>
                    <Label htmlFor='jobId' className='block text-sm font-medium text-gray-400 mb-2'>
                        Apply For Job
                    </Label>
                    <Controller
                        name="jobId"
                        control={control}
                        rules={{ required: "A job must be selected." }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger className="bg-white/[0.03] backdrop-blur-xl border-white/10 text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 [&>span]:text-white">
                                    <SelectValue placeholder="Select a job..." />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0f1629]/50 backdrop-blur-2xl border-white/10 shadow-xl">
                                    {jobs.map(job => (
                                        <SelectItem 
                                            key={job.id} 
                                            value={job.id}
                                            className="text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-400 transition-colors"
                                        >
                                            {job.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.jobId && <p className='mt-1 text-sm text-red-400'>{errors.jobId.message}</p>}
                </div>
            )}

            <div>
                <Label htmlFor='name' className='block text-sm font-medium text-gray-400 mb-2'>
                    Full Name
                </Label>
                <Input
                    id='name'
                    {...register('name', { required: 'Name is required' })}
                    className='bg-white/[0.03] backdrop-blur-xl border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20'
                    placeholder="e.g., Jane Doe"
                />
                {errors.name && <p className='mt-1 text-sm text-red-400'>{errors.name.message}</p>}
            </div>

            <div>
                <Label htmlFor='email' className='block text-sm font-medium text-gray-400 mb-2'>
                    Email Address
                </Label>
                <Input
                    id='email'
                    type='email'
                    {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                        }
                    })}
                    className='bg-white/[0.03] backdrop-blur-xl border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20'
                    placeholder="e.g., jane.doe@example.com"
                />
                {errors.email && <p className='mt-1 text-sm text-red-400'>{errors.email.message}</p>}
            </div>

            <div>
                <Label htmlFor="profile" className="block text-sm font-medium text-gray-400 mb-2">
                    Candidate Profile / Summary
                </Label>
                <textarea
                    id="profile"
                    {...register('profile', { required: 'A short profile summary is required.' })}
                    rows={4}
                    className="mt-1 block w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 text-white placeholder:text-gray-500 rounded-md px-3 py-2 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 resize-none"
                    placeholder="Enter a brief summary of the candidate's skills and experience..."
                />
                {errors.profile && <p className="mt-1 text-sm text-red-400">{errors.profile.message}</p>}
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                <Button
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/30"
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 disabled:bg-emerald-500/50 disabled:shadow-none"
                >
                    {isSubmitting ? 'Adding...' : 'Add Candidate'}
                </Button>
            </div>
        </form>
    );
};

export default CandidateForm;