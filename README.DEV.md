# QR Card Studio — Developer Documentation

## One-Line Pitch

A privacy-first, offline-capable React application for creating professional print-ready QR feedback cards with zero backend dependencies.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                      │
├─────────────────────────────────────────────────────────┤
│  React + TypeScript + Vite                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ │
│  │   Pages     │  │ Components  │  │   Libraries     │ │
│  │  Index.tsx  │  │ CardPreview │  │  qr-generator   │ │
│  │  Install    │  │ SizeSelector│  │  pdf-export     │ │
│  │  PrintPrev  │  │ Templates   │  │  card-sizes     │ │
│  └─────────────┘  └─────────────┘  └─────────────────┘ │
├─────────────────────────────────────────────────────────┤
│  Service Worker (PWA) — Offline Caching                 │
└─────────────────────────────────────────────────────────┘
              ↓ No Backend Required ↓
         All data stays in browser memory
```

**Key Decision**: Frontend-only architecture chosen for:
1. Zero hosting costs
2. Complete user privacy
3. Instant responsiveness
4. Offline functionality
5. No GDPR/compliance overhead

---

## Folder Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui primitives (Button, Dialog, etc.)
│   ├── CardPreview.tsx  # Main card rendering (CSS variable driven)
│   ├── SizeSelector.tsx # Preset + custom size controls
│   ├── CustomSizeInput.tsx # Advanced sizing with aspect lock
│   ├── ColorCustomizer.tsx # Theme/color picker
│   └── TemplateSelector.tsx # Template collections UI
│
├── lib/                  # Pure utility functions (no React)
│   ├── card-sizes.ts    # Size tokens, conversions, validation
│   ├── card-colors.ts   # Color presets and theme definitions
│   ├── templates.ts     # Template data structures
│   ├── qr-generator.ts  # QR code generation wrapper
│   ├── pdf-export.ts    # jsPDF integration with crop marks
│   └── validation.ts    # Input sanitization
│
├── pages/               # Route-level components
│   ├── Index.tsx        # Main editor (primary page)
│   ├── Install.tsx      # PWA installation guide
│   └── PrintPreview.tsx # Full-page print preview
│
├── hooks/               # Custom React hooks
│   └── use-toast.ts     # Toast notification state
│
└── assets/              # Static images (gallery photos)
```

**WHY this structure**:
- `lib/` contains pure functions — easy to test, no React dependencies
- `components/ui/` uses shadcn pattern — copy-paste customizable primitives
- Single `Index.tsx` page avoids over-engineering for a single-purpose app
- Feature co-location: related components stay together

---

## State Management

**Approach**: React useState + prop drilling (no external state library)

```tsx
// Index.tsx manages all card state
const [format, setFormat] = useState<CardFormat>('table-tent');
const [size, setSize] = useState<CardSize>('medium');
const [customSize, setCustomSize] = useState<CustomSize | undefined>();
const [cardColors, setCardColors] = useState<CardColors>(defaultColors);
```

**WHY no Redux/Zustand**:
- Single page app with one main view
- All state is UI state, not cached server data
- Prop drilling depth is manageable (max 2-3 levels)
- Simpler mental model for maintenance

**Performance optimization**: `useCallback` for functions passed as props, no unnecessary re-renders.

---

## Template & Color System

### CSS Variables (Design Tokens)

```css
/* index.css - Theme tokens */
:root {
  --card-preview-bg: #ffffff;
  --card-preview-text: #1a1a1a;
  --card-preview-accent: #c4a053;
}

[data-theme="midnight-gold"] {
  --card-preview-bg: linear-gradient(135deg, #1a1a2e, #16213e);
  --card-preview-text: #ffffff;
}
```

### Runtime Color Injection

```tsx
// CardPreview.tsx
const colorVars: CSSProperties = {
  '--card-preview-bg': colors.background,
  '--card-preview-text': colors.text,
  '--card-preview-accent': colors.accent,
};
```

**WHY this pattern**:
- CSS variables enable theming without component re-renders
- `data-theme` attribute allows template-specific overrides
- Runtime injection supports user color customization
- Works with both preset themes and custom colors

---

## Card Size & Print Accuracy

### Token-Based Sizing

```typescript
// card-sizes.ts
interface CardSizeTokens {
  cardWidth: number;      // Preview pixels
  cardHeight: number;     
  padding: number;        
  titleSize: number;      // Font sizes scale proportionally
  bodySize: number;
  qrSize: number;         // QR scales with card
  // ... more tokens
}
```

### Size Calculation Flow

