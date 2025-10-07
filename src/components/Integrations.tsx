import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const integrations = [
  {
    name: 'Gemini 2.0 Flash Experimental',
    subtitle: 'Google',
    description: 'Мультимодальная модель с поддержкой изображений, аудио и видео',
    icon: 'Sparkles',
    color: 'from-blue-500 to-cyan-500',
    status: 'free',
    features: ['Мультимодальность', 'Быстрая обработка', 'Длинный контекст']
  },
  {
    name: 'Llama 3.3 70B Instruct',
    subtitle: 'Meta',
    description: '70B параметров для сложных задач и глубокого анализа',
    icon: 'Cpu',
    color: 'from-purple-500 to-pink-500',
    status: 'free',
    features: ['Open Source', 'Reasoning', 'Инструкции']
  },
  {
    name: 'GigaChat',
    subtitle: 'Сбер',
    description: 'Российская языковая модель с поддержкой русского языка',
    icon: 'MessageSquare',
    color: 'from-emerald-500 to-teal-500',
    status: 'api',
    features: ['Русский язык', 'Локальные данные', 'Безопасность']
  }
];

const Integrations = () => {
  return (
    <section className="py-20 px-6 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-black mb-4 text-white">
            ИИ Интеграции
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Три мощные модели работают вместе для максимальной эффективности
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {integrations.map((integration, index) => (
            <Card 
              key={index}
              className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-indigo-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/30 animate-scale-in group"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${integration.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative p-8">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${integration.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={integration.icon as any} size={32} className="text-white" />
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">{integration.subtitle}</p>
                      <h3 className="text-xl font-bold text-white">{integration.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-emerald-400 font-semibold uppercase">
                        {integration.status === 'free' ? 'FREE' : 'API'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 leading-relaxed mb-4 text-sm">
                  {integration.description}
                </p>

                <div className="space-y-2 mb-4">
                  {integration.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-gray-400">
                      <div className="w-1 h-1 rounded-full bg-indigo-400" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Icon name="Zap" size={14} />
                    <span>Быстро</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Icon name="Shield" size={14} />
                    <span>Безопасно</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="inline-block p-6 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border-indigo-500/30">
            <div className="flex items-center gap-4">
              <Icon name="Info" size={24} className="text-indigo-400" />
              <p className="text-gray-300">
                Управляйте интеграциями через <span className="text-indigo-400 font-semibold">Админ-панель</span> - включайте/отключайте модели и настраивайте API ключи
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Integrations;