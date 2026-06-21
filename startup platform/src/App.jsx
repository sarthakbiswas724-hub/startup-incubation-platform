import React, { useState, useEffect } from 'react';
import Backdrop from './components/Backdrop.jsx';
import Header from './components/Header.jsx';
import Hero from './components/3Dan.jsx';
import Workflow from './components/Workflow.jsx';
import Analytics from './components/Analytics.jsx';
import Faq from './components/Faq.jsx';

// Import views
import Login from './views/Login.jsx';
import AdminPipeline from './views/AdminPipeline.jsx';
import ApplicationForm from './views/ApplicationForm.jsx';
import EvaluationPanel from './views/EvaluationPanel.jsx';
import Scheduler from './views/Scheduler.jsx';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [systemRole, setSystemRole] = useState(null); 
  const [activeTab, setActiveTab] = useState('home');
  const [openFaq, setOpenFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExploreModal, setShowExploreModal] = useState(false);
  
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Checks the database and returns a boolean value directly
  const checkApplicationStatus = async (token) => {
    if (!token) return false;
    try {
      const response = await fetch('http://localhost:8000/api/v1/applications/all', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setHasSubmitted(true);
          return true; // Had application
        }
      }
      setHasSubmitted(false);
      return false; // No application found
    } catch (err) {
      console.error("Uplink database tracker connection failed.", err);
      setHasSubmitted(false);
      return false;
    }
  };

  // 1. Initial page refresh mount check
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role');
      
      if (savedToken && savedRole) {
        setIsAuthenticated(true);
        setSystemRole(savedRole);
        
        // If they are a founder and already have an application, set their view to track update directly
        const alreadySubmitted = await checkApplicationStatus(savedToken);
        if (alreadySubmitted && savedRole === 'Student Founder') {
          setActiveTab('apply'); 
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  // 2. Clear state and refresh tracker if role switches manually via drop menu matrix
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (isAuthenticated && savedToken) {
      checkApplicationStatus(savedToken);
    }
  }, [systemRole, isAuthenticated]);

  // 3. Triggered directly upon typing correct credentials inside Login.jsx
  const handleLoginSuccess = async (role) => {
    setIsAuthenticated(true);
    setSystemRole(role);
    
    const freshToken = localStorage.getItem('token');
    if (freshToken) {
      const alreadySubmitted = await checkApplicationStatus(freshToken);
      
      // CRITICAL RE-LOGIN REDIRECT FIX: 
      // If a Student Founder logs back in and an application exists, land them directly on the Tracker!
      if (alreadySubmitted && role === 'Student Founder') {
        setActiveTab('apply');
      } else {
        setActiveTab('home');
      }
    } else {
      setActiveTab('home');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsAuthenticated(false);
    setSystemRole(null);
    setHasSubmitted(false);
    setActiveTab('home');
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  if (loading) return <div className="min-h-screen bg-[#060212]" />;

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#060212] text-white flex flex-col relative font-sans antialiased overflow-x-hidden selection:bg-purple-600 selection:text-white">
      
      <Backdrop />

      {/* Header receives live tracking metrics status flag */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        systemRole={systemRole} 
        setSystemRole={setSystemRole} 
        onLogout={handleLogout}
        hasSubmitted={hasSubmitted} 
      />

      <main className="flex-grow z-10 relative">
        {activeTab === 'home' ? (
          <>
            <Hero setActiveTab={setActiveTab} onExploreClick={() => setShowExploreModal(true)} />
            <Workflow />
            <Analytics />
            <Faq openFaq={openFaq} toggleFaq={toggleFaq} />
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-6 sm:px-12 py-8">
            <div className="bg-[#050210] border border-white/[0.04] rounded-xl p-6 sm:p-10 min-h-[400px] shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500" />
              
              {activeTab === 'pipeline' && <AdminPipeline />}
              
              {activeTab === 'apply' && (
                systemRole === 'Student Founder' ? (
                  <ApplicationForm 
                    token={localStorage.getItem('token')} 
                    role={systemRole} 
                    hasSubmitted={hasSubmitted}
                    setHasSubmitted={setHasSubmitted}
                  />
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-bold text-rose-400 mb-2">ACCESS DEPLOYMENT RESTRICTION</h3>
                    <p className="text-gray-400 text-sm">Admins and Mentors do not have authorization access to submit operational proposals.</p>
                  </div>
                )
              )}

              {activeTab === 'evaluate' && <EvaluationPanel role={systemRole} />}
              {activeTab === 'scheduler' && <Scheduler />}
            </div>
          </div>
        )}
      </main>

      {showExploreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer" onClick={() => setShowExploreModal(false)} />
          <div className="relative bg-[#0b071e] border border-purple-500/30 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl text-left">
            <div className="flex justify-between items-center border-b border-white/[0.08] pb-4 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">About VentureNest Platform</h2>
              <button onClick={() => setShowExploreModal(false)} className="text-gray-400 hover:text-white text-2xl font-mono">×</button>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">VentureNest is an all-in-one incubation operations workspace.</p>
            <div className="mt-6 pt-4 border-t border-white/[0.08] text-right">
              <button onClick={() => setShowExploreModal(false)} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm px-5 py-2.5 rounded-lg">Got it, close</button>
            </div>
          </div>
        </div>
      )}

      <footer className="w-full py-8 bg-[#03010a] text-center text-[9px] font-mono text-purple-500/20 tracking-widest border-t border-white/[0.02]">
        VENTURENEST INCUBATION GLOBAL MATRIX © 2026 - ALL RIGHTS RESERVED
      </footer>

    </div>
  );
}