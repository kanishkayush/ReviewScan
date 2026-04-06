import React from 'react';
import { Terminal, ShieldX, ShieldCheck } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface ShapValue {
  feature: string;
  value: number;
}

interface ResultCardProps {
  label: string;
  probability: number;
  language: string;
  explanation: ShapValue[];
}

export const ResultCard: React.FC<ResultCardProps> = ({
  label,
  probability,
  language,
  explanation
}) => {
  const isFake = label === 'FAKE';
  const confidence = ((isFake ? probability : 1 - probability) * 100).toFixed(1);
  
  // Terminal styled tooltips
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#050510] border border-[#0ff] p-2 font-mono text-sm shadow-[0_0_10px_rgba(0,255,255,0.5)] z-50 relative">
          <p className="font-bold text-[#0ff] border-b border-[#0ff]/30 pb-1 mb-1">&gt;{label}_</p>
          <p className="text-[#39ff14]">
            VAL: [{payload[0].value.toFixed(3)}]
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full animate-slide-up flex flex-col gap-6 mt-4">
      {/* Primary Result Box */}
      <div className={`game-panel p-6 flex flex-col md:flex-row items-center md:items-start gap-6 border-2 shadow-[0_0_20px_inset] transition-all 
        ${isFake ? 'border-[#ff073a] shadow-[#ff073a]/30' : 'border-[#39ff14] shadow-[#39ff14]/30'}`}>
        
        {/* Status Badge */}
        <div className={`w-28 h-28 rounded-sm border-2 shrink-0 flex flex-col items-center justify-center p-2 relative overflow-hidden group
          ${isFake ? 'border-[#ff073a] text-[#ff073a] bg-[#ff073a]/10' : 'border-[#39ff14] text-[#39ff14] bg-[#39ff14]/10'}`}>
          <div className="absolute inset-0 bg-current opacity-10 animate-pulse"></div>
          {isFake ? <ShieldX size={44} className="mb-2" /> : <ShieldCheck size={44} className="mb-2" />}
          <span className="font-mono text-xs font-bold uppercase tracking-wider z-10">{isFake ? 'breach' : 'secure'}</span>
        </div>
        
        <div className="flex-1 w-full font-mono">
          <div className="flex flex-col md:flex-row items-baseline justify-between mb-2">
            <h3 className={`text-3xl font-black uppercase tracking-widest ${isFake ? 'text-neon-red animate-glitch' : 'text-neon-green'}`}>
              {isFake ? 'DECEPTION DETECTED' : 'AUTH_VERIFIED'}
            </h3>
            <div className="flex items-center gap-2 text-xs font-bold px-3 py-1 bg-white/10 mt-2 md:mt-0 text-[#0ff] border border-[#0ff]/50">
              <span>LANG_ID:</span>
              <span className="uppercase animate-pulse">{language}</span>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1 opacity-80 decoration-dashed">
              <span>SYS_CONFIDENCE</span>
              <span className={isFake ? 'text-[#ff073a]' : 'text-[#39ff14]'}>[{confidence}%]</span>
            </div>
            {/* Game Health Bar */}
            <div className="w-full h-4 bg-[#0a0a19] border border-[#b026ff]/40 p-[2px] relative overflow-hidden">
              {/* Scanline over bar */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+')] opacity-50 z-10 mix-blend-overlay pointer-events-none"></div>
              <div 
                className={`h-full transition-all duration-1000 ease-in-out relative ${isFake ? 'bg-[#ff073a]' : 'bg-[#39ff14]'}`}
                style={{ width: `${confidence}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SHAP Explanation Chart */}
      <div className="game-panel p-6 mb-8 border border-[#0ff]/40 shadow-none">
        <div className="flex items-center justify-between border-b border-[#0ff]/20 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Terminal className="text-[#0ff] animate-pulse" size={20} />
            <h4 className="font-mono font-bold text-lg text-[#0ff] tracking-widest uppercase">SHAP_DIAGNOSTICS</h4>
          </div>
          <div className="text-[10px] font-mono opacity-50 bg-[#0ff]/10 px-2 py-1">[LOGS: EXPORTED]</div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={explanation}
              margin={{ top: 0, right: 30, left: 30, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="2 4" horizontal={false} stroke="#b026ff" className="opacity-20" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="feature" 
                type="category" 
                axisLine={{ stroke: '#0ff', strokeWidth: 1 }}
                tickLine={{ stroke: '#0ff' }}
                width={150}
                tick={{fill: '#0ff', opacity: 0.9, fontSize: 11, fontFamily: 'monospace'}} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{fill: '#fff', opacity: 0.05}} />
              <Bar 
                dataKey="value" 
                fill="var(--color-game-cyan)" 
                radius={[0, 2, 2, 0]} 
                barSize={20}
                animationDuration={1500}
                animationEasing="linear"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] font-mono text-center mt-6 uppercase text-[#b026ff] tracking-[0.2em] border-t border-[#b026ff]/20 pt-2 w-max mx-auto px-4">
          Visualizing internal node activations
        </p>
      </div>
    </div>
  );
};
