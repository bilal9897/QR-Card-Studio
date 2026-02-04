import { cn } from '@/lib/utils';
import { AlertCircle, Check } from 'lucide-react';
import type { ValidationResult } from '@/lib/validation';

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  maxLength?: number;
  multiline?: boolean;
  required?: boolean;
  hint?: string;
  validation?: ValidationResult;
  showValidation?: boolean;
}

export default function InputField({
  label,
  id,
  value,
  onChange,
  onBlur,
  placeholder,
  maxLength,
  multiline = false,
  required = false,
  hint,
  validation,
  showValidation = false,
}: InputFieldProps) {
  const hasError = showValidation && validation && !validation.isValid;
  const isValid = showValidation && validation?.isValid && value.length > 0;

  const sharedClasses = cn(
    'input-editorial w-full text-base focus-ring',
    hasError && 'input-error',
    isValid && 'input-valid'
  );

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor={id}
          className="block text-xs font-medium uppercase tracking-widest text-muted-foreground"
        >
          {label}
          {required && <span className="text-destructive ml-1" aria-label="required">*</span>}
        </label>
        {maxLength && (
          <span
            className={cn(
              "text-xs",
              value.length > maxLength * 0.9 ? "text-destructive" : "text-muted-foreground/60"
            )}
            aria-live="polite"
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        {multiline ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            maxLength={maxLength}
            className={cn(sharedClasses, 'resize-none min-h-[60px] pr-8')}
            required={required}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
          />
        ) : (
          <input
            type="text"
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            placeholder={placeholder}
            maxLength={maxLength}
            className={cn(sharedClasses, 'pr-8')}
            required={required}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
          />
        )}

        {/* Validation icon */}
        {showValidation && value.length > 0 && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
            {hasError ? (
              <AlertCircle className="w-4 h-4 text-destructive" aria-hidden="true" />
            ) : isValid ? (
              <Check className="w-4 h-4 text-success" aria-hidden="true" />
            ) : null}
          </div>
        )}
      </div>

      {/* Error message */}
      {hasError && validation?.error && (
        <p id={`${id}-error`} className="error-message" role="alert">
          <AlertCircle className="w-3 h-3" aria-hidden="true" />
          {validation.error}
        </p>
      )}

      {/* Hint text */}
      {hint && !hasError && (
        <p id={`${id}-hint`} className="text-xs text-muted-foreground/60">{hint}</p>
      )}
    </div>
  );
}
