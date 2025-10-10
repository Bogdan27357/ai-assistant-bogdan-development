import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Auth from '@/components/Auth';
import Profile from '@/components/Profile';
import ScrollToTop from '@/components/ScrollToTop';
import ChatInterface from '@/components/ChatInterface';
import AdminPanel from '@/components/AdminPanel';
import { Language } from '@/lib/i18n';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'profile' | 'chat' | 'admin'>('home');
  const [language, setLanguage] = useState<Language>('ru');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('language');
    if (stored) setLanguage(stored as Language);
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme !== null) {
      setDarkMode(storedTheme === 'true');
    }
  }, []);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
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
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900' 
        : 'bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50'
    }`}>
      {currentPage !== 'auth' && (
        <Navigation 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          language={language}
          onLanguageChange={handleLanguageChange}
          user={user}
          onAuthClick={() => setCurrentPage('auth')}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
      )}
      
      {currentPage === 'home' && (
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className={`text-5xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Бесплатный AI Чат
            </h1>
            <p className={`text-xl mb-8 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Google Gemini 2.0, Meta Llama 3.3 70B, Qwen 2.5 72B
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentPage('chat')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Начать общение
              </button>
              <button
                onClick={() => setCurrentPage('admin')}
                className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Админ-панель
              </button>
            </div>
          </div>
        </div>
      )}
      
      {currentPage === 'chat' && <ChatInterface onNavigateAdmin={() => setCurrentPage('admin')} />}
      {currentPage === 'admin' && <AdminPanel />}
      {currentPage === 'auth' && <Auth onAuth={handleAuth} />}
      {currentPage === 'profile' && user && <Profile user={user} onLogout={handleLogout} />}
      
      <Footer />
      <ScrollToTop />
      <Toaster />
    </div>
  );
};

export default Index;