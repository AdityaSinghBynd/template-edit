// ============================================
// Element Deletion
// ============================================
// 
// This module handles gracefully deleting elements from HTML templates.
// Ensures structure remains valid (no orphaned table cells, etc.)

/**
 * Result of a deletion operation.
 */
export interface DeleteResult {
    /** Whether the deletion was successful */
    success: boolean;
    /** The modified HTML */
    html: string;
    /** Information about the deleted element (for undo) */
    deletedElement: {
        id: string;
        type: string;
        outerHTML: string;
    } | null;
    /** List of parent element IDs that were cleaned up */
    cleanedParents: string[];
    /** Any warnings generated during deletion */
    warnings: string[];
}

/**
 * Context information for deletion decisions.
 */
interface DeleteContext {
    element: Element;
    isTableRow: boolean;
    isTableCell: boolean;
    isImage: boolean;
    parentElement: Element | null;
    siblingsBefore: number;
    siblingsAfter: number;
    willOrphanParent: boolean;
}

/**
 * Gracefully delete an element from HTML without breaking structure.
 * 
 * Special handling:
 * - Table cells: Content is cleared but cell is preserved (maintains table structure)
 * - Table rows: Can be deleted if not the last row
 * - Empty parents: Optionally collapsed to prevent orphaned containers
 * 
 * @param html - The HTML string to modify
 * @param elementId - The data-edit-id of the element to delete
 * @param options - Deletion options
 * @returns DeleteResult with success status and modified HTML
 */
export function deleteElementFromHTML(
    html: string,
    elementId: string,
    options: {
        collapseEmptyParents?: boolean;
        normalizeWhitespace?: boolean;
    } = {}
): DeleteResult {
    const {
        collapseEmptyParents = true,
        normalizeWhitespace = true
    } = options;

    const result: DeleteResult = {
        success: false,
        html,
        deletedElement: null,
        cleanedParents: [],
        warnings: []
    };

    // Parse HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find element by ID
    // Find element by ID or XPath
    let element: Element | null = null;

    if (elementId.startsWith('xpath:')) {
        try {
            const xpath = elementId.substring(6);
            const xPathResult = doc.evaluate(xpath, doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            element = xPathResult.singleNodeValue as Element;
        } catch (e) {
            result.warnings.push(`Invalid XPath: ${elementId}`);
        }
    } else {
        element = doc.querySelector(`[data-edit-id="${elementId}"]`);
    }
    if (!element) {
        result.warnings.push(`Element with id "${elementId}" not found`);
        return result;
    }

    // Store for undo
    result.deletedElement = {
        id: elementId,
        type: element.tagName.toLowerCase(),
        outerHTML: element.outerHTML
    };

    // Analyze context
    const context = analyzeDeleteContext(element);

    // Handle table row specially
    if (context.isTableRow) {
        const tr = element as HTMLTableRowElement;
        const tbody = tr.closest('tbody') || tr.closest('table');
        const otherRows = tbody?.querySelectorAll('tr').length || 0;

        if (otherRows <= 1) {
            result.warnings.push('Cannot delete the last row in a table section');
        }
    }

    // Handle table cell specially (don't delete, just clear)
    if (context.isTableCell) {
        element.innerHTML = '';
        element.removeAttribute('data-edit-id');
        result.warnings.push('Table cell content cleared (cell preserved for structure)');
    } else {
        // Get parent before removal
        const parent = element.parentElement;

        // Remove the element
        element.remove();

        // Cleanup empty parents if enabled
        if (collapseEmptyParents && parent) {
            cleanupAfterDelete(parent, result.cleanedParents);
        }
    }

    // Normalize whitespace if enabled
    if (normalizeWhitespace) {
        doc.body.innerHTML = doc.body.innerHTML
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .replace(/>\s+</g, (match) => {
                return match.includes('\n') ? '>\n<' : '> <';
            });
    }

    // Validate structure
    const validation = validateHTMLStructure(doc);
    if (!validation.valid) {
        result.warnings.push(...validation.errors);
    }

    // Serialize back to HTML
    const originalDoctype = html.match(/<!DOCTYPE[^>]*>/i)?.[0] || '<!DOCTYPE html>';
    const newHTML = originalDoctype + '\n' + doc.documentElement.outerHTML;

    result.success = true;
    result.html = newHTML;

    return result;
}

/**
 * Analyze the deletion context to determine the best strategy.
 */
function analyzeDeleteContext(element: Element): DeleteContext {
    const parent = element.parentElement;
    const tagName = element.tagName.toLowerCase();

    let siblingsBefore = 0;
    let siblingsAfter = 0;
    let foundSelf = false;

    if (parent) {
        Array.from(parent.childNodes).forEach(node => {
            if (node === element) {
                foundSelf = true;
                return;
            }
            const isSignificant = node.nodeType === 1 ||
                (node.nodeType === 3 && node.textContent?.trim());
            if (isSignificant) {
                if (foundSelf) siblingsAfter++;
                else siblingsBefore++;
            }
        });
    }

    return {
        element,
        isTableRow: tagName === 'tr',
        isTableCell: tagName === 'td' || tagName === 'th',
        isImage: tagName === 'img',
        parentElement: parent,
        siblingsBefore,
        siblingsAfter,
        willOrphanParent: siblingsBefore === 0 && siblingsAfter === 0
    };
}

/**
 * Clean up empty parents after deletion.
 */
function cleanupAfterDelete(parent: Element | null, cleanedParents: string[]): void {
    if (!parent) return;

    const preserveTags = ['body', 'html', 'head', 'table', 'tbody', 'thead', 'tfoot'];

    const hasSignificantContent = Array.from(parent.childNodes).some(node => {
        if (node.nodeType === 1) return true;
        if (node.nodeType === 3 && node.textContent?.trim()) return true;
        return false;
    });

    if (!hasSignificantContent && !preserveTags.includes(parent.tagName.toLowerCase())) {
        const grandparent = parent.parentElement;
        const parentId = parent.getAttribute('data-edit-id') || parent.tagName;

        parent.remove();
        cleanedParents.push(parentId);

        cleanupAfterDelete(grandparent, cleanedParents);
    } else {
        // Normalize whitespace
        const nodesToRemove: ChildNode[] = [];
        parent.childNodes.forEach((node, idx) => {
            if (node.nodeType === 3 && !node.textContent?.trim()) {
                const prev = parent.childNodes[idx - 1];
                const next = parent.childNodes[idx + 1];
                if (prev?.nodeType === 1 && next?.nodeType === 1) {
                    node.textContent = '\n';
                } else if (!prev || !next) {
                    nodesToRemove.push(node);
                }
            }
        });
        nodesToRemove.forEach(n => n.remove());
    }
}

/**
 * Validate HTML structure is still valid after deletion.
 */
function validateHTMLStructure(doc: Document): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    doc.querySelectorAll('td, th').forEach(cell => {
        if (!cell.closest('tr')) errors.push('Orphaned table cell found');
    });

    doc.querySelectorAll('tr').forEach(row => {
        if (!row.closest('table')) errors.push('Orphaned table row found');
    });

    doc.querySelectorAll('tbody').forEach(tbody => {
        if (!tbody.querySelector('tr')) {
            const table = tbody.closest('table');
            if (table && !table.querySelector('tr')) {
                errors.push('Empty table with no rows');
            }
        }
    });

    return { valid: errors.length === 0, errors };
}
