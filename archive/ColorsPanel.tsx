import { Palette } from 'lucide-react';
import { useState } from 'react';
import type { ExtractedColor } from '../types';

interface ColorsPanelProps {
  colors: ExtractedColor[];
  onColorChange?: (oldColor: string, newColor: string) => void;
}

// Common email-friendly colors for the dropdown
const PRESET_COLORS = [
  '#000000', '#333333', '#555555', '#777777', '#999999', '#cccccc', '#ffffff',
  '#338488', '#328589', '#2d7a7e', '#1a5c5f', // Teal variations
  '#ff0000', '#cc0000', '#990000', // Reds
  '#00ff00', '#00cc00', '#009900', // Greens
  '#0000ff', '#0066cc', '#003399', // Blues
  '#ff6600', '#ff9900', '#ffcc00', // Oranges/Yellows
  '#660099', '#9933cc', '#cc66ff', // Purples
];

export function ColorsPanel({ colors, onColorChange }: ColorsPanelProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  if (colors.length === 0) {
    return (
      <div className="empty-state">
        <Palette size={48} />
        <p className="empty-state-title">No colors detected</p>
        <p className="empty-state-text">
          No inline color styles were found in this template.
        </p>
      </div>
    );
  }

  // Group colors by usage
  const textColors = colors.filter(c => c.usage === 'text');
  const bgColors = colors.filter(c => c.usage === 'background');
  const otherColors = colors.filter(c => c.usage !== 'text' && c.usage !== 'background');

  const handleColorSelect = (originalColor: string, newColor: string) => {
    onColorChange?.(originalColor, newColor);
    setOpenDropdown(null);
  };

  const renderColorItem = (color: ExtractedColor, originalHex: string) => (
    <div key={originalHex} className="color-item">
      {/* Color swatch with native color picker */}
      <div className="color-picker-wrapper">
        <div
          className="color-swatch clickable"
          style={{ backgroundColor: color.hex }}
          onClick={() => setOpenDropdown(openDropdown === originalHex ? null : originalHex)}
          title="Click to change color"
        />

        {/* Native color input (hidden but functional) */}
        <input
          type="color"
          className="color-input-native"
          value={color.hex}
          onChange={(e) => handleColorSelect(originalHex, e.target.value)}
          title="Use color picker"
        />
      </div>

      {/* Hex input for direct editing */}
      <input
        type="text"
        className="color-input"
        value={color.hex}
        onChange={(e) => onColorChange?.(originalHex, e.target.value)}
        placeholder="#000000"
      />

      <span className="color-count">×{color.count}</span>

      {/* Dropdown with preset colors */}
      {openDropdown === originalHex && (
        <div className="color-dropdown">
          <div className="color-dropdown-header">Quick Select</div>
          <div className="color-dropdown-grid">
            {PRESET_COLORS.map(preset => (
              <button
                key={preset}
                className={`color-dropdown-item ${preset === color.hex ? 'selected' : ''}`}
                style={{ backgroundColor: preset }}
                onClick={() => handleColorSelect(originalHex, preset)}
                title={preset}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="colors-panel">
      <div className="section-header">
        <h3 className="section-title">Template Colors</h3>
        <p className="section-description">
          Click a color swatch to change it. Changes apply when you click "Apply Changes".
        </p>
      </div>

      {textColors.length > 0 && (
        <div className="color-group">
          <h4 className="color-group-title">Text Colors</h4>
          <div className="color-list">
            {textColors.map((color) => renderColorItem(color, color.hex))}
          </div>
        </div>
      )}

      {bgColors.length > 0 && (
        <div className="color-group">
          <h4 className="color-group-title">Background Colors</h4>
          <div className="color-list">
            {bgColors.map((color) => renderColorItem(color, color.hex))}
          </div>
        </div>
      )}

      {otherColors.length > 0 && (
        <div className="color-group">
          <h4 className="color-group-title">Other Colors</h4>
          <div className="color-list">
            {otherColors.map((color) => renderColorItem(color, color.hex))}
          </div>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {openDropdown && (
        <div
          className="color-dropdown-backdrop"
          onClick={() => setOpenDropdown(null)}
        />
      )}
    </div>
  );
}
