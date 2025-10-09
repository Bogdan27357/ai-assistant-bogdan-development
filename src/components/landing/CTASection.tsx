import { Language } from '@/lib/i18n';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onStartChat: () => void;
  language: Language;
}

const CTASection = ({ onStartChat, language }: CTASectionProps) => {
  const content = {
    ru: {
      title: 'Готовы начать?',
      subtitle: 'Присоединяйтесь к тысячам пользователей уже работающих с нашей платформой',
      button: 'Начать бесплатно',
      features: [
        'Без кредитной карты',
        'Бесплатный пробный период',
        'Отмена в любой момент'
      ]
    },
    en: {
      title: 'Ready to Start?',
      subtitle: 'Join thousands of users already working with our platform',
      button: 'Start for Free',
      features: [
        'No credit card required',
        'Free trial period',
        'Cancel anytime'
      ]
    }
  };

  const t = content[language];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
      
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-scale-in">
          <h2 className="text-5xl md:text-6xl font-bold text-white">
            {t.title}
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          <div className="pt-6">
            <Button
              onClick={onStartChat}
              size="lg"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-12 py-6 text-xl rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
            >
              <Icon name="Rocket" size={24} className="mr-3" />
              {t.button}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-8">
            {t.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-300">
                <Icon name="CheckCircle2" size={20} className="text-green-400" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
