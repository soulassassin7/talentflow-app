import { client } from '../api/client';
import type { Job } from '../types';
import { db } from '../db/dexie';

export const jobsService = {
  list: (params: Record<string, any>) => {
    return client('jobs', { params }); 
  },

  get: (id: string) => {
    return client(`jobs/${id}`);
  },

  getById: (id: string): Promise<Job | undefined> => {
    return db.jobs.get(id);
  },
  
  getBySlug: (slug: string): Promise<Job | undefined> => {
    return db.jobs.where('slug').equals(slug).first();
  },

  create: (payload: Partial<Job>) => {
    return client('jobs', { method: 'POST', body: payload });
  },

  patch: (id: string, body: Partial<Job>) => {
    return client(`jobs/${id}`, { method: 'PATCH', body: body });
  },

  reorder: (id: string, body: { fromOrder: number, toOrder: number }) => {
    return client(`jobs/${id}/reorder`, { method: 'PATCH', body: body });
  },

  delete: (id: string) => {
    return client(`jobs/${id}`, { method: 'DELETE' });
  },
};