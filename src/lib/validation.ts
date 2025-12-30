/**
 * Input validation and sanitization utilities
 * Prevents XSS attacks and ensures data integrity
 */

// HTML entity encoding to prevent XSS
export function sanitizeText(input: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

// Remove potentially dangerous patterns
export function cleanInput(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Business name validation
export function validateBusinessName(name: string): ValidationResult {
  const cleaned = cleanInput(name);
  
  if (!cleaned) {
    return { isValid: false, error: 'Business name is required' };
  }
  
  if (cleaned.length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (cleaned.length > 40) {
    return { isValid: false, error: 'Name must be under 40 characters' };
  }
  
  // Allow letters, numbers, spaces, and common business punctuation
  const validPattern = /^[\p{L}\p{N}\s\-'&.,!]+$/u;
  if (!validPattern.test(cleaned)) {
    return { isValid: false, error: 'Contains invalid characters' };
  }
  
  return { isValid: true };
}

// Message validation
export function validateMessage(message: string): ValidationResult {
  const cleaned = cleanInput(message);
  
  if (cleaned.length > 150) {
    return { isValid: false, error: 'Message must be under 150 characters' };
  }
  
  return { isValid: true };
}

// URL validation - strict http/https only
export function validateFeedbackUrl(url: string): ValidationResult {
  if (!url.trim()) {
    return { isValid: false, error: 'Feedback link is required' };
  }
  
  // Must start with http:// or https://
  const urlPattern = /^https?:\/\//i;
  if (!urlPattern.test(url)) {
    return { isValid: false, error: 'URL must start with http:// or https://' };
  }
  
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { isValid: false, error: 'Only HTTP/HTTPS URLs are allowed' };
    }
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
}

// CTA text validation
export function validateCtaText(cta: string): ValidationResult {
  const cleaned = cleanInput(cta);
  
  if (cleaned.length > 25) {
    return { isValid: false, error: 'CTA must be under 25 characters' };
  }
  
  return { isValid: true };
}

// File validation for logos
export interface FileValidationResult extends ValidationResult {
  sanitizedFile?: File;
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export function validateLogoFile(file: File): FileValidationResult {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Only PNG, JPG, SVG, or WebP files are allowed' 
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { 
      isValid: false, 
      error: 'File must be smaller than 2MB' 
    };
  }
  
  // Check for valid file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
  if (!extension || !validExtensions.includes(extension)) {
    return { 
      isValid: false, 
      error: 'Invalid file extension' 
    };
  }
  
  return { isValid: true, sanitizedFile: file };
}

// Check if form is valid for submission
export function isFormValid(
  businessName: string,
  feedbackUrl: string
): boolean {
  return (
    validateBusinessName(businessName).isValid &&
    validateFeedbackUrl(feedbackUrl).isValid
  );
}
