# PRD: HTML Email Template Editor

## Executive Summary

A web-based tool that allows users to paste any Bynd-generated HTML email newsletter and edit **peripheral/branding elements** while keeping **AI-generated news content sections locked**. 

**Core Principle:** The system identifies and locks known content sections (Companies, People, Topics, Headlines, Date). Everything else is dynamically discovered and made editable.

---

## Problem Statement

Bynd generates AI-powered newsletters for clients. Clients need to customize branding elements without accidentally modifying the curated news content. Currently, editing raw HTML is error-prone and risks breaking the carefully structured news sections.

---

## Core Architecture

### The Fundamental Rule

```
┌─────────────────────────────────────────────────────────────────┐
│                        HTML TEMPLATE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   LOCKED (Defined List)          EDITABLE (Everything Else)     │
│   ─────────────────────          ──────────────────────────     │
│   • Companies section            • Any element NOT inside       │
│   • People section                 a locked section             │
│   • Topics section               • Dynamically discovered       │
│   • Headlines (optional)         • Presented as editable        │
│   • Date                           form fields                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Insight:** Don't pre-define what's editable. Define what's LOCKED, then everything else becomes editable by default.

---

## Section Classification

### LOCKED Sections (Exhaustive List)

These are the **only** section types that get locked. The system looks for these specific patterns:

| Section | Detection Keywords | Notes |
|---------|-------------------|-------|
| **Companies** | "Companies", "Company Mentioned", "Company" | Main news section |
| **People** | "People", "People Mentioned", "Persons", "Person" | Main news section |
| **Topics** | "Topics", "Topic", "Themes", "Theme" | Main news section |
| **Headlines** | "Today's headlines", "Headlines", "Summary" | Optional summary section |
| **Date** | Date pattern: `Day, DD Month YYYY` | Newsletter date stamp |

**Important Clarifications:**
- Subheadings like "M&A Targets", "Industry Reports", "B2B Events" are **NOT separate locked types**
- These are just organizational headers **within** the Companies/Topics sections
- When we lock "Companies", we lock the entire container including all its subheadings and articles

### Detection Logic

```typescript
const LOCKED_PATTERNS = {
  companies: /\b(companies?|company\s*mentioned?)\b/i,
  people: /\b(people|persons?|people\s*mentioned?)\b/i,
  topics: /\b(topics?|themes?)\b/i,
  headlines: /\b(today'?s?\s*)?headlines?|summary\b/i,
  date: /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday),?\s*\d{1,2}\s*(january|february|march|april|may|june|july|august|september|october|november|december)\s*\d{4}\b/i
};
```

### Locking Scope

When a locked header is found:
1. Identify the header element
2. Find the **nearest ancestor container** (table, div, or section)
3. Lock the **entire container** including all descendants
4. Continue until the next sibling section at the same level

```
Found: <p>Companies</p>
       ↓
Traverse up to find container
       ↓
Lock: <table> or <div> containing the header + all children
       ↓
Stop at: Next sibling <table> or <div> at same DOM level
```

---

### EDITABLE Sections (Dynamic Discovery)

Everything not inside a locked section is potentially editable. The system:

1. **Parses the entire DOM**
2. **Marks locked sections** (Companies, People, Topics, Headlines, Date)
3. **Collects remaining elements** as candidates for editing
4. **Categorizes discovered elements** by type for UI presentation

#### Common Editable Element Types (Examples, Not Exhaustive)

| Type | How to Identify | May or May Not Exist |
|------|-----------------|---------------------|
| **Images** | `<img>` tags not inside locked sections | ✓ |
| **Text Blocks** | `<p>`, `<div>` with text content | ✓ |
| **Links** | `<a>` tags with href | ✓ |
| **Tables** | `<table>` not inside locked sections | ✓ |
| **Styled Elements** | Any element with inline `style` attribute | ✓ |

#### Element Discovery Algorithm

```typescript
interface DiscoveredElement {
  id: string;                    // Generated unique ID
  type: 'image' | 'text' | 'link' | 'table' | 'styled';
  element: HTMLElement;          // DOM reference
  originalContent: string;       // For reset functionality
  path: string;                  // DOM path for re-identification
  context: string;               // Human-readable location hint
}

