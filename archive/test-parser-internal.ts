/**
 * Internal Parser Test - Uses actual parser.ts logic
 * Tests: parseTemplate, updateElementInHTML, color extraction
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { JSDOM } from 'jsdom';

// Setup JSDOM globals for parser
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
(global as any).DOMParser = dom.window.DOMParser;
(global as any).document = dom.window.document;
(global as any).NodeFilter = dom.window.NodeFilter;

// Now import parser (after globals are set)
import { parseTemplate, updateElementInHTML } from './src/parser';

const TEST_HTML_PATH = './src/TEST3.HTML';
const OUTPUT_DIR = './test-outputs';

try { mkdirSync(OUTPUT_DIR, { recursive: true }); } catch { }

console.log('🧪 Internal Parser Test\n');
console.log('='.repeat(60));

// Load and parse
const originalHTML = readFileSync(TEST_HTML_PATH, 'utf-8');
console.log(`✓ Loaded: ${(originalHTML.length / 1024).toFixed(1)} KB\n`);

const parsed = parseTemplate(originalHTML);
console.log('📊 Parse Results:');
console.log(`  Editable elements: ${parsed.editableElements.length}`);
console.log(`  Locked sections: ${parsed.lockedSections.length}`);
console.log(`  Colors found: ${parsed.colors.length}`);
console.log(`  Warnings: ${parsed.parseWarnings.length}`);

// Show element types
const typeCount: Record<string, number> = {};
parsed.editableElements.forEach(el => {
    typeCount[el.type] = (typeCount[el.type] || 0) + 1;
});
console.log('\n📝 Element Types:');
Object.entries(typeCount).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
});

// Show locked sections
console.log('\n🔒 Locked Sections:');
parsed.lockedSections.forEach(s => {
    console.log(`  ${s.type}: "${s.headerText}" (${s.articleCount || 0} articles)`);
});

// Test modifications
console.log('\n🔧 Testing Modifications:');
let html = parsed.rawHTML;
let changesMade = 0;

// Test 1: Modify banner image
const bannerEl = parsed.editableElements.find(e => e.type === 'banner');
if (bannerEl) {
    const srcField = bannerEl.editableFields.find(f => f.name === 'src');
    if (srcField) {
        const result = updateElementInHTML(
            html,
            bannerEl.id,
            'src',
            'https://NEW-BANNER-URL.example.com/banner.jpg',
            srcField.value
        );
        if (result.html !== html) {
            html = result.html;
            changesMade++;
            console.log('  ✓ Banner image updated');
        } else {
            console.log('  ✗ Banner update failed');
        }
    }
}

// Test 2: Modify a text element
const textEl = parsed.editableElements.find(e => e.type === 'text');
if (textEl) {
    const textField = textEl.editableFields.find(f => f.name === 'text');
    if (textField) {
        const result = updateElementInHTML(
            html,
            textEl.id,
            'text',
            'MODIFIED TEXT CONTENT FOR TESTING',
            textField.value
        );
        if (result.html !== html) {
            html = result.html;
            changesMade++;
            console.log('  ✓ Text content updated');
        } else {
            console.log('  ✗ Text update failed');
        }
    }
}

// Test 3: Modify a mixed-content element (with links)
const mixedEl = parsed.editableElements.find(e => e.type === 'mixed-content');
if (mixedEl) {
    const textField = mixedEl.editableFields.find(f => f.name === 'text');
    if (textField) {
        const result = updateElementInHTML(
            html,
            mixedEl.id,
            'text',
            textField.value.replace(/[A-Za-z]+@/, 'TESTEMAIL@'),
            textField.value
        );
        if (result.html !== html) {
            html = result.html;
            changesMade++;
            console.log('  ✓ Mixed-content updated (preserved links)');
        } else {
            console.log('  ⚠ Mixed-content unchanged (may be expected)');
        }
    }
}

// Test 4: Color replacement (global string replace)
const primaryColor = parsed.colors.find(c => c.usage === 'text' && c.count > 5);
if (primaryColor) {
    const newColor = '#FF0000';
    const colorRegex = new RegExp(primaryColor.hex, 'gi');
    const beforeCount = (html.match(colorRegex) || []).length;
    html = html.replace(colorRegex, newColor);
    const afterCount = (html.match(new RegExp(newColor, 'gi')) || []).length;
    console.log(`  ✓ Color replaced: ${primaryColor.hex} → ${newColor} (${beforeCount} instances)`);
    changesMade++;
}

// Verification
console.log('\n🔍 Verification:');
const modDoc = new dom.window.DOMParser().parseFromString(html, 'text/html');
const origDoc = new dom.window.DOMParser().parseFromString(originalHTML, 'text/html');

const checks = [
    { name: 'Tables', sel: 'table' },
    { name: 'Images', sel: 'img' },
    { name: 'Links', sel: 'a' },
    { name: 'Paragraphs', sel: 'p' },
];

let passed = 0;
checks.forEach(({ name, sel }) => {
    const orig = origDoc.querySelectorAll(sel).length;
    const mod = modDoc.querySelectorAll(sel).length;
    const ok = orig === mod;
    console.log(`  ${name}: ${orig} → ${mod} ${ok ? '✓' : '✗'}`);
    if (ok) passed++;
});

// Verify changes applied
console.log('\n📊 Changes Applied:');
console.log(`  Banner URL in HTML: ${html.includes('NEW-BANNER-URL') ? '✓' : '✗'}`);
console.log(`  Modified text in HTML: ${html.includes('MODIFIED TEXT CONTENT') ? '✓' : '✗'}`);
console.log(`  New color in HTML: ${html.includes('#FF0000') ? '✓' : '✗'}`);

// Save output
const timestamp = Date.now();
writeFileSync(`${OUTPUT_DIR}/parser-test-${timestamp}.html`, html);
console.log(`\n💾 Saved: ${OUTPUT_DIR}/parser-test-${timestamp}.html`);

console.log('\n' + '='.repeat(60));
console.log(`Result: ${passed}/${checks.length} structure checks passed, ${changesMade} modifications made`);
console.log(passed === checks.length ? '✅ TEST PASSED' : '❌ TEST FAILED');
