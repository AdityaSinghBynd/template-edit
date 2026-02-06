// ============================================
// Locked Sections Detection
// ============================================
// 
// This module handles detection of "locked" sections in email templates.
// Locked sections are dynamic content areas (Companies, People, Topics, Headlines)
// that should not be editable by the user.

import type { LockedSection, LockedSectionType } from '../types';
import { LOCKED_PATTERNS, HEADER_SELECTORS } from './constants';
import { generateId, getElementPath } from './utils';

/**
 * Find all locked sections in the document.
 * Scans for headers matching LOCKED_PATTERNS and finds their content containers.
 * 
 * @param doc - The parsed HTML document
 * @param getPosition - Function to get element's position in document order
 * @returns Map of container elements to their LockedSection data
 */
export function findLockedSections(
    doc: Document,
    getPosition: (el: Element) => number
): Map<Element, LockedSection> {
    const lockedMap = new Map<Element, LockedSection>();
    const body = doc.body;

    const headers = doc.querySelectorAll(HEADER_SELECTORS);

    headers.forEach((header) => {
        const text = header.textContent?.trim() || '';
        if (text.length > 100) return;

        for (const [type, pattern] of Object.entries(LOCKED_PATTERNS)) {
            if (pattern.test(text)) {
                const container = findSectionContainer(header);

                if (container && !lockedMap.has(container)) {
                    const id = generateId();
                    const articleCount = countArticlesInSection(container);

                    // Mark the container with a data attribute for preview replacement
                    container.setAttribute('data-locked-section', JSON.stringify({
                        type,
                        headerText: text.substring(0, 50),
                        articleCount,
                    }));

                    lockedMap.set(container, {
                        id,
                        type: type as LockedSectionType,
                        headerText: text.substring(0, 50),
                        elementPath: getElementPath(container, body),
                        articleCount,
                        documentPosition: getPosition(container),
                    });
                }
                break;
            }
        }
    });

    return lockedMap;
}

/**
 * Find the content container for a section header.
 * Uses multiple strategies to locate the correct container:
 * 1. Next sibling TABLE after header
 * 2. Parent's next sibling TABLE
 * 3. Parent TABLE where header is at the start
 * 4. Parent row section
 * 
 * @param header - The header element that introduces the section
 * @returns The container element holding the section content, or null
 */
export function findSectionContainer(header: Element): Element | null {
    // STRATEGY 1: Find next sibling TABLE after header
    let sibling = header.nextElementSibling;
    while (sibling) {
        if (sibling.tagName === 'TABLE') {
            const tableLen = sibling.innerHTML.length;
            if (tableLen > 200 && tableLen < 30000) {
                return sibling;
            }
        }
        sibling = sibling.nextElementSibling;
    }

    // STRATEGY 2: Look in parent's next sibling
    const headerParent = header.parentElement;
    if (headerParent) {
        sibling = headerParent.nextElementSibling;
        while (sibling) {
            if (sibling.tagName === 'TABLE') {
                const tableLen = sibling.innerHTML.length;
                if (tableLen > 200 && tableLen < 30000) {
                    return sibling;
                }
            }
            if (sibling.children.length > 0 && sibling.children[0].tagName === 'TABLE') {
                const table = sibling.children[0];
                const tableLen = table.innerHTML.length;
                if (tableLen > 200 && tableLen < 30000) {
                    return table;
                }
            }
            sibling = sibling.nextElementSibling;
        }
    }

    // STRATEGY 3: Find parent TABLE where header is at the very start
    let current: Element | null = header;
    let bestContainer: Element | null = null;

    while (current) {
        const parent: Element | null = current.parentElement;
        if (!parent) break;

        if (parent.tagName === 'TABLE') {
            const tableHTML = parent.innerHTML;
            const headerHTML = header.outerHTML || header.textContent || '';
            const headerIndex = tableHTML.indexOf(headerHTML.substring(0, 50));

            if (tableHTML.length > 500 && tableHTML.length < 20000) {
                if (headerIndex !== -1 && headerIndex < 300) {
                    const hasEditableContent =
                        tableHTML.includes('Good Morning') ||
                        tableHTML.includes('Have a great day') ||
                        tableHTML.includes('Welcome to our');

                    if (!hasEditableContent) {
                        bestContainer = parent;
                    }
                }
            }
        }

        if (parent.tagName === 'TBODY' && current.tagName !== 'TR') {
            break;
        }

        current = parent;
    }

    if (bestContainer) return bestContainer;

    // STRATEGY 4: Fallback - find parent row section
    current = header;
    while (current) {
        if (current.tagName === 'TR') {
            return collectSectionFromRow(current as HTMLTableRowElement);
        }
        current = current.parentElement;
    }

    return header.parentElement;
}

/**
 * Collect the section container starting from a table row.
 * Walks up the tree to find the appropriate container.
 */
function collectSectionFromRow(headerRow: HTMLTableRowElement): Element {
    let parent = headerRow.parentElement;

    while (parent) {
        if (parent.tagName === 'TD') {
            if (parent.innerHTML.length > 200) return parent;
        }
        if (parent.tagName === 'TABLE') {
            if (parent.innerHTML.length < 50000) return parent;
        }
        parent = parent.parentElement;
    }

    return headerRow;
}

/**
 * Count the number of article links in a section.
 * Used to show "(X items)" in the locked section UI.
 */
function countArticlesInSection(container: Element): number {
    const links = container.querySelectorAll('a[href]');
    return Array.from(links).filter((link) => {
        const href = link.getAttribute('href') || '';
        return href.startsWith('http') && !href.includes('mailto:');
    }).length;
}
