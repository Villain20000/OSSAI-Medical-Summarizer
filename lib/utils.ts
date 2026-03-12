import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A utility function that merges Tailwind CSS classes using clsx and tailwind-merge.
 * This ensures that conflicting classes are handled correctly (e.g., 'p-4 p-2' becomes 'p-2').
 * 
 * @param inputs - A list of class names, objects, or arrays to be merged.
 * @returns The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
