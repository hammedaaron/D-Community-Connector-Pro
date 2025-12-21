
import React from 'react';

interface LandingPageProps {
  onCreate: () => void;
  onJoin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onCreate, onJoin }) => {
  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 pt-4 lg:pt-6 pb-20 space-y-8 lg:space-y-12 overflow-x-hidden">
      
      {/* BRAND HEADER - Minimum margins for tight proximity */}
      <header className="flex justify-center mb-2">
        <div className="group flex items-center gap-3 py-2 px-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md transition-all hover:border-indigo-500/50">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/20 group-hover:rotate-12 transition-transform">
            D
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Community</span>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.1em] brand-glow">
              Connector <span className="text-indigo-400">Pro</span>
            </h2>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO - Forced two-line headline and reduced gap */}
      <section className="text-center space-y-4 lg:space-y-6 animate-in fade-in zoom-in-95 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Next-Gen Community Infrastructure
        </div>
        
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.05] lg:leading-[1] lg:max-w-5xl mx-auto">
          Scale Your Community <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-400">Without the Chaos.</span>
        </h1>
        
        <p className="text-slate-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-medium leading-relaxed px-2">
          The visual, smart way for high-growth communities to connect, follow, and grow — without the endless scrolling of messy chat streams.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 px-4 sm:px-0">
          <button 
            onClick={onCreate}
            className="w-full sm:w-auto px-8 lg:px-10 py-4 lg:py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-2xl shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs lg:text-sm"
          >
            Launch a Smarter Community
          </button>
          <button 
            onClick={onJoin}
            className="w-full sm:w-auto px-8 lg:px-10 py-4 lg:py-5 bg-slate-900 border border-slate-800 text-white font-black rounded-2xl hover:border-emerald-500 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-xs lg:text-sm"
          >
            Join Existing Membership
          </button>
        </div>

        {/* Dashboard Preview Animation Mockup */}
        <div className="relative mt-6 lg:mt-10 group px-2 lg:px-0">
          <div className="absolute inset-0 bg-indigo-500/20 blur-[60px] lg:blur-[100px] rounded-full group-hover:bg-indigo-500/30 transition-all"></div>
          <div className="relative glass-card border border-white/10 rounded-[2rem] lg:rounded-[3rem] p-4 lg:p-8 shadow-2xl overflow-hidden aspect-video max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4 lg:mb-6 border-b border-white/5 pb-4">
              <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-red-500/50"></div>
              <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-amber-500/50"></div>
              <div className="w-2 h-2 lg:w-3 lg:h-3 rounded-full bg-emerald-500/50"></div>
              <div className="ml-2 lg:ml-4 h-3 lg:h-4 w-24 lg:w-32 bg-white/10 rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 lg:gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={`h-20 lg:h-32 rounded-2xl lg:rounded-3xl bg-white/5 border border-white/5 animate-pulse flex items-center justify-center`} style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-white/10"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: PAIN */}
      <section className="space-y-10 lg:space-y-14 px-2">
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tight">Communities are Broken.</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] lg:text-xs">The Scrolling Nightmare Ends Here</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] bg-red-500/5 border border-red-500/10 space-y-3 lg:space-y-4">
              <h3 className="text-red-400 font-black text-lg lg:text-xl flex items-center gap-3">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Chat streams scroll away.
              </h3>
              <p className="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">You mean to follow back... but the message is gone. You want to check a profile later... but you can't find it in the noise.</p>
            </div>
            <div className="p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] bg-slate-900 border border-slate-800 space-y-3 lg:space-y-4">
              <h3 className="text-white font-black text-lg lg:text-xl flex items-center gap-3">
                <svg className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                High effort, low reward.
              </h3>
              <p className="text-slate-400 text-sm lg:text-base font-medium leading-relaxed">Following back becomes a slow, manual chore. Engagement drops because the barrier to entry is too high.</p>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 group">
             <div className="absolute -inset-4 bg-indigo-500/10 rounded-[3rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative bg-slate-900 border border-slate-800 p-6 rounded-[2rem] lg:rounded-[3rem] shadow-2xl">
               <div className="space-y-3 opacity-30 select-none pointer-events-none">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="flex gap-3 items-start">
                     <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-slate-700"></div>
                     <div className="flex-1 space-y-2">
                       <div className="h-2 w-16 lg:w-20 bg-slate-700 rounded"></div>
                       <div className="h-1.5 w-full bg-slate-800 rounded"></div>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-red-500/90 text-white font-black px-4 lg:px-6 py-2 rounded-xl shadow-xl rotate-[-5deg] text-[10px] lg:text-sm uppercase tracking-widest">CHAOTIC STREAM</div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT IS CCP */}
      <section className="bg-indigo-600 rounded-[2.5rem] lg:rounded-[4rem] p-8 lg:p-20 relative overflow-hidden text-center space-y-6 lg:space-y-8">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
        <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white tracking-tighter relative z-10 leading-[1.2]">CCP turns communities into structured networks, not scrolling conversations.</h2>
        <p className="text-white/80 text-base lg:text-xl max-w-3xl mx-auto font-medium relative z-10">
          We replace messy chat streams with a visual, card-based dashboard where every connection happens in seconds.
        </p>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="space-y-12 lg:space-y-16 px-2">
        <div className="text-center space-y-4">
          <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tight">How it Works</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] lg:text-xs">Simple. Fair. Seamless.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {[
            { step: "01", title: "Setup Hub", desc: "Admins launch a hub for F4F or pods in 60 seconds." },
            { step: "02", title: "Join Folders", desc: "Every member gets a visible profile card. No one gets buried." },
            { step: "03", title: "1-Click Follow", desc: "Click a member to follow instantly. Fast and efficient." },
            { step: "04", title: "Smart Trace", desc: "Notifications trace users back. One click to follow back." }
          ].map((item, i) => (
            <div key={i} className="group p-6 lg:p-8 bg-slate-900 border border-slate-800 rounded-[2rem] lg:rounded-[2.5rem] hover:border-indigo-500 transition-all hover:-translate-y-2">
              <div className="text-indigo-500 font-black text-4xl lg:text-5xl mb-4 lg:mb-6 opacity-20 group-hover:opacity-100 transition-opacity tracking-tighter">{item.step}</div>
              <h3 className="text-white font-black text-lg lg:text-xl mb-2 lg:mb-3">{item.title}</h3>
              <p className="text-slate-500 font-medium text-xs lg:text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 6 & 7: FINAL CTA */}
      <section className="text-center space-y-10 lg:space-y-12 pb-12 lg:pb-20 px-4">
        <div className="space-y-4">
          <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1]">Ready to fix the chaos?</h2>
          <p className="text-slate-400 text-base lg:text-xl max-w-2xl mx-auto font-medium">
            The bigger your community gets, the worse chaos becomes. Fix it early.
          </p>
        </div>

        <div className="p-1 rounded-[2rem] lg:rounded-[3rem] bg-gradient-to-r from-indigo-500 to-emerald-400 max-w-sm lg:max-w-md mx-auto">
          <button 
            onClick={onCreate}
            className="w-full py-5 lg:py-6 bg-slate-950 rounded-[1.9rem] lg:rounded-[2.9rem] text-white font-black text-base lg:text-lg hover:bg-transparent transition-all uppercase tracking-[0.2em]"
          >
            Get Started Now
          </button>
        </div>

        {/* DEVELOPER CREDIT */}
        <div className="pt-16 lg:pt-20 border-t border-slate-900 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-slate-600 font-black text-[9px] lg:text-[10px] uppercase tracking-[0.4em]">
            Developed by <span className="text-slate-400">HAMS☆R</span>
          </div>
          <div className="text-slate-700 text-[8px] font-bold uppercase tracking-widest">
            © 2024 Community Connector Pro. All Rights Reserved.
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
