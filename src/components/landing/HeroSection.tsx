import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Language } from '@/lib/i18n';

interface HeroSectionProps {
  onStartChat: () => void;
  language: Language;
}

const HeroSection = ({ onStartChat, language }: HeroSectionProps) => {
  const content = {
    ru: {
      title: 'Богдан',
      subtitle: 'Твой цифровой помощник',
      description: 'ИИ для текста, фото и видео',
      startButton: 'Поехали',
      stats: ['15+ моделей', '99.9% аптайм', 'Без ограничений']
    },
    en: {
      title: 'Bogdan',
      subtitle: 'Your Digital Assistant',
      description: 'AI for text, images & video',
      startButton: 'Let\'s Go',
      stats: ['15+ models', '99.9% uptime', 'No limits']
    }
  };

  const t = content[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
      
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-32">
        <div className="max-w-4xl mx-auto text-center space-y-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-500/20 backdrop-blur-sm rounded-full border border-indigo-400/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white">{t.subtitle}</span>
          </div>

          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-white tracking-tight">
            {t.title}
          </h1>

          <p className="text-2xl md:text-3xl text-gray-400 font-light">
            {t.description}
          </p>

          <Button
            onClick={onStartChat}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-12 py-7 text-xl rounded-2xl shadow-2xl shadow-indigo-500/50 hover:scale-105 transition-all duration-300 font-bold"
          >
            {t.startButton}
            <Icon name="ArrowRight" size={24} className="ml-2" />
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-12 pt-16 text-sm">
            {t.stats.map((stat, index) => (
              <div key={index} className="text-gray-400 font-medium">
                {stat}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );}
};

export default HeroSection;