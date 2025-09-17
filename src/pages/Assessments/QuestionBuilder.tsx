import React from 'react';
import { useFormContext, useFieldArray, useWatch } from 'react-hook-form';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import { nanoid } from 'nanoid';
import type { Assessment, Question, QuestionType } from '../../types';
import OptionsBuilder from './OptionsBuilder';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const QUESTION_TYPES: { value: QuestionType, label: string }[] = [
    { value: 'short-text', label: 'Short Text' },
    { value: 'long-text', label: 'Long Text' },
    { value: 'single-choice', label: 'Single Choice' },
    { value: 'multi-choice', label: 'Multiple Choice' },
    { value: 'numeric', label: 'Numeric' },
];

const SingleQuestionEditor: React.FC<{ sectionIndex: number; questionIndex: number; remove: () => void; }> = React.memo(({ sectionIndex, questionIndex, remove }) => {
    const { control, register, setValue } = useFormContext<Assessment>();

    const questionType = useWatch({ control, name: `sections.${sectionIndex}.questions.${questionIndex}.type` });
    const allSections = useWatch({ control, name: 'sections' }) || [];
    const currentQuestionId = useWatch({ control, name: `sections.${sectionIndex}.questions.${questionIndex}.id` });

    const availableQuestionsForCondition: Question[] = [];
    for (let sIdx = 0; sIdx < allSections.length; sIdx++) {
        const section = allSections[sIdx];
        if (sIdx < sectionIndex) {
            availableQuestionsForCondition.push(...(section.questions || []));
        } else if (sIdx === sectionIndex) {
            availableQuestionsForCondition.push(...(section.questions || []).slice(0, questionIndex));
        }
    }

    return (
        <div className="p-4 bg-white/[0.02] backdrop-blur-xl rounded-lg border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
                <Input 
                    {...register(`sections.${sectionIndex}.questions.${questionIndex}.label`)} 
                    placeholder="Question Label" 
                    className="flex-grow bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20" 
                />
                <Select 
                    value={questionType} 
                    onValueChange={(value) => setValue(`sections.${sectionIndex}.questions.${questionIndex}.type`, value as QuestionType)}
                    >
                    <SelectTrigger className="backdrop-blur-2xl border-white/10 text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 [&>span]:text-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0f1629]/50 backdrop-blur-2xl border-white/10 shadow-xl">
                        {QUESTION_TYPES.map(type => (
                        <SelectItem 
                            key={type.value} 
                            value={type.value}
                            className="text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 focus:bg-emerald-500/20 focus:text-emerald-400 transition-colors"
                        >
                            {type.label}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <button 
                    type="button" 
                    onClick={remove} 
                    className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
            
            {(questionType === 'single-choice' || questionType === 'multi-choice') && <OptionsBuilder sectionIndex={sectionIndex} questionIndex={questionIndex} />}
            
            <div className="border-t border-white/10 pt-4 space-y-3">
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        id={`required-${currentQuestionId}`} 
                        {...register(`sections.${sectionIndex}.questions.${questionIndex}.required`)} 
                        className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500/20" 
                    />
                    <label htmlFor={`required-${currentQuestionId}`} className="text-sm font-medium text-gray-300">Required</label>
                </div>
                
                {questionType === 'numeric' && (
                    <div className="flex items-center gap-2 text-sm">
                        <label className="text-gray-400">Range:</label>
                        <Input 
                            type="number" 
                            {...register(`sections.${sectionIndex}.questions.${questionIndex}.min`, { valueAsNumber: true })} 
                            placeholder="Min" 
                            className="w-20 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600" 
                        />
                        <span className="text-gray-400">-</span>
                        <Input 
                            type="number" 
                            {...register(`sections.${sectionIndex}.questions.${questionIndex}.max`, { valueAsNumber: true })} 
                            placeholder="Max" 
                            className="w-20 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600" 
                        />
                    </div>
                )}
                
                <div className="text-sm space-y-2">
                    <label className="font-medium text-gray-300">Conditional Logic (Optional)</label>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gray-400">Show if question</span>
                        <select 
                            {...register(`sections.${sectionIndex}.questions.${questionIndex}.condition.questionId`)} 
                            className="bg-white/[0.03] border border-white/10 text-white rounded-md px-2 py-1 text-sm focus:border-emerald-400/50"
                        >
                            <option value="" className="bg-[#0f1629]">-</option>
                            {availableQuestionsForCondition.map(q => 
                                <option key={q.id} value={q.id} className="bg-[#0f1629]">{`"${q.label || 'Untitled'}"`}</option>
                            )}
                        </select>
                        <span className="text-gray-400">equals</span>
                        <Input 
                            type="text" 
                            {...register(`sections.${sectionIndex}.questions.${questionIndex}.condition.value`)} 
                            placeholder="e.g., Yes" 
                            className="w-24 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 text-sm py-1" 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});

const QuestionBuilder: React.FC<{ sectionIndex: number }> = ({ sectionIndex }) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control, name: `sections.${sectionIndex}.questions`
  });

  return (
    <div className="space-y-4 pl-6 border-l-2 border-emerald-500/20">
      {fields.map((field, index) => (
        <SingleQuestionEditor key={field.id} sectionIndex={sectionIndex} questionIndex={index} remove={() => remove(index)} />
      ))}
      <button
        type="button"
        onClick={() => append({ id: nanoid(), label: '', type: 'short-text', required: false, options: [] })}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium text-gray-400 bg-white/[0.02] border border-white/10 rounded-md hover:bg-white/[0.05] hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
      >
        <PlusIcon className="h-4 w-4" /> Add Question
      </button>
    </div>
  );
};

export default QuestionBuilder;