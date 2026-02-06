// ============================================
// Element Discovery
// ============================================
// 
// This module discovers editable elements in HTML templates.
// It identifies text blocks, images, links, and categorizes them for editing.

import type { DiscoveredElement, EditableField } from '../types';
import { DATE_PATTERN, SECTION_HEADER_PATTERN } from './constants';
import {
    generateId,
    getElementPath,
    normalizeWhitespace,
    extractElementStyles,
    isInsideLockedSection
} from './utils';

/**
 * Discover all editable elements in the document.
 * 
 * Finds:
 * - Banner images (first large image)
 * - Text blocks
 * - Text with embedded links (mixed content)
 * - Email links (mailto:)
 * - Phone numbers
 * 
 * @param doc - The parsed HTML document
 * @param lockedElements - Set of elements that are locked (not editable)
 * @param getPosition - Function to get element's position in document order
 * @returns Array of discovered editable elements
 */
export function discoverEditableElements(
    doc: Document,
    lockedElements: Set<Element>,
    getPosition: (el: Element) => number
): DiscoveredElement[] {
    const elements: DiscoveredElement[] = [];
    const body = doc.body;
    const processedElements = new Set<Element>();
    const seenEditIds = new Set<string>();

    // Helper functions
    const getElementDepth = createDepthCalculator(body);
    const getContainerPath = createContainerPathFinder(body);
    const getContainerHTML = createContainerHTMLGetter(body);

    // 1. Find banner image
    const bannerImg = findBannerImage(doc, lockedElements);
    if (bannerImg) {
        const element = createBannerElement(
            bannerImg, body, seenEditIds, getPosition, getElementDepth, getContainerPath, getContainerHTML
        );
        elements.push(element);
        processedElements.add(bannerImg);
    }

    // 2. Find text blocks
    discoverTextBlocks(
        doc, body, lockedElements, processedElements, seenEditIds,
        elements, getPosition, getElementDepth, getContainerPath, getContainerHTML
    );

    // 3. Find mailto links
    discoverMailtoLinks(
        doc, body, lockedElements, processedElements, seenEditIds,
        elements, getPosition, getElementDepth, getContainerPath, getContainerHTML
    );

    // 4. Find phone numbers
    discoverPhoneNumbers(
        doc, body, lockedElements, processedElements, seenEditIds,
        elements, getPosition, getElementDepth, getContainerPath, getContainerHTML
    );

    // Sort by document position
    elements.sort((a, b) => a.documentPosition - b.documentPosition);

    return elements;
}

// ============================================
// Helper Factory Functions
// ============================================

function createDepthCalculator(body: HTMLElement) {
    return (el: Element): number => {
        let depth = 0;
        let current = el.parentElement;
        while (current && current !== body) {
            if (current.tagName === 'TABLE' ||
                (current.tagName === 'DIV' && current.children.length > 1) ||
                (current.tagName === 'TD' && current.children.length > 1)) {
                depth++;
            }
            current = current.parentElement;
        }
        return Math.min(depth, 4);
    };
}

function createContainerPathFinder(body: HTMLElement) {
    return (el: Element): string | undefined => {
        let current = el.parentElement;
        while (current && current !== body) {
            if (current.tagName === 'TABLE' ||
                (current.tagName === 'DIV' && current.className) ||
                (current.tagName === 'TD' && current.children.length > 2)) {
                return getElementPath(current, body);
            }
            current = current.parentElement;
        }
        return undefined;
    };
}

function createContainerHTMLGetter(body: HTMLElement) {
    return (el: Element): string | undefined => {
        let current = el.parentElement;
        while (current && current !== body) {
            if (current.tagName === 'TABLE' ||
                current.tagName === 'TR' ||
                (current.tagName === 'DIV' && current.className)) {
                return current.outerHTML;
            }
            current = current.parentElement;
        }
        return undefined;
    };
}

// ============================================
// Banner Image Discovery
// ============================================

function findBannerImage(doc: Document, lockedElements: Set<Element>): HTMLImageElement | null {
    const images = doc.querySelectorAll('img');

    for (const img of images) {
        if (isInsideLockedSection(img, lockedElements)) continue;

        const width = img.width || parseInt(img.getAttribute('width') || '0');
        const src = (img.src || img.getAttribute('src') || '').toLowerCase();

        if (width >= 400 || src.includes('banner') || src.includes('header')) {
            return img as HTMLImageElement;
        }
    }

    return null;
}

function createBannerElement(
    bannerImg: HTMLImageElement,
    body: HTMLElement,
    seenEditIds: Set<string>,
    getPosition: (el: Element) => number,
    getElementDepth: (el: Element) => number,
    getContainerPath: (el: Element) => string | undefined,
    getContainerHTML: (el: Element) => string | undefined
): DiscoveredElement {
    let id = bannerImg.getAttribute('data-edit-id');
    if (!id || seenEditIds.has(id)) {
        id = generateId();
        bannerImg.setAttribute('data-edit-id', id);
    }
    seenEditIds.add(id);

    return {
        id,
        type: 'banner',
        elementPath: getElementPath(bannerImg, body),
        originalHTML: bannerImg.outerHTML,
        originalOuterHTML: bannerImg.outerHTML,
        documentPosition: getPosition(bannerImg),
        depth: getElementDepth(bannerImg),
        parentPath: getContainerPath(bannerImg),
        containerHTML: getContainerHTML(bannerImg),
        editableFields: [
            { name: 'src', type: 'url', value: bannerImg.src || bannerImg.getAttribute('src') || '', label: 'Image URL' },
            { name: 'alt', type: 'text', value: bannerImg.alt || '', label: 'Alt Text' },
        ],
    };
}

