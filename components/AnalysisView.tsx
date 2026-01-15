
import React from 'react';
import { SkinAnalysis } from '../types';

interface AnalysisViewProps {
  analysis: SkinAnalysis;
  image: string;
  onReset: () => void;
}

const AnalysisView: React.FC<AnalysisViewProps> = ({ analysis, image, onReset }) => {
  const getUrgencyColor = (score: number) => {
    if (score >= 8) return 'bg-rose-100 text-rose-700 border-rose-200';
    if (score >= 5) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-emerald-100 text-emerald-700 border-emerald-200';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Image Column */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-square w-full">
            <img src={image} alt="Analyzed face" className="w-full h-full object-cover" />
            <div className={`absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-bold border ${getUrgencyColor(analysis.urgencyScore)}`}>
              Score: {analysis.urgencyScore}/10
            </div>
          </div>
          <button 
            onClick={onReset}
            className="mt-6 text-stone-500 hover:text-stone-800 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Start New Analysis
          </button>
        </div>

        {/* Results Column */}
        <div className="w-full md:w-2/3 space-y-6">
          <header className="space-y-2">
            <h2 className="serif text-3xl font-bold text-stone-800">Your Skin Report</h2>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${analysis.shouldGetFacial ? 'bg-indigo-100 text-indigo-700' : 'bg-stone-100 text-stone-600'}`}>
                {analysis.shouldGetFacial ? 'Treatment Recommended' : 'Maintenance Mode'}
              </span>
            </div>
          </header>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-3">Professional Observation</h3>
            <p className="text-stone-700 leading-relaxed text-lg italic serif">
              "{analysis.reasoning}"
            </p>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <section className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">Detected Concerns</h3>
              <ul className="space-y-2">
                {analysis.skinConcerns.map((concern, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                    {concern}
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 mb-2">Prescribed Facial</h3>
              <div className="text-indigo-900 font-bold text-xl mb-2">{analysis.recommendedTreatment}</div>
              <p className="text-indigo-700 text-sm">Targeted specifically for your current skin state.</p>
            </section>
          </div>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400 mb-4">Daily Home Care Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {analysis.homeCareTips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 text-stone-600 text-sm">
                  <span className="text-indigo-400 font-bold">{idx + 1}.</span>
                  {tip}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AnalysisView;
