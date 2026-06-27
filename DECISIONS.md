# 🎨 TrueTone AI — Architectural & Design Decisions

Logged by Atlas (Lead AI Coding Agent) on June 26, 2026.

---

## 1. Split Canvas Layout (Auth Layout)
- **Problem**: Create a highly engaging, professional auth flow for `/login` and `/signup` without boring standard templates.
- **Solution**: Developed a responsive two-column grid. 
  - **Left Column**: Features a loop of photorealistic render slides (Living Room, Bedroom, Office) with color-morph wall effect overlay, rotating quotes showing customer testimonies, and dynamic color-swatch pulse indicator.
  - **Right Column**: Displays clean, high-contrast inputs, terracotta accent CTAs, and a secure social SSO button.

## 2. Onboarding Wizard Flow
- **Goal**: Hook the user on first session with interactive customization and instant bonus rewards.
- **Flow Details**:
  - **Step 1**: Multi-selection of target rooms with card lifts.
  - **Step 2**: Aesthetic pairing options: *Indian Contemporary* (warm terracotta, clay, spice accents) vs. *Western Minimal* (sage, alabaster, stone).
  - **Step 3**: Drag-and-drop live image uploader with Instant FileReader preview. Automatically sets up the user's initial project on the backend server.
  - **Step 4**: Visual countdown animations celebrating a signing bonus of **20 Free Credits**.
- **Wired Redirection**: New profile objects initialize with `onboardingCompleted: false` and auto-redirect to `#onboarding` until successfully completed.

## 3. High-Fidelity Router & Integrations
- **Routing**: Implemented a state-driven router inside `src/App.tsx` matching `window.location.hash` changes. This enables direct page URLs like `/#about`, `/#privacy`, and `/#login` to work out-of-the-box.
- **Server Sync**: Configured the Express backend (`server.ts`) to handle `/api/contact` email logs and `/api/profile` updates to store progress persistently.
