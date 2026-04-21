/**
 * Layout Transition Component with 60fps Animations
 * Uses framer-motion for hardware-accelerated animations
 * Implements Soft Premium design system
 */

'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Fade In variant for smooth entrance
 */
const fadeInVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.3, ease: 'easeInOut' },
};

/**
 * Slide in from bottom variant
 */
const slideUpVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
  transition: { duration: 0.4, ease: 'easeOut' },
};

/**
 * Scale and fade variant
 */
const scaleInVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.3, ease: 'easeOut' },
};

/**
 * Staggered children animation
 */
const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

/**
 * Page transition wrapper component
 */
export const PageTransition = ({ children, variant = 'fadeIn' }) => {
  const variants = {
    fadeIn: fadeInVariants,
    slideUp: slideUpVariants,
    scaleIn: scaleInVariants,
  };

  const selectedVariant = variants[variant] || fadeInVariants;

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={selectedVariant}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stagger container for list animations
 */
export const StaggerContainer = ({ children, delayChildren = 0.1, staggerChildren = 0.1 }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={{
        ...containerVariants,
        animate: {
          opacity: 1,
          transition: {
            staggerChildren,
            delayChildren,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Stagger item for list animations
 */
export const StaggerItem = ({ children, variant = 'slideUp' }) => {
  const variants = {
    slideUp: slideUpVariants,
    scaleIn: scaleInVariants,
    fadeIn: fadeInVariants,
  };

  const selectedVariant = variants[variant] || slideUpVariants;

  return (
    <motion.div variants={selectedVariant}>
      {children}
    </motion.div>
  );
};

/**
 * Tab switch animation
 */
export const TabTransition = ({ children, isActive }) => {
  return (
    <motion.div
      animate={{
        opacity: isActive ? 1 : 0,
        y: isActive ? 0 : 10,
      }}
      transition={{ duration: 0.2 }}
      style={{
        pointerEvents: isActive ? 'auto' : 'none',
      }}
    >
      {children}
    </motion.div>
  );
};

/**
 * Smooth layout ID wrapper for shared layout animation
 */
export const LayoutWrapper = ({ layoutId, children, ...props }) => {
  return (
    <motion.div layoutId={layoutId} {...props}>
      {children}
    </motion.div>
  );
};

/**
 * Button with hover animation
 */
export const AnimatedButton = React.forwardRef(
  ({ children, onClick, variant = 'primary', ...props }, ref) => {
    const baseClasses = {
      primary: 'bg-purple-600 hover:bg-purple-700 text-white',
      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
      outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        className={`px-4 py-2 rounded-lg font-semibold transition-all ${baseClasses[variant]}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

/**
 * Shimmer loading animation
 */
export const ShimmerLoader = ({ width = 'w-full', height = 'h-4' }) => {
  return (
    <motion.div
      className={`${width} ${height} bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded`}
      animate={{
        backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundSize: '200% 100%',
      }}
    />
  );
};

/**
 * Accordion item with smooth animation
 */
export const AccordionItem = ({ isOpen, title, children }) => {
  return (
    <motion.div className="border-b border-gray-200">
      <motion.button
        className="w-full py-4 flex justify-between items-center text-left font-semibold text-gray-900 hover:text-purple-600 transition-colors"
        onClick={isOpen}
        whileHover={{ x: 4 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        {title}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          â–¼
        </motion.span>
      </motion.button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        style={{ overflow: 'hidden' }}
      >
        <motion.div className="pb-4 text-gray-600">
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/**
 * Modal with backdrop animation
 */
export const ModalTransition = ({ isOpen, children, onClose }) => {
  return (
    <>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
          >
            <motion.div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              {children}
            </motion.div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default {
  PageTransition,
  StaggerContainer,
  StaggerItem,
  TabTransition,
  LayoutWrapper,
  AnimatedButton,
  ShimmerLoader,
  AccordionItem,
  ModalTransition,
};


