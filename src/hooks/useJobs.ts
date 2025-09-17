
import { useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobsService';
import type { Job } from '../types'; 


export type JobsResponse = {
  items: Job[];
  total: number;
};

export const useJobs = (params: Record<string, any> = {}) => {
  return useQuery<JobsResponse, Error>({
    queryKey: ['jobs', params],
    queryFn: () => jobsService.list(params),
  });
};