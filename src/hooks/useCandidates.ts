import { useQuery, type UseQueryOptions } from '@tanstack/react-query';
import { candidatesService } from '../services/candidatesService';
import type { Candidate } from '../types';

export type CandidatesResponse = {
  items: Candidate[];
  total: number;
};

type LocalOptions = Omit<
  UseQueryOptions<CandidatesResponse, Error, CandidatesResponse, readonly unknown[]>,
  'queryKey' | 'queryFn'
>;

export const useCandidates = (
  params: Record<string, any> = {},
  options?: LocalOptions
) => {
  return useQuery<CandidatesResponse, Error>({
    queryKey: ['candidates', params],
    queryFn: () => candidatesService.list(params),
    ...options,
  });
};
