
import React from 'react';
import { SkinAnalysis } from '../types';

interface AnalysisViewProps {
  analysis: SkinAnalysis;
  image: string;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, image, onReset }) => {
  const getUrgencyColor = (score: number) => {
    if (score >= 8) return 'bg-rose-50 text-rose-700 border-rose-100';
    if (score >= 5) return 'bg-amber-50 text-amber-700 border-amber-100';
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Image Column */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white aspect-square w-full">
            <img src={image} alt="Radiant face" className="w-full h-full object-cover" />
            <div className={`absolute bottom-4 right-4 px-4 py-2 rounded-2xl text-sm font-bold border ${getUrgencyColor(analysis.urgencyScore)} shadow-sm backdrop-blur-md bg-opacity-90`}>
              Radiance Index: {analysis.urgencyScore}/10
            </div>
          </div>

          {/* Score Explanation Block */}
          <div className="mt-8 p-6 bg-rose-50/30 rounded-3xl border border-rose-100/50 w-full space-y-4">
            <div className="flex items-center gap-2 text-stone-800 font-bold text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-rose-400"><circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
              Your Skin's Vitality
            </div>
            
            <p className="text-xs text-stone-500 leading-relaxed italic">
              Every day is a new opportunity to nurture your glow. This index reflects your skin's current energy and hydration.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-300 mt-1 flex-shrink-0"></span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-rose-400">8 - 10: Blooming & Balanced</div>
                  <p className="text-[11px] text-stone-500">Your ritual is working. Your skin feels vibrant and nurtured.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-300 mt-1 flex-shrink-0"></span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400">4 - 7: Gently Thirsty</div>
                  <p className="text-[11px] text-stone-500">Your skin is asking for a moment of extra care and hydration.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-stone-300 mt-1 flex-shrink-0"></span>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">1 - 3: Time to Replenish</div>
                  <p className="text-[11px] text-stone-500">A professional touch would beautifully restore your skin's natural peace.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Column */}
        <div className="w-full md:w-2/3 space-y-8">
          <header className="space-y-3">
            <h2 className="serif text-4xl font-bold text-stone-800">Your Beauty Consultation</h2>
            <div className="flex items-center gap-3">
              <span className={`px-5 py-2 rounded-2xl text-sm font-semibold ${analysis.shouldGetFacial ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-600'}`}>
                {analysis.shouldGetFacial ? 'Professional Care Suggested' : 'Your Ritual is Harmonized'}
              </span>
            </div>
          </header>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-rose-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"/></svg>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Our Observations</h3>
            <p className="text-stone-700 leading-relaxed text-xl italic serif relative z-10">
              "{analysis.reasoning}"
            </p>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <section className="bg-stone-50/50 p-7 rounded-3xl border border-stone-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-5">Your Skin's Language</h3>
              <ul className="space-y-3">
                {analysis.skinConcerns.map((concern, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-stone-700 text-sm">
                    <span className="w-2 h-2 rounded-full bg-rose-200 mt-1.5 flex-shrink-0"></span>
                    {concern}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-rose-50 p-7 rounded-3xl border border-rose-100">
              <h3 className="text-xs font-bold uppercase tracking-widest text-rose-400 mb-3">Ritual Recommendation</h3>
              <div className="text-rose-900 font-bold text-2xl mb-2 serif">{analysis.recommendedTreatment}</div>
              <p className="text-rose-700/80 text-sm leading-relaxed">This professional ritual would best support your skin's natural harmony right now.</p>
            </section>
          </div>

          <section className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-6">Nurturing Your Glow at Home</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5">
              {analysis.homeCareTips.map((tip, idx) => (
                <div key={idx} className="flex gap-4 text-stone-600 text-sm items-start">
                  <span className="text-rose-300 font-serif italic text-lg leading-none">{idx + 1}.</span>
                  <span className="leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Prominent Reset Action */}
      <div className="pt-12 flex flex-col items-center border-t border-stone-100">
        <div className="text-center space-y-5 max-w-sm">
          <p className="text-stone-400 text-sm italic">Wishing to refresh your consultation or capture another moment?</p>
          <button 
            onClick={onReset}
            className="w-full px-10 py-5 bg-stone-900 text-white rounded-3xl font-bold shadow-2xl hover:bg-stone-800 hover:-translate-y-1 transition-all active:translate-y-0 flex items-center justify-center gap-3 group"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:rotate-180 transition-transform duration-700"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Begin a New Ritual
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
