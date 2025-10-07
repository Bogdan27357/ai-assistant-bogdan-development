import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const Features2 = () => {
  const features = [
    {
      icon: '💬',
      title: 'Общение',
      description: 'Задавайте вопросы, получайте умные ответы',
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30'
    },
    {
      icon: '📝',
      title: 'Создание текстов',
      description: 'Статьи, письма, посты для соцсетей',
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30'
    },
    {
      icon: '🔍',
      title: 'Анализ данных',
      description: 'Обработка информации, выводы',
      color: 'from-emerald-500/20 to-teal-500/20',
      borderColor: 'border-emerald-500/30'
    },
    {
      icon: '🎓',
      title: 'Обучение',
      description: 'Объяснения, решение задач',
      color: 'from-amber-500/20 to-orange-500/20',
      borderColor: 'border-amber-500/30'
    },
    {
      icon: '💡',
      title: 'Идеи и советы',
      description: 'Генерация идей, рекомендации',
      color: 'from-indigo-500/20 to-purple-500/20',
      borderColor: 'border-indigo-500/30'
    },
    {
      icon: '🌐',
      title: 'Переводы',
      description: 'Перевод на любые языки',
      color: 'from-cyan-500/20 to-blue-500/20',
      borderColor: 'border-cyan-500/30'
    },
    {
      icon: '📊',
      title: 'Резюме',
      description: 'Краткое изложение длинных текстов',
      color: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'border-pink-500/30'
    },
    {
      icon: '🎨',
      title: 'Креатив',
      description: 'Истории, стихи, сценарии',
      color: 'from-violet-500/20 to-purple-500/20',
      borderColor: 'border-violet-500/30'
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-black text-white mb-4">Возможности помощника</h2>
          <p className="text-xl text-gray-400">Богдан поможет вам в самых разных задачах</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`p-6 bg-gradient-to-br ${feature.color} backdrop-blur-sm border ${feature.borderColor} hover:scale-105 transition-all duration-300 cursor-pointer animate-scale-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features2;
