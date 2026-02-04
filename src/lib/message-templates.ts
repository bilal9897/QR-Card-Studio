/**
 * AI-Powered Message Templates
 * Industry-specific message templates for QR cards
 */

export type BusinessType =
    | 'restaurant'
    | 'cafe'
    | 'salon'
    | 'spa'
    | 'hotel'
    | 'retail'
    | 'fitness'
    | 'healthcare'
    | 'automotive'
    | 'real-estate'
    | 'professional-services'
    | 'education'
    | 'entertainment'
    | 'other';

export type MessageTone = 'professional' | 'friendly' | 'casual' | 'elegant';

export interface MessageTemplate {
    message: string;
    ctaText: string;
    tone: MessageTone;
}

// ============================================
// Industry-Specific Templates
// ============================================

const RESTAURANT_TEMPLATES: Record<MessageTone, MessageTemplate[]> = {
    professional: [
        {
            message: 'Your feedback helps us deliver exceptional dining experiences. Please share your thoughts.',
            ctaText: 'Leave a Review',
            tone: 'professional',
        },
        {
            message: 'We value your opinion and strive for culinary excellence. Share your dining experience with us.',
            ctaText: 'Rate Your Experience',
            tone: 'professional',
        },
        {
            message: 'Your satisfaction is our priority. Help us serve you better by sharing your feedback.',
            ctaText: 'Review Us',
            tone: 'professional',
        },
    ],
    friendly: [
        {
            message: 'Loved your meal? We\'d love to hear about it! Your feedback makes our day.',
            ctaText: 'Share Your Experience',
            tone: 'friendly',
        },
        {
            message: 'Thanks for dining with us! Tell us how we did and help others discover great food.',
            ctaText: 'Leave a Review',
            tone: 'friendly',
        },
        {
            message: 'Your opinion matters! Share your experience and help us keep serving amazing food.',
            ctaText: 'Rate Us',
            tone: 'friendly',
        },
    ],
    casual: [
        {
            message: 'How was everything? Drop us a review and let us know what you think!',
            ctaText: 'Review Us',
            tone: 'casual',
        },
        {
            message: 'Enjoyed your meal? Awesome! Share the love and leave us a quick review.',
            ctaText: 'Leave Review',
            tone: 'casual',
        },
        {
            message: 'Had a great time? Tell the world! Your review helps us grow.',
            ctaText: 'Rate Us',
            tone: 'casual',
        },
    ],
    elegant: [
        {
            message: 'We are honored by your visit. Share your refined dining experience with our community.',
            ctaText: 'Share Experience',
            tone: 'elegant',
        },
        {
            message: 'Excellence is our passion. Your distinguished feedback guides our culinary journey.',
            ctaText: 'Leave Review',
            tone: 'elegant',
        },
        {
            message: 'Your discerning palate inspires us. Share your thoughts on this exceptional experience.',
            ctaText: 'Rate Experience',
            tone: 'elegant',
        },
    ],
};

const SALON_SPA_TEMPLATES: Record<MessageTone, MessageTemplate[]> = {
    professional: [
        {
            message: 'Your feedback helps us provide the best beauty and wellness services. Please share your experience.',
            ctaText: 'Leave a Review',
            tone: 'professional',
        },
        {
            message: 'We strive for perfection in every service. Help us improve by sharing your thoughts.',
            ctaText: 'Rate Your Visit',
            tone: 'professional',
        },
    ],
    friendly: [
        {
            message: 'Feeling fabulous? We\'d love to hear about your experience! Your feedback means the world.',
            ctaText: 'Share Your Glow',
            tone: 'friendly',
        },
        {
            message: 'Thanks for trusting us with your beauty! Tell us how we did.',
            ctaText: 'Leave Review',
            tone: 'friendly',
        },
    ],
    casual: [
        {
            message: 'Looking good? Feeling good? Let us know how we did!',
            ctaText: 'Review Us',
            tone: 'casual',
        },
        {
            message: 'Love your new look? Share it with the world!',
            ctaText: 'Rate Us',
            tone: 'casual',
        },
    ],
    elegant: [
        {
            message: 'Your beauty journey matters to us. Share your luxurious experience.',
            ctaText: 'Share Experience',
            tone: 'elegant',
        },
        {
            message: 'Indulge in excellence. Your refined feedback shapes our artistry.',
            ctaText: 'Leave Review',
            tone: 'elegant',
        },
    ],
};

