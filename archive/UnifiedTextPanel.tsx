import { Image, Type, Link2, Plus, Check, Copy, Lock, Trash2 } from 'lucide-react';
import type { DiscoveredElement, ExtractedStyles, LockedSection } from '../types';

// Unified content item type for sequential display
type ContentItem =
    | { kind: 'editable'; data: DiscoveredElement }
    | { kind: 'locked'; data: LockedSection };

interface UnifiedTextPanelProps {
    elements: DiscoveredElement[];
    lockedSections?: LockedSection[];
    onElementChange: (elementId: string, fieldName: string, newValue: string) => void;
    onElementHover?: (elementPath: string | null) => void;
    onAddTableRow?: (elementId: string, position: 'before' | 'after') => void;
    onApplyChanges?: () => void;
    hasChanges?: boolean;
    onDuplicateElement?: (elementId: string) => void;
    onDeleteElement?: (elementId: string) => void;
    previewHoveredId?: string | null;
}

function getCardIcon(type: string) {
    switch (type) {
        case 'banner': return <Image size={16} />;
        case 'text-with-link': return <Link2 size={16} />;
        case 'table-row': return <Type size={16} />;
        default: return <Type size={16} />;
    }
}

function getCardTitle(type: string) {
    switch (type) {
        case 'banner': return 'Banner Image';
        case 'text-with-link': return 'Text with Link';
        case 'table-row': return 'Table Row';
        default: return '';
    }
}

// Convert extracted styles to React inline styles
function toInlineStyles(styles?: ExtractedStyles): React.CSSProperties {
    if (!styles) return {};

    return {
        fontSize: styles.fontSize || undefined,
        fontWeight: styles.fontWeight as React.CSSProperties['fontWeight'] || undefined,
        color: styles.color || undefined,
    };
}

