import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface HeroProps {
  onStartChat: () => void;
}

const Hero = ({ onStartChat }: HeroProps) => {
  return (
    <section className="pt-32 pb-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent animate-gradient-shift bg-[length:200%_200%]" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
            <Icon name="Sparkles" size={16} className="text-indigo-400" />
            <span className="text-sm text-indigo-300">Интеллектуальный помощник нового поколения</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              Богдан
            </span>
            <br />
            <span className="text-white">Ваш личный ИИ-помощник</span>
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Интеллектуальный помощник для решения любых задач. 
            Умный анализ, креативные решения, мгновенные ответы. Всегда на связи.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={onStartChat}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg shadow-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/60 transition-all duration-300 hover:scale-105"
            >
              <Icon name="MessageCircle" size={24} className="mr-2" />
              Начать общение
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-indigo-400/30 text-white hover:bg-indigo-500/10 px-8 py-6 text-lg font-semibold rounded-2xl"
            >
              <Icon name="Play" size={24} className="mr-2" />
              Посмотреть демо
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center animate-scale-in">
              <div className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
                3
              </div>
              <div className="text-sm text-gray-400">ИИ модели</div>
            </div>
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-sm text-gray-400">Доступность</div>
            </div>
            <div className="text-center animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                ∞
              </div>
              <div className="text-sm text-gray-400">Возможности</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;