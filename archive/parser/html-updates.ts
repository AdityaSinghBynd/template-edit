// ============================================
// HTML Update Functions
// ============================================
// 
// This module handles updating element content in HTML templates.
// Uses DOM manipulation for reliable updates while preserving structure.

import { escapeRegExp } from './utils';

/**
 * Update an element's field using DOM manipulation.
 * 
 * Key insight: DOMParser normalizes whitespace (e.g., '<p\n  style=' becomes '<p style='),
 * so we cannot rely on outerHTML matching. Instead, we find elements by ID and update
 * them directly in the DOM.
 * 
 * @param html - The full HTML document
 * @param elementId - The data-edit-id of the element to update
 * @param field - The field being updated (text, link1, src, alt, etc.)
 * @param newValue - The new value for the field
 * @param oldValue - The old value (used for text matching in complex cases)
 * @returns Object with new HTML and new outer HTML for tracking
 */
export function updateElementInHTML(
    html: string,
    elementId: string,
    field: string,
    newValue: string,
    oldValue: string
): { html: string; newOuterHTML: string } {

    if (oldValue === newValue) {
        return { html, newOuterHTML: '' };
    }

    // Parse current HTML structure
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find element by unique ID
    const element = doc.querySelector(`[data-edit-id="${elementId}"]`);

    if (!element) {
        console.warn(`[InvEditor] Update failed: Element with id ${elementId} not found`);
        return { html, newOuterHTML: '' };
    }

    // Apply update based on field type
    if (field === 'text') {
        updateTextContent(element, newValue, oldValue);
    } else if (field === 'linkUrl') {
        updateLinkUrl(element, newValue);
    } else if (field.startsWith('link') && /^link\d+$/.test(field)) {
        updateIndexedLink(element, field, newValue);
    } else if (field === 'src') {
        updateImageSrc(element, newValue);
    } else if (field === 'alt') {
        updateImageAlt(element, newValue);
    }

    return {
        html: '<!DOCTYPE html>\n' + doc.documentElement.outerHTML,
        newOuterHTML: element.outerHTML
    };
}

/**
 * Update text content while preserving links if present.
 */
function updateTextContent(element: Element, newValue: string, oldValue: string): void {
    const hasLinks = element.querySelector('a') !== null;

    if (!hasLinks) {
        // No links - safe to directly update text content
        if (element.textContent !== newValue) {
            element.textContent = newValue;
        }
    } else {
        // Has links - need to preserve link structure
        updateTextWithLinks(element, newValue, oldValue);
    }
}

/**
 * Update text in an element that contains links.
 * Preserves link elements while updating surrounding text.
 */
function updateTextWithLinks(element: Element, newValue: string, oldValue: string): void {
    // Collect all text nodes
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null
    );

    const textNodes: Text[] = [];
    let textNode: Text | null;
    while ((textNode = walker.nextNode() as Text)) {
        textNodes.push(textNode);
    }

    // Get link texts as markers
    const links = element.querySelectorAll('a');
    const linkTexts = Array.from(links).map(l => l.textContent?.trim() || '');

    // Check if all links are still present in new value
    const allLinksPresent = linkTexts.every(lt => lt.length > 0 && newValue.includes(lt));

    if (allLinksPresent && linkTexts.length > 0) {
        // Parse newValue into segments using link texts as delimiters
        updateTextNodesBySegments(textNodes, linkTexts, newValue);
    } else {
        // Fallback: try innerHTML replacement
        const currentHTML = element.innerHTML;
        const newInner = replaceTextInHTML(currentHTML, oldValue, newValue);

        if (newInner !== currentHTML) {
            element.innerHTML = newInner;
        } else {
            // Last resort: just set textContent (will lose link formatting)
            console.warn('[InvEditor] WARN: Text update may have removed links. Using textContent fallback.');
            element.textContent = newValue;
        }
    }
}

/**
 * Update text nodes segment by segment, preserving links.
 */
