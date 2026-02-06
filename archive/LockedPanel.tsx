import { Lock, AlertTriangle } from 'lucide-react';
import type { LockedSection } from '../types';

interface LockedPanelProps {
    sections: LockedSection[];
    warnings?: string[];
}

export function LockedPanel({ sections, warnings = [] }: LockedPanelProps) {
    return (
        <div className="locked-panel">
            <div className="section-header">
                <h3 className="section-title">Locked Sections</h3>
                <p className="section-description">
                    {sections.length} section{sections.length !== 1 ? 's' : ''} detected
                </p>
            </div>

            {warnings.length > 0 && (
                <div className="warnings-list">
                    {warnings.map((warning, i) => (
                        <div key={i} className="warning-item">
                            <AlertTriangle size={14} />
                            <span>{warning}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="locked-sections-list">
                {sections.map((section) => (
                    <div key={section.id} className="locked-section-card">
                        <div className="locked-section-header">
                            <Lock size={16} />
                            <span className="locked-section-title">{section.headerText}</span>
                        </div>
                        <div className="locked-section-info">
                            <span className="locked-section-type">{section.type}</span>
                            {section.articleCount && (
                                <span className="locked-section-count">
                                    {section.articleCount} item{section.articleCount !== 1 ? 's' : ''}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
