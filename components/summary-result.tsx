'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Download, Check, FileText } from 'lucide-react';

/**
 * Properties for the SummaryResult component.
 * 
 * @param summary - The Markdown-formatted summary text to display.
 */
interface SummaryResultProps {
  summary: string;
}

/**
 * Displays the AI-generated summary with Markdown rendering and 
 * provides utility actions like copy and export.
 */
export function SummaryResult({ summary }: SummaryResultProps) {
  const [copied, setCopied] = useState(false);

  /**
   * Copies the raw summary text to the user's clipboard.
   */
  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Exports the summary as a downloadable Markdown (.md) file.
   */
  const handleExport = () => {
    // Create a blob representing the summary content.
    const blob = new Blob([summary], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Programmatically create and trigger a download link.
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pfizer-document-summary.md';
    document.body.appendChild(a);
    a.click();
    
    // Clean up to prevent memory leaks.
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#0000FF]/10 flex items-center justify-center">
            <FileText className="w-4 h-4 text-[#0000FF]" />
          </div>
          <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Analysis Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-[#0000FF] hover:bg-[#0000FF]/5 rounded-lg transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-[#0000FF] hover:bg-[#0000FF]/5 rounded-lg transition-colors"
            title="Export as Markdown"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
      
      <div className="p-6 md:p-8 prose prose-slate max-w-none prose-headings:font-semibold prose-headings:text-slate-900 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900 prose-a:text-[#0000FF]">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>
    </div>
  );
}
