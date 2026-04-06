import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReviewAnalyzer } from './components/ReviewAnalyzer';
import { Crosshair } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <header className="w-full flex justify-between items-center p-6 mx-auto max-w-5xl border-b-2 border-purple-500/30">
        <div className="flex items-center gap-3 animate-pulse">
          <Crosshair size={32} className="text-[#0ff]" />
          <h1 className="text-3xl font-black tracking-widest text-[#0ff] drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] uppercase font-mono">
            VERISIGHT_AI [v1.0]
          </h1>
        </div>
        <div className="text-xs font-mono font-bold tracking-widest text-[#b026ff] animate-flash">
          SYSTEM_ONLINE
        </div>
      </header>

      <main className="w-full max-w-5xl mx-auto px-6 py-12 flex flex-col items-center relative z-10">
        <div className="text-center max-w-2xl mb-12 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter uppercase text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
            INITIATE <span className="text-[#39ff14] drop-shadow-[0_0_15px_rgba(57,255,20,0.8)]">XLM-ROBERTA</span> SCAN
          </h2>
          <p className="text-sm font-mono opacity-80 leading-relaxed max-w-xl mx-auto border-l-2 border-[#0ff] pl-4 text-left">
            &gt; ENGAGING DEEP LEARNING MODEL...<br/>
            &gt; TARGET IDENTIFIED: CUSTOMER REVIEW DATA<br/>
            &gt; AWAITING TEXT INPUT SEQUENCE TO EXPOSE DECEPTIVE PATTERNS...
          </p>
        </div>

        <ReviewAnalyzer />
      </main>
    </QueryClientProvider>
  );
}

export default App;
