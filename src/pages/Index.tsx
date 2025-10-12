import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [isListening, setIsListening] = useState(false);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    const widgetElement = document.querySelector('elevenlabs-convai');
    
    if (widgetElement) {
      const observer = new MutationObserver(() => {
        const button = widgetElement.shadowRoot?.querySelector('button');
        if (button) {
          const ariaLabel = button.getAttribute('aria-label');
          setIsListening(ariaLabel === 'Stop conversation');
        }
      });

      if (widgetElement.shadowRoot) {
        observer.observe(widgetElement.shadowRoot, {
          attributes: true,
          subtree: true,
          attributeFilter: ['aria-label']
        });
      }

      return () => observer.disconnect();
    }
  }, []);

  const handleVoiceClick = () => {
    const widgetElement = document.querySelector('elevenlabs-convai');
    const button = widgetElement?.shadowRoot?.querySelector('button') as HTMLElement;
    
    if (button) {
      button.click();
      setPulseAnimation(true);
      setTimeout(() => setPulseAnimation(false), 600);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)]" />
      
      <div className="absolute top-0 left-0 w-full h-full">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-indigo-500/20 blur-xl animate-float"
            style={{
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4">
            Поехали!
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 font-light">
            Нажми на кнопку и начни разговор с AI
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={handleVoiceClick}
            className={`relative group w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 
              hover:scale-110 transition-all duration-300 flex items-center justify-center
              ${pulseAnimation ? 'animate-pulse-ring' : ''}
              ${isListening ? 'animate-pulse-slow' : ''}`}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
            
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-white/20 to-transparent backdrop-blur-sm flex items-center justify-center">
              {isListening ? (
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

            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
                <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" style={{ animationDelay: '0.3s' }} />
              </>
            )}
          </button>

          <div className="text-center">
            <p className={`text-lg font-medium transition-colors duration-300 ${
              isListening ? 'text-green-400 animate-pulse' : 'text-slate-400'
            }`}>
              {isListening ? '🎙️ Слушаю...' : 'Нажми для начала'}
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap gap-4 justify-center text-sm text-slate-400">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
            <Icon name="Sparkles" size={16} />
            <span>Голосовой AI</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
            <Icon name="Zap" size={16} />
            <span>Мгновенные ответы</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full">
            <Icon name="Globe" size={16} />
            <span>24/7 доступно</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-30px) translateX(20px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

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

        .animate-float {
          animation: float linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
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
