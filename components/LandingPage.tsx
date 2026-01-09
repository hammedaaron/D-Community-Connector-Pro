
import React from 'react';

interface LandingPageProps {
  onCreate: () => void;
  onJoin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCreate, onJoin }) => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-6 pt-8 pb-32 space-y-24 overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* BRAND HEADER */}
      <header className="flex justify-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="group flex items-center gap-3 py-2 px-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl transition-all hover:border-indigo-500/50">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
            D
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">Infrastructure</span>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.1em] brand-glow">
              Connector <span className="text-indigo-400">Pro</span>
            </h2>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
        <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Protocol V3.2 Active
        </div>
        
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[0.95] max-w-5xl mx-auto">
          Engagement is <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-500 bg-[length:200%_auto] animate-[gradientScent_8s_linear_infinite]">Verifiable Capital.</span>
        </h1>
        
        <p className="text-slate-400 text-lg lg:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
          The high-ticket answer to "Ghosting." D-CEP is a specialized engine where elite communities meet verified interaction. No bots. No leechers. Just pure authority.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
          <button 
            onClick={onCreate}
            className="w-full sm:w-auto px-12 py-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[2rem] shadow-2xl shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.2em] text-sm"
          >
            Establish New Hub
          </button>
          <button 
            onClick={onJoin}
            className="w-full sm:w-auto px-12 py-6 bg-slate-900 border border-slate-800 text-white font-black rounded-[2rem] hover:border-emerald-500 transition-all hover:scale-105 active:scale-95 uppercase tracking-[0.2em] text-sm"
          >
            Enter Sector
          </button>
        </div>
      </section>

      {/* PROBLEM / SOLUTION DEEP DIVE */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start py-12">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tight uppercase leading-none">Solving the <br /><span className="text-red-500">Chaos</span> of Social Streams.</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs leading-relaxed">Chat groups fail because they lack accountability. D-CEP replaces scrolling noise with rigid, verifiable protocol.</p>
          </div>

          <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 group hover:border-red-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <h4 className="text-white font-black uppercase text-sm mb-4">The Leech Problem</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wide">In typical groups, users "drop links and run." D-CEP's Trace Mechanic ensures no follow goes unreciprocated. If they connect with you, your system pins them until you've verified the return handshake.</p>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-slate-800 group hover:border-indigo-500/30 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="text-white font-black uppercase text-sm mb-4">Shadow-Ban Prevention</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-bold uppercase tracking-wide">Bots get you banned. D-CEP mandates a "Profile Gateway." Operatives must manually open the target profile before the system unlocks the connection action. This ensures every click is human-verified and algorithm-safe.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full" />
          <div className="relative p-2 glass-card rounded-[4rem] border border-white/5 shadow-3xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 z-10" />
            <img 
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000" 
              alt="Secure Network Node" 
              className="rounded-[3.8rem] w-full object-cover grayscale brightness-75 group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute bottom-12 left-12 right-12 z-20 space-y-6">
              <div className="p-6 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-4">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Verification Status</span>
                  <span className="text-[10px] font-black text-emerald-500 uppercase">Secure</span>
                </div>
                <div className="space-y-3">
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-indigo-500 animate-pulse" />
                  </div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Active Pulse: Operative Node 0x88...F2 Verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE PILLARS OF STRUCTURE */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase">The Architecture <br /><span className="text-indigo-400">of Growth</span></h2>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Standardized. Scalable. Secure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: "📁", 
              title: "Folder Isolation", 
              desc: "Instead of one giant chat, break your community into niche folders. Each folder is a clean, searchable grid of profile cards. No one gets buried." 
            },
            { 
              icon: "⚡", 
              title: "Trace Mechanics", 
              desc: "Our persistent notification system traces every 'Handshake'. A notification stays in your dashboard until you complete the reciprocation loop." 
            },
            { 
              icon: "🛡️", 
              title: "Admin Sovereignty", 
              desc: "Admins aren't just moderators; they are architects. Control folders, pin system-wide instructions, and manage member credentials from one console." 
            }
          ].map((item, i) => (
            <div key={i} className="p-10 rounded-[3rem] bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all hover:-translate-y-2 group">
              <div className="text-5xl mb-8 group-hover:scale-110 transition-transform inline-block">{item.icon}</div>
              <h3 className="text-2xl font-black text-white mb-4 uppercase tracking-tight">{item.title}</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] leading-relaxed opacity-70">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="text-center py-24 relative">
        <div className="absolute inset-0 bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="relative z-10 space-y-10">
          <h2 className="text-5xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-none">Command your <br /><span className="text-indigo-500">Community.</span></h2>
          <button 
            onClick={onCreate}
            className="px-16 py-8 bg-white text-black font-black rounded-[2.5rem] shadow-3xl shadow-white/10 hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.4em] text-sm"
          >
            Deploy Engine Now
          </button>
        </div>
      </section>

      <footer className="pt-20 border-t border-slate-900 flex flex-col items-center gap-6 opacity-40">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">
          Developed by <span className="text-slate-300">HAMS☆R</span>
          <div className="w-1 h-1 rounded-full bg-slate-800" />
          Ver 3.2.0
        </div>
        <p className="text-slate-700 text-[8px] font-bold uppercase tracking-widest text-center">
          © 2025 D-CEP ARCHITECTS. THE STANDARD FOR HIGH-TICKET ACCOUNTABILITY.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