const RETAIL_TEMPLATES: Record<MessageTone, MessageTemplate[]> = {
    professional: [
        {
            message: 'Your shopping experience matters to us. Share your feedback to help us serve you better.',
            ctaText: 'Leave a Review',
            tone: 'professional',
        },
        {
            message: 'We value your business and your opinion. Tell us about your shopping experience.',
            ctaText: 'Rate Your Visit',
            tone: 'professional',
        },
    ],
    friendly: [
        {
            message: 'Found what you were looking for? We\'d love to hear about your shopping experience!',
            ctaText: 'Share Feedback',
            tone: 'friendly',
        },
        {
            message: 'Thanks for shopping with us! Your review helps others discover great products.',
            ctaText: 'Leave Review',
            tone: 'friendly',
        },
    ],
    casual: [
        {
            message: 'How\'d we do? Drop us a review and let us know!',
            ctaText: 'Review Us',
            tone: 'casual',
        },
        {
            message: 'Love your purchase? Share the love!',
            ctaText: 'Rate Us',
            tone: 'casual',
        },
    ],
    elegant: [
        {
            message: 'Your discerning taste inspires our collection. Share your shopping experience.',
            ctaText: 'Share Experience',
            tone: 'elegant',
        },
    ],
};

const HOTEL_TEMPLATES: Record<MessageTone, MessageTemplate[]> = {
    professional: [
        {
            message: 'Your stay matters to us. Share your experience to help us provide exceptional hospitality.',
            ctaText: 'Leave a Review',
            tone: 'professional',
        },
        {
            message: 'We hope you enjoyed your stay. Your feedback helps us deliver world-class service.',
            ctaText: 'Rate Your Stay',
            tone: 'professional',
        },
    ],
    friendly: [
        {
            message: 'Had a great stay? We\'d love to hear all about it! Your feedback makes our day.',
            ctaText: 'Share Experience',
            tone: 'friendly',
        },
        {
            message: 'Thanks for choosing us! Tell us how your stay was.',
            ctaText: 'Leave Review',
            tone: 'friendly',
        },
    ],
    casual: [
        {
            message: 'Enjoyed your stay? Let us know what you think!',
            ctaText: 'Review Us',
            tone: 'casual',
        },
    ],
    elegant: [
        {
            message: 'Your presence honored us. Share your distinguished stay experience.',
            ctaText: 'Share Experience',
            tone: 'elegant',
        },
        {
            message: 'Luxury is our promise. Your refined feedback shapes our hospitality.',
            ctaText: 'Leave Review',
            tone: 'elegant',
        },
    ],
};

const FITNESS_TEMPLATES: Record<MessageTone, MessageTemplate[]> = {
    professional: [
        {
            message: 'Your fitness journey matters to us. Share your experience to help us serve you better.',
            ctaText: 'Leave a Review',
            tone: 'professional',
        },
    ],
    friendly: [
        {
            message: 'Crushing your goals? We\'d love to hear about your fitness journey!',
            ctaText: 'Share Progress',
            tone: 'friendly',
        },
        {
            message: 'Thanks for training with us! Tell us how we\'re helping you reach your goals.',
            ctaText: 'Leave Review',
            tone: 'friendly',
        },
    ],
    casual: [
        {
            message: 'Getting stronger? Let us know how we\'re doing!',
            ctaText: 'Review Us',
            tone: 'casual',
        },
        {
            message: 'Love your workout? Share the energy!',
            ctaText: 'Rate Us',
            tone: 'casual',
        },
    ],
    elegant: [
        {
            message: 'Your wellness journey inspires us. Share your transformative experience.',
            ctaText: 'Share Experience',
            tone: 'elegant',
        },
    ],
};

const HEALTHCARE_TEMPLATES: Record<MessageTone, MessageTemplate[]> = {
    professional: [
        {
            message: 'Your health and satisfaction are our top priorities. Please share your experience with our care.',
            ctaText: 'Leave Feedback',
            tone: 'professional',
        },
        {
            message: 'We are committed to providing excellent healthcare. Your feedback helps us improve our services.',
            ctaText: 'Rate Your Visit',
            tone: 'professional',
        },
    ],
    friendly: [
        {
            message: 'We hope you\'re feeling better! Share your experience to help us care for others.',
            ctaText: 'Share Feedback',
            tone: 'friendly',
        },
    ],
    casual: [
        {
            message: 'How was your visit? Let us know!',
            ctaText: 'Leave Review',
            tone: 'casual',
        },
    ],
    elegant: [
        {
            message: 'Your well-being is our honor. Share your care experience.',
            ctaText: 'Share Experience',
            tone: 'elegant',
        },
    ],
};

