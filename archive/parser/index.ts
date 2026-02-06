// ============================================
// Parser Module Index
// ============================================
// 
// This module exports all parser functionality.
// Import from here for the cleanest API.
// 
// @example
// ```typescript
// import { parseTemplate, updateElementInHTML, deleteElementFromHTML } from './parser';
// 
// const result = parseTemplate(html);
// const updated = updateElementInHTML(html, elementId, 'text', newValue, oldValue);
// const deleted = deleteElementFromHTML(html, elementId);
// ```

// Main parsing function
export { parseTemplate } from './parse-template';
export type { ParseOptions } from './parse-template';

// HTML manipulation
export { updateElementInHTML } from './html-updates';
export { deleteElementFromHTML } from './deletion';
export type { DeleteResult } from './deletion';

// Color extraction
export { extractColors, replaceColorInHTML } from './colors';

// Utilities (for advanced usage)
export {
    generateId,
    getElementPath,
    normalizeWhitespace,
    escapeRegExp,
    extractElementStyles,
    isInsideLockedSection
} from './utils';

// Constants (for customization)
export {
    LOCKED_PATTERNS,
    DATE_PATTERN,
    SECTION_HEADER_PATTERN,
    HEADER_SELECTORS,
    MIN_TEXT_LENGTH,
    TEXTAREA_THRESHOLD
} from './constants';

// Sub-modules (for advanced usage)
export { findLockedSections, findSectionContainer } from './locked-sections';
export { discoverEditableElements } from './discover-elements';
