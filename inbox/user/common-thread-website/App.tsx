import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight, ArrowLeft, ChevronDown, Menu, X, ExternalLink } from 'lucide-react';
import { slides } from './constants';
import { SerifDisplay, MonoLabel, BodyText, SupportingText } from './components/Typography';

// --- Menu Overlay Component ---
const MenuOverlay = ({ isOpen, onClose, currentSlideId, onNavigate }: any) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      setTimeout(() => setVisible(false), 500);
    }
  }, [isOpen]);

  if (!visible) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${isAnimating ? 'bg-black/90 backdrop-blur-xl opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'}`}>
      <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
        <X className="w-8 h-8" />
      </button>

      <div className={`flex flex-col items-center gap-8 transition-all duration-700 delay-100 ${isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="flex flex-col gap-6 text-center">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              onClick={() => { onNavigate(index); onClose(); }}
              className={`font-serif text-3xl md:text-4xl hover:text-white transition-colors ${currentSlideId === slide.id ? 'text-white italic' : 'text-white/30'}`}
            >
              <span className="font-mono text-xs tracking-widest block mb-1 opacity-50">{slide.label.split('/')[0]}</span>
              {slide.label.split('/')[1].trim()}
            </button>
          ))}
        </div>

        <div className="w-12 h-px bg-white/20 my-4" />

        <a href="mailto:hello@common-thread.io" className="font-mono text-xs tracking-widest uppercase text-white/60 hover:text-white transition-colors flex items-center gap-2">
          Contact Us <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showDetail, setShowDetail] = useState(false); // "Detail" = Stacked view visible on mobile
  const [hasLoadedSupport, setHasLoadedSupport] = useState(false); // Controls secondary fade-in on desktop
  const [menuOpen, setMenuOpen] = useState(false);

  // Swipe state
  const touchStartX = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const totalSlides = slides.length;
  const currentContent = slides[currentSlide];

  // --- Navigation Logic ---

  const changeSlide = (index: number) => {
    if (index === currentSlide) return;
    setIsTransitioning(true);
    setHasLoadedSupport(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setShowDetail(false);
      setTimeout(() => {
        setIsTransitioning(false);
        // Trigger progressive load for desktop
        setTimeout(() => setHasLoadedSupport(true), 300);
      }, 100);
    }, 400);
  };

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;

    // Show detail first if hidden (Expand before Navigating)
    if (!showDetail) {
      setShowDetail(true);
      return;
    }

    if (currentSlide < totalSlides - 1) {
      setIsTransitioning(true);
      setHasLoadedSupport(false);
      setTimeout(() => {
        setShowDetail(false);
        setCurrentSlide(prev => prev + 1);
        setTimeout(() => {
          setIsTransitioning(false);
          setTimeout(() => setHasLoadedSupport(true), 300);
        }, 100);
      }, 400);
    }
  }, [currentSlide, totalSlides, isTransitioning, showDetail]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;

    // Hide detail first if visible (Collapse before Navigating)
    if (showDetail) {
      setShowDetail(false);
      return;
    }

    if (currentSlide > 0) {
      setIsTransitioning(true);
      setHasLoadedSupport(false);
      setTimeout(() => {
        setShowDetail(false);
        setCurrentSlide(prev => prev - 1);
        setTimeout(() => {
          setIsTransitioning(false);
          setTimeout(() => setHasLoadedSupport(true), 300);
        }, 100);
      }, 400);
    }
  }, [currentSlide, isTransitioning, showDetail]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (menuOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, menuOpen]);

  // Initial load animation
  useEffect(() => {
    setTimeout(() => setHasLoadedSupport(true), 500);
  }, []);

  // Mobile & Desktop Click-to-Expand Handler
  const handleGlobalClick = (e: React.MouseEvent) => {
    // if (window.innerWidth >= 768) return; // Removed to allow desktop click-to-expand
    if ((e.target as HTMLElement).closest('button')) return;
    if (!showDetail) {
      setShowDetail(true);
    }
  };

  // Touch Handlers
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const distance = touchStartX.current - touchEndX;

    if (distance > minSwipeDistance) nextSlide();
    if (distance < -minSwipeDistance) prevSlide();
    touchStartX.current = null;
  };

  // --- Render Helpers ---

  const progress = ((currentSlide + 1) / totalSlides) * 100;
  const CurrentVisual = currentContent.Visual;

  // Desktop Animation Classes
  // Main Content: 
  // - Opacity/Blur only (Position handled by Flex Spacer)
  const desktopMainClass = !isTransitioning
    ? (hasLoadedSupport ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-sm translate-y-4')
    : 'opacity-0 blur-sm translate-y-4';

  // Supporting Content: 
  // - If !showDetail: Hidden below
  // - If showDetail: Fades in/Slides up
  // REMOVED hasLoadedSupport dependency for the expand interaction to ensure it always shows
  const desktopSupportClass = !isTransitioning && showDetail
    ? 'md:opacity-100 md:translate-y-0'
    : 'md:opacity-0 md:translate-y-12';

  return (
    <div
      className="h-[100dvh] w-full bg-[#0a0a0a] text-white overflow-hidden flex flex-col md:flex-row font-sans selection:bg-white/20 touch-none relative overscroll-none"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={handleGlobalClick}
    >
      <MenuOverlay
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        currentSlideId={currentContent.id}
        onNavigate={changeSlide}
      />

      {/* Top Bar Controls */}
      <div className="absolute top-0 left-0 w-full z-[70] flex justify-between items-start p-6 md:p-12 lg:p-16 pointer-events-none">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5 pointer-events-none">
          <div
            className="h-full bg-white/50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Logo */}
        <div className="pointer-events-auto">
          <span className="font-mono font-bold tracking-[0.2em] uppercase text-[10px] md:text-xs text-white/80">
            Common Thread
          </span>
        </div>

        {/* Menu Trigger */}
        <button
          onClick={() => setMenuOpen(true)}
          className="pointer-events-auto text-white/50 hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      {/* --- NARRATIVE PANEL (Left / Bottom) --- */}
      <div
        className={`
          absolute md:relative
          w-full md:w-[60%] 
          bg-[#0a0a0a]
          transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          order-2 md:order-1
          flex flex-col
          ${showDetail ? 'h-[100dvh] top-0 pt-20 md:pt-0' : 'h-[55%] top-[45%] md:h-full md:top-0'}
          z-20
          shadow-[0_-10px_40px_rgba(0,0,0,0.5)] md:shadow-none
        `}
      >
        {/* Content Container - Fixed Top Padding on Desktop for consistent rhythm */}
        <div className={`flex flex-col px-8 md:px-16 lg:px-20 h-full relative pt-8 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${showDetail ? 'md:pt-24 lg:pt-32' : 'md:pt-32 lg:pt-40'}`}>

          {/* Desktop Label (Mobile has it in sticky header if needed, but visually cleaned up here) */}
          <div className="hidden md:block mb-8 transition-opacity duration-500">
            <MonoLabel>{currentContent.label}</MonoLabel>
          </div>

          {/* Content Scroll Area - Constrained to fit between Header and Footer */}
          <div className="flex-grow relative flex flex-col overflow-y-auto md:overflow-visible no-scrollbar pb-32 md:pb-48 scrollbar-hide">
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                  display: none;
              }
              .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
              }
            `}</style>

            {/* FLEX SPACER for Centering - Desktop Only */}
            <div
              className={`
                hidden md:block w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${showDetail ? 'flex-grow-0 h-0' : 'flex-grow-[1] min-h-[20vh]'}
              `}
            />

            {/* MAIN CONTENT */}
            <div className={`
                transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                ${desktopMainClass}
             `}>
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="md:hidden mb-2">
                  <MonoLabel>{currentContent.label}</MonoLabel>
                </div>
                <SerifDisplay>{currentContent.title}</SerifDisplay>
                <BodyText>{currentContent.body}</BodyText>
              </div>
            </div>

            {/* SEPARATOR & SUPPORTING CONTENT */}
            <div
              className={`
                 w-full transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                 ${/* Mobile Logic: Slide Up if showDetail, Fade out if Transitioning */ ''}
                 ${showDetail && !isTransitioning ? 'opacity-100 translate-y-0 mt-8' : 'opacity-0 translate-y-8 h-0 overflow-hidden md:h-auto md:mt-12 md:overflow-visible'}
                 ${/* Desktop Logic: Progressive Fade In */ ''}
                 ${desktopSupportClass}
               `}
            >
              <div className="w-full h-px bg-white/10 mb-8 md:mb-8 block" />
              <SupportingText>
                {currentContent.supportingContent}
              </SupportingText>
            </div>

            {/* Mobile Scroll Hint (if detail is closed) */}
            {!showDetail && !isTransitioning && (
              <div className="md:hidden absolute bottom-4 left-0 w-full flex justify-center opacity-50 animate-bounce pointer-events-none">
                <ChevronDown className="w-5 h-5" />
              </div>
            )}

          </div>
        </div>

        {/* Navigation Footer - MOVED OUTSIDE and FIXED */}
        <div className={`
            shrink-0 h-24
            flex items-center justify-between 
            text-white/30 text-xs font-mono uppercase tracking-widest 
            bg-[#0a0a0a] md:bg-transparent
            w-full absolute bottom-0 left-0 px-8 md:px-16 lg:px-20
            z-50
            border-t md:border-t-0 border-white/5
            md:pb-12 lg:pb-16
            pointer-events-auto
          `}>
          <span className="hidden md:inline opacity-50">Los Angeles, CA</span>

          {/* Desktop Controls */}
          <div className="hidden md:flex gap-12 select-none">
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              disabled={currentSlide === 0}
              className="hover:text-white disabled:opacity-10 transition-colors flex items-center gap-3 cursor-pointer disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" /> Prev
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              disabled={currentSlide === totalSlides - 1}
              className="hover:text-white disabled:opacity-10 transition-colors flex items-center gap-3 cursor-pointer disabled:cursor-not-allowed"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden w-full justify-between items-center">
            <button
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              disabled={currentSlide === 0 && !showDetail}
              className="py-6 pr-6 -ml-2 disabled:opacity-20 active:text-white transition-colors"
            >
              Prev
            </button>

            <span className="text-[10px] tracking-[0.2em] text-white/50">
              {`0${currentSlide + 1}`} / 0{totalSlides}
            </span>

            <button
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              disabled={currentSlide === totalSlides - 1 && showDetail}
              className="py-6 pl-6 -mr-2 disabled:opacity-20 active:text-white transition-colors flex items-center gap-2"
            >
              Next <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* --- VISUAL PANEL (Right / Top) --- */}
      <div
        className={`
          absolute md:relative 
          w-full md:w-[40%] 
          bg-[#0f0f0f] overflow-hidden md:border-l border-white/5
          transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
          order-1 md:order-2
          ${showDetail ? 'opacity-20 md:opacity-100 translate-y-[-20%] md:translate-y-0' : 'h-[45%] md:h-full'}
          md:h-full
          top-0 z-0
        `}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Visual Container */}
        <div className={`relative z-10 w-full h-full flex items-center justify-center transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100 blur-0'}`}>
          <div className="w-full h-full">
            <CurrentVisual />
          </div>
        </div>
      </div>
    </div>
  );
}