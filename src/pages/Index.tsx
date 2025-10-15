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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className={`text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Аэропорт Пулково
              </h1>
              <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Информация о парковках, транспорте и услугах
              </p>
            </div>

            <div className={`max-w-2xl mx-auto ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className={`${darkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-sm rounded-lg p-6 border ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="text-4xl mb-4">🅿️</div>
                  <h3 className="font-semibold mb-2 text-lg">Парковки</h3>
                  <p className="text-sm opacity-80">P1-P4: от 60₽/час, долгосрочная парковка от 250₽/сутки</p>
                </div>
                <div className={`${darkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-sm rounded-lg p-6 border ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="text-4xl mb-4">🚌</div>
                  <h3 className="font-semibold mb-2 text-lg">Транспорт</h3>
                  <p className="text-sm opacity-80">Автобус №39, 39Э до метро Московская. Такси, каршеринг</p>
                </div>
                <div className={`${darkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-sm rounded-lg p-6 border ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="text-4xl mb-4">📱</div>
                  <h3 className="font-semibold mb-2 text-lg">Услуги</h3>
                  <p className="text-sm opacity-80">WiFi, бизнес-залы, камеры хранения, аптека 24/7</p>
                </div>
                <div className={`${darkMode ? 'bg-white/5' : 'bg-white'} backdrop-blur-sm rounded-lg p-6 border ${darkMode ? 'border-white/10' : 'border-slate-200'}`}>
                  <div className="text-4xl mb-4">💼</div>
                  <h3 className="font-semibold mb-2 text-lg">Багаж</h3>
                  <p className="text-sm opacity-80">Правила провоза, служба розыска потерянного багажа</p>
                </div>
              </div>

              <div className={`mt-8 text-left ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border ${darkMode ? 'border-blue-700' : 'border-blue-200'} rounded-lg p-6`}>
                <h3 className={`font-semibold mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>Контакты:</h3>
                <ul className={`space-y-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                  <li>📞 Справочная: +7 (812) 337-38-22</li>
                  <li>🧳 Потерянный багаж: +7 (812) 704-38-22</li>
                  <li>🌐 Сайт: pulkovoairport.ru</li>
                </ul>
              </div>
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