'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { bannerSlides } from '@/data/products';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import styles from './Carousel.module.css';

export default function Carousel() {
  const router = useRouter();
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
      router.push('/categories');
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
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'fixed',
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
