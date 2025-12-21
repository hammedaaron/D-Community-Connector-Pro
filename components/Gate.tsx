
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { getParties, validateAdminPassword, validateDevPassword, registerParty, loginUser, registerUser, checkUserExists, findPartyByName, ensureDevUser } from '../db';
import LandingPage from './LandingPage';

interface GateProps {
  onAuth: (user: User) => void;
}

const Gate: React.FC<GateProps> = ({ onAuth }) => {
  const [mode, setMode] = useState<'land' | 'admin-signup' | 'login' | 'success'>('land');
  const [partyName, setPartyName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dbParties, setDbParties] = useState<{name: string}[]>([]);

  useEffect(() => {
    const fetchParties = async () => {
      try {
        const parties = await getParties();
        setDbParties(parties || []);
      } catch (err) {
        console.error("Supabase Connectivity Error:", err);
      }
    };
    fetchParties();

    const match = window.location.hash.match(/#\/party\/([1-9]{2})(?:\/([^\/]+))?/);
    if (match && match[2]) {
      setPartyName(decodeURIComponent(match[2].replace(/-/g, ' ')));
      setMode('login');
    }
  }, []);

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (username !== 'Admin') throw new Error("Admin username must be 'Admin'.");
      await registerParty(partyName, password);
      setMode('success');
      const parties = await getParties();
      setDbParties(parties);
    } catch (err: any) {
      setError(err.message || "Failed to create community.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const cleanUsername = username.trim();
    const cleanPassword = password.trim();

    // DEV CHECK: Sync with DB to avoid Foreign Key violations
    if (cleanUsername === 'Dev' && validateDevPassword(cleanPassword)) {
      try {
        const devUser = await ensureDevUser();
        onAuth(devUser);
        return;
      } catch (err) {
        setError("Failed to initialize System Architect node.");
        return;
      }
    }

    const cleanPartyName = partyName.trim();
    if (!cleanPartyName) {
      setError("Please enter a Membership name.");
      return;
    }

    try {
      const activeParty = await findPartyByName(cleanPartyName);
      if (!activeParty) {
        setError(`Membership "${cleanPartyName}" not found.`);
        return;
      }

      const user = await loginUser(cleanUsername, cleanPassword, activeParty.id);

      if (user) {
        onAuth(user);
      } else {
        const isAdminCheck = validateAdminPassword(cleanPassword);
        if (isAdminCheck) {
          setError("Invalid admin credentials for this community.");
          return;
        }

        const exists = await checkUserExists(cleanUsername, activeParty.id);
        if (exists) {
          setError("Invalid credentials.");
        } else {
          const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: cleanUsername,
            password: cleanPassword,
            role: UserRole.REGULAR,
            partyId: activeParty.id
          };
          await registerUser(newUser);
          onAuth(newUser);
        }
      }
    } catch (err: any) {
      setError("Authentication failed.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 overflow-y-auto custom-scrollbar">
      <div className="fixed inset-0 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-full bg-violet-600/20 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-start py-10">
        {mode === 'land' ? (
          <LandingPage 
            onCreate={() => { setMode('admin-signup'); setPartyName(''); setError(''); }}
            onJoin={() => { setMode('login'); setError(''); }}
          />
        ) : (
          <div className="w-full max-w-xl px-4 animate-in fade-in zoom-in-95 duration-500">
            {(mode === 'admin-signup' || mode === 'login') && (
              <form onSubmit={mode === 'admin-signup' ? handleAdminSignup : handleLogin} className="bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl space-y-6">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex flex-col">
                    <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                      {mode === 'admin-signup' ? 'Setup Your Hub' : 'Identity Membership'}
                    </h2>
                    <p className="text-slate-400 text-xs font-bold mt-1">
                      {mode === 'admin-signup' ? 'Create a unique name for your community.' : 'Enter the name of the community you want to join.'}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2 flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      Membership Name
                    </label>
                    <div className="relative">
                      <input placeholder="e.g. Biz High Ranker" value={partyName} onChange={e => setPartyName(e.target.value)}
                        className="w-full bg-slate-800 border-slate-700 text-white rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 outline-none border transition-all" />
                      {mode === 'login' && dbParties.length > 0 && !partyName && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl p-3 z-50 shadow-xl max-h-32 overflow-y-auto custom-scrollbar">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">Registered Communities:</p>
                           <div className="flex flex-wrap gap-2">
                             {dbParties.map(p => (
                               <button key={p.name} type="button" onClick={() => setPartyName(p.name)} className="text-[10px] font-bold bg-slate-700 hover:bg-indigo-600 text-slate-300 hover:text-white px-2 py-1 rounded-md transition-colors">
                                 {p.name}
                               </button>
                             ))}
                           </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Username</label>
                      <input required placeholder={mode === 'admin-signup' ? "Admin" : "Your name"} value={username} onChange={e => setUsername(e.target.value)}
                        className="w-full bg-slate-800 border-slate-700 text-white rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 outline-none border transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Password</label>
                      <input type="password" required placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)}
                        className="w-full bg-slate-800 border-slate-700 text-white rounded-2xl px-6 py-4 font-bold focus:ring-2 focus:ring-indigo-500 outline-none border transition-all" />
                    </div>
                  </div>
                </div>
                
                {error && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center leading-relaxed">{error}</p>}
                
                <button className={`w-full py-5 text-white font-black rounded-2xl transition-all shadow-xl uppercase tracking-widest ${mode === 'admin-signup' ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'}`}>
                  {mode === 'admin-signup' ? 'Establish Membership' : 'Verify & Enter'}
                </button>
                <button type="button" onClick={() => { setMode('land'); setError(''); }} className="w-full text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:text-white transition-colors">Abort Access</button>
              </form>
            )}

            {mode === 'success' && (
              <div className="bg-slate-900 border border-slate-800 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3rem] shadow-2xl text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-white">Membership Active</h2>
                  <p className="text-slate-400 font-medium">Hub "{partyName}" is registered globally.</p>
                </div>
                
                <div className="p-6 bg-slate-800/50 rounded-[2rem] border border-slate-700 space-y-4">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Required Access Credentials</p>
                  <div className="flex items-center justify-between bg-slate-950 px-5 py-3 rounded-xl border border-indigo-500/10">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Membership:</span>
                    <span className="text-sm font-black text-indigo-400">{partyName}</span>
                  </div>
                </div>

                <div className="pt-4 space-y-4">
                  <button 
                    onClick={() => { setMode('login'); }}
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-indigo-500/20 uppercase tracking-widest"
                  >
                    Proceed to Login
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Gate;