function discoverEditableElements(doc: Document, lockedElements: Set<HTMLElement>): DiscoveredElement[] {
  const editable: DiscoveredElement[] = [];
  
  // Walk entire DOM
  const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  
  while (walker.nextNode()) {
    const el = walker.currentNode as HTMLElement;
    
    // Skip if inside a locked section
    if (isInsideLockedSection(el, lockedElements)) continue;
    
    // Categorize and collect
    if (el.tagName === 'IMG') {
      editable.push(createDiscoveredElement(el, 'image'));
    } else if (hasEditableText(el)) {
      editable.push(createDiscoveredElement(el, 'text'));
    }
    // ... etc
  }
  
  return editable;
}
```

---

## Core Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. PASTE HTML                                                  │
│  User pastes raw HTML newsletter                                │
│  [Analyze Template →]                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  2. PARSE & CLASSIFY                                            │
│                                                                 │
│  Step A: Find and mark LOCKED sections                          │
│          (Companies, People, Topics, Headlines, Date)           │
│                                                                 │
│  Step B: Discover all OTHER elements = EDITABLE                 │
│          (Images, text blocks, links, colors, etc.)             │
│                                                                 │
│  Step C: Extract color palette from inline styles               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────┬──────────────────────────────────┐
│  3. EDITOR PANEL             │  4. LIVE PREVIEW                 │
│                              │                                  │
│  Dynamically generated tabs  │  Real-time rendered HTML         │
│  based on what was found:    │  in sandboxed iframe             │
│                              │                                  │
│  • Images (if any found)     │  Updates on every edit           │
│  • Text Blocks (if any)      │                                  │
│  • Colors (always)           │                                  │
│  • 🔒 Locked (view-only)     │                                  │
│                              │                                  │
└──────────────────────────────┴──────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  5. EXPORT                                                      │
│  [Download HTML]  [Copy to Clipboard]  [Reset to Original]      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Structures

### Core Parser Output

```typescript
interface ParsedTemplate {
  // The raw HTML for reset functionality
  rawHTML: string;
  
  // Locked sections (always these 5 types, some may be absent)
  lockedSections: LockedSection[];
  
  // Dynamically discovered editable elements
  editableElements: DiscoveredElement[];
  
  // Extracted colors (always present)
  colors: ExtractedColor[];
}

interface LockedSection {
  type: 'companies' | 'people' | 'topics' | 'headlines' | 'date';
  element: HTMLElement;
  headerText: string;      // The actual text found, e.g., "Companies"
  articleCount?: number;   // Optional count for display
}

interface DiscoveredElement {
  id: string;
  type: 'image' | 'text' | 'link' | 'table' | 'contact-group' | 'styled';
  element: HTMLElement;
  originalContent: string;
  editableFields: EditableField[];
}

interface EditableField {
  name: string;           // e.g., "src", "text", "href"
  type: 'url' | 'text' | 'email' | 'phone' | 'color';
  value: string;
  label: string;          // Human-readable label
}

interface ExtractedColor {
  hex: string;
  occurrences: number;
  elements: HTMLElement[];
}
```

---

## UI Generation Rules

The editor UI is **dynamically generated** based on what elements were discovered:

```typescript
function generateEditorTabs(parsed: ParsedTemplate): Tab[] {
  const tabs: Tab[] = [];
  
  // Group discovered elements by type
  const images = parsed.editableElements.filter(e => e.type === 'image');
  const textBlocks = parsed.editableElements.filter(e => e.type === 'text');
  const contactGroups = parsed.editableElements.filter(e => e.type === 'contact-group');
  
  // Only create tabs for element types that exist
  if (images.length > 0) {
    tabs.push({ id: 'images', label: `🖼 Images (${images.length})`, elements: images });
  }
  
  if (textBlocks.length > 0) {
    tabs.push({ id: 'text', label: `📝 Text (${textBlocks.length})`, elements: textBlocks });
  }
  
  if (contactGroups.length > 0) {
    tabs.push({ id: 'contacts', label: `👥 Contacts`, elements: contactGroups });
  }
  
  // Colors tab always present
  tabs.push({ id: 'colors', label: `🎨 Colors (${parsed.colors.length})`, colors: parsed.colors });
  
  // Locked sections tab always present (for transparency)
  tabs.push({ id: 'locked', label: `🔒 Locked (${parsed.lockedSections.length})`, sections: parsed.lockedSections });
  
  return tabs;
}
```

---

## Smart Element Detection

### Image Detection

```typescript
function detectImages(doc: Document, lockedElements: Set<HTMLElement>): DiscoveredElement[] {
  return Array.from(doc.querySelectorAll('img'))
    .filter(img => !isInsideLockedSection(img, lockedElements))
    .map(img => ({
      id: generateId(),
      type: 'image',
      element: img,
      originalContent: img.outerHTML,
      editableFields: [
        { name: 'src', type: 'url', value: img.src, label: 'Image URL' },
        { name: 'alt', type: 'text', value: img.alt, label: 'Alt Text' }
      ],
      context: inferImageContext(img)  // e.g., "Banner", "Logo", "Icon"
    }));
}

