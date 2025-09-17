import {useQuery} from '@tanstack/react-query';
import { candidatesService } from '../services/candidatesService';
import type { Candidate } from '../types';

export type CandidatesResponse={
    items: Candidate[];
    total:number;
};


export const useCandidates = (params: Record<string, any> = {}) => {
  return useQuery<CandidatesResponse, Error>({
    queryKey: ['candidates', params],
    queryFn: () => candidatesService.list(params),
  });
};