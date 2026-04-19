'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { bannerSlides } from '@/data/products';
import { FiChevronLeft, FiChevronRight, FiTag } from 'react-icons/fi';
import styles from './Carousel.module.css';

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = bannerSlides.length;

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);

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
      <div className={styles.slidesTrack} style={{ transform: `translateX(-${current * 100}%)` }}>
        {bannerSlides.map((slide, i) => (
          <div key={slide.id} className={styles.slide} style={{ background: slide.bg }}>
            <div className={styles.slideContent}>
              <div className={styles.slideText}>
                <p className={styles.slideTag} style={{ color: slide.accent }}>
                  <FiTag size={14} /> Limited Time Offer
                </p>
                <h1 className={styles.slideTitle}>{slide.title}</h1>
                <p className={styles.slideSubtitle}>{slide.subtitle}</p>
                <div className={styles.slideBtns}>
                  <Link href={slide.href} className={styles.slideCta}
                    style={{ background: slide.accent, color: slide.accent === '#FFFFFF' ? '#1A1A2E' : 'white' }}>
                    {slide.cta} →
                  </Link>
                  <Link href="/products" className={styles.slideSecondary}>
                    Browse All
                  </Link>
                </div>
              </div>
              <div className={styles.slideImgWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className={styles.slideImg}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
                <div className={styles.slideImgGlow} style={{ background: slide.accent }} />
              </div>
            </div>
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
