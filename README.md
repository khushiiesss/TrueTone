# 🎨 TrueTone AI

> Visualize your room before you repaint it.

TrueTone AI is a website where users upload a room photo and instantly preview realistic wall color options. The MVP is built around one simple journey: upload, detect walls, apply palettes, compare styles, and save or share the best result. 

## What it does

- Upload a JPEG or PNG room photo. 
- Detect wall areas with AI segmentation. 
- Adjust masks with simple brush and eraser tools. 
- Toggle between **Indian contemporary** and **Western minimal** palette preferences.
- Preview 3–5 wall color options while preserving room lighting and shadows. 
- Save or share the final recolored image. 

## Core flow

```text
Landing → Upload → Wall Detection → Mask Fix → Style Toggle → Preview → Save/Share → Feedback
```

The product is intentionally linear, mobile-first, and lightweight, with no login required for the core experience. 

## MVP goals

- Validate whether users find value in seeing their own room in multiple color palettes. 
- Learn which style and palette directions users prefer. 
- Collect enough usage data to decide whether to expand into broader renovation features. 

## Success metrics

- Activation: visitors who upload at least one photo. 
- Core action completion: uploads that reach at least one preview. 
- Engagement: average number of palettes tried per upload. 
- Satisfaction: quick helpful/not-helpful or 1–5 feedback after preview. 

## Tech stack

<p align="left">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="56" height="56" />
  <img src="https://cdn.jsdelivr.net/npm/@thesvg/icons/icons/nextdotjs.svg" alt="Next.js" width="56" height="56" />
  <img src="https://cdn.jsdelivr.net/gh/glincker/thesvg@main/public/icons/nodedotjs/default.svg" alt="Node.js" width="56" height="56" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="TypeScript" width="56" height="56" />
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="Tailwind CSS" width="56" height="56" />
  <img src="https://cdn.jsdelivr.net/npm/@thesvg/icons/icons/python.svg" alt="Python" width="56" height="56" />
</p>

Suggested stack for this MVP:

- **Frontend:** React or Next.js for a mobile-first web experience. 
- **Backend:** Node.js based API for upload, segmentation, and recoloring orchestration. 
- **AI/Image processing:** Python services for wall detection and recoloring workflows. 
- **Styling:** Tailwind CSS for fast UI iteration.
- **Language:** TypeScript for safer frontend and backend development.

## Scope

### Included
- Single-page landing and upload flow. 
- Wall segmentation and manual mask correction. 
- Palette suggestion, preview, save/share, and basic analytics. 

### Not included
- Multi-room projects. 
- Full renovation redesigns. 
- AR preview, budgeting, contractor marketplace, and user accounts. 

## Sample structure

```bash
truetone-ai/
├── app/
├── components/
├── services/
├── lib/
├── public/
├── analytics/
└── README.md
```

## Status

**MVP spec ready** — prepared for design, prototype, and development planning. 