```
User selects "Large" + "Square"
        ↓
getSizeTokens(format, size)
        ↓
Returns pre-calculated tokens:
  { cardWidth: 320, padding: 22, titleSize: 19, ... }
        ↓
Tokens injected as CSS variables
        ↓
CardPreview uses variables: style={{ fontSize: 'var(--card-title-size)' }}
```

**WHY token-based (not transform: scale)**:
- `scale()` causes blurry text at non-integer values
- Tokens ensure pixel-perfect rendering at each size
- Typography remains crisp and readable
- Print output matches preview exactly

### Print DPI Handling

```typescript
// 300 DPI assumed for print export
const printWidth = sizeInches * 300; // Export resolution
const previewWidth = sizeInches * 96; // Screen preview (96 DPI standard)
```

---

## Accessibility (WCAG AA)

| Feature | Implementation |
|---------|----------------|
| Focus management | `focus-ring` utility class on all interactive elements |
| Keyboard navigation | Tab order follows visual order; Escape closes modals |
| Screen reader labels | `aria-label` on icon buttons, `role="img"` on card preview |
| Color contrast | All text meets 4.5:1 ratio against backgrounds |
| Reduced motion | Respects `prefers-reduced-motion` media query |
| Live regions | `aria-live="polite"` on preview for updates |

**Keyboard shortcuts**:
- `1/2/3` — Switch sizes
- `S/T` — Switch formats
- `P` — Print preview
- `Ctrl+D` — Download

---

## Security & Privacy Model

| Threat | Mitigation |
|--------|------------|
| XSS via user input | `sanitizeText()` strips HTML; no `dangerouslySetInnerHTML` |
| Malicious URLs | URL validation before QR generation |
| Data leakage | Zero server calls; no analytics; self-hosted fonts |
| External dependencies | All fonts bundled locally in `/public/fonts/` |
| Logo/image theft | Images stored only in browser memory |
| GDPR compliance | No personal data collected = no compliance needed |

```typescript
// validation.ts
export function sanitizeText(input: string): string {
  return input
    .replace(/[<>]/g, '') // Strip HTML-like characters
    .trim()
    .slice(0, MAX_LENGTH);
}
```

---

## Performance Considerations

| Technique | Impact |
|-----------|--------|
| Code splitting | Route-based via React Router lazy loading |
| Image optimization | Logo/background as data URLs (no network) |
| QR debouncing | 500ms delay prevents generation spam |
| CSS containment | `overflow: hidden` on preview container |
| PWA caching | Service worker caches all assets |

**Bundle size awareness**:
- `html-to-image` only loaded when download initiated
- `jspdf` loaded on PDF export demand
- QR library is lightweight (~20KB gzipped)

---

## Common Interview Questions

### Q: Why no backend?
**A**: The core problem (card design + QR generation) is entirely solvable client-side. Adding a backend would introduce hosting costs, latency, privacy concerns, and infrastructure maintenance — all with zero user benefit.

### Q: How do you handle different print sizes?
**A**: Token-based sizing system. Each size preset (Small/Medium/Large) has pre-calculated tokens for all visual properties. Custom sizes interpolate between tokens based on dimension ratios, with min/max constraints to prevent unusable cards.

### Q: Why CSS variables instead of inline styles?
**A**: CSS variables enable theme changes without component re-renders. The same CardPreview component works for all 20+ templates by swapping variable values, not switching components.

### Q: How would you add cloud save functionality?
**A**: I would add optional Supabase integration with RLS policies. Cards stored as JSON in a user-owned table. Export/import as JSON for users who want local backup. Privacy-first default remains.

### Q: What's the hardest bug you fixed?
**A**: Card size overflow in preview container. Initial implementation used `transform: scale()` which caused content clipping. Solution was switching to token-based sizing where all internal elements (typography, padding, QR) scale proportionally without transforms.

---

## Future Improvements

| Priority | Feature | Complexity |
|----------|---------|------------|
| High | Batch export (multiple cards) | Medium |
| High | Template favorites/recents | Low |
| Medium | Dark/light QR code toggle | Low |
| Medium | Multi-language support (i18n) | Medium |
| Low | Cloud sync (optional) | High |
| Low | Team sharing | High |

---

## Key Learnings

1. **Token-based design scales better than CSS transforms** — Discovered this when scale() caused text blur and overflow issues.

2. **CSS variables are underrated for theming** — Runtime theme switching without React state changes.

3. **Privacy-first simplifies everything** — No auth, no database, no GDPR, no cookies banner = faster development.

4. **PWA capabilities are production-ready** — Offline mode works seamlessly with proper service worker setup.

5. **Keyboard shortcuts improve power user retention** — Small investment, significant UX improvement for repeat users.

---

## Running Tests

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build verification
npm run build
```

---

*This documentation is intended for technical interviews and developer onboarding.*
