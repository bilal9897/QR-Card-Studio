import { cn } from '@/lib/utils';
import { 
  premiumTemplates, 
  luxuryTemplates,
  eliteTemplates, 
  type CardTemplate,
} from '@/lib/templates';
import { Sparkles, Check, Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TemplateSelectorProps {
  selectedId: string | null;
  onSelect: (template: CardTemplate) => void;
}

interface TemplateSectionProps {
  title: string;
  subtitle: string;
  templates: CardTemplate[];
  selectedId: string | null;
  onSelect: (template: CardTemplate) => void;
  badge?: 'free' | 'elite';
}

function FreeBadge() {
  return (
    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-success/40 text-success bg-success/10">
      <Check className="w-2.5 h-2.5 mr-0.5" />
      Free
    </Badge>
  );
}

function EliteBadge() {
  return (
    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-accent/40 text-accent bg-accent/10">
      <Crown className="w-2.5 h-2.5 mr-0.5" />
      Elite
    </Badge>
  );
}

function TemplateSection({ title, subtitle, templates, selectedId, onSelect, badge = 'free' }: TemplateSectionProps) {
  return (
    <div className={cn(
      "p-4 border",
      badge === 'elite' ? 'border-accent/30 bg-accent/5' : 'border-success/20'
    )}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium text-sm text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        {badge === 'elite' ? <EliteBadge /> : <FreeBadge />}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => onSelect(template)}
            className={cn(
              'template-card text-left focus-ring p-3',
              selectedId === template.id && 'active'
            )}
            aria-pressed={selectedId === template.id}
          >
            {/* Color indicator - shows gradient or accent, with RGB border for elite */}
            <div 
              className="w-full h-1.5 mb-2 rounded-full"
              style={{ 
                background: template.colors.borderGradient || template.colors.gradient || template.colors.accent,
                boxShadow: template.colors.borderGradient ? `0 0 6px ${template.colors.accent}40` : 'none'
              }}
              aria-hidden="true"
            />
            
            <p className="font-medium text-xs text-foreground truncate">
              {template.name}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              {template.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TemplateSelector({ selectedId, onSelect }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-accent" />
        <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Template Collections
        </label>
      </div>
      
      <div className="space-y-3">
        {/* Professional Collection */}
        <TemplateSection
          title="Professional Collection"
          subtitle="Business & social styles"
          templates={premiumTemplates}
          selectedId={selectedId}
          onSelect={onSelect}
        />

        {/* Luxury Collection */}
        <TemplateSection
          title="Luxury Collection"
          subtitle="Dark gradient designs"
          templates={luxuryTemplates}
          selectedId={selectedId}
          onSelect={onSelect}
        />

        {/* Elite Collection */}
        <TemplateSection
          title="Elite Collection"
          subtitle="RGB border premium"
          templates={eliteTemplates}
          selectedId={selectedId}
          onSelect={onSelect}
          badge="elite"
        />
      </div>
      
      <p className="text-xs text-success font-medium">
        ✓ All templates and exports are 100% free — HD PNG & Print-Ready PDF
      </p>
    </div>
  );
}
