import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ScrollToTop from './components/ScrollToTop'; 
import Home from './pages/Home';
import JobsListPage from './pages/Jobs/JobsList';
import JobDetailsPage from './pages/Jobs/JobDetails';
import CandidatesListPage from './pages/Candidates/CandidatesList';
import CandidateProfilePage from './pages/Candidates/CandidateProfilePage';
import AssessmentsPage from './pages/Assessments/AssessmentsPage';
import AssessmentBuilderPage from './pages/Assessments/AssessmentBuilder';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <ScrollToTop /> 
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/jobs" element={<JobsListPage />} />
                        <Route path="/jobs/:slug" element={<JobDetailsPage />} />
                        <Route path="/assessments" element={<AssessmentsPage />} />
                        <Route path="/assessments/:slug" element={<AssessmentBuilderPage />} />
                        <Route path="/candidates" element={<CandidatesListPage />} />
                        <Route path="/candidates/:candidateId" element={<CandidateProfilePage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App;