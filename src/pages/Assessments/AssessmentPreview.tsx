import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import type { Assessment, Question, AssessmentSection } from '../../types';
import { Input } from "@/components/ui/input";


const PreviewInput: React.FC<{ question: Question, answer: any, onChange: (value: any) => void }> = ({ question, answer, onChange }) => {
    const { type, label, options = [], min, max } = question;
    
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onChange(e.target.files[0].name);
        } else {
            onChange('');
        }
    };
    
    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onChange(value); 

        if (value === '') {
            setError('');
            return;
        }

        const numValue = Number(value);
        if (isNaN(numValue)) {
            setError('Please enter a valid number.');
            return;
        }

        let outOfRange = false;
        if (min !== undefined && numValue < min) {
            setError(`Value must be ${min} or greater.`);
            outOfRange = true;
        } else if (max !== undefined && numValue > max) {
            setError(`Value must be ${max} or less.`);
            outOfRange = true;
        }

        if (!outOfRange) {
            setError('');
        }
    };
    
    switch (type) {
        case 'numeric':
            return (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                    <Input 
                        value={answer || ''} 
                        onChange={handleNumericChange}
                        type='number'
                        className={`
                            w-full bg-white/[0.03] border text-white placeholder:text-gray-500 
                            transition-colors duration-200
                            ${error 
                                ? 'border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20' 
                                : 'border-white/10 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20'
                            }
                        `} 
                    />
                    {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
                </div>
            );

        case 'short-text':
            return (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                    <Input 
                        value={answer || ''} 
                        onChange={(e) => onChange(e.target.value)} 
                        type='text' 
                        className="w-full bg-white/[0.03] border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20" 
                    />
                </div>
            );
            
        case 'long-text':
            return (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                    <textarea 
                        value={answer || ''} 
                        onChange={(e) => onChange(e.target.value)} 
                        rows={3} 
                        className="mt-1 w-full bg-white/[0.03] border border-white/10 text-white placeholder:text-gray-500 rounded-md px-3 py-2 focus:outline-none focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 resize-none" 
                    />
                </div>
            );
            
        case 'single-choice':
            return (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                    <div className="space-y-2">
                        {options.map((opt, i) => (
                            <div key={i} className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input 
                                        checked={answer === opt.value} 
                                        onChange={(e) => onChange(e.target.value)} 
                                        type="radio" 
                                        value={opt.value} 
                                        name={question.id} 
                                        className="sr-only" 
                                    />
                                    <div className={`
                                        h-4 w-4 rounded-full border flex items-center justify-center transition-all
                                        ${answer === opt.value
                                            ? 'bg-emerald-500 border-emerald-500' 
                                            : 'bg-white/5 border-white/20 hover:border-white/40'
                                        }
                                    `}>
                                        {answer === opt.value && (
                                            <div className="w-2 h-2 bg-black rounded-full" />
                                        )}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-400">{opt.value}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            );
    
          case 'multi-choice':
              return (
                  <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                      <div className="space-y-2">
                          {options.map((opt, i) => (
                              <div key={i} className="flex items-center">
                                  <label className="flex items-center cursor-pointer">
                                      <input 
                                          checked={Array.isArray(answer) && answer.includes(opt.value)} 
                                          onChange={() => { 
                                              const newAnswer = Array.isArray(answer) 
                                                  ? (answer.includes(opt.value) 
                                                      ? answer.filter(v => v !== opt.value) 
                                                      : [...answer, opt.value]) 
                                                  : [opt.value]; 
                                              onChange(newAnswer); 
                                          }} 
                                          type="checkbox" 
                                          value={opt.value} 
                                          className="sr-only"
                                      />
                                      <div className={`
                                          h-4 w-4 rounded-full border flex items-center justify-center transition-all
                                          ${Array.isArray(answer) && answer.includes(opt.value)
                                              ? 'bg-emerald-500 border-emerald-500' 
                                              : 'bg-white/5 border-white/20 hover:border-white/40'
                                          }
                                      `}>
                                          {Array.isArray(answer) && answer.includes(opt.value) && (
                                              <div className="w-2 h-2 bg-black rounded-full" />
                                          )}
                                      </div>
                                      <span className="ml-2 text-sm text-gray-400">{opt.value}</span>
                                  </label>
                              </div>
                          ))}
                      </div>
                  </div>
              );
            
        case 'file':
            return (
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-white/20 hover:border-emerald-500/30 transition-colors">
                        <div className="space-y-1 text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <div className="flex text-sm text-gray-400">
                                <label htmlFor={question.id} className="relative cursor-pointer bg-transparent rounded-md font-medium text-emerald-400 hover:text-emerald-300 focus-within:outline-none">
                                    <span>Upload a file</span>
                                    <input id={question.id} name={question.id} type="file" className="sr-only" onChange={handleFileChange} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                             {answer ? (
                                <p className="text-xs text-emerald-400">{answer}</p>
                            ) : (
                                <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            )}
                        </div>
                    </div>
                </div>
            );

        default:
            return null;
    }
}

const AssessmentPreview: React.FC = () => {
  const { watch } = useFormContext<Assessment>();
  const assessmentData = watch();
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({});
  
  const handleAnswerChange = (questionId: string, value: any) => {
    setPreviewAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const sanitizeString = (str: any): string => {
    return String(str || '')
      .toLowerCase()
      .replace(/\s+/g, '');
  };

  const isQuestionVisible = (question: Question) => {
    const condition = question.condition;
    if (!condition?.questionId || !condition.value) {
      return true;
    }

    const allQuestions = assessmentData.sections?.flatMap(s => s.questions) || [];
    const targetQuestion = allQuestions.find(q => q.id === condition.questionId);
    if (!targetQuestion) return true;

    const targetAnswer = previewAnswers[condition.questionId];
    const sanitizedConditionValue = sanitizeString(condition.value);

    switch (targetQuestion.type) {
      case 'single-choice':
      case 'short-text':
      case 'long-text':
      case 'numeric':
        return sanitizeString(targetAnswer) === sanitizedConditionValue;
      
      case 'multi-choice':
        return (
          Array.isArray(targetAnswer) &&
          targetAnswer.some(answerOption => sanitizeString(answerOption) === sanitizedConditionValue)
        );
        
      default:
        return true;
    }
  };

  return (
    <div className="p-6 bg-white/[0.01] backdrop-blur-sm border border-white/10 rounded-lg min-h-[300px] space-y-6">
      <h2 className="text-xl font-bold text-center text-white">
        {assessmentData?.title || 'Assessment Title'}
      </h2>
      
      {(!assessmentData?.sections || assessmentData.sections.length === 0) ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-400">No sections added yet</p>
          <p className="text-xs text-gray-500 mt-1">Add sections and questions to see the preview</p>
        </div>
      ) : (
        assessmentData.sections.map((section: AssessmentSection) => (
          <div key={section.id} className="bg-white/[0.02] backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <h3 className="text-lg font-semibold border-b border-white/10 pb-2 mb-4 text-gray-200">
              {section.title || 'Section Title'}
            </h3>
            <div className="space-y-4">
              {section.questions?.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No questions in this section</p>
              ) : (
                section.questions?.filter(isQuestionVisible).map((question: Question) => 
                  <PreviewInput 
                    key={question.id} 
                    question={question}
                    answer={previewAnswers[question.id]}
                    onChange={(value) => handleAnswerChange(question.id, value)}
                  />
                )
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AssessmentPreview;