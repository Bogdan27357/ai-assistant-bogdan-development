import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroSectionProps {
  darkMode: boolean;
}

const HeroSection = ({ darkMode }: HeroSectionProps) => {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block mb-6">
          <div className={`px-4 py-2 rounded-full ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-100 text-indigo-700'} text-sm font-medium`}>
            🚀 Ваш умный помощник готов к работе
          </div>
        </div>
        
        <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Возможности <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">БогданGPT</span>
        </h1>
        
        <p className={`text-xl md:text-2xl mb-10 ${darkMode ? 'text-slate-300' : 'text-slate-600'} max-w-3xl mx-auto`}>
          Генерация контента, создание изображений, обработка контента в файлах.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Воспользуйтесь виджетом в правом нижнем углу для начала работы 👇
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;