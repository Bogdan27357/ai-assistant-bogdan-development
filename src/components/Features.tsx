import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: 'Code',
    title: 'Генерация кода',
    description: 'Создание кода на любых языках с подробными объяснениями и лучшими практиками',
    gradient: 'from-indigo-500 to-purple-600',
    examples: ['Python', 'JavaScript', 'SQL']
  },
  {
    icon: 'FileText',
    title: 'Анализ документов',
    description: 'Глубокий анализ текстов, извлечение ключевой информации и структурирование данных',
    gradient: 'from-purple-500 to-pink-600',
    examples: ['PDF', 'Резюме', 'Данные']
  },
  {
    icon: 'Languages',
    title: 'Переводы',
    description: 'Профессиональный перевод на 70+ языков с сохранением стиля и контекста',
    gradient: 'from-blue-500 to-cyan-600',
    examples: ['RU ⟷ EN', 'Деловые', 'Техдок']
  },
  {
    icon: 'Lightbulb',
    title: 'Креативное письмо',
    description: 'Создание уникального контента для бизнеса, маркетинга и личных нужд',
    gradient: 'from-emerald-500 to-teal-600',
    examples: ['Статьи', 'Email', 'Соцсети']
  },
  {
    icon: 'BookOpen',
    title: 'Обучение',
    description: 'Понятные объяснения сложных тем, решение задач и помощь в обучении',
    gradient: 'from-orange-500 to-red-600',
    examples: ['Математика', 'Код', 'Наука']
  },
  {
    icon: 'Workflow',
    title: 'Автоматизация',
    description: 'Планирование проектов, создание структур и организация рабочих процессов',
    gradient: 'from-pink-500 to-rose-600',
    examples: ['Планы', 'TODO', 'Структуры']
  },
  {
    icon: 'MessageSquare',
    title: 'Умные диалоги',
    description: 'Запоминает контекст беседы и адаптируется к вашему стилю общения',
    gradient: 'from-cyan-500 to-blue-600',
    examples: ['Память', 'Контекст', 'Стиль']
  },
  {
    icon: 'Volume2',
    title: 'Озвучка ответов',
    description: 'Голосовое воспроизведение на 8 языках с выбором голоса и акцента',
    gradient: 'from-violet-500 to-purple-600',
    examples: ['16 голосов', '8 языков', 'HD звук']
  },
  {
    icon: 'Zap',
    title: 'Скорость',
    description: 'Молниеносные ответы благодаря современной архитектуре и оптимизации',
    gradient: 'from-amber-500 to-orange-600',
    examples: ['< 1 сек', 'Потоки', 'Кэш']
  }
];

const Features = () => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6 backdrop-blur-sm">
            <Icon name="Sparkles" size={18} className="text-indigo-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Возможности
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Всё, что вам нужно
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Богдан объединяет самые современные технологии для решения любых задач
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-8 bg-gradient-to-br from-slate-900/80 to-slate-800/80 border-slate-700/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 animate-scale-in group cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                <Icon name={feature.icon as any} size={30} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-5">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.examples?.map((example, i) => (
                  <span 
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-full bg-slate-800/80 text-gray-300 border border-slate-700/50 font-medium"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