function updateTextNodesBySegments(textNodes: Text[], linkTexts: string[], newValue: string): void {
    let remaining = newValue;
    let segmentIndex = 0;

    for (let i = 0; i < linkTexts.length; i++) {
        const linkText = linkTexts[i];
        const idx = remaining.indexOf(linkText);

        if (idx >= 0) {
            const beforeText = remaining.substring(0, idx).trim();

            if (segmentIndex < textNodes.length) {
                const node = textNodes[segmentIndex];
                if (!node.parentElement?.closest('a')) {
                    const originalHasLeadingSpace = node.textContent?.startsWith(' ') || false;
                    const originalHasTrailingSpace = node.textContent?.endsWith(' ') || false;
                    node.textContent =
                        (originalHasLeadingSpace ? ' ' : '') +
                        beforeText +
                        (originalHasTrailingSpace || beforeText.length > 0 ? ' ' : '');
                }
                segmentIndex++;
            }

            segmentIndex++; // Skip link text node
            remaining = remaining.substring(idx + linkText.length);
        }
    }

    // Handle remaining text after last link
    const afterText = remaining.trim();
    for (let i = segmentIndex; i < textNodes.length; i++) {
        const node = textNodes[i];
        if (!node.parentElement?.closest('a')) {
            const originalHasLeadingSpace = node.textContent?.startsWith(' ') || false;
            node.textContent = (originalHasLeadingSpace ? ' ' : '') + afterText;
            break;
        }
    }
}

/**
 * Replace text content in HTML while preserving structure.
 */
function replaceTextInHTML(html: string, oldText: string, newText: string): string {
    // Try exact match first
    if (html.includes(oldText)) {
        return html.replace(oldText, newText);
    }

    // Try flexible whitespace matching
    const words = oldText.split(/\s+/).filter(w => w.length > 0);
    if (words.length === 0) return html;

    const flexPattern = words.map(word => escapeRegExp(word)).join('[\\s\\n\\r]+');
    const regex = new RegExp(flexPattern, 'gs');

    const match = html.match(regex);
    if (match && match[0]) {
        return html.replace(match[0], newText);
    }

    // Fallback for long texts
    if (words.length > 5) {
        const shortWords = words.slice(0, 6);
        const shortPattern = shortWords.map(word => escapeRegExp(word)).join('[\\s\\n\\r]+');
        const shortRegex = new RegExp(shortPattern + '[\\s\\S]*?' + escapeRegExp(words[words.length - 1]), 'g');

        const shortMatch = html.match(shortRegex);
        if (shortMatch && shortMatch[0]) {
            return html.replace(shortMatch[0], newText);
        }
    }

    return html;
}

/**
 * Update a single link's URL.
 */
function updateLinkUrl(element: Element, newValue: string): void {
    const link = element.tagName === 'A' ? element : element.querySelector('a');
    if (link) link.setAttribute('href', newValue);
}

/**
 * Update an indexed link's URL (link1, link2, etc.).
 */
function updateIndexedLink(element: Element, field: string, newValue: string): void {
    const linkIndex = parseInt(field.replace('link', '')) - 1;
    const links = element.querySelectorAll('a[href]');
    if (links[linkIndex]) {
        links[linkIndex].setAttribute('href', newValue);
    } else {
        console.warn(`[InvEditor] ${field} not found - only ${links.length} links`);
    }
}

/**
 * Update an image's src attribute.
 */
function updateImageSrc(element: Element, newValue: string): void {
    if (element.tagName === 'IMG') {
        element.setAttribute('src', newValue);
    } else {
        element.querySelector('img')?.setAttribute('src', newValue);
    }
}

/**
 * Update an image's alt attribute.
 */
function updateImageAlt(element: Element, newValue: string): void {
    if (element.tagName === 'IMG') {
        element.setAttribute('alt', newValue);
    } else {
        element.querySelector('img')?.setAttribute('alt', newValue);
    }
}
