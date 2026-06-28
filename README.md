# TrueTone AI
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-green?style=flat&logo=node.js)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-2.5-blue?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)

## About

**TrueTone AI** is a state-of-the-art web application that lets users upload a photo of their room and instantly preview hyper-realistic wall paint color options using Google's generative AI. 

Choosing paint colors is hard. TrueTone AI removes the guesswork by showing you exactly how different colors will look in your actual room—preserving natural lighting, shadows, architectural details, and furniture without requiring any manual masking.

## Features

- **Upload Photos** – Support for high-res JPEG and PNG formats.
- **Zero-Mask AI Wall Detection** – Powered entirely by `gemini-2.5-flash-image`, the system intelligently repaints only wall surfaces while keeping decor intact.
- **Advanced Render Tuners** – Customize the generated output with specific **Paint Finishes** (e.g., Matte, Eggshell, High-Gloss) and **Lighting Environments** (e.g., Soft Overcast, Studio Strobe).
- **Curated Color Libraries** – Select from curated combinations (Indian Contemporary, Western Minimal) or pick individual swatches dynamically matched to real-world paint brands like Sherwin-Williams and Benjamin Moore.
- **Tenant-Isolated Workspaces** – Manage multiple rooms in a dedicated, secure dashboard workspace.
- **Credit Wallet System** – Integrated virtual wallet to simulate SaaS billing (Stripe mockups included).

## Tech Stack

| Component | Technology | Badge |
|-----------|------------|-------|
| Frontend Framework | React 19 + Vite (SPA) | ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react) |
| State Management | Zustand | ![Zustand](https://img.shields.io/badge/Zustand-5.0-black?style=flat) |
| Styling & UI | Tailwind CSS v4 + Motion | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=flat&logo=tailwind-css) |
| Backend API | Node.js + Express | ![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=flat&logo=node.js) |
| Generative AI | Google Gemini API (`@google/genai`) | ![Gemini](https://img.shields.io/badge/Gemini-2.5_Flash-blue?style=flat) |
| Data Persistence | Local JSON (mocking SQL schema) | |

## Getting Started

### Prerequisites

- Node.js 20+
- A Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/truetone-ai.git
   cd truetone-ai
   ```

2. Install full-stack dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` and insert your `GEMINI_API_KEY` to enable actual image generation. If left empty or as a placeholder, the app will run in "Test Mode" returning beautiful mocked sample images.*

4. Start the development server (runs both Vite and Express concurrently):
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Core Flow

```
Landing → Login/Onboarding → Dashboard → New Project → Studio Editor → Render → Save
```

1. **Sign In** – Use the simulated Sandbox Bypass to jump right in.
2. **Onboard** – Complete your aesthetic profile to get a starting palette.
3. **Dashboard** – Create a new room project workspace.
4. **Studio Editor** – Upload your room photo, select a swatch or palette, and tune the finish/lighting.
5. **Render** – The Express server delegates the image to Gemini 2.5 Flash Image.
6. **Compare** – View the extracted brand-matched colors from Gemini 3.5 Flash alongside your room.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

## Authors

<div align="center">
  <a href="https://github.com/Yashraghuvans">
    <img src="https://github.com/Yashraghuvans.png" width="80" height="80" style="border-radius:50%;" alt="Yash Raghuvanshi"/>
  </a>
  <a href="https://github.com/khushiiesss">
    <img src="https://github.com/khushiiesss.png" width="80" height="80" style="border-radius:50%;" alt="Khushi"/>
  </a>
</div>
