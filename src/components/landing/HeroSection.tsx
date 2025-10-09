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
      title: 'Мультимодальная ИИ-платформа',
      subtitle: 'Нового поколения',
      description: 'Объединяем 15+ передовых моделей для работы с текстом, изображениями и видео в единой экосистеме',
      startButton: 'Начать работу',
      learnMore: 'Узнать больше',
      features: ['Мультимодальность', 'Безопасность', 'Масштабируемость']
    },
    en: {
      title: 'Multimodal AI Platform',
      subtitle: 'Next Generation',
      description: 'Combining 15+ cutting-edge models for text, images, and video in a unified ecosystem',
      startButton: 'Get Started',
      learnMore: 'Learn More',
      features: ['Multimodal', 'Secure', 'Scalable']
    }
  };

  const t = content[language];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/20 to-pink-600/20 animate-gradient-shift" style={{ backgroundSize: '400% 400%' }} />
      
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="max-w-5xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
            <Icon name="Sparkles" size={18} className="text-yellow-400" />
            <span className="text-sm font-medium text-white">{t.subtitle}</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
            {t.title}
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
            <Button
              onClick={onStartChat}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-6 text-lg rounded-xl shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300"
            >
              <Icon name="Zap" size={20} className="mr-2" />
              {t.startButton}
            </Button>
            <Button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg rounded-xl"
            >
              {t.learnMore}
              <Icon name="ArrowDown" size={20} className="ml-2" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-12">
            {t.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-300">
                <Icon name="CheckCircle" size={20} className="text-green-400" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <Icon name="ChevronDown" size={32} className="text-white/50" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
