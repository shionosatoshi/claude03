# DESIGN.md - Vercel Design System

This document describes the Vercel-inspired design system for the claudeapp project.

## Visual Theme & Atmosphere

**Clean, Minimal, Technical**

The design follows Vercel's signature aesthetic: stark black and white with precise typography and subtle blue accents. The interface prioritizes content over decoration, using whitespace and typographic hierarchy to create visual order.

**Design Philosophy:**
- Content-first: Remove unnecessary visual noise
- Precision: Crisp borders, consistent spacing, sharp edges
- Performance: Lightweight, fast-loading, minimal CSS
- Accessibility: High contrast, clear typography, keyboard-first

## Color Palette & Roles

### Primary Colors
```css
--vercel-black: #000000      /* Primary text, headings */
--vercel-white: #ffffff      /* Backgrounds, cards */
--vercel-blue: #0070f3       /* Primary actions, links, focus states */
--vercel-blue-hover: #0060df /* Hover state for blue elements */
```

### Gray Scale
```css
--vercel-gray: #797979           /* Secondary text, icons */
--vercel-gray-light: #eaeaea     /* Borders, dividers */
--vercel-gray-lighter: #fafafa   /* Subtle backgrounds */
```

### Semantic Colors
```css
--text-primary: var(--vercel-black)       /* Primary text */
--text-secondary: var(--vercel-gray)      /* Secondary text */
--text-tertiary: #999999                  /* Tertiary text */
--bg-primary: var(--vercel-white)         /* Primary background */
--bg-secondary: var(--vercel-gray-lighter) /* Secondary background */
--border-color: var(--vercel-gray-light)  /* Borders */
--accent-primary: var(--vercel-blue)      /* Primary actions */
--accent-hover: var(--vercel-blue-hover)  /* Hover states */
```

### App-Specific Accent Colors
Each app retains its unique accent color while using Vercel's base colors:

```css
/* App 01 - Calendar Diary */
--app01-accent: #667eea;
--app01-accent-dark: #764ba2;

/* App 02 - RPG ToDo */
--app02-accent: #8b5cf6;
--app02-accent-orange: #f59e0b;

/* App 03 - Memo Notes */
--app03-accent: #3b82f6;
--app03-accent-purple: #8b5cf6;

/* App 04 - Weather Forecast */
--app04-accent: #0ea5e9;
--app04-accent-dark: #0284c7;

/* App 05 - Split Calculator */
--app05-accent: #10b981;
--app05-accent-dark: #059669;

/* App 06 - Random Chatbot */
--app06-accent: #5a8dee;
--app06-accent-dark: #6b7fd4;
```

## Typography Rules

### Font Families
```css
--vercel-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
--vercel-font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Mono', 'Droid Sans Mono', 'Source Code Pro', monospace;
```

### Type Scale (4px base)
```css
--vercel-text-xs: 11px;    /* Small labels, captions */
--vercel-text-sm: 12px;    /* Secondary text, metadata */
--vercel-text-base: 14px;  /* Body text, default */
--vercel-text-md: 16px;    /* Large body, headings */
--vercel-text-lg: 18px;    /* Subheadings */
--vercel-text-xl: 20px;    /* Small headings */
--vercel-text-2xl: 24px;   /* Medium headings */
--vercel-text-3xl: 32px;   /* Large headings */
```

### Font Weights
```css
--vercel-font-normal: 400;   /* Body text */
--vercel-font-medium: 500;   /* Emphasized text, buttons */
--vercel-font-semibold: 600; /* Headings, important text */
```

### Line Heights
```css
--vercel-leading-tight: 1.25;  /* Headings */
--vercel-leading-normal: 1.5;  /* Body text */
--vercel-leading-relaxed: 1.75; /* Extended text */
```

### Typography Hierarchy

| Element | Size | Weight | Line Height | Use Case |
|---------|------|--------|-------------|----------|
| H1 | 32px | 600 | 1.25 | Page titles |
| H2 | 24px | 600 | 1.25 | Section headings |
| H3 | 20px | 600 | 1.25 | Subsection headings |
| H4 | 18px | 600 | 1.25 | Card titles |
| Body | 14px | 400 | 1.5 | Default text |
| Small | 12px | 400 | 1.5 | Metadata, captions |
| XSmall | 11px | 400 | 1.5 | Fine print |

## Component Stylings

### Buttons

**Primary Button:**
```css
.btn-primary {
    background: var(--vercel-blue);
    color: var(--vercel-white);
    border: 1px solid var(--vercel-blue);
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-primary:hover {
    background: var(--vercel-blue-hover);
    border-color: var(--vercel-blue-hover);
}
```

**Secondary Button:**
```css
.btn-secondary {
    background: var(--vercel-white);
    color: var(--vercel-black);
    border: 1px solid var(--vercel-gray-light);
    border-radius: 4px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-secondary:hover {
    background: var(--vercel-gray-lighter);
    border-color: var(--vercel-gray);
}
```

**Button States:**
- Default: Clean background with border
- Hover: Slight background change
- Active: Scale 0.98
- Disabled: Opacity 0.5, no pointer events
- Focus: Blue outline (2px)

### Cards

**Base Card:**
```css
.card {
    background: var(--vercel-white);
    border: 1px solid var(--vercel-gray-light);
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: box-shadow 0.2s ease;
}

.card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
}
```

