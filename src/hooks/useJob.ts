import { useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobsService';
import type { Job } from '../types';

export const useJob = ({ id, slug }: { id?: string; slug?: string }) => {
  return useQuery<Job | null, Error>({
    queryKey: ['job', { id, slug }],
    queryFn: async () => {
      if (id) return jobsService.get(id);
      if (slug) return jobsService.getBySlug(slug);
      return null;
    },
    enabled: !!id || !!slug,
  });
};
