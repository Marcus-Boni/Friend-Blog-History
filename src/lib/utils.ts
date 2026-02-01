import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Checks if an error is an AbortError (request cancellation).
 * This is useful for handling navigation cancellations and
 * avoiding treating them as real errors.
 */
export function isAbortError(error: unknown): boolean {
  if (!error) return false
  
  // Check for Error with AbortError characteristics
  if (error instanceof Error) {
    if (error.name === "AbortError") return true
    if (error.message.includes("aborted")) return true
    if (error.message.includes("signal")) return true
  }
  
  // Check for DOMException abort (browser environment)
  if (typeof DOMException !== "undefined" && error instanceof DOMException) {
    return error.name === "AbortError"
  }
  
  return false
}

/**
 * Creates a custom retry function for React Query that doesn't retry on AbortErrors.
 * @param maxRetries - Maximum number of retry attempts (default: 2)
 */
export function createQueryRetry(maxRetries = 2) {
  return function shouldRetry(failureCount: number, error: unknown): boolean {
    // Don't retry AbortErrors - they're intentional cancellations
    if (isAbortError(error)) return false
    // Retry up to maxRetries times for other errors
    return failureCount < maxRetries
  }
}
