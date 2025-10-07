import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: 'Brain',
    title: 'Интеллектуальный анализ',
    description: 'Глубокий анализ данных с использованием нейросетей последнего поколения',
    gradient: 'from-indigo-500 to-purple-600'
  },
  {
    icon: 'Zap',
    title: 'Мгновенные ответы',
    description: 'Обработка запросов в реальном времени с минимальной задержкой',
    gradient: 'from-purple-500 to-pink-600'
  },
  {
    icon: 'Shield',
    title: 'Безопасность данных',
    description: 'Шифрование API ключей и защита конфиденциальной информации',
    gradient: 'from-blue-500 to-cyan-600'
  },
  {
    icon: 'Layers',
    title: 'Мультимодальность',
    description: 'Работа с текстом, кодом, изображениями и документами',
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    icon: 'TrendingUp',
    title: 'Обучение на ходу',
    description: 'Адаптация к вашему стилю общения и предпочтениям',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    icon: 'Globe',
    title: 'Мультиязычность',
    description: 'Поддержка более 100 языков с высокой точностью перевода',
    gradient: 'from-violet-500 to-purple-600'
  }
];

const Features = () => {
  return (
    <section className="py-20 px-6 relative">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-5xl font-black mb-4 text-white">
            Возможности Богдана
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Передовые технологии для решения самых сложных задач
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/20 animate-scale-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={feature.icon as any} size={28} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
