
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, FileText, AlertCircle } from 'lucide-react';

interface Props {
  onPhotoSelected: (img: string) => void;
}

const PhotoUpload: React.FC<Props> = ({ onPhotoSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tight mb-2">Upload Analysis Subject</h2>
        <p className="text-slate-500">High-resolution headshots produce the most accurate social consensus.</p>
      </div>

      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative aspect-video rounded-[2rem] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-12 group ${
          isDragging ? 'border-sky-500 bg-sky-500/5' : 'border-white/10 bg-white/5 hover:border-white/20'
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
          <Upload className="w-8 h-8 text-sky-500" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Drag & Drop Headshot</h3>
        <p className="text-slate-500 text-sm text-center max-w-xs mb-8">
          Support formats: JPG, PNG, WEBP. <br /> Maximum size: 10MB.
        </p>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-all">
            <Camera className="w-4 h-4" /> Use Camera
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-all">
            <FileText className="w-4 h-4" /> Pick File
          </button>
        </div>

        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="mt-8 glass p-4 rounded-2xl flex items-start gap-4 border-amber-500/20 bg-amber-500/5">
        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">Privacy Notice</h4>
          <p className="text-[11px] text-slate-400 leading-normal">
            Your image is processed temporarily for first-impression auditing and is not used for facial recognition training. All biometric signatures are purged after session termination.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default PhotoUpload;
