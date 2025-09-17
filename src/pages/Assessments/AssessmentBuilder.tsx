
import React, { useEffect, useCallback,useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useJob } from '../../hooks/useJob';
import { ArrowLeftIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { nanoid } from 'nanoid';
import type { Assessment } from '../../types';
import QuestionBuilder from './QuestionBuilder';
import AssessmentPreview from './AssessmentPreview';
import FeedbackPopup from '../../components/ui/FeedbackPopup';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AssessmentBuilderPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: job, isLoading, isError } = useJob({ slug });
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const methods = useForm<Assessment>({
    defaultValues: { jobId: job?.id, title: '', sections: [] }
  });
  const { control, handleSubmit, getValues, reset } = methods;
  
  const storageKey = `assessment-${job?.id}`;
  
  useEffect(() => {
    const savedStateJSON = localStorage.getItem(storageKey);
    if (savedStateJSON) {
      try {
        const savedState = JSON.parse(savedStateJSON);
        reset(savedState);
      } catch (e) {
        console.error("Failed to parse saved assessment state", e);
      }
    } else if (job) {
      reset({ jobId: job.id, title: `${job.title} Assessment`, sections: [] });
    }
  }, [job, reset, storageKey]);

  const saveStateToLocalStorage = useCallback(() => {
    if (job?.id) {
        const currentState = getValues();
        localStorage.setItem(storageKey, JSON.stringify(currentState));
    }
  }, [job, getValues, storageKey]);

  useEffect(() => {
    return () => {
      saveStateToLocalStorage();
    };
  }, [saveStateToLocalStorage]);

  const { fields: sectionFields, append: appendSection, remove: removeSection } = useFieldArray({
    control,
    name: "sections"
  });

  const triggerFeedback = (message: string) => {
    setFeedbackMessage(message);
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 2000);
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
  
  if (isError || !job) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="rounded-2xl bg-red-500/10 backdrop-blur-xl border border-red-500/20 p-8">
        <p className="text-red-400">Error: Job not found.</p>
      </div>
    </div>
  );

  const onSubmit = (data: Assessment) => {
    console.log("Form Submitted:", data);
    localStorage.setItem(storageKey, JSON.stringify(data));
    triggerFeedback('Assessment saved successfully!');
  };

  return (
    <>
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link 
          to={`/jobs/${slug}`} 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-emerald-400 transition-colors group"
        >
          <ArrowLeftIcon className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to {job.title}
        </Link>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Assessment Builder</h1>
            <p className="mt-1 text-md text-gray-400">For: {job.title}</p>
          </div>
          <Button 
            type="submit" 
            className="bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-105"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Assessment
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="shadow-sm bg-white/[0.02] backdrop-blur-2xl border border-white/10">
            <CardContent className="p-6 space-y-6">
              <Input
                {...methods.register('title')}
                placeholder="Assessment Title"
                className="text-lg font-semibold bg-white/[0.03] backdrop-blur-xl border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
              />
              
              {sectionFields.map((section, sectionIndex) => (
                <div key={section.id} className="p-4 rounded-xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 space-y-4">
                  <div className="flex justify-between items-center gap-2">
                    <Input
                      {...methods.register(`sections.${sectionIndex}.title`)}
                      placeholder="Section Title"
                      className="font-medium bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeSection(sectionIndex)} 
                      className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <QuestionBuilder sectionIndex={sectionIndex} />
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => appendSection({ id: nanoid(), title: '', questions: [] })}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all"
              >
                <PlusIcon className="h-5 w-5" />
                Add Section
              </button>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Preview
              </h2>
              <div className="rounded-lg bg-white/[0.02] border border-white/10 p-4">
                <AssessmentPreview />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </FormProvider>
    <FeedbackPopup message={feedbackMessage} show={showFeedback} />
    </>
  );
};

export default AssessmentBuilderPage;