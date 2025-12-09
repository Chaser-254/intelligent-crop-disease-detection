import React, { useEffect, useState, useRef } from 'react';
import { Camera, WifiOff, Upload, Video, X, Wifi } from 'lucide-react';
interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
}
export function CameraCapture({
  onCapture,
  isOfflineMode,
  onToggleOfflineMode
}: CameraCaptureProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [language, setLanguage] = useState<'EN' | 'SW'>('EN');
  const [useLiveCamera, setUseLiveCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  useEffect(() => {
    return () => {
      // Cleanup: stop camera stream when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment'
        } // Use back camera on mobile
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setUseLiveCamera(true);
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Camera access denied. Please use file upload instead.');
    }
  };
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseLiveCamera(false);
  };
  const captureFromCamera = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setPreviewImage(imageData);
        stopCamera();
      }
    }
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCapture = () => {
    if (previewImage) {
      onCapture(previewImage);
    } else if (useLiveCamera) {
      captureFromCamera();
    } else {
      fileInputRef.current?.click();
    }
  };
  const instructions = {
    EN: 'Center the affected leaf or stem within the frame below.',
    SW: 'Weka jani au shina lililoathirika katikati ya fremu hapa chini.'
  };
  return <div className="flex flex-col h-full gap-6">
      {/* Top Controls */}
      <div className="flex justify-between items-start">
        <button onClick={onToggleOfflineMode} className="flex items-center gap-2 px-3 py-1 border border-gray-400 rounded-full bg-white hover:bg-gray-50 transition-colors active:bg-gray-100">
          {isOfflineMode ? <>
              <WifiOff className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-mono text-gray-600 uppercase">
                Offline Mode
              </span>
            </> : <>
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-xs font-mono text-green-700 uppercase">
                Online Mode
              </span>
            </>}
        </button>

        <div className="flex border border-gray-400 rounded overflow-hidden">
          <button onClick={() => setLanguage('EN')} className={`px-3 py-1 text-xs font-mono font-bold transition-colors ${language === 'EN' ? 'bg-[#1f2933] text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}>
            EN
          </button>
          <button onClick={() => setLanguage('SW')} className={`px-3 py-1 text-xs font-mono font-bold transition-colors ${language === 'SW' ? 'bg-[#1f2933] text-white' : 'bg-transparent text-gray-600 hover:bg-gray-200'}`}>
            SW
          </button>
        </div>
      </div>

      {/* Mode Info Banner */}
      {!isOfflineMode && <div className="bg-green-50 border border-green-200 p-3 rounded">
          <p className="font-mono text-xs text-green-800">
            <strong>Online Mode:</strong> Using cloud AI for enhanced accuracy.
            Requires internet connection.
          </p>
        </div>}

      {isOfflineMode && <div className="bg-gray-100 border border-gray-300 p-3 rounded">
          <p className="font-mono text-xs text-gray-700">
            <strong>Offline Mode:</strong> Using local AI. Works without
            internet. Faster processing.
          </p>
        </div>}

      {/* Instructions */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-[#1f2933]">
          {language === 'EN' ? 'Scan Plant' : 'Chunguza Mmea'}
        </h2>
        <p className="font-mono text-sm text-[#9ca3af]">
          {instructions[language]}
        </p>
      </div>

      {/* Viewfinder */}
      <div className="flex-1 min-h-[300px] border-4 border-dashed border-gray-400 rounded-lg bg-gray-200/50 flex flex-col items-center justify-center relative overflow-hidden group">
        {useLiveCamera ? <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <button onClick={stopCamera} className="absolute top-2 right-2 p-2 bg-white/90 border border-gray-400 rounded hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </> : previewImage ? <img src={previewImage} alt="Captured plant" className="w-full h-full object-cover" /> : <>
            <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
              <Camera className="w-32 h-32" />
            </div>

            {/* Corner Markers */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-gray-800" />
            <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-gray-800" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-gray-800" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-gray-800" />

            <span className="font-mono text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
              [CAMERA PREVIEW FEED]
            </span>
          </>}
      </div>

      {/* Hidden elements */}
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
      <canvas ref={canvasRef} className="hidden" />

      {/* Capture Controls */}
      <div className="flex flex-col items-center gap-4 mt-auto">
        {!useLiveCamera && !previewImage && <div className="flex gap-2">
            <button onClick={startCamera} className="flex items-center gap-2 px-4 py-2 border border-gray-400 bg-white hover:bg-gray-50 font-mono text-xs uppercase">
              <Video className="w-4 h-4" />
              {language === 'EN' ? 'Use Camera' : 'Tumia Kamera'}
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 border border-gray-400 bg-white hover:bg-gray-50 font-mono text-xs uppercase">
              <Upload className="w-4 h-4" />
              {language === 'EN' ? 'Upload File' : 'Pakia Faili'}
            </button>
          </div>}

        {previewImage && <button onClick={() => {
        setPreviewImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }} className="text-sm font-mono text-gray-500 hover:text-[#1f2933] underline decoration-dashed">
            {language === 'EN' ? 'Retake Photo' : 'Piga Picha Tena'}
          </button>}

        <button onClick={handleCapture} className="w-20 h-20 rounded-full border-4 border-[#1f2933] flex items-center justify-center hover:bg-gray-200 transition-colors active:scale-95" aria-label="Capture Photo">
          {previewImage ? <Upload className="w-8 h-8 text-[#1f2933]" /> : <div className="w-16 h-16 rounded-full bg-[#1f2933]" />}
        </button>
        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">
          {previewImage ? language === 'EN' ? 'Tap to Analyze' : 'Gusa Kuchanganua' : useLiveCamera ? language === 'EN' ? 'Tap to Capture' : 'Gusa Kupiga Picha' : language === 'EN' ? 'Select Input Method' : 'Chagua Njia'}
        </p>
      </div>
    </div>;
}