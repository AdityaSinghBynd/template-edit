import { useState, useRef, useEffect } from 'react';
import { Check, Upload } from 'lucide-react';

interface FloatingEditorProps {
    isOpen: boolean;
    position: { top: number; left: number; width: number; height: number };
    fields: { name: string; value: string; label?: string; type: string }[];
    onSave: (newValues: Record<string, string>) => void;
    onCancel: () => void;
}

export function FloatingEditor({ isOpen, position, fields, onSave, onCancel }: FloatingEditorProps) {
    // Store values as a map: fieldName -> value
    const [editValues, setEditValues] = useState<Record<string, string>>({});
    const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize values when opened
    useEffect(() => {
        if (isOpen) {
            const initialValues: Record<string, string> = {};
            fields.forEach(field => {
                initialValues[field.name] = field.value;
            });
            setEditValues(initialValues);
        }
    }, [isOpen, fields]);

    // Focus first input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            if (inputRef.current instanceof HTMLTextAreaElement || inputRef.current instanceof HTMLInputElement) {
                // Determine if we should select all (optional, maybe distracting for multiple fields)
                // inputRef.current.select();
            }
        }
    }, [isOpen]);

    // Handle keyboard shortcuts
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            onCancel();
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            onSave(editValues);
        }
    };

    const handleChange = (name: string, val: string) => {
        setEditValues(prev => ({
            ...prev,
            [name]: val
        }));
    };

    if (!isOpen) return null;

    // Calculate optimal position (try to stay in viewport)
    const editorWidth = 520;
    // Dynamic height estimate based on number of fields (approx 60px per field + header/footer)
    const editorHeight = 80 + (fields.length * 60);

    let top = position.top + position.height + 8; // Below element
    let left = position.left;

    // Adjust if would go off right edge
    if (left + editorWidth > window.innerWidth - 20) {
        left = window.innerWidth - editorWidth - 20;
    }

    // Adjust if would go off bottom edge - show above instead
    if (top + editorHeight > window.innerHeight - 20) {
        top = position.top - editorHeight - 8;
        // If that pushes it off top, just center it or pin to top
        if (top < 10) top = 10;
    }

    return (
        <>
            {/* Backdrop to catch clicks outside */}
            <div
                className="floating-editor-backdrop"
                onClick={onCancel}
            />

            {/* Floating editor container */}
            <div
                className="floating-editor"
                style={{
                    top: `${top}px`,
                    left: `${left}px`,
                    width: `${editorWidth}px`,
                }}
                onKeyDown={handleKeyDown}
            >
                {/* Arrow pointing to element - hide if pos is adjusted drastically */}
                <div
                    className="floating-editor-arrow"
                    style={{
                        left: `${Math.min(Math.max(position.left - left + position.width / 2, 16), editorWidth - 16)}px`,
                        top: top > position.top ? '-8px' : 'auto',
                        bottom: top > position.top ? 'auto' : '-8px',
                        transform: top > position.top ? 'rotate(45deg)' : 'rotate(225deg)',
                        borderRight: top > position.top ? 'none' : '1px solid var(--color-border)',
                        borderBottom: top > position.top ? 'none' : '1px solid var(--color-border)',
                        borderLeft: top > position.top ? '1px solid var(--color-border)' : 'none',
                        borderTop: top > position.top ? '1px solid var(--color-border)' : 'none',
                    }}
                />

                <div className="floating-editor-header">
                    <span>Edit Content</span>
                    <div className="floating-editor-hint">Ctrl+Enter to save</div>
                </div>

                <div className="floating-editor-fields">
                    {fields.map((field, idx) => (
                        <div key={field.name} className="field-group">
                            {field.label && (
                                <label>
                                    {field.label}
                                </label>
                            )}
                            {field.name === 'src' ? (
                                <div className="image-upload-container">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                const url = URL.createObjectURL(file);
                                                handleChange(field.name, url);
                                            }
                                        }}
                                    />
                                    <div
                                        className="upload-drop-zone"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload size={24} className="upload-icon" />
                                        <span>Click to upload image</span>
                                        <div className="current-src">
                                            Current: {editValues[field.name]?.split('/').pop() || '...'}
                                        </div>
                                    </div>
                                </div>
                            ) : field.type === 'textarea' || field.name === 'text' ? (
                                <textarea
                                    ref={idx === 0 ? inputRef as any : undefined}
                                    className="floating-editor-input"
                                    value={editValues[field.name] || ''}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    placeholder={`Enter ${field.label || 'text'}...`}
                                />
                            ) : (
                                <input
                                    ref={idx === 0 ? inputRef as any : undefined}
                                    type="text"
                                    className="floating-editor-input"
                                    value={editValues[field.name] || ''}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    placeholder={`Enter ${field.label || 'value'}...`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="floating-editor-actions">
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            className="floating-editor-btn cancel"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                        <button
                            className="floating-editor-btn save"
                            onClick={() => onSave(editValues)}
                        >
                            <Check size={14} />
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
