import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/sonner";
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import Auth from '@/components/Auth';
import Profile from '@/components/Profile';
import ScrollToTop from '@/components/ScrollToTop';
import ChatInterface from '@/components/ChatInterface';
import AdminPanel from '@/components/AdminPanel';
import VoiceAssistant from '@/components/VoiceAssistant';
import Icon from '@/components/ui/icon';
import { Language } from '@/lib/i18n';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'profile' | 'chat' | 'admin'>('home');
  const [language, setLanguage] = useState<Language>('ru');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);

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
                Голосовой помощник аэропорта Пулково
              </h1>
              <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Узнайте всё о парковках, транспорте и услугах
              </p>
            </div>

            {!voiceAssistantOpen ? (
              <div className="text-center space-y-8">
                <button
                  onClick={() => setVoiceAssistantOpen(true)}
                  className="mx-auto w-48 h-48 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center hover:shadow-green-500/50 animate-pulse"
                >
                  <Icon name="Mic" size={96} />
                </button>

                <div className={`max-w-2xl mx-auto ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  <h2 className="text-2xl font-semibold mb-6">Как пользоваться помощником:</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                      <div className="text-4xl mb-4">1️⃣</div>
                      <h3 className="font-semibold mb-2">Нажмите на микрофон</h3>
                      <p className="text-sm opacity-80">Кликните по зелёной кнопке выше</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                      <div className="text-4xl mb-4">2️⃣</div>
                      <h3 className="font-semibold mb-2">Начните говорить</h3>
                      <p className="text-sm opacity-80">Задайте вопрос голосом</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                      <div className="text-4xl mb-4">3️⃣</div>
                      <h3 className="font-semibold mb-2">Получите ответ</h3>
                      <p className="text-sm opacity-80">Помощник ответит голосом</p>
                    </div>
                  </div>
                </div>

                <div className={`max-w-xl mx-auto text-left ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'} border ${darkMode ? 'border-blue-700' : 'border-blue-200'} rounded-lg p-6`}>
                  <h3 className={`font-semibold mb-3 ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>Примеры вопросов:</h3>
                  <ul className={`space-y-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Где находится парковка P1?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Как добраться до аэропорта на автобусе?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Какие услуги есть в терминале?</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Где получить помощь с багажом?</span>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <VoiceAssistant embedded={true} onOpen={() => setVoiceAssistantOpen(true)} />
                <div className="text-center mt-6">
                  <button
                    onClick={() => setVoiceAssistantOpen(false)}
                    className={`text-sm ${darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-900'} transition-colors`}
                  >
                    Закрыть помощник
                  </button>
                </div>
              </div>
            )}
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