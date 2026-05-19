# Design System: CPU Scheduling Simulator
**Project:** OS Scheduler Website Redesign  
**Reference:** https://smartcpuscheduler.com/  
**Style Direction:** Technical, premium, dark-mode developer tool

## 1. Visual Theme & Atmosphere

The interface evokes the feeling of a **modern developer dashboard** or a **high-end technical IDE** — precise, trustworthy, and sophisticated. It avoids the cliché "purple gradient on white" AI aesthetic in favor of a deep, warm-black canvas with surgical teal accents.

- **Density**: Medium-high. Information is densely packed where it matters (tables, metrics) but each section is cleanly separated by borders and whitespace.
- **Depth**: Flat with subtle layering. No heavy shadows or glassmorphism. Depth is created through surface color variation (`#111118` vs `#1a1a24`) and thin borders (`#272735`).
- **Mood**: Technical, educational, premium. The user should feel like they are using a professional tool, not a toy.

## 2. Color Palette & Roles

| Descriptive Name | Hex Code | Functional Role |
|------------------|----------|-----------------|
| Deep Warm Black | `#0a0a0f` | Main page background. Warmth prevents the coldness of pure black. |
| Dark Navy Surface | `#111118` | Primary card/container background. Solid, not transparent. |
| Elevated Surface | `#1a1a24` | Inner containers, hover states, table headers, empty-state boxes. |
| Subtle Border | `#272735` | Default card borders, table row dividers, input underlines. |
| Focus Border | `#3f3f55` | Hover/focus state for cards, buttons, inputs. |
| Primary Ink | `#f0f0f5` | Headings, primary text, active tab text. Near-white with slight warmth. |
| Muted Ink | `#8a8a9a` | Descriptions, labels, secondary text, inactive tabs. |
| Electric Teal | `#5eead4` | **Primary action color**. Start buttons, active states, focus rings, links, best-metric highlights. |
| Soft Purple | `#a78bfa` | Secondary accent. "Add Process" button, hero gradient midpoint. |
| Warm Pink | `#f472b6` | Tertiary accent. Hero gradient end, rarely used alone. |
| Success Mint | `#4ade80` | Pros, positive indicators, checkmarks. |
| Soft Coral | `#fb7185` | Cons, errors, remove buttons, danger states. |
| Process Blue | `#60a5fa` | P1 color in Gantt/metrics. |
| Process Rose | `#fb7185` | P2 color. |
| Process Emerald | `#34d399` | P3 color. |
| Process Amber | `#fbbf24` | P4 color. |

### Gradient Rules
- **Hero Title Only**: `linear-gradient(90deg, #5eead4, #a78bfa, #f472b6)` — left to right.
- **NO other gradients** in the UI. Solid colors only for everything else.

## 3. Typography Rules

- **Hero Title**: `Space Grotesk` or `Outfit`, 48-56px, weight 700, gradient fill.
- **Section Headings**: `Inter` or `Geist`, 20-24px, weight 600, color `#f0f0f5`.
- **Body / Descriptions**: `Inter`, 14px, weight 400, color `#8a8a9a`, line-height 1.6.
- **Labels / Badges**: `Inter`, 11-12px, weight 500, uppercase, letter-spacing `0.1em`, color `#8a8a9a`.
- **Tab Labels**: `Inter`, 13-14px, weight 500-600.
- **Metrics / Numbers**: `JetBrains Mono` or `SF Mono`, 14-16px, weight 400-600, color `#f0f0f5`. Monospace for perfect alignment.
- **Button Text**: `Inter`, 14px, weight 600.

## 4. Component Stylings

### Cards (Primary Container)
- **Shape**: Generously rounded corners — `border-radius: 16px` (`rounded-2xl`).
- **Background**: Solid `Dark Navy Surface` (`#111118`).
- **Border**: 1px solid `Subtle Border` (`#272735`).
- **Padding**: 20px (`p-5`).
- **Shadow**: None. Border provides definition.
- **Hover**: Border transitions to `Focus Border` (`#3f3f55`) over 150ms.

### Buttons
- **Primary (Start, Add Process)**:
  - Shape: `rounded-lg` (8px)
  - Background: `Electric Teal` (`#5eead4`)
  - Text: `#0a0a0f` (dark on light)
  - Padding: `px-5 py-2.5`
  - Hover: Slight brightness increase or `#4dd4c0`
- **Secondary (Step, Reset, Compare)**:
  - Shape: `rounded-lg` (8px)
  - Background: `Elevated Surface` (`#1a1a24`)
  - Border: 1px solid `Subtle Border`
  - Text: `Primary Ink`
  - Hover: Border brightens to `Focus Border`
- **Ghost (Remove, Cancel)**:
  - No background
  - Text: `Muted Ink`
  - Hover: Text becomes `Soft Coral`

### Inputs (Inline Table Cells)
- **Shape**: No border-radius. Flat bottom border only.
- **Background**: Transparent.
- **Border**: 1px solid `Subtle Border` (bottom only).
- **Text**: `Primary Ink`, centered, 14px.
- **Focus**: Bottom border becomes `Electric Teal` (`#5eead4`).
- **No focus ring, no shadow, no rounded corners.**

