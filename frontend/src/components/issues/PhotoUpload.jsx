import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Camera, Image as ImageIcon, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '../common/Button';
import { uploadService } from '../../services/uploadService';

export const PhotoUpload = ({ imageUrl, onImageChange, category }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadService.uploadImage(file);
        onImageChange(url);
      } catch (err) {
        console.error('Failed to load image', err);
      }
    }
  };

  return (
    <div className="space-y-3">
      {imageUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 group">
          <img
            src={imageUrl}
            alt="Uploaded Issue Preview"
            className="w-full h-56 sm:h-72 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 flex items-end justify-between p-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              icon={RefreshCw}
              onClick={() => fileInputRef.current?.click()}
            >
              {t('report.changePhoto')}
            </Button>
            <button
              type="button"
              onClick={() => onImageChange('')}
              className="p-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white transition-colors"
              aria-label="Remove image"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-[#1D4ED8] bg-slate-50/70 hover:bg-blue-50/30 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all duration-150 group"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-[#1D4ED8] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8" />
          </div>
          <span className="text-base font-bold text-slate-800">
            {t('report.takePhoto')}
          </span>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
            {t('report.photoHint')}
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
            <ImageIcon className="w-4 h-4 text-slate-400" />
            <span>JPG, PNG or Camera</span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
