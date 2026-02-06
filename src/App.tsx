// App Root - Entry point with Onboarding → Editor flow
// First-time users see OnboardingWizard, then transition to NewsletterCustomizer

import React, { useState } from 'react';
import NewsletterCustomizer from './NewsletterCustomizer';
import { OnboardingWizard } from './components/OnboardingWizard';

type AppState = 'onboarding' | 'editor';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('onboarding');
  const [initialConfig, setInitialConfig] = useState<any>(null);
  const [selectedSections, setSelectedSections] = useState<string[] | null>(null);

  const handleOnboardingComplete = (config: any, sections: string[]) => {
    setInitialConfig(config);
    setSelectedSections(sections);
    setAppState('editor');
  };

  const handleSkipOnboarding = () => {
    // Use defaults
    setAppState('editor');
  };

  if (appState === 'onboarding') {
    return (
      <OnboardingWizard
        onComplete={handleOnboardingComplete}
        onSkip={handleSkipOnboarding}
      />
    );
  }

  return (
    <NewsletterCustomizer
      initialConfig={initialConfig}
      enabledSections={selectedSections}
    />
  );
};

export default App;
