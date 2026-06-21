import React, { useState, useEffect } from 'react';

const ApplicationForm = (props) => {
  const [formData, setFormData] = useState({
    startupName: '',
    industrySector: '',
    description: '',
  });
  const [pitchDeck, setPitchDeck] = useState(null);
  const [businessPlan, setBusinessPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
 
  const [existingApplication, setExistingApplication] = useState(null);
  const [dbHasRecord, setDbHasRecord] = useState(props.hasSubmitted || false);
  const [syncLoading, setSyncLoading] = useState(true);

  const token = props.token || localStorage.getItem('token');
  const userRole = localStorage.getItem('role') || props.role;

  const checkExistingApplication = async () => {
    if (!token) {
      setSyncLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:8000/api/v1/applications/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setExistingApplication(data[0]); 
          setDbHasRecord(true); // Atomic Boolean Lock secured
          if (props.setHasSubmitted) props.setHasSubmitted(true);
        } else {
          setExistingApplication(null);
          setDbHasRecord(false);
          if (props.setHasSubmitted) props.setHasSubmitted(false);
        }
      }
    } catch (err) {
      console.error("Tracking uplink diagnostic failure.", err);
    } finally {
      setSyncLoading(false);
    }
  };

  
  useEffect(() => {
    checkExistingApplication();
  }, [token, props.hasSubmitted]);

  
  useEffect(() => {
    if (props.hasSubmitted) {
      setDbHasRecord(true);
    }
  }, [props.hasSubmitted]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (userRole !== 'Student Founder') {
      setMessage({ type: 'error', text: 'Authorization Refused: Mentors/Admins cannot create submissions.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const dataToSend = new FormData();
    dataToSend.append('startup_name', formData.startupName);
    dataToSend.append('industry_sector', formData.industrySector);
    dataToSend.append('description', formData.description);
    dataToSend.append('pitch_deck', pitchDeck);
    
    if (businessPlan) {
      dataToSend.append('business_plan', businessPlan);
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/applications/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: dataToSend,
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Application & Pitch Deck uploaded successfully!' });
        setFormData({ startupName: '', industrySector: '', description: '' });
        setPitchDeck(null);
        setBusinessPlan(null);
        e.target.reset();
        
        
        setDbHasRecord(true);
        if (props.setHasSubmitted) props.setHasSubmitted(true);
       
        await checkExistingApplication();
      } else {
        const result = await response.json();
        setMessage({ type: 'error', text: result.detail || 'Submission failed.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Cannot connect to incubation server engine.' });
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Under Review': return 1;
      case 'Interview Scheduled': return 2;
      case 'Approved':
      case 'Rejected': return 3;
      default: return 0;
    }
  };

  
  const shouldShowTracker = (props.hasSubmitted || dbHasRecord) && userRole === 'Student Founder';

  return (
    <div className="w-full bg-[#050210] flex items-center justify-center text-white font-sans selection:bg-purple-500">
      
      {syncLoading && !shouldShowTracker ? (
        /* Isolated Inline Loading Frame to protect background state evaluation cycles */
        <div className="min-h-[350px] flex flex-col items-center justify-center text-purple-400 font-mono text-xs space-y-2 animate-pulse">
          <span>SYNCING FOUNDER CORE VECTORS...</span>
          <span className="text-[10px] text-purple-600/60">Reading secure ledger database rows</span>
        </div>
      ) : shouldShowTracker ? (
       
        <div className="w-full bg-[#140F30]/40 border border-purple-900/20 rounded-xl p-2 sm:p-4 space-y-8">
          
          <div className="text-center border-b border-purple-950/60 pb-6">
            <span className="text-[9px] font-mono tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-950/30 px-3 py-1 rounded-full uppercase">
              Venture Progress Track Active
            </span>
            <h2 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-purple-300 to-indigo-400 bg-clip-text text-transparent mt-4 uppercase">
              {existingApplication?.startup_name || "YOUR APPLICATION"} TELEMETRY CORE
            </h2>
            <p className="text-purple-400/70 font-mono text-[11px] mt-1">
              Sector Segment Matrix: {existingApplication?.industry_sector || "Active Pipeline Trace"}
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-mono font-bold uppercase text-purple-400 tracking-widest mb-4">Realtime Pipeline Tracking</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
              {['Submitted', 'Under Review', 'Interview Stage', 'Final Decision'].map((step, idx) => {
                const currentIdx = existingApplication ? getStepIndex(existingApplication.status) : 0;
                let stepColor = 'text-gray-500 border-white/[0.02] bg-[#0c0824]/40';
                
                if (idx < currentIdx) {
                  stepColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
                } else if (idx === currentIdx) {
                  stepColor = existingApplication?.status === 'Rejected' 
                    ? 'text-rose-400 border-rose-500 bg-rose-950/40 font-bold animate-pulse'
                    : 'text-purple-300 border-purple-500/50 bg-purple-950/40 font-bold animate-pulse';
                }

                return (
                  <div key={step} className={`border p-4 rounded-xl text-center space-y-1 transition-all ${stepColor}`}>
                    <div className="text-[9px] font-mono opacity-50 uppercase">PHASE 0{idx + 1}</div>
                    <div className="text-xs font-bold tracking-wide leading-tight">{step}</div>
                    {idx === currentIdx && (
                      <div className="text-[9px] uppercase tracking-wider font-mono pt-1 text-cyan-400">
                        ▶ {existingApplication?.status === 'Approved' ? 'Approved' : existingApplication?.status || 'Pending'}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[#0c0824]/60 border border-white/[0.03] p-5 rounded-xl space-y-3">
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-purple-400">Registered Corporate Brief</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              {existingApplication?.description || "Syncing proposal briefing manifest files..."}
            </p>
            
            {existingApplication?.pitch_deck_url && (
              <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between">
                <span className="text-[10px] font-mono text-gray-500 uppercase">Vault Artifact Integration:</span>
                <a 
                  href={`http://localhost:8000${existingApplication.pitch_deck_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors underline uppercase tracking-wider"
                >
                  📁 File Asset Blueprint
                </a>
              </div>
            )}
          </div>
        </div>
      ) : (
       
        <div className="w-full max-w-xl bg-transparent">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black tracking-wide text-white uppercase">
              INCUBATION PROTOTYPE DEPLOYMENT
            </h2>
            <p className="text-gray-400 text-xs mt-1 font-sans">
              Register your enterprise matrix & upload master blueprint assets.
            </p>
          </div>

          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-xs font-mono border text-center transition-all duration-300 ${
              message.type === 'success' ? 'bg-emerald-950/30 border-emerald-500/20 text-emerald-400' : 'bg-rose-950/30 border-rose-500/20 text-rose-400'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-mono font-semibold text-purple-300 uppercase tracking-widest mb-2">Startup Enterprise Name</label>
                <input type="text" name="startupName" value={formData.startupName} onChange={handleInputChange} required className="w-full bg-[#1A143D]/60 border border-purple-900/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder-purple-900" placeholder="e.g. VentureNest Labs" />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-semibold text-purple-300 uppercase tracking-widest mb-2">Industry Sector Matrix</label>
                <input type="text" name="industrySector" value={formData.industrySector} onChange={handleInputChange} required className="w-full bg-[#1A143D]/60 border border-purple-900/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder-purple-900" placeholder="e.g. SaaS / AI Core" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold text-purple-300 uppercase tracking-widest mb-2">Executive Venture Brief</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="3" className="w-full bg-[#1A143D]/60 border border-purple-900/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-all placeholder-purple-900 resize-none" placeholder="Describe your core product architecture..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/[0.04] pt-5">
              <div>
                <label className="block text-[10px] font-mono font-semibold text-cyan-400 uppercase tracking-widest mb-2">Primary Pitch Deck (PDF)</label>
                <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setPitchDeck)} required className="w-full text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-mono file:bg-cyan-950/80 file:text-cyan-400 hover:file:bg-cyan-900 bg-[#1A143D]/30 p-2 rounded-xl border border-dashed border-purple-950" />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-semibold text-purple-300 uppercase tracking-widest mb-2">Business Plan Blueprint (Optional)</label>
                <input type="file" accept=".pdf" onChange={(e) => handleFileChange(e, setBusinessPlan)} className="w-full text-xs text-gray-400 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-mono file:bg-purple-950/80 file:text-purple-300 hover:file:bg-purple-900 bg-[#1A143D]/30 p-2 rounded-xl border border-dashed border-purple-950" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs py-3.5 px-6 rounded-xl transition-all disabled:opacity-50 mt-2 tracking-widest uppercase">
              {loading ? 'Processing File Vector Pipeline...' : 'Deploy Incubation Application'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ApplicationForm;