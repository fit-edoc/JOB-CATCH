# Frontend & Visual Implementation Standards

This document defines the default visual and frontend implementation standards for building **high-quality, modern, production-ready web interfaces and landing pages** in this project.

The design must feel intentional, polished, editorial, and product-focused rather than looking like a generic AI/SaaS template. These rules apply universally unless a specific project requirement overrides them.

---

## 1. Design Philosophy
Prioritize:
* Clarity, Hierarchy, Readability, Whitespace, Consistency, Accessibility, Responsive behavior, Visual restraint
* Real content, real icons, real brand assets, strong typography, intentional composition
* The interface should look **designed**, not assembled from random UI components. Avoid visual noise and unnecessary decoration.

### Hierarchy
```text
Primary message -> Supporting message -> Primary action -> Supporting content -> Detailed information
```
Users should immediately understand:
1. Where they are
2. What the product/service is
3. What they can do
4. Why it matters
5. What action they should take next

---

## 2. Typography
* **Font Family**: Use the current project fonts (`Bricolage Grotesque` / `sans` configured in `tailwind.config.js`).
* **Default body**: `font-weight: 400`, `letter-spacing: -0.02em`
* **Weights**:
  - `400` — body / default
  - `500` — emphasis / navigation / labels
  - `600` — important headings / buttons
* Avoid excessive bold text.
* Do not use `font-mono` unless displaying code, terminal outputs, technical IDs, or intentional monospace numeric tabular data. Never use monospace as a decorative design element.

---

## 3. Typography Scale
* **Display**: `56–80px` desktop | `40–56px` tablet | `36–44px` mobile
* **Section Headings**: `40–56px` desktop | `32–40px` tablet | `28–36px` mobile
* **Body**: `16–18px`, `line-height: 1.5–1.7`
* **Small text**: `12–14px`
* **Labels**: `11–13px`
* Prevent horizontal overflow using `max-width` and `text-wrap: balance` where appropriate.

---

## 4. Color System
* Use the current project color theme (`primary`, `dark`, `accent` as defined in `tailwind.config.js`).
* Restrained neutral palette. Use color intentionally to communicate importance, state, interaction, brand, and feedback—never merely to fill blank space.

---

## 5. Containers
* Central responsive container:
  ```css
  width: 100%;
  max-width: 1200px; /* or 1280px / 1400px for larger views */
  margin-inline: auto;
  padding-inline: 24px;
  ```
* Do not allow text-heavy sections to span the entire viewport.

---

## 6. Responsive Design & Layout Recomposition
* Every component must adapt across Mobile, Tablet, Laptop, Desktop, and Large Desktop.
* Recompose layouts rather than just shrinking:
  - Desktop: Multiple columns, product previews, split layouts, generous whitespace.
  - Mobile: Single column, wrapped content, full-width controls, simplified nav.
  - When two-column layouts run out of space, collapse cleanly to one column.

---

## 7. Overflow Prevention
* Overflow is a bug. Do not blindly patch layout bugs with `overflow: hidden`.
* Fix root causes with `max-width: 100%`, `width: 100%`, and `min-width: 0` on flex children.

---

## 8. Icons
* Use **Phosphor Icons** (`@phosphor-icons/react`) for interface icons.
* Preferred weights: `regular`, `light`.
* Sizes: `12–14px` (tiny metadata), `16px` (buttons/nav), `18–20px` (features), `24px+` (prominent UI).
* Never use emojis or raw Unicode symbols (`→`, `+`, `✓`, `×`, `★`) as UI icons.

---

## 9. Brand Logos
* Use real SVG/PNG logos with original aspect ratios and consistent visual weight.
* Never use fake text-only badges as logos. Use grayscale or reduced opacity for subdued treatments.

---

## 10. Badges
* Badges communicate metadata/status, not decorative pills.
* Use multi-color status badges with restrained styling:
  ```tsx
  className="inline-flex items-center rounded-[2px] bg-green-700/10 px-2 py-[2px] text-xs font-medium text-green-600"
  ```
* Avoid making every label an oversized rounded pill.

---

## 11. Buttons
* Obvious visual hierarchy:
  - **Primary CTA**: Strong background, high contrast, compact padding, 4–6px radius, clear label, optional Phosphor icon (`Get started →`).
  - **Secondary CTA**: Transparent or subtle surface, minimal border, or text-only.
* Do not give equal visual prominence to every button. Normally one Primary CTA and one Secondary CTA per section.

---

## 12. Border Radius
* Use radius intentionally:
  - `2px`: Badges / tiny controls
  - `4px`: Buttons / compact UI
  - `6px`: Cards / inputs
  - `8px`: Larger surfaces
  - `12px`: Selected prominent containers
* Avoid `rounded-full` / `rounded-[999px]` everywhere.

---

## 13. Cards & Shadows
* Avoid repeating identical cards across the entire page. Use whitespace, dividers, and typography instead.
* Default card: `bg-white`, subtle border (`#E5E5E5`), radius `6–8px`, zero or extremely subtle shadow.
* Shadows: Restrained, subtle elevation only (dropdowns, dialogs, floating UI). Avoid colored glow or heavy card shadows.

---

## 14. Spacing System
* Values: `4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 120px`.
* Compact spacing within components; generous spacing (`64–96px+`) between sections.

---

## 15. Editorial Rhythm & Structure
* Introduce asymmetry and visual rhythm (e.g., large heading with supporting visual, product preview with compact explanation).
* Avoid generic AI SaaS patterns (gradient hero -> 3 cards -> logo strip -> 3 feature cards -> big testimonial -> pricing -> huge CTA) unless that structure genuinely suits the content.
* Hero sections: Eyebrow badge, primary headline, supporting description, primary & secondary CTA, optional realistic product preview.

---

## 16. Forms, Tables & Inputs
* Inputs: Height `40–48px`, radius `4–8px`, visible focus state, explicit labels (not placeholder-only).
* Tables: Compact row height, subtle dividers, right-aligned numbers, horizontal scrolling or responsive stacking on mobile.

---

## 17. Motion & Hover States
* Duration: `150–250ms ease-out`.
* Use motion for hover, focus, menu open, modal transition, accordion, and tab switches.
* Support `@media (prefers-reduced-motion: reduce)`.
* Every interactive element must have purposeful default, hover, focus, and active states.

---

## 18. Accessibility & Semantic HTML
* Color contrast, keyboard navigation, visible focus rings, proper `<button>`, `<nav>`, `<header>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<form>`, `<label>` tags.
* Alt text on all images. Avoid `<div>` soup.
