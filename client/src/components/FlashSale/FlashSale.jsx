'use client';

import { useEffect, useState } from 'react';
import { FiZap } from 'react-icons/fi';
import styles from './FlashSale.module.css';

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 5,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds -= 1;
        } else if (minutes > 0) {
          minutes -= 1;
          seconds = 59;
        } else if (hours > 0) {
          hours -= 1;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer
          hours = 5;
          minutes = 42;
          seconds = 18;
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num) => String(num).padStart(2, '0');

  return (
    <div className={styles.flashSaleTimer}>
      <span className={styles.label}><FiZap size={14} style={{stroke: '#F36921', fill: '#F36921'}} /> Flash Sale Ends In:</span>
      <div className={styles.timerBlocks}>
        <div className={styles.timerBlock}>
          <span className={styles.timerValue}>{formatTime(timeLeft.hours)}</span>
          <small className={styles.timerUnit}>hrs</small>
        </div>
        <div className={styles.separator}>:</div>
        <div className={styles.timerBlock}>
          <span className={styles.timerValue}>{formatTime(timeLeft.minutes)}</span>
          <small className={styles.timerUnit}>min</small>
        </div>
        <div className={styles.separator}>:</div>
        <div className={styles.timerBlock}>
          <span className={styles.timerValue}>{formatTime(timeLeft.seconds)}</span>
          <small className={styles.timerUnit}>sec</small>
        </div>
      </div>
    </div>
  );
}
