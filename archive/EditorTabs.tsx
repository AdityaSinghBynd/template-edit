import { Type, Palette, Lock } from 'lucide-react';
import type { ParsedTemplate, EditorTab } from '../types';

interface EditorTabsProps {
  parsed: ParsedTemplate;
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
}

export function EditorTabs({ parsed, activeTab, onTabChange }: EditorTabsProps) {
  const tabs: Array<{
    id: EditorTab;
    label: string;
    icon: React.ReactNode;
    count?: number;
  }> = [
      {
        id: 'content',
        label: 'Content',
        icon: <Type size={16} />,
        count: parsed.editableElements.length > 0 ? parsed.editableElements.length : undefined
      },
      {
        id: 'colors',
        label: 'Colors',
        icon: <Palette size={16} />,
        count: parsed.colors.length > 0 ? parsed.colors.length : undefined
      },
      {
        id: 'locked',
        label: 'Locked',
        icon: <Lock size={16} />,
        count: parsed.lockedSections.length > 0 ? parsed.lockedSections.length : undefined
      },
    ];

  return (
    <div className="editor-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`editor-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className="tab-count">{tab.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
