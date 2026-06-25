# 🎨 TrueTone AI

> See your walls before the painter does.

TrueTone AI is a mobile-first web app that helps people preview realistic wall colors on their own room photos in seconds. The MVP focuses on a single high-value journey: upload a room image, detect the walls, explore 3–5 strong paint palettes, compare Indian contemporary vs Western minimal preferences, and save or share the result. [file:1]

## Why this exists

Picking paint is surprisingly stressful. Swatches look different at home, family members imagine different outcomes, and most people cannot mentally visualize how a full wall will actually look once painted. TrueTone AI reduces that decision anxiety by showing fast, believable recolor previews on the user's real room instead of generic inspiration images. [file:1]

## MVP promise

The product is designed to validate one core assumption: users value seeing their own room in multiple color palettes before repainting. The MVP also aims to learn which style direction users prefer and whether the product is strong enough to justify broader renovation workflows later. [file:1]

## Core flow

```text
Landing → Upload Photo → AI Wall Detection → Mask Fix (Brush/Eraser)
→ Style Toggle → Palette Preview → Save/Share → Quick Feedback
```

This flow is intentionally linear, lightweight, and mobile-first, with minimal branching and no login requirement for the core experience. [file:1]

## Key experience

- **Upload a room photo** from the phone gallery using JPEG or PNG. [file:1]
- **Detect wall areas automatically** using backend segmentation. [file:1]
- **Refine the mask manually** with simple brush/eraser tools, plus zoom and pan. [file:1]
- **Switch style preference** between Indian contemporary and Western minimal. [file:1]
- **Try ranked palettes** from a small curated library with style tags and mood labels. [file:1]
- **Preview recolored walls fast** while preserving lighting and shadows, targeting a 2–3 second response time. [file:1]
- **Download or share** the best version, especially for family review or WhatsApp sharing. [file:1]
- **Capture lightweight feedback** through a 1–5 rating or a simple helpful/not-helpful prompt. [file:1]

## Who it is for

TrueTone AI is built for urban Indian homeowners and tenants, typically aged 25–40, who are planning to repaint one or two rooms within the next 6–12 months. The ideal user is not a design expert and wants fast, visual help rather than long design consultations or complex room planning tools. [file:1]

## Use cases

1. Preview living room wall colors before hiring a painter. [file:1]
2. Compare Indian-leaning and Western-leaning looks with family members. [file:1]
3. Save or share the favorite version directly from mobile. [file:1]

## Product goals

- Validate demand for room-specific paint recolor previews. [file:1]
- Measure which palettes and style directions people prefer. [file:1]
- Gather enough real usage to decide whether to expand into broader renovation visualization. [file:1]

## Success metrics

| Metric | What it measures |
|---|---|
| Activation | Percentage of visitors who upload at least one photo. [file:1] |
| Core action completion | Percentage of uploads that reach at least one recolor preview viewed. [file:1] |
| Engagement | Average number of palettes tried per uploaded photo. [file:1] |
| Satisfaction signal | A quick 1–5 rating or yes/no helpfulness response after preview. [file:1] |

## Functional scope

### Included in MVP

- Single-page landing with hero mock, one-line pitch, and strong CTA. [file:1]
- JPEG/PNG uploads with file size guardrails and EXIF auto-rotation. [file:1]
- Wall segmentation overlay with adjustment tools. [file:1]
- Style toggle that reorders palette recommendations on the same screen. [file:1]
- Palette ranking using room type and selected style. [file:1]
- Recoloring that changes only wall masks while preserving room lighting. [file:1]
- Save/download and mobile-friendly share behavior. [file:1]
- Basic event analytics across upload, adjustment, palette usage, save/share, and feedback. [file:1]

### Out of scope

- Multi-room or full-home workflows. [file:1]
- Full generative redesign with furniture, flooring, or ceilings. [file:1]
- Exterior visualizations and AR live camera preview. [file:1]
- Cost estimation, contractor marketplace, user accounts, or admin-heavy tooling. [file:1]

## UX principles

The UI should stay simple, mobile-first, and obvious to use. Controls should be clearly labeled, jargon should be minimized, onboarding should happen inline near the action, and the system should show visible progress while AI processing is running. [file:1]

## Technical direction

### Frontend
- Mobile-first web app, suitable for React or Next.js. [file:1]

### Backend
- Image upload endpoint that returns an image ID. [file:1]
- Segmentation service for wall detection. [file:1]
- Recoloring service that accepts image ID, mask, and color parameters, then returns a recolored output. [file:1]

### Data and analytics
- Palette definitions can live in config or a database. [file:1]
- Analytics events should be sent to an analytics platform for MVP learning. [file:1]

## Suggested analytics events

```ts
photo_uploaded
segmentation_adjusted
palette_applied
image_saved
image_shared
feedback_submitted
```

These events form the minimum learning loop for understanding activation, usage quality, and user satisfaction. [file:1]

## Future opportunities

If the MVP shows strong pull, the next layer can expand into multi-room projects, whole-home palette coordination, generative redesigns, paint brand integration, budget estimation, saved projects, and designer or contractor workflows. [file:1]

## Example repo structure

```bash
truetone-ai/
├── app/
├── components/
├── services/
├── lib/
├── public/
│   └── palettes/
├── analytics/
├── README.md
└── docs/
    └── mvp-notes.md
```

## Build philosophy

This is not a full interior design platform. It is a sharp, focused decision-support product: fast input, believable output, minimal friction, and enough instrumentation to learn what to build next. [file:1]

## Tagline ideas

- Paint confidence, powered by AI.
- Your room, recolored in seconds.
- Preview first. Paint smarter.
- From wall doubt to wall done.

## Status

**MVP definition complete** — ready for design, prototyping, and scoped implementation planning. [file:1]
