import {useQuery} from '@tanstack/react-query';
import { candidatesService } from '../services/candidatesService';
import type {Candidate} from '../types';


export const useCandidate = (candidateId: string | undefined)=>{
    return useQuery<Candidate,Error>({
        queryKey: ['candidate',candidateId],
        queryFn: () => candidatesService.get(candidateId!),
        enabled: !!candidateId,
    });
};