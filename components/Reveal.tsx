'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay in ms before the reveal animation starts. */
  delay?: number;
  /** Tailwind animation utility to apply when visible. */
  animation?: string;
  as?: 'div' | 'section' | 'li' | 'span';
}

/**
 * Fades/slides its children in the first time they scroll into view.
 * Uses IntersectionObserver; falls back to visible if unsupported.
 */
export default function Reveal({
  children,
  className = '',
  delay = 0,
  animation = 'animate-fade-in-up',
  as = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  return (
    <Tag
      ref={ref}
      style={{ animationDelay: `${delay}ms` }}
      className={`${className} ${visible ? animation : 'opacity-0'}`}
    >
      {children}
    </Tag>
  );
}
