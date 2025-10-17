import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CTASectionProps {
  darkMode: boolean;
  onStartChat: () => void;
}

const CTASection = ({ darkMode, onStartChat }: CTASectionProps) => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className={`max-w-4xl mx-auto rounded-3xl p-12 text-center ${
        darkMode 
          ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-800' 
          : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'
      }`}>
        <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Начните работу с AI прямо сейчас
        </h2>
        <p className={`text-lg mb-8 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
          Бесплатный доступ ко всем моделям. Без регистрации.
        </p>
        <Button
          onClick={onStartChat}
          size="lg"
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-10 py-6"
        >
          <Icon name="Rocket" size={20} className="mr-2" />
          Начать общение
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
