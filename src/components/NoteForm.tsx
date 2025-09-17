
import React, { useState, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import type { ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";

const MENTION_SUGGESTIONS = ['alice', 'bob', 'charlie', 'david', 'manager', 'interviewer', 'recruiter'];

type OnSubmitData = {
  note: string;
};

interface NoteFormProps {
  onSubmit: (data: OnSubmitData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  label?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({ 
  onSubmit, 
  onCancel, 
  isSubmitting,
  label = "Add an optional note (e.g., @interviewer review this)",
  submitButtonText = "Save Note",
  cancelButtonText = "Skip",
  showCancelButton = true
}) => {
  const [html, setHtml] = useState('');
  const textRef = useRef('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);
  const editableDivRef = useRef<HTMLDivElement>(null);

  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });

  const highlightMentions = (text: string) => {
    return text.replace(/(@\w+)/g, '<strong class="text-emerald-400 font-semibold">$&</strong>');
  };

  const updateSuggestionPosition = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const containerRect = editableDivRef.current?.getBoundingClientRect();

    if (containerRect) {
      setSuggestionPosition({
        top: rect.bottom - containerRect.top,
        left: rect.left - containerRect.left,
      });
    }
  };

  const handleContentChange = (evt: ChangeEvent<HTMLDivElement>) => {
    const newText = evt.currentTarget.textContent || '';
    textRef.current = newText;
    setHtml(highlightMentions(newText));

    const lastWord = newText.split(/\s+/).pop() || '';
    if (lastWord.startsWith('@') && lastWord.length > 0) {
      const searchTerm = lastWord.substring(1).toLowerCase();
      const filtered = MENTION_SUGGESTIONS.filter(name => name.toLowerCase().startsWith(searchTerm));
      
      if (filtered.length > 0) {
        updateSuggestionPosition();
        setSuggestions(filtered);
        setIsSuggestionsVisible(true);
      } else {
        setIsSuggestionsVisible(false);
      }
    } else {
      setIsSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (name: string) => {
    const currentText = textRef.current;
    const parts = currentText.split(/\s+/);
    parts.pop();
    const newText = [...parts, `@${name} `].join(' ');
    
    textRef.current = newText;
    setHtml(highlightMentions(newText));
    setIsSuggestionsVisible(false);
    editableDivRef.current?.focus();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textRef.current.trim()) {
      onSubmit({ note: textRef.current });
      textRef.current = '';
      setHtml('');
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-gray-400 mb-2">
            {label}
          </label>
          
          <ContentEditable
            innerRef={editableDivRef}
            html={html}
            onChange={handleContentChange as any}
            className="mt-1 block w-full rounded-lg bg-white/[0.03] backdrop-blur-xl border border-white/10 shadow-sm p-3 text-white focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20 min-h-[90px] [&_strong]:text-emerald-400 placeholder:text-gray-500 outline-none"
            style={{ caretColor: 'white' }}
          />
        </div>
        
        {isSuggestionsVisible && (
          <div
            style={{ top: suggestionPosition.top, left: suggestionPosition.left }}
            className="absolute z-20 w-48 bg-[#0f1629]/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-2xl max-h-40 overflow-y-auto"
          >
            <ul className="py-1">
              {suggestions.map(name => (
                <li
                  key={name}
                  onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(name); }}
                  className="px-4 py-2 text-sm text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 cursor-pointer transition-colors"
                >
                  @{name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
          {showCancelButton && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/30"
            >
              {cancelButtonText}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || !textRef.current.trim()}
            className="bg-emerald-500 hover:bg-emerald-600 text-black shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 disabled:bg-emerald-500/50 disabled:shadow-none"
          >
            {isSubmitting ? 'Saving...' : submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;