import { useEffect } from 'react';
import { X, Check } from 'lucide-react';
import App from '../App';

interface TemplateEditorModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Callback when modal is closed */
    onClose: () => void;
    /** Optional: Initial HTML to load (if any) - reserved for future use */
    initialHTML?: string;
    /** Optional: Callback when HTML is saved - reserved for future use */
    onSave?: (html: string) => void;
}

/**
 * Modal wrapper for the HTML Template Editor.
 * 
 * Use this component to embed the editor in a larger webapp.
 * Opens a 90% viewport modal with the full editor experience.
 * 
 * @example
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * 
 * <button onClick={() => setIsOpen(true)}>Edit Template</button>
 * 
 * <TemplateEditorModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSave={(html) => console.log('Saved:', html)}
 * />
 * ```
 */
export function TemplateEditorModal({
    isOpen,
    onClose,
    initialHTML: _initialHTML,
    onSave
}: TemplateEditorModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const handleSave = () => {
        // TODO: Get HTML from App component when onSave integration is ready
        if (onSave) {
            onSave(''); // Placeholder - would pass actual HTML
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="template-editor-modal-overlay">
            <div className="template-editor-modal">
                {/* Modal Header */}
                <div className="template-editor-modal-header">
                    <h2>Edit Newsletter Template</h2>
                    <button
                        className="template-editor-modal-close"
                        onClick={onClose}
                        title="Close (Escape)"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Editor Content */}
                <div className="template-editor-modal-content">
                    <App />
                </div>

                {/* Modal Footer */}
                <div className="template-editor-modal-footer">
                    <button
                        className="template-editor-modal-btn cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="template-editor-modal-btn save"
                        onClick={handleSave}
                    >
                        <Check size={16} />
                        Save Template
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TemplateEditorModal;

