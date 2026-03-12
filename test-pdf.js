/**
 * Standalone utility script to test the PDF parsing library (pdfjs-dist).
 */
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
console.log('pdfjsLib loaded', typeof pdfjsLib.getDocument);
