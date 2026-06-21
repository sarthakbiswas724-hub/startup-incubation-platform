import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Student Founder'); 
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (isRegistering) {
      
      try {
        const response = await fetch('http://localhost:8000/api/v1/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, full_name: fullName, role }),
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.detail || 'Registration failed');
        
        setIsRegistering(false);
        alert('Account created successfully! Please sign in.');
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
     
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      try {
        const response = await fetch('http://localhost:8000/api/v1/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData,
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.detail || 'Invalid email or password');

        localStorage.setItem('token', data.access_token);
        localStorage.setItem('role', data.role);

        onLoginSuccess(data.role);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#060212] px-4">
      <div className="w-full max-w-md p-8 bg-[#050210] border border-white/[0.04] rounded-xl shadow-2xl relative">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500" />
        
        <h2 className="text-2xl font-bold text-center text-white mb-2 tracking-wide">
          {isRegistering ? 'CREATE PORTAL ACCOUNT' : 'VENTURENEST PORTAL'}
        </h2>
        <p className="text-center text-xs text-purple-400/60 font-mono uppercase tracking-widest mb-6">
          {isRegistering ? 'Global Incubation Matrix' : 'Secure Core Access'}
        </p>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-purple-400 mb-1">Full Name</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2 bg-[#0c0620] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-purple-400 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-[#0c0620] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-purple-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-[#0c0620] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              required 
            />
          </div>

          {isRegistering && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-purple-400 mb-1">Portal System Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 bg-[#0c0620] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="Student Founder">Student Founder</option>
                <option value="Incubation Mentor">Incubation Mentor</option>
                <option value="Investor / Judge">Investor / Judge</option>
                <option value="Admin">System Administrator</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all shadow-lg shadow-purple-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Processing Network...' : isRegistering ? 'Initialize Register' : 'Secure Authorization'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
            className="text-xs text-purple-400/80 hover:text-purple-300 transition-colors underline decoration-purple-500/30"
          >
            {isRegistering ? 'Already registered? Access Authorization Portal' : 'New entity? Apply for Matrix Access'}
          </button>
        </div>
      </div>
    </div>
  );
}