import React from 'react';
import { TypographyProps } from '../types';

export const SerifDisplay: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h1 className={`font-serif text-4xl sm:text-4xl md:text-4xl lg:text-5xl leading-[1.05] text-white tracking-tight ${className}`}>
    {children}
  </h1>
);

export const MonoLabel: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <span className={`font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-white/40 ${className}`}>
    {children}
  </span>
);

export const SubHeading: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <h3 className={`font-serif text-lg md:text-xl text-white leading-tight mb-1 ${className}`}>
    {children}
  </h3>
);

export const BodyText: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <p className={`font-serif text-lg sm:text-xl md:text-xl text-white/80 leading-relaxed max-w-xl font-light ${className}`}>
    {children}
  </p>
);

export const SupportingText: React.FC<TypographyProps> = ({ children, className = '' }) => (
  <div className={`
    font-serif text-lg md:text-lg text-white/70 leading-relaxed
    max-w-xl
    ${className}
  `}>
    {children}
  </div>
);