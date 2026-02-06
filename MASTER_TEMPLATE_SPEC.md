# Master Newsletter Template System v3.0

> **Production-Ready Recurring Email Template Framework**
> 
> This is a **configurable template system** for recurring newsletters. Clients onboard once with their branding/preferences, then daily news data is injected automatically.

---

## ARCHITECTURE OVERVIEW

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT CONFIGURATION                         │
│  (One-time setup: branding, colors, sections, footer contacts)     │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        MASTER TEMPLATE                              │
│  (Commented HTML with all sections, toggle via config)             │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        DAILY DATA INJECTION                         │
│  (Companies, People, Topics, Headlines - refreshed daily)          │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                        RENDERED EMAIL                               │
│  (Sent to subscribers)                                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 1. COLOR SYSTEM (Complete Theming)

### 1.1 Text Colors
| Token | Purpose | Example Values |
|-------|---------|----------------|
| `text.primary` | Main headlines, names | `#000000` `#1a1a1a` |
| `text.secondary` | Bullets, descriptions | `#4E5971` `#666666` |
| `text.muted` | Timestamps, meta | `#999999` `#ababab` |
| `text.accent` | Brand highlights | `#008689` `#1e40af` `#8b4513` |
| `text.date` | Date bar text | `#000000` |
| `text.link` | Hyperlinks | `#4E5971` |
| `text.linkHover` | Link hover state | `#008689` |

### 1.2 Background Colors
| Token | Purpose |
|-------|---------|
| `bg.outer` | Outside email wrapper (email client bg) |
| `bg.body` | Main content area |
| `bg.dateBar` | Date strip |
| `bg.headline` | Headlines-only section |
| `bg.detail` | Full news section |
| `bg.footer` | Footer area |
| `bg.disclaimer` | Legal section |
| `bg.subCategory` | Sub-category header bg (optional) |

### 1.3 Borders & Lines
| Token | Purpose |
|-------|---------|
| `border.outer` | Wrapper border |
| `border.section` | Section dividers |
| `border.sectionAccent` | Colored underline (brand color) |
| `border.entity` | Around company logos |

---

## 2. ENTITY CONFIGURATION (Companies/People/Topics)

### 2.1 Entity Display Options
| Option | Values | Description |
|--------|--------|-------------|
| `showLogo` | `true`/`false` | Show 24x24 icon |
| `showName` | `true`/`false` | Show entity name |
| `nameIsLink` | `true`/`false` | **NEW**: Click name → opens entity website |
| `websiteUrl` | URL template | **NEW**: `"https://{{domain}}"` or custom URL |
| `logoFallback` | `"initials"` / `"placeholder"` / `"hide"` | What to show if logo fails |
| `groupArticles` | `true`/`false` | Group multiple articles under one entity |

### 2.2 Entity Data Schema
```json
{
  "name": "OpenAI",
  "domain": "openai.com",
  "websiteUrl": "https://www.openai.com",
  "logoUrl": "https://img.logo.dev/openai.com?token=...",
  "articles": [...]
}
```

### 2.3 Entity Types
- **Companies**: Business entities with logos, websites
- **People**: Individuals (executives, analysts) - may have photos instead of logos
- **Topics**: Themes/categories - no logo, just text header

---

## 3. SECTION SYSTEM

### 3.1 Available Sections (All Optional)
| Section ID | Description | Duplicatable |
|------------|-------------|--------------|
| `HEADER` | Banner image or text logo | No |
| `DATE_BAR` | Date display strip | No |
| `GREETING` | "Good Morning" + optional intro | No |
| `HEADLINES` | Summary view (titles + sources only) | **Yes** |
| `COMPANIES` | Detailed company news | **Yes** |
| `TOPICS` | Detailed topic news | **Yes** |
| `PEOPLE` | Detailed people news | **Yes** |
| `RESEARCH` | Report links section | No |
| `CUSTOM_HTML` | **NEW**: Arbitrary HTML block | **Yes** |
| `DIVIDER` | **NEW**: Visual separator | **Yes** |
| `FOOTER_TEXT` | Sign-off + contacts | No |
| `FOOTER_IMAGE` | **NEW**: Footer as image (like banner) | No |
| `DISCLAIMER` | Legal text | No |

### 3.2 Section Duplication
Sections marked "Duplicatable" can appear multiple times. Example use cases:
- Two HEADLINES sections: one for "Morning Headlines", one for "Sector Focus"
- Multiple COMPANIES sections: "Your Portfolio" and "Competitor Watch"

