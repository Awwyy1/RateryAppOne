
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, FileText, AlertCircle, X, FlipHorizontal, ArrowLeft, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Props {
  onPhotoSelected: (img: string) => void;
  onCancel?: () => void;
}

const PhotoUpload: React.FC<Props> = ({ onPhotoSelected, onCancel }) => {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onPhotoSelected(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setIsCameraReady(false);
  }, []);

  const startCamera = useCallback(async (mode: 'user' | 'environment') => {
    setCameraError(null);
    setIsCameraReady(false);

    // Stop existing stream first
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;

        // Try to play immediately
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.log('Autoplay blocked, user interaction needed');
        }

        // Set ready after short delay - don't wait for events that may not fire
        setTimeout(() => {
          setIsCameraReady(true);
          setIsSwitching(false);
        }, 500);
      }

      setShowCamera(true);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(t('upload.cameraError'));
      setIsSwitching(false);
    }
  }, []);

  const switchCamera = async () => {
    setIsSwitching(true);
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newMode);
    await startCamera(newMode);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Use video dimensions, fallback to defaults
      const width = video.videoWidth || 640;
      const height = video.videoHeight || 480;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror the image for selfie camera
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        stopCamera();
        onPhotoSelected(dataUrl);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleStartCamera = () => {
    startCamera(facingMode);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      {/* Back Button */}
      {onCancel && (
        <motion.button
          onClick={onCancel}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('upload.backToResults')}
        </motion.button>
      )}

      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2">{t('upload.title')}</h2>
        <p className="text-slate-500">{t('upload.subtitle')}</p>
      </div>

      <AnimatePresence mode="wait">
        {showCamera ? (
          <motion.div
            key="camera"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative aspect-video rounded-[2rem] overflow-hidden bg-black border border-white/10"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Camera Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
              <button
                onClick={switchCamera}
                disabled={isSwitching}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all disabled:opacity-50"
              >
                {isSwitching ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <FlipHorizontal className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={capturePhoto}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:bg-[#00f0ff] transition-all shadow-lg"
              >
                <div className="w-12 h-12 border-4 border-black/20 rounded-full" />
              </button>

              <button
                onClick={stopCamera}
                className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-red-500/20 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* HUD Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-lg">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono uppercase">Live</span>
              </div>

              {/* Face guide overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-64 border-2 border-dashed border-[#00f0ff]/50 rounded-[3rem]" />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative aspect-video rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-12 group ${
              isDragging ? 'border-[#00f0ff] bg-[#00f0ff]/5' : 'border-white/10 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-[#00f0ff]" />
            </div>

            <h3 className="text-xl font-semibold mb-2">{t('upload.dragDrop')}</h3>
            <p className="text-slate-500 text-sm text-center max-w-xs mb-8">
              {t('upload.formats')} <br /> {t('upload.maxSize')}
            </p>

            <div className="flex gap-4" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => { e.stopPropagation(); handleStartCamera(); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-all"
              >
                <Camera className="w-4 h-4" /> {t('upload.useCamera')}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-all"
              >
                <FileText className="w-4 h-4" /> {t('upload.pickFile')}
              </button>
            </div>

            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {cameraError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{cameraError}</p>
        </motion.div>
      )}

      <div className="mt-8 glass p-4 rounded-2xl flex items-start gap-4 border-amber-500/20 bg-amber-500/5">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">{t('upload.privacyNotice')}</h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            {t('upload.privacyText')}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoUpload;
