// Stats Block Section - Displays key metrics/numbers
// Used for showing financial stats, growth metrics, etc.

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface Stat {
    label: string;
    value: string;
    color: string;
}

export interface StatsBlockConfig {
    enabled: boolean;
    title: string;
    stats: Stat[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export const defaultStatsBlockConfig: StatsBlockConfig = {
    enabled: false,
    title: 'Key Metrics',
    stats: [
        { label: 'Revenue Growth', value: '+15%', color: '#10B981' },
        { label: 'Market Cap', value: '$2.5B', color: '#3B82F6' },
        { label: 'YoY Change', value: '+8.2%', color: '#F59E0B' },
    ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// HTML RENDERER
// ═══════════════════════════════════════════════════════════════════════════════

export const generateStatsBlockHTML = (config: StatsBlockConfig, accentColor: string = '#008689'): string => {
    if (!config.enabled) return '';

    const statsHTML = config.stats.map(stat => `
    <td style="width: 33.33%; padding: 16px; text-align: center; vertical-align: top;">
      <div style="font-size: 28px; font-weight: 700; color: ${stat.color}; margin-bottom: 4px;">
        ${stat.value}
      </div>
      <div style="font-size: 12px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.05em;">
        ${stat.label}
      </div>
    </td>
  `).join('');

    return `
    <!-- Stats Block Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;" data-section="statsBlock">
      <tr>
        <td style="padding: 0 32px;">
          ${config.title ? `
            <div style="font-size: 16px; font-weight: 600; color: #1F2937; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid ${accentColor};">
              ${config.title}
            </div>
          ` : ''}
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: #F9FAFB; border-radius: 8px;">
            <tr>
              ${statsHTML}
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

// ═══════════════════════════════════════════════════════════════════════════════
// REACT PREVIEW COMPONENT (for editor)
// ═══════════════════════════════════════════════════════════════════════════════

interface StatsBlockPreviewProps {
    config: StatsBlockConfig;
}

export const StatsBlockPreview: React.FC<StatsBlockPreviewProps> = ({ config }) => {
    if (!config.enabled) return null;

    return (
        <div className="p-4 bg-gray-50 rounded-lg">
            {config.title && (
                <div className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b-2 border-teal-500">
                    {config.title}
                </div>
            )}
            <div className="grid grid-cols-3 gap-4">
                {config.stats.map((stat, idx) => (
                    <div key={idx} className="text-center">
                        <div className="text-2xl font-bold" style={{ color: stat.color }}>
                            {stat.value}
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatsBlockPreview;
