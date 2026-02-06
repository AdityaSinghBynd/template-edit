import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Eye, Palette, Type, Layout, Users, FileText, Mail, AlertCircle, Image, List, Download, Plus, Trash2, Sparkles, Loader2, Calendar, MessageSquare } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// EMAIL-SAFE FONTS
// ═══════════════════════════════════════════════════════════════════════════════
const EMAIL_SAFE_FONTS = [
  { value: 'Arial, Helvetica, sans-serif', label: 'Arial' },
  { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
  { value: 'Georgia, Times, serif', label: 'Georgia' },
  { value: '"Times New Roman", Times, serif', label: 'Times New Roman' },
  { value: 'Verdana, Geneva, sans-serif', label: 'Verdana' },
  { value: 'Tahoma, Geneva, sans-serif', label: 'Tahoma' },
  { value: '"Trebuchet MS", Helvetica, sans-serif', label: 'Trebuchet MS' },
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
    font: { family: 'Arial, Helvetica, sans-serif', size: 11, color: null },
  },
  
  greeting: {
    enabled: true,
    showIntro: true,
    title: 'Good Morning,',
    intro: 'Welcome to your daily AI-generated newsletter. Today\'s edition covers the latest developments across your tracked companies, key industry topics, and relevant market movements.',
    font: { family: 'Georgia, Times, serif', size: 14, color: null },
  },
  
  headlines: {
    enabled: true,
    showSectionTitle: true,
    showSubCategories: true,
    sourceMode: 'below',
    sectionTitle: 'Today\'s headlines',
    companiesTitle: 'Companies',
    topicsTitle: 'Topics',
    sectionFont: { family: 'Arial, Helvetica, sans-serif', size: 19, color: null },
    subSectionFont: { family: 'Arial, Helvetica, sans-serif', size: 13, color: null },
    itemFont: { family: 'Arial, Helvetica, sans-serif', size: 13, color: null },
  },
  
  entities: {
    showLogo: true,
    showSubCategories: true,
    bulletStyle: 'bullet',
    borderStyle: 'full',
    borderColor: 'default',
    companiesTitle: 'Companies',
    peopleTitle: 'People',
    topicsTitle: 'Topics',
    sectionFont: { family: 'Arial, Helvetica, sans-serif', size: 19, color: null },
    subSectionFont: { family: 'Arial, Helvetica, sans-serif', size: 13, color: null },
    nameFont: { family: 'Arial, Helvetica, sans-serif', size: 15, color: null },
    headlineFont: { family: 'Arial, Helvetica, sans-serif', size: 13, color: null },
    bodyFont: { family: 'Arial, Helvetica, sans-serif', size: 12, color: null },
  },
  
  research: {
    enabled: true,
    title: 'Research Reports',
    subtitle: 'Access to our recent reports',
    font: { family: 'Arial, Helvetica, sans-serif', size: 10, color: null },
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
    font: { family: 'Arial, Helvetica, sans-serif', size: 10, color: null },
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
    font: { family: 'Arial, Helvetica, sans-serif', size: 9, color: null },
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE DATA
// ═══════════════════════════════════════════════════════════════════════════════
const exampleData = {
  headlines: {
    companies: [
      { headline: 'Example Company Headline', url: '#', subCategory: 'Example Sub-Category', sources: [{ name: 'Source Name', url: '#' }] },
    ],
    topics: [
      { headline: 'Example Topic Headline', url: '#', sources: [{ name: 'Source Name', url: '#' }] },
    ],
  },
  companies: [
    {
      name: 'Example Company Name',
      websiteUrl: '#',
      logoUrl: 'https://via.placeholder.com/24',
      subCategory: 'Example Sub-Category',
      articles: [
        { headline: 'Example Company News Headline', url: '#', bullets: ['Example company news subpoint 1', 'Example company news subpoint 2'], sources: [{ name: 'Source', url: '#' }] },
      ],
    },
  ],
  people: [
    {
      name: 'Example Person Name',
      websiteUrl: '#',
      logoUrl: 'https://via.placeholder.com/24',
      subCategory: 'Example Sub-Category',
      articles: [
        { headline: 'Example People News Headline', url: '#', bullets: ['Example people news subpoint 1', 'Example people news subpoint 2'], sources: [{ name: 'Source', url: '#' }] },
      ],
    },
  ],
  topics: [
    {
      name: 'Example Topic Name',
      articles: [
        { headline: 'Example Topic News Headline', url: '#', bullets: ['Example topic news subpoint 1', 'Example topic news subpoint 2'], sources: [{ name: 'Source', url: '#' }] },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// UI COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════

const ConfigSection = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors">
        <Icon size={18} className="text-gray-500 flex-shrink-0" />
        <span className="font-semibold text-gray-800 flex-1 text-left text-sm">{title}</span>
        {isOpen ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
      </button>
      {isOpen && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
};

const SubSection = ({ title, children }) => (
  <div className="pt-3 border-t border-gray-100 space-y-3">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
    {children}
  </div>
);

const Toggle = ({ label, checked, onChange, disabled = false }) => (
  <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${checked ? 'bg-teal-600' : 'bg-gray-200'} ${disabled ? 'cursor-not-allowed' : ''}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

const RadioGroup = ({ label, value, onChange, options }) => (
  <div className="space-y-2">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <div className="space-y-2">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
          <span
            onClick={() => onChange(opt.value)}
            className={`relative flex-shrink-0 w-5 h-5 rounded-full border-2 cursor-pointer ${value === opt.value ? 'border-teal-600 bg-teal-600' : 'border-gray-300 bg-white hover:border-teal-400'}`}
          >
            {value === opt.value && <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></span>}
          </span>
          <span className="text-sm text-gray-700">{opt.label}</span>
        </label>
      ))}
    </div>
  </div>
);

const ColorPicker = ({ label, value, onChange }) => (
  <div className="flex items-center gap-3">
    <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-gray-200 flex-shrink-0 p-0" />
    <span className="text-sm text-gray-700 flex-1">{label}</span>
    <span className="text-xs text-gray-400 font-mono">{value}</span>
  </div>
);

const TextInput = ({ label, value, onChange, placeholder = '', multiline = false }) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-600">{label}</label>
    {multiline ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none" />
    ) : (
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full text-sm p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />
    )}
  </div>
);

const FontPicker = ({ label, fontConfig, onChange }) => (
  <div className="space-y-2 p-3 bg-gray-50 rounded-lg">
    <p className="text-xs font-medium text-gray-600">{label}</p>
    <div className="grid grid-cols-2 gap-2">
      <div>
        <label className="text-xs text-gray-500">Font</label>
        <select value={fontConfig.family} onChange={(e) => onChange({ ...fontConfig, family: e.target.value })} className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white">
          {EMAIL_SAFE_FONTS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-500">Size (px)</label>
        <input type="number" value={fontConfig.size} onChange={(e) => onChange({ ...fontConfig, size: parseInt(e.target.value) || 12 })} min={8} max={32} className="w-full text-xs p-1.5 border border-gray-200 rounded bg-white" />
      </div>
    </div>
    <div className="flex items-center gap-2">
      <input type="checkbox" checked={fontConfig.color !== null} onChange={(e) => onChange({ ...fontConfig, color: e.target.checked ? '#000000' : null })} className="rounded" />
      <label className="text-xs text-gray-500">Custom color</label>
      {fontConfig.color !== null && (
        <input type="color" value={fontConfig.color} onChange={(e) => onChange({ ...fontConfig, color: e.target.value })} className="w-6 h-6 rounded cursor-pointer border border-gray-200 p-0" />
      )}
      {fontConfig.color === null && <span className="text-xs text-gray-400">Using theme</span>}
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
      const prompt = `Create a professional email newsletter header banner for a financial/corporate company.

Requirements:
- Dimensions: Exactly 800 pixels wide by 150 pixels tall (wide banner format)
- Company website: ${config.banner.companyWebsite}
${config.banner.logoUrl ? `- Include or reference this logo: ${config.banner.logoUrl}` : '- Use elegant typography for company name'}
- Style: Clean, minimal, professional corporate design
- Layout: Logo/company name on the left side, subtle decorative element on the right
- Colors: Professional palette - can use subtle gradients, light backgrounds
- NO text except company name/logo

Reference styles:
1. Investec style: Logo on left, "Investec Bank plc (UK)" text, subtle zebra illustration on right, light gray-blue gradient background
2. Bynd Intelligence style: Clean white/light background, "Bynd Intelligence" text with blue accent, subtle geometric wave pattern

Generate a sophisticated, professional banner image.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=AIzaSyB_mfteJ8dOqAhz6yTKTHNzLzqtOVxVKqw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: prompt }] }], 
          generationConfig: { 
            responseModalities: ["image", "text"],
            responseMimeType: "text/plain"
          } 
        })
      });
      
      const data = await response.json();
      
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
        setGenerationError('No image was generated. The model may have returned text instead. Try again or use a different prompt.');
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
  
  const getFontColor = (fontConfig, defaultColor) => fontConfig.color || defaultColor;
  const bulletChar = { bullet: '•', arrow: '→', dash: '–', square: '■' }[config.entities.bulletStyle] || '•';
  
  const renderSourcesBelow = (sources) => {
    if (!sources?.length || config.headlines.sourceMode !== 'below') return '';
    return `<p style="margin:4px 0 0 0;padding:0;font-family:${config.headlines.itemFont.family};font-size:11px;line-height:16px;">${sources.map(s => `<a href="${s.url}" style="color:${c.accent};text-decoration:none;">${s.name}</a>`).join('<span style="color:#999;"> | </span>')}</p>`;
  };
  
  const renderHeadline = (item) => {
    const color = getFontColor(config.headlines.itemFont, c.textSecondary);
    if (config.headlines.sourceMode === 'inline' && item.sources?.length) {
      return `<a href="${item.url}" style="color:${color};text-decoration:underline;font-weight:700;">${item.headline}</a> <span style="color:#999;font-weight:400;">(${item.sources[0].name})</span>`;
    }
    return `<a href="${item.url}" style="color:${color};text-decoration:none;font-weight:700;">${item.headline}</a>`;
  };
  
  const renderBullets = (bullets) => {
    if (!bullets?.length) return '';
    const color = getFontColor(config.entities.bodyFont, c.textSecondary);
    const f = config.entities.bodyFont;
    return `<table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:8px 0 0 0;"><tbody>${bullets.map(b => `<tr><td width="16" valign="top" style="padding:0 0 6px 0;font-family:${f.family};font-size:${f.size}px;line-height:${Math.round(f.size * 1.6)}px;color:${color};">${bulletChar}</td><td valign="top" style="padding:0 0 6px 0;font-family:${f.family};font-size:${f.size}px;line-height:${Math.round(f.size * 1.6)}px;color:${color};">${b}</td></tr>`).join('')}</tbody></table>`;
  };
  
  const getEntityBorderStyle = () => {
    const color = config.entities.borderColor === 'accent' ? c.accent : c.border;
    return config.entities.borderStyle === 'short' ? `display:inline-block;border-bottom:2px solid ${color};padding-bottom:4px;` : `border-bottom:2px solid ${color};padding-bottom:4px;`;
  };
  
  const renderEntitySection = (title, entities, isTopics = false) => {
    if (!entities?.length) return '';
    const ef = config.entities;
    const titleColor = getFontColor(ef.sectionFont, c.accent);
    const subTitleColor = getFontColor(ef.subSectionFont, c.accent);
    const nameColor = getFontColor(ef.nameFont, c.textPrimary);
    const headlineColor = getFontColor(ef.headlineFont, c.textSecondary);
    
    let html = `<tr><td style="padding:24px 24px 0 24px;"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="padding:0 0 8px 0;"><p style="margin:0;padding:0;font-family:${ef.sectionFont.family};font-size:${ef.sectionFont.size}px;line-height:${Math.round(ef.sectionFont.size * 1.6)}px;font-weight:700;color:${titleColor};${getEntityBorderStyle()}">${title}</p></td></tr>`;
    
    entities.forEach((entity, idx) => {
      if (!isTopics && config.entities.showSubCategories && entity.subCategory) {
        html += `<tr><td style="padding:20px 0 4px 0;"><p style="margin:0;padding:0;font-family:${ef.subSectionFont.family};font-size:${ef.subSectionFont.size}px;line-height:${Math.round(ef.subSectionFont.size * 1.6)}px;font-weight:600;color:${subTitleColor};text-transform:uppercase;">${entity.subCategory}</p></td></tr>`;
      }
      
      html += `<tr><td style="padding:16px 0 0 0;${idx > 0 ? `border-top:1px solid ${c.border};` : ''}"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody>`;
      
      if (!isTopics) {
        html += `<tr><td style="padding:0 0 12px 0;"><table border="0" cellpadding="0" cellspacing="0"><tbody><tr>`;
        if (config.entities.showLogo && entity.logoUrl) {
          html += `<td width="32" valign="middle" style="padding:0 8px 0 0;"><img src="${entity.logoUrl}" alt="" width="24" height="24" style="display:block;width:24px;height:24px;border-radius:4px;border:1px solid ${c.border};"></td>`;
        }
        html += `<td valign="middle"><a href="${entity.websiteUrl || '#'}" target="_blank" style="text-decoration:none;"><p style="margin:0;padding:0;font-family:${ef.nameFont.family};font-size:${ef.nameFont.size}px;line-height:${Math.round(ef.nameFont.size * 1.6)}px;font-weight:700;color:${nameColor};">${entity.name}</p></a></td></tr></tbody></table></td></tr>`;
      } else {
        const topicColor = getFontColor(ef.nameFont, c.accent);
        html += `<tr><td style="padding:0 0 12px 0;"><p style="margin:0;padding:0;font-family:${ef.nameFont.family};font-size:${ef.nameFont.size}px;line-height:${Math.round(ef.nameFont.size * 1.6)}px;font-weight:700;color:${topicColor};">${entity.name}</p></td></tr>`;
      }
      
      entity.articles?.forEach(article => {
        html += `<tr><td style="padding:0 0 16px 0;"><p style="margin:0 0 8px 0;padding:0;font-family:${ef.headlineFont.family};font-size:${ef.headlineFont.size}px;line-height:${Math.round(ef.headlineFont.size * 1.6)}px;font-weight:700;"><a href="${article.url}" style="color:${headlineColor};text-decoration:underline;">${article.headline}</a></p>${renderBullets(article.bullets)}</td></tr>`;
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
<body style="margin:0;padding:0;background-color:#ffffff;width:100%;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#ffffff;">
    <tbody>
      <tr>
        <td align="center" style="padding:0;">
          <table border="0" cellpadding="0" cellspacing="0" width="800" class="email-container" style="max-width:800px;background-color:#ffffff;">
            <tbody>`;

  // BANNER
  if (config.banner.type === 'image' || config.banner.type === 'generate') {
    html += `<tr><td style="padding:0;"><img src="${config.banner.imageUrl}" alt="Banner" width="800" style="display:block;width:100%;max-width:800px;height:auto;border:1px solid ${c.border};" class="fluid"></td></tr>`;
  } else {
    html += `<tr><td style="padding:0;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid ${c.border};background-color:#ffffff;"><tbody><tr><td style="padding:24px;" class="padding-mobile"><p style="margin:0;padding:0;font-family:${config.entities.sectionFont.family};font-size:28px;line-height:36px;font-weight:700;color:${c.accent};">${config.banner.companyName}</p></td></tr></tbody></table></td></tr>`;
  }
  
  html += `<tr><td style="padding:0;"><table border="0" cellpadding="0" cellspacing="0" width="100%" style="border:1px solid ${c.border};border-top:0;background-color:#ffffff;"><tbody>`;

  // DATE BAR
  if (config.dateBar.enabled) {
    const df = config.dateBar.font;
    html += `<tr><td style="background-color:${c.dateBarFill};padding:4px 24px;" class="padding-mobile"><p style="margin:0;padding:0;font-family:${df.family};font-size:${df.size}px;line-height:18px;font-weight:500;color:${getFontColor(df, c.textPrimary)};">${config.dateBar.text}</p></td></tr>`;
  }
  
  // GREETING
  if (config.greeting.enabled) {
    const gf = config.greeting.font;
    const greetingColor = getFontColor(gf, c.accent);
    const introColor = getFontColor(gf, c.textSecondary);
    html += `<tr><td style="padding:16px 24px;background-color:#ffffff;" class="padding-mobile"><p style="margin:0 0 16px 0;padding:0;font-family:${gf.family};font-size:${gf.size}px;line-height:${Math.round(gf.size * 2)}px;font-weight:600;color:${greetingColor};font-style:italic;">${config.greeting.title}</p>${config.greeting.showIntro ? `<p style="margin:0;padding:0;font-family:${gf.family};font-size:${gf.size}px;line-height:${Math.round(gf.size * 1.4)}px;font-weight:200;color:${introColor};font-style:italic;">${config.greeting.intro}</p>` : ''}</td></tr>`;
  }
  
  // HEADLINES
  if (config.headlines.enabled) {
    const hf = config.headlines;
    const titleColor = getFontColor(hf.sectionFont, c.accent);
    const subColor = getFontColor(hf.subSectionFont, c.accent);
    
    html += `<tr><td style="padding:24px;background-color:#ffffff;" class="padding-mobile"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody>`;
    
    if (hf.showSectionTitle) {
      html += `<tr><td style="padding:0 0 16px 0;"><p style="margin:0;padding:0;font-family:${hf.sectionFont.family};font-size:${hf.sectionFont.size}px;line-height:${Math.round(hf.sectionFont.size * 1.6)}px;font-weight:600;color:${titleColor};">${hf.sectionTitle}</p></td></tr>`;
    }
    
    if (data.headlines.companies?.length) {
      html += `<tr><td style="padding:0 0 8px 0;border-bottom:1px solid ${c.border};"><p style="margin:0;padding:0;font-family:${config.entities.nameFont.family};font-size:15px;line-height:24px;font-weight:700;color:${c.textPrimary};">${hf.companiesTitle}</p></td></tr>`;
      if (hf.showSubCategories && data.headlines.companies[0]?.subCategory) {
        html += `<tr><td style="padding:16px 0 8px 0;"><p style="margin:0;padding:0;font-family:${hf.subSectionFont.family};font-size:${hf.subSectionFont.size}px;line-height:${Math.round(hf.subSectionFont.size * 1.6)}px;font-weight:600;color:${subColor};text-transform:uppercase;">${data.headlines.companies[0].subCategory}</p></td></tr>`;
      }
      data.headlines.companies.forEach(item => {
        html += `<tr><td style="padding:8px 0;"><p style="margin:0;padding:0;font-family:${hf.itemFont.family};font-size:${hf.itemFont.size}px;line-height:${Math.round(hf.itemFont.size * 1.6)}px;">${renderHeadline(item)}</p>${renderSourcesBelow(item.sources)}</td></tr>`;
      });
    }
    
    if (data.headlines.topics?.length) {
      html += `<tr><td style="padding:24px 0 8px 0;border-bottom:1px solid ${c.border};"><p style="margin:0;padding:0;font-family:${config.entities.nameFont.family};font-size:15px;line-height:24px;font-weight:700;color:${c.textPrimary};">${hf.topicsTitle}</p></td></tr>`;
      data.headlines.topics.forEach(item => {
        html += `<tr><td style="padding:8px 0;"><p style="margin:0;padding:0;font-family:${hf.itemFont.family};font-size:${hf.itemFont.size}px;line-height:${Math.round(hf.itemFont.size * 1.6)}px;">${renderHeadline(item)}</p>${renderSourcesBelow(item.sources)}</td></tr>`;
      });
    }
    
    html += `</tbody></table></td></tr>`;
  }

  // ENTITY SECTIONS
  html += renderEntitySection(config.entities.companiesTitle, data.companies);
  html += renderEntitySection(config.entities.peopleTitle, data.people);
  html += renderEntitySection(config.entities.topicsTitle, data.topics, true);

  // RESEARCH
  if (config.research.enabled && config.research.items?.length) {
    const rf = config.research.font;
    const fColor = getFontColor(rf, c.textSecondary);
    html += `<tr><td style="padding:24px;background-color:#ffffff;" class="padding-mobile"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="border-top:1px solid ${c.border};padding:16px 0 0 0;"><p style="margin:0 0 4px 0;padding:0;font-family:${rf.family};font-size:${rf.size}px;line-height:${Math.round(rf.size * 1.4)}px;font-weight:700;color:${c.accent};">${config.research.title}</p><p style="margin:0 0 12px 0;padding:0;font-family:${rf.family};font-size:${rf.size}px;line-height:${Math.round(rf.size * 1.4)}px;font-weight:700;font-style:italic;color:${fColor};">${config.research.subtitle}</p>${config.research.items.map(r => `<p style="margin:0 0 6px 0;padding:0;font-family:${rf.family};font-size:${rf.size}px;line-height:${Math.round(rf.size * 1.4)}px;"><a href="${r.url}" style="color:${c.accent};text-decoration:underline;font-weight:700;">${r.title}</a> (<a href="${r.url}" style="color:${c.textPrimary};font-weight:700;text-decoration:none;border-bottom:1px solid ${c.accent};">Link</a>)</p>`).join('')}</td></tr></tbody></table></td></tr>`;
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
      const cells = row.map(contact => `<td width="${Math.floor(100 / contactsPerRow)}%" valign="top" style="padding:0 8px 8px 0;" class="stack-column">${config.footer.showName ? `<p style="margin:0;padding:0;font-family:${ff.family};font-size:${ff.size}px;line-height:${Math.round(ff.size * 1.4)}px;font-weight:700;color:${c.textPrimary};">${contact.name}</p>` : ''}${config.footer.showPhone ? `<p style="margin:0;padding:0;font-family:${ff.family};font-size:${ff.size}px;line-height:${Math.round(ff.size * 1.4)}px;color:${fColor};">Tel: ${contact.phone}</p>` : ''}${config.footer.showEmail ? `<a href="mailto:${contact.email}" style="font-family:${ff.family};font-size:${ff.size}px;line-height:${Math.round(ff.size * 1.4)}px;color:${c.accent};text-decoration:underline;">${contact.email}</a>` : ''}</td>`).join('');
      const emptyCells = Array(contactsPerRow - row.length).fill(`<td width="${Math.floor(100 / contactsPerRow)}%" class="stack-column">&nbsp;</td>`).join('');
      return `<tr>${cells}${emptyCells}</tr>`;
    }).join('');
    
    html += `<tr><td style="padding:24px;background-color:#ffffff;" class="padding-mobile"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="border-top:1px solid ${c.border};border-bottom:1px solid ${c.border};padding:16px 0 8px 0;"><p style="margin:0 0 12px 0;padding:0;font-family:${ff.family};font-size:${Math.round(ff.size * 1.1)}px;line-height:${Math.round(ff.size * 1.5)}px;font-weight:700;color:${fColor};">${config.footer.signoff}</p><p style="margin:0 0 12px 0;padding:0;font-family:${ff.family};font-size:${ff.size}px;line-height:${Math.round(ff.size * 1.4)}px;font-weight:700;color:${c.accent};">${config.footer.teamName}</p><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody>${contactsHTML}</tbody></table></td></tr></tbody></table></td></tr>`;
  }

  // DISCLAIMER
  if (config.disclaimer.enabled) {
    const df = config.disclaimer.font;
    const dColor = getFontColor(df, c.textSecondary);
    html += `<tr><td style="padding:24px;background-color:#ffffff;" class="padding-mobile"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="font-family:${df.family};font-size:${df.size}px;line-height:${Math.round(df.size * 1.5)}px;color:${dColor};"><p style="margin:0 0 8px 0;padding:0;"><span style="font-weight:700;color:${c.textPrimary};">IMPORTANT NOTICE:</span> ${config.disclaimer.text}</p>${(config.disclaimer.showUnsubscribe || config.disclaimer.showPrivacy) ? `<p style="margin:0;padding:0;">${config.disclaimer.showUnsubscribe ? `<a href="#" style="color:${c.accent};text-decoration:underline;">Unsubscribe</a>` : ''}${config.disclaimer.showUnsubscribe && config.disclaimer.showPrivacy ? ' | ' : ''}${config.disclaimer.showPrivacy ? `<a href="#" style="color:${c.accent};text-decoration:underline;">Privacy Policy</a>` : ''}</p>` : ''}</td></tr></tbody></table></td></tr>`;
  }

  html += `</tbody></table></td></tr></tbody></table></td></tr></tbody></table></body></html>`;
  return html;
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function NewsletterCustomizer() {
  const [config, setConfig] = useState(defaultConfig);
  
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
  
  return (
    <div className="h-screen flex flex-col bg-gray-100" style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <header className="bg-white border-b border-gray-200 px-5 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center">
            <Mail size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">Newsletter Template Customizer</h1>
            <p className="text-xs text-gray-500">Responsive email template builder</p>
          </div>
        </div>
        <button onClick={exportHTML} className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 font-medium">
          <Download size={16} />Export HTML
        </button>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[420px] bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          
          {/* Banner */}
          <ConfigSection title="Banner / Header" icon={Image} defaultOpen={true}>
            <BannerGenerator config={config} updateConfig={updateConfig} />
          </ConfigSection>
          
          {/* Theme Colors */}
          <ConfigSection title="Theme Colors" icon={Palette}>
            <ColorPicker label="Accent" value={config.theme.colors.accent} onChange={(v) => updateConfig('theme.colors.accent', v)} />
            <ColorPicker label="Text Primary" value={config.theme.colors.textPrimary} onChange={(v) => updateConfig('theme.colors.textPrimary', v)} />
            <ColorPicker label="Text Secondary" value={config.theme.colors.textSecondary} onChange={(v) => updateConfig('theme.colors.textSecondary', v)} />
            <ColorPicker label="Border" value={config.theme.colors.border} onChange={(v) => updateConfig('theme.colors.border', v)} />
            <ColorPicker label="Date Bar Fill" value={config.theme.colors.dateBarFill} onChange={(v) => updateConfig('theme.colors.dateBarFill', v)} />
          </ConfigSection>
          
          {/* Date Bar */}
          <ConfigSection title="Date Bar" icon={Calendar}>
            <Toggle label="Show Date Bar" checked={config.dateBar.enabled} onChange={(v) => updateConfig('dateBar.enabled', v)} />
            {config.dateBar.enabled && (
              <>
                <TextInput label="Date Text" value={config.dateBar.text} onChange={(v) => updateConfig('dateBar.text', v)} />
                <FontPicker label="Date Font" fontConfig={config.dateBar.font} onChange={(v) => updateConfig('dateBar.font', v)} />
              </>
            )}
          </ConfigSection>
          
          {/* Greeting */}
          <ConfigSection title="Greeting" icon={MessageSquare}>
            <Toggle label="Show Greeting" checked={config.greeting.enabled} onChange={(v) => updateConfig('greeting.enabled', v)} />
            {config.greeting.enabled && (
              <>
                <Toggle label="Show Introduction" checked={config.greeting.showIntro} onChange={(v) => updateConfig('greeting.showIntro', v)} />
                <TextInput label="Greeting Title" value={config.greeting.title} onChange={(v) => updateConfig('greeting.title', v)} />
                {config.greeting.showIntro && (
                  <TextInput label="Introduction Text" value={config.greeting.intro} onChange={(v) => updateConfig('greeting.intro', v)} multiline />
                )}
                <FontPicker label="Greeting Font" fontConfig={config.greeting.font} onChange={(v) => updateConfig('greeting.font', v)} />
              </>
            )}
          </ConfigSection>
          
          {/* Headlines */}
          <ConfigSection title="Headlines Section" icon={List}>
            <Toggle label="Show Headlines" checked={config.headlines.enabled} onChange={(v) => updateConfig('headlines.enabled', v)} />
            {config.headlines.enabled && (
              <>
                <Toggle label="Show Section Title" checked={config.headlines.showSectionTitle} onChange={(v) => updateConfig('headlines.showSectionTitle', v)} />
                <Toggle label="Show Sub-Categories" checked={config.headlines.showSubCategories} onChange={(v) => updateConfig('headlines.showSubCategories', v)} />
                <RadioGroup label="Source Display" value={config.headlines.sourceMode} onChange={(v) => updateConfig('headlines.sourceMode', v)} options={[
                  { value: 'below', label: 'Below headline (no underline)' },
                  { value: 'inline', label: 'Quoted in headline (underline)' },
                ]} />
                <SubSection title="Text Content">
                  <TextInput label="Section Title" value={config.headlines.sectionTitle} onChange={(v) => updateConfig('headlines.sectionTitle', v)} />
                  <TextInput label="Companies Label" value={config.headlines.companiesTitle} onChange={(v) => updateConfig('headlines.companiesTitle', v)} />
                  <TextInput label="Topics Label" value={config.headlines.topicsTitle} onChange={(v) => updateConfig('headlines.topicsTitle', v)} />
                </SubSection>
                <SubSection title="Typography">
                  <FontPicker label="Section Title Font" fontConfig={config.headlines.sectionFont} onChange={(v) => updateConfig('headlines.sectionFont', v)} />
                  <FontPicker label="Sub-Category Font" fontConfig={config.headlines.subSectionFont} onChange={(v) => updateConfig('headlines.subSectionFont', v)} />
                  <FontPicker label="Headline Item Font" fontConfig={config.headlines.itemFont} onChange={(v) => updateConfig('headlines.itemFont', v)} />
                </SubSection>
              </>
            )}
          </ConfigSection>
          
          {/* Entities */}
          <ConfigSection title="Companies / People / Topics" icon={Users}>
            <Toggle label="Show Logo" checked={config.entities.showLogo} onChange={(v) => updateConfig('entities.showLogo', v)} />
            <Toggle label="Show Sub-Categories" checked={config.entities.showSubCategories} onChange={(v) => updateConfig('entities.showSubCategories', v)} />
            <RadioGroup label="Bullet Style" value={config.entities.bulletStyle} onChange={(v) => updateConfig('entities.bulletStyle', v)} options={[
              { value: 'bullet', label: '• Bullet' },
              { value: 'arrow', label: '→ Arrow' },
              { value: 'dash', label: '– Dash' },
              { value: 'square', label: '■ Square' },
            ]} />
            <RadioGroup label="Border Style" value={config.entities.borderStyle} onChange={(v) => updateConfig('entities.borderStyle', v)} options={[
              { value: 'full', label: 'Full Width' },
              { value: 'short', label: 'Short Accent' },
            ]} />
            <SubSection title="Section Titles">
              <TextInput label="Companies Title" value={config.entities.companiesTitle} onChange={(v) => updateConfig('entities.companiesTitle', v)} />
              <TextInput label="People Title" value={config.entities.peopleTitle} onChange={(v) => updateConfig('entities.peopleTitle', v)} />
              <TextInput label="Topics Title" value={config.entities.topicsTitle} onChange={(v) => updateConfig('entities.topicsTitle', v)} />
            </SubSection>
            <SubSection title="Typography">
              <FontPicker label="Section Title Font" fontConfig={config.entities.sectionFont} onChange={(v) => updateConfig('entities.sectionFont', v)} />
              <FontPicker label="Sub-Category Font" fontConfig={config.entities.subSectionFont} onChange={(v) => updateConfig('entities.subSectionFont', v)} />
              <FontPicker label="Entity Name Font" fontConfig={config.entities.nameFont} onChange={(v) => updateConfig('entities.nameFont', v)} />
              <FontPicker label="Article Headline Font" fontConfig={config.entities.headlineFont} onChange={(v) => updateConfig('entities.headlineFont', v)} />
              <FontPicker label="Body / Bullets Font" fontConfig={config.entities.bodyFont} onChange={(v) => updateConfig('entities.bodyFont', v)} />
            </SubSection>
          </ConfigSection>
          
          {/* Research */}
          <ConfigSection title="Research Section" icon={FileText}>
            <Toggle label="Show Research" checked={config.research.enabled} onChange={(v) => updateConfig('research.enabled', v)} />
            {config.research.enabled && (
              <>
                <TextInput label="Section Title" value={config.research.title} onChange={(v) => updateConfig('research.title', v)} />
                <TextInput label="Subtitle" value={config.research.subtitle} onChange={(v) => updateConfig('research.subtitle', v)} />
                <FontPicker label="Research Font" fontConfig={config.research.font} onChange={(v) => updateConfig('research.font', v)} />
                <SubSection title="Research Items">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{config.research.items.length} items</span>
                    <button onClick={addResearchItem} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded"><Plus size={16} /></button>
                  </div>
                  {config.research.items.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-start p-2 bg-gray-50 rounded">
                      <div className="flex-1 space-y-1">
                        <input type="text" value={item.title} onChange={(e) => {
                          const items = [...config.research.items];
                          items[idx].title = e.target.value;
                          updateConfig('research.items', items);
                        }} className="w-full text-xs p-1.5 border border-gray-200 rounded" placeholder="Title" />
                        <input type="text" value={item.url} onChange={(e) => {
                          const items = [...config.research.items];
                          items[idx].url = e.target.value;
                          updateConfig('research.items', items);
                        }} className="w-full text-xs p-1.5 border border-gray-200 rounded" placeholder="URL" />
                      </div>
                      <button onClick={() => removeResearchItem(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={14} /></button>
                    </div>
                  ))}
                </SubSection>
              </>
            )}
          </ConfigSection>
          
          {/* Footer */}
          <ConfigSection title="Footer" icon={Mail}>
            <Toggle label="Show Footer" checked={config.footer.enabled} onChange={(v) => updateConfig('footer.enabled', v)} />
            {config.footer.enabled && (
              <>
                <Toggle label="Show Name" checked={config.footer.showName} onChange={(v) => updateConfig('footer.showName', v)} />
                <Toggle label="Show Phone" checked={config.footer.showPhone} onChange={(v) => updateConfig('footer.showPhone', v)} />
                <Toggle label="Show Email" checked={config.footer.showEmail} onChange={(v) => updateConfig('footer.showEmail', v)} />
                <TextInput label="Sign-off Text" value={config.footer.signoff} onChange={(v) => updateConfig('footer.signoff', v)} />
                <TextInput label="Team Name" value={config.footer.teamName} onChange={(v) => updateConfig('footer.teamName', v)} />
                <FontPicker label="Footer Font" fontConfig={config.footer.font} onChange={(v) => updateConfig('footer.font', v)} />
                <SubSection title="Contacts">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{config.footer.contacts.length} contacts (3 per row)</span>
                    <button onClick={addContact} className="p-1.5 text-teal-600 hover:bg-teal-50 rounded"><Plus size={16} /></button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {config.footer.contacts.map((contact, idx) => (
                      <div key={idx} className="p-2 bg-gray-50 rounded space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Contact {idx + 1}</span>
                          <button onClick={() => removeContact(idx)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={12} /></button>
                        </div>
                        <input type="text" value={contact.name} onChange={(e) => {
                          const contacts = [...config.footer.contacts];
                          contacts[idx].name = e.target.value;
                          updateConfig('footer.contacts', contacts);
                        }} className="w-full text-xs p-1.5 border border-gray-200 rounded" placeholder="Name" />
                        <input type="text" value={contact.phone} onChange={(e) => {
                          const contacts = [...config.footer.contacts];
                          contacts[idx].phone = e.target.value;
                          updateConfig('footer.contacts', contacts);
                        }} className="w-full text-xs p-1.5 border border-gray-200 rounded" placeholder="Phone" />
                        <input type="text" value={contact.email} onChange={(e) => {
                          const contacts = [...config.footer.contacts];
                          contacts[idx].email = e.target.value;
                          updateConfig('footer.contacts', contacts);
                        }} className="w-full text-xs p-1.5 border border-gray-200 rounded" placeholder="Email" />
                      </div>
                    ))}
                  </div>
                </SubSection>
              </>
            )}
          </ConfigSection>
          
          {/* Disclaimer */}
          <ConfigSection title="Disclaimer" icon={AlertCircle}>
            <Toggle label="Show Disclaimer" checked={config.disclaimer.enabled} onChange={(v) => updateConfig('disclaimer.enabled', v)} />
            {config.disclaimer.enabled && (
              <>
                <Toggle label="Show Unsubscribe" checked={config.disclaimer.showUnsubscribe} onChange={(v) => updateConfig('disclaimer.showUnsubscribe', v)} />
                <Toggle label="Show Privacy Policy" checked={config.disclaimer.showPrivacy} onChange={(v) => updateConfig('disclaimer.showPrivacy', v)} />
                <TextInput label="Disclaimer Text" value={config.disclaimer.text} onChange={(v) => updateConfig('disclaimer.text', v)} multiline />
                <FontPicker label="Disclaimer Font" fontConfig={config.disclaimer.font} onChange={(v) => updateConfig('disclaimer.font', v)} />
              </>
            )}
          </ConfigSection>
          
        </div>
        
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
          <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-2">
            <Eye size={16} className="text-gray-500" />
            <span className="text-sm font-semibold text-gray-700">Live Preview</span>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div className="bg-white rounded-xl shadow-xl overflow-hidden mx-auto" style={{ maxWidth: 848 }}>
              <iframe srcDoc={previewHTML} title="Newsletter Preview" className="w-full border-0" style={{ height: '2400px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
