import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Configure the Inter font with a CSS variable for global availability.
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

/**
 * Global metadata for the application.
 */
export const metadata: Metadata = {
  title: 'Pfizer OSSAI Summarizer',
  description: 'AI-powered document summarization for Pfizer OSSAI',
};

/**
 * The RootLayout component wraps all pages in the application.
 * It sets the HTML language, configures global fonts, and applies base styling.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen selection:bg-[#0000FF]/20`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
