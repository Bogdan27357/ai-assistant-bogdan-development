import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import OpenRouterChat from '@/components/OpenRouterChat';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AIModelsSection from '@/components/AIModelsSection';
import AboutSection from '@/components/AboutSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import SiteFooter from '@/components/SiteFooter';
import { aiModels } from '@/data/aiModels';
import { teamMembers } from '@/data/teamMembers';
import { features } from '@/data/features';

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme !== null) {
      setDarkMode(storedTheme === 'true');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  const handleToggleChat = () => {
    setShowChat(!showChat);
  };

  const handleStartChat = () => {
    setShowChat(true);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-b from-white via-slate-50 to-white'
    }`}>
      <Header 
        darkMode={darkMode} 
        showChat={showChat} 
        toggleDarkMode={toggleDarkMode}
        onToggleChat={handleToggleChat}
      />

      {showChat ? (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <Button
              onClick={() => setShowChat(false)}
              variant="ghost"
              className={`mb-4 ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад
            </Button>
            <OpenRouterChat />
          </div>
        </div>
      ) : (
        <>
          <HeroSection darkMode={darkMode} onStartChat={handleStartChat} />
          
          <AIModelsSection 
            darkMode={darkMode}
            aiModels={aiModels}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          
          <AboutSection darkMode={darkMode} teamMembers={teamMembers} />
          
          <FeaturesSection darkMode={darkMode} features={features} />
          
          <CTASection darkMode={darkMode} onStartChat={handleStartChat} />
          
          <SiteFooter darkMode={darkMode} />
        </>
      )}
    </div>
  );
};

export default Index;
