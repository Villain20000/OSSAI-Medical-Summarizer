'use server';

import { PDFParse } from 'pdf-parse';

/**
 * Extracts text content from a document (PDF or TXT) provided via FormData.
 * This function runs on the server to handle file processing securely.
 * 
 * @param formData - The FormData object containing the file to process.
 * @returns A promise resolving to an object with success status and either extracted text or an error message.
 */
export async function extractTextFromDocument(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file) throw new Error('No file provided');

    // Maximum file size limit (5MB) to ensure efficient processing and prevent abuse.
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File is too large. Maximum size is 5MB.');
    }

    let text = '';
    // Handle PDF files using the PDFParse library.
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const parser = new PDFParse({ data: new Uint8Array(arrayBuffer) });
      const result = await parser.getText();
      text = result.text;
    } 
    // Handle plain text files directly.
    else if (file.type === 'text/plain') {
      text = await file.text();
    } 
    // Reject unsupported file types.
    else {
      throw new Error('Unsupported file type. Please upload PDF or TXT.');
    }

    // Ensure we actually got some text; empty documents or scanned images (without OCR) won't work.
    if (!text.trim()) {
      throw new Error('Could not extract text from the document. It might be empty or a scanned image.');
    }

    // Truncate text if it exceeds a safety threshold (100k characters) to avoid 
    // hitting Gemini API token limits or causing performance issues.
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
