// @ts-nocheck
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { ChevronDown, ChevronRight, ChevronLeft, Eye, Palette, Type, Layout, Users, FileText, Mail, AlertCircle, Image, List, Download, Plus, Trash2, Sparkles, Loader2, Calendar, MessageSquare, GripVertical, PanelLeft, X, Settings, Check, Star, BarChart3, Share2, Bold, Italic, Underline } from 'lucide-react';
import { GlobalThemePanel } from './components/GlobalThemePanel';
import { SectionEditor } from './components/SectionEditor';

// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL-SAFE FONTS
// ═══════════════════════════════════════════════════════════════════════════════
const EMAIL_SAFE_FONTS = [
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, Times, serif', label: 'Georgia' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Verdana' },
  { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
  { value: '"Trebuchet MS", Helvetica, sans-serif', label: 'Trebuchet MS' },
  { value: 'Charter, "Bitstream Charter", serif', label: 'Charter' },
  { value: '"Courier New", Courier, monospace', label: 'Courier New' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DEFAULT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════
const defaultConfig = {
  theme: {
    colors: {
      accent: '#008689',
      textPrimary: '#000000',
      textSecondary: '#4E5971',
      border: '#E5E5E5',
      dateBarFill: '#F5F5F5',
    },
  },

  banner: {
    type: 'image',
    imageUrl: 'https://byndpdfstorage.blob.core.windows.net/alerts-logos/investec_banner.png',
    companyName: 'Newsletter',
    companyWebsite: '',
    logoUrl: '',
  },

  dateBar: {
    enabled: true,
    text: 'Friday, 16 January 2026',
    font: { family: 'Georgia, Times, serif', size: 13, color: null },
  },

  greeting: {
    enabled: true,
    showIntro: true,
    title: 'Good Morning,',
    intro: 'Welcome to your daily AI-generated newsletter. Today\'s edition covers the latest developments across your tracked companies, key industry topics, and relevant market movements.',
    font: { family: 'Georgia, Times, serif', size: 20, color: null, italic: true },
    introItalic: true, // Intro text is italic by default
  },

  headlines: {
    enabled: true,
    showSectionTitle: true,
    showCategories: false, // Hidden by default as requested
    showSubCategories: true, // Controlled by showCategories parent toggle in logic implies visibility if parent is on
    showImage: true, // Show company logo/person image next to headlines
    sourceMode: 'inline',
    sectionTitle: 'At a Glance',
    companiesTitle: 'Companies',
    peopleTitle: 'People',
    topicsTitle: 'Topics',
    sectionFont: { family: 'Helvetica, Arial, sans-serif', size: 16, color: null, uppercase: true },
    subSectionFont: { family: 'Helvetica, Arial, sans-serif', size: 16, color: null },
    itemFont: { family: 'Georgia, Times, serif', size: 16, color: null },
  },

  entities: {
    showLogo: true,
    showSubCategories: true,
    bulletStyle: 'bullet',
    borderStyle: 'full',
    borderColor: 'accent',
    companiesTitle: 'Companies',
    peopleTitle: 'People',
    topicsTitle: 'Topics',
    sectionFont: { family: 'Georgia, Times, serif', size: 20, color: null },
    subSectionFont: { family: 'Helvetica, Arial, sans-serif', size: 16, color: null },
    nameFont: { family: 'Charter, "Bitstream Charter", serif', size: 18, color: null },
    headlineFont: { family: 'Georgia, Times, serif', size: 16, color: null },
    bodyFont: { family: 'Helvetica, Arial, sans-serif', size: 14, color: null },
  },

  research: {
    enabled: true,
    title: 'Research Reports',
    subtitle: 'Access to our recent reports',
    font: { family: 'Helvetica, Arial, sans-serif', size: 12, color: null },
    items: [
      { title: 'Example Research Report 1', url: '#' },
      { title: 'Example Research Report 2', url: '#' },
    ],
  },

  footer: {
    enabled: true,
    showName: true,
    showPhone: true,
    showEmail: true,
    signoff: 'Have a great day!',
    teamName: 'Newsletter Team',
    signoffFont: { family: '"Times New Roman", Times, serif', size: 16, color: null },
    font: { family: 'Helvetica, Arial, sans-serif', size: 12, color: null },
    contacts: [
      { name: 'Contact Name 1', phone: '+91 00 0000 0000', email: 'contact1@company.com' },
      { name: 'Contact Name 2', phone: '+91 00 0000 0000', email: 'contact2@company.com' },
      { name: 'Contact Name 3', phone: '+91 00 0000 0000', email: 'contact3@company.com' },
    ],
  },

  disclaimer: {
    enabled: true,
    showUnsubscribe: true,
    showPrivacy: true,
    text: 'This is an AI generated product. Please use discretion. We do not take responsibility for the accuracy of the newsletter.',
    font: { family: 'Helvetica, Arial, sans-serif', size: 11, color: null },
    socialLinks: [
      { platform: 'linkedin', url: '#', label: 'LinkedIn' },
      { platform: 'twitter', url: '#', label: 'Twitter' },
      { platform: 'website', url: '#', label: 'Website' },
    ],
  },

  // New Sections
  featuredArticle: {
    enabled: false,
    title: 'Featured Story',
    headline: 'OpenAI announces GPT-5 with breakthrough reasoning capabilities',
    summary: 'The new model demonstrates human-level performance on graduate-level reasoning tasks and can engage in multi-step problem solving across domains including science, mathematics, and legal analysis.',
    imageUrl: '',
    articleUrl: 'https://openai.com',
    source: 'TechCrunch',
  },

  statsBlock: {
    enabled: false,
    title: 'Key Metrics',
    stats: [
      { label: '[Metric 1]', value: '[Value]', color: '#10B981' },
      { label: '[Metric 2]', value: '[Value]', color: '#3B82F6' },
      { label: '[Metric 3]', value: '[Value]', color: '#F59E0B' },
    ],
  },


  footerImage: {
    enabled: false,
    imageUrl: '',
    alt: 'Footer banner',
    link: '',
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE DATA - Sample content for preview (populated by backend in production)
// ═══════════════════════════════════════════════════════════════════════════════
const exampleData = {
  headlines: {
    companies: [
      { headline: 'Apple unveils M4 Ultra chip for professional Mac Pro lineup', url: 'https://apple.com', subCategory: 'Consumer Technology', imageUrl: 'https://img.logo.dev/apple.com?token=pk_eMw84WGZTgWjQ_mTKSfirQ', sources: [{ name: 'Reuters', url: 'https://reuters.com' }, { name: 'Bloomberg', url: 'https://bloomberg.com' }] },
      { headline: 'Figma introduces AI-powered design tools with automatic prototyping', url: 'https://figma.com', subCategory: 'Design Tools', imageUrl: 'https://img.logo.dev/figma.com?token=pk_eMw84WGZTgWjQ_mTKSfirQ', sources: [{ name: 'TechCrunch', url: 'https://techcrunch.com' }, { name: 'The Verge', url: 'https://theverge.com' }] },
    ],
    topics: [
      { headline: 'Global climate tech investments surge 40% in 2025', url: '#', imageUrl: '', sources: [{ name: 'Bloomberg', url: 'https://bloomberg.com' }, { name: 'Financial Times', url: 'https://ft.com' }] },
      { headline: 'Crypto regulation framework gains bipartisan support in Congress', url: '#', imageUrl: '', sources: [{ name: 'WSJ', url: 'https://wsj.com' }, { name: 'CNBC', url: 'https://cnbc.com' }] },
    ],
  },
  companies: [
    {
      name: 'Apple',
      websiteUrl: 'https://apple.com',
      logoUrl: 'https://img.logo.dev/apple.com?token=pk_eMw84WGZTgWjQ_mTKSfirQ',
      subCategory: 'Consumer Technology',
      articles: [
        { headline: 'Apple unveils M4 Ultra chip for professional Mac Pro lineup, set to launch in Q1 2026', url: 'https://apple.com', bullets: ['The new chip features 32-core CPU and 80-core GPU, offering 2x performance over M2 Ultra', 'Pre-orders open February 2026 with configurations starting at $5,999 for the base Mac Pro model'], sources: [{ name: 'Reuters', url: 'https://reuters.com' }, { name: 'Bloomberg', url: 'https://bloomberg.com' }] },
      ],
    },
    {
      name: 'Figma',
      websiteUrl: 'https://figma.com',
      logoUrl: 'https://img.logo.dev/figma.com?token=pk_eMw84WGZTgWjQ_mTKSfirQ',
      subCategory: 'Design Tools',
      articles: [
        { headline: 'Figma introduces AI-powered design tools with automatic prototyping capabilities', url: 'https://figma.com', bullets: ['The new AI feature can generate complete UI components from text prompts, reducing design time by 60%', 'Major tech companies including Airbnb and Spotify have already integrated the AI tools'], sources: [{ name: 'TechCrunch', url: 'https://techcrunch.com' }, { name: 'The Verge', url: 'https://theverge.com' }] },
      ],
    },
  ],
  people: [
    {
      name: 'Elon Musk',
      websiteUrl: 'https://x.com/elonmusk',
      logoUrl: '/assets/people/elon_musk.png',
      subCategory: 'Technology Leaders',
      articles: [
        { headline: 'SpaceX Starship completes first successful orbital flight, Musk announces Mars mission timeline', url: 'https://spacex.com', bullets: ['The successful orbital test marks a major milestone for SpaceX interplanetary ambitions', 'Musk confirmed plans for uncrewed Mars cargo missions beginning in 2028'], sources: [{ name: 'Reuters', url: 'https://reuters.com' }, { name: 'Bloomberg', url: 'https://bloomberg.com' }] },
      ],
    },
    {
      name: 'Narendra Modi',
      websiteUrl: 'https://pmindia.gov.in',
      logoUrl: '/assets/people/narendra_modi.png',
      subCategory: 'World Leaders',
      articles: [
        { headline: 'PM Modi inaugurates India first domestic chip fab facility in Gujarat, announces $10B investment', url: 'https://economictimes.com', bullets: ['The facility in Dholera will manufacture 28nm and 45nm chips for automotive and IoT applications', 'The initiative is part of India broader push for semiconductor self-reliance by 2030'], sources: [{ name: 'Economic Times', url: 'https://economictimes.com' }, { name: 'Mint', url: 'https://livemint.com' }] },
      ],
    },
  ],
  topics: [
    {
      name: 'Climate Tech',
      articles: [
        { headline: 'Global climate tech investments surge 40% in 2025 as governments increase green subsidies', url: '#', bullets: ['Private equity and venture capital firms have deployed $85B into clean energy startups this year', 'Battery storage and green hydrogen projects accounted for 60% of all new investments'], sources: [{ name: 'Bloomberg', url: 'https://bloomberg.com' }, { name: 'FT', url: 'https://ft.com' }] },
      ],
    },
    {
      name: 'Crypto Regulation',
      articles: [
        { headline: 'Bipartisan crypto regulation framework gains momentum in US Congress', url: '#', bullets: ['The proposed bill would establish clear guidelines for stablecoin issuers and DeFi platforms', 'Major exchanges including Coinbase and Kraken have expressed support for the regulatory clarity'], sources: [{ name: 'WSJ', url: 'https://wsj.com' }] },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION CONFIGURATION FOR INTERACTIVE PREVIEW
// ═══════════════════════════════════════════════════════════════════════════════
const SECTION_CONFIG = {
  banner: { title: 'Banner / Header', icon: Image, color: '#007AFF' },
  dateBar: { title: 'Date Bar', icon: Calendar, color: '#34C759' },
  greeting: { title: 'Greeting', icon: MessageSquare, color: '#FF9500' },
  headlines: { title: 'Headlines', icon: FileText, color: '#AF52DE' },
  companies: { title: 'Companies', icon: Users, color: '#FF3B30' },
  people: { title: 'People', icon: Users, color: '#5856D6' },
  topics: { title: 'Topics', icon: Layout, color: '#00C7BE' },
  research: { title: 'Research', icon: FileText, color: '#FF2D55' },
  footer: { title: 'Footer', icon: Mail, color: '#64D2FF' },
  disclaimer: { title: 'Disclaimer', icon: AlertCircle, color: '#8E8E93' },
  theme: { title: 'Theme Colors', icon: Palette, color: '#007AFF' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// APPLE-STYLE UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

interface ConfigSectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="mx-3 my-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3.5 flex items-center gap-3 rounded-xl transition-all duration-200 ${isOpen ? 'bg-white/80 shadow-sm' : 'hover:bg-white/60'}`}
      >
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isOpen ? 'bg-blue-500' : 'bg-gray-200/80'}`}>
          <Icon size={16} className={isOpen ? 'text-white' : 'text-gray-600'} />
        </div>
        <span className={`font-medium flex-1 text-left text-[15px] tracking-tight ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>{title}</span>
        <ChevronRight
          size={16}
          className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
        />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-4 space-y-4 bg-white/60 rounded-xl mt-1 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
};

const SubSection = ({ title, children }) => (
  <div className="pt-4 mt-4 border-t border-gray-200/60 space-y-4">
    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
    {children}
  </div>
);

const Toggle = ({ label, checked, onChange, disabled = false }) => (
  <label className={`flex items-center justify-between gap-3 py-1 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <span className="text-[15px] text-gray-800">{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-[31px] w-[51px] flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-green-500' : 'bg-gray-300'} ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      <span
        className={`pointer-events-none inline-block h-[27px] w-[27px] mt-[2px] transform rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${checked ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
      />
    </button>
  </label>
);

const RadioGroup = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    {label && <label className="text-[13px] font-medium text-gray-600">{label}</label>}
    <div className="bg-gray-100/80 rounded-xl p-1 flex flex-col gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`w-full px-4 py-2.5 rounded-lg text-left text-[14px] font-medium transition-all duration-150 ${value === opt.value ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:bg-white/50'}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  </div>
);

const ColorPicker = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3 py-2">
    <div className="relative">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 appearance-none bg-transparent"
        style={{ WebkitAppearance: 'none' }}
      />
      <div
        className="absolute inset-0 rounded-xl border border-gray-200/80 shadow-sm pointer-events-none"
        style={{ backgroundColor: value }}
      />
    </div>
    <span className="text-[15px] text-gray-800 flex-1">{label}</span>
    <span className="text-[13px] text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded-md">{value.toUpperCase()}</span>
  </div>
);

const TextInput = ({ label, value, onChange, placeholder = '', multiline = false }) => (
  <div className="space-y-2">
    <label className="text-[13px] font-medium text-gray-600">{label}</label>
    {multiline ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full text-[15px] p-3 bg-gray-100/80 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none placeholder:text-gray-400"
      />
    ) : (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full text-[15px] p-3 bg-gray-100/80 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-gray-400"
      />
    )}
  </div>
);

const FontPicker = ({ label, fontConfig, onChange }) => (
  <div className="space-y-3 p-4 bg-gray-100/60 rounded-xl">
    <p className="text-[13px] font-semibold text-gray-700">{label}</p>
    <div className="grid grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-gray-500 uppercase">Font</label>
        <select
          value={fontConfig.family}
          onChange={(e) => onChange({ ...fontConfig, family: e.target.value })}
          className="w-full text-[14px] p-2.5 bg-white border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          {EMAIL_SAFE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-gray-500 uppercase">Size</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={fontConfig.size}
            onChange={(e) => onChange({ ...fontConfig, size: parseInt(e.target.value) || 12 })}
            min={8}
            max={32}
            className="w-full text-[14px] p-2.5 bg-white border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-[12px] text-gray-400 font-medium">px</span>
        </div>
      </div>
    </div>

    {/* Style Toggles */}
    <div className="flex items-center gap-1.5 p-1 bg-white rounded-lg border border-gray-200 mt-2">
      <button
        onClick={() => onChange({ ...fontConfig, bold: !fontConfig.bold })}
        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${fontConfig.bold ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        onClick={() => onChange({ ...fontConfig, italic: !fontConfig.italic })}
        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${fontConfig.italic ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        onClick={() => onChange({ ...fontConfig, underline: !fontConfig.underline })}
        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${fontConfig.underline ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
        title="Underline"
      >
        <Underline size={16} />
      </button>
      <button
        onClick={() => onChange({ ...fontConfig, uppercase: !fontConfig.uppercase })}
        className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${fontConfig.uppercase ? 'bg-blue-50 text-blue-600' : 'text-gray-500'}`}
        title="Uppercase (All Caps)"
      >
        <Type size={16} />
      </button>
    </div>

    <div className="flex items-center justify-between pt-2">
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={fontConfig.color !== null}
          onChange={(e) => onChange({ ...fontConfig, color: e.target.checked ? '#000000' : null })}
          className="w-5 h-5 rounded-md border-gray-300 text-blue-500 focus:ring-blue-500"
        />
        <span className="text-[14px] text-gray-700">Custom color</span>
      </label>
      {fontConfig.color !== null ? (
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={fontConfig.color}
            onChange={(e) => onChange({ ...fontConfig, color: e.target.value })}
            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
          />
        </div>
      ) : (
        <span className="text-[12px] text-gray-400 bg-gray-200/60 px-2 py-1 rounded-md">Theme default</span>
      )}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// BANNER GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════
const BannerGenerator = ({ config, updateConfig }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState(null);
  const [generationError, setGenerationError] = useState(null);

  const generateBanner = async () => {
    if (!config.banner.companyWebsite) { alert('Please enter a company website'); return; }
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const prompt = `Create a professional email newsletter header banner.

Requirements:
- Dimensions: Wide banner format, 800x150 pixels aspect ratio
- Company: ${config.banner.companyWebsite}
- Style: Clean, minimal, professional corporate design
- Layout: Company name/logo on left, subtle decorative element on right
- Colors: Professional palette with subtle gradients, light backgrounds
- Design like Investec bank headers: elegant, sophisticated, corporate


Generate a high-quality professional banner image.`;

      // Use Gemini 2.0 Flash Experimental with image generation
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyAVTktCz_mCaiKoKTwKZyLmQrtRRZSzGGY`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            responseModalities: ["TEXT", "IMAGE"]
          }
        })
      });

      const data = await response.json();
      console.log('Gemini API response:', data);

      if (data.error) {
        throw new Error(data.error.message || 'API error occurred');
      }

      let foundImage = false;
      if (data.candidates?.[0]?.content?.parts) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData?.mimeType?.startsWith('image/')) {
            const imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            setGeneratedImageUrl(imageUrl);
            updateConfig('banner.imageUrl', imageUrl);
            foundImage = true;
            break;
          }
        }
      }

      if (!foundImage) {
        const textResponse = data.candidates?.[0]?.content?.parts?.find(p => p.text)?.text || '';
        setGenerationError(`No image generated. Model response: ${textResponse.slice(0, 100)}...`);
      }
    } catch (error) {
      console.error('Banner generation error:', error);
      setGenerationError(`Error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImageUrl) return;
    const link = document.createElement('a');
    link.href = generatedImageUrl;
    link.download = `banner-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearGenerated = () => {
    setGeneratedImageUrl(null);
    setGenerationError(null);
  };

  return (
    <div className="space-y-3">
      <RadioGroup value={config.banner.type} onChange={(v) => updateConfig('banner.type', v)} options={[
        { value: 'image', label: 'Custom Image URL' },
        { value: 'text', label: 'Text Logo' },
        { value: 'generate', label: 'Generate with AI' },
      ]} />

      {config.banner.type === 'image' && (
        <TextInput label="Banner Image URL" value={config.banner.imageUrl} onChange={(v) => updateConfig('banner.imageUrl', v)} placeholder="https://example.com/banner.png" />
      )}

      {config.banner.type === 'text' && (
        <TextInput label="Company Name" value={config.banner.companyName} onChange={(v) => updateConfig('banner.companyName', v)} placeholder="Newsletter" />
      )}

      {config.banner.type === 'generate' && (
        <div className="space-y-3">
          {/* Input Section */}
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 space-y-3">
            <p className="text-xs text-purple-700 font-medium flex items-center gap-1">
              <Sparkles size={14} /> AI Banner Generation
            </p>
            <TextInput label="Company Website" value={config.banner.companyWebsite} onChange={(v) => updateConfig('banner.companyWebsite', v)} placeholder="https://company.com" />
            <TextInput label="Logo URL (optional)" value={config.banner.logoUrl} onChange={(v) => updateConfig('banner.logoUrl', v)} placeholder="https://company.com/logo.png" />
            <button
              onClick={generateBanner}
              disabled={isGenerating}
              className="w-full px-4 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium transition-colors"
            >
              {isGenerating ? (
                <><Loader2 size={16} className="animate-spin" />Generating Banner...</>
              ) : (
                <><Sparkles size={16} />Generate Banner</>
              )}
            </button>
          </div>

          {/* Error Message */}
          {generationError && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-xs text-red-700">{generationError}</p>
            </div>
          )}

          {/* Generated Image Preview */}
          {generatedImageUrl && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-green-700 font-medium flex items-center gap-1">
                  ✓ Banner Generated
                </p>
                <button
                  onClick={clearGenerated}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              </div>

              {/* Image Preview */}
              <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
                <img
                  src={generatedImageUrl}
                  alt="Generated Banner"
                  className="w-full h-auto"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={downloadImage}
                  className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                >
                  <Download size={14} />
                  Download Image
                </button>
                <button
                  onClick={generateBanner}
                  disabled={isGenerating}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                >
                  <Sparkles size={14} />
                  Regenerate
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Download the image, then upload it to your image hosting service to get a URL.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// HTML GENERATOR
// ═══════════════════════════════════════════════════════════════════════════════
const generateHTML = (config) => {
  const c = config.theme.colors;
  const data = exampleData;

  // Helper to escape font-family for HTML style attributes (replace " with ')
  const escapeFont = (fontFamily) => fontFamily.replace(/"/g, "'");

  // Helper to generate CSS style string from font config (handling standard + extra styles)
  const getExtraFontStyles = (fontConfig) => {
    if (!fontConfig) return '';
    return [
      fontConfig.bold ? 'font-weight:700;' : '',
      fontConfig.italic ? 'font-style:italic;' : '',
      fontConfig.underline ? 'text-decoration:underline;' : '',
      fontConfig.uppercase ? 'text-transform:uppercase;' : ''
    ].join('');
  };

  const getFontColor = (fontConfig, defaultColor) => fontConfig.color || defaultColor;
  const bulletChar = { bullet: '•', arrow: '→', dash: '–', square: '■' }[config.entities.bulletStyle] || '•';

  const renderSourcesBelow = (sources) => {
    if (!sources?.length || config.headlines.sourceMode !== 'below') return '';
    const hFont = config.headlines.itemFont;
    return `<p style="margin:0;padding:0;font-family:${escapeFont(hFont.family)};font-size:11px;line-height:16px;letter-spacing:0.3px;${getExtraFontStyles(hFont)}">${sources.map(s => `<a href="${s.url}" style="color:${c.accent};text-decoration:none;">${s.name}</a>`).join('<span style="color:#999;"> | </span>')}</p>`;
  };



  const renderBullets = (bullets) => {
    if (!bullets?.length) return '';
    const color = getFontColor(config.entities.bodyFont, c.textSecondary);
    const f = config.entities.bodyFont;
    return `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:8px 0 0 0;"><tbody>${bullets.map(b => `<tr><td width="16" valign="top" style="padding:0 0 6px 0;font-family:${escapeFont(f.family)};font-size:${f.size}px;line-height:${Math.round(f.size * 1.6)}px;color:${color};letter-spacing:0.3px;${getExtraFontStyles(f)}">${bulletChar}</td><td valign="top" style="padding:0 0 6px 0;font-family:${escapeFont(f.family)};font-size:${f.size}px;line-height:${Math.round(f.size * 1.6)}px;color:${color};letter-spacing:0.3px;${getExtraFontStyles(f)}">${b}</td></tr>`).join('')}</tbody></table>`;
  };

  // UNIVERSAL ARTICLE ITEM - Used by both Headlines and Entity sections
  // showBullets: true for entity sections, false for headlines section
  const renderArticleItem = (article, { showBullets = true } = {}) => {
    const ef = config.entities;
    // Force textPrimary (Black) for all headlines as requested
    const headlineColor = getFontColor(ef.headlineFont, c.textPrimary);

    // Use helper for all styles (bold, italic, underline, uppercase)
    // Note: We apply styles to the P tag. The A tag inherits color.
    // For text-decoration on links, if parent has underline, link usually gets it too.
    // However, to be safe with email clients, we can apply specific styles to the link if needed.
    // But existing pattern puts bold/italic/upper on P.
    // Let's rely on getExtraFontStyles on the P tag for simplicity and consistency.

    const extraStyles = getExtraFontStyles(ef.headlineFont);
    const textTransform = ef.headlineFont.uppercase ? 'uppercase' : 'none';

    // We keep the A tag decoration inline with the font config
    const textDecoration = ef.headlineFont.underline ? 'underline' : 'none';

    let html = `<p style="margin:0 0 8px 0;padding:0;font-family:${escapeFont(ef.headlineFont.family)};font-size:${ef.headlineFont.size}px;line-height:${Math.round(ef.headlineFont.size * 1.6)}px;letter-spacing:0.3px;${extraStyles}"><a href="${article.url}" style="color:${headlineColor};text-decoration:${textDecoration};">${article.headline.toUpperCase().toLowerCase() === article.headline.toLowerCase() && ef.headlineFont.uppercase ? article.headline.toUpperCase() : article.headline}</a></p>`;

    // Show sources right after headline (if sourceMode is 'below')
    html += renderSourcesBelow(article.sources);

    // Show bullets at the end only if showBullets is true
    if (showBullets) {
      html += renderBullets(article.bullets);
    }

    return html;
  };

  const getEntityBorderStyle = () => {
    // Header borders should always be accent color as requested
    const color = c.accent;
    // Increased stroke to 3px as requested
    if (config.entities.borderStyle === 'fixed') return ''; // No border on text, handled separately
    return config.entities.borderStyle === 'short' ? `display:inline-block;border-bottom:3px solid ${color};padding-bottom:4px;` : `border-bottom:3px solid ${color};padding-bottom:4px;`;
  };

  const renderEntitySection = (title, entities, isTopics = false, sectionName = 'entities') => {
    if (!entities?.length) return '';
    const ef = config.entities;
    const hf = config.headlines; // Use headlines config for shared styling
    const titleColor = getFontColor(ef.sectionFont, c.textPrimary);
    const subTitleColor = getFontColor(hf.subSectionFont, c.accent); // Use headlines subSectionFont
    const nameColor = getFontColor(ef.nameFont, c.textPrimary);
    const headlineColor = getFontColor(hf.itemFont, c.textSecondary); // Use headlines itemFont

    // Increased padding to 32px horizontal, reduced to 24px vertical as requested
    // Increased padding to 32px horizontal, reduced to 24px vertical as requested
    let html = `<tr data-section="${sectionName}"><td style="padding:24px 32px;background-color:#ffffff;cursor:pointer;" class="padding-mobile"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="padding:0 0 8px 0;"><p style="margin:0;padding:0;font-family:${escapeFont(ef.sectionFont.family)};font-size:${ef.sectionFont.size}px;line-height:${Math.round(ef.sectionFont.size * 1.6)}px;font-weight:${ef.sectionFont.bold ? '700' : '400'};letter-spacing:0.3px;color:${titleColor};${getEntityBorderStyle()}${getExtraFontStyles(ef.sectionFont)}">${title}</p>`;

    // Fixed width underline implementation
    if (config.entities.borderStyle === 'fixed') {
      const color = config.entities.borderColor === 'accent' ? c.accent : c.border;
      html += `<div style="width:40px;height:3px;background-color:${color};margin-top:4px;"></div>`;
    }

    html += `</td></tr>`;

    entities.forEach((entity, idx) => {
      let showedNewSubcategory = false;
      if (!isTopics && config.entities.showSubCategories && entity.subCategory) {
        // Use Helvetica (subSectionFont) for subcategories as requested, but keep Black color and Regular weight
        // Size: 14px (Decreased by 2px from 16px default? Or from 18px? "Decrease their size by 2px". 16px -> 14px seems safer if 16px is standard)
        // Let's use 16px as standard "small header" size, user might have meant decrease from the previous 18px I set.
        // Actually, previous was ef.nameFont.size which was 18px. So 18-2 = 16px.
        // But config.subSectionFont.size is 16. So I will just use config.subSectionFont.size.
        // Wait, user said "Decrease their size by 2px". If relative to what they see (18px), then 16px.
        // If relative to "standard" 16px, then 14px.
        // "Companies and people topic headers - let's decrease their size by 2px."
        // I will go with 14px to be safe as they want it smaller.
        // "Companies and people topic headers - let's decrease their size by 2px."
        // I will go with 14px to be safe as they want it smaller.
        html += `<tr><td style="padding:20px 0 8px 0;border-bottom:1px solid #F1F1F0;"><p style="margin:0;padding:0;font-family:${escapeFont(hf.subSectionFont.family)};font-size:14px;line-height:22px;font-weight:${hf.subSectionFont.bold ? '700' : '400'};letter-spacing:0.3px;color:${c.textPrimary};text-transform:uppercase;${getExtraFontStyles(hf.subSectionFont)}">${entity.subCategory}</p></td></tr>`;
        showedNewSubcategory = true;
      }

      // Don't show border-top if we just showed a new subcategory (to avoid underline on subcategory)
      html += `<tr><td style="padding:16px 0 0 0;${idx > 0 && !showedNewSubcategory ? `border-top:0.5px solid #F1F1F0;` : ''}"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody>`;

      if (!isTopics) {
        html += `<tr><td style="padding:0 0 8px 0;"><table border="0" cellpadding="0" cellspacing="0"><tbody><tr>`;
        if (config.entities.showLogo && entity.logoUrl) {
          html += `<td width="32" valign="middle" style="padding:0 4px 0 0;"><img src="${entity.logoUrl}" alt="" width="24" height="24" style="display:block;width:24px;height:24px;border-radius:4px;border:0.5px solid #F1F1F0;"></td>`;
        }
        html += `<td valign="middle"><a href="${entity.websiteUrl || '#'}" target="_blank" style="text-decoration:none;"><p style="margin:0;padding:0;font-family:${escapeFont(ef.nameFont.family)};font-size:${ef.nameFont.size}px;line-height:${Math.round(ef.nameFont.size * 1.6)}px;font-weight:${ef.nameFont.bold ? '700' : '400'};letter-spacing:0.3px;color:${nameColor};${getExtraFontStyles(ef.nameFont)}">${entity.name}</p></a></td></tr></tbody></table></td></tr>`;
      } else {
        // Topics use a default list icon matching the headlines section
        const topicIcon = `<div style="width:24px;height:24px;border-radius:4px;border:0.5px solid #F1F1F0;display:inline-flex;align-items:center;justify-content:center;background:#FAFAF9;vertical-align:middle;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </div>`;
        html += `<tr><td style="padding:0 0 8px 0;"><table border="0" cellpadding="0" cellspacing="0"><tbody><tr>`;
        if (config.entities.showLogo) {
          html += `<td width="32" valign="middle" style="padding:0 4px 0 0;">${topicIcon}</td>`;
        }
        html += `<td valign="middle"><p style="margin:0;padding:0;font-family:${escapeFont(ef.nameFont.family)};font-size:${ef.nameFont.size}px;line-height:${Math.round(ef.nameFont.size * 1.6)}px;font-weight:${ef.nameFont.bold ? '700' : '400'};letter-spacing:0.3px;color:${c.textPrimary};${getExtraFontStyles(ef.nameFont)}">${entity.name}</p></td></tr></tbody></table></td></tr>`;
      }

      entity.articles?.forEach(article => {
        // Use universal renderArticleItem with showBullets=true for entity sections
        html += `<tr><td style="padding:0 0 16px 0;">${renderArticleItem(article, { showBullets: true })}</td></tr>`;
      });

      html += `</tbody></table></td></tr>`;
    });

    html += `</tbody></table></td></tr>`;
    return html;
  };

  // BUILD HTML
  let html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter</title>
  <style type="text/css">
    body, table, td, p, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #ffffff; }
    @media only screen and (max-width: 600px) {
      .email-container { width: 100% !important; }
      .fluid { max-width: 100% !important; height: auto !important; }
      .stack-column { display: block !important; width: 100% !important; padding-bottom: 10px !important; }
      .padding-mobile { padding-left: 16px !important; padding-right: 16px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#FDFDFD;width:100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#FDFDFD;">
    <tbody>
      <tr>
        <td align="center" style="padding:40px 0;">
          <table border="0" cellpadding="0" cellspacing="0" width="720" class="email-container" style="max-width:720px;background-color:#ffffff;">
            <tbody>`;

  // Open content wrapper table - BANNER IS NOW INSIDE THIS
  html += `<tr><td align="left" style="padding:0;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid #F1F1F0;background-color:#ffffff;"><tbody>`;

  // BANNER - now first row inside content wrapper
  if (config.banner.type === 'image' || config.banner.type === 'generate') {
    html += `<tr data-section="banner"><td style="padding:0;cursor:pointer;"><img src="${config.banner.imageUrl}" alt="Banner" width="720" style="display:block;width:100%;max-width:720px;height:auto;" class="fluid"></td></tr>`;
  } else {
    // Increased padding to 32px
    html += `<tr data-section="banner"><td style="padding:0;cursor:pointer;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="padding:32px;" class="padding-mobile"><p style="margin:0;padding:0;font-family:${escapeFont(config.entities.sectionFont.family)};font-size:28px;line-height:36px;font-weight:600;letter-spacing:0.3px;color:${c.accent};${getExtraFontStyles(config.entities.sectionFont)}">${config.banner.companyName}</p></td></tr></tbody></table></td></tr>`;
  }

  // DATE BAR
  if (config.dateBar.enabled) {
    const df = config.dateBar.font;
    // Increased padding to 12px (4px + 8px) top/bottom as requested. Fixed bg color #FAFAF9. Added top/bottom borders #F1F1F0.
    html += `<tr data-section="dateBar"><td style="background-color:#FAFAF9;padding:12px 32px;cursor:pointer;border-top:1px solid #F1F1F0;border-bottom:1px solid #F1F1F0;" class="padding-mobile"><p style="margin:0;padding:0;font-family:${escapeFont(df.family)};font-size:${df.size}px;line-height:18px;font-weight:${df.bold ? '700' : '400'};letter-spacing:0.3px;color:${getFontColor(df, c.textSecondary)};${getExtraFontStyles(df)}">${config.dateBar.text}</p></td></tr>`;
  }

  // GREETING
  if (config.greeting.enabled) {
    const gf = config.greeting.font;
    const greetingColor = getFontColor(gf, c.accent);
    const introColor = getFontColor(gf, c.textSecondary);
    const introItalic = config.greeting.introItalic ? 'font-style:italic;' : '';
    // Increased padding to 32px. Updated Intro to Helvetica. Changed font-weight to 400 to match subpoints.
    html += `<tr data-section="greeting"><td style="padding:16px 32px 12px 32px;background-color:#ffffff;cursor:pointer;" class="padding-mobile"><p style="margin:0 0 4px 0;padding:0;font-family:${escapeFont(gf.family)};font-size:${gf.size}px;line-height:${Math.round(gf.size * 2)}px;letter-spacing:0.3px;color:${greetingColor};${getExtraFontStyles(gf)}">${config.greeting.title}</p>${config.greeting.showIntro ? `<p style="margin:0;padding:0;font-family:Helvetica, Arial, sans-serif;font-size:14px;line-height:20px;font-weight:400;letter-spacing:0.3px;color:${introColor};${introItalic}">${config.greeting.intro}</p>` : ''}</td></tr>`;
  }

  // HEADLINES - Uses same styling as entity sections, just shows headlines without bullets
  if (config.headlines.enabled) {
    const hf = config.headlines;
    const ef = config.entities; // Use entities config for consistent styling
    const titleColor = getFontColor(ef.sectionFont, c.textPrimary);
    const subTitleColor = getFontColor(ef.subSectionFont, c.accent);
    const nameColor = getFontColor(ef.nameFont, c.textPrimary);
    const headlineColor = getFontColor(ef.headlineFont, c.textSecondary);
    // Use config headlinesBackground if set, otherwise fallback to 1% opacity accent
    const headlinesFill = c.headlinesBackground || `${c.accent}03`; // 03 hex = ~1% opacity

    // Increased padding to 32px
    html += `<tr data-section="headlines"><td style="padding:32px;background-color:#ffffff;cursor:pointer;" class="padding-mobile"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody>`;

    // Extra "Today's Headlines" title (only difference from entity sections)
    if (hf.showSectionTitle) {
      // Use hf.sectionFont (Headlines Font) instead of ef.sectionFont so defaults like Uppercase work
      html += `<tr><td style="padding:0 0 8px 0;"><p style="margin:0;padding:0;font-family:${escapeFont(hf.sectionFont.family)};font-size:${hf.sectionFont.size}px;line-height:${Math.round(hf.sectionFont.size * 1.6)}px;letter-spacing:0.3px;color:${c.accent};${getExtraFontStyles(hf.sectionFont)}">${hf.sectionTitle}</p></td></tr>`;
    }

    // Companies headlines - uses same styling as entity sections
    if (data.companies?.length) {
      if (hf.showCategories) {
        html += `<tr><td style="padding:0 0 8px 0;"><p style="margin:0;padding:0;font-family:${escapeFont(ef.sectionFont.family)};font-size:${ef.sectionFont.size}px;line-height:${Math.round(ef.sectionFont.size * 1.6)}px;font-weight:${ef.sectionFont.bold ? '700' : '400'};letter-spacing:0.3px;color:${titleColor};${getEntityBorderStyle()}${getExtraFontStyles(ef.sectionFont)}">${hf.companiesTitle}</p>`;
        // Fixed width underline like entity sections
        if (config.entities.borderStyle === 'fixed') {
          const borderColor = config.entities.borderColor === 'accent' ? c.accent : c.border;
          html += `<div style="width:40px;height:3px;background-color:${borderColor};margin-top:4px;"></div>`;
        }
        html += `</td></tr>`;
      }

      let lastSubCategory = '';
      data.companies.forEach((company: any) => {
        // Subcategories logic
        if (hf.showCategories && hf.showSubCategories && company.subCategory && company.subCategory !== lastSubCategory) {
          html += `<tr><td style="padding:20px 0 8px 0;border-bottom:0.5px solid #F1F1F0;"><p style="margin:0;padding:0;font-family:${escapeFont(hf.subSectionFont.family)};font-size:14px;line-height:22px;font-weight:${hf.subSectionFont.bold ? '700' : '400'};letter-spacing:0.3px;color:${c.textPrimary};text-transform:uppercase;${getExtraFontStyles(hf.subSectionFont)}">${company.subCategory}</p></td></tr>`;
          lastSubCategory = company.subCategory;
        }
        // Headlines with company logo on the left (if showImage is enabled)
        if (company.articles?.length) {
          company.articles.forEach((article: any) => {
            if (hf.showImage && company.logoUrl) {
              // Show company logo on the left
              html += `<tr><td style="padding:10px 0;border-bottom:0.5px solid #F1F1F0;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="32" valign="top" style="padding:0 8px 0 0;"><img src="${company.logoUrl}" alt="" width="24" height="24" style="display:block;width:24px;height:24px;border-radius:4px;border:0.5px solid #F1F1F0;"></td><td valign="top">${renderArticleItem(article, { showBullets: false })}</td></tr></tbody></table></td></tr>`;
            } else {
              html += `<tr><td style="padding:10px 0;border-bottom:0.5px solid #F1F1F0;">${renderArticleItem(article, { showBullets: false })}</td></tr>`;
            }
          });
        }
      });
    }

    // People headlines - same styling as Companies
    if (data.people?.length) {
      if (hf.showCategories) {
        html += `<tr><td style="padding:24px 0 8px 0;"><p style="margin:0;padding:0;font-family:${escapeFont(ef.sectionFont.family)};font-size:${ef.sectionFont.size}px;line-height:${Math.round(ef.sectionFont.size * 1.6)}px;font-weight:${ef.sectionFont.bold ? '700' : '400'};letter-spacing:0.3px;color:${titleColor};${getEntityBorderStyle()}${getExtraFontStyles(ef.sectionFont)}">${hf.peopleTitle || 'People'}</p>`;
        // Fixed width underline like entity sections
        if (config.entities.borderStyle === 'fixed') {
          const borderColor = config.entities.borderColor === 'accent' ? c.accent : c.border;
          html += `<div style="width:40px;height:3px;background-color:${borderColor};margin-top:4px;"></div>`;
        }
        html += `</td></tr>`;
      }

      let lastSubCategory = '';
      data.people.forEach((person: any) => {
        // Subcategories logic
        if (hf.showCategories && hf.showSubCategories && person.subCategory && person.subCategory !== lastSubCategory) {
          html += `<tr><td style="padding:20px 0 8px 0;border-bottom:0.5px solid #F1F1F0;"><p style="margin:0;padding:0;font-family:${escapeFont(hf.subSectionFont.family)};font-size:14px;line-height:22px;font-weight:${hf.subSectionFont.bold ? '700' : '400'};letter-spacing:0.3px;color:${c.textPrimary};text-transform:uppercase;${getExtraFontStyles(hf.subSectionFont)}">${person.subCategory}</p></td></tr>`;
          lastSubCategory = person.subCategory;
        }
        // Headlines with person image on the left (if showImage is enabled)
        if (person.articles?.length) {
          person.articles.forEach((article: any) => {
            if (hf.showImage && person.logoUrl) {
              // Show person image on the left
              html += `<tr><td style="padding:10px 0;border-bottom:0.5px solid #F1F1F0;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="32" valign="top" style="padding:0 8px 0 0;"><img src="${person.logoUrl}" alt="" width="24" height="24" style="display:block;width:24px;height:24px;border-radius:4px;border:0.5px solid #F1F1F0;"></td><td valign="top">${renderArticleItem(article, { showBullets: false })}</td></tr></tbody></table></td></tr>`;
            } else {
              html += `<tr><td style="padding:10px 0;border-bottom:0.5px solid #F1F1F0;">${renderArticleItem(article, { showBullets: false })}</td></tr>`;
            }
          });
        }
      });
    }

    // Topics headlines - no images for topics
    if (data.topics?.length) {
      if (hf.showCategories) {
        html += `<tr><td style="padding:24px 0 8px 0;"><p style="margin:0;padding:0;font-family:${escapeFont(ef.sectionFont.family)};font-size:${ef.sectionFont.size}px;line-height:${Math.round(ef.sectionFont.size * 1.6)}px;font-weight:${ef.sectionFont.bold ? '700' : '400'};letter-spacing:0.3px;color:${titleColor};${getEntityBorderStyle()}${getExtraFontStyles(ef.sectionFont)}">${hf.topicsTitle}</p>`;
        // Fixed width underline like entity sections
        if (config.entities.borderStyle === 'fixed') {
          const borderColor = config.entities.borderColor === 'accent' ? c.accent : c.border;
          html += `<div style="width:40px;height:3px;background-color:${borderColor};margin-top:4px;"></div>`;
        }
        html += `</td></tr>`;
      }
      data.topics.forEach((topic: any) => {
        // Topics use a default list icon instead of logo/image
        if (topic.articles?.length) {
          topic.articles.forEach((article: any) => {
            if (hf.showImage) {
              // Default topic icon (list/hamburger icon) in styled box matching company/people
              const topicIcon = `<div style="width:24px;height:24px;border-radius:4px;border:0.5px solid #F1F1F0;display:flex;align-items:center;justify-content:center;background:#FAFAF9;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2" stroke-linecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="3" y1="12" x2="21" y2="12"/>
                  <line x1="3" y1="18" x2="21" y2="18"/>
                </svg>
              </div>`;
              html += `<tr><td style="padding:10px 0;border-bottom:0.5px solid #F1F1F0;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td width="32" valign="top" style="padding:0 8px 0 0;">${topicIcon}</td><td valign="top">${renderArticleItem(article, { showBullets: false })}</td></tr></tbody></table></td></tr>`;
            } else {
              html += `<tr><td style="padding:10px 0;border-bottom:0.5px solid #F1F1F0;">${renderArticleItem(article, { showBullets: false })}</td></tr>`;
            }
          });
        }
      });
    }

    html += `</tbody></table></td></tr>`;
  }

  // ENTITY SECTIONS
  html += renderEntitySection(config.entities.companiesTitle, data.companies, false, 'companies');
  html += renderEntitySection(config.entities.peopleTitle, data.people, false, 'people');
  html += renderEntitySection(config.entities.topicsTitle, data.topics, true, 'topics');

  // FEATURED ARTICLE - Clean minimal card design
  if (config.featuredArticle?.enabled) {
    const fa = config.featuredArticle;
    html += `<tr data-section="featuredArticle"><td style="padding:24px;background-color:#ffffff;cursor:pointer;" class="padding-mobile"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody>
      <tr><td style="padding:0 0 16px 0;"><p style="margin:0;padding:0;font-family:${escapeFont(config.entities.sectionFont.family)};font-size:11px;line-height:1.4;font-weight:600;color:${c.textSecondary};text-transform:uppercase;letter-spacing:0.5px;">${fa.title}</p></td></tr>
      ${fa.imageUrl ? `<tr><td style="padding:0 0 16px 0;"><img src="${fa.imageUrl}" alt="${fa.headline}" style="display:block;width:100%;max-width:100%;height:auto;border-radius:12px;" class="fluid"></td></tr>` : ''}
      <tr><td><p style="margin:0 0 8px 0;padding:0;font-family:${escapeFont(config.entities.headlineFont.family)};font-size:18px;line-height:1.5;color:${c.textPrimary};${getExtraFontStyles(config.entities.headlineFont)}"><a href="${fa.articleUrl}" style="color:${c.textPrimary};text-decoration:none;">${fa.headline}</a></p></td></tr>
      <tr><td><p style="margin:0;padding:0;font-family:${escapeFont(config.entities.bodyFont.family)};font-size:14px;line-height:1.6;color:${c.textSecondary};">${fa.summary}</p></td></tr>
      ${fa.source ? `<tr><td style="padding:12px 0 0 0;"><p style="margin:0;padding:0;font-family:${escapeFont(config.entities.bodyFont.family)};font-size:12px;color:${c.textSecondary};"><a href="${fa.articleUrl}" style="color:${c.accent};text-decoration:none;font-weight:600;">Read more →</a></p></td></tr>` : ''}
    </tbody></table></td></tr>`;
  }

  // STATS BLOCK - Clean minimal metrics
  if (config.statsBlock?.enabled && config.statsBlock?.stats?.length) {
    const sb = config.statsBlock;
    const statsHTML = sb.stats.map(stat => `
      <td width="${Math.floor(100 / sb.stats.length)}%" valign="top" style="padding:16px 8px;text-align:center;" class="stack-column">
        <p style="margin:0 0 4px 0;padding:0;font-family:${escapeFont(config.entities.sectionFont.family)};font-size:28px;color:${c.textPrimary};letter-spacing:-0.5px;${getExtraFontStyles(config.entities.sectionFont)}">${stat.value}</p>
        <p style="margin:0;padding:0;font-family:${escapeFont(config.entities.bodyFont.family)};font-size:12px;color:${c.textSecondary};letter-spacing:0.3px;${getExtraFontStyles(config.entities.bodyFont)}">${stat.label}</p>
      </td>
    `).join('');
    html += `<tr data-section="statsBlock"><td style="padding:24px;background-color:#ffffff;cursor:pointer;" class="padding-mobile"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody>
      <tr><td style="padding:0 0 8px 0;"><p style="margin:0;padding:0;font-family:${escapeFont(config.entities.sectionFont.family)};font-size:11px;line-height:1.4;font-weight:600;color:${c.textSecondary};text-transform:uppercase;letter-spacing:0.5px;">${sb.title}</p></td></tr>
      <tr><td><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr>${statsHTML}</tr></tbody></table></td></tr>
    </tbody></table></td></tr>`;
  }

  // FOOTER IMAGE
  if (config.footerImage?.enabled && config.footerImage?.imageUrl) {
    const fi = config.footerImage;
    const imgTag = `<img src="${fi.imageUrl}" alt="${fi.alt || 'Footer image'}" style="display:block;width:100%;max-width:100%;height:auto;" class="fluid">`;
    html += `<tr data-section="footerImage"><td style="padding:0;cursor:pointer;">
      ${fi.link ? `<a href="${fi.link}" style="display:block;">${imgTag}</a>` : imgTag}
    </td></tr>`;
  }

  // RESEARCH
  if (config.research.enabled && config.research.items?.length) {
    const rf = config.research.font;
    const fColor = getFontColor(rf, c.textSecondary);
    html += `<tr data-section="research"><td style="padding:24px;background-color:#ffffff;cursor:pointer;" class="padding-mobile"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="border-top:1px solid #F1F1F0;padding:16px 0 0 0;"><p style="margin:0 0 4px 0;padding:0;font-family:${escapeFont(rf.family)};font-size:${rf.size}px;line-height:${Math.round(rf.size * 1.4)}px;font-weight:600;color:${c.accent};${getExtraFontStyles(rf)}">${config.research.title}</p><p style="margin:0 0 12px 0;padding:0;font-family:${escapeFont(rf.family)};font-size:${rf.size}px;line-height:${Math.round(rf.size * 1.4)}px;font-weight:600;font-style:italic;color:${fColor};${getExtraFontStyles(rf)}">${config.research.subtitle}</p>${config.research.items.map(r => `<p style="margin:0 0 6px 0;padding:0;font-family:${escapeFont(rf.family)};font-size:${rf.size}px;line-height:${Math.round(rf.size * 1.4)}px;${getExtraFontStyles(rf)}"><a href="${r.url}" style="color:${c.accent};text-decoration:underline;font-weight:600;">${r.title}</a> (<a href="${r.url}" style="color:${c.textPrimary};font-weight:600;text-decoration:none;border-bottom:1px solid ${c.accent};">Link</a>)</p>`).join('')}</td></tr></tbody></table></td></tr>`;
  }

  // FOOTER
  if (config.footer.enabled && config.footer.contacts?.length) {
    const ff = config.footer.font;
    const fColor = getFontColor(ff, c.textSecondary);
    const contactsPerRow = 3;
    const contactRows = [];
    for (let i = 0; i < config.footer.contacts.length; i += contactsPerRow) {
      contactRows.push(config.footer.contacts.slice(i, i + contactsPerRow));
    }

    let contactsHTML = contactRows.map(row => {
      const cells = row.map(contact => `<td width="${Math.floor(100 / contactsPerRow)}%" valign="top" style="padding:0 8px 8px 0;" class="stack-column">${config.footer.showName ? `<p style="margin:0;padding:0;font-family:${escapeFont(ff.family)};font-size:${ff.size}px;line-height:${Math.round(ff.size * 1.4)}px;color:${c.textPrimary};${getExtraFontStyles(ff)}">${contact.name}</p>` : ''}${config.footer.showPhone ? `<p style="margin:0;padding:0;font-family:${escapeFont(ff.family)};font-size:${ff.size}px;line-height:${Math.round(ff.size * 1.4)}px;color:${fColor};${getExtraFontStyles(ff)}">Tel: ${contact.phone}</p>` : ''}${config.footer.showEmail ? `<a href="mailto:${contact.email}" style="font-family:${escapeFont(ff.family)};font-size:${ff.size}px;line-height:${Math.round(ff.size * 1.4)}px;color:${c.accent};text-decoration:underline;${getExtraFontStyles(ff)}">${contact.email}</a>` : ''}</td>`).join('');
      const emptyCells = Array(contactsPerRow - row.length).fill(`<td width="${Math.floor(100 / contactsPerRow)}%" class="stack-column">&nbsp;</td>`).join('');
      return `<tr>${cells}${emptyCells}</tr>`;
    }).join('');

    // Signoff uses its own font config, team/contacts use general footer font.
    const sf = config.footer.signoffFont || ff; // Fallback to ff if signoffFont not defined
    const sfColor = getFontColor(sf, c.textPrimary);
    html += `<tr data-section="footer"><td style="padding:24px;background-color:#ffffff;cursor:pointer;" class="padding-mobile"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="border-top:1px solid #F1F1F0;padding:16px 0 8px 0;"><p style="margin:0 0 12px 0;padding:0;font-family:${escapeFont(sf.family)};font-size:${sf.size}px;line-height:${Math.round(sf.size * 1.5)}px;color:${sfColor};${getExtraFontStyles(sf)}">${config.footer.signoff}</p><p style="margin:0 0 12px 0;padding:0;font-family:${escapeFont(ff.family)};font-size:${ff.size}px;line-height:${Math.round(ff.size * 1.4)}px;color:${fColor};${getExtraFontStyles(ff)}">${config.footer.teamName}</p><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody>${contactsHTML}</tbody></table></td></tr></tbody></table></td></tr>`;
  }

  // DISCLAIMER (Footer) - with social icons on bottom right
  if (config.disclaimer.enabled) {
    const df = config.disclaimer.font;
    const dColor = getFontColor(df, c.textSecondary);

    // Generate social icons HTML if socialLinks are configured
    let socialsHTML = '';
    if (config.disclaimer.socialLinks?.length) {
      const platformLogos: Record<string, string> = {
        'linkedin': 'linkedin.com', 'twitter': 'twitter.com', 'x': 'x.com',
        'facebook': 'facebook.com', 'instagram': 'instagram.com', 'youtube': 'youtube.com',
        'github': 'github.com', 'website': 'globe.com', 'email': 'gmail.com',
        'tiktok': 'tiktok.com', 'discord': 'discord.com', 'telegram': 'telegram.org',
        'medium': 'medium.com', 'reddit': 'reddit.com',
      };
      const iconsHTML = config.disclaimer.socialLinks.map((link: any) => {
        const domain = platformLogos[link.platform.toLowerCase()] || `${link.platform.toLowerCase()}.com`;
        const logoUrl = `https://img.logo.dev/${domain}?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ`;
        return `<td style="padding:0 4px;"><a href="${link.url}" style="display:block;" title="${link.label || link.platform}"><img src="${logoUrl}" alt="${link.label || link.platform}" width="20" height="20" style="display:block;width:20px;height:20px;border-radius:4px;"></a></td>`;
      }).join('');
      socialsHTML = `<table border="0" cellpadding="0" cellspacing="0" style="margin-left:auto;"><tbody><tr>${iconsHTML}</tr></tbody></table>`;
    }

    // Two-column layout: left = privacy links, right = social icons
    const linksHTML = (config.disclaimer.showUnsubscribe || config.disclaimer.showPrivacy)
      ? `${config.disclaimer.showUnsubscribe ? `<a href="#" style="color:${c.accent};text-decoration:underline;">Unsubscribe</a>` : ''}${config.disclaimer.showUnsubscribe && config.disclaimer.showPrivacy ? ' | ' : ''}${config.disclaimer.showPrivacy ? `<a href="#" style="color:${c.accent};text-decoration:underline;">Privacy Policy</a>` : ''}`
      : '';

    html += `<tr data-section="disclaimer"><td style="padding:24px;background-color:#ffffff;cursor:pointer;" class="padding-mobile"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody>
      <tr><td style="border-top:1px solid #F1F1F0;padding:16px 0 0 0;font-family:${escapeFont(df.family)};font-size:${df.size}px;line-height:${Math.round(df.size * 1.5)}px;color:${dColor};">
        <p style="margin:0 0 8px 0;padding:0;"><span style="font-weight:600;color:${c.textPrimary};">IMPORTANT NOTICE:</span> ${config.disclaimer.text}</p>
        <table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr>
          <td valign="middle" style="padding:8px 0 0 0;">${linksHTML}</td>
          <td valign="middle" align="right" style="padding:8px 0 0 0;">${socialsHTML}</td>
        </tr></tbody></table>
      </td></tr>
    </tbody></table></td></tr>`;
  }

  // Add interactive script and styles for hover/click communication
  html += `</tbody></table></td></tr></tbody></table></td></tr></tbody></table>
  <style>
    [data-section] {
      transition: all 0.15s ease-out;
      cursor: pointer;
      position: relative;
    }
    [data-section]:hover {
      background: rgba(0, 122, 255, 0.03) !important;
      outline: 2px solid rgba(0, 122, 255, 0.5);
      outline-offset: -2px;
      border-radius: 4px;
    }
    [data-section].selected {
      background: rgba(0, 122, 255, 0.06) !important;
      outline: 2px solid #007AFF;
      outline-offset: -2px;
      border-radius: 4px;
    }
    [data-section]::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: transparent;
      transition: background 0.15s ease-out;
    }
    [data-section]:hover::before {
      background: rgba(0, 122, 255, 0.5);
    }
    [data-section].selected::before {
      background: #007AFF;
    }
  </style>
  <script>
    (function() {
      const sections = document.querySelectorAll('[data-section]');
      let currentHover = null;
      let currentSelected = null;
      
      sections.forEach(section => {
        section.addEventListener('mouseenter', (e) => {
          const rect = section.getBoundingClientRect();
          currentHover = section.dataset.section;
          parent.postMessage({ 
            type: 'section-hover', 
            section: section.dataset.section,
            rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
          }, '*');
        });
        
        section.addEventListener('mouseleave', () => {
          currentHover = null;
          parent.postMessage({ type: 'section-leave' }, '*');
        });
        
        section.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          // Remove previous selection
          sections.forEach(s => s.classList.remove('selected'));
          // Add selection to clicked
          section.classList.add('selected');
          currentSelected = section.dataset.section;
          
          const rect = section.getBoundingClientRect();
          parent.postMessage({ 
            type: 'section-click', 
            section: section.dataset.section,
            rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height }
          }, '*');
        });
      });
      
      // Highlight/Selection listener from parent
      window.addEventListener('message', (e) => {
        if (e.data.type === 'highlight-section') {
          sections.forEach(s => s.classList.remove('selected'));
          if (e.data.section) {
            const target = document.querySelector('[data-section="' + e.data.section + '"]');
            if (target) {
              target.classList.add('selected');
              // Scroll into view if needed
              target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
          }
        }
        if (e.data.type === 'clear-selection') {
          sections.forEach(s => s.classList.remove('selected'));
          currentSelected = null;
        }
      });
    })();
  </script>
</body></html>`;
  return html;
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface NewsletterCustomizerProps {
  initialConfig?: any;
  enabledSections?: string[] | null;
}

// Helper to deep merge config (preserves defaults while applying overrides)
const deepMerge = (target: any, source: any): any => {
  if (!source) return target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};

// Helper to initialize section enabled flags from onboarding selections
const initializeEnabledSections = (baseConfig: any, sections: string[] | null | undefined): any => {
  if (!sections || sections.length === 0) return baseConfig;

  const config = JSON.parse(JSON.stringify(baseConfig)); // Deep clone

  // Set enabled flags based on selected sections
  // Companies, People, Topics are CORE - always enabled (not in this list as they don't have .enabled flag)
  if (config.dateBar) config.dateBar.enabled = sections.includes('dateBar');
  if (config.greeting) config.greeting.enabled = sections.includes('greeting');
  if (config.headlines) config.headlines.enabled = sections.includes('headlines');
  if (config.research) config.research.enabled = sections.includes('research');
  if (config.footer) config.footer.enabled = sections.includes('footer');
  if (config.disclaimer) config.disclaimer.enabled = sections.includes('disclaimer');

  // Optional sections (default disabled unless selected)
  if (config.featuredArticle) config.featuredArticle.enabled = sections.includes('featuredArticle');
  if (config.statsBlock) config.statsBlock.enabled = sections.includes('statsBlock');
  if (config.socialLinks) config.socialLinks.enabled = sections.includes('socialLinks');
  if (config.footerImage) config.footerImage.enabled = sections.includes('footerImage');

  return config;
};

export default function NewsletterCustomizer({ initialConfig, enabledSections }: NewsletterCustomizerProps = {}) {
  // Deep merge initial config from onboarding with defaults (preserves all default properties)
  const mergedConfig = initialConfig
    ? deepMerge(defaultConfig, initialConfig)
    : defaultConfig;

  // Initialize with enabled sections from onboarding
  const [config, setConfig] = useState(() => initializeEnabledSections(mergedConfig, enabledSections));
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const [isResizing, setIsResizing] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [hoveredSection, setHoveredSection] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [selectedFromPreview, setSelectedFromPreview] = useState(false);
  const [editorPosition, setEditorPosition] = useState({ top: 0, left: 0 });
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const bboxRef = useRef(null);
  const previewContainerRef = useRef(null);

  // Preview Resizing State
  const [previewWidth, setPreviewWidth] = useState(800);
  const [isResizingPreview, setIsResizingPreview] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizing) {
        // ... existing sidebar resize logic ...
        // Note: We need to reimplement this because we are injecting into the component body
        // But wait, the existing isResizing logic uses "isResizing" state for SIDEBAR.
        // We need to differentiate.
        const newWidth = Math.max(280, Math.min(600, e.clientX));
        setSidebarWidth(newWidth);
      }

      if (isResizingPreview) {
        if (previewContainerRef.current) {
          // Calculate width based on center alignment (2x distance from center)
          const containerRect = previewContainerRef.current.getBoundingClientRect();
          // Center of the container
          const center = containerRect.left + containerRect.width / 2;
          const dist = Math.abs(e.clientX - center);
          const newWidth = Math.max(320, Math.min(1200, dist * 2));
          setPreviewWidth(newWidth);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsResizingPreview(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isResizing || isResizingPreview) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isResizing ? 'col-resize' : 'ew-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing, isResizingPreview]);
  const updateConfig = (path, value) => {
    setConfig(prev => {
      const newConfig = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newConfig;
      for (let i = 0; i < keys.length - 1; i++) current = current[keys[i]];
      current[keys[keys.length - 1]] = value;
      return newConfig;
    });
  };

  const addContact = () => {
    setConfig(prev => ({ ...prev, footer: { ...prev.footer, contacts: [...prev.footer.contacts, { name: `Contact ${prev.footer.contacts.length + 1}`, phone: '+91 00 0000 0000', email: 'email@company.com' }] } }));
  };

  const removeContact = (index) => {
    if (config.footer.contacts.length > 1) {
      setConfig(prev => ({ ...prev, footer: { ...prev.footer, contacts: prev.footer.contacts.filter((_, i) => i !== index) } }));
    }
  };

  const addResearchItem = () => {
    setConfig(prev => ({ ...prev, research: { ...prev.research, items: [...prev.research.items, { title: `Research Report ${prev.research.items.length + 1}`, url: '#' }] } }));
  };

  const removeResearchItem = (index) => {
    if (config.research.items.length > 1) {
      setConfig(prev => ({ ...prev, research: { ...prev.research, items: prev.research.items.filter((_, i) => i !== index) } }));
    }
  };

  const previewHTML = useMemo(() => generateHTML(config), [config]);

  const exportHTML = () => {
    const blob = new Blob([previewHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-template.html';
    a.click();
  };

  // Resize handlers
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing || !containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newWidth = e.clientX - containerRect.left;
    setSidebarWidth(Math.min(Math.max(280, newWidth), 600));
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Attach global mouse events for resize



  // Handle iframe messages for interactive preview
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data.type === 'section-hover') {
        setHoveredSection(e.data.section);
      } else if (e.data.type === 'section-leave') {
        setHoveredSection(null);
      } else if (e.data.type === 'section-click') {
        setSelectedSection(e.data.section);
        setSelectedFromPreview(true); // Mark as selected from preview for floating editor
        // Calculate editor position based on section rect (viewport-relative via iframe)
        if (iframeRef.current && e.data.rect) {
          const iframeRect = iframeRef.current.getBoundingClientRect();
          // Position the editor at the top of the clicked section, relative to viewport
          const viewportTop = iframeRect.top + e.data.rect.top - (iframeRef.current.contentWindow?.scrollY || 0);
          // Clamp to keep editor visible in viewport (min 80px from top, max so it doesn't go off-screen)
          const clampedTop = Math.max(80, Math.min(viewportTop, window.innerHeight - 500));
          setEditorPosition({
            top: clampedTop,
            left: 0 // We'll use right positioning instead
          });
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Keyboard shortcut for sidebar toggle (Cmd+\)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '\\') {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
      if (e.key === 'Escape' && selectedSection) {
        setSelectedSection(null);
        // Also clear selection in iframe
        if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'clear-selection' }, '*');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedSection]);

  // Highlight section in iframe when hovered or selected
  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'highlight-section',
        section: selectedSection || hoveredSection
      }, '*');
    }
  }, [selectedSection, hoveredSection]);

  // Close editor when clicking outside
  const handlePreviewClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setSelectedSection(null);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="h-screen flex flex-col"
      style={{
        fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Segoe UI', Roboto, sans-serif",
        background: 'linear-gradient(180deg, #fafafa 0%, #f0f0f5 100%)'
      }}
    >
      {/* macOS-style Header */}
      <header
        className="flex items-center justify-between flex-shrink-0 px-6 py-3.5"
        style={{
          background: 'rgba(255,255,255,0.72)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.08)'
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)' }}
          >
            <Mail size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-semibold text-[#1d1d1f] tracking-[-0.01em]">Newsletter Customizer</h1>
            <p className="text-[12px] text-[#86868b]">Design your email template</p>
          </div>
        </div>
        <button
          onClick={exportHTML}
          className="px-4 py-2 text-[13px] font-medium text-white rounded-lg transition-all active:scale-[0.97]"
          style={{
            background: 'linear-gradient(180deg, #007AFF 0%, #0066DD 100%)',
            boxShadow: '0 1px 3px rgba(0,122,255,0.3), inset 0 1px 0 rgba(255,255,255,0.15)'
          }}
        >
          <span className="flex items-center gap-1.5">
            <Download size={14} />Export HTML
          </span>
        </button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="flex-shrink-0 w-8 flex flex-col items-center justify-start pt-4 gap-3 hover:bg-black/5 transition-colors"
          style={{ background: 'rgba(255,255,255,0.3)' }}
          title={sidebarCollapsed ? 'Show Sidebar (⌘+\\)' : 'Hide Sidebar (⌘+\\)'}
        >
          <ChevronLeft
            size={16}
            className={`text-gray-500 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Collapsible Sidebar Panel */}
        <div
          className="flex-shrink-0 overflow-hidden transition-all duration-300 ease-out"
          style={{
            width: sidebarCollapsed ? 0 : sidebarWidth,
            opacity: sidebarCollapsed ? 0 : 1,
          }}
        >
          <div
            className="h-full overflow-y-auto"
            style={{
              width: sidebarWidth,
              background: 'rgba(255,255,255,0.5)',
              backdropFilter: 'blur(40px)',
              WebkitBackdropFilter: 'blur(40px)',
            }}
          >
            <div className="p-3 space-y-3">
              {/* Global Theme Panel - Always visible */}
              <GlobalThemePanel config={config} updateConfig={updateConfig} />

              {/* Section Editor - Shows when section selected from preview */}
              {selectedSection ? (
                <SectionEditor
                  section={selectedSection}
                  config={config}
                  updateConfig={updateConfig}
                  onClose={() => setSelectedSection(null)}
                />
              ) : (
                /* Section Quick Access - Click to edit */
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                        <Layout size={14} className="text-white" />
                      </div>
                      <span className="text-[14px] font-semibold text-gray-800">Sections</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">Click a section in the preview to edit it</p>
                  </div>
                  <div className="p-2 space-y-1">
                    {[
                      { id: 'banner', title: 'Banner / Header', icon: Image, color: '#3B82F6' },
                      { id: 'dateBar', title: 'Date Bar', icon: Calendar, color: '#10B981', enabled: config.dateBar?.enabled },
                      { id: 'greeting', title: 'Greeting', icon: MessageSquare, color: '#F59E0B', enabled: config.greeting?.enabled },
                      { id: 'headlines', title: 'Headlines', icon: List, color: '#8B5CF6', enabled: config.headlines?.enabled },
                      { id: 'featuredArticle', title: 'Featured Article', icon: Star, color: '#F97316', enabled: config.featuredArticle?.enabled },
                      { id: 'companies', title: 'Companies', icon: Users, color: '#EC4899' },
                      { id: 'people', title: 'People', icon: Users, color: '#06B6D4' },
                      { id: 'topics', title: 'Topics', icon: FileText, color: '#6366F1' },
                      { id: 'statsBlock', title: 'Stats Block', icon: BarChart3, color: '#14B8A6', enabled: config.statsBlock?.enabled },
                      { id: 'research', title: 'Research', icon: FileText, color: '#14B8A6', enabled: config.research?.enabled },
                      { id: 'footer', title: 'Footer', icon: Mail, color: '#F97316', enabled: config.footer?.enabled },
                      { id: 'footerImage', title: 'Footer Image', icon: Image, color: '#64748B', enabled: config.footerImage?.enabled },
                      { id: 'disclaimer', title: 'Disclaimer', icon: AlertCircle, color: '#EF4444', enabled: config.disclaimer?.enabled },
                    ].map(section => {
                      const Icon = section.icon;
                      const isEnabled = section.enabled !== false;
                      return (
                        <button
                          key={section.id}
                          onClick={() => { setSelectedSection(section.id); setSelectedFromPreview(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left
                            ${isEnabled ? 'hover:bg-gray-50' : 'opacity-50'}`}
                        >
                          <div
                            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${section.color}20` }}
                          >
                            <Icon size={12} style={{ color: section.color }} />
                          </div>
                          <span className="text-[13px] text-gray-700 flex-1">{section.title}</span>
                          {!isEnabled && (
                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">OFF</span>
                          )}
                          <ChevronRight size={14} className="text-gray-300" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resize Handle - only show when sidebar is expanded */}
        {!sidebarCollapsed && (
          <div
            onMouseDown={handleMouseDown}
            className="w-1 hover:w-1.5 bg-transparent hover:bg-blue-400/50 cursor-col-resize transition-all flex-shrink-0 group flex items-center justify-center"
            style={{ marginLeft: -2, marginRight: -2 }}
          >
            <div className="w-0.5 h-8 bg-gray-300 group-hover:bg-blue-500 rounded-full transition-colors opacity-0 group-hover:opacity-100" />
          </div>
        )}

        {/* Preview Pane */}
        <div
          ref={previewContainerRef}
          className="flex-1 flex flex-col overflow-hidden relative"
          style={{ background: '#ffffff' }}
          onClick={handlePreviewClick}
        >
          {/* Preview Header */}
          <div
            className="px-5 py-2.5 flex items-center gap-2.5 border-b"
            style={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'saturate(180%) blur(20px)',
              WebkitBackdropFilter: 'saturate(180%) blur(20px)',
              borderColor: 'rgba(0,0,0,0.08)'
            }}
          >
            <div className="w-5 h-5 rounded-[5px] bg-[#f5f5f7] flex items-center justify-center">
              <Eye size={12} className="text-[#86868b]" />
            </div>
            <span className="text-[13px] font-medium text-[#1d1d1f]">Live Preview</span>

            {/* Device Toggles */}
            <div className="flex items-center gap-1 ml-4 bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              <button
                onClick={() => setPreviewWidth(375)}
                className={`p-1.5 rounded-md transition-all ${previewWidth === 375 ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Mobile (375px)"
              >
                <div className="w-2.5 h-4 border-2 border-current rounded-[2px]" />
              </button>
              <button
                onClick={() => setPreviewWidth(800)}
                className={`p-1.5 rounded-md transition-all ${previewWidth === 800 ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                title="Desktop (800px)"
              >
                <div className="w-4 h-3.5 border-2 border-current rounded-[2px]" />
              </button>
            </div>
            <span className="text-[11px] text-gray-400 ml-2">{Math.round(previewWidth)}px</span>

            {/* Editing indicator - shows current section being edited */}
            {selectedSection && (
              <div className="ml-auto flex items-center gap-2 animate-in fade-in duration-200">
                <span className="text-[11px] text-gray-400">Editing:</span>
                <span
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-white flex items-center gap-1.5"
                  style={{ background: SECTION_CONFIG[selectedSection]?.color || '#007AFF' }}
                >
                  {(() => {
                    const Icon = SECTION_CONFIG[selectedSection]?.icon || Settings;
                    return <Icon size={10} />;
                  })()}
                  {SECTION_CONFIG[selectedSection]?.title || selectedSection}
                </span>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                  title="Stop editing (Esc)"
                >
                  <X size={12} className="text-gray-500" />
                </button>
              </div>
            )}

            {/* Hover indicator - shows when hovering a section */}
            {!selectedSection && hoveredSection && (
              <div className="ml-auto flex items-center gap-2 animate-in fade-in duration-150">
                <span className="text-[11px] text-gray-400">Click to edit:</span>
                <span
                  className="px-2 py-0.5 rounded-full text-[11px] font-medium text-white"
                  style={{ background: SECTION_CONFIG[hoveredSection]?.color || '#007AFF' }}
                >
                  {SECTION_CONFIG[hoveredSection]?.title || hoveredSection}
                </span>
              </div>
            )}
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-auto p-6 relative flex flex-col items-center bg-[#f5f5f7]">
            <div
              className="relative shadow-xl transition-all duration-75 ease-out"
              style={{
                width: previewWidth,
                minWidth: 320,
                maxWidth: '100%',
                background: '#fff'
              }}
            >
              <iframe
                ref={iframeRef}
                srcDoc={previewHTML}
                title="Newsletter Preview"
                className="w-full border-0 bg-white"
                style={{ height: '2000px', minHeight: '100%' }}
                sandbox="allow-scripts allow-same-origin"
              />

              {/* Resize Handle (Right) */}
              <div
                onMouseDown={() => setIsResizingPreview(true)}
                className="absolute top-0 -right-4 bottom-0 w-4 flex items-center justify-center cursor-ew-resize group opacity-0 hover:opacity-100 transition-opacity"
                title="Drag to resize"
              >
                <div className="w-1.5 h-12 bg-gray-300 rounded-full group-hover:bg-blue-500 transition-colors" />
              </div>

              {/* Resize Handle (Left - purely for visual balance if needed, but right is enough for centering logic) */}
              <div
                onMouseDown={() => setIsResizingPreview(true)}
                className="absolute top-0 -left-4 bottom-0 w-4 flex items-center justify-center cursor-ew-resize group opacity-0 hover:opacity-100 transition-opacity"
                title="Drag to resize"
              >
                <div className="w-1.5 h-12 bg-gray-300 rounded-full group-hover:bg-blue-500 transition-colors" />
              </div>

            </div>
          </div>

          {/* Floating Section Editor - ONLY when selected from preview */}
          {selectedSection && selectedFromPreview && (
            <div
              className="fixed z-50 animate-in fade-in slide-in-from-right-2 duration-200"
              style={{
                top: editorPosition.top,
                right: 60,
                width: 340,
                maxHeight: 'calc(100vh - 120px)',
                overflowY: 'auto'
              }}
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.98)',
                  backdropFilter: 'saturate(180%) blur(20px)',
                  WebkitBackdropFilter: 'saturate(180%) blur(20px)',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid rgba(255,255,255,0.8)'
                }}
              >
                <SectionEditor
                  section={selectedSection}
                  config={config}
                  updateConfig={updateConfig}
                  onClose={() => setSelectedSection(null)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}