const GENERIC_TEMPLATES: Record<MessageTone, MessageTemplate[]> = {
    professional: [
        {
            message: 'Your feedback helps us deliver exceptional service. Please share your experience.',
            ctaText: 'Leave a Review',
            tone: 'professional',
        },
        {
            message: 'We value your opinion and strive for excellence. Share your thoughts with us.',
            ctaText: 'Rate Your Experience',
            tone: 'professional',
        },
    ],
    friendly: [
        {
            message: 'Had a great experience? We\'d love to hear about it! Your feedback means everything.',
            ctaText: 'Share Feedback',
            tone: 'friendly',
        },
        {
            message: 'Thanks for choosing us! Tell us how we did.',
            ctaText: 'Leave Review',
            tone: 'friendly',
        },
    ],
    casual: [
        {
            message: 'How\'d we do? Drop us a review!',
            ctaText: 'Review Us',
            tone: 'casual',
        },
        {
            message: 'Love what we do? Share the love!',
            ctaText: 'Rate Us',
            tone: 'casual',
        },
    ],
    elegant: [
        {
            message: 'Your experience matters to us. Share your distinguished feedback.',
            ctaText: 'Share Experience',
            tone: 'elegant',
        },
    ],
};

// ============================================
// Template Selection Logic
// ============================================

const TEMPLATE_MAP: Record<BusinessType, Record<MessageTone, MessageTemplate[]>> = {
    restaurant: RESTAURANT_TEMPLATES,
    cafe: RESTAURANT_TEMPLATES,
    salon: SALON_SPA_TEMPLATES,
    spa: SALON_SPA_TEMPLATES,
    hotel: HOTEL_TEMPLATES,
    retail: RETAIL_TEMPLATES,
    fitness: FITNESS_TEMPLATES,
    healthcare: HEALTHCARE_TEMPLATES,
    automotive: GENERIC_TEMPLATES,
    'real-estate': GENERIC_TEMPLATES,
    'professional-services': GENERIC_TEMPLATES,
    education: GENERIC_TEMPLATES,
    entertainment: GENERIC_TEMPLATES,
    other: GENERIC_TEMPLATES,
};

/**
 * Generate message suggestions based on business type and tone
 */
export function generateMessageSuggestions(
    businessType: BusinessType,
    tone: MessageTone,
    count: number = 3
): MessageTemplate[] {
    const templates = TEMPLATE_MAP[businessType]?.[tone] || GENERIC_TEMPLATES[tone];

    // Return up to 'count' templates, shuffled for variety
    const shuffled = [...templates].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

/**
 * Get all available business types
 */
export function getBusinessTypes(): Array<{ value: BusinessType; label: string; emoji: string }> {
    return [
        { value: 'restaurant', label: 'Restaurant', emoji: '🍽️' },
        { value: 'cafe', label: 'Café / Coffee Shop', emoji: '☕' },
        { value: 'salon', label: 'Salon / Barbershop', emoji: '💇' },
        { value: 'spa', label: 'Spa / Wellness', emoji: '🧖' },
        { value: 'hotel', label: 'Hotel / Accommodation', emoji: '🏨' },
        { value: 'retail', label: 'Retail Store', emoji: '🛍️' },
        { value: 'fitness', label: 'Gym / Fitness Center', emoji: '💪' },
        { value: 'healthcare', label: 'Healthcare / Medical', emoji: '🏥' },
        { value: 'automotive', label: 'Automotive / Car Service', emoji: '🚗' },
        { value: 'real-estate', label: 'Real Estate', emoji: '🏠' },
        { value: 'professional-services', label: 'Professional Services', emoji: '💼' },
        { value: 'education', label: 'Education / Training', emoji: '📚' },
        { value: 'entertainment', label: 'Entertainment / Events', emoji: '🎭' },
        { value: 'other', label: 'Other', emoji: '✨' },
    ];
}

/**
 * Get all available tones
 */
export function getMessageTones(): Array<{ value: MessageTone; label: string; description: string }> {
    return [
        { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
        { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
        { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
        { value: 'elegant', label: 'Elegant', description: 'Sophisticated and refined' },
    ];
}
