# 📈 Deriv AI: Asset Insight Engine

![Python](https://img.shields.io/badge/Python-3.9%2B-blue)
![Streamlit](https://img.shields.io/badge/Streamlit-App-FF4B4B)
![AI Model](https://img.shields.io/badge/AI-Google%20Gemini-4285F4)
![Hackathon](https://img.shields.io/badge/Submission-Deriv%20AI%20Sprint-orange)

> **Institutional-grade risk intelligence for the everyday trader.**

## 📖 About

**Deriv AI: Asset Insight Engine** is a focused intelligence tool designed to answer one simple question: *"How does the world look right now for [Insert Asset]?"*

Retail traders often stare at charts in isolation, missing the wider global context driving price action. This engine bridges that gap. By ingesting **real-time market news** and applying deep asset-class reasoning, it breaks down exactly how current global events are impacting specific assets (e.g., BTC, Gold, EUR/USD).

Instead of reckless "buy/sell" signals, it creates a high-level **Risk Profile**, helping traders understand the "Why" behind the market moves.

### 🚀 Key Features

* **⚡ Real-Time Relevance:** The core logic is driven by live market narratives, ensuring analysis is relevant to the exact second.
* **🎯 Laser Focus:** Analyzes specific tickers (e.g., `BTC`, `XAU`, `NVDA`) rather than generic market commentary.
* **🧠 Institutional Reasoning:** Detects complex correlations (e.g., how rising bond yields specifically impact Tech stocks vs. Forex).
* **🛡️ Safe & Compliant:** Explicitly trained to avoid "Financial Advice," focusing purely on risk exposure and educational insight.

---

## ⚙️ How It Works

1.  **Input:** The user enters a specific asset symbol (e.g., `Bitcoin`).
2.  **Context:** The system processes real-time headlines (interest rates, geopolitics, earnings).
3.  **Synthesis:** The Generative AI (Gemini) maps the news events to the specific asset's risk profile.
4.  **Output:** A structured report delivering:
    * **Market Regime:** (Risk-On / Risk-Off)
    * **Key News Driver:** The specific headline moving the needle.
    * **Exposure:** Volatility warning level.

---

## 🛠️ Tech Stack

* **Frontend:** [Streamlit](https://streamlit.io/) (Python)
* **AI Engine:** Google Gemini (Generative AI)
* **Language:** Python 3.10+

---

## 💻 Getting Started

### Prerequisites

* Python installed on your machine.
* A Google AI Studio API Key.

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/yourusername/deriv-ai-insight-engine.git](https://github.com/yourusername/deriv-ai-insight-engine.git)
    cd deriv-ai-insight-engine
    ```

2.  **Install dependencies**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Set up your API Key**
    * Open `app.py` and paste your Google API key where indicated, or set it as an environment variable.

4.  **Run the App**
    ```bash
    streamlit run app.py
    ```

---

## 📸 Demo

*(Add a screenshot of your app interface here)*

---

## ⚠️ Disclaimer

*This tool is for educational and informational purposes only. It is **not** a financial advisor and does not provide financial advice. Trading financial assets involves high risk.*
View your app in AI Studio: https://ai.studio/apps/drive/1XQxZ1yqZo8_VIydgOLdFv035XwKsxm3Y

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
