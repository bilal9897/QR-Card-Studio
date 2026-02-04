import { cn } from '@/lib/utils';
import {
  luxuryTemplates,
  eliteTemplates,
  premiumTemplates,
  communityTemplates,
  type CardTemplate,
} from '@/lib/templates';
import { Sparkles, Check, Crown, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

interface TemplateSelectorProps {
  selectedId: string | null;
  onSelect: (template: CardTemplate) => void;
}

interface TemplateGridProps {
  templates: CardTemplate[];
  selectedId: string | null;
  onSelect: (template: CardTemplate) => void;
  description?: string;
}

function TemplateGrid({ templates, selectedId, onSelect, description }: TemplateGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const LIMIT = 6;
  const hasMore = templates.length > LIMIT;
  const displayedTemplates = isExpanded ? templates : templates.slice(0, LIMIT);

  return (
    <div className="space-y-3">
      {description && (
        <p className="text-xs text-muted-foreground px-1">{description}</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {displayedTemplates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template)}
            className={cn(
              'group relative flex flex-col items-start p-3 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-all text-left focus-ring',
              selectedId === template.id && 'border-accent ring-1 ring-accent bg-accent/5'
            )}
            aria-pressed={selectedId === template.id}
          >
            {/* Color indicator */}
            <div
              className="w-full h-2 mb-3 rounded-full transition-transform group-hover:scale-[1.02]"
              style={{
                background: template.colors.borderGradient || template.colors.gradient || template.colors.accent,
                boxShadow: template.colors.borderGradient ? `0 0 8px ${template.colors.accent}40` : 'none'
              }}
              aria-hidden="true"
            />

            <div className="w-full">
              <p className="font-medium text-xs text-foreground truncate mb-0.5">
                {template.name}
              </p>
              <p className="text-[10px] text-muted-foreground truncate opacity-80">
                {template.description}
              </p>
            </div>

            {/* Selected Indicator */}
            {selectedId === template.id && (
              <div className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-1.5 mt-2 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors py-2 hover:bg-secondary/50 rounded-md"
        >
          {isExpanded ? (
            <>Show Less <ChevronUp className="w-3.5 h-3.5" /></>
          ) : (
            <>Show More <ChevronDown className="w-3.5 h-3.5" /></>
          )}
        </button>
      )}
    </div>
  );
}

export default function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <Sparkles className="w-4 h-4 text-accent" />
          Template Collections
        </label>

        <p className="text-[10px] text-muted-foreground hidden sm:block">
          Select a design to start
        </p>
      </div>

      <Tabs defaultValue="community" className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-muted/50 p-1">
          <TabsTrigger value="community" className="text-xs">Community</TabsTrigger>
          <TabsTrigger value="premium" className="text-xs">Premium</TabsTrigger>
          <TabsTrigger value="luxury" className="text-xs">Luxury</TabsTrigger>
          <TabsTrigger value="elite" className="text-xs">Elite</TabsTrigger>
        </TabsList>

        <div className="mt-4 bg-card/30 rounded-xl p-1">
          <TabsContent value="community" className="mt-0 outline-none">
            <TemplateGrid
              templates={communityTemplates}
              selectedId={selectedId}
              onSelect={onSelect}
              description="Community-contributed designs for various businesses."
            />
          </TabsContent>

          <TabsContent value="premium" className="mt-0 outline-none">
            <TemplateGrid
              templates={premiumTemplates}
              selectedId={selectedId}
              onSelect={onSelect}
              description="Professional styles suitable for corporate & business use."
            />
          </TabsContent>

          <TabsContent value="luxury" className="mt-0 outline-none">
            <TemplateGrid
              templates={luxuryTemplates}
              selectedId={selectedId}
              onSelect={onSelect}
              description="High-end, elegant designs with rich gradients."
            />
          </TabsContent>

          <TabsContent value="elite" className="mt-0 outline-none">
            <TemplateGrid
              templates={eliteTemplates}
              selectedId={selectedId}
              onSelect={onSelect}
              description="Exclusive designs with RGB border effects."
            />
          </TabsContent>
        </div>
      </Tabs>

      <div className="flex items-center gap-2 justify-center pt-2">
        <Badge variant="outline" className="text-[10px] h-5 border-success/30 text-success bg-success/5">
          <Check className="w-3 h-3 mr-1" /> All Free
        </Badge>
        <span className="text-[10px] text-muted-foreground">HD Export • Print Ready</span>
      </div>
    </div>
  );
}
