import React from 'react';

export default function Header({ activeTab, setActiveTab, systemRole, setSystemRole, onLogout, hasSubmitted }) {
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setActiveTab('home');
    }
    window.location.reload();
  };

  const isManagementRole = systemRole === 'Admin' || systemRole === 'Incubation Mentor' || systemRole === 'Mentor';
  const isStudentFounder = systemRole === 'Student Founder';

  return (
    <header className="w-full bg-[#060212]/70 backdrop-blur-xl border-b border-white/[0.03] sticky top-0 z-50 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between">
        
       
        <div onClick={() => setActiveTab('home')} className="flex items-center gap-2.5 cursor-pointer group">
          <div className=" shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
          <span className="font-black text-xs tracking-[0.25em] text-white uppercase font-mono">
            VENTURENEST
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-9">
          <button onClick={() => setActiveTab('home')} className="text-[11px] font-bold uppercase tracking-widest text-white hover:text-purple-400 transition-colors">Home</button>
          <a href="#workflow" onClick={() => setActiveTab('home')} className="text-[11px] font-bold uppercase tracking-widest text-purple-300/40 hover:text-white transition-colors">Workflow</a>
          <a href="#Mentors" onClick={() => setActiveTab('home')} className="text-[11px] font-bold uppercase tracking-widest text-purple-300/40 hover:text-white transition-colors">Mentors</a>
          
         
          {(isStudentFounder || systemRole === 'Admin') && (
            <button 
              onClick={() => setActiveTab('apply')} 
              className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
                activeTab === 'apply' ? 'text-purple-400' : 'text-purple-300/40 hover:text-white'
              }`}
            >
              {isStudentFounder && hasSubmitted ? 'Track Update' : 'Apply Portal'}
            </button>
          )}

          {isManagementRole && (
            <button 
              onClick={() => setActiveTab('pipeline')} 
              className={`text-[11px] font-bold uppercase tracking-widest transition-colors ${
                activeTab === 'pipeline' ? 'text-purple-400' : 'text-purple-300/40 hover:text-white'
              }`}
            >
              Review Pipeline
            </button>
          )}
        </nav>

        
        <div className="flex items-center gap-4">
          <select 
            value={systemRole}
            onChange={(e) => setSystemRole(e.target.value)}
            className="bg-purple-950/20 border border-white/[0.05] rounded px-3 py-1.5 text-[10px] font-mono tracking-wider text-purple-300 focus:outline-none focus:border-purple-500/40"
          >
            <option value="Student Founder">STUDENT FOUNDER MODE</option>
            <option value="Admin">ADMIN MODE</option>
            <option value="Incubation Mentor">MENTOR MODE</option>
          </select>

         
          {isManagementRole ? (
            <button 
              onClick={() => setActiveTab('pipeline')}
              className={`font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded transition-all duration-200 ${
                activeTab === 'pipeline'
                  ? 'bg-purple-600 text-white shadow-purple-500/20'
                  : 'bg-white text-black hover:bg-neutral-200 shadow-white/5'
              }`}
            >
              Pipeline Workspace
            </button>
          ) : (
            <button 
              onClick={() => setActiveTab('apply')}
              className={`font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded transition-all duration-200 ${
                activeTab === 'apply'
                  ? 'bg-purple-600 text-white shadow-purple-500/20'
                  : 'bg-white text-black hover:bg-neutral-200 shadow-white/5'
              }`}
            >
              
              {isStudentFounder && hasSubmitted ? 'Track Update' : 'Apply Portal'}
            </button>
          )}

          <button 
            onClick={handleLogout}
            className="border border-rose-500/30 bg-rose-950/20 text-rose-400 hover:bg-rose-900/30 font-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded transition-all duration-200"
          >
            LOGOUT
          </button>
        </div>

      </div>
    </header>
  );
}