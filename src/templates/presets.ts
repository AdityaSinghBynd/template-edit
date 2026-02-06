// Template Presets - 4 ready-to-use newsletter configurations
// Each template defines a complete config with sections, theme, and settings

export interface TemplatePreset {
    id: string;
    name: string;
    description: string;
    thumbnail: string; // Color for preview card
    sections: string[];
    config: any;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFESSIONAL TEMPLATE
// Navy/Gold theme, Georgia font, classic business look
// ═══════════════════════════════════════════════════════════════════════════════
export const professionalTemplate: TemplatePreset = {
    id: 'professional',
    name: 'Professional',
    description: 'Classic business newsletter with navy & gold accents',
    thumbnail: '#1E3A5F',
    sections: ['banner', 'dateBar', 'greeting', 'headlines', 'companies', 'research', 'footer', 'disclaimer'],
    config: {
        theme: {
            colors: {
                accent: '#B8860B', // Gold
                textPrimary: '#1E3A5F', // Navy
                textSecondary: '#5A6B7D',
                border: '#D4D9E0',
                dateBarFill: '#F0F3F7',
            },
        },
        banner: {
            type: 'text',
            companyName: 'Your Company',
            companyWebsite: '',
            imageUrl: '',
        },
        dateBar: {
            enabled: true,
            text: 'Friday, 16 January 2026',
            font: { family: 'Georgia, Times, serif', size: 12, color: null },
        },
        greeting: {
            enabled: true,
            showIntro: true,
            title: 'Good Morning,',
            intro: 'Here is your executive briefing for today, covering key developments across your tracked entities.',
            font: { family: 'Georgia, Times, serif', size: 15, color: null },
        },
        headlines: {
            enabled: true,
            showSectionTitle: true,
            showSubCategories: true,
            sourceMode: 'below',
            sectionTitle: 'Headlines',
            sectionFont: { family: 'Georgia, Times, serif', size: 22, color: null },
        },
        entities: {
            showLogo: true,
            showSubCategories: true,
            bulletStyle: 'bullet',
            borderStyle: 'full',
            sectionFont: { family: 'Georgia, Times, serif', size: 20, color: null },
            nameFont: { family: 'Georgia, Times, serif', size: 16, color: null },
        },
        research: {
            enabled: true,
            title: 'Research & Reports',
            subtitle: 'Latest publications',
            items: [],
        },
        footer: {
            enabled: true,
            showName: true,
            showPhone: true,
            showEmail: true,
            signoff: 'Best regards,',
            teamName: 'Your Team',
            contacts: [],
        },
        disclaimer: {
            enabled: true,
            showUnsubscribe: true,
            showPrivacy: true,
            text: 'This newsletter is for informational purposes only.',
        },
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MINIMALIST TEMPLATE
// Clean black & white, Arial font, no clutter
// ═══════════════════════════════════════════════════════════════════════════════
export const minimalistTemplate: TemplatePreset = {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean and simple with black & white design',
    thumbnail: '#000000',
    sections: ['banner', 'headlines', 'companies', 'footer', 'disclaimer'],
    config: {
        theme: {
            colors: {
                accent: '#000000',
                textPrimary: '#000000',
                textSecondary: '#666666',
                border: '#EEEEEE',
                dateBarFill: '#FAFAFA',
            },
        },
        banner: {
            type: 'text',
            companyName: 'Newsletter',
            companyWebsite: '',
            imageUrl: '',
        },
        dateBar: {
            enabled: false,
            text: '',
            font: { family: 'Helvetica, Arial, sans-serif', size: 15, color: null },
        },
        greeting: {
            enabled: false,
            showIntro: false,
            title: '',
            intro: '',
            font: { family: 'Verdana, Geneva, sans-serif', size: 15, color: null },
        },
        headlines: {
            enabled: true,
            showSectionTitle: true,
            showSubCategories: false,
            sourceMode: 'inline',
            sectionTitle: 'News',
            sectionFont: { family: 'Georgia, Times, serif', size: 20, color: null },
        },
        entities: {
            showLogo: false,
            showSubCategories: false,
            bulletStyle: 'dash',
            borderStyle: 'short',
            sectionFont: { family: 'Georgia, Times, serif', size: 18, color: null },
            nameFont: { family: 'Georgia, Times, serif', size: 15, color: null },
        },
        research: {
            enabled: false,
            title: '',
            subtitle: '',
            items: [],
        },
        footer: {
            enabled: true,
            showName: false,
            showPhone: false,
            showEmail: true,
            signoff: '',
            teamName: '',
            contacts: [],
        },
        disclaimer: {
            enabled: true,
            showUnsubscribe: true,
            showPrivacy: false,
            text: '',
        },
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// MODERN TECH TEMPLATE
// Teal/Purple gradient feel, modern sans-serif
// ═══════════════════════════════════════════════════════════════════════════════
export const modernTechTemplate: TemplatePreset = {
    id: 'modernTech',
    name: 'Modern Tech',
    description: 'Contemporary design with teal & purple accents',
    thumbnail: '#0D9488',
    sections: ['banner', 'dateBar', 'greeting', 'headlines', 'companies', 'topics', 'socialLinks', 'footer', 'disclaimer'],
    config: {
        theme: {
            colors: {
                accent: '#0D9488', // Teal
                textPrimary: '#1F2937',
                textSecondary: '#6B7280',
                border: '#E5E7EB',
                dateBarFill: '#F0FDFA',
            },
        },
        banner: {
            type: 'image',
            companyName: 'TechBrief',
            companyWebsite: '',
            imageUrl: '',
        },
        dateBar: {
            enabled: true,
            text: 'Friday, 16 January 2026',
            font: { family: 'Helvetica, Arial, sans-serif', size: 15, color: null },
        },
        greeting: {
            enabled: true,
            showIntro: true,
            title: 'Hey there 👋',
            intro: 'Here\'s what\'s happening in tech today.',
            font: { family: 'Verdana, Geneva, sans-serif', size: 15, color: null },
        },
        headlines: {
            enabled: true,
            showSectionTitle: true,
            showSubCategories: true,
            sourceMode: 'below',
            sectionTitle: '🔥 Top Stories',
            sectionFont: { family: 'Georgia, Times, serif', size: 22, color: null },
        },
        entities: {
            showLogo: true,
            showSubCategories: true,
            bulletStyle: 'arrow',
            borderStyle: 'short',
            sectionFont: { family: 'Georgia, Times, serif', size: 20, color: null },
            nameFont: { family: 'Georgia, Times, serif', size: 16, color: null },
        },
        socialLinks: {
            enabled: true,
            links: [
                { platform: 'linkedin', url: '#', label: 'LinkedIn' },
                { platform: 'twitter', url: '#', label: 'Twitter' },
            ],
        },
        footer: {
            enabled: true,
            showName: true,
            showPhone: false,
            showEmail: true,
            signoff: 'Stay curious!',
            teamName: 'The Tech Team',
            contacts: [],
        },
        disclaimer: {
            enabled: true,
            showUnsubscribe: true,
            showPrivacy: true,
            text: 'Curated by AI, reviewed by humans.',
        },
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// FINANCIAL BRIEF TEMPLATE
// Blue/Gray, Times font, data-focused
// ═══════════════════════════════════════════════════════════════════════════════
export const financialBriefTemplate: TemplatePreset = {
    id: 'financialBrief',
    name: 'Financial Brief',
    description: 'Data-focused design for financial updates',
    thumbnail: '#1E40AF',
    sections: ['banner', 'dateBar', 'headlines', 'statsBlock', 'companies', 'research', 'footerImage', 'disclaimer'],
    config: {
        theme: {
            colors: {
                accent: '#1E40AF', // Blue
                textPrimary: '#111827',
                textSecondary: '#4B5563',
                border: '#D1D5DB',
                dateBarFill: '#EFF6FF',
            },
        },
        banner: {
            type: 'image',
            companyName: 'Financial Daily',
            companyWebsite: '',
            imageUrl: '',
        },
        dateBar: {
            enabled: true,
            text: 'Friday, 16 January 2026',
            font: { family: '"Times New Roman", Times, serif', size: 12, color: null },
        },
        greeting: {
            enabled: false,
            showIntro: false,
            title: '',
            intro: '',
        },
        headlines: {
            enabled: true,
            showSectionTitle: true,
            showSubCategories: true,
            sourceMode: 'below',
            sectionTitle: 'Market Headlines',
            sectionFont: { family: '"Times New Roman", Times, serif', size: 22, color: null },
        },
        statsBlock: {
            enabled: true,
            title: 'Market Snapshot',
            stats: [
                { label: 'S&P 500', value: '+0.8%', color: '#10B981' },
                { label: 'NASDAQ', value: '+1.2%', color: '#10B981' },
                { label: '10Y Treasury', value: '4.25%', color: '#6B7280' },
            ],
        },
        entities: {
            showLogo: true,
            showSubCategories: true,
            bulletStyle: 'bullet',
            borderStyle: 'full',
            sectionFont: { family: '"Times New Roman", Times, serif', size: 20, color: null },
            nameFont: { family: '"Times New Roman", Times, serif', size: 16, color: null },
        },
        research: {
            enabled: true,
            title: 'Research Notes',
            subtitle: 'Analyst reports',
            items: [],
        },
        footerImage: {
            enabled: true,
            imageUrl: '',
            alt: 'Footer banner',
            link: '',
        },
        disclaimer: {
            enabled: true,
            showUnsubscribe: true,
            showPrivacy: true,
            text: 'This is not investment advice. Past performance is not indicative of future results.',
        },
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// ALL TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════════
export const ALL_TEMPLATES: TemplatePreset[] = [
    professionalTemplate,
    minimalistTemplate,
    modernTechTemplate,
    financialBriefTemplate,
];

export const getTemplateById = (id: string): TemplatePreset | undefined => {
    return ALL_TEMPLATES.find(t => t.id === id);
};

export default ALL_TEMPLATES;
