import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: 'Code',
    title: 'Генерация кода',
    description: 'Создание кода на Python, JavaScript, SQL и других языках с объяснениями',
    gradient: 'from-indigo-500 to-purple-600',
    examples: ['Python скрипты', 'SQL запросы', 'API интеграции']
  },
  {
    icon: 'FileText',
    title: 'Анализ документов',
    description: 'Обработка и анализ текстовых файлов, извлечение ключевой информации',
    gradient: 'from-purple-500 to-pink-600',
    examples: ['PDF анализ', 'Резюме текстов', 'Извлечение данных']
  },
  {
    icon: 'Languages',
    title: 'Переводы',
    description: 'Профессиональный перевод на 100+ языков с учетом контекста',
    gradient: 'from-blue-500 to-cyan-600',
    examples: ['Русский ⟷ English', 'Деловая переписка', 'Техническая документация']
  },
  {
    icon: 'Lightbulb',
    title: 'Креативное письмо',
    description: 'Создание статей, сценариев, маркетинговых текстов и контента',
    gradient: 'from-emerald-500 to-teal-600',
    examples: ['Статьи', 'Email рассылки', 'Посты для соцсетей']
  },
  {
    icon: 'BookOpen',
    title: 'Обучение и объяснения',
    description: 'Простые объяснения сложных концепций, решение задач, помощь в учебе',
    gradient: 'from-orange-500 to-red-600',
    examples: ['Математика', 'Программирование', 'Наука']
  },
  {
    icon: 'Database',
    title: 'База знаний',
    description: 'Загрузка своих документов для персонализированных ответов ИИ',
    gradient: 'from-violet-500 to-purple-600',
    examples: ['Корпоративные данные', 'Инструкции', 'Справочники']
  },
  {
    icon: 'Workflow',
    title: 'Автоматизация задач',
    description: 'Создание планов проектов, чек-листов, структурирование информации',
    gradient: 'from-pink-500 to-rose-600',
    examples: ['Планы проектов', 'TODO списки', 'Mind maps']
  },
  {
    icon: 'MessageSquare',
    title: 'Контекстные беседы',
    description: 'ИИ помнит историю чата и адаптируется к вашему стилю общения',
    gradient: 'from-cyan-500 to-blue-600',
    examples: ['Длинные диалоги', 'Уточнения', 'Контекст сессии']
  },
  {
    icon: 'Settings',
    title: 'Гибкие настройки',
    description: 'Настройка температуры, промптов, выбор между 3 ИИ моделями',
    gradient: 'from-amber-500 to-orange-600',
    examples: ['Gemini 2.0', 'Llama 3.2', 'GigaChat']
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
              <p className="text-gray-400 leading-relaxed mb-4">{feature.description}</p>
              <div className="flex flex-wrap gap-2">
                {feature.examples?.map((example, i) => (
                  <span 
                    key={i}
                    className="text-xs px-3 py-1 rounded-full bg-slate-800/80 text-gray-400 border border-slate-700/50"
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