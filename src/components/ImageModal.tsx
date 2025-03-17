
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageInfo {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageModalProps {
  images: ImageInfo[];
  initialIndex: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImageModal = ({ images, initialIndex = 0, open, onOpenChange }: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, open]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!open) return;
    
    if (e.key === 'ArrowLeft') {
      navigatePrevious();
    } else if (e.key === 'ArrowRight') {
      navigateNext();
    } else if (e.key === 'Escape') {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, currentIndex]);

  const navigatePrevious = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const navigateNext = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const modalElement = document.querySelector('.image-modal-content');
      if (modalElement && modalElement.requestFullscreen) {
        modalElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="image-modal-content sm:max-w-[90vw] max-h-[90vh] p-0 gap-0 bg-black/95 border-none dark:bg-gray-900/95" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full h-full flex flex-col">
          {/* Navigation controls */}
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 text-white">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={toggleFullscreen}
                aria-label="Tela cheia"
              >
                <ZoomIn className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={() => onOpenChange(false)}
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Image container */}
          <div className="flex-1 flex items-center justify-center p-8 pt-16 pb-20 overflow-hidden">
            <img
              src={currentImage.src}
              alt={currentImage.alt}
              className="max-w-full max-h-full object-contain"
            />
            
            {/* Arrow navigation buttons */}
            {images.length > 1 && (
              <>
                <Button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                  variant="ghost"
                  size="icon"
                  onClick={navigatePrevious}
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 rounded-full bg-black/50 text-white hover:bg-black/70"
                  variant="ghost"
                  size="icon"
                  onClick={navigateNext}
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}
          </div>
          
          {/* Image caption */}
          {currentImage.caption && (
            <div className="w-full p-4 bg-black/80 text-white text-center">
              <p className="text-sm md:text-base">{currentImage.caption}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
