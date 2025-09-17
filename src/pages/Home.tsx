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
                <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Job Management</h3>
              <p className="text-gray-400">Create and manage job postings with our intuitive interface. Track applications and collaborate with your team.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="h-12 w-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Candidate Pipeline</h3>
                            <p className="text-gray-400">Visualize your recruitment funnel and move candidates through stages with our drag-and-drop pipeline.</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200">
              <div className="h-12 w-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V19.5a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25V6.108c0-1.135.845-2.098 1.976-2.192a48.424 48.424 0 011.124-.08m10.95 0a48.346 48.346 0 00-10.95 0m10.95 0a2.678 2.678 0 00-1.95 0M12 8.25v7.5m3-3h-6" />
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