import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ModelsShowcase from '@/components/landing/ModelsShowcase';
import InteractiveDemo from '@/components/landing/InteractiveDemo';
import StatsSection from '@/components/landing/StatsSection';
import CTASection from '@/components/landing/CTASection';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatInterface from '@/components/ChatInterface';
import AdminPanel from '@/components/AdminPanel';
import AITools from '@/components/AITools';
import ImageGenerator from '@/components/ImageGenerator';
import PromptLibrary from '@/components/PromptLibrary';
import CodePlayground from '@/components/CodePlayground';
import AIAssistants from '@/components/AIAssistants';
import VoiceInterface from '@/components/VoiceInterface';
import DocumentProcessor from '@/components/DocumentProcessor';
import TelegramBot from '@/components/TelegramBot';
import ChatHistory from '@/components/ChatHistory';
import DeveloperAPI from '@/components/DeveloperAPI';
import Auth from '@/components/Auth';
import Profile from '@/components/Profile';
import ScrollToTop from '@/components/ScrollToTop';
import { Language } from '@/lib/i18n';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'chat' | 'admin' | 'tools' | 'profile' | 'auth' | 'images' | 'prompts' | 'code' | 'assistants' | 'voice' | 'documents' | 'telegram' | 'history' | 'api'>('home');
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
          <HeroSection onStartChat={() => setCurrentPage('chat')} language={language} />
          <FeaturesSection language={language} />
          <Footer />
        </>
      )}
      
      {currentPage === 'chat' && <ChatInterface onNavigateToAdmin={() => setCurrentPage('admin')} language={language} />}
      {currentPage === 'tools' && <AITools />}
      {currentPage === 'images' && <ImageGenerator />}
      {currentPage === 'prompts' && <PromptLibrary />}
      {currentPage === 'code' && <CodePlayground />}
      {currentPage === 'assistants' && <AIAssistants />}
      {currentPage === 'voice' && <VoiceInterface />}
      {currentPage === 'documents' && <DocumentProcessor />}
      {currentPage === 'telegram' && <TelegramBot />}
      {currentPage === 'history' && <ChatHistory />}
      {currentPage === 'api' && <DeveloperAPI />}
      {currentPage === 'admin' && <AdminPanel />}
      {currentPage === 'auth' && <Auth onAuth={handleAuth} />}
      {currentPage === 'profile' && user && <Profile user={user} onLogout={handleLogout} />}
      
      <ScrollToTop />
      <Toaster />
    </div>
  );
};

export default Index;