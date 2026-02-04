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
  // New fields for Marketplace
  rating?: number;
  reviews?: number;
  author?: string;
  isCommunity?: boolean;
}

// ============================================
// PROFESSIONAL COLLECTION - Business & social styles
// ============================================
export const premiumTemplates: CardTemplate[] = [
  {
    id: 'minimalist-black',
    name: 'Minimalist Black',
    category: 'Minimal',
    businessName: 'The Studio',
    message: 'Simplicity is the ultimate sophistication. Rate your experience.',
    ctaText: 'Leave a Review',
    description: 'Clean monochrome style',
    tier: 'premium',
    colors: {
      background: '#ffffff',
      text: '#000000',
      accent: '#000000',
      qrColor: '#000000',
    },
  },
  {
    id: 'corporate-blue',
    name: 'Trust Blue',
    category: 'Business',
    businessName: 'Tech Solutions',
    message: 'Building trust through excellence. Your feedback matters.',
    ctaText: 'Rate Service',
    description: 'Professional blue theme',
    tier: 'premium',
    colors: {
      background: '#f8fafc',
      text: '#0f172a',
      accent: '#0284c7',
      qrColor: '#0284c7',
    },
  },
  {
    id: 'eco-nature',
    name: 'Eco Nature',
    category: 'Nature',
    businessName: 'Green Earth',
    message: 'Sustainability in every step. Share your thoughts.',
    ctaText: 'Review Us',
    description: 'Natural green tones',
    tier: 'premium',
    colors: {
      background: '#f0fdf4',
      text: '#14532d',
      accent: '#16a34a',
      qrColor: '#16a34a',
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
    rating: 4.8,
    reviews: 124,
    author: 'Codexa'
  },
];

// ============================================
// LUXURY COLLECTION - Dark gradient designs (6 selected)
// ============================================
export const luxuryTemplates: CardTemplate[] = [
  {
    id: 'noir-luxe',
    name: 'Noir Luxe',
    category: 'Flagship',
    businessName: 'NOIR & CO.',
    message: 'We craft for perfection. Your feedback defines our next masterpiece.',
    ctaText: 'Rate Experience',
    description: 'Ultra-black premium',
    tier: 'luxury',
    colors: {
      background: '#050505',
      gradient: 'linear-gradient(135deg, #000000 0%, #141414 100%)',
      text: '#ffffff',
      accent: '#ededed',
      qrColor: '#ffffff',
      borderGradient: 'linear-gradient(45deg, #333 0%, #666 50%, #333 100%)' // Metallic rim
    },
  },
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
    id: 'slate-silver',
    name: 'Slate & Silver',
    category: 'Minimal',
    businessName: 'Slate Architecture',
    message: 'Design is in the details. Rate your consultation experience.',
    ctaText: 'Leave Feedback',
    description: 'Matte slate with silver accents',
    tier: 'luxury',
    colors: {
      background: '#1e293b',
      gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      text: '#f8fafc',
      accent: '#e2e8f0',
      qrColor: '#e2e8f0',
      borderGradient: 'linear-gradient(45deg, #94a3b8 0%, #e2e8f0 50%, #94a3b8 100%)'
    },
  },
  {
    id: 'arctic-white',
    name: 'Arctic White',
    category: 'Minimal',
    businessName: 'Nordic Spa',
    message: 'Pure relaxation. Tell us about your visit.',
    ctaText: 'Review Us',
    description: 'Pristine white textured',
    tier: 'luxury',
    colors: {
      background: '#ffffff',
      gradient: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
      text: '#0f172a',
      accent: '#0f172a',
      qrColor: '#0f172a',
    },
  },
  {
    id: 'vantablack',
    name: 'Obsidian Void',
    category: 'Flagship',
    businessName: 'VOID Agency',
    message: 'We operate in the shadows to make you shine.',
    ctaText: 'Rate Service',
    description: 'Deepest matte black',
    tier: 'luxury',
    colors: {
      background: '#000000',
      text: '#333333', // Subtle text
      accent: '#666666',
      qrColor: '#333333',
    },
  },
  {
    id: 'royal-sapphire',
    name: 'Royal Sapphire',
    category: 'Vibrant',
    businessName: 'Sapphire Systems',
    message: 'Excellence in every interaction. Rate your experience.',
    ctaText: 'Review Us',
    description: 'Deep blue luxury',
    tier: 'luxury',
    colors: {
      background: '#0f172a',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      text: '#e2e8f0',
      accent: '#38bdf8',
      qrColor: '#38bdf8',
    },
  },
  {
    id: 'crimson-velvet',
    name: 'Crimson Velvet',
    category: 'Vibrant',
    businessName: 'Red Velvet Lounge',
    message: 'Passion for perfection. Tell us how we did.',
    ctaText: 'Share Love',
    description: 'Rich red premium',
    tier: 'luxury',
    colors: {
      background: '#450a0a',
      gradient: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
      text: '#ffe4e6',
      accent: '#fb7185',
      qrColor: '#fb7185',
    },
  },
  {
    id: 'amethyst-glow',
    name: 'Amethyst Glow',
    category: 'Vibrant',
    businessName: 'Violet & Co.',
    message: 'Creativity without bounds. Share your thoughts.',
    ctaText: 'Rate Creative',
    description: 'Deep purple luxury',
    tier: 'luxury',
    colors: {
      background: '#2e1065',
      gradient: 'linear-gradient(135deg, #2e1065 0%, #581c87 100%)',
      text: '#f3e8ff',
      accent: '#c084fc',
      qrColor: '#c084fc',
    },
  },
  {
    id: 'emerald-prestige',
    name: 'Emerald Prestige',
    category: 'Elite',
    businessName: 'Eden Gardens',
    message: 'Natural luxury. Rate your stay with us.',
    ctaText: 'Review Stay',
    description: 'Deep green & gold',
    tier: 'luxury',
    colors: {
      background: '#022c22',
      gradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
      borderGradient: 'linear-gradient(45deg, #34d399, #10b981)', // Gold/Emerald border effect
      text: '#ecfccb',
      accent: '#10b981',
      qrColor: '#10b981',
    },
  },
  {
    id: 'platinum-horizon',
    name: 'Platinum Horizon',
    category: 'Elite',
    businessName: 'Silverline Architecture',
    message: 'Building the future. Share your vision.',
    ctaText: 'Review Project',
    description: 'Premium silver & slate',
    tier: 'luxury',
    colors: {
      background: '#e2e8f0',
      gradient: 'linear-gradient(135deg, #f8fafc 0%, #cbd5e1 100%)',
      text: '#0f172a',
      accent: '#64748b',
      qrColor: '#0f172a',
    },
  },
  {
    id: 'carbon-executive',
    name: 'Carbon Executive',
    category: 'Elite',
    businessName: 'Apex Dynamics',
    message: 'Performance redefined. Rate our service.',
    ctaText: 'Feedback',
    description: 'Ultra-modern carbon fiber',
    tier: 'luxury',
    colors: {
      background: '#18181b',
      gradient: 'linear-gradient(135deg, #18181b 0%, #27272a 100%)', // Simulated carbon texture base
      text: '#e4e4e7',
      accent: '#a1a1aa', // Metallic Silver
      qrColor: '#e4e4e7',
    },
  },
  {
    id: 'rose-gold-elite',
    name: 'Rose Gold Elite',
    category: 'Elite',
    businessName: 'Lumière Beauty',
    message: 'Elegance is eternal. Join our VIP list.',
    ctaText: 'Join VIP',
    description: 'Deep rose & gold',
    tier: 'luxury',
    colors: {
      background: '#2a0a12',
      gradient: 'linear-gradient(135deg, #2a0a12 0%, #4c0519 100%)',
      borderGradient: 'linear-gradient(45deg, #fb7185, #fda4af)',
      text: '#ffe4e6',
      accent: '#fb7185',
      qrColor: '#fb7185',
    },
  },
  {
    id: 'royal-marble',
    name: 'Royal Marble',
    category: 'Elite',
    businessName: 'The Palace Hotel',
    message: 'A royal welcome awaits. Book your suite.',
    ctaText: 'Book Now',
    description: 'White marble & gold',
    tier: 'luxury',
    colors: {
      background: '#fafafa',
      gradient: 'linear-gradient(135deg, #fafafa 0%, #f4f4f5 100%)',
      borderGradient: 'linear-gradient(45deg, #d4af37, #fcd34d)', // Gold border
      text: '#0f172a',
      accent: '#d4af37',
      qrColor: '#0f172a',
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

// ============================================
// COMMUNITY COLLECTION - User submitted designs
// ============================================
export const communityTemplates: CardTemplate[] = [
  {
    id: 'community-cyber-punk',
    name: 'Neon Streets',
    category: 'Community',
    businessName: 'Cyber Café',
    message: 'Future is now. Rate your brew.',
    ctaText: 'Hack the System',
    description: 'Submitted by @neon_artist',
    tier: 'premium',
    colors: {
      background: '#050510',
      gradient: 'linear-gradient(135deg, #050510 0%, #100510 100%)',
      text: '#00ff41',
      accent: '#d600ff',
      qrColor: '#00ff41',
      borderGradient: 'linear-gradient(90deg, #d600ff, #00ff41)'
    },
    rating: 4.9,
    reviews: 42,
    author: 'neon_artist',
    isCommunity: true
  },
  {
    id: 'community-coffee-roast',
    name: 'Bean & Brew',
    category: 'Community',
    businessName: 'Local Roast',
    message: 'Freshly roasted. Locally loved.',
    ctaText: 'Review Coffee',
    description: 'Submitted by @barista_pro',
    tier: 'premium',
    colors: {
      background: '#3e2723',
      text: '#d7ccc8',
      accent: '#a1887f',
      qrColor: '#d7ccc8',
    },
    rating: 4.5,
    reviews: 18,
    author: 'barista_pro',
    isCommunity: true
  },
  {
    id: 'community-sunset',
    name: 'Vaporwave Sunset',
    category: 'Community',
    businessName: 'Retro Vibes',
    message: 'Chill beats & good eats.',
    ctaText: 'Vibe Check',
    description: 'Submitted by @retro_king',
    tier: 'premium',
    colors: {
      background: '#2d0036',
      gradient: 'linear-gradient(180deg, #2d0036 0%, #000000 100%)',
      text: '#00ffff',
      accent: '#ff00ff',
      qrColor: '#00ffff',
    },
    rating: 4.7,
    reviews: 89,
    author: 'retro_king',
    isCommunity: true
  },
  {
    id: 'community-glitch-city',
    name: 'Glitch City',
    category: 'Community',
    businessName: 'CYBER_CAFE',
    message: 'System.override(review); // Share your data',
    ctaText: 'EXECUTE',
    description: 'High-tech cyberpunk aesthetic',
    tier: 'premium',
    colors: {
      background: '#050505',
      gradient: 'linear-gradient(135deg, #050505 0%, #1a0b1a 100%)',
      text: '#00ff41',
      accent: '#ff0055',
      qrColor: '#00ff41',
      borderGradient: 'linear-gradient(90deg, #00ff41, #ff0055)',
    },
    rating: 4.8,
    reviews: 64,
    author: 'hackerman',
    isCommunity: true
  },
  {
    id: 'community-matcha',
    name: 'Matcha Latte',
    category: 'Community',
    businessName: 'Zen Tea House',
    message: 'Find your inner peace. How was your tea?',
    ctaText: 'Sip & Review',
    description: 'Soft green and cream tones',
    tier: 'premium',
    colors: {
      background: '#f7f9f2',
      text: '#4a5d23',
      accent: '#88a856',
      qrColor: '#4a5d23',
    },
    rating: 4.9,
    reviews: 128,
    author: 'tea_lover',
    isCommunity: true
  },
  {
    id: 'community-80s-arcade',
    name: '80s Arcade',
    category: 'Community',
    businessName: 'Insert Coin',
    message: 'HIGH SCORE! Enter your initials (and feedback).',
    ctaText: 'START',
    description: 'Retro synthwave vibes',
    tier: 'premium',
    colors: {
      background: '#1a0b2e',
      gradient: 'linear-gradient(180deg, #1a0b2e 0%, #2b003b 100%)',
      text: '#ff00ff',
      accent: '#00ffff',
      qrColor: '#00ffff',
      borderGradient: 'linear-gradient(to right, #ff00ff, #00ffff)',
    },
    rating: 4.7,
    reviews: 92,
    author: 'pixel_pete',
    isCommunity: true
  },
  {
    id: 'community-deep-sea',
    name: 'Deep Sea',
    category: 'Community',
    businessName: 'Abyss Aquarium',
    message: 'Dive into the unknown. Share your discovery.',
    ctaText: 'Dive in',
    description: 'Bioluminescent blue depths',
    tier: 'premium',
    colors: {
      background: '#020412',
      gradient: 'radial-gradient(circle at center, #0a1033 0%, #000000 100%)',
      text: '#a5f3fc',
      accent: '#22d3ee',
      qrColor: '#22d3ee',
    },
    rating: 4.6,
    reviews: 45,
    author: 'ocean_blue',
    isCommunity: true
  },
  {
    id: 'community-concrete',
    name: 'Concrete Jungle',
    category: 'Community',
    businessName: 'Urban Outfitters',
    message: 'Built to last. Rate our gear.',
    ctaText: 'Feedback',
    description: 'Industrial grey with caution yellow',
    tier: 'premium',
    colors: {
      background: '#262626',
      text: '#f5f5f5',
      accent: '#facc15', // Traffic yellow
      qrColor: '#facc15',
    },
    rating: 4.5,
    reviews: 33,
    author: 'brutalist_arch',
    isCommunity: true
  },
  {
    id: 'community-cherry',
    name: 'Cherry Blossom',
    category: 'Community',
    businessName: 'Sakura Sushi',
    message: 'Blooming with flavor. Tell us more.',
    ctaText: 'Review',
    description: 'Delicate pink and white',
    tier: 'premium',
    colors: {
      background: '#fff0f5', // Lavender blush
      gradient: 'linear-gradient(135deg, #fff0f5 0%, #ffe4e6 100%)',
      text: '#9d174d',
      accent: '#fbcfe8',
      qrColor: '#9d174d',
    },
    rating: 4.9,
    reviews: 210,
    author: 'hana_design',
    isCommunity: true
  },
  {
    id: 'community-solar',
    name: 'Solar Flare',
    category: 'Community',
    businessName: 'Sunburst Café',
    message: 'Start your day bright. How was your coffee?',
    ctaText: 'Shine On',
    description: 'Intense orange and yellow energy',
    tier: 'premium',
    colors: {
      background: '#fff7ed',
      gradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
      text: '#c2410c',
      accent: '#f97316',
      qrColor: '#ea580c',
    },
    rating: 4.7,
    reviews: 76,
    author: 'sunny_d',
    isCommunity: true
  },
  {
    id: 'community-hacker',
    name: 'Terminal_01',
    category: 'Community',
    businessName: './root_access',
    message: 'input("Enter feedback:");',
    ctaText: 'Submit()',
    description: 'Matrix green terminal style',
    tier: 'premium',
    colors: {
      background: '#0c0c0c',
      text: '#22c55e',
      accent: '#16a34a',
      qrColor: '#22c55e',
    },
    rating: 4.8,
    reviews: 150,
    author: 'neo_101',
    isCommunity: true
  },
  {
    id: 'community-comic',
    name: 'Pop Art',
    category: 'Community',
    businessName: 'POW! Diner',
    message: 'BOOM! Did we blow your mind?',
    ctaText: 'ZAP!',
    description: 'Comic book style colors',
    tier: 'premium',
    colors: {
      background: '#ffffff',
      text: '#000000',
      accent: '#ef4444', // Comic Red
      qrColor: '#000000',
      borderGradient: 'repeating-linear-gradient(45deg, #ef4444, #ef4444 10px, #ffffff 10px, #ffffff 20px)',
    },
    rating: 4.4,
    reviews: 28,
    author: 'stan_lee_fan',
    isCommunity: true
  },
  {
    id: 'community-golden-hour',
    name: 'Golden Hour',
    category: 'Community',
    businessName: 'Horizon Photography',
    message: 'Capture the moment. Review your session.',
    ctaText: 'Review',
    description: 'Warm sunset gradients',
    tier: 'premium',
    colors: {
      background: '#451a03',
      gradient: 'linear-gradient(to bottom, #451a03, #78350f)',
      text: '#fef3c7',
      accent: '#fbbf24',
      qrColor: '#fbbf24',
    },
    rating: 4.9,
    reviews: 88,
    author: 'shutter_bug',
    isCommunity: true
  }
];

// ============================================
// INDUSTRY COLLECTION - 40 New Templates
// ============================================
export const industryTemplates: CardTemplate[] = [
  // --- HOSPITALITY (5) ---
  {
    id: 'hosp-fine-dining',
    name: 'Maison Culinaire',
    category: 'Hospitality',
    businessName: 'Le Petit Chef',
    message: 'A symphony of flavors. How was your evening?',
    ctaText: 'Rate Cuisine',
    description: 'Classic French elegance',
    tier: 'premium',
    colors: { background: '#fffcf5', text: '#3c2f2f', accent: '#c19a6b', qrColor: '#3c2f2f' }
  },
  {
    id: 'hosp-burger',
    name: 'Burger Shack',
    category: 'Hospitality',
    businessName: 'Grill & Chill',
    message: 'Juicy burgers, cold drinks. Did we hit the spot?',
    ctaText: 'Rate Your Meal',
    description: 'Bold red and yellow',
    tier: 'premium',
    colors: { background: '#fffbeb', text: '#991b1b', accent: '#f59e0b', qrColor: '#991b1b' }
  },
  {
    id: 'hosp-pizza',
    name: 'Rustica Pizza',
    category: 'Hospitality',
    businessName: 'Napoli Pizza',
    message: 'Wood-fired perfection. Share a slice of your thoughts.',
    ctaText: 'Review Pizza',
    description: 'Italian flag inspired tones',
    tier: 'premium',
    colors: { background: '#fef2f2', text: '#166534', accent: '#dc2626', qrColor: '#166534' }
  },
  {
    id: 'hosp-sushi',
    name: 'Zen Sushi',
    category: 'Hospitality',
    businessName: 'Sakura Roll',
    message: 'Fresh, precise, delicious. Rate your Omakase.',
    ctaText: 'Rate Sushi',
    description: 'Minimalist japanese style',
    tier: 'premium',
    colors: { background: '#1c1917', text: '#f5f5f4', accent: '#ea580c', qrColor: '#ea580c' }
  },
  {
    id: 'hosp-bakery',
    name: 'Sweet Crumb',
    category: 'Hospitality',
    businessName: 'Morning Bake',
    message: 'Baked with love. How was your treat?',
    ctaText: 'Sweet Review',
    description: 'Pastel pink and brown',
    tier: 'premium',
    colors: { background: '#fff1f2', text: '#4a044e', accent: '#db2777', qrColor: '#be185d' }
  },

  // --- WELLNESS (5) ---
  {
    id: 'well-spa',
    name: 'Serenity Spa',
    category: 'Wellness',
    businessName: 'Lotus Spa',
    message: 'Relax, renew, refresh. How do you feel?',
    ctaText: 'Rate Relaxation',
    description: 'Calming lavender',
    tier: 'luxury',
    colors: { background: '#f5f3ff', text: '#4c1d95', accent: '#8b5cf6', qrColor: '#6d28d9' }
  },
  {
    id: 'well-gym',
    name: 'Iron Strength',
    category: 'Wellness',
    businessName: 'Titan Gym',
    message: 'Crush your goals. Rate the facility.',
    ctaText: 'Review Gym',
    description: 'High energy black and yellow',
    tier: 'premium',
    colors: { background: '#000000', text: '#ffffff', accent: '#eab308', qrColor: '#eab308' }
  },
  {
    id: 'well-yoga',
    name: 'Flow Yoga',
    category: 'Wellness',
    businessName: 'Namaste Studio',
    message: 'Find your center. Breath in, review out.',
    ctaText: 'Share Peace',
    description: 'Earthy bamboo tones',
    tier: 'premium',
    colors: { background: '#f7fee7', text: '#365314', accent: '#84cc16', qrColor: '#4d7c0f' }
  },
  {
    id: 'well-barber',
    name: 'Gentleman Cut',
    category: 'Wellness',
    businessName: 'The Fade Shop',
    message: 'Look sharp, feel sharp. Rate your cut.',
    ctaText: 'Rate Barber',
    description: 'Vintage leather and steel',
    tier: 'premium',
    colors: { background: '#27272a', text: '#e4e4e7', accent: '#a1a1aa', qrColor: '#e4e4e7' }
  },
  {
    id: 'well-nail',
    name: 'Polished',
    category: 'Wellness',
    businessName: 'Glamour Nails',
    message: 'Nailed it? Tell us about your manicure.',
    ctaText: 'Rate Art',
    description: 'Vibrant hot pink',
    tier: 'premium',
    colors: { background: '#fff0f6', text: '#831843', accent: '#db2777', qrColor: '#be185d' }
  },

  // --- RETAIL (5) ---
  {
    id: 'ret-boutique',
    name: 'Chic Boutique',
    category: 'Retail',
    businessName: 'Vogue & Co',
    message: 'Style that speaks. Rate your findings.',
    ctaText: 'Fashion Review',
    description: 'Elegant beige and black',
    tier: 'luxury',
    colors: { background: '#fafaf9', text: '#1c1917', accent: '#44403c', qrColor: '#1c1917' }
  },
  {
    id: 'ret-sneaker',
    name: 'Kicks Drop',
    category: 'Retail',
    businessName: 'Sole Caliber',
    message: 'Fresh drops only. Rate the heat.',
    ctaText: 'Rate Kicks',
    description: 'Streetwear orange',
    tier: 'premium',
    colors: { background: '#171717', text: '#ffffff', accent: '#f97316', qrColor: '#f97316' }
  },
  {
    id: 'ret-book',
    name: 'Chapter One',
    category: 'Retail',
    businessName: 'City Books',
    message: 'A world of stories. What did you read?',
    ctaText: 'Review Book',
    description: 'Cozy paper tones',
    tier: 'premium',
    colors: { background: '#fefce8', text: '#422006', accent: '#854d0e', qrColor: '#713f12' }
  },
  {
    id: 'ret-tech',
    name: 'Future Tech',
    category: 'Retail',
    businessName: 'Gadget Hub',
    message: 'Upgrade your life. Rate the gear.',
    ctaText: 'Tech Review',
    description: 'Clean Apple-white',
    tier: 'premium',
    colors: { background: '#f3f4f6', text: '#111827', accent: '#3b82f6', qrColor: '#2563eb' }
  },
  {
    id: 'ret-florist',
    name: 'Petal Pushers',
    category: 'Retail',
    businessName: 'Bloom Studio',
    message: 'Fresh flowers daily. Did they bloom?',
    ctaText: 'Rate Bouquet',
    description: 'Soft floral pastels',
    tier: 'premium',
    colors: { background: '#fdf2f8', text: '#831843', accent: '#f472b6', qrColor: '#db2777' }
  },

  // --- PROFESSIONAL (5) ---
  {
    id: 'prof-law',
    name: 'Justice Scales',
    category: 'Professional',
    businessName: 'Smith & Partners',
    message: 'Defending your rights. Rate our counsel.',
    ctaText: 'Legal Review',
    description: 'Traditional navy and gold',
    tier: 'luxury',
    colors: { background: '#0f172a', text: '#f1f5f9', accent: '#bfdbfe', qrColor: '#bfdbfe' }
  },
  {
    id: 'prof-estate',
    name: 'Prime Estate',
    category: 'Professional',
    businessName: 'Luxury Living',
    message: 'Find your dream home. How was the tour?',
    ctaText: 'Rate Agent',
    description: 'Trustworthy teal',
    tier: 'premium',
    colors: { background: '#f0fdfa', text: '#134e4a', accent: '#14b8a6', qrColor: '#0d9488' }
  },
  {
    id: 'prof-dental',
    name: 'Bright Smile',
    category: 'Professional',
    businessName: 'Gentle Dental',
    message: 'Smile brighter. How was your visit?',
    ctaText: 'Review Care',
    description: 'Clinical clean blue',
    tier: 'premium',
    colors: { background: '#f0f9ff', text: '#0c4a6e', accent: '#0ea5e9', qrColor: '#0284c7' }
  },
  {
    id: 'prof-marketing',
    name: 'Growth Hacking',
    category: 'Professional',
    businessName: 'Scale Up Agency',
    message: 'Results matter. Did we deliver?',
    ctaText: 'Rate Campaign',
    description: 'Startup purple',
    tier: 'premium',
    colors: { background: '#faf5ff', text: '#581c87', accent: '#a855f7', qrColor: '#9333ea' }
  },
  {
    id: 'prof-cowork',
    name: 'Cowork Hive',
    category: 'Professional',
    businessName: 'The Hive',
    message: 'Work together, grow together. Rate the space.',
    ctaText: 'Review Space',
    description: 'Modern yellow and black',
    tier: 'premium',
    colors: { background: '#fefce8', text: '#422006', accent: '#eab308', qrColor: '#ca8a04' }
  },

  // --- NIGHTLIFE (5) ---
  {
    id: 'night-club',
    name: 'Bass Drop',
    category: 'Nightlife',
    businessName: 'Club Pulse',
    message: 'The night is young. How was the vibe?',
    ctaText: 'Review Party',
    description: 'Dark mode with neon pink',
    tier: 'elite',
    colors: { background: '#000000', text: '#ffffff', accent: '#ec4899', qrColor: '#db2777' }
  },
  {
    id: 'night-bar',
    name: 'Speakeasy',
    category: 'Nightlife',
    businessName: 'The Blind Tiger',
    message: 'Secret recipes. Did you enjoy the mix?',
    ctaText: 'Rate Drinks',
    description: 'Prohibition gold and black',
    tier: 'luxury',
    colors: { background: '#1c1917', text: '#d6d3d1', accent: '#a8a29e', qrColor: '#d6d3d1' }
  },
  {
    id: 'night-pub',
    name: 'Irish Stout',
    category: 'Nightlife',
    businessName: 'O\'Malley\'s',
    message: 'Good pints, good friends. Sláinte!',
    ctaText: 'Rate Pub',
    description: 'Deep green and wood',
    tier: 'premium',
    colors: { background: '#022c22', text: '#ecfccb', accent: '#84cc16', qrColor: '#65a30d' }
  },
  {
    id: 'night-comedy',
    name: 'Laugh Track',
    category: 'Nightlife',
    businessName: 'Jesters Club',
    message: 'Laughter is the best medicine. Were we funny?',
    ctaText: 'Rate Show',
    description: 'Spotlight red',
    tier: 'premium',
    colors: { background: '#000000', text: '#ffffff', accent: '#ef4444', qrColor: '#dc2626' }
  },
  {
    id: 'night-lounge',
    name: 'Velvet Lounge',
    category: 'Nightlife',
    businessName: 'Skyline Lounge',
    message: 'Views and vibes. How was the service?',
    ctaText: 'Review Night',
    description: 'Sophisticated deep blue',
    tier: 'luxury',
    colors: { background: '#0f172a', text: '#e2e8f0', accent: '#38bdf8', qrColor: '#0ea5e9' }
  },

  // --- TRAVEL (5) ---
  {
    id: 'trav-hotel',
    name: 'Grand Lobby',
    category: 'Travel',
    businessName: 'Grand Hotel',
    message: 'Your home away from home. Rate your stay.',
    ctaText: 'Review Stay',
    description: 'Classic luxury gold',
    tier: 'luxury',
    colors: { background: '#fffbeb', text: '#78350f', accent: '#d97706', qrColor: '#b45309' }
  },
  {
    id: 'trav-pool',
    name: 'Poolside',
    category: 'Travel',
    businessName: 'Azure Resort',
    message: 'Splash into luxury. How was the pool?',
    ctaText: 'Rate Resort',
    description: 'Bright aqua blue',
    tier: 'premium',
    colors: { background: '#ecfeff', text: '#164e63', accent: '#06b6d4', qrColor: '#0891b2' }
  },
  {
    id: 'trav-tour',
    name: 'City Guide',
    category: 'Travel',
    businessName: 'Urban Tours',
    message: 'Explore the hidden gems. Did you learn something new?',
    ctaText: 'Review Tour',
    description: 'Map colors',
    tier: 'premium',
    colors: { background: '#fff7ed', text: '#9a3412', accent: '#f97316', qrColor: '#ea580c' }
  },
  {
    id: 'trav-lounge',
    name: 'First Class',
    category: 'Travel',
    businessName: 'Aero Lounge',
    message: 'Fly in comfort. Rate the lounge.',
    ctaText: 'Rate Access',
    description: 'Sleek silver and navy',
    tier: 'luxury',
    colors: { background: '#1e293b', text: '#f8fafc', accent: '#94a3b8', qrColor: '#cbd5e1' }
  },
  {
    id: 'trav-car',
    name: 'Road Trip',
    category: 'Travel',
    businessName: 'Speedy Rental',
    message: 'Drive your adventure. How was the car?',
    ctaText: 'Rate Ride',
    description: 'Automotive red',
    tier: 'premium',
    colors: { background: '#fef2f2', text: '#991b1b', accent: '#ef4444', qrColor: '#dc2626' }
  },

  // --- SERVICE (5) ---
  {
    id: 'serv-auto',
    name: 'Mechanic Pro',
    category: 'Service',
    businessName: 'Auto Fix',
    message: 'Back on the road. Rate our repair.',
    ctaText: 'Rate Service',
    description: 'Grease and gear colors',
    tier: 'premium',
    colors: { background: '#171717', text: '#e5e5e5', accent: '#ef4444', qrColor: '#dc2626' }
  },
  {
    id: 'serv-pet',
    name: 'Happy Paws',
    category: 'Service',
    businessName: 'Puppy Love',
    message: 'Wagging tails guaranteed. How did we do?',
    ctaText: 'Woof Review',
    description: 'Playful orange',
    tier: 'premium',
    colors: { background: '#fff7ed', text: '#9a3412', accent: '#fb923c', qrColor: '#f97316' }
  },
  {
    id: 'serv-clean',
    name: 'Fresh Pressed',
    category: 'Service',
    businessName: 'Spotless Cleaners',
    message: 'Crisp and clean. Rate your garment care.',
    ctaText: 'Review Clean',
    description: 'Clean crisp blue',
    tier: 'premium',
    colors: { background: '#f0f9ff', text: '#075985', accent: '#0ea5e9', qrColor: '#0284c7' }
  },
  {
    id: 'serv-tattoo',
    name: 'Ink Master',
    category: 'Service',
    businessName: 'Needle Art',
    message: 'Art on skin. Rate your session.',
    ctaText: 'Review Ink',
    description: 'Bold black and white',
    tier: 'premium',
    colors: { background: '#000000', text: '#ffffff', accent: '#ffffff', qrColor: '#ffffff' }
  },
  {
    id: 'serv-tailor',
    name: 'Bespoke Fit',
    category: 'Service',
    businessName: 'Master Tailor',
    message: 'Perfect fit, perfect style. Rate our stitch.',
    ctaText: 'Review Fit',
    description: 'Classic fabric colors',
    tier: 'premium',
    colors: { background: '#3f3f46', text: '#f4f4f5', accent: '#a1a1aa', qrColor: '#d4d4d8' }
  },

  // --- EVENTS (5) ---
  {
    id: 'ev-wedding',
    name: 'Ever After',
    category: 'Events',
    businessName: 'The Wedding Co',
    message: 'A day to remember. Share your memories.',
    ctaText: 'Love Note',
    description: 'Romantic white and gold',
    tier: 'luxury',
    colors: { background: '#fafaf9', text: '#57534e', accent: '#d4af37', qrColor: '#a8a29e' }
  },
  {
    id: 'ev-food',
    name: 'Street Eats',
    category: 'Events',
    businessName: 'Taco Truck',
    message: 'Street food vibes. Tasted good?',
    ctaText: 'Yum Review',
    description: 'Vibrant street colors',
    tier: 'premium',
    colors: { background: '#fefce8', text: '#854d0e', accent: '#eab308', qrColor: '#ca8a04' }
  },
  {
    id: 'ev-music',
    name: 'Main Stage',
    category: 'Events',
    businessName: 'Summer Fest',
    message: 'Rock on! How was the lineup?',
    ctaText: 'Rate Fest',
    description: 'Electric neon',
    tier: 'elite',
    colors: { background: '#111827', text: '#f3f4f6', accent: '#22d3ee', qrColor: '#06b6d4' }
  },
  {
    id: 'ev-art',
    name: 'Gallery Wall',
    category: 'Events',
    businessName: 'Modern Art',
    message: 'Art speaks. What did it say to you?',
    ctaText: 'Critique',
    description: 'Minimalist museum style',
    tier: 'premium',
    colors: { background: '#ffffff', text: '#171717', accent: '#dc2626', qrColor: '#000000' }
  },
  {
    id: 'ev-conf',
    name: 'Tech Summit',
    category: 'Events',
    businessName: 'Innovate Conf',
    message: 'Ideas that change the world. Rate the talks.',
    ctaText: 'Feedback',
    description: 'Corporate blue and grey',
    tier: 'premium',
    colors: { background: '#f1f5f9', text: '#0f172a', accent: '#2563eb', qrColor: '#1d4ed8' }
  },
];

// ============================================
// ALL TEMPLATES COMBINED
// ============================================
export const templates: CardTemplate[] = [
  ...premiumTemplates,
  ...luxuryTemplates,
  ...eliteTemplates,
  ...communityTemplates,
  ...industryTemplates,
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
