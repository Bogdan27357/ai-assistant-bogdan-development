import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Features2 from '@/components/Features2';
import UseCases from '@/components/UseCases';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';
import AdminPanel from '@/components/AdminPanel';
import AdvancedFeatures from '@/components/AdvancedFeatures';
import AITools from '@/components/AITools';
import Navigation from '@/components/Navigation';
import { Language } from '@/lib/i18n';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'chat' | 'admin' | 'features' | 'tools'>('home');
  const [language, setLanguage] = useState<Language>('ru');

  useEffect(() => {
    const stored = localStorage.getItem('language');
    if (stored) setLanguage(stored as Language);
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navigation 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      
      {currentPage === 'home' && (
        <>
          <Hero onStartChat={() => setCurrentPage('chat')} />
          <Features />
          <UseCases onStartChat={() => setCurrentPage('chat')} />
          <Footer />
        </>
      )}
      
      {currentPage === 'chat' && <ChatInterface onNavigateToAdmin={() => setCurrentPage('admin')} />}
      {currentPage === 'features' && <AdvancedFeatures />}
      {currentPage === 'tools' && <AITools />}
      {currentPage === 'admin' && <AdminPanel />}
      
      <Toaster />
    </div>
  );
};

export default Index;