function inferImageContext(img: HTMLImageElement): string {
  const src = img.src.toLowerCase();
  const alt = img.alt.toLowerCase();
  const width = img.width;
  
  if (src.includes('banner') || width >= 600) return 'Banner Image';
  if (src.includes('logo')) return 'Logo';
  if (width <= 32) return 'Icon';
  return 'Image';
}
```

### Text Block Detection

```typescript
function detectTextBlocks(doc: Document, lockedElements: Set<HTMLElement>): DiscoveredElement[] {
  const textElements: DiscoveredElement[] = [];
  
  // Find paragraphs and divs with direct text content
  doc.querySelectorAll('p, div').forEach(el => {
    if (isInsideLockedSection(el, lockedElements)) return;
    if (!hasDirectTextContent(el)) return;
    
    const text = el.textContent?.trim() || '';
    if (text.length < 5) return;  // Skip tiny fragments
    
    textElements.push({
      id: generateId(),
      type: 'text',
      element: el,
      originalContent: el.innerHTML,
      editableFields: [
        { name: 'text', type: 'text', value: text, label: inferTextLabel(el, text) }
      ],
      context: inferTextContext(el, text)
    });
  });
  
  return textElements;
}

function inferTextContext(el: HTMLElement, text: string): string {
  // Try to give helpful context labels
  if (text.toLowerCase().includes('good morning') || text.toLowerCase().includes('hello')) {
    return 'Greeting';
  }
  if (text.toLowerCase().includes('have a great day') || text.toLowerCase().includes('regards')) {
    return 'Closing Message';
  }
  if (text.toLowerCase().includes('disclaimer') || text.toLowerCase().includes('notice')) {
    return 'Legal/Disclaimer';
  }
  if (el.closest('table[width="33%"]') || el.closest('td[width="33%"]')) {
    return 'Contact Info';
  }
  return 'Text Block';
}
```

### Contact Group Detection

```typescript
function detectContactGroups(doc: Document, lockedElements: Set<HTMLElement>): DiscoveredElement[] {
  // Look for patterns: grouped mailto links, phone numbers, names
  const contactPatterns = {
    email: /mailto:|@.*\.(com|org|net|co)/i,
    phone: /tel:|(\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/,
    name: /^[A-Z][a-z]+\s+[A-Z][a-z]+$/  // Simple name pattern
  };
  
  // Find tables or divs that contain multiple contacts
  // Return as grouped editable element with sub-fields
  // ...
}
```

---

## Color Management

Colors are **always** extracted and editable:

```typescript
interface ExtractedColor {
  hex: string;
  normalizedHex: string;     // Always 6-digit lowercase
  occurrences: number;
  contexts: string[];        // Where it's used: "background", "text", "border"
  elements: HTMLElement[];
}

function extractColors(doc: Document): ExtractedColor[] {
  const colorMap = new Map<string, ExtractedColor>();
  
  doc.querySelectorAll('[style]').forEach(el => {
    const style = el.getAttribute('style') || '';
    
    // Extract hex colors
    const hexMatches = style.match(/#[0-9a-fA-F]{3,6}/g) || [];
    
    // Extract rgb colors and convert to hex
    const rgbMatches = style.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/g) || [];
    
    [...hexMatches, ...rgbMatches.map(rgbToHex)].forEach(color => {
      const normalized = normalizeHex(color);
      const existing = colorMap.get(normalized);
      
      if (existing) {
        existing.occurrences++;
        existing.elements.push(el);
        existing.contexts.push(inferColorContext(style, color));
      } else {
        colorMap.set(normalized, {
          hex: color,
          normalizedHex: normalized,
          occurrences: 1,
          elements: [el],
          contexts: [inferColorContext(style, color)]
        });
      }
    });
  });
  
  return Array.from(colorMap.values())
    .sort((a, b) => b.occurrences - a.occurrences);
}

function inferColorContext(style: string, color: string): string {
  if (style.includes(`background-color:${color}`) || style.includes(`background:${color}`)) {
    return 'background';
  }
  if (style.includes(`border`) && style.includes(color)) {
    return 'border';
  }
  return 'text';
}
```

---

## Edge Cases

### No Locked Sections Found

```typescript
if (parsed.lockedSections.length === 0) {
  showWarning({
    title: "No News Sections Detected",
    message: "This doesn't appear to be a standard Bynd newsletter. All content will be editable.",
    action: "Continue Anyway"
  });
}
```

### No Editable Elements Found

```typescript
if (parsed.editableElements.length === 0 && parsed.colors.length === 0) {
  showError({
    title: "Nothing to Edit",
    message: "The entire template appears to be news content. Only colors can be modified.",
  });
}
```

### Malformed HTML

```typescript
function parseHTML(html: string): Document {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // DOMParser doesn't throw on invalid HTML, but creates error nodes
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    throw new HTMLParseError('Invalid HTML structure');
  }
  
  return doc;
}
```

---

## UI Layout (Wireframe)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HTML Email Template Editor                               [Dark Mode] │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Paste your HTML newsletter:                                    │   │
│  │  ┌───────────────────────────────────────────────────────────┐  │   │
│  │  │  <textarea>                                               │  │   │
│  │  └───────────────────────────────────────────────────────────┘  │   │
│  │  [Analyze Template →]                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

After Analysis (tabs generated dynamically):

┌─────────────────────────────────────────────────────────────────────────┐
│  ← Back                                                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────┬────────────────────────────────────────┐   │
│  │                        │                                        │   │
│  │  [🖼 Images (2)]       │                                        │   │
│  │  [📝 Text (4)]         │         LIVE PREVIEW                   │   │
│  │  [👥 Contacts (3)]     │                                        │   │
│  │  [🎨 Colors (8)]       │         (sandboxed iframe)             │   │
│  │  [🔒 Locked (3)]       │                                        │   │
│  │                        │                                        │   │
│  │  ────────────────────  │                                        │   │
│  │                        │                                        │   │
│  │  [Form fields for      │                                        │   │
│  │   selected tab]        │                                        │   │
│  │                        │                                        │   │
│  │  Each field shows:     │                                        │   │
│  │  • Context label       │                                        │   │
│  │  • Current value       │                                        │   │
│  │  • Input control       │                                        │   │
│  │                        │                                        │   │
│  └────────────────────────┴────────────────────────────────────────┘   │
│                                                                         │
│  [💾 Download HTML]  [📋 Copy HTML]  [🔄 Reset All]                     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation Notes

### DOM Manipulation Strategy

1. **Parse Once**: Parse HTML to DOM on initial analyze
2. **Reference Elements**: Store references to actual DOM elements
3. **Edit In-Place**: Modify DOM elements directly on user input
4. **Serialize on Export**: Convert DOM back to HTML string for download/copy

```typescript
class TemplateEditor {
  private doc: Document;
  private originalHTML: string;
  
