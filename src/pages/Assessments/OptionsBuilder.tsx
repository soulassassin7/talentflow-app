import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import { Input } from "@/components/ui/input";

interface OptionsBuilderProps {
  sectionIndex: number;
  questionIndex: number;
}

const OptionsBuilder: React.FC<OptionsBuilderProps> = ({ sectionIndex, questionIndex }) => {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `sections.${sectionIndex}.questions.${questionIndex}.options`
  });

  return (
    <div className="space-y-2 pl-4">
      <label className="text-sm font-medium text-gray-300">Options</label>
      {fields.map((option, optionIndex) => (
        <div key={option.id} className="flex items-center gap-2">
          <Input
            {...register(`sections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}.value`)}
            placeholder={`Option ${optionIndex + 1}`}
            className="flex-grow text-sm bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
          />
          <button 
            type="button" 
            onClick={() => remove(optionIndex)} 
            className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ value: '' })}
        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-md hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all"
      >
        <PlusIcon className="h-4 w-4" />
        Add Option
      </button>
    </div>
  );
};

export default OptionsBuilder;