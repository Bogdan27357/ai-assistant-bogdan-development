import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FeaturesSection from '@/components/FeaturesSection';
import CTASection from '@/components/CTASection';
import SiteFooter from '@/components/SiteFooter';
import YandexGPTWidget from '@/components/YandexGPTWidget';
import GigaChatWidget from '@/components/GigaChatWidget';
import { teamMembers, projectHistory } from '@/data/teamMembers';
import { features } from '@/data/features';

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);

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

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-b from-white via-slate-50 to-white'
    }`}>
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
      />

      <HeroSection darkMode={darkMode} />
      
      <AboutSection darkMode={darkMode} teamMembers={teamMembers} projectHistory={projectHistory} />
      
      <FeaturesSection darkMode={darkMode} features={features} />
      
      <CTASection darkMode={darkMode} />
      
      <SiteFooter darkMode={darkMode} />
      
      <YandexGPTWidget />
      <GigaChatWidget />
    </div>
  );
};

export default Index;