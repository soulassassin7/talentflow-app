import { useQuery } from '@tanstack/react-query';
import { jobsService } from '../services/jobsService';
import type { Job } from '../types';


export const useJob = ({ id, slug }: { id?: string; slug?: string }) => {
  return useQuery<Job| undefined, Error>({
    queryKey: ['job', {id,slug}],
    queryFn: () => {
      if (id) {
        return jobsService.getById(id);
      }
      if (slug) {
        return jobsService.getBySlug(slug);
      }
      return Promise.resolve(undefined);
    },
    enabled: !!id || !!slug, 
  });
};