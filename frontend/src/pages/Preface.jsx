import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Radio, Compass, ArrowRight, Activity, Terminal } from 'lucide-react';

export const Preface = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(15);
  const [telemetry, setTelemetry] = useState([
    'Initializing NammaFix Core v2.0...',
  ]);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setStep(1);
      setProgress(40);
      setTelemetry((prev) => [...prev, 'Establishing secure WebSocket handshake to city sensors...']);
    }, 900);

    const timer2 = setTimeout(() => {
      setStep(2);
      setProgress(75);
      setTelemetry((prev) => [...prev, 'Loading MapLibre vector tiles via MapTiler Streets API...']);
    }, 1800);

    const timer3 = setTimeout(() => {
      setStep(3);
      setProgress(100);
      setTelemetry((prev) => [...prev, 'Live Civic Mesh Synchronized. System Operational.']);
    }, 2700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleEnter = (path = '/') => {
    localStorage.setItem('nammafix_preface_seen', 'true');
    navigate(path);
  };

  return (
    <div className="relative min-h-screen w-full bg-white text-[#1A120E] flex flex-col items-center justify-between p-6 sm:p-12 overflow-hidden selection:bg-[#A88462] selection:text-white">
      {/* Background Subtle Warm Dot Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(#D5C4AE 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A88462]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar / Status Header */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10 border-b border-[#E8E2D9] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#FBF9F6] border border-[#E8E2D9] flex items-center justify-center text-[#A88462] shadow-2xs">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '18s' }} />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-[#1A120E]">
              NAMMAFIX <span className="text-[#6B4A2E] font-mono text-xs ml-1.5 px-2 py-0.5 rounded-md bg-[#FBF9F6] border border-[#E8E2D9]">v2.0</span>
            </h1>
            <p className="text-[11px] text-[#A88462] tracking-wider uppercase font-semibold">Urban Infrastructure & Rapid Resolution</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[#FBF9F6] border border-[#E8E2D9] px-3.5 py-1.5 rounded-full text-[#1A120E] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
          <span>MESH NODE: CHN-CENTRAL</span>
        </div>
      </header>

      {/* Central Visual Stage */}
      <main className="w-full max-w-3xl flex flex-col items-center my-auto py-8 z-10 text-center">
        {/* Animated Radar Vector Icon */}
        <div className="relative w-44 h-44 mb-8 flex items-center justify-center">
          {/* Animated concentric rings */}
          <div className="absolute inset-0 rounded-full border border-[#A88462]/30 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute inset-3 rounded-full border border-[#D5C4AE]" />
          <div className="absolute inset-8 rounded-full border border-dashed border-[#A88462]/60 animate-spin" style={{ animationDuration: '24s' }} />
          <div className="absolute inset-14 rounded-full bg-[#FBF9F6] border border-[#E8E2D9] flex items-center justify-center shadow-lg">
            <Radio className="w-8 h-8 text-[#A88462] animate-pulse" />
          </div>
          {/* Orbiting blips */}
          <div className="absolute top-2 right-8 w-2.5 h-2.5 rounded-full bg-[#1A120E] shadow-sm" />
          <div className="absolute bottom-4 left-6 w-2 h-2 rounded-full bg-[#A88462] shadow-sm" />
        </div>

        {/* Hero Title & Subtitle */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1A120E] tracking-tight leading-tight max-w-2xl">
          Real-Time Civic Care <br className="hidden sm:inline"/>
          <span className="text-[#A88462]">Powered by Community Intelligence</span>
        </h2>
        <p className="mt-4 text-sm sm:text-base text-[#6B4A2E] max-w-xl leading-relaxed">
          Geo-referenced incident reporting, live municipal dispatch tracking, and MapLibre spatial intelligence for your neighborhood.
        </p>

        {/* Loading Bar */}
        <div className="w-full max-w-md mt-8 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-[#6B4A2E]">
            <span>SYSTEM INITIALIZATION</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-[#FBF9F6] rounded-full overflow-hidden border border-[#E8E2D9]">
            <div 
              className="h-full bg-gradient-to-r from-[#D5C4AE] via-[#A88462] to-[#6B4A2E] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Console / Telemetry Log */}
        <div className="w-full max-w-md mt-6 bg-[#FBF9F6] border border-[#E8E2D9] rounded-2xl p-3 text-left font-mono text-xs text-[#1A120E] shadow-inner h-24 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-[11px] text-[#8A7B6E] mb-1 border-b border-[#E8E2D9] pb-1">
            <Terminal className="w-3.5 h-3.5 text-[#A88462]" />
            <span className="font-semibold">DIAGNOSTIC STREAM</span>
          </div>
          {telemetry.map((line, idx) => (
            <div key={idx} className="flex items-center gap-2 py-0.5 text-[11px]">
              <span className="text-emerald-600 font-bold">›</span>
              <span className="text-[#1A120E]">{line}</span>
            </div>
          ))}
        </div>

        {/* CTA Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <button
            onClick={() => handleEnter('/')}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-[#A88462] hover:bg-[#8F6D4C] text-white font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] cursor-pointer"
          >
            <span>Launch Citizen App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleEnter('/admin')}
            className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-white hover:bg-[#FBF9F6] text-[#1A120E] border border-[#E8E2D9] font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-[#A88462]" />
            <span>Admin Center</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl flex items-center justify-between text-xs text-[#6B4A2E] border-t border-[#E8E2D9] pt-4 z-10">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#A88462]" />
          <span className="font-mono">Coordinates: 13.0418° N, 80.2337° E</span>
        </div>
        <button
          onClick={() => handleEnter('/')}
          className="text-xs font-semibold text-[#6B4A2E] hover:text-[#1A120E] underline transition-colors cursor-pointer"
        >
          Skip Intro →
        </button>
      </footer>
    </div>
  );
};
