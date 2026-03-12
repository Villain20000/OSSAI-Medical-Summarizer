import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Pfizer OSSAI Summarizer',
  description: 'AI-powered document summarization for Pfizer OSSAI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen selection:bg-[#0000FF]/20`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