export function UnifiedTextPanel({
    elements,
    lockedSections = [],
    onElementChange,
    onElementHover,
    onAddTableRow,
    onApplyChanges,
    hasChanges,
    onDuplicateElement,
    onDeleteElement,
    previewHoveredId
}: UnifiedTextPanelProps) {

    // Handle Enter key to apply changes
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey && onApplyChanges && hasChanges) {
            e.preventDefault();
            onApplyChanges();
        }
    };

    // Merge editable elements and locked sections into a unified sorted list
    const contentItems: ContentItem[] = [
        ...elements.map(el => ({ kind: 'editable' as const, data: el })),
        ...lockedSections.map(sec => ({ kind: 'locked' as const, data: sec }))
    ].sort((a, b) => {
        const posA = a.kind === 'editable' ? a.data.documentPosition : a.data.documentPosition;
        const posB = b.kind === 'editable' ? b.data.documentPosition : b.data.documentPosition;
        return posA - posB;
    });

    if (contentItems.length === 0) {
        return (
            <div className="empty-state">
                <Type size={48} />
                <p className="empty-state-title">No content detected</p>
                <p className="empty-state-text">
                    No editable or locked elements were found in this template.
                </p>
            </div>
        );
    }

    const editableCount = elements.length;
    const lockedCount = lockedSections.length;

    return (
        <div className="unified-panel">
            <div className="section-header">
                <h3 className="section-title">Content</h3>
                <p className="section-description">
                    {editableCount} editable, {lockedCount} locked section{lockedCount !== 1 ? 's' : ''}
                </p>
            </div>

            <div className="content-list tree-view">
                {contentItems.map((item, index) => {
                    if (item.kind === 'locked') {
                        // Render locked section card
                        const section = item.data;
                        return (
                            <div key={`locked-${section.id}`} className="tree-node-wrapper">
                                <div
                                    className="content-card locked-card"
                                    onMouseEnter={() => onElementHover?.(section.elementPath)}
                                    onMouseLeave={() => onElementHover?.(null)}
                                >
                                    <div className="card-header">
                                        <div className="card-title-row">
                                            <span className="card-icon locked-icon"><Lock size={16} /></span>
                                            <span className="card-title">{section.headerText}</span>
                                            <span className="locked-badge">Locked</span>
                                        </div>
                                    </div>
                                    <div className="card-body locked-body">
                                        <p className="locked-description">
                                            {section.articleCount
                                                ? `${section.articleCount} item${section.articleCount !== 1 ? 's' : ''} in this section`
                                                : 'This section is not editable'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    // Render editable element card (existing logic)
                    const element = item.data;
                    const prevItem = index > 0 ? contentItems[index - 1] : null;
                    const nextItem = index < contentItems.length - 1 ? contentItems[index + 1] : null;
                    const prevElement = prevItem?.kind === 'editable' ? prevItem.data : null;
                    const nextElement = nextItem?.kind === 'editable' ? nextItem.data : null;
                    const isFirstInGroup = !prevElement || prevElement.parentPath !== element.parentPath;
                    const isLastInGroup = !nextElement || nextElement.parentPath !== element.parentPath;
                    const depth = element.depth || 0;

                    return (
                        <div key={element.id} className="tree-node-wrapper">
                            {/* Add row button before (only for table rows) */}
                            {element.type === 'table-row' && onAddTableRow && index === 0 && (
                                <button
                                    className="add-row-btn"
                                    onClick={() => onAddTableRow(element.id, 'before')}
                                    title="Add row before"
                                >
                                    <Plus size={12} />
                                    <span>Add row</span>
                                </button>
                            )}

                            <div
                                className={`tree-node depth-${depth} ${isFirstInGroup ? 'first-in-group' : ''} ${isLastInGroup ? 'last-in-group' : ''}`}
                                style={{ '--depth': depth } as React.CSSProperties}
                            >
                                {/* Tree branch lines */}
                                {depth > 0 && (
                                    <div className="tree-branch">
                                        <div className="tree-line-vertical" />
                                        <div className="tree-line-horizontal" />
                                    </div>
                                )}

                                <div
                                    className={`content-item ${element.type} ${previewHoveredId === element.id ? 'preview-hover' : ''}`}
                                    onMouseEnter={() => onElementHover?.(element.elementPath)}
                                    onMouseLeave={() => onElementHover?.(null)}
                                    data-element-id={element.id}
                                >
                                    {/* Duplicate button - appears on hover */}
                                    {onDuplicateElement && (
                                        <button
                                            className="duplicate-btn"
                                            onClick={() => onDuplicateElement(element.id)}
                                            title="Duplicate this element"
                                        >
                                            <Copy size={12} />
                                        </button>
                                    )}

                                    {/* Delete button - appears on hover */}
                                    {onDeleteElement && (
                                        <button
                                            className="delete-btn"
                                            onClick={() => onDeleteElement(element.id)}
                                            title="Delete this element"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}

                                    {/* Show header only for special types */}
                                    {(element.type === 'banner' || element.type === 'text-with-link' || element.type === 'table-row') && (
                                        <div className="content-item-header">
                                            {getCardIcon(element.type)}
                                            <span className="content-item-title">{getCardTitle(element.type)}</span>
                                        </div>
                                    )}

                                    {/* Banner image preview */}
                                    {element.type === 'banner' && (
                                        <div className="banner-preview">
                                            <img
                                                src={element.editableFields.find(f => f.name === 'src')?.value || ''}
                                                alt={element.editableFields.find(f => f.name === 'alt')?.value || 'Banner'}
                                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                            />
                                        </div>
                                    )}

                                    {/* Editable fields with styles applied */}
                                    <div className="content-item-fields">
                                        {element.editableFields.map((field) => (
                                            <div key={field.name} className="content-field">
                                                {field.label && <label className="content-field-label">{field.label}</label>}
                                                <div className="field-with-apply">
                                                    {field.type === 'textarea' ? (
                                                        <textarea
                                                            className="content-field-textarea"
                                                            style={field.name === 'text' ? toInlineStyles(element.styles) : undefined}
                                                            value={field.value}
                                                            onChange={(e) => onElementChange(element.id, field.name, e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter' && e.ctrlKey && onApplyChanges && hasChanges) {
                                                                    e.preventDefault();
                                                                    onApplyChanges();
                                                                }
                                                            }}
                                                        />
                                                    ) : field.type === 'url' ? (
                                                        <input
                                                            type="url"
                                                            className="content-field-input url"
                                                            value={field.value}
                                                            onChange={(e) => onElementChange(element.id, field.name, e.target.value)}
                                                            onKeyDown={handleKeyDown}
                                                            placeholder="https://..."
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            className="content-field-input"
                                                            style={field.name === 'text' ? toInlineStyles(element.styles) : undefined}
                                                            value={field.value}
                                                            onChange={(e) => onElementChange(element.id, field.name, e.target.value)}
                                                            onKeyDown={handleKeyDown}
                                                        />
                                                    )}
                                                    {hasChanges && onApplyChanges && (
                                                        <button
                                                            className="inline-apply-btn"
                                                            onClick={onApplyChanges}
                                                            title="Apply changes (Enter)"
                                                        >
                                                            <Check size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Add row button after (for table rows) */}
                                {element.type === 'table-row' && onAddTableRow && (
                                    <button
                                        className="add-row-btn"
                                        onClick={() => onAddTableRow(element.id, 'after')}
                                        title="Add row after"
                                    >
                                        <Plus size={12} />
                                        <span>Add row</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