```json
{
  "sections": [
    { "id": "headlines-1", "type": "HEADLINES", "title": "Today's Headlines", "filter": { "category": "all" } },
    { "id": "companies-portfolio", "type": "COMPANIES", "title": "Your Portfolio", "filter": { "entities": ["TCS", "Infosys"] } },
    { "id": "companies-competitors", "type": "COMPANIES", "title": "Competitor Watch", "filter": { "entities": ["Accenture", "Cognizant"] } }
  ]
}
```

### 3.3 Section Ordering
```json
{
  "sectionOrder": [
    "HEADER",
    "DATE_BAR", 
    "GREETING",
    "headlines-1",
    "companies-portfolio",
    "DIVIDER",
    "companies-competitors",
    "RESEARCH",
    "FOOTER_IMAGE",
    "DISCLAIMER"
  ]
}
```

---

## 4. HEADER & FOOTER OPTIONS

### 4.1 Header Types
| Type | Description |
|------|-------------|
| `banner_image` | Full-width image (800px recommended) |
| `text_logo` | Styled text with brand color |
| `image_and_text` | Logo image + company name text |
| `none` | No header (starts with date bar) |

### 4.2 Footer Types
| Type | Description |
|------|-------------|
| `text_contacts` | Sign-off + contact columns (1-7 people) |
| `image_banner` | **NEW**: Full-width footer image (like header) |
| `text_and_image` | Contacts above, image below |
| `none` | No footer (just disclaimer) |

### 4.3 Contact Display Options
| Option | Values |
|--------|--------|
| `layout` | `"columns"` / `"rows"` / `"grid"` |
| `columnsPerRow` | 2, 3, 4 |
| `showFields.name` | true/false |
| `showFields.title` | true/false |
| `showFields.phone` | true/false |
| `showFields.email` | true/false |
| `showFields.linkedin` | **NEW**: true/false |

---

## 5. CONTENT FORMAT OPTIONS

### 5.1 Article Details
| Option | Values | Description |
|--------|--------|-------------|
| `format` | `"bullets"` / `"paragraph"` / `"none"` | How to display details |
| `bulletStyle` | `"•"` / `"-"` / `"→"` / `"number"` / `"none"` | Bullet character |
| `bulletLimit` | 0 (all), 3, 4, 5 | Max bullets per article |
| `paragraphMaxLength` | 200, 300, 500 | Truncate paragraph at N chars |
| `showReadMore` | true/false | **NEW**: "Read more →" link |

### 5.2 Headline Display
| Option | Values |
|--------|--------|
| `linkStyle` | `"underline"` / `"color"` / `"bold"` / `"none"` |
| `maxLength` | 100, 150, 200 (truncate with ...) |
| `showDomain` | true/false (show source domain inline) |

### 5.3 Source Citations
| Option | Values |
|--------|--------|
| `display` | `"below"` / `"inline"` / `"none"` |
| `format` | `"name"` / `"domain"` / `"full"` |
| `multiSeparator` | `" | "` / `", "` / `" · "` |
| `limit` | 0 (all), 1, 2, 3 |
| `linkAll` | true/false |
| `firstSourceIsHeadlineLink` | **NEW**: true/false |

---

## 6. ADVANCED FEATURES

### 6.1 Conditional Rendering
```json
{
  "conditionals": {
    "hideIfEmpty": true,
    "showGreetingOnlyOnMonday": false,
    "showResearchOnFriday": true
  }
}
```

### 6.2 Date Formatting
| Format | Example |
|--------|---------|
| `"EEEE, dd MMMM yyyy"` | Friday, 16 January 2026 |
| `"dd MMM yyyy"` | 16 Jan 2026 |
| `"MMM dd, yyyy"` | Jan 16, 2026 |
| `"dd/MM/yyyy"` | 16/01/2026 |

### 6.3 Personalization Tokens
| Token | Description |
|-------|-------------|
| `{{recipientName}}` | Subscriber's name |
| `{{date}}` | Current date |
| `{{companyName}}` | Client company name |
| `{{unsubscribeLink}}` | Unsubscribe URL |

---

## 7. COMPLETE CONFIG SCHEMA

