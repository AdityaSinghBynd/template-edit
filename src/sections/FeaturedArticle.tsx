// Featured Article Section - Highlights a single important article with image
// Used for featured/breaking news stories

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface FeaturedArticleConfig {
    enabled: boolean;
    title: string;
    headline: string;
    summary: string;
    imageUrl: string;
    articleUrl: string;
    source: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export const defaultFeaturedArticleConfig: FeaturedArticleConfig = {
    enabled: false,
    title: 'Featured Story',
    headline: 'Major Development in Industry',
    summary: 'A brief summary of the featured article that captures the key points and gives readers a preview of the full story.',
    imageUrl: '',
    articleUrl: '#',
    source: 'Source Name',
};

// ═══════════════════════════════════════════════════════════════════════════════
// HTML RENDERER
// ═══════════════════════════════════════════════════════════════════════════════

export const generateFeaturedArticleHTML = (config: FeaturedArticleConfig, accentColor: string = '#008689'): string => {
    if (!config.enabled) return '';

    const imageSection = config.imageUrl ? `
    <td style="width: 200px; padding-right: 20px; vertical-align: top;">
      <a href="${config.articleUrl}" style="display: block;">
        <img src="${config.imageUrl}" alt="${config.headline}" 
             style="width: 200px; height: 130px; object-fit: cover; border-radius: 8px;" />
      </a>
    </td>
  ` : '';

    return `
    <!-- Featured Article Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;" data-section="featuredArticle">
      <tr>
        <td style="padding: 0 32px;">
          ${config.title ? `
            <div style="font-size: 16px; font-weight: 600; color: #1F2937; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid ${accentColor};">
              ${config.title}
            </div>
          ` : ''}
          <table width="100%" cellpadding="0" cellspacing="0" border="0" 
                 style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; border-left: 4px solid ${accentColor};">
            <tr>
              <td style="padding: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    ${imageSection}
                    <td style="vertical-align: top;">
                      <a href="${config.articleUrl}" style="text-decoration: none;">
                        <div style="font-size: 18px; font-weight: 700; color: #1F2937; line-height: 1.4; margin-bottom: 8px;">
                          ${config.headline}
                        </div>
                      </a>
                      <div style="font-size: 14px; color: #4B5563; line-height: 1.6; margin-bottom: 12px;">
                        ${config.summary}
                      </div>
                      <div style="font-size: 12px; color: ${accentColor};">
                        ${config.source}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

// ═══════════════════════════════════════════════════════════════════════════════
// REACT PREVIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface FeaturedArticlePreviewProps {
    config: FeaturedArticleConfig;
    accentColor?: string;
}

export const FeaturedArticlePreview: React.FC<FeaturedArticlePreviewProps> = ({
    config,
    accentColor = '#008689'
}) => {
    if (!config.enabled) return null;

    return (
        <div className="p-4">
            {config.title && (
                <div className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b-2" style={{ borderColor: accentColor }}>
                    {config.title}
                </div>
            )}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5"
                style={{ borderLeft: `4px solid ${accentColor}` }}>
                <div className="flex gap-4">
                    {config.imageUrl && (
                        <div className="flex-shrink-0">
                            <img
                                src={config.imageUrl}
                                alt={config.headline}
                                className="w-48 h-32 object-cover rounded-lg"
                            />
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{config.headline}</h3>
                        <p className="text-sm text-gray-600 mb-3">{config.summary}</p>
                        <span className="text-xs" style={{ color: accentColor }}>{config.source}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeaturedArticlePreview;
