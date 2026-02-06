import { useState } from 'react';
import { Clock, Mail, Globe } from 'lucide-react';
import { TemplateEditorModal } from './components/TemplateEditorModal';
import './index.css';

/**
 * Settings Page - Matches Figma design
 * This is now the main entry point for the standalone app
 */
export default function SettingsPage() {
    const [isEditorOpen, setIsEditorOpen] = useState(false);

    return (
        <div className="settings-page">
            {/* Top Bar */}
            <header className="settings-topbar">
                <div className="settings-topbar-left">
                    <span className="settings-logo">Bynd</span>
                    <span className="settings-breadcrumb">Investing in Private Equity Ed...</span>
                </div>
            </header>

            {/* Sidebar */}
            <aside className="settings-sidebar">
                <nav className="settings-nav">
                    <a href="#" className="settings-nav-item">
                        <span className="settings-nav-icon">🏠</span>
                        <span>Home</span>
                    </a>
                    <a href="#" className="settings-nav-item">
                        <span className="settings-nav-icon">📈</span>
                        <span>Trending</span>
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="settings-main">
                <div className="settings-header">
                    <h1>IT & Telecom news</h1>
                    <span className="settings-meta">17 Companies · 5 People · 3 Custom Topics</span>
                </div>

                {/* Tabs */}
                <div className="settings-tabs">
                    <button className="settings-tab">Overview</button>
                    <button className="settings-tab">Manage Tracking</button>
                    <button className="settings-tab active">Settings</button>
                </div>

                {/* General Settings */}
                <section className="settings-section">
                    <div className="settings-section-header">
                        <h2>General Settings</h2>
                        <button className="settings-edit-btn">Edit</button>
                    </div>

                    <div className="settings-row">
                        <span className="settings-label">Newsletter name</span>
                        <span className="settings-value">IT & Telecom news</span>
                    </div>
                    <div className="settings-row">
                        <span className="settings-label">Delivery frequency</span>
                        <span className="settings-value">Daily</span>
                    </div>
                    <div className="settings-row">
                        <span className="settings-label">Delivery time</span>
                        <span className="settings-value">
                            <Clock size={14} style={{ marginRight: 4 }} />
                            12:00 AM
                        </span>
                    </div>
                    <div className="settings-row">
                        <span className="settings-label">Writing style</span>
                        <span className="settings-value">Bullets, Normal</span>
                    </div>
                    <div className="settings-row">
                        <span className="settings-label">Delivery emails</span>
                        <span className="settings-value">
                            <Mail size={14} style={{ marginRight: 4 }} />
                            ishan@bynd.ai (Primary)
                            <span className="settings-badge">3+</span>
                        </span>
                    </div>
                </section>

                {/* Design Settings */}
                <section className="settings-section">
                    <div className="settings-section-header">
                        <h2>Design Settings</h2>
                        <button
                            className="settings-edit-btn"
                            onClick={() => setIsEditorOpen(true)}
                        >
                            Edit
                        </button>
                    </div>

                    <div className="settings-design-preview">
                        <div className="settings-template-card">
                            <div className="settings-template-header">
                                <span className="settings-template-logo">*ynd Intelligence</span>
                            </div>
                            <div className="settings-template-body">
                                <div className="settings-template-date">Thursday, 23 October 2025</div>
                                <div className="settings-template-title">Today's Headlines</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Source Settings */}
                <section className="settings-section">
                    <div className="settings-section-header">
                        <h2>Source Settings</h2>
                        <button className="settings-edit-btn">Edit</button>
                    </div>

                    <div className="settings-row">
                        <span className="settings-label">
                            <Globe size={14} style={{ marginRight: 4 }} />
                            Web
                        </span>
                        <label className="settings-toggle">
                            <input type="checkbox" defaultChecked />
                            <span className="settings-toggle-slider"></span>
                        </label>
                    </div>
                    <div className="settings-row">
                        <span className="settings-label">US News sources</span>
                        <span className="settings-value">
                            <span className="settings-source-tag">Economic Times</span>
                            <span className="settings-source-tag">Moneycontrol</span>
                            <span className="settings-source-more">200+</span>
                        </span>
                    </div>
                </section>
            </main>

            {/* Template Editor Modal */}
            <TemplateEditorModal
                isOpen={isEditorOpen}
                onClose={() => setIsEditorOpen(false)}
            />
        </div>
    );
}