```json
{
  "meta": {
    "templateName": "HDFC Capital Daily Brief",
    "clientId": "hdfc-capital",
    "version": "1.0.0",
    "createdAt": "2026-01-16",
    "lastModified": "2026-01-16"
  },
  
  "branding": {
    "companyName": "HDFC Capital",
    "tagline": "Investment Insights",
    "primaryColor": "#1e40af",
    "accentColor": "#dc2626"
  },
  
  "theme": {
    "colors": {
      "text": { "primary": "#000", "secondary": "#4E5971", "accent": "#1e40af" },
      "bg": { "outer": "#f5f5f5", "body": "#fff", "dateBar": "#EBF1F3" },
      "border": { "section": "#F1F1F0", "sectionAccent": "#dc2626" }
    },
    "typography": {
      "fontFamily": "Arial, sans-serif",
      "sizes": { "sectionTitle": "19px", "headline": "13px", "bullet": "12px" }
    },
    "layout": { "width": 800 }
  },
  
  "header": {
    "type": "text_logo",
    "logoText": "HDFC Capital",
    "logoColor": "#1e40af",
    "showBorder": false
  },
  
  "dateBar": {
    "enabled": true,
    "format": "EEEE, dd MMMM yyyy",
    "background": "#EBF1F3"
  },
  
  "greeting": {
    "enabled": true,
    "text": "Good Morning,",
    "showIntro": false
  },
  
  "sections": [
    { "id": "headlines-main", "type": "HEADLINES", "enabled": true, "title": "Today's Headlines" },
    { "id": "companies-main", "type": "COMPANIES", "enabled": true, "title": "Companies", "showLogo": true, "showBullets": true },
    { "id": "topics-main", "type": "TOPICS", "enabled": false }
  ],
  
  "entity": {
    "showLogo": true,
    "nameIsLink": true,
    "groupArticles": true,
    "logoFallback": "initials"
  },
  
  "content": {
    "detailFormat": "bullets",
    "bulletLimit": 4,
    "source": { "display": "below", "multiSeparator": " | " }
  },
  
  "footer": {
    "type": "text_contacts",
    "signoff": "Have a great day!",
    "teamName": "HDFC Capital Research",
    "contactColumns": 2,
    "contacts": [
      { "name": "John Doe", "phone": "+91...", "email": "john@hdfc.com" },
      { "name": "Jane Smith", "phone": "+91...", "email": "jane@hdfc.com" }
    ]
  },
  
  "disclaimer": {
    "enabled": true,
    "text": "This is an AI-generated newsletter..."
  }
}
```

---

## 8. HTML COMMENT MARKERS

The master template uses HTML comments for section toggling:

```html
<!-- SECTION: GREETING - START -->
<!-- CONFIG: greeting.enabled -->
<tr>
  <td>Good Morning,</td>
</tr>
<!-- SECTION: GREETING - END -->

<!-- SECTION: HEADLINES - START -->
<!-- CONFIG: sections.headlines.enabled -->
<!-- DUPLICATABLE: true -->
<tr>
  <td>{{#each headlines}}...{{/each}}</td>
</tr>
<!-- SECTION: HEADLINES - END -->

<!-- SECTION: FOOTER_IMAGE - START -->
<!-- CONFIG: footer.type === 'image_banner' -->
<!-- ALTERNATIVE TO: FOOTER_TEXT -->
<tr>
  <td><img src="{{footer.imageUrl}}" /></td>
</tr>
<!-- SECTION: FOOTER_IMAGE - END -->
```

---

## 9. DATA INJECTION SCHEMA

Daily data that gets injected:

```json
{
  "date": "Friday, 16 January 2026",
  "headlines": [
    {
      "title": "OpenAI launches ChatGPT Translate...",
      "url": "https://...",
      "category": "Companies",
      "subCategory": "AI & ML",
      "sources": [{ "name": "Mint", "url": "..." }]
    }
  ],
  "companies": [
    {
      "name": "TCS",
      "domain": "tcs.com",
      "websiteUrl": "https://www.tcs.com",
      "logoUrl": "https://img.logo.dev/tcs.com?token=...",
      "articles": [
        {
          "headline": "TCS opens new campus...",
          "url": "https://...",
          "bullets": ["Point 1", "Point 2"],
          "sources": []
        }
      ]
    }
  ],
  "topics": [...],
  "people": [...],
  "research": [...]
}
```

---

## 10. NEXT STEPS

1. [x] Define complete specification
2. [ ] Create `master_template.html` with all sections + comments
3. [ ] Build Template Customizer UI (React)
   - Theme editor (colors, typography)
   - Section manager (enable/disable, reorder, duplicate)
   - Preview pane
   - Export config JSON
4. [ ] Connect to data pipeline for daily injection
