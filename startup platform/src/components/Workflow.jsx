import React from 'react';

const workflowSteps = [
  { step: "01", title: "IDEATE", desc: "Identify problems and explore ideas with purpose." },
  { step: "02", title: "VALIDATE", desc: "Research, validate, and refine your solution framework." },
  { step: "03", title: "BUILD", desc: "Create your product and build a strong development foundation." },
  { step: "04", title: "LAUNCH", desc: "Go to market and attract your first programmatic customers." },
  { step: "05", title: "GROW", desc: "Optimize, grow your cohort businesses, and expand your operational reach." },
  { step: "06", title: "SCALE", desc: "Scale sustainably and create lasting institutional ecosystem impact." }
];

export default function Workflow() {
  return (
    <section id="workflow" className="border-t border-white/[0.02] bg-[#05010e] py-24 px-6 sm:px-12">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase block">Program Lifecycle</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Launch and scale your incubator</h2>
          <p className="text-purple-300/40 text-xs font-light">From registration to growth, VentureNest helps you manage everything in one place.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {workflowSteps.map((item, idx) => (
            <div key={idx} className="bg-purple-950/[0.1] border border-white/[0.03] p-6 rounded-lg flex items-start gap-4 hover:border-purple-500/20 hover:bg-purple-950/15 transition-all duration-300">
              <div className="text-[10px] font-mono font-black text-purple-400 bg-purple-950/50 border border-purple-900/30 w-7 h-7 rounded flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono">{item.title}</h4>
                <p className="text-purple-300/40 text-xs font-light leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}