**Card Variants:**
- Default: White background, light border
- Elevated: Enhanced shadow on hover
- Interactive: Pointer cursor, hover effect

### Form Elements

**Input Fields:**
```css
input, textarea, select {
    background: var(--vercel-white);
    color: var(--vercel-black);
    border: 1px solid var(--vercel-gray-light);
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    font-family: inherit;
    transition: all 0.2s ease;
}

input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: var(--vercel-blue);
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.1);
}

input:disabled, textarea:disabled {
    background: var(--vercel-gray-lighter);
    color: var(--vercel-gray);
    cursor: not-allowed;
}
```

**Labels:**
```css
label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: var(--vercel-black);
    margin-bottom: 8px;
}
```

### Navigation

**Nav Links:**
```css
.nav-link {
    color: var(--vercel-gray);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color 0.2s ease;
}

.nav-link:hover {
    color: var(--vercel-black);
}

.nav-link.active {
    color: var(--vercel-blue);
}
```

## Layout Principles

### Spacing Scale (4px base)
```css
--vercel-space-1: 4px;
--vercel-space-2: 8px;
--vercel-space-3: 12px;
--vercel-space-4: 16px;
--vercel-space-5: 20px;
--vercel-space-6: 24px;
--vercel-space-8: 32px;
--vercel-space-10: 40px;
--vercel-space-12: 48px;
```

### Container Widths
```css
--vercel-container-sm: 600px;   /* Small containers */
--vercel-container-md: 800px;   /* Medium containers */
--vercel-container-lg: 1000px;  /* Large containers */
```

### Grid System
- Base grid: 8px (2 space units)
- Column gap: 16px
- Row gap: 16px
- Maximum 12 columns

### Whitespace Philosophy
- Generous padding: 16-24px
- Consistent gaps: 8-16px
- Breathing room: 32-48px between sections
- Edge spacing: 20px on mobile, 40px on desktop

## Depth & Elevation

### Shadow System
```css
--vercel-shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);   /* Subtle elevation */
--vercel-shadow-md: 0 4px 8px rgba(0, 0, 0, 0.08);   /* Medium elevation */
--vercel-shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);   /* High elevation */
```

### Surface Hierarchy
| Level | Shadow | Use Case |
|-------|--------|----------|
| Base | None | Page background |
| 1 | sm | Cards, inputs |
| 2 | md | Dropdowns, popovers |
| 3 | lg | Modals, tooltips |

### Borders
- Default: 1px solid #eaeaea
- Focus: 1px solid #0070f3
- Error: 1px solid #dc2626

## Do's and Don'ts

### Do's
✅ Use high contrast for text (WCAG AA+)
✅ Maintain consistent spacing (4px grid)
✅ Use Vercel blue for primary actions
✅ Keep borders subtle (1px, light gray)
✅ Use crisp edges (4-8px border radius)
✅ Prioritize content over decoration
✅ Test keyboard navigation
✅ Ensure mobile responsiveness

### Don'ts
❌ Don't use heavy gradients (subtle only)
❌ Don't use large border radius (>8px for cards)
❌ Don't use thick borders (>1px)
❌ Don't use low contrast text (<4.5:1 ratio)
❌ Don't override fonts unnecessarily
❌ Don't use heavy shadows
❌ Don't break the 4px spacing grid
❌ Don't ignore accessibility

## Responsive Behavior

### Breakpoints
```css
--vercel-breakpoint-sm: 640px;   /* Mobile landscape */
--vercel-breakpoint-md: 768px;   /* Tablet */
--vercel-breakpoint-lg: 1024px;  /* Desktop */
--vercel-breakpoint-xl: 1280px;  /* Large desktop */
```

### Mobile-First Approach
- Default styles: Mobile (<640px)
- First breakpoint: Tablet (≥768px)
- Second breakpoint: Desktop (≥1024px)

### Touch Targets
- Minimum size: 44×44px
- Recommended: 48×48px
- Spacing: 8px between targets

### Responsive Typography
- Mobile: Base 14px
- Tablet: Base 15px
- Desktop: Base 16px

## Agent Prompt Guide

When working with this design system:

### Quick Color Reference
- Backgrounds: `var(--bg-primary)`, `var(--bg-secondary)`
- Text: `var(--text-primary)`, `var(--text-secondary)`
- Borders: `var(--border-color)`
- Primary actions: `var(--accent-primary)`
- Hover states: `var(--accent-hover)`

### Common Patterns
**Button:**
```css
padding: var(--vercel-space-2) var(--vercel-space-4);
border: var(--vercel-border-width) solid var(--border-color);
border-radius: var(--vercel-border-radius);
```

**Card:**
```css
background: var(--bg-primary);
border: var(--vercel-border-width) solid var(--border-color);
border-radius: var(--vercel-border-radius-lg);
box-shadow: var(--vercel-shadow-sm);
```

**Input:**
```css
padding: var(--vercel-space-2) var(--vercel-space-3);
border: var(--vercel-border-width) solid var(--border-color);
border-radius: var(--vercel-border-radius);
```

### App-Specific Implementation
When updating apps, maintain their unique character while applying Vercel's base:
- Use Vercel's structure (spacing, borders, shadows)
- Keep app accent colors for personality
- Preserve app-specific features (RPG UI, weather icons, etc.)
- Ensure accessibility standards are met

---

**Design System Version:** 1.0
**Last Updated:** 2026-04-06
**Inspired By:** Vercel Design System
