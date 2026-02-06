// ============================================
// Core Types for Email Template Editor
// ============================================

// Sections that should be locked (not editable)
export type LockedSectionType = 'companies' | 'people' | 'topics' | 'headlines';

// Simple element types
export type EditableElementType = 'banner' | 'text' | 'text-with-link' | 'mixed-content' | 'table-row';

export type FieldType = 'url' | 'text' | 'textarea';

// Only 3 tabs: Content (unified), Colors, Locked
export type EditorTab = 'content' | 'colors' | 'locked';

// ============================================
// Locked Sections
// ============================================

export interface LockedSection {
  id: string;
  type: LockedSectionType;
  headerText: string;
  elementPath: string;
  articleCount?: number;
  documentPosition: number; // For ordering with editable elements
}

// ============================================
// Editable Elements
// ============================================

export interface EditableField {
  name: string;
  type: FieldType;
  value: string;           // Normalized text for display
  originalValue?: string;  // Original text from HTML (with whitespace) for matching
  label: string;
  linkText?: string;       // For link fields: the display text of the link
}

// Extracted styles for visual matching
export interface ExtractedStyles {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
}

export interface DiscoveredElement {
  id: string;
  type: EditableElementType;
  elementPath: string;
  originalHTML: string; // innerHTML of the element
  originalOuterHTML: string; // Full outer HTML for string-based replacement
  editableFields: EditableField[];
  documentPosition: number; // For ordering in document order
  styles?: ExtractedStyles; // For visual matching in editor
  // Hierarchy info for tree visualization
  depth: number; // Nesting level (0 = top level)
  parentPath?: string; // Path to parent container for grouping
  containerHTML?: string; // OuterHTML of container for duplication
}

// ============================================
// Colors
// ============================================

export interface ExtractedColor {
  hex: string;
  usage: 'text' | 'background' | 'border' | 'other';
  count: number;
}

// ============================================
// Parsed Template (Main Output)
// ============================================

export interface ParsedTemplate {
  rawHTML: string;
  htmlWithEditIds: string; // HTML with data-edit-id attributes for click-to-edit
  lockedSections: LockedSection[];
  editableElements: DiscoveredElement[];
  colors: ExtractedColor[];
  parseWarnings: string[];
}

// ============================================
// Editor State
// ============================================

export interface EditorState {
  activeTab: EditorTab;
  modifiedHTML: string;
  hasChanges: boolean;
}

// ============================================
// UI State
// ============================================

export type AppView = 'input' | 'editor';

export interface AppState {
  view: AppView;
  inputHTML: string;
  parsedTemplate: ParsedTemplate | null;
  editorState: EditorState | null;
  error: string | null;
}
