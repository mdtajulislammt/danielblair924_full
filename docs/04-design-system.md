# 04 — Design System & UI Specifications: FMC Platform

> **Owned and maintained by**: `jarvis` (UI/UX Specialist)  
> **Source Baseline**: Figma File (`danielblair924_FO41C03DAA584_$400_Techvee`) & Tailwind CSS v4 in `developement/danielblair924_dashboard_front-end/app/globals.css`  

---

## 1. Color Palette Tokens (Neon Dark Athletic Theme)

```css
:root {
  /* Brand Accents */
  --primaryColor: #a1f400;           /* Signature Lime Green Neon */
  --secondaryColor: #d6ae29;         /* Accent Amber Gold */
  
  /* Neutral Dark Surfaces */
  --blackColor: #070707;             /* Base Deep Black */
  --bgColor: #131b04;                /* Deep Olive Dark Background */
  --cardBg: #070a03;                 /* Card Surface */
  --subtleBg: #0d1402;               /* Elevated Card / Input Background */
  
  /* Borders & Dividers */
  --borderColor: #435916;            /* Primary Muted Border */
  --borderSubtle: #344217;           /* Divider / Inner Card Border */
  --borderHighlight: #84cc16;        /* Focused / Active Border */
  
  /* Text & Labels */
  --whiteColor: #ffffff;             /* Primary Headings & Active Text */
  --descriptionColor: #c9c8c8;       /* Body Text & Form Placeholders */
  --mutedText: #807c7c;              /* Tertiary Labels & Timestamps */
  
  /* Status & Accents */
  --ratingColor: #f59e0b;            /* Warning / Star Ratings */
  --redColor: #dc2626;               /* Error / Rejection */
  --greenColor: #16a34a;             /* Success / Active Status */
  --blueColor: #2563eb;              /* Info / Running Tag */
  
  /* Ambient Lighting Glows */
  --ambientGlow: radial-gradient(circle, #5b8915 0%, #34500c 45%, transparent 75%);
}
```

---

## 2. Typography Hierarchy (Font Family: `Figtree`)

All typography across both mobile and web surfaces strictly utilizes the **Figtree** font family:

| Level | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| **Display / Hero KM** | `48px - 84px` | Bold (700) | 1.1 | Lifetime KM Counter (`84 KM LIFETIME`) |
| **Heading 1 (H1)** | `28px (1.75rem)` | Bold (700) | 1.25 | Page Titles, Metric Card Values |
| **Heading 2 (H2)** | `24px (1.5rem)` | SemiBold (600) | 1.3 | Section Headers, Form Titles |
| **Heading 3 (H3)** | `18px - 20px` | SemiBold (600) | 1.4 | Modal Headers, Member Names, Card Titles |
| **Body Bold** | `16px (1rem)` | Bold (700) | 1.5 | Button Labels, Emphasized Metrics |
| **Body Regular** | `14px - 16px` | Regular (400) / Medium (500) | 1.5 | Form Inputs, Table Cells, Descriptions |
| **Caption / Helper** | `12px (0.75rem)` | Regular (400) | 1.4 | Timestamps, Secondary Labels, Status Pills |
| **Micro Labels** | `11px` | SemiBold (600) / UPPERCASE | 1.3 | Category Badges, Form Field Tags |

---

## 3. UI Component Primitives

- **Buttons**:
  - Primary: Background `--primaryColor` (`#a1f400`), text `#070707`, rounded-md or rounded-full, active scale transition (`active:scale-95`), hover opacity 90%.
  - Secondary / Outlined: Border `--borderColor` (`#344217`), background transparent or `#344217/30`, text `--descriptionColor`.
  - Destructive: Border `#dc2626`, background `#dc2626/15`, text `#dc2626`.
- **Inputs & Textareas**:
  - Background `#0D1402`, border `--borderColor`, text `#FFFFFF`, placeholder `--descriptionColor/70`, focus border `--primaryColor`.
- **Status Pills**:
  - Active: Background `rgba(161, 244, 0, 0.12)`, text `#a1f400`.
  - Inactive / Ended: Background `rgba(128, 124, 124, 0.12)`, text `#807c7c`.
  - Pending: Background `rgba(245, 158, 11, 0.15)`, text `#f59e0b`.
  - Approved: Background `rgba(22, 163, 74, 0.15)`, text `#16a34a`.
  - Rejected: Background `rgba(220, 38, 38, 0.15)`, text `#dc2626`.

---

## 4. Mandatory 6 UI States Matrix

Every component implemented by Friday or Jarvis must follow these 6 states:

| State | Visual Requirement | Implementation Rule |
|---|---|---|
| **1. Default/Success** | High contrast dark green/black card, neon accents | Container with ambient radial glow |
| **2. Loading Skeleton** | Shimmer animation mirroring content shape | `<Skeleton className="h-6 w-32 bg-[#344217]/40" />` |
| **3. Empty State** | Centered icon, headline, helpful description, CTA button | `<EmptyState icon={Trophy} message="No submissions pending" />` |
| **4. Error/Validation** | Inline red helper text and toasts for API errors | React Hook Form `<p className="text-red-500 text-xs">` |
| **5. Responsive** | Fluid adaptivity across mobile, tablet, and desktop | Tailwind `grid-cols-1 md:grid-cols-2 lg:grid-cols-12` |
| **6. Interactive/Focus** | Visible neon focus rings (`focus:border-[#84cc16]`), active scaling | Buttons and links must never be dead |
