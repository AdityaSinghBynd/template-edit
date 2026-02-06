// ============================================
// Main Parse Template Function
// ============================================
// 
// This is the main entry point for parsing HTML templates.
// It orchestrates all the parsing steps.

import type { ParsedTemplate } from '../types';
import { findLockedSections } from './locked-sections';
import { discoverEditableElements } from './discover-elements';
import { extractColors } from './colors';

/**
 * Options for parsing templates.
 */
export interface ParseOptions {
    /** When true, don't lock any sections - everything is editable */
    skipLocking?: boolean;
}

/**
 * Parse an HTML template into structured editable components.
 * 
 * This is the main entry point for template parsing. It:
 * 1. Finds locked sections (Companies, People, Topics, Headlines)
 * 2. Discovers editable elements (text, images, links)
 * 3. Extracts color palette
 * 4. Adds data-edit-id attributes for click-to-edit
 * 
 * @param html - The raw HTML string to parse
 * @param options - Parsing options
 * @returns ParsedTemplate with all discovered elements
 * 
 * @example
 * ```typescript
 * const result = parseTemplate(htmlString);
 * console.log(result.editableElements); // Array of editable text/images
 * console.log(result.lockedSections);   // Array of locked sections
 * console.log(result.colors);           // Array of colors used
 * ```
 */
export function parseTemplate(html: string, options: ParseOptions = {}): ParsedTemplate {
    const { skipLocking = false } = options;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const warnings: string[] = [];

    // Create document position map for ordering
    const elementIndexMap = new WeakMap<Element, number>();
    const allElements = doc.querySelectorAll('*');
    allElements.forEach((el, index) => elementIndexMap.set(el, index));

    const getPosition = (el: Element) => elementIndexMap.get(el) ?? 999999;

    // Step 1: Find locked sections
    let lockedMap: Map<Element, import('../types').LockedSection>;
    const lockedElements = new Set<Element>();

    if (skipLocking) {
        lockedMap = new Map();
        warnings.push('Locked sections unlocked - all content is editable');

        // Remove existing data-locked-section attributes
        doc.querySelectorAll('[data-locked-section]').forEach(el => {
            el.removeAttribute('data-locked-section');
        });
    } else {
        lockedMap = findLockedSections(doc, getPosition);
        lockedMap.forEach((_, container) => {
            lockedElements.add(container);
            container.querySelectorAll('*').forEach(child => lockedElements.add(child));
        });
    }

    // Step 2: Discover editable elements
    const editableElements = discoverEditableElements(doc, lockedElements, getPosition);

    // Step 3: Extract colors
    const colors = extractColors(doc);

    // Step 4: Generate HTML with data-edit-id attributes
    const htmlWithEditIds = '<!DOCTYPE html>\n' + doc.documentElement.outerHTML;

    // Warnings
    if (!skipLocking && lockedMap.size === 0) {
        warnings.push('No locked sections detected (Companies, People, Topics)');
    }

    return {
        rawHTML: htmlWithEditIds,
        htmlWithEditIds,
        lockedSections: Array.from(lockedMap.values()),
        editableElements,
        colors,
        parseWarnings: warnings,
    };
}
