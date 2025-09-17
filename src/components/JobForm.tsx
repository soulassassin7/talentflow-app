import React, {useEffect} from 'react';
import  {useForm, type SubmitHandler} from 'react-hook-form';
import type {Job} from '../types';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type FormValues = {
    title: string;
    slug: string;
    tags: string;
    summary: string;
}

interface JobFormProps{
    onSubmit: SubmitHandler<FormValues>;
    onCancel: ()=> void;
    job?:Job | null;
    isSubmitting: boolean;
}

const JobForm: React.FC<JobFormProps> = ({onSubmit,onCancel,job,isSubmitting})=>{
    const { register, handleSubmit, formState:{errors},reset} = useForm<FormValues>();
    
    useEffect(()=>{
        if(job){
            reset({
                title: job.title,
                slug: job.slug,
                tags: job.tags.join(', '),
                summary: job.summary,
            });
        } else{
            reset({title:'',slug:'',tags:'',summary:''});
        }
    },[job,reset]);
    
    return(
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div>
                <Label htmlFor='title' className='block text-sm font-medium text-gray-400 mb-2'>
                    Title
                </Label>
                <Input 
                    id='title' 
                    {...register('title',{required:'Title is required'})}
                    className='bg-white/[0.03] backdrop-blur-xl border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20'
                />
                {errors.title && <p className='mt-1 text-sm text-red-400'>{errors.title.message}</p>}
            </div>

            <div>
                <input type='hidden' {...register('slug')}/>
                <div>
                    <Label htmlFor="summary" className="block text-sm font-medium text-gray-400 mb-2">
                        Job Summary
                    </Label>
                    <textarea
                        id="summary"
                        {...register('summary', { required: 'A summary is required.' })}
                        rows={4}
                        className="mt-1 block w-full bg-white/[0.03] backdrop-blur-xl border border-white/10 text-white placeholder:text-gray-500 rounded-md px-3 py-2 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 resize-none"
                        placeholder="Enter a brief description of the job..."
                    />
                    {errors.summary && <p className="mt-1 text-sm text-red-400">{errors.summary.message}</p>}
                </div>
            </div>

            <div>
                <Label htmlFor="tags" className="block text-sm font-medium text-gray-400 mb-2">
                    Tags (comma-separated)
                </Label>
                <Input
                    id="tags"
                    {...register('tags')}
                    placeholder="e.g., frontend, react, typescript"
                    className="bg-white/[0.03] backdrop-blur-xl border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
                />
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
                    {isSubmitting ? 'Saving...' : job ? 'Update Job' : 'Create Job'}
                </Button>
            </div>
        </form>
    );
};

export default JobForm;