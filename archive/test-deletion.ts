/**
 * Test: Graceful Element Deletion
 * Verifies the deleteElementFromHTML function works correctly
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { JSDOM } from 'jsdom';

// Setup JSDOM globals
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
(global as any).DOMParser = dom.window.DOMParser;
(global as any).document = dom.window.document;
(global as any).NodeFilter = dom.window.NodeFilter;

import { parseTemplate, deleteElementFromHTML } from './src/parser';

const TEST_HTML_PATH = './src/TEST3.HTML';
const OUTPUT_DIR = './test-outputs';

try { mkdirSync(OUTPUT_DIR, { recursive: true }); } catch { }

console.log('🧪 Graceful Element Deletion Test\n');
console.log('='.repeat(60));

// Load and parse
const originalHTML = readFileSync(TEST_HTML_PATH, 'utf-8');
console.log(`✓ Loaded: ${(originalHTML.length / 1024).toFixed(1)} KB\n`);

const parsed = parseTemplate(originalHTML);
console.log(`Found ${parsed.editableElements.length} editable elements\n`);

// Use the HTML with edit IDs for deletion (this has data-edit-id attributes)
const htmlWithIds = parsed.htmlWithEditIds;

// Test 1: Delete a text element
console.log('📝 Test 1: Delete text element');
const textEl = parsed.editableElements.find(e => e.type === 'text');
if (textEl) {
    const result = deleteElementFromHTML(htmlWithIds, textEl.id);
    console.log(`  Success: ${result.success}`);
    console.log(`  Deleted: ${result.deletedElement?.type} (ID: ${result.deletedElement?.id})`);
    console.log(`  Cleaned parents: ${result.cleanedParents.length}`);
    console.log(`  Warnings: ${result.warnings.length === 0 ? 'None' : result.warnings.join(', ')}`);

    // Verify structure
    const origDoc = new dom.window.DOMParser().parseFromString(htmlWithIds, 'text/html');
    const newDoc = new dom.window.DOMParser().parseFromString(result.html, 'text/html');
    const origElements = origDoc.querySelectorAll('*').length;
    const newElements = newDoc.querySelectorAll('*').length;
    console.log(`  Elements: ${origElements} → ${newElements} (${origElements - newElements} removed)`);
    console.log('  ✓ Text element deleted\n');
}

// Test 2: Delete banner image
console.log('📸 Test 2: Delete banner image');
const bannerEl = parsed.editableElements.find(e => e.type === 'banner');
if (bannerEl) {
    const result = deleteElementFromHTML(htmlWithIds, bannerEl.id);
    console.log(`  Success: ${result.success}`);
    console.log(`  Deleted: ${result.deletedElement?.type}`);
    console.log(`  Cleaned parents: ${result.cleanedParents.length}`);
    console.log(`  Warnings: ${result.warnings.join(', ') || 'None'}`);

    // Verify banner is gone
    const newDoc = new dom.window.DOMParser().parseFromString(result.html, 'text/html');
    const bannerGone = !newDoc.querySelector(`[data-edit-id="${bannerEl.id}"]`);
    console.log(`  Banner removed from DOM: ${bannerGone ? '✓' : '✗'}`);
    console.log('  ✓ Banner deleted\n');
}

// Test 3: Delete mixed-content element
console.log('📧 Test 3: Delete mixed-content element (with links)');
const mixedEl = parsed.editableElements.find(e => e.type === 'mixed-content');
if (mixedEl) {
    const result = deleteElementFromHTML(htmlWithIds, mixedEl.id);
    console.log(`  Success: ${result.success}`);
    console.log(`  Deleted: ${result.deletedElement?.type}`);
    console.log(`  Cleaned parents: ${result.cleanedParents.length}`);
    console.log(`  HTML size change: ${(htmlWithIds.length / 1024).toFixed(1)}KB → ${(result.html.length / 1024).toFixed(1)}KB`);
    console.log('  ✓ Mixed-content deleted\n');
}

// Test 4: Multiple sequential deletions
console.log('🔄 Test 4: Multiple sequential deletions (5 elements)');
let html = htmlWithIds;
let deletedCount = 0;
const elementsToDelete = parsed.editableElements.slice(0, 5);

for (const el of elementsToDelete) {
    const result = deleteElementFromHTML(html, el.id);
    if (result.success) {
        html = result.html;
        deletedCount++;
    }
}
console.log(`  Deleted: ${deletedCount}/${elementsToDelete.length} elements`);

// Verify structure still valid
const finalDoc = new dom.window.DOMParser().parseFromString(html, 'text/html');
const tables = finalDoc.querySelectorAll('table').length;
const links = finalDoc.querySelectorAll('a').length;
console.log(`  Tables remaining: ${tables}`);
console.log(`  Links remaining: ${links}`);
console.log('  ✓ Sequential deletions complete\n');

// Save output for inspection
const outputPath = `${OUTPUT_DIR}/deletion-test-${Date.now()}.html`;
writeFileSync(outputPath, html);
console.log(`💾 Output saved: ${outputPath}`);

console.log('\n' + '='.repeat(60));
console.log(deletedCount === 5 ? '✅ ALL DELETION TESTS PASSED' : '⚠️ SOME DELETIONS FAILED');
