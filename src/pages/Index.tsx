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
import Icon from '@/components/ui/icon';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<'home' | 'auth' | 'profile' | 'chat' | 'admin'>('home');
  const [language, setLanguage] = useState<Language>('ru');
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

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

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'ru-RU';
      
      recognitionInstance.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsRecording(false);
        setIsProcessing(true);
        
        try {
          const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL', {
            method: 'POST',
            headers: {
              'Accept': 'audio/mpeg',
              'Content-Type': 'application/json',
              'xi-api-key': 'sk_b7ee2eebc30257a8e7a5d07e30b1c905ec8e25fe104da351'
            },
            body: JSON.stringify({
              text: `Вы сказали: ${transcript}. Это тестовый ответ.`,
              model_id: 'eleven_monolingual_v1',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5
              }
            })
          });
          
          if (response.ok) {
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsProcessing(false);
        }
      };
      
      recognitionInstance.onerror = () => {
        setIsRecording(false);
        setIsProcessing(false);
      };
      
      setRecognition(recognitionInstance);
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

  const handleVoiceClick = () => {
    if (!recognition) return;
    
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
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
              Голосовой помощник
            </h1>
            <p className={`text-xl mb-8 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Нажмите на микрофон и начните говорить
            </p>

            <div className="flex justify-center mt-16">
              <button
                onClick={handleVoiceClick}
                className={`relative group w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
                  hover:scale-110 transition-all duration-300 flex items-center justify-center
                  ${isRecording ? 'animate-pulse-slow' : ''}
                  ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
                disabled={isProcessing}
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm flex items-center justify-center">
                  {isRecording ? (
                    <div className="flex gap-1.5">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-white rounded-full animate-wave"
                          style={{
                            height: '24px',
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <Icon name="Mic" size={40} className="text-white" />
                  )}
                </div>

                {isRecording && (
                  <>
                    <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                    <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" style={{ animationDelay: '0.3s' }} />
                  </>
                )}
              </button>
            </div>

            <p className={`mt-6 text-lg font-medium transition-colors duration-300 ${
              isRecording ? 'text-green-400 animate-pulse' : isProcessing ? 'text-yellow-400' : darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {isRecording ? '🎙️ Слушаю...' : isProcessing ? '⏳ Обрабатываю...' : 'Нажмите для начала'}
            </p>
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

      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes wave {
          0%, 100% { height: 12px; }
          50% { height: 32px; }
        }

        .animate-pulse-ring::after {
          content: '';
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          border: 3px solid white;
          animation: pulse-ring 0.6s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Index;