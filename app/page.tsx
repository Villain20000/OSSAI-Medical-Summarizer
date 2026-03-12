'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileUpload } from '@/components/file-upload';
import { SummaryResult } from '@/components/summary-result';
import { Toast } from '@/components/ui/toast';
import { extractTextFromDocument } from '@/services/document-service';
import { Loader2, ArrowLeft, Activity, ShieldCheck, Zap, FileSearch, Copy, Check } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

/**
 * The core application states for the Dashboard:
 * - idle: Waiting for a file upload.
 * - processing: Extracting text and generating a summary via AI.
 * - result: Displaying the generated summary.
 */
type AppState = 'idle' | 'processing' | 'result';

/**
 * Main Dashboard component that handles document upload, text extraction,
 * and summary generation using Google Gemini AI.
 */
export default function Dashboard() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [summary, setSummary] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  /**
   * Orchestrates the document analysis process:
   * 1. Extracts raw text from the file (server-side).
   * 2. Sends the text to the Gemini API for structured summarization.
   * 
   * @param file - The user-selected document.
   */
  const handleFileSelect = async (file: File) => {
    setAppState('processing');
    setError('');
    
    // Prepare data for server-side text extraction.
    const formData = new FormData();
    formData.append('file', file);

    const extractResult = await extractTextFromDocument(formData);

    // Stop if extraction failed or returned no text.
    if (!extractResult.success || !extractResult.text) {
      setError(extractResult.error || 'Failed to extract text from document.');
      setAppState('idle');
      return;
    }

    try {
      // Initialize Gemini AI with client-side API key.
      const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });
      
      // Construct a structured prompt for the LLM to ensure consistent summary output.
      const prompt = `
Analyze the following document and provide a summary strictly in this Markdown format:

### TL;DR
[A single, concise sentence summarizing the core message]

### Key Takeaways
- [Point 1]
- [Point 2]
- [Point 3]
(Add more if necessary, but keep it concise)

### Action Items
- [Action 1]
- [Action 2]
(If there are no action items implied in the text, write "None applicable.")

Document Text:
"""
${extractResult.text}
"""
      `;

      // Use the gemini-3-flash-preview model for high speed and low latency.
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      // Update state if we got a valid response, otherwise handle as an error.
      if (response.text) {
        setSummary(response.text);
        setAppState('result');
      } else {
        throw new Error('No summary was generated.');
      }
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      setError(err.message || 'An error occurred while generating the summary.');
      setAppState('idle');
    }
  };

  /**
   * Resets the dashboard state to allow analyzing another document.
   */
  const handleReset = () => {
    setAppState('idle');
    setSummary('');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-[#0000FF]/20">
      {/* Pfizer Corporate Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0000FF] rounded-full flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Pfizer <span className="font-normal text-slate-400 mx-1">|</span> <span className="font-medium text-[#0000FF]">OSSAI Summarizer</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Secure & Confidential
            </div>
            <div className="text-sm font-medium text-[#0000FF] bg-[#0000FF]/10 px-3 py-1 rounded-full">
              Internal Tool
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 md:p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#0000FF]/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-3xl pointer-events-none" />

        <div className="w-full max-w-4xl flex flex-col gap-10 mt-4 md:mt-8 relative z-10">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center gap-4 mb-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0000FF]/10 text-[#0000FF] text-sm font-semibold mb-2">
              <Zap className="w-4 h-4" />
              Powered by Google Gemini
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Accelerate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0000FF] to-blue-400">Research Insights</span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Upload medical documents, clinical trial reports, or research papers to instantly extract key takeaways, action items, and a concise TL;DR.
            </p>
          </motion.div>

          {/* Main Content Area */}
          <div className="relative w-full min-h-[350px] flex flex-col">
            <AnimatePresence mode="wait">
              
              {appState === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col gap-8"
                >
                  <div className="bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60">
                    <FileUpload onFileSelect={handleFileSelect} onError={setError} />
                  </div>
                  
                  {/* Feature Highlights */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                        <FileSearch className="w-6 h-6 text-[#0000FF]" />
                      </div>
                      <h3 className="font-semibold text-slate-900">Deep Analysis</h3>
                      <p className="text-sm text-slate-500">Extracts core messages from complex clinical and research documents.</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900">Secure Processing</h3>
                      <p className="text-sm text-slate-500">Your documents are processed securely and never stored permanently.</p>
                    </div>
                    <div className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-slate-900">Instant Results</h3>
                      <p className="text-sm text-slate-500">Get actionable insights in seconds, saving hours of manual reading.</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {appState === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="w-full flex flex-col items-center justify-center py-32 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 relative overflow-hidden"
                >
                  {/* Animated background gradient for processing state */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0000FF]/5 to-transparent opacity-50" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="relative w-20 h-20 mb-8">
                      <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                      <div className="absolute inset-0 border-4 border-[#0000FF] rounded-full border-t-transparent animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-8 h-8 text-[#0000FF] animate-pulse" />
                      </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Document</h2>
                    <p className="text-slate-500 text-center max-w-sm">
                      Our AI is reading through your document to extract the most important insights and action items...
                    </p>
                  </div>
                </motion.div>
              )}

              {appState === 'result' && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between w-full">
                    <button
                      onClick={handleReset}
                      className="group flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:text-[#0000FF] hover:border-[#0000FF]/30 hover:bg-[#0000FF]/5 transition-all shadow-sm"
                    >
                      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                      Analyze Another Document
                    </button>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(summary);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-[#0000FF] border border-[#0000FF] rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-[#0000FF]/20"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy Summary'}
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                    <SummaryResult summary={summary} />
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>
      </main>

      <Toast 
        message={error} 
        isVisible={!!error} 
        onClose={() => setError('')} 
        type="error"
      />
    </div>
  );
}

