import React from 'react';

const faqData = [
  { q: "What is this platform used for?", a: "VentureNest is an enterprise SaaS framework tailored to deploy, automate, and monitor early-stage startup intake forms, pitch competitions, and mentor milestone logging workflows." },
  { q: "Who is the platform built for?", a: "Built explicitly for university networks, accelerator directors, technology hubs, and corporate venture management teams managing multiple startup tracks simultaneously." },
  { q: "Can I run both virtual and in-person programs?", a: "Yes. The architecture supports fully remote hybrid cohort flows, managing check-ins, asset delivery, and synchronous review parameters native to the system core." }
];

export default function Faq({ openFaq, toggleFaq }) {
  return (
    <section id="faq" className="py-24 px-6 sm:px-12 max-w-4xl mx-auto">
      <div className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">Frequently Asked Questions</h2>
          <p className="text-purple-300/40 text-xs font-light">Find quick answers to common questions about the platform, its features, and how to get started.</p>
        </div>

        <div className="space-y-3">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-[#050110] border border-white/[0.04] rounded-lg overflow-hidden">
              <button 
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-purple-950/10 transition focus:outline-none"
              >
                <span className="text-xs font-bold tracking-wide uppercase text-purple-200">{faq.q}</span>
                <span className="text-purple-400 text-xs font-mono">{openFaq === index ? '−' : '+'}</span>
              </button>
              {openFaq === index && (
                <div className="px-5 pb-4 pt-0 text-xs text-purple-300/50 leading-relaxed font-light border-t border-white/[0.02]">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}