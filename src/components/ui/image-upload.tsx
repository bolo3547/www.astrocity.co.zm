'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      onChange(data.url);
    } catch {
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          <div className="relative w-48 h-32 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={value}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <label
          className={`flex flex-col items-center justify-center w-48 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-navy-400 hover:bg-navy-50 transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            disabled={disabled || isUploading}
            className="hidden"
          />
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-navy-400 animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-navy-400 mb-2" />
              <span className="text-sm text-navy-500">Click to upload</span>
              <span className="text-xs text-navy-400 mt-1">Max 5MB</span>
            </>
          )}
        </label>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  max?: number;
}

export function MultiImageUpload({ values, onChange, disabled, max = 10 }: MultiImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (values.length >= max) {
      setError(`Maximum ${max} images allowed`);
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Upload failed');
        return;
      }

      onChange([...values, data.url]);
    } catch {
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const handleRemove = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        {values.map((url, index) => (
          <div key={index} className="relative inline-block">
            <div className="relative w-32 h-24 rounded-lg overflow-hidden border border-gray-200">
              <Image
                src={url}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}

        {values.length < max && (
          <label
            className={`flex flex-col items-center justify-center w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-navy-400 hover:bg-navy-50 transition-colors ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleUpload}
              disabled={disabled || isUploading}
              className="hidden"
            />
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-navy-400 animate-spin" />
            ) : (
              <>
                <ImageIcon className="w-6 h-6 text-navy-400 mb-1" />
                <span className="text-xs text-navy-500">Add Image</span>
              </>
            )}
          </label>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      <p className="text-xs text-navy-400">{values.length} of {max} images</p>
    </div>
  );
}
