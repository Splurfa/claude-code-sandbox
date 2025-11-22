import { ReactNode, ComponentType } from 'react';

export interface Slide {
  id: number;
  label: string;
  title: ReactNode | string;
  body: string;
  supportingContent: ReactNode; // New field for deep-dive content
  Visual: ComponentType;
}

export interface TypographyProps {
  children: ReactNode;
  className?: string;
}