### Tabs (Algorithm Selector)
- **Container**: Inline flex row, gap 8px.
- **Active Tab**:
  - Background: `rgba(94, 234, 212, 0.15)` (teal at 15% opacity)
  - Text: `Electric Teal`
  - Border: 1px solid `rgba(94, 234, 212, 0.3)`
  - Shape: `rounded-lg` (8px)
  - Padding: `px-4 py-2`
- **Inactive Tab**:
  - Background: Transparent
  - Text: `Muted Ink`
  - Border: None
  - Hover: Text becomes `Primary Ink`

### Toggle Switch
- **Track**: `rounded-full`, height 20px, width 36px.
- **Off**: Background `Subtle Border`.
- **On**: Background `Electric Teal`.
- **Thumb**: White circle, 16px diameter, slides with animation.

### Badges / Pills
- **Shape**: `rounded-full`
- **Background**: `Elevated Surface`
- **Border**: 1px solid `Subtle Border`
- **Text**: 11-12px, uppercase, wide tracking, `Muted Ink`
- **Example**: "OPERATING SYSTEMS SIMULATOR" hero badge with a small teal dot.

### Process Color Dots
- **Shape**: Circle, 8px diameter.
- **Usage**: Precede the PID in tables and Gantt blocks.
- **Colors**: Blue (`#60a5fa`), Rose (`#fb7185`), Emerald (`#34d399`), Amber (`#fbbf24`), etc.

## 5. Layout Principles

### Whitespace Strategy
- **Page Padding**: 48px horizontal on desktop, 24px on mobile.
- **Section Spacing**: 32px between major sections (Hero → Workspace → Comparison → Footer).
- **Card Gap**: 24px between adjacent cards.
- **Inner Padding**: 20px inside all cards.
- **No cramped elements.** Every card breathes.

### Grid & Alignment
- **Workspace**: Two-column grid.
  - Left: 45% (Process Table + Algorithm Card stacked)
  - Right: 55% (Gantt Chart + Performance Metrics stacked)
  - Gap: 24px
- **Max Width**: 1200px centered container.
- **Alignment**: Left-align all text within cards. Center only the hero and empty states.

### Responsive Behavior
- **Desktop (>1024px)**: Full two-column layout.
- **Tablet (768-1024px)**: Two columns with reduced padding. Process table inputs shrink.
- **Mobile (<768px)**: Single column stack. Process table becomes horizontally scrollable. Algorithm tabs may wrap or become a dropdown.

### Z-Index Scale
- 10: Hover/focus overlays
- 20: Dropdowns, tooltips
- 30: Modals, comparison panel
- 50: Toasts, notifications

## 6. Animation & Motion Guidelines

- **Duration**: 150-200ms for micro-interactions (hover, focus, tab switch).
- **Easing**: `ease-out` for entrances, `ease-in-out` for state changes.
- **Card Hover**: Border color transition only. No scale transforms.
- **Table Row Entrance**: Fade in + slight translateY (10px to 0), staggered 30ms per row.
- **Gantt Blocks**: Width expansion from 0 to full, 300ms, staggered 50ms per block.
- **Metrics Numbers**: Count-up animation when values change.
- **Tab Switch**: Cross-fade description content, 150ms.
- **Page Load**: Hero fades in first (0ms delay), workspace fades in second (150ms delay), footer last (300ms delay).
- **Respect `prefers-reduced-motion`**: Disable all motion for users who prefer reduced motion.

## 7. Iconography

- **Set**: Lucide React or Heroicons (24x24 viewBox, 1.5-2px stroke width).
- **Color**: `Muted Ink` by default. `Primary Ink` on hover. `Electric Teal` for active/primary actions.
- **Usage**:
  - Process Table: `Table` or `Grid3x3`
  - Algorithm: `Settings` or `Cpu`
  - Gantt Chart: `BarChart3`
  - Performance: `Activity` or `TrendingUp`
  - Start: `Play`
  - Step: `SkipForward`
  - Reset: `RotateCcw`
  - Pro: `CheckCircle` (green)
  - Con: `XCircle` (red)
  - Remove: `X`
  - Compare: `BarChart`

## 8. Anti-Patterns to Avoid

- ❌ Do NOT use `backdrop-filter: blur()` or glassmorphism.
- ❌ Do NOT use `border-radius` larger than 16px for cards (no `rounded-3xl`).
- ❌ Do NOT use emojis as icons.
- ❌ Do NOT use heavy box shadows.
- ❌ Do NOT use gradient backgrounds outside the hero title.
- ❌ Do NOT use purple as a primary UI color (reserve for accents/gradients only).
- ❌ Do NOT scale elements on hover (causes layout shift).
- ❌ Do NOT use pure black (`#000000`) — it is too harsh.

## 9. Key UX Decisions

1. **Inline Editing**: Process values are edited directly in the table. No separate form modal.
2. **Algorithm Context**: Every algorithm shows a description + pros/cons. Users learn by using.
3. **Explicit Controls**: Start / Step / Reset buttons are always visible in the Algorithm card.
4. **Empty States**: Gantt and Metrics show clear, helpful empty states with icons.
5. **Comparison CTA**: Prominent in hero and workspace for easy access.
6. **Best Algorithm Highlight**: In comparison view, the best row is highlighted in teal.