// ============================================
// Text Block Discovery
// ============================================

function discoverTextBlocks(
    doc: Document,
    body: HTMLElement,
    lockedElements: Set<Element>,
    processedElements: Set<Element>,
    seenEditIds: Set<string>,
    elements: DiscoveredElement[],
    getPosition: (el: Element) => number,
    getElementDepth: (el: Element) => number,
    getContainerPath: (el: Element) => string | undefined,
    getContainerHTML: (el: Element) => string | undefined
): void {
    const textElements = doc.querySelectorAll('p, td, div, span');

    textElements.forEach((el) => {
        // Skip filters
        if (isInsideLockedSection(el, lockedElements)) return;
        if (processedElements.has(el)) return;
        if (el.children.length > 3) return;
        if (el.querySelector('table, div, p')) return;

        const rawText = el.textContent?.trim() || '';
        const text = normalizeWhitespace(rawText);
        if (text.length < 5) return;
        if (DATE_PATTERN.test(text)) return;
        if (SECTION_HEADER_PATTERN.test(text)) return;
        if (el.querySelector('img') && !el.textContent?.trim()) return;

        // Check if descendant already processed
        const descendants = el.querySelectorAll('*');
        for (const desc of descendants) {
            if (processedElements.has(desc)) return;
        }

        // Check for embedded links
        const links = el.querySelectorAll('a[href]');

        if (links.length > 0) {
            processMixedContentElement(
                el, body, links, seenEditIds, processedElements, elements,
                getPosition, getElementDepth, getContainerPath, getContainerHTML
            );
        } else {
            processSimpleTextElement(
                el, body, text, rawText, seenEditIds, processedElements, elements,
                getPosition, getElementDepth, getContainerPath, getContainerHTML
            );
        }
    });
}

function processMixedContentElement(
    el: Element,
    body: HTMLElement,
    links: NodeListOf<Element>,
    seenEditIds: Set<string>,
    processedElements: Set<Element>,
    elements: DiscoveredElement[],
    getPosition: (el: Element) => number,
    getElementDepth: (el: Element) => number,
    getContainerPath: (el: Element) => string | undefined,
    getContainerHTML: (el: Element) => string | undefined
): void {
    // Skip if should defer to child
    const childWithLink = Array.from(el.children).find(
        child => child.querySelector('a[href]') && child.textContent?.trim()
    );
    if (childWithLink && childWithLink.tagName !== 'A') return;

    const fullText = normalizeWhitespace(el.textContent || '');
    if (el.tagName === 'A') return;
    if (fullText.length < 10) return;

    const styles = extractElementStyles(el as HTMLElement);
    let id = el.getAttribute('data-edit-id');
    if (!id || seenEditIds.has(id)) {
        id = generateId();
        el.setAttribute('data-edit-id', id);
    }
    seenEditIds.add(id);

    const editableFields: EditableField[] = [
        {
            name: 'text',
            type: fullText.length > 150 ? 'textarea' : 'text',
            value: fullText,
            originalValue: el.textContent || '',
            label: 'Content'
        },
    ];

    // Add link fields
    Array.from(links).forEach((link, i) => {
        const href = link.getAttribute('href') || '';
        const linkDisplayText = link.textContent?.trim() || '';

        let linkLabel = `Link ${i + 1}`;
        if (href.startsWith('mailto:')) linkLabel = `Email ${i + 1}`;
        else if (href.startsWith('tel:')) linkLabel = `Phone ${i + 1}`;

        editableFields.push({
            name: `link${i + 1}`,
            type: 'url',
            value: href,
            label: `${linkLabel} (${linkDisplayText.substring(0, 20)}${linkDisplayText.length > 20 ? '...' : ''})`,
            linkText: linkDisplayText,
        });
    });

    elements.push({
        id,
        type: 'mixed-content',
        elementPath: getElementPath(el, body),
        originalHTML: el.innerHTML,
        originalOuterHTML: el.outerHTML,
        documentPosition: getPosition(el),
        depth: getElementDepth(el),
        parentPath: getContainerPath(el),
        containerHTML: getContainerHTML(el),
        styles,
        editableFields,
    });

    markAsProcessed(el, body, processedElements);
}

