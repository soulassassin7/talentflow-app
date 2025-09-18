import { useQuery } from '@tanstack/react-query';
import { assessmentsService } from '../services/assessmentsService';
import type { Assessment } from '../types';

export const useAssessment = (jobId: string | undefined) => {
  return useQuery<Assessment | null, Error>({
    queryKey: ['assessment', jobId],
    queryFn: () => assessmentsService.get(jobId!),
    enabled: !!jobId,
  });
};