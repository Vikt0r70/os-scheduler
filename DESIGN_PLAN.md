# CPU Scheduling Simulator — Redesign Plan

## Current Problems

1. **Process Input UX is Clunky**: Form + card list is tedious. Users want inline table editing like a spreadsheet.
2. **Algorithm Tabs Feel Disconnected**: Algorithm selector is in the header, far from where the action happens.
3. **Visual Fatigue**: Every element is glassmorphic with heavy rounding (`rounded-3xl` everywhere). No visual hierarchy.
4. **No Hero Section**: Landing feels like a dashboard, not a tool. No context or wow factor.
5. **Missing Algorithm Context**: No descriptions, pros/cons, or explanations of what each algorithm does.
6. **Comparison Table is an Afterthought**: Buried at the bottom with no visual prominence.
7. **Controls are Implicit**: No explicit "Run" or "Simulate" action — results just appear.

## Design Goals

1. **Create a clear hero** with gradient typography and a concise value proposition.
2. **Move algorithm selection + controls to the center-top** of the workspace so they are always visible and accessible.
3. **Redesign Process Input as an inline-editable table** with color-coded process badges.
4. **Add algorithm info cards** that show description, pros, and cons when an algorithm is selected.
5. **Use a cleaner card style** — subtle borders instead of heavy glass, more whitespace, purposeful rounding.
6. **Elevate the comparison feature** with a prominent CTA in the hero and a dedicated comparison view.
7. **Improve the Gantt chart** with better colors, clearer time labels, and animation.

## Reference: smartcpuscheduler.com

Key elements to adapt:
- Hero with gradient title and subtitle
- Two-column workspace layout (left: process + algo, right: gantt + metrics)
- Inline process table with small inputs
- Algorithm selector as tabs with active highlight
- Algorithm description card below tabs
- Clean card styling with subtle borders
- Icon + label headers for each section

## Layout Structure (New)

```
┌─────────────────────────────────────────────────────────┐
│  HERO SECTION                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │  CPU Scheduling Simulator                       │    │
│  │  Interactive visualization of FCFS, SJF, ...    │    │
│  │              [Compare All Algorithms]            │    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  WORKSPACE (2-column)                                   │
│  ┌─────────────────────┐  ┌─────────────────────────┐   │
│  │  Process Table      │  │  Gantt Chart            │   │
│  │  [+ Add Process]    │  │                         │   │
│  │  ┌─────────────────┐│  │                         │   │
│  │  │ P1  0  5  2  ✕ ││  │                         │   │
│  │  │ P2  1  3  1  ✕ ││  └─────────────────────────┘   │
│  │  │ ...             ││  ┌─────────────────────────┐   │
│  │  └─────────────────┘│  │  Performance Metrics    │   │
│  │  4 processes        │  │                         │   │
│  └─────────────────────┘  └─────────────────────────┘   │
│  ┌─────────────────────┐                                │
│  │  Algorithm          │                                │
│  │  [FCFS][SJF][RR]... │                                │
│  │  ┌─────────────────┐│                                │
│  │  │ First Come...   ││                                │
│  │  │ Description...  ││                                │
│  │  │ ✓ Pro  ✗ Con    ││                                │
│  │  └─────────────────┘│                                │
│  │  [Start] [Step] [Reset]                              │
│  └─────────────────────┘                                │
├─────────────────────────────────────────────────────────┤
│  COMPARISON SECTION (expandable / modal)                │
│  ┌─────────────────────────────────────────────────┐    │
│  │  Algorithm | Avg WT | Avg TAT | Efficiency      │    │
│  └─────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────┤
│  FOOTER                                                 │
└─────────────────────────────────────────────────────────┘
```

## Color Palette

Keep the dark theme but refine it:

