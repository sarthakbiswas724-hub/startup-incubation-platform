import React from 'react';

export default function Hero({ setActiveTab, onExploreClick }) {
  return (
    <section id="home" className="max-w-5xl mx-auto px-6 pt-20 pb-24 flex flex-col items-center justify-center relative text-center">
      
    
      <div className="space-y-6 max-w-4xl mx-auto z-10">
        
        <div className="inline-flex items-center gap-2 bg-purple-950/30 border border-purple-500/10 px-3 py-1 rounded-full backdrop-blur-sm">
          
          <span className="text-[9px] font-mono font-bold tracking-[0.25em] text-purple-300 uppercase">
            ENTERPRISE OPERATIONS HUB
          </span>
        </div>
        
        <h1 className="text-6xl sm:text-8xl font-black tracking-[-0.03em] text-white uppercase leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          VENTURENEST
        </h1>

        <p className="text-xl sm:text-2xl font-light text-purple-100/90 tracking-wide uppercase max-w-2xl mx-auto font-sans">
          All-in-one incubation and acceleration platform
        </p>
        
        <p className="text-purple-300/40 text-xs sm:text-sm tracking-wide font-light max-w-xl mx-auto leading-relaxed">
          Built for incubators and accelerators helping startups move from idea to launch, growth, and investment readiness.
        </p>

       
        <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
          
          
          <button 
            onClick={onExploreClick}
            className="bg-white/5 hover:bg-white/10 border border-white/[0.08] text-white font-black text-[11px] uppercase tracking-widest px-8 py-4 rounded transition active:scale-[0.98]bg-purple"
          >
            Explore 
          </button>
        </div>

        <div className="pt-8 flex flex-col items-center gap-2 opacity-50">
        
          <p className="text-[9px] font-mono uppercase tracking-widest">Trusted by leading global startup ecosystems</p>
        </div>
      </div>
      
    </section>
  );
}