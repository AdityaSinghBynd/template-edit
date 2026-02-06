// ============================================
// Parser Utility Functions
// ============================================

import type { ExtractedStyles } from '../types';

/**
 * Generate a unique ID for elements.
 * Uses random alphanumeric string of 9 characters.
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2, 11);
}

/**
 * Build a CSS selector path from an element to its root.
 * Used for highlighting and element identification.
 * 
 * @param element - The element to build path for
 * @param root - The root element to stop at (usually document.body)
 * @returns A CSS selector path like "div:nth-child(1) > p:nth-child(2)"
 */
export function getElementPath(element: Element, root: Element): string {
    const path: string[] = [];
    let current: Element | null = element;

    while (current && current !== root) {
        let selector = current.tagName.toLowerCase();
        if (current.id) {
            selector += `#${current.id}`;
        } else {
            const siblings = current.parentElement?.children;
            if (siblings && siblings.length > 1) {
                const index = Array.from(siblings).indexOf(current);
                selector += `:nth-child(${index + 1})`;
            }
        }
        path.unshift(selector);
        current = current.parentElement;
    }

    return path.join(' > ');
}

/**
 * Normalize whitespace in text content.
 * Collapses multiple spaces, tabs, newlines into single spaces.
 * This matches how browsers render text in HTML.
 * 
 * @param text - Raw text with potential extra whitespace
 * @returns Normalized text with single spaces
 */
export function normalizeWhitespace(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
}

/**
 * Extract inline styles from an element for visual matching.
 * Parses font-size, font-weight, color, and background-color.
 * 
 * @param el - The HTML element to extract styles from
 * @returns Object with extracted style properties
 */
export function extractElementStyles(el: HTMLElement): ExtractedStyles {
    const style = el.getAttribute('style') || '';
    const styles: ExtractedStyles = {};

    // Parse inline styles
    const fontSizeMatch = style.match(/font-size:\s*(\d+(?:\.\d+)?(?:px|em|rem|pt)?)/i);
    if (fontSizeMatch) styles.fontSize = fontSizeMatch[1];

    const fontWeightMatch = style.match(/font-weight:\s*(\d+|bold|normal)/i);
    if (fontWeightMatch) styles.fontWeight = fontWeightMatch[1];

    const colorMatch = style.match(/(?:^|;)\s*color:\s*(#[0-9a-fA-F]{3,6}|rgb[a]?\([^)]+\))/i);
    if (colorMatch) styles.color = colorMatch[1];

    const bgMatch = style.match(/background(?:-color)?:\s*(#[0-9a-fA-F]{3,6}|rgb[a]?\([^)]+\))/i);
    if (bgMatch) styles.backgroundColor = bgMatch[1];

    return styles;
}

/**
 * Escape special regex characters in a string.
 * Used for safe string searching in HTML content.
 * 
 * @param string - String to escape
 * @returns Escaped string safe for use in RegExp
 */
export function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if an element is inside any of the locked elements.
 * Used to exclude locked content from editing.
 * 
 * @param element - Element to check
 * @param lockedElements - Set of locked container elements
 * @returns True if element is inside a locked section
 */
export function isInsideLockedSection(element: Element, lockedElements: Set<Element>): boolean {
    let current: Element | null = element;
    while (current) {
        if (lockedElements.has(current)) return true;
        current = current.parentElement;
    }
    return false;
}
