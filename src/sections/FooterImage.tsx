// Footer Image Section - Full-width footer banner image
// Alternative to the contacts-based footer

import React from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface FooterImageConfig {
    enabled: boolean;
    imageUrl: string;
    alt: string;
    link: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

export const defaultFooterImageConfig: FooterImageConfig = {
    enabled: false,
    imageUrl: '',
    alt: 'Footer banner',
    link: '',
};

// ═══════════════════════════════════════════════════════════════════════════════
// HTML RENDERER
// ═══════════════════════════════════════════════════════════════════════════════

export const generateFooterImageHTML = (config: FooterImageConfig): string => {
    if (!config.enabled || !config.imageUrl) return '';

    const imageElement = `
    <img src="${config.imageUrl}" alt="${config.alt}" 
         style="width: 100%; height: auto; display: block;" />
  `;

    const wrappedImage = config.link
        ? `<a href="${config.link}" style="display: block;">${imageElement}</a>`
        : imageElement;

    return `
    <!-- Footer Image Section -->
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 24px;" data-section="footerImage">
      <tr>
        <td style="padding: 0;">
          ${wrappedImage}
        </td>
      </tr>
    </table>
  `;
};

// ═══════════════════════════════════════════════════════════════════════════════
// REACT PREVIEW COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface FooterImagePreviewProps {
    config: FooterImageConfig;
}

export const FooterImagePreview: React.FC<FooterImagePreviewProps> = ({ config }) => {
    if (!config.enabled) return null;

    if (!config.imageUrl) {
        return (
            <div className="mt-4 bg-gray-100 rounded-lg p-8 text-center">
                <div className="text-gray-400 text-sm">Footer Image Placeholder</div>
                <div className="text-gray-300 text-xs mt-1">Add image URL in editor</div>
            </div>
        );
    }

    const imageElement = (
        <img
            src={config.imageUrl}
            alt={config.alt}
            className="w-full h-auto"
        />
    );

    return (
        <div className="mt-4">
            {config.link ? (
                <a href={config.link} className="block">
                    {imageElement}
                </a>
            ) : (
                imageElement
            )}
        </div>
    );
};

export default FooterImagePreview;
