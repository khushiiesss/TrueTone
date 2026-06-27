# TrueTone AI
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-yellow?style=flat&logo=python)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js)](https://nodejs.org/)

## About

**TrueTone AI** is a web application that lets users upload a photo of their room and instantly preview realistic wall color options. The MVP is designed around one simple journey: upload, detect walls, apply palettes, compare styles, and save or share the best result.

Choosing paint colors is hard. TrueTone AI removes the guesswork by showing you exactly how different colors will look in your actual room—preserving lighting, shadows, and texture.

## Features

- Upload Photos – Support for JPEG and PNG formats
- AI Wall Detection – Automatic segmentation of wall areas
- Mask Correction – Refine detection with brush and eraser tools
- Style Toggle – Switch between Indian contemporary and Western minimal palettes
- Realistic Previews – 3 to 5 wall color options that preserve room lighting and shadows
- Save and Share – Export or share your favorite recolored images
- Basic Analytics – Track usage patterns without requiring login

## Tech Stack

| Component | Technology | Badge |
|-----------|------------|-------|
| Frontend Framework | React 18 with Next.js 14 (App Router) | ![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js) |
| Language | TypeScript | ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript) |
| Styling | Tailwind CSS | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat&logo=tailwind-css) |
| Backend API | Node.js | ![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=flat&logo=node.js) |
| AI / Image Processing | Python microservices | ![Python](https://img.shields.io/badge/Python-3.9+-yellow?style=flat&logo=python) |

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.9+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/truetone-ai.git
   cd truetone-ai
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up Python environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your settings
   ```

5. Start development servers:
   ```bash
   # Frontend (Next.js)
   npm run dev

   # Backend (Node.js)
   npm run server

   # AI Services (Python)
   python services/segmentation/server.py
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Core Flow

```
Landing → Upload Photo → AI Wall Detection → Mask Correction → Style Selection → Color Preview → Save/Share → Feedback
```

1. **Upload** – Select a photo of your room (JPEG or PNG)
2. **Review** – Wait for AI to detect walls (3–5 seconds)
3. **Refine** – Use brush/eraser to fix mask if needed
4. **Choose Style** – Toggle between Indian contemporary and Western minimal
5. **Preview** – See 3–5 color variations on your walls
6. **Save** – Download or share your favorite result

## Analytics

We track key metrics to understand user behavior:

- Activation Rate – Users who upload at least one photo
- Completion Rate – Uploads that reach at least one preview
- Engagement – Average palettes tried per upload
- Satisfaction – Feedback scores (1–5 or helpful/not-helpful)

All analytics are anonymous and aggregate. No personal data is collected.

## Development with VS Code

You’ll need the latest version of [VS Code](https://code.visualstudio.com) and the [Chrome Debugger Extension](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome).

Add the following block to your `launch.json` file inside the `.vscode` folder in your project root:

```json
{
  "version": "0.2.0",
  "configurations": [{
    "name": "Chrome",
    "type": "chrome",
    "request": "launch",
    "url": "http://localhost:3000",
    "webRoot": "${workspaceRoot}/src",
    "sourceMapPathOverrides": {
      "webpack:///src/*": "${webRoot}/*"
    }
  }]
}
```

> **Note:** The URL may differ if you’ve adjusted the `HOST` or `PORT` environment variables.

Start your app with `npm start` and begin debugging in VS Code by pressing `F5` or clicking the green debug icon. You can set breakpoints, edit code, and debug live—all from your editor.

If you encounter issues, refer to the [troubleshooting guide](https://github.com/Microsoft/vscode-chrome-debug/blob/master/README.md#troubleshooting).

## Supported Browsers

The project uses the latest version of React. For a list of supported browsers, refer to the [React documentation](https://react.dev/learn).

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
