// @ts-nocheck
import React from 'react';
import { Palette, Type, ChevronDown } from 'lucide-react';

// Email-safe fonts for universal font picker
const EMAIL_SAFE_FONTS = [
    { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
    { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
    { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
    { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
    { value: '"Trebuchet MS", Helvetica, sans-serif', label: 'Trebuchet MS' },
    { value: '"Courier New", Courier, monospace', label: 'Courier New' },
];

// Color presets for quick selection
const COLOR_PRESETS = {
    professional: { accent: '#1e40af', textPrimary: '#1a1a1a', textSecondary: '#4E5971' },
    modern: { accent: '#008689', textPrimary: '#000000', textSecondary: '#666666' },
    warm: { accent: '#dc2626', textPrimary: '#1a1a1a', textSecondary: '#6b5b4f' },
    minimal: { accent: '#000000', textPrimary: '#000000', textSecondary: '#666666' },
};

interface GlobalThemePanelProps {
    config: any;
    updateConfig: (path: string, value: any) => void;
}

export const GlobalThemePanel: React.FC<GlobalThemePanelProps> = ({ config, updateConfig }) => {
    // Get current global font (use first non-null font from config)
    const getCurrentFont = () => {
        return config.headlines?.sectionFont?.family ||
            config.entities?.sectionFont?.family ||
            'Verdana, Geneva, sans-serif';
    };

    // Apply font to ALL sections at once
    const applyGlobalFont = (fontFamily: string) => {
        // Headlines fonts
        updateConfig('headlines.sectionFont.family', fontFamily);
        updateConfig('headlines.subSectionFont.family', fontFamily);
        updateConfig('headlines.itemFont.family', fontFamily);

        // Entity fonts
        updateConfig('entities.sectionFont.family', fontFamily);
        updateConfig('entities.subSectionFont.family', fontFamily);
        updateConfig('entities.nameFont.family', fontFamily);
        updateConfig('entities.headlineFont.family', fontFamily);
        updateConfig('entities.bodyFont.family', fontFamily);

        // Other section fonts
        updateConfig('dateBar.font.family', fontFamily);
        updateConfig('greeting.font.family', fontFamily);
        updateConfig('research.font.family', fontFamily);
        updateConfig('footer.font.family', fontFamily);
        updateConfig('disclaimer.font.family', fontFamily);
    };

    const colors = config.theme?.colors || {};

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Palette size={14} className="text-white" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-800">Global Theme</span>
                </div>
            </div>

            <div className="p-4 space-y-5">
                {/* Universal Font Picker */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-[12px] font-semibold text-gray-600 uppercase tracking-wide">
                        <Type size={12} />
                        Universal Font
                    </label>
                    <div className="relative">
                        <select
                            value={getCurrentFont()}
                            onChange={(e) => applyGlobalFont(e.target.value)}
                            className="w-full text-[14px] p-3 pr-10 bg-gray-50 border border-gray-200 rounded-xl 
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white
                         appearance-none cursor-pointer transition-all"
                            style={{ fontFamily: getCurrentFont() }}
                        >
                            {EMAIL_SAFE_FONTS.map(f => (
                                <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>
                                    {f.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="text-[11px] text-gray-400">Applies to all text in the newsletter</p>
                </div>

                {/* Color Palette */}
                <div className="space-y-3">
                    <label className="flex items-center gap-2 text-[12px] font-semibold text-gray-600 uppercase tracking-wide">
                        <Palette size={12} />
                        Color Palette
                    </label>

                    {/* Accent Color */}
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[13px] text-gray-700">Accent Color</span>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={colors.accent || '#008689'}
                                    onChange={(e) => updateConfig('theme.colors.accent', e.target.value)}
                                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                                    style={{ WebkitAppearance: 'none' }}
                                />
                                <div
                                    className="absolute inset-0 rounded-lg border border-gray-200 pointer-events-none"
                                    style={{ backgroundColor: colors.accent || '#008689' }}
                                />
                            </div>
                            <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                {(colors.accent || '#008689').toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Text Primary */}
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[13px] text-gray-700">Primary Text</span>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={colors.textPrimary || '#000000'}
                                    onChange={(e) => updateConfig('theme.colors.textPrimary', e.target.value)}
                                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                                />
                                <div
                                    className="absolute inset-0 rounded-lg border border-gray-200 pointer-events-none"
                                    style={{ backgroundColor: colors.textPrimary || '#000000' }}
                                />
                            </div>
                            <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                {(colors.textPrimary || '#000000').toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Text Secondary */}
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[13px] text-gray-700">Secondary Text</span>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={colors.textSecondary || '#4E5971'}
                                    onChange={(e) => updateConfig('theme.colors.textSecondary', e.target.value)}
                                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                                />
                                <div
                                    className="absolute inset-0 rounded-lg border border-gray-200 pointer-events-none"
                                    style={{ backgroundColor: colors.textSecondary || '#4E5971' }}
                                />
                            </div>
                            <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                {(colors.textSecondary || '#4E5971').toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Background Color */}
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[13px] text-gray-700">Background</span>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={colors.dateBarFill || '#F5F5F5'}
                                    onChange={(e) => updateConfig('theme.colors.dateBarFill', e.target.value)}
                                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                                />
                                <div
                                    className="absolute inset-0 rounded-lg border border-gray-200 pointer-events-none"
                                    style={{ backgroundColor: colors.dateBarFill || '#F5F5F5' }}
                                />
                            </div>
                            <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                {(colors.dateBarFill || '#F5F5F5').toUpperCase()}
                            </span>
                        </div>
                    </div>

                    {/* Headlines Background */}
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-[13px] text-gray-700">Headlines Background</span>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={colors.headlinesBackground || '#F8F8F8'}
                                    onChange={(e) => updateConfig('theme.colors.headlinesBackground', e.target.value)}
                                    className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                                />
                                <div
                                    className="absolute inset-0 rounded-lg border border-gray-200 pointer-events-none"
                                    style={{ backgroundColor: colors.headlinesBackground || '#F8F8F8' }}
                                />
                            </div>
                            <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                                {(colors.headlinesBackground || '#F8F8F8').toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Quick Presets */}
                <div className="space-y-2">
                    <label className="text-[11px] font-medium text-gray-500">Quick Presets</label>
                    <div className="flex gap-2">
                        {Object.entries(COLOR_PRESETS).map(([name, preset]) => (
                            <button
                                key={name}
                                onClick={() => {
                                    updateConfig('theme.colors.accent', preset.accent);
                                    updateConfig('theme.colors.textPrimary', preset.textPrimary);
                                    updateConfig('theme.colors.textSecondary', preset.textSecondary);
                                }}
                                className="flex-1 py-2 px-3 rounded-lg border border-gray-200 hover:border-gray-300 
                           hover:bg-gray-50 transition-all text-[11px] font-medium text-gray-600 capitalize"
                            >
                                <div className="flex justify-center gap-1 mb-1">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.accent }} />
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.textPrimary }} />
                                </div>
                                {name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GlobalThemePanel;
