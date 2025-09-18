import {http, HttpResponse} from 'msw';
import {db} from '../../db/dexie';
import type {Assessment,Candidate,Job} from '../../types';


const randomLatency = (min=200,max=1200) => new Promise((r)=> setTimeout((r),Math.floor(Math.random()*(max-min)+min)));
const randomFailure = (rate=0.06) => Math.random()<rate;


export const handlers=[
    http.get('/api/jobs',async({request}) => {
        await randomLatency();
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page')||'1');
        const pageSize = Number(url.searchParams.get('pageSize') || '9');
        const search = (url.searchParams.get('search') || '').toLowerCase();
        const status = url.searchParams.get('status') || '';

        let jobs = await db.jobs.toArray();
        if (search) {
            jobs = jobs.filter(j => j.title.toLowerCase().includes(search) || j.tags.some(tag => tag.toLowerCase().includes(search)));
        }
        if(status) jobs = jobs.filter(j=>j.status === status);
        jobs.sort((a,b)=>a.order - b.order);
        const total = jobs.length;
        const start = (page - 1)*pageSize;
        const items = jobs.slice(start,start+pageSize);
        return HttpResponse.json({items,total});
    }),

    http.get('/api/jobs/:id', async ({ params }) => {
        await randomLatency();
        const { id } = params as { id: string };

        const job = await db.jobs.get(id);

        if (job) {
            return HttpResponse.json(job);
        } else {
            return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
        }
    }),

http.post('/api/jobs', async ({ request }) => {
        await randomLatency();
        if (randomFailure(0.08)) {
            return HttpResponse.json({ message: 'Simulated write failure' }, { status: 500 });
        }
        const payload = (await request.json()) as Partial<Job>;
        if (!payload || !payload.title) {
            return HttpResponse.json({ message: 'Title is required' }, { status: 400 });
        }

        const id = payload.id ?? crypto.randomUUID();

        const slugBase = (payload.slug ?? payload.title)
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]/g, '')
            .slice(0, 80);

        let slug = slugBase;
        let i = 1;
        while ((await db.jobs.where('slug').equals(slug).count()) > 0) {
            i += 1;
            slug = `${slugBase}-${i}`;
        }

        const totalJobs = await db.jobs.count();
        const record: Job = {
            id,
            slug,
            title: payload.title,
            summary: payload.summary ?? '',
            tags: payload.tags ?? [],
            status: payload.status ?? 'active',
            order: totalJobs + 1,
            createdAt: payload.createdAt ?? Date.now(),
        };

        await db.jobs.add(record);
        return HttpResponse.json(record, { status: 201 });
    }),


    http.patch('/api/jobs/:id', async({request,params}) => {
        await randomLatency();
        if(randomFailure(0.06)){
            return HttpResponse.json({message: 'Simulated write failure'},{status:500});
        }
        const {id} = params as {id: string};
        const patch = (await request.json()) as any;
        const existing = await db.jobs.get(id);
        if(!existing){
            return HttpResponse.json({message: 'Not found'}, {status: 404});
        }

        const updated = {...existing, ...patch};
        await db.jobs.put(updated);
        return HttpResponse.json(updated);
        
    }),

    http.patch('/api/jobs/:id/reorder',async ({request,params}) =>{
        await randomLatency();
        if(randomFailure(0.08)){
            return HttpResponse.json({message:'Simulated reorder failure'},{status:500});
        }
        const {id} = params as {id: string};
        const body = await request.json() as {fromOrder:number,toOrder:number};
        const toOrder = Number(body.toOrder);

        const jobs = await db.jobs.orderBy('order').toArray();
        const moving = jobs.find(j=>j.id ===id);
        if(!moving){
            return HttpResponse.json({message:'Not found'},{status:404});
        }
        const without = jobs.filter(j => j.id !==id);
        const insertIndex = Math.max(0,Math.min(without.length,toOrder-1));
        without.splice(insertIndex,0,moving);
        const updates = without.map((job,idx) =>({...job,order:idx+1}));
        await db.transaction('rw',db.jobs,async () => {
            await Promise.all(updates.map(u=>db.jobs.put(u)));
        });
        return HttpResponse.json({success: true});

    }),

    http.delete('/api/jobs/:id', async ({ params }) => {
        await randomLatency();
        if (randomFailure(0.06)) {
            return HttpResponse.json({ message: 'Simulated delete failure' }, { status: 500 });
        }
        
        const { id } = params as { id: string };
        const existing = await db.jobs.get(id);
        
        if (!existing) {
            return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
        }
        
        await db.jobs.delete(id);
        
        const remainingJobs = await db.jobs.orderBy('order').toArray();
        const updates = remainingJobs.map((job, idx) => ({ ...job, order: idx + 1 }));
        
        await db.transaction('rw', db.jobs, async () => {
            await Promise.all(updates.map(u => db.jobs.put(u)));
        });
        
        return HttpResponse.json({ message: 'Job deleted successfully' });
    }),

    http.get('/api/jobs/slug/:slug', async ({ params }) => {
    await randomLatency();
    const slug = (params as any).slug;
    const job = await db.jobs.where('slug').equals(slug).first();
    if (!job) return HttpResponse.json({ message: 'Not found' }, { status: 404 });
    return HttpResponse.json(job);
    }),

    http.get('/api/candidates', async({request})=>{
        await randomLatency();
        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') || '1');
        const pageSize = Number(url.searchParams.get('pageSize') || '50');
        const search = (url.searchParams.get('search') || '').toLowerCase();
        const stage = url.searchParams.get('stage') || '';

        const jobId = url.searchParams.get('jobId') || '';

        let candidates = await db.candidates.toArray();
        
        if (jobId) {
        candidates = candidates.filter(c => c.jobId === jobId);
        }
        
        if(search) candidates = candidates.filter(c=>c.name.toLowerCase().includes(search) || c.email.toLowerCase().includes(search));
        if(stage) candidates = candidates.filter(c=>c.stage === stage);
        const total = candidates.length;
        const start = (page-1)*pageSize;
        const items = candidates.slice(start,start+pageSize);
        return HttpResponse.json({items,total});
    }),

    http.get('/api/candidates/:id', async ({ params }) => {
        await randomLatency();
        const { id } = params as { id: string };
        const candidate = await db.candidates.get(id);

        if (candidate) {
            return HttpResponse.json(candidate);
        } else {
            return HttpResponse.json({ message: 'Candidate not found' }, { status: 404 });
        }
    }),

    http.patch('/api/candidates/:id', async({request,params})=>{
        await randomLatency();
        if(randomFailure(0.06)){
            return HttpResponse.json({message:'Simulated write failure'},{status:500});
        }

        const {id} = params as {id:string};
        const patch = await request.json() as any;
        const existing = await db.candidates.get(id);
        if(!existing){
            return HttpResponse.json({message:'Not found'},{status:404});
        }
        
        const updated = {...existing,...patch} as any;
        
        if(patch.stage && patch.stage !== existing.stage){
            const ev = {
                timestamp:Date.now(),
                from:existing.stage,
                to:patch.stage, 
                note:patch.note ||''
            };
            updated.timeline = [...(existing.timeline || []),ev];
        }

        else if(patch.note && patch.addNoteOnly){
            const ev = {
                timestamp:Date.now(),
                from:existing.stage,
                to:existing.stage, 
                note:patch.note
            };
            updated.timeline = [...(existing.timeline || []),ev];
        }
        
        await db.candidates.put(updated);
        return HttpResponse.json(updated);
    }),

    http.post('/api/candidates', async ({ request }) => {
        await randomLatency();
        if (randomFailure(0.08)) {
            return HttpResponse.json({ message: 'Simulated candidate creation failure' }, { status: 500 });
        }
        
        try {
            const payload = (await request.json()) as Partial<Candidate>;
            if (!payload || !payload.name || !payload.email || !payload.jobId) {
                return HttpResponse.json({ message: 'Name, email, and jobId are required' }, { status: 400 });
            }

            const existingCandidate = await db.candidates.where('email').equalsIgnoreCase(payload.email).first();
            if (existingCandidate) {
                return HttpResponse.json({ message: 'Email is already taken.' }, { status: 409 });
            }

            const record: Candidate = {
                id: crypto.randomUUID(),
                name: payload.name,
                email: payload.email,
                jobId: payload.jobId,
                profile: payload.profile || 'No profile summary provided.',
                stage: 'applied',
                timeline: [],
            };

            await db.candidates.add(record);
            return HttpResponse.json(record, { status: 201 });
        } catch (error) {
            console.error("Error in POST /api/candidates handler:", error);
            return HttpResponse.json({ message: 'Failed to save candidate to the database.' }, { status: 500 });
        }
    }),

    http.get('/api/candidates/:id/timeline', async({params})=>{
        await randomLatency();
        const {id} = params as {id: string};
        const candidate = await db.candidates.get(id);
        if(!candidate){
            return HttpResponse.json({message:'Not found'},{status:404});
        }
        return HttpResponse.json({timeline:candidate.timeline || []});
    }),

    http.get('/api/assessments/:jobId', async({params})=>{
        await randomLatency();
        const {jobId} = params as {jobId: string};
        const assessment = await db.assessments.get(jobId);
        if(!assessment){
            return HttpResponse.json({message:'Not found'},{status:404});
        }
        return HttpResponse.json(assessment);
    }),

    http.put('/api/assessments/:jobId', async({request,params})=>{
        await randomLatency();
        if(randomFailure(0.06)){
            return HttpResponse.json({message:'Simulated write failure'},{status:500});
        }
        const {jobId} = params as {jobId: string};
        const payload = await request.json();
        await db.assessments.put({...(payload as Assessment),jobId});
        return HttpResponse.json(payload);
    }),

    http.post('/api/assessments/:jobId/submit',async({request,params})=>{
        await randomLatency();
        if(randomFailure(0.06)){
            return HttpResponse.json({message:'Simulated write failure'},{status:500});
        }

        const {jobId} = params as {jobId: string};
        const response = await request.json();
        const existing = await db.assessments.get(jobId);
        const updated = {
            ...(existing || {jobId,title:'',sections:[]}) as any,
            responses: [...((existing && (existing as any).responses) || []), {id: crypto.randomUUID(),createdAt: Date.now(),response}]
        };
        await db.assessments.put(updated);
        return HttpResponse.json({success:true},{status:201});
    }),
];