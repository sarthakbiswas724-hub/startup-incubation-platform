import React from 'react';

export default function Backdrop() {
  const spotlightGlow = "absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.15),transparent_50%)] pointer-events-none z-0";
  const leftAmbient = "absolute top-[10%] left-[-10%] w-96 h-96 bg-purple-900/10 blur-[120px] rounded-full pointer-events-none z-0";
  const rightAmbient = "absolute top-[30%] right-[-10%] w-96 h-96 bg-indigo-950/20 blur-[120px] rounded-full pointer-events-none z-0";
  const dotGrid = "absolute inset-0 bg-[radial-gradient(rgba(139,92,246,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0";

  return (
    <>
      <div className={spotlightGlow} />
      <div className={leftAmbient} />
      <div className={rightAmbient} />
      <div className={dotGrid} />
    </>
  );
}