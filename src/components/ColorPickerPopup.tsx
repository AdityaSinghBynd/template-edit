import { useState, useRef, useEffect } from 'react';
import { Check, Pipette } from 'lucide-react';

interface ColorPickerPopupProps {
    color: string;
    originalColor: string;
    onSave: (oldColor: string, newColor: string) => void;
    onClose: () => void;
    anchorEl: HTMLElement | null;
}

// Organized color palette by category
const COLOR_CATEGORIES = {
    'Grays': [
        '#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080',
        '#999999', '#b3b3b3', '#cccccc', '#e6e6e6', '#f5f5f5', '#ffffff'
    ],
    'Blues': [
        '#003366', '#004080', '#0052a3', '#0066cc', '#1a8cff', '#4da6ff',
        '#80bfff', '#b3d9ff', '#e6f2ff', '#338488', '#2d7a7e', '#20b2aa'
    ],
    'Greens': [
        '#003d00', '#004d00', '#006600', '#008000', '#00b300', '#00cc00',
        '#33ff33', '#66ff66', '#99ff99', '#059669', '#10b981', '#6ee7b7'
    ],
    'Reds': [
        '#4d0000', '#660000', '#800000', '#990000', '#b30000', '#cc0000',
        '#e60000', '#ff1a1a', '#ff4d4d', '#dc2626', '#ef4444', '#fca5a5'
    ],
    'Oranges & Yellows': [
        '#804000', '#995200', '#b36b00', '#cc7a00', '#e68a00', '#ff9900',
        '#ffad33', '#ffc266', '#ffd699', '#f97316', '#fbbf24', '#fde047'
    ],
    'Purples': [
        '#1a0033', '#2d004d', '#400066', '#520080', '#6600a1', '#7a00b8',
        '#8c1aff', '#a64dff', '#bf80ff', '#7c3aed', '#a78bfa', '#c4b5fd'
    ],
};

export function ColorPickerPopup({ color, originalColor, onSave, onClose, anchorEl }: ColorPickerPopupProps) {
    const [selectedColor, setSelectedColor] = useState(color);
    const [hexInput, setHexInput] = useState(color);
    const popupRef = useRef<HTMLDivElement>(null);
    const nativePickerRef = useRef<HTMLInputElement>(null);

    // Position popup below anchor
    const [position, setPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (anchorEl) {
            const rect = anchorEl.getBoundingClientRect();
            const popupWidth = 440;
            setPosition({
                top: rect.bottom + 12,
                left: Math.max(16, Math.min(rect.left - popupWidth / 2 + rect.width / 2, window.innerWidth - popupWidth - 16))
            });
        }
    }, [anchorEl]);

    // Sync hex input when color changes
    useEffect(() => {
        setHexInput(selectedColor);
    }, [selectedColor]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // Close on Escape
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    const handleHexInputChange = (value: string) => {
        setHexInput(value);
        // Validate and apply if it's a valid hex color
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            setSelectedColor(value);
        }
    };

    const handleSave = () => {
        onSave(originalColor, selectedColor);
        onClose();
    };

    return (
        <div
            ref={popupRef}
            className="color-picker-popup-v2"
            style={{ top: position.top, left: position.left }}
        >
            {/* Color Categories */}
            <div className="color-picker-categories">
                {Object.entries(COLOR_CATEGORIES).map(([category, colors]) => (
                    <div key={category} className="color-picker-category">
                        <div className="color-picker-category-label">{category}</div>
                        <div className="color-picker-category-grid">
                            {colors.map(c => (
                                <button
                                    key={c}
                                    className={`color-picker-swatch ${c.toUpperCase() === selectedColor.toUpperCase() ? 'selected' : ''}`}
                                    style={{ backgroundColor: c }}
                                    onClick={() => setSelectedColor(c.toUpperCase())}
                                    title={c}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Custom Color Section - at bottom */}
            <div className="color-picker-custom">
                <div className="color-picker-custom-label">Custom Color</div>
                <div className="color-picker-custom-row">
                    <div
                        className="color-picker-preview-swatch"
                        style={{ backgroundColor: selectedColor }}
                    />
                    <input
                        type="text"
                        className="color-picker-hex-input"
                        value={hexInput}
                        onChange={(e) => handleHexInputChange(e.target.value.toUpperCase())}
                        placeholder="#000000"
                        maxLength={7}
                    />
                    <div className="color-picker-native-wrapper">
                        <input
                            ref={nativePickerRef}
                            type="color"
                            className="color-picker-native-input"
                            value={selectedColor}
                            onChange={(e) => setSelectedColor(e.target.value.toUpperCase())}
                        />
                        <Pipette size={16} className="color-picker-native-icon" />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="color-picker-actions">
                <button className="color-picker-btn cancel" onClick={onClose}>
                    Cancel
                </button>
                <button className="color-picker-btn save" onClick={handleSave}>
                    <Check size={16} />
                    Apply Color
                </button>
            </div>
        </div>
    );
}