function processSimpleTextElement(
    el: Element,
    body: HTMLElement,
    text: string,
    rawText: string,
    seenEditIds: Set<string>,
    processedElements: Set<Element>,
    elements: DiscoveredElement[],
    getPosition: (el: Element) => number,
    getElementDepth: (el: Element) => number,
    getContainerPath: (el: Element) => string | undefined,
    getContainerHTML: (el: Element) => string | undefined
): void {
    const styles = extractElementStyles(el as HTMLElement);
    let id = el.getAttribute('data-edit-id');
    if (!id || seenEditIds.has(id)) {
        id = generateId();
        el.setAttribute('data-edit-id', id);
    }
    seenEditIds.add(id);

    elements.push({
        id,
        type: 'text',
        elementPath: getElementPath(el, body),
        originalHTML: el.innerHTML,
        originalOuterHTML: el.outerHTML,
        documentPosition: getPosition(el),
        depth: getElementDepth(el),
        parentPath: getContainerPath(el),
        containerHTML: getContainerHTML(el),
        styles,
        editableFields: [
            { name: 'text', type: text.length > 150 ? 'textarea' : 'text', value: text, originalValue: rawText, label: '' },
        ],
    });

    processedElements.add(el);
    el.querySelectorAll('*').forEach(child => processedElements.add(child));
}

function markAsProcessed(el: Element, body: HTMLElement, processedElements: Set<Element>): void {
    processedElements.add(el);
    el.querySelectorAll('*').forEach(child => processedElements.add(child));
    let parent = el.parentElement;
    while (parent && parent !== body) {
        processedElements.add(parent);
        parent = parent.parentElement;
    }
}

// ============================================
// Email Link Discovery
// ============================================

function discoverMailtoLinks(
    doc: Document,
    body: HTMLElement,
    lockedElements: Set<Element>,
    processedElements: Set<Element>,
    seenEditIds: Set<string>,
    elements: DiscoveredElement[],
    getPosition: (el: Element) => number,
    getElementDepth: (el: Element) => number,
    getContainerPath: (el: Element) => string | undefined,
    getContainerHTML: (el: Element) => string | undefined
): void {
    const mailtoLinks = doc.querySelectorAll('a[href^="mailto:"]');

    mailtoLinks.forEach((link) => {
        if (isInsideLockedSection(link, lockedElements)) return;
        if (processedElements.has(link)) return;

        const href = link.getAttribute('href') || '';
        const email = href.replace('mailto:', '').split('?')[0];
        const displayText = link.textContent?.trim() || email;

        if (email.length < 5) return;

        let id = link.getAttribute('data-edit-id');
        if (!id || seenEditIds.has(id)) {
            id = generateId();
            link.setAttribute('data-edit-id', id);
        }
        seenEditIds.add(id);

        elements.push({
            id,
            type: 'text',
            elementPath: getElementPath(link, body),
            originalHTML: link.innerHTML,
            originalOuterHTML: link.outerHTML,
            documentPosition: getPosition(link),
            depth: getElementDepth(link),
            parentPath: getContainerPath(link),
            containerHTML: getContainerHTML(link),
            editableFields: [
                { name: 'text', type: 'text', value: displayText, label: 'Email' },
            ],
        });
        processedElements.add(link);
    });
}

// ============================================
// Phone Number Discovery
// ============================================

function discoverPhoneNumbers(
    doc: Document,
    body: HTMLElement,
    lockedElements: Set<Element>,
    processedElements: Set<Element>,
    seenEditIds: Set<string>,
    elements: DiscoveredElement[],
    getPosition: (el: Element) => number,
    getElementDepth: (el: Element) => number,
    getContainerPath: (el: Element) => string | undefined,
    getContainerHTML: (el: Element) => string | undefined
): void {
    const phonePattern = /Tel[:\s]*(\+?\d[\d\s\(\)\-]+\d)/gi;
    const allElements = doc.querySelectorAll('td, p, div, span');

    allElements.forEach((el) => {
        if (isInsideLockedSection(el, lockedElements)) return;
        if (processedElements.has(el)) return;

        const text = el.textContent?.trim() || '';
        const phoneMatch = text.match(phonePattern);

        if (phoneMatch) {
            phoneMatch.forEach(match => {
                const phoneNumber = match.replace(/Tel[:\s]*/i, '').trim();
                if (phoneNumber.length < 8) return;

                // Check parent not processed
                let parent = el.parentElement;
                let skipDuplicate = false;
                while (parent && parent !== body) {
                    if (processedElements.has(parent)) {
                        skipDuplicate = true;
                        break;
                    }
                    parent = parent.parentElement;
                }
                if (skipDuplicate) return;

                let id = el.getAttribute('data-edit-id');
                if (!id || seenEditIds.has(id)) {
                    id = generateId();
                    el.setAttribute('data-edit-id', id);
                }
                seenEditIds.add(id);

                elements.push({
                    id,
                    type: 'text',
                    elementPath: getElementPath(el, body),
                    originalHTML: el.innerHTML,
                    originalOuterHTML: el.outerHTML,
                    documentPosition: getPosition(el),
                    depth: getElementDepth(el),
                    parentPath: getContainerPath(el),
                    containerHTML: getContainerHTML(el),
                    editableFields: [
                        { name: 'text', type: 'text', value: phoneNumber, originalValue: match, label: 'Phone' },
                    ],
                });
                processedElements.add(el);
            });
        }
    });
}
