
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
      setError("Analysis failed. Please try again with a clearer picture.");
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
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/><path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z"/></svg>
            </div>
            <span className="serif text-xl font-bold tracking-tight text-stone-800">GlowCheck<span className="text-indigo-500">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-500">
            <a href="#" className="hover:text-stone-900 transition-colors">How it works</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Skincare Tips</a>
            <button className="px-4 py-2 bg-stone-900 text-white rounded-full text-xs hover:bg-stone-800 transition-all">Support</button>
          </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center">
        {status === AnalysisStatus.IDLE && (
          <div className="max-w-2xl px-6 py-12 text-center space-y-8 animate-in fade-in duration-1000">
            <div className="space-y-4">
              <span className="px-4 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest uppercase">Skin Intelligence</span>
              <h1 className="serif text-5xl md:text-6xl font-bold text-stone-800 leading-tight">
                Reveal the truth about your <span className="text-indigo-600 italic">skin's needs.</span>
              </h1>
              <p className="text-stone-500 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
                Take a simple selfie to get an expert-level analysis of your skin health and discover if you need a professional treatment today.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => setStatus(AnalysisStatus.CAPTURING)}
                className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0 flex items-center justify-center gap-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
                Scan My Face
              </button>
              
              <label className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-stone-100 text-stone-700 rounded-2xl font-bold cursor-pointer hover:bg-stone-50 hover:border-stone-200 transition-all flex items-center justify-center gap-3">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload Photo
              </label>
            </div>
            
            <div className="pt-8 flex items-center justify-center gap-8 opacity-40 grayscale">
              <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Trusted By Estheticians</span>
              <div className="flex gap-4">
                <div className="w-24 h-4 bg-stone-300 rounded"></div>
                <div className="w-20 h-4 bg-stone-300 rounded"></div>
                <div className="w-24 h-4 bg-stone-300 rounded"></div>
              </div>
            </div>
          </div>
        )}

        {status === AnalysisStatus.CAPTURING && (
          <div className="w-full max-w-4xl px-4 py-8 animate-in slide-in-from-bottom-8 duration-500">
             <header className="text-center mb-10">
               <h2 className="serif text-3xl font-bold mb-3 text-stone-800">Optimize Your Scan</h2>
               <p className="text-stone-500 mb-8 max-w-lg mx-auto">AI analysis is most accurate when your skin is clearly visible. Follow these 3 simple rules:</p>
               
               {/* 3 Step Instructions */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
                 <div className="relative group p-6 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex flex-col gap-3">
                     <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                     </div>
                     <div>
                       <h4 className="font-bold text-stone-800 text-base">Natural Lighting</h4>
                       <p className="text-sm text-stone-500 leading-snug mt-1">Face a window for soft, direct light. Avoid harsh overhead bulbs that create deep shadows.</p>
                     </div>
                   </div>
                   <div className="absolute top-4 right-4 text-stone-100 font-serif text-4xl select-none">1</div>
                 </div>

                 <div className="relative group p-6 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex flex-col gap-3">
                     <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                     </div>
                     <div>
                       <h4 className="font-bold text-stone-800 text-base">Clean Canvas</h4>
                       <p className="text-sm text-stone-500 leading-snug mt-1">Remove glasses and pull back your hair. Bare, clean skin allows for the most precise pore analysis.</p>
                     </div>
                   </div>
                   <div className="absolute top-4 right-4 text-stone-100 font-serif text-4xl select-none">2</div>
                 </div>

                 <div className="relative group p-6 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
                   <div className="flex flex-col gap-3">
                     <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-2">
                       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                     </div>
                     <div>
                       <h4 className="font-bold text-stone-800 text-base">Still & Level</h4>
                       <p className="text-sm text-stone-500 leading-snug mt-1">Hold your device at eye level and keep perfectly still until the capture is complete.</p>
                     </div>
                   </div>
                   <div className="absolute top-4 right-4 text-stone-100 font-serif text-4xl select-none">3</div>
                 </div>
               </div>
             </header>
             <CameraView onCapture={handleCapture} onCancel={() => setStatus(AnalysisStatus.IDLE)} />
          </div>
        )}

        {status === AnalysisStatus.ANALYZING && (
          <div className="flex flex-col items-center justify-center space-y-8 py-20 animate-in fade-in duration-500">
             <div className="relative w-48 h-48">
               <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
               <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
               <div className="absolute inset-4 rounded-full overflow-hidden">
                 <img src={image || ''} className="w-full h-full object-cover grayscale opacity-50" alt="Processing" />
                 <div className="absolute inset-0 bg-indigo-500/20 animate-pulse"></div>
               </div>
               {/* Scanning Line Effect */}
               <div className="absolute left-0 right-0 h-1 bg-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10 animate-[bounce_3s_infinite] top-0"></div>
             </div>
             <div className="text-center space-y-2">
               <h3 className="serif text-2xl font-bold text-stone-800">Analyzing Your Skin...</h3>
               <p className="text-stone-400 max-w-xs mx-auto">Gemini AI is examining your pores, texture, and hydration levels...</p>
             </div>
          </div>
        )}

        {status === AnalysisStatus.COMPLETED && analysis && image && (
          <AnalysisView analysis={analysis} image={image} onReset={reset} />
        )}

        {status === AnalysisStatus.ERROR && (
          <div className="max-w-md px-6 py-12 text-center space-y-6">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-500">
               <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <h2 className="serif text-3xl font-bold text-stone-800">Analysis Interrupted</h2>
            <p className="text-stone-500">{error || "Something went wrong during the analysis."}</p>
            <button 
              onClick={reset}
              className="px-8 py-3 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-stone-50 border-t border-stone-100 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-stone-400 rounded flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-white" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/></svg>
              </div>
              <span className="serif text-lg font-bold text-stone-600 tracking-tight">GlowCheck AI</span>
            </div>
            <p className="text-stone-400 text-sm">Powered by Gemini Visual Intelligence.</p>
          </div>
          
          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest text-stone-400">
            <a href="#" className="hover:text-stone-600">Privacy</a>
            <a href="#" className="hover:text-stone-600">Terms</a>
            <a href="#" className="hover:text-stone-600">Clinical Data</a>
          </div>
          
          <p className="text-stone-400 text-xs">© 2024 GlowCheck AI. Not a medical diagnostic tool.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
