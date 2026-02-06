// ============================================
// Parser Module Re-exports
// ============================================
// 
// This file re-exports from the modular parser directory.
// For new code, import directly from './parser' or './parser/index'.
// 
// The parser is now organized into these modules:
// - parse-template.ts  : Main parseTemplate function
// - discover-elements.ts: Editable element discovery
// - locked-sections.ts : Locked section detection
// - html-updates.ts    : Element update functions
// - deletion.ts        : Element deletion functions
// - colors.ts          : Color extraction
// - utils.ts           : Utility functions
// - constants.ts       : Patterns and constants

export {
  // Main functions
  parseTemplate,
  updateElementInHTML,
  deleteElementFromHTML,
  extractColors,
  replaceColorInHTML,

  // Types
  type ParseOptions,
  type DeleteResult,

  // Utilities
  generateId,
  getElementPath,
  normalizeWhitespace,
  escapeRegExp,
  extractElementStyles,
  isInsideLockedSection,

  // Constants
  LOCKED_PATTERNS,
  DATE_PATTERN,
  SECTION_HEADER_PATTERN,
  HEADER_SELECTORS,
  MIN_TEXT_LENGTH,
  TEXTAREA_THRESHOLD,

  // Advanced
  findLockedSections,
  findSectionContainer,
  discoverEditableElements,
} from './parser/index';
