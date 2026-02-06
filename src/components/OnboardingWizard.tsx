// Onboarding Wizard - Two-path entry flow for the Newsletter Template Builder
// Path A: Start from Scratch (pick sections → brand setup → launch)
// Path B: Choose Template (pick template → quick brand override → launch)

import React, { useState } from 'react';
import {
    FileText, Layout, ArrowRight, ArrowLeft, Check,
    Sparkles, Image, Calendar, MessageSquare, List, Users, Mail,
    AlertCircle, Star, BarChart3, Share2
} from 'lucide-react';
import { ALL_TEMPLATES, TemplatePreset } from '../templates/presets';
import { SECTION_REGISTRY } from '../sections/registry';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type WizardPath = 'scratch' | 'template';
type WizardStep = 'choose-path' | 'select-sections' | 'select-template' | 'brand-setup' | 'complete';

interface OnboardingWizardProps {
    onComplete: (config: any, selectedSections: string[]) => void;
    onSkip?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION ICON MAP
// ═══════════════════════════════════════════════════════════════════════════════

const SECTION_ICONS: Record<string, any> = {
    banner: Image,
    dateBar: Calendar,
    greeting: MessageSquare,
    headlines: List,
    companies: Users,
    people: Users,
    topics: FileText,
    featuredArticle: Star,
    statsBlock: BarChart3,
    research: FileText,
    socialLinks: Share2,
    footer: Mail,
    footerImage: Image,
    disclaimer: AlertCircle,
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onSkip }) => {
    const [currentStep, setCurrentStep] = useState<WizardStep>('choose-path');
    const [selectedPath, setSelectedPath] = useState<WizardPath | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<TemplatePreset | null>(null);
    const [selectedSections, setSelectedSections] = useState<string[]>([
        'banner', 'dateBar', 'greeting', 'headlines', 'companies', 'footer', 'disclaimer'
    ]);
    const [brandConfig, setBrandConfig] = useState({
        logoUrl: '',
        accentColor: '#008689',
        companyName: 'Your Company',
        companyWebsite: '',
        bannerUrl: '', // Generated banner image URL (base64)
    });

    // Brand generation state (moved to component level for React hooks rules)
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStatus, setGenerationStatus] = useState<string>(''); // AI progress trace
    const [bannerVariants, setBannerVariants] = useState<{ light: string | null, dark: string | null }>({ light: null, dark: null });
    const [selectedBanner, setSelectedBanner] = useState<'light' | 'dark' | null>(null);
    const [bannerError, setBannerError] = useState<string | null>(null); // Visible banner error
    const [extractedColors, setExtractedColors] = useState<string[]>([]);
    const [brandError, setBrandError] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Navigation
    const goNext = () => {
        if (currentStep === 'choose-path') {
            setCurrentStep(selectedPath === 'scratch' ? 'select-sections' : 'select-template');
        } else if (currentStep === 'select-sections' || currentStep === 'select-template') {
            setCurrentStep('brand-setup');
        } else if (currentStep === 'brand-setup') {
            handleComplete();
        }
    };

    const goBack = () => {
        if (currentStep === 'select-sections' || currentStep === 'select-template') {
            setCurrentStep('choose-path');
        } else if (currentStep === 'brand-setup') {
            setCurrentStep(selectedPath === 'scratch' ? 'select-sections' : 'select-template');
        }
    };

    // Helper to convert hex color to RGBA with opacity
    const hexToRgba = (hex: string, opacity: number): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return hex;
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    // Helper to derive a harmonious border color from accent
    // Keeps same hue, desaturates significantly, and makes very light
    const deriveAccentBorderColor = (hex: string): string => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (!result) return '#E5E5E5';
        const r = parseInt(result[1], 16) / 255;
        const g = parseInt(result[2], 16) / 255;
        const b = parseInt(result[3], 16) / 255;

        // Convert RGB to HSL
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0;
        // We only need hue for border color derivation

        if (max !== min) {
            const d = max - min;
            // We only need hue, not original saturation (we'll use 25%)
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }

        // Create border color: same hue, low saturation (25%), high lightness (88%)
        const newS = 0.25;  // Desaturated for subtlety
        const newL = 0.88;  // Very light for elegant border

        // Convert HSL back to RGB
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = newL < 0.5 ? newL * (1 + newS) : newL + newS - newL * newS;
        const p = 2 * newL - q;
        const newR = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
        const newG = Math.round(hue2rgb(p, q, h) * 255);
        const newB = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    };

    const handleComplete = () => {
        let finalConfig: any;
        let finalSections: string[];

        if (selectedPath === 'template' && selectedTemplate) {
            // Apply template config with brand overrides
            finalConfig = {
                ...selectedTemplate.config,
                theme: {
                    ...selectedTemplate.config.theme,
                    colors: {
                        ...selectedTemplate.config.theme.colors,
                        accent: brandConfig.accentColor,
                        border: deriveAccentBorderColor(brandConfig.accentColor),
                        dateBarFill: hexToRgba(brandConfig.accentColor, 0.05), // 5% opacity of accent
                    },
                },
                banner: {
                    ...selectedTemplate.config.banner,
                    imageUrl: brandConfig.bannerUrl || brandConfig.logoUrl || selectedTemplate.config.banner.imageUrl,
                    companyName: brandConfig.companyName,
                },
            };
            finalSections = selectedTemplate.sections;
        } else {
            // Build from scratch with selected sections
            // Set enabled flags based on user's section selections
            finalConfig = {
                theme: {
                    colors: {
                        accent: brandConfig.accentColor,
                        textPrimary: '#000000',
                        textSecondary: '#4E5971',
                        border: deriveAccentBorderColor(brandConfig.accentColor),
                        dateBarFill: hexToRgba(brandConfig.accentColor, 0.05), // 5% opacity of accent
                    },
                },
                banner: {
                    type: (brandConfig.bannerUrl || brandConfig.logoUrl) ? 'image' : 'text',
                    imageUrl: brandConfig.bannerUrl || brandConfig.logoUrl,
                    companyName: brandConfig.companyName,
                },
                // Section enabled flags based on selection
                dateBar: { enabled: selectedSections.includes('dateBar') },
                greeting: { enabled: selectedSections.includes('greeting') },
                headlines: { enabled: selectedSections.includes('headlines') },
                research: { enabled: selectedSections.includes('research') },
                footer: { enabled: selectedSections.includes('footer') },
                disclaimer: { enabled: selectedSections.includes('disclaimer') },
                featuredArticle: { enabled: selectedSections.includes('featuredArticle') },
                statsBlock: { enabled: selectedSections.includes('statsBlock') },
                socialLinks: { enabled: selectedSections.includes('socialLinks') },
                footerImage: { enabled: selectedSections.includes('footerImage') },
            };
            finalSections = selectedSections;
        }

        onComplete(finalConfig, finalSections);
    };

    const toggleSection = (sectionId: string) => {
        // Disclaimer is required
        if (sectionId === 'disclaimer') return;

        setSelectedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(s => s !== sectionId)
                : [...prev, sectionId]
        );
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // RENDER STEPS
    // ═══════════════════════════════════════════════════════════════════════════════

    const renderChoosePath = () => (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Newsletter Builder</h1>
                <p className="text-gray-500">How would you like to get started?</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Start from Scratch */}
                <button
                    onClick={() => { setSelectedPath('scratch'); setCurrentStep('select-sections'); }}
                    className={`p-8 rounded-2xl border-2 text-left transition-all hover:shadow-lg
            ${selectedPath === 'scratch'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center mb-4">
                        <FileText className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Start from Scratch</h3>
                    <p className="text-gray-500 text-sm">
                        Pick the sections you need, then customize your brand colors and fonts.
                    </p>
                </button>

                {/* Use a Template */}
                <button
                    onClick={() => { setSelectedPath('template'); setCurrentStep('select-template'); }}
                    className={`p-8 rounded-2xl border-2 text-left transition-all hover:shadow-lg
            ${selectedPath === 'template'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-4">
                        <Sparkles className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Use a Template</h3>
                    <p className="text-gray-500 text-sm">
                        Choose from 4 professionally designed templates and customize to fit your brand.
                    </p>
                </button>
            </div>

            {onSkip && (
                <div className="text-center">
                    <button onClick={onSkip} className="text-gray-400 hover:text-gray-600 text-sm">
                        Skip onboarding and use defaults
                    </button>
                </div>
            )}
        </div>
    );

    const renderSelectSections = () => {
        const sections = Object.values(SECTION_REGISTRY);
        const headerSections = sections.filter(s => s.category === 'header');
        const contentSections = sections.filter(s => s.category === 'content');
        const footerSections = sections.filter(s => s.category === 'footer');

        const renderSectionGroup = (title: string, items: typeof sections) => (
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</h4>
                <div className="grid grid-cols-2 gap-3">
                    {items.map(section => {
                        const Icon = SECTION_ICONS[section.id] || FileText;
                        const isSelected = selectedSections.includes(section.id);
                        const isRequired = section.required;

                        return (
                            <button
                                key={section.id}
                                onClick={() => toggleSection(section.id)}
                                disabled={isRequired}
                                className={`p-4 rounded-xl border-2 text-left transition-all flex items-start gap-3
                  ${isSelected
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300 bg-white'}
                  ${isRequired ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: `${section.color}20` }}
                                >
                                    <Icon size={18} style={{ color: section.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-gray-900">{section.title}</span>
                                        {isRequired && (
                                            <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">Required</span>
                                        )}
                                        {section.duplicatable && (
                                            <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">Multi</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5 truncate">{section.description}</p>
                                </div>
                                {isSelected && (
                                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                        <Check size={12} className="text-white" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        );

        return (
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose Your Sections</h2>
                    <p className="text-gray-500">Select which sections to include in your newsletter</p>
                </div>

                <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
                    {renderSectionGroup('Header', headerSections)}
                    {renderSectionGroup('Content', contentSections)}
                    {renderSectionGroup('Footer', footerSections)}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <button onClick={goBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <div className="text-sm text-gray-500">
                        {selectedSections.length} sections selected
                    </div>
                    <button
                        onClick={goNext}
                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium"
                    >
                        Continue <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        );
    };

    const renderSelectTemplate = () => (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Choose a Template</h2>
                <p className="text-gray-500">Pick a design that matches your brand</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {ALL_TEMPLATES.map(template => (
                    <button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`p-6 rounded-2xl border-2 text-left transition-all hover:shadow-lg
              ${selectedTemplate?.id === template.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                    >
                        {/* Color Preview Bar */}
                        <div
                            className="w-full h-20 rounded-xl mb-4 flex items-center justify-center"
                            style={{ backgroundColor: template.thumbnail }}
                        >
                            <Layout className="text-white/80" size={32} />
                        </div>

                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                                <p className="text-gray-500 text-sm mt-1">{template.description}</p>
                                <p className="text-xs text-gray-400 mt-2">{template.sections.length} sections</p>
                            </div>
                            {selectedTemplate?.id === template.id && (
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                    <Check size={14} className="text-white" />
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
                <button onClick={goBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                    <ArrowLeft size={16} /> Back
                </button>
                <button
                    onClick={goNext}
                    disabled={!selectedTemplate}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue <ArrowRight size={16} />
                </button>
            </div>
        </div>
    );

    const renderBrandSetup = () => {
        const GEMINI_API_KEY = 'AIzaSyCa8eEjR3FExmFgzQETD96S7JrXnD789eQ';

        const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const dataUrl = event.target?.result as string;
                // Store logo for color extraction - DON'T use as banner
                setBrandConfig(prev => ({ ...prev, logoUrl: dataUrl }));
            };
            reader.readAsDataURL(file);
        };

        // Helper to convert URL to Base64 (for pasted URLs)
        const getBase64FromUrl = async (url: string): Promise<string> => {
            if (url.startsWith('data:')) return url;
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (e) {
                console.warn('Failed to fetch logo URL:', e);
                return '';
            }
        };

        const generateBrandAssets = async () => {
            if (!brandConfig.companyName) {
                setBrandError('Please provide a company name');
                return;
            }

            setIsGenerating(true);
            setBrandError(null);
            setGenerationStatus('Preparing assets...');

            // Clean logo URL for API usage
            let logoBase64 = null;
            if (brandConfig.logoUrl) {
                setGenerationStatus('Processing logo image...');
                try {
                    const fullBase64 = await getBase64FromUrl(brandConfig.logoUrl);
                    if (fullBase64 && fullBase64.includes(',')) {
                        logoBase64 = fullBase64.split(',')[1];
                    }
                } catch (e) {
                    console.warn('Failed to process logo for generation:', e);
                }
            }

            try {
                // Step 1: Generate banner image using Gemini 2.0 Flash (Multimodal)
                setGenerationStatus('🎨 Generating professional banner...');
                try {
                    // Simple, creative prompt - trust the model's intelligence
                    const createBannerPrompt = (variant: 'light' | 'dark') => `Create an email newsletter header banner for "${brandConfig.companyName}".

STYLE:
- ${variant === 'light'
                            ? 'LIGHT MODE: Warm cream/off-white background with subtle gradient. Use DARK text. Add soft decorative elements (geometric shapes, brand-colored accents) on the right side.'
                            : 'DARK MODE: Rich dark brand color background (NOT pure black) with subtle depth. WHITE/light text. Can have subtle gradient or glow effects.'}
- HIGH CONTRAST between text and background is mandatory
- Show ONLY: the logo + the text "${brandConfig.companyName}". Nothing else. No URLs!

SIZE GUIDELINES (STRICT):
- Logo: SMALL/MICRO sized, ONLY 10-15% of banner height. DO NOT MAKE IT HUGE.
- Company name: Small, elegant, and proportional to the logo.
- MAXIMIZE WHITESPACE. The content should feel "small" in a vast space.

LAYOUT (CRITICAL):
- This will be cropped to 800×150 pixels (thin horizontal strip)
- STRICT LEFT ALIGNMENT: Place logo on the FAR LEFT, company name next to it.
- DO NOT CENTER. Content must be on the LEFT.
- Leave TOP and BOTTOM areas as plain background (will be cropped away)
- Subtle decorative elements can go on the FAR RIGHT side

${logoBase64 ? 'IMPORTANT: Use the EXACT provided logo image, unmodified.' : ''}

Output: Professional email banner with "${brandConfig.companyName}" logo and name, elegantly composed.`;

                    // Load example banners for few-shot learning
                    const loadExampleImage = async (url: string): Promise<string | null> => {
                        try {
                            const response = await fetch(url);
                            const blob = await response.blob();
                            return new Promise((resolve) => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    const base64 = (reader.result as string).split(',')[1];
                                    resolve(base64);
                                };
                                reader.readAsDataURL(blob);
                            });
                        } catch {
                            return null;
                        }
                    };

                    // Helper to generate a single banner
                    const generateBanner = async (variant: 'light' | 'dark'): Promise<string | null> => {
                        const prompt = createBannerPrompt(variant);
                        const parts: any[] = [{ text: prompt }];

                        // Add example banners for few-shot learning
                        try {
                            const [exampleInvestec, exampleHdfc] = await Promise.all([
                                loadExampleImage('/src/assets/examples/example_banner_investec.png'),
                                loadExampleImage('/src/assets/examples/example_banner_hdfc.png')
                            ]);

                            if (exampleInvestec) {
                                parts.push({ text: "Example 1 (Investec - clean, professional):" });
                                parts.push({ inlineData: { mimeType: "image/png", data: exampleInvestec } });
                            }
                            if (exampleHdfc) {
                                parts.push({ text: "Example 2 (HDFC Bank - brand pattern):" });
                                parts.push({ inlineData: { mimeType: "image/png", data: exampleHdfc } });
                            }
                        } catch (e) {
                            console.log('Could not load example images, continuing without them');
                        }

                        // Add the company logo if provided
                        if (logoBase64) {
                            parts.push({ text: "Company logo to use:" });
                            parts.push({
                                inlineData: {
                                    mimeType: "image/png",
                                    data: logoBase64
                                }
                            });
                        }

                        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{ parts }],
                                generationConfig: {
                                    imageConfig: {
                                        aspectRatio: "16:9"  // Wide banner format
                                    }
                                }
                            })
                        });

                        if (response.ok) {
                            const data = await response.json();
                            const imagePart = data.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
                            if (imagePart?.inlineData?.data) {
                                const rawImage = `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
                                // Crop to remove any shadows/margins and ensure correct aspect ratio
                                return await cropBannerToRatio(rawImage);
                            }
                        }
                        return null;
                    };

                    // Smart crop - finds content and crops around it
                    const cropBannerToRatio = (imageDataUrl: string): Promise<string> => {
                        return new Promise((resolve) => {
                            const img = document.createElement('img') as HTMLImageElement;
                            img.onload = () => {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d')!;

                                // Target: 800x150 for email headers
                                const targetWidth = 800;
                                const targetHeight = 150;
                                canvas.width = targetWidth;
                                canvas.height = targetHeight;

                                // Analyze image to find content boundaries
                                const analyzeCanvas = document.createElement('canvas');
                                const analyzeCtx = analyzeCanvas.getContext('2d')!;
                                analyzeCanvas.width = img.width;
                                analyzeCanvas.height = img.height;
                                analyzeCtx.drawImage(img, 0, 0);

                                // Detect background color from corners (average of 4 corners)
                                const getCornerColor = (x: number, y: number, size: number = 10) => {
                                    const data = analyzeCtx.getImageData(x, y, size, size).data;
                                    let r = 0, g = 0, b = 0, count = 0;
                                    for (let i = 0; i < data.length; i += 4) {
                                        r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
                                    }
                                    return { r: r / count, g: g / count, b: b / count };
                                };

                                const corners = [
                                    getCornerColor(0, 0),
                                    getCornerColor(img.width - 10, 0),
                                    getCornerColor(0, img.height - 10),
                                    getCornerColor(img.width - 10, img.height - 10)
                                ];
                                const bgColor = {
                                    r: corners.reduce((s, c) => s + c.r, 0) / 4,
                                    g: corners.reduce((s, c) => s + c.g, 0) / 4,
                                    b: corners.reduce((s, c) => s + c.b, 0) / 4
                                };

                                // Find content boundaries by scanning for non-background pixels
                                const isBackground = (r: number, g: number, b: number, threshold: number = 30) => {
                                    return Math.abs(r - bgColor.r) < threshold &&
                                        Math.abs(g - bgColor.g) < threshold &&
                                        Math.abs(b - bgColor.b) < threshold;
                                };

                                // Scan rows to find content top and bottom
                                const findVerticalBounds = () => {
                                    let top = 0, bottom = img.height;
                                    const sampleWidth = Math.min(img.width, 200);

                                    // Find top boundary
                                    for (let y = 0; y < img.height; y++) {
                                        const data = analyzeCtx.getImageData(0, y, sampleWidth, 1).data;
                                        let hasContent = false;
                                        for (let i = 0; i < data.length; i += 16) {
                                            if (!isBackground(data[i], data[i + 1], data[i + 2])) {
                                                hasContent = true; break;
                                            }
                                        }
                                        if (hasContent) { top = y; break; }
                                    }

                                    // Find bottom boundary
                                    for (let y = img.height - 1; y >= 0; y--) {
                                        const data = analyzeCtx.getImageData(0, y, sampleWidth, 1).data;
                                        let hasContent = false;
                                        for (let i = 0; i < data.length; i += 16) {
                                            if (!isBackground(data[i], data[i + 1], data[i + 2])) {
                                                hasContent = true; break;
                                            }
                                        }
                                        if (hasContent) { bottom = y; break; }
                                    }

                                    return { top, bottom };
                                };

                                const bounds = findVerticalBounds();
                                const contentHeight = bounds.bottom - bounds.top;

                                // Calculate crop area centered on content
                                const targetRatio = targetWidth / targetHeight;
                                const contentCenterY = bounds.top + contentHeight / 2;

                                // Determine source height based on target ratio
                                let sh = img.width / targetRatio;
                                let sy = Math.max(0, Math.min(contentCenterY - sh / 2, img.height - sh));

                                // Ensure we include all content
                                if (sy > bounds.top) sy = Math.max(0, bounds.top - 10);
                                if (sy + sh < bounds.bottom) sh = Math.min(img.height - sy, bounds.bottom - sy + 10);

                                // Recalculate width to maintain ratio
                                let sw = sh * targetRatio;
                                let sx = 0; // Start from left to preserve logo

                                if (sw > img.width) {
                                    sw = img.width;
                                    sh = sw / targetRatio;
                                    sy = Math.max(0, contentCenterY - sh / 2);
                                }

                                ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
                                resolve(canvas.toDataURL('image/png'));
                            };
                            img.onerror = () => resolve(imageDataUrl);
                            img.src = imageDataUrl;
                        });
                    };

                    // Generate both variants
                    setGenerationStatus('🎨 Generating light variant...');
                    const lightBanner = await generateBanner('light');

                    setGenerationStatus('🌙 Generating dark variant...');
                    const darkBanner = await generateBanner('dark');

                    if (lightBanner || darkBanner) {
                        setBannerVariants({ light: lightBanner, dark: darkBanner });
                        setSelectedBanner(lightBanner ? 'light' : 'dark');
                        console.log('Banners generated:', { light: !!lightBanner, dark: !!darkBanner });
                    } else {
                        setBannerError('Could not generate banner variants');
                    }
                } catch (imgErr: any) {
                    const errMsg = `Banner error: ${imgErr?.message || imgErr}`;
                    console.error(errMsg);
                    setBannerError(errMsg);
                    setGenerationStatus('Banner skipped, extracting colors...');
                }

                // Step 2: Extract colors using ColorThief, then confirm accent with Gemini
                setGenerationStatus('🔍 Extracting colors from logo...');

                // Helper to extract colors from image using ColorThief
                const extractColorsFromImage = async (imageUrl: string): Promise<string[]> => {
                    return new Promise((resolve) => {
                        const img = document.createElement('img') as HTMLImageElement;
                        img.crossOrigin = 'Anonymous';
                        img.onload = async () => {
                            try {
                                // Dynamic import of ColorThief
                                const ColorThief = (await import('colorthief')).default;
                                const colorThief = new ColorThief();

                                // Get dominant color and palette
                                const palette = colorThief.getPalette(img, 6); // Get 6 colors

                                // Convert RGB to hex and filter out white/near-white
                                const hexColors = palette
                                    .map((rgb: number[]) => {
                                        const hex = '#' + rgb.map(v => v.toString(16).padStart(2, '0')).join('');
                                        return hex.toUpperCase();
                                    })
                                    .filter((hex: string) => {
                                        // Filter out white and very light colors
                                        const r = parseInt(hex.slice(1, 3), 16);
                                        const g = parseInt(hex.slice(3, 5), 16);
                                        const b = parseInt(hex.slice(5, 7), 16);
                                        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
                                        return brightness < 240; // Exclude very light colors
                                    });

                                resolve(hexColors);
                            } catch (e) {
                                console.error('ColorThief error:', e);
                                resolve([]);
                            }
                        };
                        img.onerror = () => resolve([]);
                        img.src = imageUrl;
                    });
                };

                let extractedHexColors: string[] = [];

                // Try to extract colors from logo if available
                if (brandConfig.logoUrl) {
                    extractedHexColors = await extractColorsFromImage(brandConfig.logoUrl);
                    console.log('ColorThief extracted colors:', extractedHexColors);
                }

                // Now ask Gemini to confirm the accent color from extracted colors
                setGenerationStatus('🎨 Confirming accent color...');
                const colorPrompt = extractedHexColors.length > 0
                    ? `I have extracted these colors from a company logo: ${extractedHexColors.join(', ')}.
                    
Company: "${brandConfig.companyName}"${brandConfig.companyWebsite ? ` (${brandConfig.companyWebsite})` : ''}

Which of these colors should be the PRIMARY ACCENT color for this brand?
- Pick the most vibrant, recognizable brand color
- White, black, and very light colors should NOT be the accent
- The accent should be the most distinctive brand color

Respond in JSON only: {"colors": ${JSON.stringify(extractedHexColors)}, "accentColor": "#primaryHex"}`
                    : `Suggest professional brand colors for a company named "${brandConfig.companyName}"${brandConfig.companyWebsite ? ` with website ${brandConfig.companyWebsite}` : ''}. IMPORTANT: White and near-white colors are NEVER valid accent colors - choose a vibrant, visible color. Respond in JSON only: {"colors": ["#hex1", "#hex2", ...], "accentColor": "#primaryHex"}`;

                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: colorPrompt }] }]
                    })
                });

                const data = await response.json();
                console.log('Gemini color response:', data);

                if (data.error) {
                    setBrandError(`API Error: ${data.error.message}`);
                    return;
                }

                const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

                // Parse JSON from response
                setGenerationStatus('✅ Finalizing brand assets...');
                const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    if (parsed.accentColor) {
                        setBrandConfig(prev => ({ ...prev, accentColor: parsed.accentColor }));
                        // Use extracted colors if available, otherwise use Gemini's suggestion
                        setExtractedColors(extractedHexColors.length > 0 ? extractedHexColors : (parsed.colors || []));
                        setGenerationStatus('');  // Clear status on success
                    }
                } else if (extractedHexColors.length > 0) {
                    // Fallback: if Gemini fails but we have extracted colors, use the first non-white one
                    setBrandConfig(prev => ({ ...prev, accentColor: extractedHexColors[0] }));
                    setExtractedColors(extractedHexColors);
                    setGenerationStatus('');
                } else {
                    setBrandError('Could not parse colors from response');
                }

            } catch (err) {
                console.error('Brand generation error:', err);
                setBrandError('Failed to generate. Please try again.');
            } finally {
                setIsGenerating(false);
                setGenerationStatus('');
            }
        };

        const canProceed = brandConfig.companyName && (brandConfig.logoUrl || brandConfig.accentColor);

        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Set Up Your Brand</h2>
                    <p className="text-gray-500">Enter your company details and we'll generate your brand assets</p>
                </div>

                <div className="space-y-5 max-w-md">
                    {/* Company Name */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Company Name</label>
                        <input
                            type="text"
                            value={brandConfig.companyName}
                            onChange={(e) => setBrandConfig({ ...brandConfig, companyName: e.target.value })}
                            placeholder="Your Company"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Company Website */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Company Website</label>
                        <input
                            type="text"
                            value={brandConfig.companyWebsite}
                            onChange={(e) => setBrandConfig({ ...brandConfig, companyWebsite: e.target.value })}
                            placeholder="https://yourcompany.com"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Logo URL */}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700">Company Logo URL</label>
                        <input
                            type="text"
                            value={brandConfig.logoUrl.startsWith('data:') ? '' : brandConfig.logoUrl}
                            onChange={(e) => setBrandConfig({ ...brandConfig, logoUrl: e.target.value })}
                            placeholder="https://yourcompany.com/logo.png"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <div className="text-center text-xs text-gray-400 py-1">or</div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-purple-400 hover:text-purple-600 transition-colors"
                        >
                            📁 Upload Logo File
                        </button>
                        <p className="text-xs text-gray-400">We'll extract brand colors from your logo</p>
                    </div>


                    {/* Logo Indicator - just shows that logo is uploaded */}
                    {brandConfig.logoUrl && !bannerVariants.light && !bannerVariants.dark && !extractedColors.length && (
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg text-sm text-green-700">
                            <span>✓</span>
                            <span>Logo uploaded</span>
                        </div>
                    )}

                    {/* Generate Button */}
                    {(brandConfig.logoUrl || brandConfig.companyName) && (
                        <button
                            onClick={generateBrandAssets}
                            disabled={isGenerating}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Generate Banner & Brand Colors
                                </>
                            )}
                        </button>
                    )}

                    {/* AI Progress Trace */}
                    {isGenerating && generationStatus && (
                        <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                            <div className="flex items-center gap-2 text-sm text-purple-700">
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                                {generationStatus}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {brandError && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-xl">
                            {brandError}
                        </div>
                    )}

                    {/* ═══ GENERATION RESULTS ═══ */}
                    {((bannerVariants.light || bannerVariants.dark) || extractedColors.length > 0) && (
                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                ✨ Generation Results
                                <span className="text-[10px] text-gray-400 ml-auto">
                                    {(bannerVariants.light || bannerVariants.dark) ? '🖼️' : '❌'}
                                </span>
                            </h4>

                            {/* Banner Error */}
                            {bannerError && !bannerVariants.light && !bannerVariants.dark && (
                                <div className="p-2 bg-amber-50 text-amber-700 text-xs rounded-lg border border-amber-200">
                                    ⚠️ {bannerError}
                                </div>
                            )}

                            {/* Banner Variants - Light & Dark */}
                            {(bannerVariants.light || bannerVariants.dark) && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Choose Banner</label>
                                        <span className="text-[10px] text-gray-400">Click to select</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Light Variant */}
                                        {bannerVariants.light && (
                                            <button
                                                onClick={() => setSelectedBanner('light')}
                                                className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedBanner === 'light' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <img src={bannerVariants.light} alt="Light variant" className="w-full h-auto" />
                                                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-white/90 rounded text-[10px] font-medium">☀️ Light</div>
                                                {selectedBanner === 'light' && <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>}
                                            </button>
                                        )}

                                        {/* Dark Variant */}
                                        {bannerVariants.dark && (
                                            <button
                                                onClick={() => setSelectedBanner('dark')}
                                                className={`relative rounded-xl overflow-hidden border-2 transition-all ${selectedBanner === 'dark' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}
                                            >
                                                <img src={bannerVariants.dark} alt="Dark variant" className="w-full h-auto" />
                                                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-white rounded text-[10px] font-medium">🌙 Dark</div>
                                                {selectedBanner === 'dark' && <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>}
                                            </button>
                                        )}
                                    </div>

                                    {/* Apply selected banner to template */}
                                    {selectedBanner && bannerVariants[selectedBanner] && (
                                        <button
                                            onClick={() => {
                                                // Store the selected banner URL in brandConfig
                                                // This will be used when handleFinish is called
                                                setBrandConfig(prev => ({
                                                    ...prev,
                                                    bannerUrl: bannerVariants[selectedBanner]!
                                                }));
                                            }}
                                            className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${brandConfig.bannerUrl === bannerVariants[selectedBanner]
                                                ? 'bg-green-600 text-white'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                        >
                                            {brandConfig.bannerUrl === bannerVariants[selectedBanner]
                                                ? '✓ Banner Applied!'
                                                : `✓ Apply ${selectedBanner === 'light' ? 'Light' : 'Dark'} Banner`}
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Extracted Colors */}
                            {extractedColors.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Brand Colors</label>
                                    <div className="flex gap-2">
                                        {extractedColors.map((color, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setBrandConfig({ ...brandConfig, accentColor: color })}
                                                className={`w-12 h-12 rounded-xl transition-all hover:scale-105 ${brandConfig.accentColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : 'ring-1 ring-gray-200'}`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        Accent: <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">{brandConfig.accentColor}</span>
                                        <span className="text-green-600 ml-2">✓ Click to change</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                    <button onClick={goBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                        <ArrowLeft size={16} /> Back
                    </button>
                    <button
                        onClick={goNext}
                        disabled={!canProceed}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Launch Editor <Sparkles size={16} />
                    </button>
                </div>
            </div>
        );
    };

    // ═══════════════════════════════════════════════════════════════════════════════
    // MAIN RENDER
    // ═══════════════════════════════════════════════════════════════════════════════

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
            <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10">
                {/* Progress Indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {['choose-path', selectedPath === 'scratch' ? 'select-sections' : 'select-template', 'brand-setup'].map((step, idx) => (
                        <React.Fragment key={step}>
                            <div
                                className={`w-3 h-3 rounded-full transition-colors ${currentStep === step
                                    ? 'bg-blue-600'
                                    : idx < ['choose-path', selectedPath === 'scratch' ? 'select-sections' : 'select-template', 'brand-setup'].indexOf(currentStep)
                                        ? 'bg-blue-400'
                                        : 'bg-gray-300'
                                    }`}
                            />
                            {idx < 2 && <div className="w-16 h-0.5 bg-gray-200" />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step Content */}
                {currentStep === 'choose-path' && renderChoosePath()}
                {currentStep === 'select-sections' && renderSelectSections()}
                {currentStep === 'select-template' && renderSelectTemplate()}
                {currentStep === 'brand-setup' && renderBrandSetup()}
            </div>
        </div>
    );
};

export default OnboardingWizard;
