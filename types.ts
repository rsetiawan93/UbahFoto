import { type FC } from 'react';

export type MenuItemKey = 'headshot' | 'remove-object' | 'enhance-quality' | 'change-style' | 'crop' | 'generate-image';

export interface MenuItem {
  key: MenuItemKey;
  label: string;
  description: string;
  icon: FC<{ className?: string }>;
}

export interface GenerationSettings {
  prompt?: string;
  enhancementLevel?: number;
  headshotStyle?: string;
  numberOfImages?: number;
  imageAspectRatio?: string;
}

export interface TutorialStep {
  targetId?: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}