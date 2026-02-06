import { JSDOM } from 'jsdom';
import * as fs from 'fs';

// Read and parse TEST3.HTML
const html = fs.readFileSync('src/TEST3.HTML', 'utf-8');

// Look for phone number patterns in the HTML
const phonePatterns = [
  /Tel[:\s]*[\+\d\s\(\)\-]+/gi,
  /Phone[:\s]*[\+\d\s\(\)\-]+/gi,
  /\+91[\s\d\(\)\-]+/gi,
  /\+1[\s\d\(\)\-]+/gi,
  /\(\d{3}\)\s*\d{3}[\-\s]*\d{4}/g,
  /\d{3}[\-\.\s]\d{3}[\-\.\s]\d{4}/g,
];

console.log('=== Searching for phone numbers in TEST3.HTML ===\n');

phonePatterns.forEach((pattern, i) => {
  const matches = html.match(pattern);
  if (matches) {
    console.log(`Pattern ${i + 1} matches:`);
    matches.forEach(m => console.log(`  - "${m.trim()}"`));
  }
});

// Also search for "tel:" links
const dom = new JSDOM(html);
const doc = dom.window.document;

const telLinks = doc.querySelectorAll('a[href^="tel:"]');
console.log(`\n=== Tel: links found: ${telLinks.length} ===`);
telLinks.forEach((link, i) => {
  console.log(`${i + 1}. href: ${link.getAttribute('href')}, text: "${link.textContent?.trim()}"`);
});

// Search for any element containing phone-like text
console.log('\n=== Elements with phone-like content ===');
const allText = doc.body?.textContent || '';
const phoneMatches = allText.match(/[\+\(]?\d{1,4}[\s\-\(\)]*\d{2,4}[\s\-\(\)]*\d{2,4}[\s\-\(\)]*\d{2,4}/g);
if (phoneMatches) {
  const unique = [...new Set(phoneMatches)];
  unique.slice(0, 10).forEach(m => console.log(`  "${m}"`));
}
