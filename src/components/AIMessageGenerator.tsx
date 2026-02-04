import { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import {
    type BusinessType,
    type MessageTone,
    type MessageTemplate,
    generateMessageSuggestions,
    getBusinessTypes,
    getMessageTones,
} from '@/lib/message-templates';

interface AIMessageGeneratorProps {
    onSelectMessage: (message: string, ctaText: string) => void;
}

export default function AIMessageGenerator({ onSelectMessage }: AIMessageGeneratorProps) {
    const [businessType, setBusinessType] = useState<BusinessType>('restaurant');
    const [tone, setTone] = useState<MessageTone>('friendly');
    const [suggestions, setSuggestions] = useState<MessageTemplate[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const businessTypes = getBusinessTypes();
    const tones = getMessageTones();

    const handleGenerate = () => {
        setIsGenerating(true);

        // Simulate AI processing delay for better UX
        setTimeout(() => {
            const newSuggestions = generateMessageSuggestions(businessType, tone, 3);
            setSuggestions(newSuggestions);
            setIsGenerating(false);
        }, 800);
    };

    const handleSelectSuggestion = (template: MessageTemplate) => {
        onSelectMessage(template.message, template.ctaText);
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-medium">AI Message Generator</h3>
            </div>

            <p className="text-xs text-muted-foreground">
                Generate professional messages tailored to your business type and tone.
            </p>

            {/* Business Type Selector */}
            <div>
                <label htmlFor="business-type" className="block text-sm font-medium mb-2">
                    Business Type
                </label>
                <select
                    id="business-type"
                    value={businessType}
                    onChange={(e) => setBusinessType(e.target.value as BusinessType)}
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                    {businessTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.emoji} {type.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tone Selector */}
            <div>
                <label htmlFor="message-tone" className="block text-sm font-medium mb-2">
                    Message Tone
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {tones.map((t) => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => setTone(t.value)}
                            className={`p-3 text-left border rounded-lg transition-all ${tone === t.value
                                    ? 'bg-accent/10 border-accent text-accent'
                                    : 'bg-card border-border hover:border-accent/50'
                                }`}
                        >
                            <p className="text-sm font-medium">{t.label}</p>
                            <p className="text-xs text-muted-foreground">{t.description}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Generate Button */}
            <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-primary w-full flex items-center justify-center gap-2"
            >
                {isGenerating ? (
                    <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        Generate Messages
                    </>
                )}
            </button>

            {/* Suggestions */}
            {suggestions.length > 0 && (
                <div className="space-y-3 animate-fade-in">
                    <p className="text-xs font-medium text-muted-foreground">
                        Select a message to use:
                    </p>
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectSuggestion(suggestion)}
                            className="w-full p-4 text-left bg-card border border-border rounded-lg hover:border-accent/50 hover:bg-accent/5 transition-all group"
                        >
                            <div className="space-y-2">
                                <p className="text-sm text-foreground leading-relaxed">
                                    "{suggestion.message}"
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        CTA: <span className="text-accent">{suggestion.ctaText}</span>
                                    </p>
                                    <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                                        Click to use →
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
