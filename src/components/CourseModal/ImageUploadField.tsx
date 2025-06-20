import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadImage, validateImageFile, formatFileSize, UploadProgress } from '../../lib/uploadService';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
  label: string;
  required?: boolean;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  error,
  label,
  required = false
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ progress: 0, isComplete: false });
  const [dragActive, setDragActive] = useState(false);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setUploadProgress({ 
        progress: 0, 
        isComplete: false, 
        error: validation.error 
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress({ progress: 0, isComplete: false });

    try {
      const result = await uploadImage(file, setUploadProgress);
      onChange(result.url);
      console.log('✅ Image uploaded and URL updated:', result.url);
    } catch (error) {
      console.error('❌ Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUploadMode('upload');
    }
  };

  const clearImage = () => {
    onChange('');
    setUrlInput('');
    setUploadProgress({ progress: 0, isComplete: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      {/* Label and Mode Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-base font-semibold text-gray-900">
          {label} {required && '*'}
        </label>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setUploadMode('upload')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              uploadMode === 'upload'
                ? 'bg-[#FF7A59] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Upload
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              uploadMode === 'url'
                ? 'bg-[#FF7A59] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            URL
          </button>
        </div>
      </div>

      {uploadMode === 'upload' ? (
        <>
          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-[#FF7A59] bg-[#FF7A59]/5'
                : error
                ? 'border-red-300 bg-red-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />

            {isUploading ? (
              <div className="space-y-3">
                <div className="w-12 h-12 bg-[#FF7A59]/10 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-6 w-6 text-[#FF7A59] animate-pulse" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Uploading...</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#FF7A59] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600">{uploadProgress.progress}%</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-6 w-6 text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Drop an image here, or click to select
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    JPEG, PNG, WebP, or GIF up to 5MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Upload Progress/Error */}
          {uploadProgress.error && (
            <div className="flex items-center space-x-2 text-red-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{uploadProgress.error}</span>
            </div>
          )}

          {uploadProgress.isComplete && !uploadProgress.error && (
            <div className="flex items-center space-x-2 text-emerald-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Image uploaded successfully!</span>
            </div>
          )}
        </>
      ) : (
        <>
          {/* URL Input Mode */}
          <div className="space-y-3">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-[#FF7A59] focus:ring-2 focus:ring-[#FF7A59]/20"
              placeholder="https://images.pexels.com/..."
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-4 py-2 bg-[#FF7A59] text-white rounded-lg text-sm font-medium hover:bg-[#FF8A6B] transition-colors"
            >
              Use URL
            </button>
          </div>
        </>
      )}

      {/* Current Image Preview */}
      {value && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Current Image:</span>
            <button
              type="button"
              onClick={clearImage}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <img
              src={value}
              alt="Thumbnail preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Failed to load image</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;