import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useJobs } from '../../hooks/useJobs';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const { data: jobsData, isLoading } = useJobs({ pageSize: 1000, status: 'active' });

  const filteredJobs = useMemo(() => {
    if (!jobsData?.items) return [];
    if (!searchTerm) return jobsData.items;
    return jobsData.items.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobsData, searchTerm]);

  const wrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleJobSelect = (slug: string) => {
    setIsDropdownOpen(false);
    navigate(`/assessments/${slug}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Assessment Management</h1>
        <p className="text-sm text-gray-400">
          Search for a job to build or edit its assessment
        </p>
      </div>

      <Card className="shadow-sm bg-white/[0.02] backdrop-blur-2xl border border-white/10">
        <CardContent className="p-8">
          <div ref={wrapperRef} className="max-w-md relative">
            <Label htmlFor="job-search" className="text-sm font-medium text-gray-400 mb-2 block">
              Search for an Active Job
            </Label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
              </div>
              <Input
                type="text"
                id="job-search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={isLoading ? 'Loading jobs...' : 'e.g., Senior Engineer'}
                className="pl-10 h-11 bg-white/[0.03] backdrop-blur-2xl border-white/10 text-white placeholder:text-gray-500 focus:border-emerald-400/50 focus:ring-2 focus:ring-emerald-400/20"
                autoComplete="off"
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute z-20 mt-2 w-full bg-[#0f1629]/95 backdrop-blur-2xl border border-white/10 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-sm text-gray-400">Loading jobs...</p>
                  </div>
                ) : filteredJobs.length > 0 ? (
                  <ul className="py-1">
                    {filteredJobs.map(job => (
                      <li
                        key={job.id}
                        onClick={() => handleJobSelect(job.slug)}
                        className="px-4 py-3 text-sm text-gray-300 hover:bg-emerald-500/20 hover:text-emerald-400 cursor-pointer transition-all duration-150 border-b border-white/5 last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{job.title}</span>
                          {job.tags && job.tags.length > 0 && (
                            <div className="flex gap-1">
                              {job.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs px-2 py-0.5 bg-white/10 text-gray-400 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-400">No jobs found</p>
                    <p className="text-xs text-gray-500 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Quick Actions
            </h3>
            <p className="text-sm text-gray-500">
              Select a job from the search above to build or edit its assessment
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentsPage;