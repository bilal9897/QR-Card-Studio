/**
 * Predefined templates organized by tier (Premium, Luxury, Elite)
 * Each template includes full color configuration for the card
 */

import type { CardColors } from './card-colors';

export type TemplateTier = 'premium' | 'luxury' | 'elite';

export interface CardTemplate {
  id: string;
  name: string;
  category: string;
  businessName: string;
  message: string;
  ctaText: string;
  description: string;
  tier: TemplateTier;
  colors: CardColors;
}

// ============================================
// PROFESSIONAL COLLECTION - Business & social styles
// ============================================
export const premiumTemplates: CardTemplate[] = [
  {
    id: 'google-review',
    name: 'Google Review',
    category: 'Google',
    businessName: 'Your Business Name',
    message: 'Loved your experience? Leave us a Google review! Your feedback helps others discover us.',
    ctaText: 'Review on Google',
    description: 'Google Maps style',
    tier: 'premium',
    colors: {
      background: '#ffffff',
      text: '#202124',
      accent: '#1a73e8',
      qrColor: '#202124',
    },
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'Social',
    businessName: '@yourbusiness',
    message: 'Follow us for updates, behind-the-scenes, and exclusive offers! Tag us in your posts.',
    ctaText: 'Follow on Instagram',
    description: 'Gradient social style',
    tier: 'premium',
    colors: {
      background: '#fafafa',
      text: '#262626',
      accent: '#e1306c',
      qrColor: '#262626',
    },
  },
  {
    id: 'facebook',
    name: 'Facebook',
    category: 'Social',
    businessName: 'Your Business Page',
    message: 'Like our page and share your experience. Join our community for updates and offers!',
    ctaText: 'Like on Facebook',
    description: 'Facebook blue style',
    tier: 'premium',
    colors: {
      background: '#f0f2f5',
      text: '#1c1e21',
      accent: '#1877f2',
      qrColor: '#1c1e21',
    },
  },
  {
    id: 'emerald',
    name: 'Emerald',
    category: 'Luxury',
    businessName: 'Emerald Gardens',
    message: 'Your satisfaction is our greatest achievement. We\'d love to hear from you.',
    ctaText: 'Rate Your Experience',
    description: 'Fresh and refined',
    tier: 'premium',
    colors: {
      background: '#f4f7f4',
      text: '#1e3a2f',
      accent: '#2d5a45',
      qrColor: '#1e3a2f',
    },
  },
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    category: 'Tech',
    businessName: 'Nexus Studios',
    message: 'Help us build better experiences. Your feedback drives innovation.',
    ctaText: 'Share Feedback',
    description: 'Bold and contemporary',
    tier: 'premium',
    colors: {
      background: '#1c1c1e',
      text: '#f5f5f7',
      accent: '#6e6e73',
      qrColor: '#f5f5f7',
    },
  },
  {
    id: 'soft-editorial',
    name: 'Soft Editorial',
    category: 'Creative',
    businessName: 'The Paper House',
    message: 'We craft every experience with care. Tell us what you think.',
    ctaText: 'Write a Review',
    description: 'Warm and inviting',
    tier: 'premium',
    colors: {
      background: '#fdf8f5',
      text: '#4a3f3a',
      accent: '#c88b78',
      qrColor: '#4a3f3a',
    },
  },
];

// ============================================
// LUXURY COLLECTION - Dark gradient designs (6 selected)
// ============================================
export const luxuryTemplates: CardTemplate[] = [
  {
    id: 'midnight-gold',
    name: 'Midnight Gold',
    category: 'Flagship',
    businessName: 'The Gold Standard',
    message: 'Excellence is not a destination, it\'s a journey. Help us perfect every detail.',
    ctaText: 'Share Your Experience',
    description: 'Gold gradient luxury',
    tier: 'luxury',
    colors: {
      background: '#0f0f0f',
      gradient: 'linear-gradient(135deg, #0f0f0f 0%, #1a1510 50%, #0f0f0f 100%)',
      text: '#f5f5f0',
      accent: '#c9a961',
      qrColor: '#c9a961',
    },
  },
  {
    id: 'obsidian-emerald',
    name: 'Obsidian Emerald',
    category: 'Prestige',
    businessName: 'Velvet & Stone',
    message: 'Crafted for those who appreciate the finer things. Your opinion shapes our craft.',
    ctaText: 'Rate Us',
    description: 'Emerald gradient glow',
    tier: 'luxury',
    colors: {
      background: '#0d1a14',
      gradient: 'linear-gradient(135deg, #0d1a14 0%, #0a2015 50%, #0d1a14 100%)',
      text: '#e8f0ec',
      accent: '#4ade80',
      qrColor: '#4ade80',
    },
  },
  {
    id: 'rose-gold-dark',
    name: 'Rose Gold Dark',
    category: 'Luxury',
    businessName: 'Rose & Velvet',
    message: 'Elegance in every detail. Share your refined experience.',
    ctaText: 'Rate Experience',
    description: 'Rose gold gradient',
    tier: 'luxury',
    colors: {
      background: '#121010',
      gradient: 'linear-gradient(135deg, #121010 0%, #1a1215 50%, #121010 100%)',
      text: '#f5ebe0',
      accent: '#e8b4b8',
      qrColor: '#e8b4b8',
    },
  },
  {
    id: 'cosmic-purple',
    name: 'Cosmic Purple',
    category: 'Gradient',
    businessName: 'Cosmic Vibes',
    message: 'Explore the universe of great experiences. Share yours.',
    ctaText: 'Rate Experience',
    description: 'Deep space gradient',
    tier: 'luxury',
    colors: {
      background: '#0a0812',
      gradient: 'linear-gradient(135deg, #0a0812 0%, #1a1030 30%, #0f0820 70%, #0a0812 100%)',
      text: '#f5f0ff',
      accent: '#c084fc',
      qrColor: '#c084fc',
    },
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    category: 'Gradient',
    businessName: 'Northern Lights',
    message: 'Experience the extraordinary. Share your journey with us.',
    ctaText: 'Share Experience',
    description: 'Multi-color aurora',
    tier: 'luxury',
    colors: {
      background: '#0a0a12',
      gradient: 'linear-gradient(135deg, #0a0a12 0%, #1a0a20 25%, #0a1520 50%, #0a2018 75%, #0a0a12 100%)',
      text: '#f0f8ff',
      accent: '#7dd3fc',
      qrColor: '#7dd3fc',
    },
  },
  {
    id: 'sunset-gradient',
    name: 'Sunset Gradient',
    category: 'Gradient',
    businessName: 'Golden Hour',
    message: 'Every moment matters. Tell us about yours.',
    ctaText: 'Rate Us',
    description: 'Warm sunset blend',
    tier: 'luxury',
    colors: {
      background: '#0f0808',
      gradient: 'linear-gradient(135deg, #1a0a08 0%, #1f1008 50%, #0f0808 100%)',
      text: '#fff5eb',
      accent: '#fb923c',
      qrColor: '#fb923c',
    },
  },
];

// ============================================
// ELITE COLLECTION - RGB border premium designs
// ============================================
export const eliteTemplates: CardTemplate[] = [
  {
    id: 'rgb-neon-purple',
    name: 'Neon Purple',
    category: 'RGB Elite',
    businessName: 'Ultraviolet Lounge',
    message: 'Step into the future. Your experience matters to us.',
    ctaText: 'Rate Us',
    description: 'Purple RGB border',
    tier: 'elite',
    colors: {
      background: '#0a0a0a',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #12081a 50%, #0a0a0a 100%)',
      text: '#f0f0f0',
      accent: '#a855f7',
      qrColor: '#a855f7',
      borderGradient: 'linear-gradient(90deg, #a855f7, #6366f1, #a855f7)',
    },
  },
  {
    id: 'rgb-cyber-red',
    name: 'Cyber Red',
    category: 'RGB Elite',
    businessName: 'Red District',
    message: 'Bold experiences deserve bold feedback. Tell us what you think.',
    ctaText: 'Share Feedback',
    description: 'Red RGB border',
    tier: 'elite',
    colors: {
      background: '#0a0a0a',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #150808 50%, #0a0a0a 100%)',
      text: '#fafafa',
      accent: '#ef4444',
      qrColor: '#ef4444',
      borderGradient: 'linear-gradient(90deg, #ef4444, #f97316, #ef4444)',
    },
  },
  {
    id: 'rgb-electric-blue',
    name: 'Electric Blue',
    category: 'RGB Elite',
    businessName: 'Blue Horizon Tech',
    message: 'Innovation starts with your feedback. Help us build better.',
    ctaText: 'Leave Review',
    description: 'Blue RGB border',
    tier: 'elite',
    colors: {
      background: '#0a0a0a',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #080a15 50%, #0a0a0a 100%)',
      text: '#e8f4fc',
      accent: '#3b82f6',
      qrColor: '#3b82f6',
      borderGradient: 'linear-gradient(90deg, #3b82f6, #06b6d4, #3b82f6)',
    },
  },
  {
    id: 'rgb-aqua-teal',
    name: 'Aqua Teal',
    category: 'RGB Elite',
    businessName: 'Ocean Spa',
    message: 'Refresh your senses. Let us know how we did.',
    ctaText: 'Rate Us',
    description: 'Teal RGB border',
    tier: 'elite',
    colors: {
      background: '#0a0a0a',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #081012 50%, #0a0a0a 100%)',
      text: '#e0f7fa',
      accent: '#14b8a6',
      qrColor: '#14b8a6',
      borderGradient: 'linear-gradient(90deg, #14b8a6, #22d3ee, #14b8a6)',
    },
  },
  {
    id: 'rgb-magenta-fusion',
    name: 'Magenta Fusion',
    category: 'RGB Elite',
    businessName: 'Fusion Studio',
    message: 'Creative energy flows here. Share your experience with us.',
    ctaText: 'Review Now',
    description: 'Magenta RGB border',
    tier: 'elite',
    colors: {
      background: '#0a0a0a',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #120810 50%, #0a0a0a 100%)',
      text: '#fdf0fd',
      accent: '#ec4899',
      qrColor: '#ec4899',
      borderGradient: 'linear-gradient(90deg, #ec4899, #f43f5e, #ec4899)',
    },
  },
  {
    id: 'rgb-rainbow',
    name: 'Rainbow Edge',
    category: 'RGB Elite',
    businessName: 'Spectrum Labs',
    message: 'Where creativity meets excellence. Share your colorful experience.',
    ctaText: 'Rate Us',
    description: 'Rainbow RGB border',
    tier: 'elite',
    colors: {
      background: '#0a0a0a',
      gradient: 'linear-gradient(135deg, #0a0a0a 0%, #0f0a0f 50%, #0a0a0a 100%)',
      text: '#f5f5f5',
      accent: '#a78bfa',
      qrColor: '#a78bfa',
      borderGradient: 'linear-gradient(90deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #a855f7, #ef4444)',
    },
  },
];

// All templates combined
export const templates: CardTemplate[] = [
  ...premiumTemplates,
  ...luxuryTemplates,
  ...eliteTemplates,
];

export function getTemplateById(id: string): CardTemplate | undefined {
  return templates.find(t => t.id === id);
}

export function getTemplatesByTier(tier: TemplateTier): CardTemplate[] {
  return templates.filter(t => t.tier === tier);
}

// All features are 100% free - no locks, no Pro, no restrictions
export function isTemplateFree(): boolean {
  return true;
}

// Get tier display info - all templates are completely free
export function getTierInfo(tier: TemplateTier): { label: string; color: string; description: string } {
  return { 
    label: 'Free', 
    color: 'text-success',
    description: '100% Free · HD PNG & PDF export included'
  };
}
