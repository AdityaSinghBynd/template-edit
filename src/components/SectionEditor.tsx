// @ts-nocheck
import React from 'react';
import { X, Image, Calendar, MessageSquare, List, Users, FileText, Mail, AlertCircle, Plus, Trash2, ChevronDown, BarChart3, Share2, Star, Bold, Italic, Underline, Type } from 'lucide-react';

// Email-safe fonts
const EMAIL_SAFE_FONTS = [
    { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
    { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
    { value: 'Georgia, Times, serif', label: 'Georgia' },
    { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
    { value: 'Helvetica, Arial, sans-serif', label: 'Verdana' },
    { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
    { value: '"Trebuchet MS", Helvetica, sans-serif', label: 'Trebuchet MS' },
    { value: '"Courier New", Courier, monospace', label: 'Courier New' },
];

// Section metadata for display
const SECTION_META = {
    banner: { title: 'Header / Banner', icon: Image, color: '#3B82F6' },
    dateBar: { title: 'Date Bar', icon: Calendar, color: '#10B981' },
    greeting: { title: 'Greeting', icon: MessageSquare, color: '#F59E0B' },
    headlines: { title: 'Headlines Section', icon: List, color: '#8B5CF6' },
    companies: { title: 'Companies', icon: Users, color: '#EC4899' },
    people: { title: 'People', icon: Users, color: '#06B6D4' },
    topics: { title: 'Topics', icon: FileText, color: '#6366F1' },
    featuredArticle: { title: 'Featured Article', icon: Star, color: '#F97316' },
    statsBlock: { title: 'Stats Block', icon: BarChart3, color: '#14B8A6' },
    research: { title: 'Research', icon: FileText, color: '#14B8A6' },
    socialLinks: { title: 'Social Links', icon: Share2, color: '#8B5CF6' },
    footer: { title: 'Footer', icon: Mail, color: '#F97316' },
    footerImage: { title: 'Footer Image', icon: Image, color: '#64748B' },
    disclaimer: { title: 'Disclaimer', icon: AlertCircle, color: '#EF4444' },
};

// Reusable Components
const Toggle = ({ label, checked, onChange }) => (
    <label className="flex items-center justify-between cursor-pointer py-2">
        <span className="text-[13px] text-gray-700">{label}</span>
        <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-blue-500' : 'bg-gray-300'}`}>
            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : ''}`} />
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only" />
        </div>
    </label>
);

const TextInput = ({ label, value, onChange, placeholder = '', multiline = false }) => (
    <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-gray-500">{label}</label>
        {multiline ? (
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full text-[14px] p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all resize-none"
            />
        ) : (
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full text-[14px] p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all"
            />
        )}
    </div>
);

const FontPicker = ({ label, fontConfig, onChange }) => (
    <div className="space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-[12px] font-semibold text-gray-600">{label}</p>
        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
                <label className="text-[10px] font-medium text-gray-400 uppercase">Font</label>
                <select
                    value={fontConfig.family}
                    onChange={(e) => onChange({ ...fontConfig, family: e.target.value })}
                    className="w-full text-[13px] p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                    {EMAIL_SAFE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-[10px] font-medium text-gray-400 uppercase">Size</label>
                <div className="flex items-center gap-1">
                    <input
                        type="number"
                        value={fontConfig.size}
                        onChange={(e) => onChange({ ...fontConfig, size: parseInt(e.target.value) || 12 })}
                        min={8}
                        max={32}
                        className="w-full text-[13px] p-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-[11px] text-gray-400">px</span>
                </div>
            </div>
        </div>

        {/* Style Toggles */}
        <div className="flex items-center gap-1.5 pt-1">
            <button
                onClick={() => onChange({ ...fontConfig, bold: !fontConfig.bold })}
                className={`p-1.5 rounded hover:bg-white hover:shadow-sm transition-all ${fontConfig.bold ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-400'}`}
                title="Bold"
            >
                <Bold size={14} />
            </button>
            <button
                onClick={() => onChange({ ...fontConfig, italic: !fontConfig.italic })}
                className={`p-1.5 rounded hover:bg-white hover:shadow-sm transition-all ${fontConfig.italic ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-400'}`}
                title="Italic"
            >
                <Italic size={14} />
            </button>
            <button
                onClick={() => onChange({ ...fontConfig, underline: !fontConfig.underline })}
                className={`p-1.5 rounded hover:bg-white hover:shadow-sm transition-all ${fontConfig.underline ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-400'}`}
                title="Underline"
            >
                <Underline size={14} />
            </button>
            <button
                onClick={() => onChange({ ...fontConfig, uppercase: !fontConfig.uppercase })}
                className={`p-1.5 rounded hover:bg-white hover:shadow-sm transition-all ${fontConfig.uppercase ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' : 'text-gray-400'}`}
                title="Uppercase"
            >
                <Type size={14} />
            </button>
        </div>
    </div>
);

const SelectInput = ({ label, value, onChange, options }) => (
    <div className="space-y-1.5">
        <label className="text-[12px] font-medium text-gray-500">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-[14px] p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white appearance-none cursor-pointer"
        >
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

// Section-Specific Editors
const BannerEditor = ({ config, updateConfig }) => {
    const [isGenerating, setIsGenerating] = React.useState(false);
    const [generatedBanner, setGeneratedBanner] = React.useState<string | null>(null);
    const [extractedColors, setExtractedColors] = React.useState<string[]>([]);
    const [error, setError] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const logoFileInputRef = React.useRef<HTMLInputElement>(null);

    const GEMINI_API_KEY = 'AIzaSyCa8eEjR3FExmFgzQETD96S7JrXnD789eQ';

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            updateConfig('banner.imageUrl', dataUrl);
            updateConfig('banner.type', 'image');
        };
        reader.readAsDataURL(file);
    };

    // Separate handler for logo upload in Generate mode
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            updateConfig('banner.logoUrl', dataUrl);
        };
        reader.readAsDataURL(file);
    };

    // Helper to convert URL/File to Base64 for Gemini
    const getBase64FromUrl = async (url: string): Promise<string> => {
        if (url.startsWith('data:')) return url;
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const generateBanner = async () => {
        if (!config.banner.companyName) {
            setError('Please provide a company name');
            return;
        }

        setIsGenerating(true);
        setError(null);

        // Clean logo URL for API usage
        let logoBase64 = null;
        if (config.banner.logoUrl) {
            try {
                const fullBase64 = await getBase64FromUrl(config.banner.logoUrl);
                // Extract just the base64 data part
                logoBase64 = fullBase64.split(',')[1];
            } catch (e) {
                console.warn('Failed to process logo for generation:', e);
            }
        }

        try {
            // Step 1: Generate banner image using Gemini 2.0 Flash (Multimodal)
            try {
                const imagePrompt = `Create a professional email newsletter header banner for "${config.banner.companyName}". 
Dimensions: 800x150 pixels.
${config.banner.companyWebsite ? `Website: ${config.banner.companyWebsite}` : ''}
Style: Corporate, professional, minimalist. 
${logoBase64 ? 'IMPORTANT: Incorporate the visual style, colors, and font aesthetics of the provided logo, but do NOT just copy the logo. Create a cohesive header design.' : ''}`;

                const parts: any[] = [{ text: imagePrompt }];
                if (logoBase64) {
                    parts.push({
                        inlineData: {
                            mimeType: "image/png",
                            data: logoBase64
                        }
                    });
                }

                const imageResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts }],
                        generationConfig: { responseModalities: ["image", "text"] }
                    })
                });

                if (imageResponse.ok) {
                    const imageData = await imageResponse.json();
                    const imagePart = imageData.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
                    if (imagePart?.inlineData?.data) {
                        const base64Image = `data:${imagePart.inlineData.mimeType || 'image/png'};base64,${imagePart.inlineData.data}`;
                        setGeneratedBanner(base64Image);
                    }
                } else {
                    console.warn('Image generation failed/rate-limited, skipping to colors');
                }
            } catch (imgErr) {
                console.warn('Image generation error:', imgErr);
            }

            // Step 2: Extract colors from logo/website (Flexible) - never return white as accent
            const colorPrompt = config.banner.logoUrl
                ? `Analyze this logo and extract the main brand colors (palette). IMPORTANT: White (#ffffff) and near-white colors are NEVER valid accent colors - pick a vibrant color. Logo: ${config.banner.logoUrl}. Return JSON only: {"colors": ["#hex1", "#hex2", ...], "accentColor": "#primaryHex"}`
                : `Suggest professional brand colors for "${config.banner.companyName}"${config.banner.companyWebsite ? ` (${config.banner.companyWebsite})` : ''}. IMPORTANT: White (#ffffff) and near-white colors are NEVER valid accent colors - pick a vibrant color. Return JSON only: {"colors": ["#hex1", "#hex2", ...], "accentColor": "#primaryHex"}`;

            const colorResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: colorPrompt }] }] })
            });

            const colorData = await colorResponse.json();
            const textResponse = colorData.candidates?.[0]?.content?.parts?.[0]?.text || '';
            const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (parsed.accentColor) {
                    updateConfig('theme.colors.accent', parsed.accentColor);
                    setExtractedColors(parsed.colors || []);
                }
            }

        } catch (err) {
            console.error('Banner generation error:', err);
            setError('Failed to generate. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadBanner = () => {
        if (!generatedBanner) return;
        const link = document.createElement('a');
        link.href = generatedBanner;
        link.download = `${config.banner.companyName || 'banner'}_header.png`;
        link.click();
    };

    return (
        <div className="space-y-4">
            <SelectInput
                label="Header Type"
                value={config.banner.type}
                onChange={(v) => updateConfig('banner.type', v)}
                options={[
                    { value: 'image', label: 'Image Banner' },
                    { value: 'text', label: 'Text Logo' },
                    { value: 'generate', label: 'Generate with AI' },
                ]}
            />

            {config.banner.type === 'image' && (
                <div className="space-y-3">
                    <TextInput
                        label="Banner Image URL"
                        value={config.banner.imageUrl}
                        onChange={(v) => updateConfig('banner.imageUrl', v)}
                        placeholder="https://..."
                    />
                    <div className="text-center text-xs text-gray-400">or</div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                    >
                        📁 Upload Image File
                    </button>
                </div>
            )}

            {config.banner.type === 'text' && (
                <>
                    <TextInput
                        label="Company Name"
                        value={config.banner.companyName}
                        onChange={(v) => updateConfig('banner.companyName', v)}
                    />
                    <TextInput
                        label="Company Website"
                        value={config.banner.companyWebsite}
                        onChange={(v) => updateConfig('banner.companyWebsite', v)}
                        placeholder="https://..."
                    />
                </>
            )}

            {config.banner.type === 'generate' && (
                <div className="space-y-4">
                    <TextInput
                        label="Company Name"
                        value={config.banner.companyName}
                        onChange={(v) => updateConfig('banner.companyName', v)}
                        placeholder="Your Company Inc."
                    />
                    <TextInput
                        label="Company Website"
                        value={config.banner.companyWebsite}
                        onChange={(v) => updateConfig('banner.companyWebsite', v)}
                        placeholder="https://yourcompany.com"
                    />
                    <TextInput
                        label="Logo URL (optional)"
                        value={config.banner.logoUrl?.startsWith('data:') ? '' : (config.banner.logoUrl || '')}
                        onChange={(v) => updateConfig('banner.logoUrl', v)}
                        placeholder="https://yourcompany.com/logo.png"
                    />

                    {/* Logo File Upload */}
                    <input ref={logoFileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    <button
                        onClick={() => logoFileInputRef.current?.click()}
                        className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-purple-400 hover:text-purple-600"
                    >
                        📁 Upload Logo File
                    </button>
                    {config.banner.logoUrl && (
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg text-sm text-green-700">
                            ✓ Logo uploaded
                        </div>
                    )}

                    {/* Generate Button */}
                    <button
                        onClick={generateBanner}
                        disabled={isGenerating || !config.banner.companyName}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating Banner...</>
                        ) : (
                            <>✨ Generate Banner & Extract Colors</>
                        )}
                    </button>

                    {error && <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg">{error}</div>}

                    {/* Extracted Colors */}
                    {extractedColors.length > 0 && (
                        <div className="space-y-2 p-3 bg-gray-50 rounded-xl">
                            <label className="text-xs font-medium text-gray-600">Extracted Brand Colors</label>
                            <div className="flex gap-2">
                                {extractedColors.map((color, idx) => (
                                    <button key={idx} onClick={() => updateConfig('theme.colors.accent', color)}
                                        className="w-10 h-10 rounded-lg border-2 border-white shadow-md hover:scale-110 transition-transform"
                                        style={{ backgroundColor: color }} title={`Use ${color}`} />
                                ))}
                            </div>
                            <p className="text-xs text-green-600">✓ Accent color applied</p>
                        </div>
                    )}

                    {/* Generated Banner */}
                    {generatedBanner && (
                        <div className="space-y-2 p-3 bg-gray-50 rounded-xl">
                            <label className="text-xs font-medium text-gray-600">Generated Banner</label>
                            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                                <img src={generatedBanner} alt="Generated banner" className="w-full h-auto" />
                            </div>
                            <button onClick={downloadBanner}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                                ⬇️ Download PNG
                            </button>
                            <p className="text-xs text-gray-500 text-center">Download → Upload to your CDN → Paste URL below:</p>
                            <TextInput label="" value={config.banner.imageUrl} onChange={(v) => { updateConfig('banner.imageUrl', v); updateConfig('banner.type', 'image'); }}
                                placeholder="Paste your uploaded image URL here..." />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const DateBarEditor = ({ config, updateConfig }) => (
    <div className="space-y-4">
        <Toggle
            label="Show Date Bar"
            checked={config.dateBar.enabled}
            onChange={(v) => updateConfig('dateBar.enabled', v)}
        />
        {config.dateBar.enabled && (
            <>
                <TextInput
                    label="Date Text"
                    value={config.dateBar.text}
                    onChange={(v) => updateConfig('dateBar.text', v)}
                />
                <FontPicker
                    label="Date Font"
                    fontConfig={config.dateBar.font}
                    onChange={(v) => updateConfig('dateBar.font', v)}
                />
            </>
        )}
    </div>
);

const GreetingEditor = ({ config, updateConfig }) => (
    <div className="space-y-4">
        <Toggle
            label="Show Greeting"
            checked={config.greeting.enabled}
            onChange={(v) => updateConfig('greeting.enabled', v)}
        />
        {config.greeting.enabled && (
            <>
                <TextInput
                    label="Greeting Title"
                    value={config.greeting.title}
                    onChange={(v) => updateConfig('greeting.title', v)}
                />
                <Toggle
                    label="Show Introduction"
                    checked={config.greeting.showIntro}
                    onChange={(v) => updateConfig('greeting.showIntro', v)}
                />
                {config.greeting.showIntro && (
                    <TextInput
                        label="Introduction Text"
                        value={config.greeting.intro}
                        onChange={(v) => updateConfig('greeting.intro', v)}
                        multiline
                    />
                )}
                <FontPicker
                    label="Greeting Font"
                    fontConfig={config.greeting.font}
                    onChange={(v) => updateConfig('greeting.font', v)}
                />
            </>
        )}
    </div>
);

const HeadlinesEditor = ({ config, updateConfig }) => (
    <div className="space-y-4">
        <Toggle
            label="Show Headlines Section"
            checked={config.headlines.enabled}
            onChange={(v) => updateConfig('headlines.enabled', v)}
        />
        {config.headlines.enabled && (
            <>
                <Toggle
                    label="Show Section Title"
                    checked={config.headlines.showSectionTitle}
                    onChange={(v) => updateConfig('headlines.showSectionTitle', v)}
                />
                {config.headlines.showSectionTitle && (
                    <TextInput
                        label="Section Title"
                        value={config.headlines.sectionTitle}
                        onChange={(v) => updateConfig('headlines.sectionTitle', v)}
                    />
                )}
                <Toggle
                    label="Show Category Titles"
                    checked={config.headlines.showCategories}
                    onChange={(v) => updateConfig('headlines.showCategories', v)}
                />
                <Toggle
                    label="Show Sub-Categories"
                    checked={config.headlines.showSubCategories}
                    onChange={(v) => updateConfig('headlines.showSubCategories', v)}
                />
                <Toggle
                    label="Show Images"
                    checked={config.headlines.showImage}
                    onChange={(v) => updateConfig('headlines.showImage', v)}
                />
                <SelectInput
                    label="Quote Source"
                    value={config.headlines.sourceMode}
                    onChange={(v) => updateConfig('headlines.sourceMode', v)}
                    options={[
                        { value: 'below', label: 'Below headline' },
                        { value: 'inline', label: 'Inline with headline' },
                        { value: 'none', label: 'Hide sources' },
                    ]}
                />
                <TextInput
                    label="Companies Label"
                    value={config.headlines.companiesTitle}
                    onChange={(v) => updateConfig('headlines.companiesTitle', v)}
                />
                <TextInput
                    label="Topics Label"
                    value={config.headlines.topicsTitle}
                    onChange={(v) => updateConfig('headlines.topicsTitle', v)}
                />
                <FontPicker
                    label="Section Title Font"
                    fontConfig={config.headlines.sectionFont}
                    onChange={(v) => updateConfig('headlines.sectionFont', v)}
                />
                <FontPicker
                    label="Item Font"
                    fontConfig={config.headlines.itemFont}
                    onChange={(v) => updateConfig('headlines.itemFont', v)}
                />
            </>
        )}
    </div>
);

const EntitiesEditor = ({ config, updateConfig, title = 'Companies' }) => (
    <div className="space-y-4">
        <Toggle
            label="Show Entity Logos"
            checked={config.entities?.showLogo ?? true}
            onChange={(v) => updateConfig('entities.showLogo', v)}
        />
        <Toggle
            label="Show Sub-Categories"
            checked={config.entities?.showSubCategories ?? true}
            onChange={(v) => updateConfig('entities.showSubCategories', v)}
        />
        <SelectInput
            label="Bullet Style"
            value={config.entities?.bulletStyle ?? 'bullet'}
            onChange={(v) => updateConfig('entities.bulletStyle', v)}
            options={[
                { value: 'bullet', label: '• Bullet' },
                { value: 'arrow', label: '→ Arrow' },
                { value: 'dash', label: '– Dash' },
                { value: 'square', label: '■ Square' },
            ]}
        />
        <SelectInput
            label="Section Border"
            value={config.entities?.borderStyle ?? 'full'}
            onChange={(v) => updateConfig('entities.borderStyle', v)}
            options={[
                { value: 'full', label: 'Full width' },
                { value: 'short', label: 'Inline accent' },
                { value: 'fixed', label: 'Fixed width (40px)' },
            ]}
        />
        <FontPicker
            label="Section Title Font"
            fontConfig={config.entities?.sectionFont ?? { family: 'Georgia, Times, serif', size: 21, color: null }}
            onChange={(v) => updateConfig('entities.sectionFont', v)}
        />
        <FontPicker
            label="Entity Name Font"
            fontConfig={config.entities?.nameFont ?? { family: 'Georgia, Times, serif', size: 17, color: null }}
            onChange={(v) => updateConfig('entities.nameFont', v)}
        />
        <FontPicker
            label="Headline Font"
            fontConfig={config.entities?.headlineFont ?? { family: 'Helvetica, Arial, sans-serif', size: 15, color: null }}
            onChange={(v) => updateConfig('entities.headlineFont', v)}
        />
        <FontPicker
            label="Body Font"
            fontConfig={config.entities?.bodyFont ?? { family: 'Helvetica, Arial, sans-serif', size: 14, color: null }}
            onChange={(v) => updateConfig('entities.bodyFont', v)}
        />
    </div>
);

const ResearchEditor = ({ config, updateConfig }) => (
    <div className="space-y-4">
        <Toggle
            label="Show Research Section"
            checked={config.research.enabled}
            onChange={(v) => updateConfig('research.enabled', v)}
        />
        {config.research.enabled && (
            <>
                <TextInput
                    label="Section Title"
                    value={config.research.title}
                    onChange={(v) => updateConfig('research.title', v)}
                />
                <TextInput
                    label="Subtitle"
                    value={config.research.subtitle}
                    onChange={(v) => updateConfig('research.subtitle', v)}
                />
                <div className="space-y-2">
                    <label className="text-[12px] font-medium text-gray-500">Research Items</label>
                    {config.research.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                            <input
                                type="text"
                                value={item.title}
                                onChange={(e) => {
                                    const items = [...config.research.items];
                                    items[idx] = { ...items[idx], title: e.target.value };
                                    updateConfig('research.items', items);
                                }}
                                placeholder="Title"
                                className="flex-1 text-[13px] p-2 bg-gray-50 border border-gray-200 rounded-lg"
                            />
                            <button
                                onClick={() => {
                                    const items = config.research.items.filter((_, i) => i !== idx);
                                    updateConfig('research.items', items);
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            const items = [...config.research.items, { title: 'New Report', url: '#' }];
                            updateConfig('research.items', items);
                        }}
                        className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700"
                    >
                        <Plus size={12} /> Add Item
                    </button>
                </div>
                <FontPicker
                    label="Research Font"
                    fontConfig={config.research.font}
                    onChange={(v) => updateConfig('research.font', v)}
                />
            </>
        )}
    </div>
);

const FooterEditor = ({ config, updateConfig }) => (
    <div className="space-y-4">
        <Toggle
            label="Show Footer"
            checked={config.footer.enabled}
            onChange={(v) => updateConfig('footer.enabled', v)}
        />
        {config.footer.enabled && (
            <>
                <TextInput
                    label="Sign-off"
                    value={config.footer.signoff}
                    onChange={(v) => updateConfig('footer.signoff', v)}
                />
                <TextInput
                    label="Team Name"
                    value={config.footer.teamName}
                    onChange={(v) => updateConfig('footer.teamName', v)}
                />
                <Toggle
                    label="Show Contact Names"
                    checked={config.footer.showName}
                    onChange={(v) => updateConfig('footer.showName', v)}
                />
                <Toggle
                    label="Show Phone Numbers"
                    checked={config.footer.showPhone}
                    onChange={(v) => updateConfig('footer.showPhone', v)}
                />
                <Toggle
                    label="Show Email Addresses"
                    checked={config.footer.showEmail}
                    onChange={(v) => updateConfig('footer.showEmail', v)}
                />
                <div className="space-y-2">
                    <label className="text-[12px] font-medium text-gray-500">Contacts</label>
                    {config.footer.contacts.map((contact, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-medium text-gray-400">Contact {idx + 1}</span>
                                {config.footer.contacts.length > 1 && (
                                    <button
                                        onClick={() => {
                                            const contacts = config.footer.contacts.filter((_, i) => i !== idx);
                                            updateConfig('footer.contacts', contacts);
                                        }}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                value={contact.name}
                                onChange={(e) => {
                                    const contacts = [...config.footer.contacts];
                                    contacts[idx] = { ...contacts[idx], name: e.target.value };
                                    updateConfig('footer.contacts', contacts);
                                }}
                                placeholder="Name"
                                className="w-full text-[13px] p-2 bg-white border border-gray-200 rounded-lg"
                            />
                            <input
                                type="text"
                                value={contact.phone}
                                onChange={(e) => {
                                    const contacts = [...config.footer.contacts];
                                    contacts[idx] = { ...contacts[idx], phone: e.target.value };
                                    updateConfig('footer.contacts', contacts);
                                }}
                                placeholder="Phone"
                                className="w-full text-[13px] p-2 bg-white border border-gray-200 rounded-lg"
                            />
                            <input
                                type="email"
                                value={contact.email}
                                onChange={(e) => {
                                    const contacts = [...config.footer.contacts];
                                    contacts[idx] = { ...contacts[idx], email: e.target.value };
                                    updateConfig('footer.contacts', contacts);
                                }}
                                placeholder="Email"
                                className="w-full text-[13px] p-2 bg-white border border-gray-200 rounded-lg"
                            />
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            const contacts = [...config.footer.contacts, { name: 'New Contact', phone: '', email: '' }];
                            updateConfig('footer.contacts', contacts);
                        }}
                        className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700"
                    >
                        <Plus size={12} /> Add Contact
                    </button>
                </div>
                <FontPicker
                    label="Sign-off Font"
                    fontConfig={config.footer.signoffFont}
                    onChange={(v) => updateConfig('footer.signoffFont', v)}
                />
                <FontPicker
                    label="Team & Contacts Font"
                    fontConfig={config.footer.font}
                    onChange={(v) => updateConfig('footer.font', v)}
                />
            </>
        )}
    </div>
);

const DisclaimerEditor = ({ config, updateConfig }) => (
    <div className="space-y-4">
        <Toggle
            label="Show Disclaimer"
            checked={config.disclaimer.enabled}
            onChange={(v) => updateConfig('disclaimer.enabled', v)}
        />
        {config.disclaimer.enabled && (
            <>
                <TextInput
                    label="Disclaimer Text"
                    value={config.disclaimer.text}
                    onChange={(v) => updateConfig('disclaimer.text', v)}
                    multiline
                />
                <Toggle
                    label="Show Unsubscribe Link"
                    checked={config.disclaimer.showUnsubscribe}
                    onChange={(v) => updateConfig('disclaimer.showUnsubscribe', v)}
                />
                <Toggle
                    label="Show Privacy Policy Link"
                    checked={config.disclaimer.showPrivacy}
                    onChange={(v) => updateConfig('disclaimer.showPrivacy', v)}
                />

                {/* Social Links Manager */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                    <label className="text-[12px] font-medium text-gray-500">Social Icons</label>
                    {(config.disclaimer.socialLinks || []).map((link, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-medium text-gray-400">Icon {idx + 1}</span>
                                <button
                                    onClick={() => {
                                        const newLinks = config.disclaimer.socialLinks.filter((_, i) => i !== idx);
                                        updateConfig('disclaimer.socialLinks', newLinks);
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={link.platform}
                                    onChange={(e) => {
                                        const newLinks = [...(config.disclaimer.socialLinks || [])];
                                        newLinks[idx] = { ...newLinks[idx], platform: e.target.value };
                                        updateConfig('disclaimer.socialLinks', newLinks);
                                    }}
                                    className="w-1/3 text-[13px] p-2 bg-white border border-gray-200 rounded-lg cursor-pointer"
                                >
                                    <option value="linkedin">LinkedIn</option>
                                    <option value="twitter">X / Twitter</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="youtube">YouTube</option>
                                    <option value="website">Website</option>
                                </select>
                                <input
                                    type="text"
                                    value={link.url}
                                    onChange={(e) => {
                                        const newLinks = [...(config.disclaimer.socialLinks || [])];
                                        newLinks[idx] = { ...newLinks[idx], url: e.target.value };
                                        updateConfig('disclaimer.socialLinks', newLinks);
                                    }}
                                    placeholder="https://..."
                                    className="flex-1 text-[13px] p-2 bg-white border border-gray-200 rounded-lg"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            const newLinks = [...(config.disclaimer.socialLinks || []), { platform: 'linkedin', url: '' }];
                            updateConfig('disclaimer.socialLinks', newLinks);
                        }}
                        className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <Plus size={12} /> Add Social Link
                    </button>
                </div>
                <FontPicker
                    label="Disclaimer Font"
                    fontConfig={config.disclaimer.font}
                    onChange={(v) => updateConfig('disclaimer.font', v)}
                />
            </>
        )}
    </div>
);

// Featured Article Editor
const FeaturedArticleEditor = ({ config, updateConfig }) => (
    <div className="space-y-4">
        <Toggle
            label="Enable Featured Article"
            checked={config.featuredArticle?.enabled}
            onChange={(v) => updateConfig('featuredArticle.enabled', v)}
        />
        {config.featuredArticle?.enabled && (
            <>
                <TextInput
                    label="Section Title"
                    value={config.featuredArticle?.title || 'Featured Story'}
                    onChange={(v) => updateConfig('featuredArticle.title', v)}
                />
                <TextInput
                    label="Headline"
                    value={config.featuredArticle?.headline || ''}
                    onChange={(v) => updateConfig('featuredArticle.headline', v)}
                />
                <TextInput
                    label="Summary"
                    value={config.featuredArticle?.summary || ''}
                    onChange={(v) => updateConfig('featuredArticle.summary', v)}
                    multiline
                />
                <TextInput
                    label="Image URL"
                    value={config.featuredArticle?.imageUrl || ''}
                    onChange={(v) => updateConfig('featuredArticle.imageUrl', v)}
                    placeholder="https://..."
                />
                <TextInput
                    label="Article URL"
                    value={config.featuredArticle?.articleUrl || '#'}
                    onChange={(v) => updateConfig('featuredArticle.articleUrl', v)}
                />
                <TextInput
                    label="Source"
                    value={config.featuredArticle?.source || ''}
                    onChange={(v) => updateConfig('featuredArticle.source', v)}
                />
            </>
        )}
    </div>
);

// Stats Block Editor
const StatsBlockEditor = ({ config, updateConfig }) => (
    <div className="space-y-4">
        <Toggle
            label="Enable Stats Block"
            checked={config.statsBlock?.enabled}
            onChange={(v) => updateConfig('statsBlock.enabled', v)}
        />
        {config.statsBlock?.enabled && (
            <>
                <TextInput
                    label="Section Title"
                    value={config.statsBlock?.title || 'Key Metrics'}
                    onChange={(v) => updateConfig('statsBlock.title', v)}
                />
                <div className="space-y-2">
                    <label className="text-[12px] font-medium text-gray-500">Statistics</label>
                    {(config.statsBlock?.stats || []).map((stat, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-xl space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-medium text-gray-400">Stat {idx + 1}</span>
                                {(config.statsBlock?.stats?.length || 0) > 1 && (
                                    <button
                                        onClick={() => {
                                            const stats = config.statsBlock.stats.filter((_, i) => i !== idx);
                                            updateConfig('statsBlock.stats', stats);
                                        }}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                            </div>
                            <input
                                type="text"
                                value={stat.label}
                                onChange={(e) => {
                                    const stats = [...config.statsBlock.stats];
                                    stats[idx] = { ...stats[idx], label: e.target.value };
                                    updateConfig('statsBlock.stats', stats);
                                }}
                                placeholder="Label"
                                className="w-full text-[13px] p-2 bg-white border border-gray-200 rounded-lg"
                            />
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={stat.value}
                                    onChange={(e) => {
                                        const stats = [...config.statsBlock.stats];
                                        stats[idx] = { ...stats[idx], value: e.target.value };
                                        updateConfig('statsBlock.stats', stats);
                                    }}
                                    placeholder="Value"
                                    className="flex-1 text-[13px] p-2 bg-white border border-gray-200 rounded-lg"
                                />
                                <input
                                    type="color"
                                    value={stat.color}
                                    onChange={(e) => {
                                        const stats = [...config.statsBlock.stats];
                                        stats[idx] = { ...stats[idx], color: e.target.value };
                                        updateConfig('statsBlock.stats', stats);
                                    }}
                                    className="w-10 h-10 rounded-lg border-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={() => {
                            const stats = [...(config.statsBlock?.stats || []), { label: 'New Stat', value: '0', color: '#10B981' }];
                            updateConfig('statsBlock.stats', stats);
                        }}
                        className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700"
                    >
                        <Plus size={12} /> Add Stat
                    </button>
                </div>
            </>
        )}
    </div>
);

// Social Links Editor
const SocialLinksEditor = ({ config, updateConfig }) => (
    <div className="space-y-4">
        <Toggle
            label="Enable Social Links"
            checked={config.socialLinks?.enabled}
            onChange={(v) => updateConfig('socialLinks.enabled', v)}
        />
        {config.socialLinks?.enabled && (
            <div className="space-y-2">
                <label className="text-[12px] font-medium text-gray-500">Social Links</label>
                {(config.socialLinks?.links || []).map((link, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-medium text-gray-400">Link {idx + 1}</span>
                            {(config.socialLinks?.links?.length || 0) > 1 && (
                                <button
                                    onClick={() => {
                                        const links = config.socialLinks.links.filter((_, i) => i !== idx);
                                        updateConfig('socialLinks.links', links);
                                    }}
                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                        <select
                            value={link.platform}
                            onChange={(e) => {
                                const links = [...config.socialLinks.links];
                                links[idx] = { ...links[idx], platform: e.target.value };
                                updateConfig('socialLinks.links', links);
                            }}
                            className="w-full text-[13px] p-2 bg-white border border-gray-200 rounded-lg"
                        >
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">Twitter</option>
                            <option value="facebook">Facebook</option>
                            <option value="instagram">Instagram</option>
                            <option value="youtube">YouTube</option>
                            <option value="website">Website</option>
                        </select>
                        <input
                            type="text"
                            value={link.url}
                            onChange={(e) => {
                                const links = [...config.socialLinks.links];
                                links[idx] = { ...links[idx], url: e.target.value };
                                updateConfig('socialLinks.links', links);
                            }}
                            placeholder="URL"
                            className="w-full text-[13px] p-2 bg-white border border-gray-200 rounded-lg"
                        />
                    </div>
                ))}
                <button
                    onClick={() => {
                        const links = [...(config.socialLinks?.links || []), { platform: 'linkedin', url: '#', label: 'LinkedIn' }];
                        updateConfig('socialLinks.links', links);
                    }}
                    className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700"
                >
                    <Plus size={12} /> Add Link
                </button>
            </div>
        )}
    </div>
);

// Footer Image Editor
const FooterImageEditor = ({ config, updateConfig }) => (
    <div className="space-y-4">
        <Toggle
            label="Enable Footer Image"
            checked={config.footerImage?.enabled}
            onChange={(v) => updateConfig('footerImage.enabled', v)}
        />
        {config.footerImage?.enabled && (
            <>
                <TextInput
                    label="Image URL"
                    value={config.footerImage?.imageUrl || ''}
                    onChange={(v) => updateConfig('footerImage.imageUrl', v)}
                    placeholder="https://..."
                />
                <TextInput
                    label="Alt Text"
                    value={config.footerImage?.alt || 'Footer banner'}
                    onChange={(v) => updateConfig('footerImage.alt', v)}
                />
                <TextInput
                    label="Link URL (optional)"
                    value={config.footerImage?.link || ''}
                    onChange={(v) => updateConfig('footerImage.link', v)}
                    placeholder="https://..."
                />
            </>
        )}
    </div>
);

// Main Section Editor Component
interface SectionEditorProps {
    section: string;
    config: any;
    updateConfig: (path: string, value: any) => void;
    onClose: () => void;
}

export const SectionEditor: React.FC<SectionEditorProps> = ({ section, config, updateConfig, onClose }) => {
    const meta = SECTION_META[section] || { title: section, icon: FileText, color: '#6B7280' };
    const Icon = meta.icon;

    const renderEditor = () => {
        switch (section) {
            case 'banner':
                return <BannerEditor config={config} updateConfig={updateConfig} />;
            case 'dateBar':
                return <DateBarEditor config={config} updateConfig={updateConfig} />;
            case 'greeting':
                return <GreetingEditor config={config} updateConfig={updateConfig} />;
            case 'headlines':
                return <HeadlinesEditor config={config} updateConfig={updateConfig} />;
            case 'companies':
            case 'people':
            case 'topics':
                return <EntitiesEditor config={config} updateConfig={updateConfig} title={meta.title} />;
            case 'research':
                return <ResearchEditor config={config} updateConfig={updateConfig} />;
            case 'featuredArticle':
                return <FeaturedArticleEditor config={config} updateConfig={updateConfig} />;
            case 'statsBlock':
                return <StatsBlockEditor config={config} updateConfig={updateConfig} />;
            case 'socialLinks':
                return <SocialLinksEditor config={config} updateConfig={updateConfig} />;
            case 'footer':
                return <FooterEditor config={config} updateConfig={updateConfig} />;
            case 'footerImage':
                return <FooterImageEditor config={config} updateConfig={updateConfig} />;
            case 'disclaimer':
                return <DisclaimerEditor config={config} updateConfig={updateConfig} />;
            default:
                return <p className="text-[13px] text-gray-500">No editor available for this section.</p>;
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
            {/* Header */}
            <div
                className="px-4 py-3 border-b border-gray-100 flex items-center justify-between"
                style={{ background: `linear-gradient(to right, ${meta.color}10, transparent)` }}
            >
                <div className="flex items-center gap-2">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: meta.color }}
                    >
                        <Icon size={14} className="text-white" />
                    </div>
                    <span className="text-[14px] font-semibold text-gray-800">{meta.title}</span>
                </div>
                <button
                    onClick={onClose}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X size={16} className="text-gray-400" />
                </button>
            </div>

            {/* Editor Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
                {renderEditor()}
            </div>
        </div>
    );
};

export default SectionEditor;
