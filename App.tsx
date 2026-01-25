
import React, { useState, useCallback } from 'react';
import CameraView from './components/CameraView';
import AnalysisView from './components/AnalysisView';
import { analyzeSkin } from './services/geminiService';
import { AnalysisStatus, SkinAnalysis } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = useCallback(async (dataUrl: string) => {
    setImage(dataUrl);
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    
    try {
      const result = await analyzeSkin(dataUrl);
      setAnalysis(result);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err) {
      console.error(err);
      setError("The consultation could not be completed. Please try again with a clearer picture in natural light.");
      setStatus(AnalysisStatus.ERROR);
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCapture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const reset = () => {
    setStatus(AnalysisStatus.IDLE);
    setImage(null);
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-stone-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-10 h-10 bg-rose-400 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"/></svg>
            </div>
            <span className="serif text-xl font-bold tracking-tight text-stone-800">GlowCheck<span className="text-rose-500">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-500">
            <a href="#" className="hover:text-stone-900 transition-colors">Our Philosophy</a>
            <a href="#" className="hover:text-stone-900 transition-colors">The Glow Guide</a>
            <button className="px-6 py-2.5 bg-stone-900 text-white rounded-2xl text-xs hover:bg-stone-800 transition-all shadow-md">Support</button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center">
        {status === AnalysisStatus.IDLE && (
          <div className="max-w-3xl px-6 py-16 text-center space-y-10 animate-in fade-in duration-1000">
            <div className="space-y-6">
              <span className="px-5 py-1.5 rounded-full bg-rose-50 text-rose-500 text-xs font-bold tracking-widest uppercase">The Art of Radiant Skin</span>
              <h1 className="serif text-5xl md:text-7xl font-bold text-stone-800 leading-[1.1]">
                Unveil the secret to your <span className="text-rose-500 italic">natural glow.</span>
              </h1>
              <p className="text-stone-500 text-lg md:text-xl max-w-xl mx-auto leading-relaxed italic">
                A moment of self-discovery. Let our AI-guided consultation reveal what your skin is truly asking for today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
              <button 
                onClick={() => setStatus(AnalysisStatus.CAPTURING)}
                className="w-full sm:w-auto px-12 py-5 bg-rose-500 text-white rounded-3xl font-bold shadow-2xl shadow-rose-200 hover:bg-rose-600 hover:-translate-y-1 transition-all active:translate-y-0 flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                Capture Your Glow
              </button>
              
              <label className="w-full sm:w-auto px-12 py-5 bg-white border-2 border-stone-100 text-stone-700 rounded-3xl font-bold cursor-pointer hover:bg-stone-50 hover:border-stone-200 transition-all flex items-center justify-center gap-3">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload a Photo
              </label>
            </div>
            
            <div className="pt-12 flex items-center justify-center gap-10 opacity-30 grayscale">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Honored by Beauty Experts</span>
              <div className="flex gap-6">
                <div className="w-20 h-4 bg-stone-300 rounded-full"></div>
                <div className="w-16 h-4 bg-stone-300 rounded-full"></div>
                <div className="w-20 h-4 bg-stone-300 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {status === AnalysisStatus.CAPTURING && (
          <div className="w-full max-w-4xl px-4 py-8 animate-in slide-in-from-bottom-8 duration-500">
             <header className="text-center mb-12">
               <h2 className="serif text-3xl font-bold mb-3 text-stone-800">Setting the Space</h2>
               <p className="text-stone-500 mb-8 max-w-lg mx-auto italic">To see your skin's true radiance, we need a moment of perfect clarity.</p>
               
               {/* 3 Step Instructions */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
                 <div className="relative group p-8 bg-white rounded-[40px] border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex flex-col gap-4">
                     <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-400 mb-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                     </div>
                     <div>
                       <h4 className="font-bold text-stone-800 text-lg serif">Find the Light</h4>
                       <p className="text-sm text-stone-500 leading-relaxed mt-2">Soft, natural window light is best. Avoid harsh overhead shadows to reveal your true texture.</p>
                     </div>
                   </div>
                   <div className="absolute top-6 right-8 text-stone-100 font-serif text-5xl select-none">1</div>
                 </div>

                 <div className="relative group p-8 bg-white rounded-[40px] border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex flex-col gap-4">
                     <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 mb-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                     </div>
                     <div>
                       <h4 className="font-bold text-stone-800 text-lg serif">Bare & Beautiful</h4>
                       <p className="text-sm text-stone-500 leading-relaxed mt-2">Pull back your hair and let your clean skin breathe. Bare skin tells the most honest story.</p>
                     </div>
                   </div>
                   <div className="absolute top-6 right-8 text-stone-100 font-serif text-5xl select-none">2</div>
                 </div>

                 <div className="relative group p-8 bg-white rounded-[40px] border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex flex-col gap-4">
                     <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-stone-400 mb-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                     </div>
                     <div>
                       <h4 className="font-bold text-stone-800 text-lg serif">Hold the Moment</h4>
                       <p className="text-sm text-stone-500 leading-relaxed mt-2">Hold your gaze level and keep still. Precision ensures a more personalized care plan.</p>
                     </div>
                   </div>
                   <div className="absolute top-6 right-8 text-stone-100 font-serif text-5xl select-none">3</div>
                 </div>
               </div>
             </header>
             <CameraView onCapture={handleCapture} onCancel={() => setStatus(AnalysisStatus.IDLE)} />
          </div>
        )}

        {status === AnalysisStatus.ANALYZING && (
          <div className="flex flex-col items-center justify-center space-y-10 py-24 animate-in fade-in duration-500">
             <div className="relative w-56 h-56">
               <div className="absolute inset-0 border-2 border-rose-100 rounded-full"></div>
               <div className="absolute inset-0 border-2 border-rose-400 rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-6 rounded-full overflow-hidden shadow-inner">
                 <img src={image || ''} className="w-full h-full object-cover grayscale opacity-40" alt="Consulting" />
                 <div className="absolute inset-0 bg-rose-500/10 animate-pulse"></div>
               </div>
               {/* Scanning Line Effect - Softened */}
               <div className="absolute left-0 right-0 h-px bg-rose-300 shadow-[0_0_20px_rgba(244,114,182,0.4)] z-10 animate-[bounce_4s_infinite] top-0"></div>
             </div>
             <div className="text-center space-y-3">
               <h3 className="serif text-3xl font-bold text-stone-800">Revealing Your Radiance...</h3>
               <p className="text-stone-400 max-w-xs mx-auto italic">Our AI esthetician is carefully observing your skin's unique needs and story...</p>
             </div>
          </div>
        )}

        {status === AnalysisStatus.COMPLETED && analysis && image && (
          <AnalysisView analysis={analysis} image={image} onReset={reset} />
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="max-w-md px-6 py-16 text-center space-y-8">
            <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-300">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="serif text-3xl font-bold text-stone-800">A Moment's Interruption</h2>
            <p className="text-stone-500 leading-relaxed italic">{error || "The image was a bit shy. Let's try once more in brighter light."}</p>
            <button 
              onClick={reset}
              className="px-12 py-4 bg-stone-900 text-white rounded-3xl font-bold hover:bg-stone-800 transition-all shadow-xl"
            >
              Try Once More
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Disclaimer section - Just below report ends, above the links */}
          <div className="mb-16 text-center max-w-3xl mx-auto px-6">
            <p className="text-stone-400 text-sm leading-relaxed italic">
              Note: This app provides insights similar to an <span className="font-bold text-stone-600">Esthetician (spa-level rituals)</span> rather than a <span className="font-bold text-stone-500 italic underline decoration-stone-200">Dermatologist (medical treatments)</span>. 
              We do not suggest prescription medications or invasive procedures. Our consultation focuses strictly on 
              <span className="text-rose-400 font-medium"> Professional Facials</span> and <span className="text-rose-400 font-medium">Daily Self-Care</span> rituals.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-10 border-t border-stone-200 pt-10">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-stone-300 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/></svg>
                </div>
                <span className="serif text-xl font-bold text-stone-600 tracking-tight">GlowCheck AI</span>
              </div>
              <p className="text-stone-400 text-sm italic">Inspired by the beauty of science and self-care.</p>
            </div>
            
            <div className="flex gap-10 text-xs font-bold uppercase tracking-[0.2em] text-stone-400">
              <a href="#" className="hover:text-rose-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-rose-400 transition-colors">Terms</a>
            </div>
            
            <p className="text-stone-500 text-lg font-bold serif">@ 2026 AI&Beyond</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
