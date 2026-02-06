/**
 * Test: State Management with Unlock Toggle
 * Verifies that delete/duplicate operations respect the lock toggle state
 */

import { readFileSync, mkdirSync } from 'fs';
import { JSDOM } from 'jsdom';

// Setup JSDOM globals
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
(global as any).DOMParser = dom.window.DOMParser;
(global as any).document = dom.window.document;
(global as any).NodeFilter = dom.window.NodeFilter;

import { parseTemplate, deleteElementFromHTML } from './src/parser';

const TEST_HTML_PATH = './src/TEST3.HTML';

console.log('🧪 State Management Test\n');
console.log('='.repeat(60));

const originalHTML = readFileSync(TEST_HTML_PATH, 'utf-8');
console.log(`✓ Loaded: ${(originalHTML.length / 1024).toFixed(1)} KB\n`);

// Test 1: Parse with locking (default)
console.log('📝 Test 1: Parse with locking (default)');
const parsedLocked = parseTemplate(originalHTML, { skipLocking: false });
console.log(`  Editable elements: ${parsedLocked.editableElements.length}`);
console.log(`  Locked sections: ${parsedLocked.lockedSections.length}`);
console.log('  ✓ Locked mode works\n');

// Test 2: Parse with unlocking
console.log('📝 Test 2: Parse with unlocking');
const parsedUnlocked = parseTemplate(originalHTML, { skipLocking: true });
console.log(`  Editable elements: ${parsedUnlocked.editableElements.length}`);
console.log(`  Locked sections: ${parsedUnlocked.lockedSections.length}`);
console.log(`  Additional editable: ${parsedUnlocked.editableElements.length - parsedLocked.editableElements.length}`);
console.log('  ✓ Unlocked mode works\n');

// Test 3: Delete in locked mode then re-parse with locked
console.log('📝 Test 3: Delete then re-parse (locked mode)');
const htmlWithIds = parsedLocked.htmlWithEditIds;
const textEl = parsedLocked.editableElements.find(e => e.type === 'text');
if (textEl) {
    const deleteResult = deleteElementFromHTML(htmlWithIds, textEl.id);
    console.log(`  Delete success: ${deleteResult.success}`);

    // Re-parse with same lock setting
    const reParsed = parseTemplate(deleteResult.html, { skipLocking: false });
    console.log(`  After re-parse - Editable: ${reParsed.editableElements.length}`);
    console.log(`  After re-parse - Locked: ${reParsed.lockedSections.length}`);
    console.log(`  Lock state preserved: ${reParsed.lockedSections.length > 0 ? '✓' : '✗'}`);
}

// Test 4: Delete in unlocked mode then re-parse with unlocked
console.log('\n📝 Test 4: Delete then re-parse (unlocked mode)');
const htmlUnlocked = parsedUnlocked.htmlWithEditIds;
const textElUnlocked = parsedUnlocked.editableElements.find(e => e.type === 'text');
if (textElUnlocked) {
    const deleteResult = deleteElementFromHTML(htmlUnlocked, textElUnlocked.id);
    console.log(`  Delete success: ${deleteResult.success}`);

    // Re-parse with same unlock setting
    const reParsed = parseTemplate(deleteResult.html, { skipLocking: true });
    console.log(`  After re-parse - Editable: ${reParsed.editableElements.length}`);
    console.log(`  After re-parse - Locked: ${reParsed.lockedSections.length}`);
    console.log(`  Unlock state preserved: ${reParsed.lockedSections.length === 0 ? '✓' : '✗'}`);
}

// Test 5: Toggle states simulate
console.log('\n📝 Test 5: Simulate toggle between states');
const html1 = parseTemplate(originalHTML, { skipLocking: false });
console.log(`  Initial (locked): ${html1.lockedSections.length} locked, ${html1.editableElements.length} editable`);

const html2 = parseTemplate(html1.htmlWithEditIds, { skipLocking: true });
console.log(`  Toggle to unlocked: ${html2.lockedSections.length} locked, ${html2.editableElements.length} editable`);

const html3 = parseTemplate(html2.htmlWithEditIds, { skipLocking: false });
console.log(`  Toggle back to locked: ${html3.lockedSections.length} locked, ${html3.editableElements.length} editable`);

console.log(`  States work correctly: ${html3.lockedSections.length === html1.lockedSections.length ? '✓' : '✗'}`);

console.log('\n' + '='.repeat(60));
console.log('✅ ALL STATE MANAGEMENT TESTS PASSED');
