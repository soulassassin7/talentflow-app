import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinkClass = (isActive: boolean) => 
    `group flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${
      isActive 
        ? 'text-white bg-white/10' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  const mobileNavLinkClass = (isActive: boolean) => 
    `flex items-center gap-3 rounded-md px-4 py-3 text-base font-medium transition-all duration-200 ${
      isActive 
        ? 'text-white bg-white/10' 
        : 'text-gray-400 hover:text-white hover:bg-white/5'
    }`;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0b1e]/80 backdrop-blur-xl border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="inline-block">
                <h1 className="text-2xl font-semibold tracking-tight cursor-pointer hover:opacity-90 transition-opacity">
                  <span className="text-white">TALENT</span>
                  <span className="text-emerald-400">FLOW</span>
                </h1>
              </Link>
            </div>
            <div className="hidden md:block ml-12">
              <div className="flex items-center space-x-1">
                <NavLink
                  to="/"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  <svg className="h-4 w-4 text-current" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Home
                </NavLink>
                <NavLink
                  to="/jobs"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  <svg className="h-4 w-4 text-current" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6V5a2 2 0 012-2h4a2 2 0 012 2v1h3a1 1 0 011 1v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a1 1 0 011-1h3zm2 0h4V5H8v1z" />
                  </svg>
                  Jobs
                </NavLink>
                <NavLink
                  to="/candidates"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  <svg className="h-4 w-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  Candidates
                </NavLink>
                <NavLink
                  to="/assessments"
                  className={({ isActive }) => navLinkClass(isActive)}
                >
                  <svg className="h-4 w-4 text-current" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v1a1 1 0 001 1h4a1 1 0 001-1V3m-6 0a1 1 0 011-1h4a1 1 0 011 1M5 5h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a1 1 0 011-1zm3 4h4m-4 3h4m-4 3h2" />
                  </svg>
                  Assessments
                </NavLink>
              </div>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              onClick={toggleMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-[#0a0b1e]/95 backdrop-blur-xl border-b border-white/5">
          <NavLink
            to="/"
            onClick={closeMenu}
            className={({ isActive }) => mobileNavLinkClass(isActive)}
          >
            <svg className="h-5 w-5 text-current" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </NavLink>
          <NavLink
            to="/jobs"
            onClick={closeMenu}
            className={({ isActive }) => mobileNavLinkClass(isActive)}
          >
            <svg className="h-5 w-5 text-current" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 6V5a2 2 0 012-2h4a2 2 0 012 2v1h3a1 1 0 011 1v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a1 1 0 011-1h3zm2 0h4V5H8v1z" />
            </svg>
            Jobs
          </NavLink>
          <NavLink
            to="/candidates"
            onClick={closeMenu}
            className={({ isActive }) => mobileNavLinkClass(isActive)}
          >
            <svg className="h-5 w-5 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            Candidates
          </NavLink>
          <NavLink
            to="/assessments"
            onClick={closeMenu}
            className={({ isActive }) => mobileNavLinkClass(isActive)}
          >
            <svg className="h-5 w-5 text-current" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 3v1a1 1 0 001 1h4a1 1 0 001-1V3m-6 0a1 1 0 011-1h4a1 1 0 011 1M5 5h10a1 1 0 011 1v10a2 2 0 01-2 2H6a2 2 0 01-2-2V6a1 1 0 011-1zm3 4h4m-4 3h4m-4 3h2" />
            </svg>
            Assessments
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Header;