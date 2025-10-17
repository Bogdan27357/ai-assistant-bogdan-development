import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  darkMode: boolean;
  onStartChat: () => void;
}

const HeroSection = ({ darkMode, onStartChat }: HeroSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block mb-6">
          <div className={`px-4 py-2 rounded-full ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-100 text-indigo-700'} text-sm font-medium`}>
            🚀 Все популярные нейросети в одном месте
          </div>
        </div>
        
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Возможности <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">БогданGPT</span>
        </h1>
        
        <p className={`text-xl md:text-2xl mb-10 ${darkMode ? 'text-slate-300' : 'text-slate-600'} max-w-3xl mx-auto`}>
          Генерация контента, создание изображений, обработка контента в файлах.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button
            onClick={onStartChat}
            size="lg"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-8 py-6 rounded-full"
          >
            <Icon name="Sparkles" size={20} className="mr-2" />
            Начать работу
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;