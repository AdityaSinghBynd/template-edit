// ============================================
// Parser Constants and Patterns
// ============================================

import type { LockedSectionType } from '../types';

/**
 * Patterns to identify locked sections by their headers.
 * These sections contain dynamic content (Companies, People, Topics)
 * that should not be editable by the user.
 */
export const LOCKED_PATTERNS: Record<LockedSectionType, RegExp> = {
    companies: /\b(companies|company\s*mentioned?|company)\b/i,
    people: /\b(people|persons?|people\s*mentioned?)\b/i,
    topics: /\b(topics?|themes?)\b/i,
    headlines: /\b(today'?s?\s*)?headlines?|summary\b/i,
};

/**
 * Pattern to match date strings.
 * Used to SKIP dates during text discovery (not lock sections).
 * 
 * Matches formats like:
 * - "Wednesday, October 01, 2025"
 * - "Friday, 28 November 2025"  
 * - "28 November 2025"
 */
export const DATE_PATTERN = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)?,?\s*\d{1,2}[,\s]+(january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\b|\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday),?\s*(january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{1,2},?\s*\d{4}\b/i;

/**
 * Pattern to match section header text.
 * These are headers that introduce locked sections and should be skipped.
 */
export const SECTION_HEADER_PATTERN = /^(companies|people|topics?|headlines?|today'?s?\s*headlines?)$/i;

/**
 * CSS selectors for elements that might contain section headers.
 */
export const HEADER_SELECTORS = 'h1, h2, h3, h4, p, div, strong, b, td, span';

/**
 * Minimum text length for an element to be considered editable.
 * Prevents UI clutter from very short text fragments.
 */
export const MIN_TEXT_LENGTH = 3;

/**
 * Maximum text length before showing as textarea vs input.
 */
export const TEXTAREA_THRESHOLD = 80;
