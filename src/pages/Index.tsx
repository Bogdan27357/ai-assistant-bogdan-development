import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import AboutUs from '@/components/AboutUs';
import UseCases from '@/components/UseCases';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';
import AdminPanel from '@/components/AdminPanel';
import AdvancedFeatures from '@/components/AdvancedFeatures';
import AITools from '@/components/AITools';
import ImageGenerator from '@/components/ImageGenerator';
import PromptLibrary from '@/components/PromptLibrary';
import CodePlayground from '@/components/CodePlayground';
import AIAssistants from '@/components/AIAssistants';
import Navigation from '@/components/Navigation';
import Auth from '@/components/Auth';
import Profile from '@/components/Profile';
import ScrollToTop from '@/components/ScrollToTop';
import { Language } from '@/lib/i18n';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'chat' | 'admin' | 'features' | 'tools' | 'profile' | 'auth' | 'images' | 'prompts' | 'code' | 'assistants'>('home');
  const [language, setLanguage] = useState<Language>('ru');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('language');
    if (stored) setLanguage(stored as Language);
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleAuth = (newUser: { email: string; name: string }) => {
    setUser(newUser);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {currentPage !== 'auth' && (
        <Navigation 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          language={language}
          onLanguageChange={handleLanguageChange}
          user={user}
          onAuthClick={() => setCurrentPage('auth')}
        />
      )}
      
      {currentPage === 'home' && (
        <>
          <Hero onStartChat={() => setCurrentPage('chat')} language={language} />
          <Features language={language} />
          <AboutUs language={language} />
          <UseCases onStartChat={() => setCurrentPage('chat')} language={language} />
          <Footer />
        </>
      )}
      
      {currentPage === 'chat' && <ChatInterface onNavigateToAdmin={() => setCurrentPage('admin')} language={language} />}
      {currentPage === 'features' && <AdvancedFeatures />}
      {currentPage === 'tools' && <AITools />}
      {currentPage === 'images' && <ImageGenerator />}
      {currentPage === 'prompts' && <PromptLibrary />}
      {currentPage === 'code' && <CodePlayground />}
      {currentPage === 'assistants' && <AIAssistants />}
      {currentPage === 'admin' && <AdminPanel />}
      {currentPage === 'auth' && <Auth onAuth={handleAuth} />}
      {currentPage === 'profile' && user && <Profile user={user} onLogout={handleLogout} />}
      
      <ScrollToTop />
      <Toaster />
    </div>
  );
};

export default Index;