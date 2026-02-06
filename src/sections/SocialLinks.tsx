// Social Links Section - Row of social media icons
// Displays links to company social media profiles

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface SocialLink {
    platform: 'linkedin' | 'twitter' | 'facebook' | 'instagram' | 'youtube' | 'website';
    url: string;
    label: string;
}

export interface SocialLinksConfig {
    enabled: boolean;
    links: SocialLink[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export const defaultSocialLinksConfig: SocialLinksConfig = {
    enabled: false,
    links: [
        { platform: 'linkedin', url: '#', label: 'LinkedIn' },
        { platform: 'twitter', url: '#', label: 'Twitter' },
        { platform: 'website', url: '#', label: 'Website' },
    ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// PLATFORM ICONS (SVG for email compatibility)
// ═══════════════════════════════════════════════════════════════════════════════

const PLATFORM_ICONS: Record<string, { svg: string; bgColor: string }> = {
    linkedin: {
        bgColor: '#0A66C2',
        svg: `<path fill="white" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>`,
    },
    twitter: {
        bgColor: '#1DA1F2',
        svg: `<path fill="white" d="M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-2.66 0-4.81 2.16-4.81 4.81 0 .38.04.75.13 1.1-4-.2-7.58-2.11-9.96-5.02-.42.72-.66 1.56-.66 2.46 0 1.68.85 3.16 2.16 4.02-.8-.02-1.55-.24-2.2-.6v.06c0 2.35 1.67 4.31 3.88 4.76-.4.1-.83.16-1.27.16-.31 0-.62-.03-.92-.08.63 1.95 2.45 3.37 4.6 3.41-1.68 1.32-3.8 2.1-6.1 2.1-.4 0-.79-.02-1.17-.07 2.17 1.39 4.76 2.2 7.54 2.2 9.05 0 14-7.5 14-14 0-.21 0-.42-.02-.63.96-.69 1.79-1.56 2.45-2.55-.88.39-1.83.65-2.82.77z"/>`,
    },
    facebook: {
        bgColor: '#1877F2',
        svg: `<path fill="white" d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>`,
    },
    instagram: {
        bgColor: '#E4405F',
        svg: `<path fill="white" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/>`,
    },
    youtube: {
        bgColor: '#FF0000',
        svg: `<path fill="white" d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>`,
    },
    website: {
        bgColor: '#6B7280',
        svg: `<path fill="white" d="M16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2m-5.15 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 0 1-4.33 3.56M14.34 14H9.66c-.1-.66-.16-1.32-.16-2 0-.68.06-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2M12 19.96c-.83-1.2-1.5-2.53-1.91-3.96h3.82c-.41 1.43-1.08 2.76-1.91 3.96M8 8H5.08A7.923 7.923 0 0 1 9.4 4.44C8.8 5.55 8.35 6.75 8 8m-2.92 8H8c.35 1.25.8 2.45 1.4 3.56A8.008 8.008 0 0 1 5.08 16m-.82-2C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2M12 4.03c.83 1.2 1.5 2.54 1.91 3.97h-3.82c.41-1.43 1.08-2.77 1.91-3.97M18.92 8h-2.95a15.65 15.65 0 0 0-1.38-3.56c1.84.63 3.37 1.9 4.33 3.56M12 2C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"/>`,
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HTML RENDERER
// ═══════════════════════════════════════════════════════════════════════════════

export const generateSocialLinksHTML = (config: SocialLinksConfig): string => {
    if (!config.enabled || config.links.length === 0) return '';

    const linksHTML = config.links.map(link => {
        const icon = PLATFORM_ICONS[link.platform] || PLATFORM_ICONS.website;
        return `
      <td style="padding: 0 8px;">
        <a href="${link.url}" target="_blank" style="text-decoration: none;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background-color: ${icon.bgColor}; display: inline-flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              ${icon.svg}
            </svg>
          </div>
        </a>
      </td>
    `;
    }).join('');

    return `
    <!-- Social Links Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 16px 0;" data-section="socialLinks">
      <tr>
        <td align="center" style="padding: 16px 32px;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              ${linksHTML}
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

interface SocialLinksPreviewProps {
    config: SocialLinksConfig;
}

export const SocialLinksPreview: React.FC<SocialLinksPreviewProps> = ({ config }) => {
    if (!config.enabled || config.links.length === 0) return null;

    return (
        <div className="flex justify-center gap-3 py-4">
            {config.links.map((link, idx) => {
                const icon = PLATFORM_ICONS[link.platform] || PLATFORM_ICONS.website;
                return (
                    <a
                        key={idx}
                        href={link.url}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                        style={{ backgroundColor: icon.bgColor }}
                        title={link.label}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                            dangerouslySetInnerHTML={{ __html: icon.svg }} />
                    </a>
                );
            })}
        </div>
    );
};

export default SocialLinksPreview;
