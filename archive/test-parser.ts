/**
 * Debug script to test simplified parser with sample.html
 * Run with: npx tsx test-parser.ts
 */

import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

// Read the sample HTML
const sampleHtml = readFileSync('./src/sample.html', 'utf-8');

// Locked patterns - sections with news content (same as parser.ts)
const LOCKED_PATTERNS: Record<string, RegExp> = {
    companies: /\b(companies|company\s*mentioned?|company)\b/i,
    people: /\b(people|persons?|people\s*mentioned?)\b/i,
    topics: /\b(topics?|themes?)\b/i,
    headlines: /\b(today'?s?\s*)?headlines?|summary\b/i,
};

// Date pattern - skip during text discovery (not lock)
const DATE_PATTERN = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday),?\s*\d{1,2}\s*(january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\b/i;

const HEADER_SELECTORS = 'h1, h2, h3, h4, p, div, strong, b, td, span';

function findSectionContainer(header: Element): Element | null {
    let current: Element | null = header;
    let containerCandidate: Element | null = null;

    while (current) {
        const parent: Element | null = current.parentElement;
        if (!parent) break;

        if (parent.tagName === 'TD') {
            const tdLength = parent.innerHTML.length;
            if (tdLength > 500) {
                containerCandidate = parent;
                break;
            }
        }

        if (parent.tagName === 'TABLE') {
            const tableLength = parent.innerHTML.length;
            if (tableLength > 500 && tableLength < 50000) {
                containerCandidate = parent;
            }
        }

        current = parent;
    }

    return containerCandidate || header.parentElement;
}

function isInsideLockedSection(el: Element, lockedElements: Set<Element>): boolean {
    let current: Element | null = el;
    while (current) {
        if (lockedElements.has(current)) return true;
        current = current.parentElement;
    }
    return false;
}

// Run the analysis
console.log('============================================================');
console.log('SIMPLIFIED PARSER TEST - sample.html (DATE FIX)');
console.log('============================================================');

const dom = new JSDOM(sampleHtml);
const doc = dom.window.document;

// Find locked sections
const lockedSections: Array<{ type: string, text: string, size: number }> = [];
const lockedElements = new Set<Element>();

doc.querySelectorAll(HEADER_SELECTORS).forEach((header) => {
    const text = header.textContent?.trim() || '';
    if (text.length > 100) return;

    for (const [type, pattern] of Object.entries(LOCKED_PATTERNS)) {
        if (pattern.test(text)) {
            const container = findSectionContainer(header);
            if (container && !lockedElements.has(container)) {
                lockedSections.push({
                    type,
                    text: text.substring(0, 40),
                    size: container.innerHTML.length
                });
                lockedElements.add(container);
                container.querySelectorAll('*').forEach(child => lockedElements.add(child));
            }
            break;
        }
    }
});

console.log('\n🔒 LOCKED SECTIONS:');
lockedSections.forEach((s, i) => {
    console.log(`  ${i + 1}. [${s.type.toUpperCase()}] "${s.text}" (${s.size} chars)`);
});
console.log(`  Total locked elements: ${lockedElements.size}`);

// Find editable elements
const editableElements: Array<{ type: string, preview: string }> = [];
const processedElements = new Set<Element>();

// Find banner
const images = doc.querySelectorAll('img');
for (const img of images) {
    if (isInsideLockedSection(img, lockedElements)) continue;
    const width = parseInt(img.getAttribute('width') || '0');
    const src = (img.getAttribute('src') || '').toLowerCase();
    if (width >= 400 || src.includes('banner') || src.includes('header')) {
        editableElements.push({ type: 'BANNER', preview: src.substring(0, 50) + '...' });
        processedElements.add(img);
        break;
    }
}

// Find text blocks
doc.querySelectorAll('p, td, div, span').forEach((el) => {
    if (isInsideLockedSection(el, lockedElements)) return;
    if (processedElements.has(el)) return;
    if (el.children.length > 3) return;
    if (el.querySelector('table, div, p')) return;

    const text = el.textContent?.trim() || '';
    if (text.length < 5) return;

    // Skip date elements
    if (DATE_PATTERN.test(text)) return;

    if (el.querySelector('img') && !text) return;

    const link = el.querySelector('a[href]:not([href^="mailto:"])');

    if (link) {
        const href = link.getAttribute('href') || '';
        if (href && !href.startsWith('#')) {
            editableElements.push({
                type: 'TEXT+LINK',
                preview: text.substring(0, 40) + (text.length > 40 ? '...' : '')
            });
            processedElements.add(el);
            return;
        }
    }

    editableElements.push({
        type: 'TEXT',
        preview: text.substring(0, 40) + (text.length > 40 ? '...' : '')
    });
    processedElements.add(el);
});

console.log('\n📝 EDITABLE ELEMENTS:');
editableElements.slice(0, 25).forEach((e, i) => {
    console.log(`  ${i + 1}. [${e.type}] "${e.preview}"`);
});
if (editableElements.length > 25) {
    console.log(`  ... and ${editableElements.length - 25} more`);
}
console.log(`  Total editable: ${editableElements.length}`);

console.log('\n============================================================');
console.log('SUMMARY');
console.log('============================================================');
console.log(`  Locked Sections: ${lockedSections.length}`);
console.log(`  Editable Elements: ${editableElements.length}`);
console.log(`  - Banner: ${editableElements.filter(e => e.type === 'BANNER').length}`);
console.log(`  - Text: ${editableElements.filter(e => e.type === 'TEXT').length}`);
console.log(`  - Text+Link: ${editableElements.filter(e => e.type === 'TEXT+LINK').length}`);
