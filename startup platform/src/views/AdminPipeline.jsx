import React, { useState, useEffect } from 'react';

const AdminPipeline = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  // Strict manager authorization guard rule
  const isAuthorizedManager = userRole === 'Admin' || userRole === 'Incubation Mentor' || userRole === 'Mentor';

  const fetchApplications = async () => {
    if (!isAuthorizedManager) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/applications/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setApplications(data);
      } else {
        setError(data.detail || 'Failed to sync pipeline matrix data.');
      }
    } catch (err) {
      setError('Cannot establish uplink connection to server engine.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (appId, newStatus) => {
    const formData = new FormData();
    formData.append('new_status', newStatus);

    try {
      const response = await fetch(`http://localhost:8000/api/v1/applications/${appId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setApplications(prevApps =>
          prevApps.map(app => app.id === appId ? { ...app, status: newStatus } : app)
        );
      } else {
        alert('Failed to execute status change state transition.');
      }
    } catch (err) {
      alert('Communication crash during deployment lifecycle transition.');
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-950/50 border-emerald-500/30 text-emerald-400';
      case 'Rejected': return 'bg-rose-950/50 border-rose-500/30 text-rose-400';
      case 'Under Review': return 'bg-amber-950/50 border-amber-500/30 text-amber-400';
      case 'Interview Scheduled': return 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400';
      default: return 'bg-purple-950/50 border-purple-500/30 text-purple-400';
    }
  };

 
  if (!isAuthorizedManager) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
        <h3 className="text-rose-400 font-mono font-bold text-sm uppercase tracking-widest mb-2">Access Restriction Triggered</h3>
        <p className="text-xs text-gray-400">Your current account authority level does not possess pipeline orchestration credentials. Please track your application status within the Apply Portal.</p>
      </div>
    );
  }

  if (loading) return <div className="text-center py-12 text-sm font-mono text-purple-400">Syncing Matrix Pipeline Data Vectors...</div>;
  if (error) return <div className="text-center py-12 text-sm text-rose-400 font-semibold">{error}</div>;

  return (
    <div className="space-y-8">
      <div className="border-b border-white/[0.04] pb-6">
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          INCUBATION PIPELINE MANAGEMENT WORKSPACE
        </h2>
        <p className="text-gray-400 text-xs mt-1">Review active enterprise metrics and advance lifecycle deployment tracks</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">No incoming applications currently located within database grid.</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app) => (
            <div key={app.id} className="bg-[#0C0824]/60 border border-purple-950/50 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-purple-800/40 transition-all duration-300">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-white tracking-wide">{app.startup_name}</h3>
                  <span className={`text-[10px] font-mono uppercase px-2.5 py-1 border rounded-full tracking-wider ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-xs font-medium text-purple-300">Sector: <span className="text-gray-300 font-normal">{app.industry_sector}</span></p>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{app.description}</p>
                
                {app.pitch_deck_url && (
                  <div className="pt-2">
                    <a 
                      href={`http://localhost:8000${app.pitch_deck_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1"
                    >
                      📁 Analyze Pitch Vector Deck
                    </a>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto border-t md:border-t-0 border-purple-950/50 pt-4 md:pt-0">
                <label className="text-[10px] font-mono tracking-widest text-purple-400/70 uppercase">Lifecycle Control</label>
                <select
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                  className="bg-[#151035] border border-purple-900/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer w-full md:w-48 font-semibold"
                >
                  <option value="Pending">Pending Sync</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Interview Scheduled">Schedule Interview</option>
                  <option value="Approved">Approve / Incubate</option>
                  <option value="Rejected">Reject / Archive</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPipeline;