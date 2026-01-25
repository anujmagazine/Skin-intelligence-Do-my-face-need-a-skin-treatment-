
import React, { useRef, useEffect, useState, useCallback } from 'react';

interface CameraViewProps {
  onCapture: (image: string) => void;
  onCancel: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1080 }, height: { ideal: 1080 } },
          audio: false
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsReady(true);
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("We couldn't reach your camera. Please ensure permissions are granted for your consultation.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const captureFrame = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-stone-950 rounded-[60px] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border-[12px] border-white">
      {error ? (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center text-white bg-stone-900">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-6 text-rose-300"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          <p className="mb-8 font-medium italic">{error}</p>
          <button onClick={onCancel} className="px-10 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md">Return Home</button>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover transform scale-x-[-1] ${isReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-1000`}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Overlay Guide - More elegant */}
          <div className="absolute inset-0 border-[30px] border-stone-950/30 pointer-events-none">
            <div className="w-full h-full border border-white/10 rounded-[40px] flex items-center justify-center">
               <div className="w-64 h-80 border border-dashed border-white/40 rounded-[100px] flex items-end justify-center pb-10">
                 <span className="text-white/80 text-[10px] font-bold tracking-[0.2em] uppercase bg-black/30 backdrop-blur-md px-5 py-2 rounded-full">Radiant Center</span>
               </div>
            </div>
          </div>

          {/* Capture Controls */}
          <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-8">
            <button 
              onClick={onCancel}
              className="p-5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90 backdrop-blur-md border border-white/10"
              title="Cancel"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <button 
              onClick={captureFrame}
              disabled={!isReady}
              className="w-24 h-24 rounded-full border-2 border-white/50 flex items-center justify-center bg-transparent group active:scale-95 transition-all p-2"
            >
              <div className="w-full h-full rounded-full bg-white shadow-[0_0_30px_rgba(255,255,255,0.4)] group-hover:scale-105 transition-transform duration-500"></div>
            </button>
            
            <div className="w-14"></div> {/* Balance Spacer */}
          </div>
        </>
      )}
    </div>
  );
};

export default CameraView;
