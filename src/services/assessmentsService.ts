import { client } from '../api/client';
import type { Assessment } from '../types';

export const assessmentsService = {
  get: (jobId: string): Promise<Assessment | null> => {
    return client(`assessments/${jobId}`).catch(error => {
      if (error.message.includes('Not found')) {
        return null;
      }
      throw error;
    });
  },

  save: (jobId: string, payload: Assessment) => {
    return client(`assessments/${jobId}`, { method: 'PUT', body: payload });
  }
};