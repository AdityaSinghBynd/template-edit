# Intelligence Newsletter Editor - How It Works

> A plain-language guide explaining the core logic behind this email template builder.

---

## The Big Picture

This app lets users customize a newsletter template and see changes in real-time. Here's how it works:

```
User changes settings → Config updates → HTML regenerates → Preview refreshes
```

Everything flows through a **single configuration object**. When you change any setting (like enabling the date bar or changing a font), the entire HTML is regenerated from scratch using that config.

---

## How the Configuration System Works

Think of the config as a big settings file that controls everything:

```typescript
config = {
  dateBar: {
    enabled: true,           // Show or hide the date bar
    text: "Friday, Jan 16",  // The actual text
    font: { family: "Georgia", size: 13 }
  },
  greeting: {
    enabled: true,
    title: "Good Morning,",
    intro: "Welcome to your newsletter..."
  },
  // ... more sections
}
```

When a user toggles a switch or types in an input field, we call:

```typescript
updateConfig('dateBar.enabled', false)
// This updates config.dateBar.enabled from true to false
```

The `updateConfig` function takes a **path** (like `'footer.signoff'`) and a **value**, then updates that specific part of the config. After the update, the HTML is regenerated automatically.

---

## How HTML Generation Works

The heart of the app is the `generateHTML(config)` function. It takes the config and builds email-safe HTML.

### The Basic Pattern

Every section follows this pattern:

```typescript
if (config.sectionName.enabled) {
  // Build this section's HTML
  html += `<tr data-section="sectionName">...</tr>`;
}
```

This means:
1. Check if the section is enabled
2. If yes, generate its HTML
3. Add it to the full HTML string

### Font Styling Helper

Since each element can have bold, italic, underline, and uppercase options, we have a helper:

```typescript
getExtraFontStyles(fontConfig)
// Returns something like: "font-weight:700;font-style:italic;"
```

This is called for every text element to apply the user's styling choices.

### Example: Date Bar Generation

Here's the actual logic for the date bar:

```typescript
if (config.dateBar.enabled) {
  const font = config.dateBar.font;
  html += `
    <tr data-section="dateBar">
      <td style="padding:12px 32px; background:#FAFAF9;">
        <p style="
          font-family: ${font.family};
          font-size: ${font.size}px;
          ${getExtraFontStyles(font)}
        ">
          ${config.dateBar.text}
        </p>
      </td>
    </tr>
  `;
}
```

Every section follows this same pattern—read the config, build styled HTML.

---

## How Each Section Works

### Banner
- **Types**: Image URL, Text Logo, or AI-generated
- If `type === 'image'`, shows the image URL
- If `type === 'text'`, shows styled company name
- AI generation calls an external API and stores the result

### Date Bar
- Simple text display with customizable font
- Has a distinct background color and borders

### Greeting
- Two parts: **title** ("Good Morning,") and **intro** (welcome paragraph)
- The intro can be toggled on/off separately
- Title is typically italic by default

### Headlines ("At a Glance")
- Summary view of all news items without bullet points
- Three categories: Companies, People, Topics
- Can show/hide category headers with `showCategories`
- Can show logos/images next to each headline with `showImage`
- Topics show a default list icon since they don't have logos

### Entity Sections (Companies, People, Topics)
- Detailed view with article headlines AND bullet points
- Each entity shows:
  - Logo/image (or default icon for Topics)
  - Entity name
  - Article headlines
  - Bullet points under each headline

Key logic for rendering:

```typescript
// For Companies and People - show logo if available
if (config.entities.showLogo && entity.logoUrl) {
  html += `<img src="${entity.logoUrl}" />`;
}

// For Topics - show default list icon
if (isTopics && config.entities.showLogo) {
  html += topicIcon; // SVG icon
}
```

### Headlines vs Entity Sections Sync

These two sections share the same data but display it differently:
- **Headlines**: Shows just the headline titles (no bullets)
- **Entity Sections**: Shows headlines + bullet points

The same `renderArticleItem` function is used for both, with a flag:

```typescript
// In Headlines section
renderArticleItem(article, { showBullets: false })

// In Entity sections
renderArticleItem(article, { showBullets: true })
```

### Footer
- Two separate font configs: one for the signoff ("Have a great day!"), another for team/contacts
- Contacts are displayed in a 3-column grid
- Can toggle visibility of name, phone, email individually

### Disclaimer
- Shows legal/disclaimer text
- Has unsubscribe and privacy links
- Social media links with icons

---

## Section Border Styles

Sections like Companies, People, Topics have underlines under their titles. Three styles:

1. **Full** - Underline spans the full width
2. **Short** - Underline is inline (only as wide as the text)
3. **Fixed** - A fixed 40px colored bar under the title

The logic:

```typescript
if (config.entities.borderStyle === 'fixed') {
  html += `<div style="width:40px; height:3px; background-color:${accentColor}"></div>`;
} else if (config.entities.borderStyle === 'short') {
  // border is applied to the text with display:inline-block
} else {
  // border spans full width
}
```

---

## How Section Editors Work

Each section has its own editor component that:
1. Reads the current config values
2. Shows controls (toggles, text inputs, font pickers)
3. Calls `updateConfig()` when the user makes changes

### Example: Greeting Editor

```typescript
const GreetingEditor = ({ config, updateConfig }) => (
  <div>
    <Toggle
      label="Show Greeting"
      checked={config.greeting.enabled}
      onChange={(v) => updateConfig('greeting.enabled', v)}
    />
    
    {config.greeting.enabled && (
      <>
        <TextInput
          label="Title"
          value={config.greeting.title}
          onChange={(v) => updateConfig('greeting.title', v)}
        />
        <FontPicker
          fontConfig={config.greeting.font}
          onChange={(v) => updateConfig('greeting.font', v)}
        />
      </>
    )}
  </div>
);
```

Every editor follows this pattern:
1. Master toggle to enable/disable
2. When enabled, show the relevant controls
3. Each control calls `updateConfig` with its path

---

## Connecting Data to Display

The newsletter content comes from a data object:

```typescript
data = {
  companies: [
    {
      name: "Apple",
      logoUrl: "https://...",
      articles: [
        { headline: "Apple unveils M4...", bullets: ["...", "..."] }
      ]
    }
  ],
  people: [...],
  topics: [...]
}
```

The `generateHTML` function loops through this data and builds HTML for each item:

```typescript
data.companies.forEach(company => {
  // Show company logo
  // Show company name
  company.articles.forEach(article => {
    // Show headline
    // Show bullets
  });
});
```

---

## Key Takeaways

1. **Config-driven**: Everything is controlled by a single config object
2. **One-way flow**: Config changes → HTML regenerates → Preview updates
3. **Section pattern**: Each section checks `enabled`, then builds HTML if true
4. **Font helper**: `getExtraFontStyles()` applies bold/italic/underline/uppercase
5. **Shared rendering**: Headlines and Entity sections share `renderArticleItem()`
6. **Data + Config = Output**: The data provides content, the config controls how it looks

---

## For Integration

To use this in another app:

1. **Get the config** - Either use `defaultConfig` or load from database
2. **Get the data** - Replace sample data with real newsletter content
3. **Call generateHTML(config)** - Pass config and data, get HTML string
4. **Use the HTML** - Send as email, display in iframe, or download

The generated HTML is email-client compatible (tables for layout, inline styles, no JavaScript).
