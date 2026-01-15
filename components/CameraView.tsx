
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
        setError("Unable to access camera. Please check permissions.");
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
        // Set canvas to video dimensions
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onCapture(dataUrl);
      }
    }
  }, [onCapture]);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-stone-900 rounded-3xl overflow-hidden shadow-2xl">
      {error ? (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 text-rose-400"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
          <p className="mb-6">{error}</p>
          <button onClick={onCancel} className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">Go Back</button>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover transform scale-x-[-1] ${isReady ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Overlay Guide */}
          <div className="absolute inset-0 border-[24px] border-stone-900/40 pointer-events-none">
            <div className="w-full h-full border-2 border-white/20 rounded-2xl flex items-center justify-center">
               <div className="w-64 h-80 border-2 border-dashed border-white/50 rounded-[100px] flex items-end justify-center pb-8">
                 <span className="text-white/70 text-xs font-medium bg-black/40 px-3 py-1 rounded-full">Center Face Here</span>
               </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-6">
            <button 
              onClick={onCancel}
              className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all active:scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
            
            <button 
              onClick={captureFrame}
              disabled={!isReady}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-transparent group active:scale-95 transition-all"
            >
              <div className="w-16 h-16 rounded-full bg-white scale-90 group-hover:scale-100 transition-transform"></div>
            </button>
            
            <div className="w-12"></div> {/* Spacer for balance */}
          </div>
        </>
      )}
    </div>
  );
};

export default CameraView;
