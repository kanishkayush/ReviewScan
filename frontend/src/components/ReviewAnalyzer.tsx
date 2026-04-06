import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ResultCard } from './ResultCard';
import { Loader2, Zap } from 'lucide-react';

export const ReviewAnalyzer = () => {
  const [text, setText] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const { mutate, data, isPending, isError } = useMutation({
    mutationFn: async (reviewText: string) => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await axios.post(`${apiUrl}/predict`, { text: reviewText });
      return res.data;
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length > 5) {
      mutate(text);
    }
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      <form onSubmit={handleSubmit} className={`w-full game-panel flex flex-col p-1 mb-8 transition-transform ${isPending ? 'scale-[1.02] border-[#0ff]' : ''}`}>
        
        {/* Decorative corner markers */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#0ff]"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#0ff]"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#0ff]"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#0ff]"></div>

        <textarea
          className="w-full min-h-[180px] p-5 bg-[#0a0a19]/80 text-[#39ff14] font-mono outline-none resize-none text-lg placeholder:text-[#39ff14]/30 placeholder:uppercase"
          placeholder="[ PASTE SUSPICIOUS COMMUNIQUE HERE... ]"
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          disabled={isPending}
        />
        
        <div className="w-full flex justify-between items-center p-3 bg-black/50 border-t border-[#b026ff]/30">
          <div className="text-xs font-mono text-[#b026ff]">
            CHAR_COUNT: [{String(text.length).padStart(4, '0')}]
          </div>
          
          <button 
            type="submit"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={isPending || text.length < 5}
            className={`btn-arcade flex items-center gap-2 px-8 py-3 rounded-none disabled:opacity-40 disabled:pointer-events-none ${isPending ? 'animate-glitch bg-[#0ff] text-black' : ''}`}
          >
            {isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>PROCESSING...</span>
              </>
            ) : (
              <>
                <Zap size={20} className={isHovered ? "animate-pulse" : ""} />
                <span>EXECUTE SCAN</span>
              </>
            )}
          </button>
        </div>
      </form>

      {isError && (
        <div className="w-full mt-4 p-4 game-panel border-[#ff073a] text-[#ff073a] font-mono font-bold uppercase animate-flash text-center">
          [CRITICAL ERROR]: CONNECTION TO ML_BACKEND LOST!
        </div>
      )}

      {data && (
        <ResultCard
          label={data.label}
          probability={data.fake_probability}
          language={data.detected_language}
          explanation={data.explanation}
        />
      )}
    </div>
  );
};
