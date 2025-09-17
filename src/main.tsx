import './index.css';
import { createRoot } from 'react-dom/client';
import App from './App';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function startApp() {
  
    try{
      const {worker} = await import('./api/msw/browser');
      await worker.start({
        onUnhandledRequest(request, print) {
          if (request.url.includes('/api/')) {
            print.warning();
            return;
          }
        },
      });
      
      await sleep(100);
      console.log('[TALENTFLOW] MSW has been started successfully.');
    } catch(err){
      console.warn('[TALENTFLOW] MSW failed to start.',err);
    }

    try {
      const { seedDB } = await import('./db/seed');
      await seedDB();
      console.log('[TALENTFLOW] IndexedDB has been seeded.');
    } catch (err) {
      console.error('[TALENTFLOW] Seeding failed:', err);
    }
  

  const root = createRoot(document.getElementById('root')!);
  root.render(<App />);
}

startApp();
