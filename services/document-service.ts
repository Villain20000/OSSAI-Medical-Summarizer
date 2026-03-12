'use server';

import { PDFParse } from 'pdf-parse';

export async function extractTextFromDocument(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    // Size check (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File is too large. Maximum size is 5MB.');
    }

    let text = '';
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
      const result = await parser.getText();
      text = result.text;
    } else if (file.type === 'text/plain') {
      text = await file.text();
    } else {
      throw new Error('Unsupported file type. Please upload PDF or TXT.');
    }

    if (!text.trim()) {
      throw new Error('Could not extract text from the document. It might be empty or a scanned image.');
    }

    // Truncate text if it's extremely long to avoid token limits
    const maxLength = 100000;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + '\n...[TRUNCATED]';
    }

    return { success: true, text };
  } catch (error: any) {
    console.error('Extraction error:', error);
    return { success: false, error: error.message || 'Failed to process document' };
  }
}
