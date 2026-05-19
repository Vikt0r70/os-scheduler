# Quick Reference: What's Changed & Why

## Before → After

| Element | Before (Current) | After (Redesign) | Why |
|---------|------------------|------------------|-----|
| **Hero** | None — jumps straight to header | Full hero with gradient title, subtitle, CTA | Sets context, looks professional, explains purpose immediately |
| **Process Input** | Form + card list | Inline-editable table | Much faster to add/edit processes. No modal/form switching. |
| **Algorithm Tabs** | In header, disconnected | In workspace with description card | Contextual — users see what the algorithm does right where they select it |
| **Controls** | Implicit (auto-calculates) | Explicit Start/Step/Reset buttons | Users feel in control. Important for educational "step-by-step" demos. |
| **Card Style** | Heavy glassmorphism, `rounded-3xl` | Solid surface, thin border, `rounded-2xl` | Cleaner, more readable, less visual noise. Modern dev-tool aesthetic. |
| **Gantt Chart** | Colored blocks with time labels | Same but with cleaner styling, better empty state | Easier to read, clearer when empty |
| **Metrics** | Table with averages | Same but monospace numbers, cleaner highlight | Numbers align perfectly, best metrics stand out |
| **Comparison** | Static table at bottom | Prominent CTA + modal/expandable view | Feature is now discoverable and feels like a tool, not an afterthought |
| **Colors** | Cyan-only accent | Teal primary + purple/pink gradient accents | More sophisticated palette, gradient adds visual interest to hero only |
| **Typography** | System sans everywhere | Space Grotesk (hero) + Inter + JetBrains Mono | Hierarchy through font choice. Mono for numbers = technical precision. |

## File Change Summary

### New Files
- `DESIGN_PLAN.md` — Full redesign plan with goals, layout, colors, animations
- `STITCH_PROMPT.md` — Prompt to generate the visual design in Stitch
- `DESIGN.md` — Design system source of truth for developers

### Files to Edit (Implementation Phase)
1. `src/App.tsx` — Layout overhaul
2. `src/components/ProcessInput.tsx` — Rewrite as table
3. `src/components/GanttChart.tsx` — Style update
4. `src/components/MetricsTable.tsx` — Style update
5. `src/components/ComparisonTable.tsx` — Modal + highlight
6. `src/components/Footer.tsx` — Minimal update
7. `tailwind.config.ts` — New color tokens
8. `src/index.css` — New background, fonts
9. `src/styles/glass.css` — Remove/reduce glass effects
10. `index.html` — Add Google Fonts (Space Grotesk, JetBrains Mono)

## Next Steps

1. **Review the Stitch prompt** (`STITCH_PROMPT.md`)
2. **Go to [stitch.withgoogle.com](https://stitch.withgoogle.com/)**
3. **Paste the prompt** and generate the design
4. **Iterate with Stitch** until you like the visual
5. **Share the result** or tell me to start implementing

When you're ready to implement, I will:
1. Update the Tailwind config and CSS
2. Restructure `App.tsx` with the new layout
3. Rewrite `ProcessInput` as an inline table
4. Update all components with new styles
5. Add the hero section and algorithm description cards
6. Ensure all existing functionality works
