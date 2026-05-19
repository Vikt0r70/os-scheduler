# Stitch Prompt: CPU Scheduling Simulator Redesign

> **How to use this prompt:**
> 1. Go to [Stitch](https://stitch.withgoogle.com/)
> 2. Create a new project
> 3. Paste this entire prompt into the text input
> 4. Stitch will generate the visual design
> 5. Once you like it, export the code and share it back

---

## Context

Design a **CPU Scheduling Simulator** web application. It is an interactive educational tool for computer science students to visualize CPU scheduling algorithms (FCFS, SJF, SRTF, Round Robin, Priority). The design should feel modern, premium, and technical — like a professional developer tool or a high-end dashboard.

## Overall Aesthetic

- **Theme**: Dark mode, deep navy-black background
- **Mood**: Technical, precise, premium, educational
- **Style**: Clean minimalism with subtle depth. NOT glassmorphism-heavy. Use solid surfaces with thin borders instead of blur effects.
- **Density**: Medium-high. This is a tool, not a marketing page. Information density is important but breathing room is respected.

## Color Palette

Use these exact colors:

- **Background**: `#0a0a0f` (deep warm black)
- **Surface (cards)**: `#111118` (dark navy-grey)
- **Surface Elevated**: `#1a1a24` (slightly lighter for hover/inner elements)
- **Border**: `#272735` (subtle purple-grey borders)
- **Border Focus/Hover**: `#3f3f55`
- **Primary Text**: `#f0f0f5` (almost white)
- **Secondary Text**: `#8a8a9a` (muted grey)
- **Accent Teal**: `#5eead4` (primary action color, cyan-teal)
- **Accent Purple**: `#a78bfa` (for gradients and highlights)
- **Accent Pink**: `#f472b6` (for gradients)
- **Success Green**: `#4ade80`
- **Danger Red**: `#fb7185`

**Hero Gradient**: The main title should use a linear gradient from `#5eead4` (teal) through `#a78bfa` (purple) to `#f472b6` (pink), left to right.

## Typography

- **Hero Title**: Large, bold sans-serif (like Space Grotesk or Geist), 48-56px, with the gradient above.
- **Section Headings**: 20-24px, semibold, white.
- **Body Text**: 14px, regular, secondary grey color.
- **Labels / Badges**: 11-12px, uppercase, wide tracking (0.1em), muted color.
- **Numbers / Metrics**: Monospace font (like JetBrains Mono), 14-16px, white.

## Page Structure

### 1. Hero Section (Top)

Centered, generous padding (80px top, 48px bottom).

- **Pill Badge** at top: "OPERATING SYSTEMS SIMULATOR" — small, uppercase, tracking wide, with a small teal dot before the text. Background: `surface-elevated`, border: `border`, rounded-full.
- **Title**: "CPU Scheduling Simulator" — massive, bold, with the teal-purple-pink gradient. Two lines if needed.
- **Subtitle**: "Interactive visualization of CPU scheduling algorithms — FCFS, SJF, Round Robin & Priority Scheduling" — 16px, secondary text, max-width ~600px, centered.
- **CTA Button**: "Compare All Algorithms" — secondary style, border button with a small chart icon left of text. Centered below subtitle.

### 2. Workspace Section (Main Content)

Two-column layout, gap 24px, max-width 1200px, centered.

**Left Column (~45% width):**

Stacked vertically:

#### A. Process Table Card
- **Header**: Row with icon (grid/table icon) + "Process Table" title left, and a "+ Add Process" button right.
- **Button Style**: `bg-accent-purple text-white rounded-lg px-3 py-1.5 text-sm font-medium`
- **Table**: Clean table with columns: Color Dot, PID, Arrival, Burst, Priority, Remove (✕).
- **Rows**: Each process is a row. Values are inline-editable with small, minimal inputs.
  - Inputs: `bg-transparent border-b border-border focus:border-accent-teal text-primary text-sm text-center`
  - Color dot: 8px circle, left of PID, unique color per process (e.g., P1=blue `#60a5fa`, P2=rose `#fb7185`, P3=emerald `#34d399`, P4=amber `#fbbf24`)
  - PID: Bold monospace, e.g., "P1"
  - Remove: Small ✕ button, muted, hover turns danger red.
- **Footer**: "4 processes configured" left, small colored dots of active processes right.
- **Card Style**: `bg-surface rounded-2xl border border-border p-5`

#### B. Algorithm Card
- **Header**: Icon + "Algorithm" title.
- **Tabs**: Horizontal pill tabs: FCFS, SJF, RR, PRI (short labels). 
  - Active tab: `bg-accent-teal/15 text-accent-teal border border-accent-teal/30 rounded-lg px-4 py-2 text-sm font-semibold`
  - Inactive tab: `bg-transparent text-secondary hover:text-primary text-sm`
- **Description Card** (below tabs, inside the same card):
  - **Title**: Full algorithm name, e.g., "First Come First Serve", 16px semibold white.
  - **Description**: 14px secondary text, e.g., "Processes execute in arrival order. Simplest algorithm — no preemption."
  - **Pros/Cons**: Two small items with icons:
    - Green checkmark + "Simple, fair, no starvation"
    - Red X + "Convoy effect — short jobs wait behind long ones"
  - Small text, 13px.
- **Controls Row** (below description):
  - Buttons: "Start Simulation" (primary teal), "Step" (secondary), "Reset" (secondary/ghost).
  - Primary: `bg-accent-teal text-slate-950 rounded-lg px-5 py-2.5 font-semibold`
  - Secondary: `bg-surface-elevated border border-border rounded-lg px-4 py-2.5 text-primary`
- **Toggle** (below controls): "Step-by-Step Mode" with a switch toggle. Label left, toggle right. Small text "Manual control for viva demo" below in muted text.

**Right Column (~55% width):**

Stacked vertically:

#### C. Gantt Chart Card
- **Header**: Icon + "Gantt Chart" title.
- **Empty State**: When no simulation has run, show:
  - Centered icon (bar chart icon in a subtle circle)
  - "No simulation data" — 16px, secondary text
  - "Click 'Start' to run the simulation" — 14px, muted text
- **Chart Area**: `bg-surface-elevated rounded-xl border border-border p-4` (inner container)
  - Horizontal bars representing process execution blocks.
  - Each block: rounded-md, colored with the process color, with process label (e.g., "P1") and time range inside.
  - Idle blocks: dashed border, muted background, "Idle" label.
  - Time markers below the bars.
- **Card Style**: Same as others — `bg-surface rounded-2xl border border-border p-5`

#### D. Performance Metrics Card
- **Header**: Icon + "Performance Metrics" title.
- **Empty State**: Similar to Gantt — icon + "Awaiting simulation" + "Metrics populate automatically"
- **Table** (when data exists):
  - Columns: Process, Arrival, Burst, Priority, CT, TAT, WT
  - Header row: `bg-surface-elevated`, uppercase labels with wide tracking, 11px, muted color.
  - Data rows: alternating slightly different surface shades or uniform.
  - Last row: "Averages" — bold, with `bg-accent-teal/10` and `text-accent-teal`.
  - Numbers: monospace, right-aligned or centered.
- **Card Style**: `bg-surface rounded-2xl border border-border p-5`

### 3. Comparison Section (Optional / Expandable)

When user clicks "Compare All Algorithms":

- Modal or expanded section below workspace.
- **Title**: "Algorithm Comparison"
- **Table**:
  - Columns: Algorithm, Avg Waiting Time, Avg Turnaround Time, Efficiency Score
  - Highlight the best algorithm row with `bg-accent-teal/10` and a small "Best" badge.
  - Sort by efficiency or waiting time.

### 4. Footer

Minimal, centered.
- "Made for learning" or similar small text.
- GitHub link as a small icon button.
- Muted secondary text, 14px.
- Padding: 48px top, 32px bottom.

## Spacing & Layout Rules

- **Page padding**: 24px on mobile, 48px on desktop.
- **Card gap**: 24px between cards.
- **Inner card padding**: 20px (p-5).
- **Section gap**: 32px between major sections.
- **Border radius**: `rounded-2xl` (16px) for cards. `rounded-lg` (8px) for buttons, inputs, inner elements. `rounded-full` only for badges and pills. **NO `rounded-3xl` or `rounded-[2rem]`** — too much rounding looks unprofessional.
- **Shadows**: Minimal or none. Use borders to define separation. If shadow is needed, very subtle: `0 4px 24px rgba(0,0,0,0.2)`.

## Icons

Use a consistent icon set (like Lucide or Heroicons):
- Process Table: `table` or `grid`
- Algorithm: `settings` or `cpu`
- Gantt Chart: `bar-chart-2`
- Performance: `activity` or `trending-up`
- Start: `play`
- Step: `skip-forward`
- Reset: `rotate-ccw`
- Check (pro): `check-circle`
- X (con): `x-circle`
- Close/Remove: `x`
- Compare: `bar-chart`

## Interactions & States

- **Hover on cards**: Border color transitions to `border-focus` (`#3f3f55`). Smooth 150ms transition.
- **Active tab**: Clear background + text color change. No scale transforms.
- **Button hover**: Primary button darkens slightly. Secondary button border brightens.
- **Table row hover**: Subtle background change to `surface-elevated`.
- **Input focus**: Bottom border changes to `accent-teal`. No ring, no shadow.
- **Toggle switch**: Teal when on, grey when off. Smooth slide animation.

## What to Avoid

- ❌ Heavy glassmorphism / backdrop-blur
- ❌ Excessive border radius (`rounded-3xl`, pill-shaped cards)
- ❌ Purple gradient backgrounds or generic "AI" aesthetics
- ❌ Emojis as icons
- ❌ Box shadows everywhere
- ❌ Background images, patterns, or noise textures
- ❌ Cluttered layout — respect whitespace
- ❌ Multi-step form for process input

## Responsive Behavior

- **Desktop (>1024px)**: Two-column workspace as described.
- **Tablet (768-1024px)**: Two columns but narrower. Reduce padding.
- **Mobile (<768px)**: Single column stack. Process table horizontally scrollable. Algorithm tabs wrap or become a dropdown.

## Summary

Create a dark, premium, technical interface for a CPU scheduling simulator. The design should feel like a modern developer tool — clean, precise, and functional. The hero draws users in with a gradient title. The workspace is a clear two-column layout: process configuration and algorithm controls on the left, visualizations (Gantt + Metrics) on the right. Use solid surfaces with thin borders, not glass. Teal is the primary accent. Purple and pink are used only for the hero gradient and process differentiation. Every element should have a clear purpose.

---

**End of Prompt**
