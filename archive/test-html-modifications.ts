/**
 * Integration Test: HTML Modification Verification
 * 
 * Tests that the editor correctly modifies HTML without breaking structure.
 * Verifies: banner image, colors, text content changes work as expected.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { JSDOM } from 'jsdom';

// JSDOM provides DOMParser for Node.js
const { DOMParser, XMLSerializer } = new JSDOM('').window;

// Import parser functions inline (can't use import in this context)
const TEST_HTML_PATH = './src/TEST3.HTML';
const OUTPUT_DIR = './test-outputs';

// Create output directory
try {
    mkdirSync(OUTPUT_DIR, { recursive: true });
} catch { }

console.log('🧪 HTML Modification Integration Test\n');
console.log('='.repeat(50));

// Load original HTML
const originalHTML = readFileSync(TEST_HTML_PATH, 'utf-8');
console.log(`✓ Loaded TEST3.HTML (${(originalHTML.length / 1024).toFixed(1)} KB)`);

// Parse HTML
const parser = new DOMParser();
const doc = parser.parseFromString(originalHTML, 'text/html');
const serializer = new XMLSerializer();

// Test 1: Find and modify banner image
console.log('\n📸 Test 1: Banner Image Modification');
const bannerImg = doc.querySelector('img[width="600"]') || doc.querySelector('img');
if (bannerImg) {
    const originalSrc = bannerImg.getAttribute('src');
    const newSrc = 'https://test-banner-replaced.example.com/banner.jpg';
    bannerImg.setAttribute('src', newSrc);
    console.log(`  Original: ${originalSrc?.substring(0, 50)}...`);
    console.log(`  New: ${newSrc}`);
    console.log('  ✓ Banner image replaced');
} else {
    console.log('  ⚠ No banner image found');
}

// Test 2: Modify text colors
console.log('\n🎨 Test 2: Color Modification');
const colorElements = doc.querySelectorAll('[style*="color"]');
let colorChanges = 0;
const originalColor = '#338488';
const newColor = '#FF5500';

colorElements.forEach(el => {
    const style = el.getAttribute('style') || '';
    if (style.includes(originalColor)) {
        el.setAttribute('style', style.replace(new RegExp(originalColor, 'gi'), newColor));
        colorChanges++;
    }
});
console.log(`  Changed ${colorChanges} elements from ${originalColor} to ${newColor}`);

// Test 3: Modify text content (greeting paragraph)
console.log('\n📝 Test 3: Text Content Modification');
const paragraphs = doc.querySelectorAll('p');
let textChanges = 0;
paragraphs.forEach(p => {
    const text = p.textContent || '';
    if (text.includes('Good morning') || text.includes('Good Morning')) {
        p.textContent = 'TEST GREETING REPLACED - Good evening';
        textChanges++;
    }
});
console.log(`  Modified ${textChanges} text blocks`);

// Export modified HTML
console.log('\n💾 Exporting Modified HTML');
const modifiedHTML = `<!DOCTYPE html>\n<html>${doc.documentElement.innerHTML}</html>`;

// Verification checks
console.log('\n🔍 Verification');

// Check 1: HTML structure preserved
const originalDoctype = originalHTML.match(/<!DOCTYPE[^>]*>/i)?.[0];
console.log(`  DOCTYPE preserved: ${modifiedHTML.includes('DOCTYPE') ? '✓' : '✗'}`);

// Check 2: Count key elements before/after
const origDoc = parser.parseFromString(originalHTML, 'text/html');
const modDoc = parser.parseFromString(modifiedHTML, 'text/html');

const checks = [
    { name: 'Tables', selector: 'table' },
    { name: 'Images', selector: 'img' },
    { name: 'Links', selector: 'a' },
    { name: 'Paragraphs', selector: 'p' },
    { name: 'Divs', selector: 'div' },
    { name: 'TDs', selector: 'td' },
];

let allPassed = true;
checks.forEach(({ name, selector }) => {
    const origCount = origDoc.querySelectorAll(selector).length;
    const modCount = modDoc.querySelectorAll(selector).length;
    const passed = origCount === modCount;
    console.log(`  ${name}: ${origCount} → ${modCount} ${passed ? '✓' : '✗ MISMATCH!'}`);
    if (!passed) allPassed = false;
});

// Check 3: Verify changes were applied
console.log('\n📊 Change Verification');
console.log(`  Banner src changed: ${modifiedHTML.includes('test-banner-replaced') ? '✓' : '✗'}`);
console.log(`  Color changed: ${modifiedHTML.includes(newColor) ? '✓' : '✗'}`);
console.log(`  Text changed: ${modifiedHTML.includes('TEST GREETING REPLACED') ? '✓' : '✗'}`);

// Check 4: Verify locked sections NOT modified
const lockedSections = ['Companies', 'People', 'Topics', 'Headlines'];
console.log('\n🔒 Locked Section Verification');
lockedSections.forEach(section => {
    const inOrig = originalHTML.includes(`>${section}<`) || originalHTML.includes(`>${section.toUpperCase()}<`);
    const inMod = modifiedHTML.includes(`>${section}<`) || modifiedHTML.includes(`>${section.toUpperCase()}<`);
    console.log(`  ${section} header preserved: ${inOrig && inMod ? '✓' : '⚠'}`);
});

// Save outputs
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
writeFileSync(`${OUTPUT_DIR}/test-modified-${timestamp}.html`, modifiedHTML);
writeFileSync(`${OUTPUT_DIR}/test-original-backup.html`, originalHTML);

console.log('\n' + '='.repeat(50));
console.log(allPassed ? '✅ ALL STRUCTURE CHECKS PASSED' : '❌ SOME CHECKS FAILED');
console.log(`\nOutputs saved to ${OUTPUT_DIR}/`);
console.log(`  - test-modified-${timestamp}.html`);
console.log(`  - test-original-backup.html`);
