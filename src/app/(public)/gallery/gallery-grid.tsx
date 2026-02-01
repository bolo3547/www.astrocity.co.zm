'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ChevronLeft, ChevronRight, MapPin, ExternalLink } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  projectTitle: string;
  projectSlug: string;
  location: string | null;
  services: string[];
}

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  const selectedImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => openLightbox(index)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-navy-100 focus:outline-none focus:ring-2 focus:ring-solar-500"
          >
            <img
              src={image.url}
              alt={image.projectTitle}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-semibold text-sm line-clamp-2">
                  {image.projectTitle}
                </p>
                {image.location && (
                  <p className="text-navy-300 text-xs mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {image.location}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Navigation */}
          <button
            onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
            className="absolute left-4 p-3 text-white/70 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goToNext(); }}
            className="absolute right-4 p-3 text-white/70 hover:text-white bg-white/10 rounded-full hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Image */}
          <div 
            className="max-w-5xl max-h-[85vh] mx-auto px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url}
              alt={selectedImage.projectTitle}
              className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg"
            />
            
            {/* Info Panel */}
            <div className="mt-4 text-center">
              <h3 className="text-white font-semibold text-lg">{selectedImage.projectTitle}</h3>
              {selectedImage.location && (
                <p className="text-navy-400 text-sm mt-1 flex items-center justify-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedImage.location}
                </p>
              )}
              <Link
                href={`/projects`}
                className="inline-flex items-center gap-2 text-solar-400 hover:text-solar-300 text-sm mt-3"
              >
                View Project Details <ExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* Counter */}
            <p className="text-center text-navy-500 text-sm mt-4">
              {selectedIndex! + 1} / {images.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
