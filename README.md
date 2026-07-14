# Deriv AI: Asset Insight Engine

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![AI Model](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)
![Hackathon](https://img.shields.io/badge/Submission-Deriv%20AI%20Sprint-orange)

> **Institutional-grade risk intelligence for the everyday trader.**

## About

**Deriv AI: Asset Insight Engine** is a focused intelligence tool designed to answer one simple question: *"How does the world look right now for [Insert Asset]?"*

Retail traders often stare at charts in isolation, missing the wider global context driving price action. This engine bridges that gap. By ingesting **real-time market news** via Google Search grounding and applying deep asset-class reasoning, it breaks down exactly how current global events are impacting specific assets (e.g., BTC, Gold, EUR/USD).

Instead of reckless "buy/sell" signals, it creates a high-level **Risk Profile**, helping traders understand the "Why" behind the market moves.

### Key Features

* **Real-Time Relevance:** Every analysis is grounded in live web search results, so the report reflects the market as it is right now — with the sources cited.
* **Laser Focus:** Analyzes specific tickers (e.g., `BTC`, `XAUUSD`, `SPX500`) across five market categories: Forex, Crypto, Commodities, Stocks & Indices, and Synthetic Indices.
* **Institutional Reasoning:** Detects complex correlations (e.g., how rising bond yields specifically impact Tech stocks vs. Forex).
* **Structured Output:** The model returns a typed JSON report (market regime, 0–100 risk score, key drivers, per-asset sentiment and selling pressure) enforced by a response schema.
* **Safe & Compliant:** Explicitly instructed to avoid "Financial Advice," focusing purely on risk exposure and educational insight.

---

## How It Works

1. **Select a market** — choose one of five asset categories.
2. **Build a watchlist** — add the specific symbols you care about.
3. **Live scan** — Gemini searches the web for current news, sentiment, and catalysts affecting those assets.
4. **Structured report** — you get:
   * **Market Regime** (Risk-On / Risk-Off / Range-Bound)
   * **Risk Score** (0–100 gauge)
   * **Key Drivers** — the specific headlines moving the needle
   * **Per-Asset Analysis** — sentiment and short-term selling pressure
   * **Strategy Note & Sources** — a defensive/opportunistic outline with cited links

---

## Getting Started

**Prerequisites:** Node.js 20+ and a [Gemini API key](https://aistudio.google.com/apikey).

```bash
git clone https://github.com/saifshbeita/Deriv-AI-Assistant.git
cd Deriv-AI-Assistant
npm install
cp .env.example .env   # then paste your GEMINI_API_KEY into .env
npm run dev            # http://localhost:3000
```

> **Note:** This is a client-side demo, so the API key is embedded in the browser bundle. Use a restricted key, and put the calls behind a small backend proxy before deploying publicly.

## Tech Stack

* **Frontend:** React 19 + TypeScript, built with Vite
* **AI Engine:** Google Gemini with Google Search grounding and structured JSON output (`@google/genai`)
* **Styling:** Tailwind CSS

## Disclaimer

*This tool is for educational and informational purposes only. It is **not** a financial advisor and does not provide financial advice. Trading financial assets involves high risk.*