| Role | Color | Usage |
|------|-------|-------|
| Background | `#0a0a0f` | Main page background (slightly warmer than current `#020617`) |
| Surface | `#111118` | Card backgrounds (solid, not glass) |
| Surface Elevated | `#1a1a24` | Hover states, inner cards |
| Border | `#272735` | Card borders (visible but subtle) |
| Border Focus | `#3f3f55` | Hover/focus borders |
| Primary Text | `#f0f0f5` | Headings, important text |
| Secondary Text | `#8a8a9a` | Descriptions, labels |
| Accent Cyan | `#5eead4` | Primary accent (teal-cyan, more saturated) |
| Accent Purple | `#a78bfa` | Secondary accent (for gradients) |
| Accent Pink | `#f472b6` | Tertiary accent (for gradients) |
| Success | `#4ade80` | Pros, good metrics |
| Danger | `#fb7185` | Cons, errors |
| Process Colors | Distinct set | P1=blue, P2=rose, P3=emerald, P4=amber, etc. |

## Typography

- **Display / Hero**: `Space Grotesk` or `Outfit` — bold, geometric, modern
- **Headings**: `Inter` or `Geist` — clean, readable
- **Body / UI**: `Inter` or system sans — neutral, legible at small sizes
- **Monospace (numbers)**: `JetBrains Mono` or `SF Mono` — for time values, metrics

## Component Style Changes

### Cards
- **Before**: `glass-panel rounded-3xl p-6` with heavy blur and shadow
- **After**: `bg-surface rounded-2xl border border-border p-5` — solid, subtle, clean
- **Hover**: `border-border-focus` transition

### Buttons
- **Primary**: `bg-accent-cyan text-slate-950 rounded-lg font-semibold` (sharp, confident)
- **Secondary**: `bg-surface-elevated border border-border rounded-lg`
- **Ghost**: `text-secondary hover:text-primary`

### Inputs (Inline Table)
- Small, minimal inputs inside table cells
- `bg-transparent border-b border-border focus:border-accent-cyan`
- No heavy rounding on table inputs

### Algorithm Tabs
- Pill-style tabs with clear active state
- Active: `bg-accent-cyan/15 text-accent-cyan border-accent-cyan/30`
- Inactive: `bg-transparent text-secondary hover:text-primary`

### Process Badges
- Colored dots + process name
- Dot uses the process's assigned color

## Animation Plan

1. **Page Load**: Staggered fade-in of sections (hero first, then workspace, then footer)
2. **Process Add/Remove**: Smooth height animation on table rows
3. **Algorithm Switch**: Cross-fade of description card content
4. **Gantt Chart**: Bars animate in with width expansion + stagger
5. **Metrics Update**: Number count-up animation
6. **Comparison Highlight**: Row highlight pulse when best algorithm changes

## Key UX Improvements

1. **Inline Editing**: Click a cell to edit process values directly. No separate form.
2. **Explicit Simulation Controls**: Start / Pause / Step / Reset buttons always visible in the algorithm card.
3. **Algorithm Education**: Each algorithm shows a description, pros, and cons so users learn while using.
4. **Quick Actions**: "Compare All Algorithms" button in hero and workspace for instant comparison.
5. **Empty States**: Gantt and Metrics show helpful illustrations/text when no simulation has run.
6. **Responsive**: Stack workspace columns on mobile; horizontal scroll for process table.

## Files to Modify

| File | Changes |
|------|---------|
| `src/App.tsx` | Complete layout restructuring, hero addition, workspace grid |
| `src/components/ProcessInput.tsx` | Rewrite as inline-editable table |
| `src/components/GanttChart.tsx` | Style updates, animation polish |
| `src/components/MetricsTable.tsx` | Style updates, number formatting |
| `src/components/ComparisonTable.tsx` | Modal/expandable view, highlight best |
| `src/components/Footer.tsx` | Minimal style update |
| `src/styles/glass.css` | Deprecate or reduce glass effects |
| `tailwind.config.ts` | Update color tokens |
| `src/index.css` | Update background, font imports |
| `src/utils/colors.ts` | Ensure process colors match new palette |

## Success Criteria

- [ ] Hero section renders with gradient title and CTA
- [ ] Process input is an inline-editable table
- [ ] Algorithm selector is in the workspace with description card
- [ ] Simulation controls (Start/Step/Reset) are visible and functional
- [ ] Gantt chart uses new color scheme with smooth animations
- [ ] Metrics table shows data with monospace numbers
- [ ] Comparison view is accessible from hero and workspace
- [ ] All existing functionality preserved (algorithms, calculations, etc.)
- [ ] Responsive on mobile (stacked layout)
