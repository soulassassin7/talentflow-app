import { client } from '../api/client';
import type { Candidate } from '../types';

export const candidatesService = {
  list: (params: Record<string, any>) => {
    return client('candidates', { params });
  },

  get: (id: string) => {
    return client(`candidates/${id}`);
  },

  patch: (id: string, body: Partial<Candidate> & { targetIndex?: number }) => {
    return client(`candidates/${id}`, { method: 'PATCH', body });
  },

};