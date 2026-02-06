// ============================================
// Color Extraction
// ============================================
// 
// This module handles extracting color information from HTML templates.
// Used for the Colors tab where users can modify color schemes.

import type { ExtractedColor } from '../types';

/**
 * Extract all colors used in the document.
 * Scans inline styles for hex colors and categorizes them by usage.
 * 
 * @param doc - The parsed HTML document
 * @returns Array of extracted colors with usage and count
 */
export function extractColors(doc: Document): ExtractedColor[] {
    const colorMap = new Map<string, { usage: Set<string>; count: number }>();

    doc.querySelectorAll('[style]').forEach((el) => {
        const style = el.getAttribute('style') || '';

        // Extract hex colors
        const hexMatches = style.match(/#[0-9a-fA-F]{3,6}/g) || [];
        hexMatches.forEach((hex) => {
            const normalized = hex.toLowerCase();
            const usage = style.includes('color') && !style.includes('background') ? 'text' :
                style.includes('background') ? 'background' :
                    style.includes('border') ? 'border' : 'other';

            if (!colorMap.has(normalized)) {
                colorMap.set(normalized, { usage: new Set(), count: 0 });
            }
            const entry = colorMap.get(normalized)!;
            entry.usage.add(usage);
            entry.count++;
        });
    });

    return Array.from(colorMap.entries()).map(([hex, data]) => ({
        hex,
        usage: Array.from(data.usage)[0] as 'text' | 'background' | 'border' | 'other',
        count: data.count,
    }));
}

/**
 * Replace all occurrences of a color in the HTML.
 * 
 * @param html - The HTML string to modify
 * @param oldColor - The color to replace (hex format)
 * @param newColor - The replacement color (hex format)
 * @returns Modified HTML with colors replaced
 */
export function replaceColorInHTML(html: string, oldColor: string, newColor: string): string {
    // Create case-insensitive pattern for hex color
    const pattern = new RegExp(oldColor.replace('#', '#?'), 'gi');
    return html.replace(pattern, newColor);
}
