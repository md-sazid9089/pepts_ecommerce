import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { bannerSlides } from '@/data/products';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const styles = {
  carousel: {
    position: 'relative',
    width: '100%',
    height: '500px',
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    cursor: 'grab',
  },
  slidesTrack: {
    display: 'flex',
    transition: 'transform 0.5s ease-in-out',
    height: '100%',
  },
  slide: {
    flex: '0 0 100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  slideOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    pointerEvents: 'none',
  },
  arrow: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#111827',
    border: 'none',
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transition: 'all 0.3s ease',
  },
  arrowLeft: {
    left: '20px',
  },
  arrowRight: {
    right: '20px',
  },
  dots: {
    position: 'absolute',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',
    zIndex: 10,
  },
  dot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  dotActive: {
    backgroundColor: 'white',
    width: '24px',
    borderRadius: '4px',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '3px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    zIndex: 9,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    animation: 'slideProgress linear forwards',
  },
};

export default function Carousel() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [wasDragged, setWasDragged] = useState(false);
  const total = bannerSlides.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const dragEnd = e.clientX;
    const dragDistance = dragStart - dragEnd;
    
    // If dragged more than 50px, navigate
    if (Math.abs(dragDistance) > 50) {
      setWasDragged(true);
      if (dragDistance > 0) {
        next();
      } else {
        prev();
      }
    } else {
      setWasDragged(false);
    }
  };

  const handleCarouselClick = (e) => {
    // Only redirect if not dragging
    if (!wasDragged) {
      navigate('/categories');
    }
    setWasDragged(false);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  return (
    <div
      className={styles.carousel}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      <div 
        className={styles.slidesTrack} 
        style={{ transform: `translateX(-${current * 100}%)` }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleCarouselClick}
      >
        {bannerSlides.map((slide, i) => (
          <div 
            key={slide.id} 
            className={styles.slide} 
            style={{ 
              backgroundColor: slide.bg,
              backgroundImage: slide.backgroundImage,
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              position: 'relative',
            }}
          >
            {slide.backgroundOverlay && (
              <div 
                className={styles.slideOverlay}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: slide.backgroundOverlay,
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Nav arrows */}
      <button className={`${styles.arrow} ${styles.arrowLeft}`} onClick={prev} aria-label="Previous slide">
        <FiChevronLeft size={24} />
      </button>
      <button className={`${styles.arrow} ${styles.arrowRight}`} onClick={next} aria-label="Next slide">
        <FiChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className={styles.dots}>
        {bannerSlides.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className={styles.progressBar}>
        <div
          key={current}
          className={styles.progressFill}
          style={{ animationDuration: isPaused ? '0s' : '4.5s' }}
        />
      </div>
    </div>
  );
}


