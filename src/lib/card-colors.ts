/**
 * Custom card color configuration
 */

export interface CardColors {
  background: string;
  gradient?: string; // Optional CSS gradient for background
  text: string;
  accent: string;
  qrColor: string;
  borderGradient?: string; // Optional RGB border gradient
}

// Predefined color presets
export interface ColorPreset {
  id: string;
  name: string;
  colors: CardColors;
}

export const colorPresets: ColorPreset[] = [
  {
    id: 'classic',
    name: 'Classic Ivory',
    colors: {
      background: '#fdfcfa',
      text: '#1a1815',
      accent: '#b8956e',
      qrColor: '#1a1815',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    colors: {
      background: '#1a1a2e',
      text: '#f5f5f5',
      accent: '#c9a961',
      qrColor: '#f5f5f5',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    colors: {
      background: '#f4f7f4',
      text: '#1e3a2f',
      accent: '#2d5a45',
      qrColor: '#1e3a2f',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    colors: {
      background: '#f5f8fa',
      text: '#1a2e3d',
      accent: '#2563eb',
      qrColor: '#1a2e3d',
    },
  },
  {
    id: 'warm',
    name: 'Warm Terracotta',
    colors: {
      background: '#faf6f3',
      text: '#3d2e26',
      accent: '#c45d3a',
      qrColor: '#3d2e26',
    },
  },
  {
    id: 'minimal',
    name: 'Pure White',
    colors: {
      background: '#ffffff',
      text: '#000000',
      accent: '#000000',
      qrColor: '#000000',
    },
  },
];

export const defaultColors: CardColors = colorPresets[0].colors;

export function getPresetById(id: string): ColorPreset | undefined {
  return colorPresets.find(p => p.id === id);
}
