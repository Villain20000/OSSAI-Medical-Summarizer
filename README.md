<div align="center">
<img width="1200" height="475" alt="OSSAI Medical Summarizer Banner" src="https://www.lmtglocal.com/wp-content/uploads/2025/01/Medical-Record-Summarization-and-Chronology-1.jpg" />
</div>

# OSSAI Medical Summarizer

An AI-powered document analysis tool designed to accelerate research insights. Upload medical documents, clinical trial reports, or research papers and instantly receive structured summaries including a TL;DR, key takeaways, and action items.

## 🚀 Key Features

- **Multi-format Support**: Process PDF and TXT documents up to 5MB.
- **AI-Powered Analysis**: Leverages Google Gemini Flash 2.0 for high-speed, accurate summarization.
- **Structured Output**: Get consistent Markdown-formatted results with:
  - **TL;DR**: A concise one-sentence core message.
  - **Key Takeaways**: Bulleted lists of the most important points.
  - **Action Items**: Explicit next steps derived from the text.
- **Modern UI/UX**: Built with React, Tailwind CSS, and Framer Motion for a fluid, responsive experience.
- **Secure Processing**: Documents are processed in-memory and never stored permanently.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **AI Engine**: [Google Gemini API](https://ai.google.dev/) (gemini-3-flash-preview)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Motion for React](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Document Parsing**: `pdf-parse`

## 🏁 Getting Started

### Prerequisites

- **Node.js**: v18.x or later
- **Gemini API Key**: Obtain one from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd OSSAI-Medical-Summarizer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory and add your API key:
   ```env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `app/`: Next.js App Router pages and global styles.
- `components/`: Reusable React components (File upload, Result display, Toasts).
- `hooks/`: Custom React hooks (Responsive design, etc.).
- `services/`: Server-side logic for document processing and text extraction.
- `lib/`: Utility functions and shared helpers.

## 🛡️ Security & Privacy

This application is designed as an internal research tool. Documents uploaded are processed server-side to extract text and then sent to the Google Gemini API for analysis. No document content is persisted in any database or storage system by this application.

---

Built with ❤️ for the OSSAI research community.