  constructor(html: string) {
    this.originalHTML = html;
    this.doc = new DOMParser().parseFromString(html, 'text/html');
  }
  
  updateElement(elementId: string, field: string, value: string): void {
    const element = this.findElementById(elementId);
    if (!element) return;
    
    switch (field) {
      case 'src':
        (element as HTMLImageElement).src = value;
        break;
      case 'text':
        element.textContent = value;
        break;
      case 'href':
        (element as HTMLAnchorElement).href = value;
        break;
    }
  }
  
  updateColor(oldColor: string, newColor: string): void {
    this.doc.querySelectorAll('[style]').forEach(el => {
      const style = el.getAttribute('style') || '';
      el.setAttribute('style', style.replace(new RegExp(oldColor, 'gi'), newColor));
    });
  }
  
  getHTML(): string {
    return this.doc.documentElement.outerHTML;
  }
  
  reset(): void {
    this.doc = new DOMParser().parseFromString(this.originalHTML, 'text/html');
  }
}
```

### Preview Updates

```typescript
// Debounced preview updates for performance
const updatePreview = debounce((html: string) => {
  const iframe = document.getElementById('preview') as HTMLIFrameElement;
  iframe.srcdoc = html;
}, 150);
```

---

## Summary

| Aspect | Approach |
|--------|----------|
| **What's Locked** | Fixed list: Companies, People, Topics, Headlines, Date |
| **What's Editable** | Everything else (dynamically discovered) |
| **UI Tabs** | Generated based on what elements are found |
| **Colors** | Always extracted and editable |
| **Flexibility** | Works with any Bynd template structure |
| **Robustness** | Graceful handling when sections are missing |
