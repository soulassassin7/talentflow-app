import { Link } from 'react-router-dom';
import { useJobs } from '../hooks/useJobs';
import { useCandidates } from '../hooks/useCandidates';
import { useEffect, useState } from 'react';

const Home = () => {
  const { data: jobsData } = useJobs({ pageSize: 1000 });
  const { data: candidatesData } = useCandidates({ pageSize: 1000 });
  
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalCandidates: 0,
    hiredThisMonth: 0,
    avgTimeToHire: 0,
    screeningRate: 0
  });

  useEffect(() => {
    if (jobsData && candidatesData) {
      const activeJobs = jobsData.items.filter(job => job.status === 'active').length;
      const totalCandidates = candidatesData.items.length;

      const thisMonth = new Date();
      thisMonth.setDate(1);
      const hiredThisMonth = candidatesData.items.filter(c => {
        if (c.stage !== 'hired') return false;
        const lastEvent = c.timeline?.[c.timeline.length - 1];
        if (!lastEvent) return false;
        return new Date(lastEvent.timestamp) >= thisMonth;
      }).length;

      const screenedCandidates = candidatesData.items.filter(c => c.stage !== 'applied').length;
      const screeningRate = totalCandidates > 0 ? Math.round((screenedCandidates / totalCandidates) * 100) : 0;

      setStats({
        activeJobs,
        totalCandidates,
        hiredThisMonth,
        avgTimeToHire: 23, 
        screeningRate
      });
    }
  }, [jobsData, candidatesData]);

  return (
    <div className="min-h-screen bg-[#0a0b1e] flex flex-col">
      
      <section className="relative overflow-hidden flex-1">
        
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-purple-500/10" />
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="text-white">Streamline Your</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Hiring Process
              </span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              TalentFlow is the modern recruitment platform that helps you find, assess, and hire 
              top talent efficiently. Built for teams that value their time and candidates.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                to="/jobs"
                className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                View Jobs
              </Link>
              <Link
                to="/candidates"
                className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg backdrop-blur-sm transition-all duration-200"
              >
                Browse Candidates
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center text-white mb-12">
            Live Recruitment Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Link to="/jobs" className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200 text-center h-full">
                <div className="text-3xl font-bold text-emerald-400 group-hover:scale-110 transition-transform">
                  {stats.activeJobs}
                </div>
                <div className="mt-2 text-gray-400">Active Jobs</div>
                <div className="mt-1 text-xs text-emerald-400/60">View all →</div>
              </div>
            </Link>
            
            <Link to="/candidates" className="group">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200 text-center h-full">
                <div className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform">
                  {stats.totalCandidates.toLocaleString()}
                </div>
                <div className="mt-2 text-gray-400">Total Candidates</div>
                <div className="mt-1 text-xs text-purple-400/60">Browse all →</div>
              </div>
            </Link>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-blue-400">
                {stats.screeningRate}%
              </div>
              <div className="mt-2 text-gray-400">Screening Rate</div>
              <div className="mt-1 text-xs text-blue-400/60">Past applied stage</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-orange-400">
                {stats.hiredThisMonth}
              </div>
              <div className="mt-2 text-gray-400">Hired This Month</div>
              <div className="mt-1 text-xs text-orange-400/60">{new Date().toLocaleDateString('en-US', { month: 'long' })}</div>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <div className="text-3xl font-bold text-green-400">
                {stats.avgTimeToHire}
              </div>
              <div className="mt-2 text-gray-400">Avg Days to Hire</div>
              <div className="mt-1 text-xs text-green-400/60">Industry avg: 36</div>
            </div>
          </div>

          
          <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Current Pipeline Distribution</h3>
            <div className="grid grid-cols-6 gap-2">
              {['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'].map((stage) => {
                const count = candidatesData?.items.filter(c => c.stage === stage).length || 0;
                const percentage = stats.totalCandidates > 0 ? (count / stats.totalCandidates * 100).toFixed(1) : '0';
                return (
                  <div key={stage} className="text-center">
                    <div className="text-xs text-gray-400 capitalize mb-1">{stage}</div>
                    <div className="text-2xl font-bold text-white">{count}</div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      

      <section className="py-20 border-t border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Everything You Need to Hire Better
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="h-12 w-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6V5a2 2 0 012-2h4a2 2 0 012 2v1h3a1 1 0 011 1v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a1 1 0 011-1h3zm2 0h4V5H8v1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Job Management</h3>
              <p className="text-gray-400">Create and manage job postings with our intuitive interface. Track applications and collaborate with your team.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Candidate Pipeline</h3>
              <p className="text-gray-400">Visualize your recruitment funnel and move candidates through stages with our drag-and-drop pipeline.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v1a1 1 0 001 1h4a1 1 0 001-1V3m-6 0a1 1 0 011-1h4a1 1 0 011 1M5 5h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a1 1 0 011-1zm3 4h4m-4 3h4m-4 3h2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Assessments</h3>
              <p className="text-gray-400">Build custom assessments to evaluate candidates objectively and find the perfect fit for your team.</p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 bg-gradient-to-b from-transparent to-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Hiring?
          </h2>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of companies that use TalentFlow to build amazing teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/jobs"
              className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-black font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;