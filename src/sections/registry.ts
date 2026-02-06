// Section Registry - Central configuration for all newsletter sections
// This file defines all available sections, their metadata, and default configs

import {
    Image, Calendar, MessageSquare, List, Users, FileText, Mail, AlertCircle,
    BarChart3, Share2, Star
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export type SectionId =
    | 'banner'
    | 'dateBar'
    | 'greeting'
    | 'headlines'
    | 'companies'
    | 'people'
    | 'topics'
    | 'featuredArticle'
    | 'statsBlock'
    | 'research'
    | 'socialLinks'
    | 'footer'
    | 'footerImage'
    | 'disclaimer';

export interface SectionConfig {
    id: SectionId;
    title: string;
    description: string;
    icon: any;
    color: string;
    duplicatable: boolean;
    required: boolean;
    defaultEnabled: boolean;
    category: 'header' | 'content' | 'footer';
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

export const SECTION_REGISTRY: Record<SectionId, SectionConfig> = {
    // HEADER SECTIONS
    banner: {
        id: 'banner',
        title: 'Header / Banner',
        description: 'Full-width banner image or text logo',
        icon: Image,
        color: '#3B82F6',
        duplicatable: false,
        required: false,
        defaultEnabled: true,
        category: 'header',
    },
    dateBar: {
        id: 'dateBar',
        title: 'Date Bar',
        description: 'Date display strip with background',
        icon: Calendar,
        color: '#10B981',
        duplicatable: false,
        required: false,
        defaultEnabled: true,
        category: 'header',
    },
    greeting: {
        id: 'greeting',
        title: 'Greeting',
        description: '"Good Morning" + optional intro paragraph',
        icon: MessageSquare,
        color: '#F59E0B',
        duplicatable: false,
        required: false,
        defaultEnabled: true,
        category: 'header',
    },

    // CONTENT SECTIONS
    headlines: {
        id: 'headlines',
        title: 'Headlines',
        description: 'Compact list of titles + sources',
        icon: List,
        color: '#8B5CF6',
        duplicatable: true,
        required: false,
        defaultEnabled: true,
        category: 'content',
    },
    companies: {
        id: 'companies',
        title: 'Companies',
        description: 'Detailed company articles with logos',
        icon: Users,
        color: '#EC4899',
        duplicatable: true,
        required: true,  // Core section
        defaultEnabled: true,
        category: 'content',
    },
    people: {
        id: 'people',
        title: 'People',
        description: 'People news articles',
        icon: Users,
        color: '#06B6D4',
        duplicatable: true,
        required: true,  // Core section
        defaultEnabled: true,
        category: 'content',
    },
    topics: {
        id: 'topics',
        title: 'Topics',
        description: 'Topic/theme articles',
        icon: FileText,
        color: '#6366F1',
        duplicatable: true,
        required: true,  // Core section
        defaultEnabled: true,
        category: 'content',
    },
    featuredArticle: {
        id: 'featuredArticle',
        title: 'Featured Article',
        description: 'Single highlighted article with image',
        icon: Star,
        color: '#F97316',
        duplicatable: false,
        required: false,
        defaultEnabled: false,
        category: 'content',
    },
    statsBlock: {
        id: 'statsBlock',
        title: 'Stats Block',
        description: 'Key numbers/metrics display',
        icon: BarChart3,
        color: '#14B8A6',
        duplicatable: true,
        required: false,
        defaultEnabled: false,
        category: 'content',
    },
    research: {
        id: 'research',
        title: 'Research',
        description: 'Report/whitepaper links',
        icon: FileText,
        color: '#14B8A6',
        duplicatable: false,
        required: false,
        defaultEnabled: true,
        category: 'content',
    },

    // FOOTER SECTIONS
    socialLinks: {
        id: 'socialLinks',
        title: 'Social Links',
        description: 'Social media icons row',
        icon: Share2,
        color: '#8B5CF6',
        duplicatable: false,
        required: false,
        defaultEnabled: false,
        category: 'footer',
    },
    footer: {
        id: 'footer',
        title: 'Footer (Contacts)',
        description: 'Sign-off + team contact cards',
        icon: Mail,
        color: '#F97316',
        duplicatable: false,
        required: false,
        defaultEnabled: true,
        category: 'footer',
    },
    footerImage: {
        id: 'footerImage',
        title: 'Footer Image',
        description: 'Full-width footer banner',
        icon: Image,
        color: '#64748B',
        duplicatable: false,
        required: false,
        defaultEnabled: false,
        category: 'footer',
    },
    disclaimer: {
        id: 'disclaimer',
        title: 'Disclaimer',
        description: 'Legal text + unsubscribe',
        icon: AlertCircle,
        color: '#EF4444',
        duplicatable: false,
        required: true,
        defaultEnabled: true,
        category: 'footer',
    },
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const getSectionsByCategory = (category: 'header' | 'content' | 'footer') => {
    return Object.values(SECTION_REGISTRY).filter(s => s.category === category);
};

export const getDuplicatableSections = () => {
    return Object.values(SECTION_REGISTRY).filter(s => s.duplicatable);
};

export const getRequiredSections = () => {
    return Object.values(SECTION_REGISTRY).filter(s => s.required);
};

export const getSectionConfig = (id: SectionId): SectionConfig | undefined => {
    return SECTION_REGISTRY[id];
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT SECTION DATA
// ═══════════════════════════════════════════════════════════════════════════════

export const DEFAULT_SECTION_DATA = {
    featuredArticle: {
        enabled: false,
        title: 'Featured Story',
        headline: 'Major Development in Industry',
        summary: 'A brief summary of the featured article that captures the key points...',
        imageUrl: '',
        articleUrl: '#',
        source: 'Source Name',
    },
    statsBlock: {
        enabled: false,
        title: 'Key Metrics',
        stats: [
            { label: 'Revenue Growth', value: '+15%', color: '#10B981' },
            { label: 'Market Cap', value: '$2.5B', color: '#3B82F6' },
            { label: 'YoY Change', value: '+8.2%', color: '#F59E0B' },
        ],
    },
    socialLinks: {
        enabled: false,
        links: [
            { platform: 'linkedin', url: '#', label: 'LinkedIn' },
            { platform: 'twitter', url: '#', label: 'Twitter' },
            { platform: 'website', url: '#', label: 'Website' },
        ],
    },
    footerImage: {
        enabled: false,
        imageUrl: '',
        alt: 'Footer banner',
        link: '',
    },
};

export default SECTION_REGISTRY;
