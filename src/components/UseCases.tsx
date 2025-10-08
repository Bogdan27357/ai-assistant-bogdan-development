import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Language, getTranslations } from '@/lib/i18n';

const useCases = [
  {
    category: 'Для разработчиков',
    icon: 'Code',
    gradient: 'from-indigo-500 to-purple-600',
    examples: [
      { task: 'Написать функцию сортировки', result: 'Код на Python с объяснением' },
      { task: 'Оптимизировать SQL запрос', result: 'Улучшенный запрос + анализ' },
      { task: 'Создать REST API', result: 'Полная документация + примеры' }
    ]
  },
  {
    category: 'Для бизнеса',
    icon: 'Briefcase',
    gradient: 'from-purple-500 to-pink-600',
    examples: [
      { task: 'Составить бизнес-план', result: 'Структурированный план' },
      { task: 'Написать email рассылку', result: 'Готовое письмо + тема' },
      { task: 'Анализ конкурентов', result: 'SWOT анализ + рекомендации' }
    ]
  },
  {
    category: 'Для обучения',
    icon: 'GraduationCap',
    gradient: 'from-blue-500 to-cyan-600',
    examples: [
      { task: 'Объясни квантовую физику', result: 'Простое объяснение + примеры' },
      { task: 'Реши математическую задачу', result: 'Пошаговое решение' },
      { task: 'Подготовь конспект', result: 'Структурированные заметки' }
    ]
  },
  {
    category: 'Для творчества',
    icon: 'Palette',
    gradient: 'from-emerald-500 to-teal-600',
    examples: [
      { task: 'Напиши короткий рассказ', result: 'Креативная история' },
      { task: 'Придумай слоган', result: '10 вариантов слоганов' },
      { task: 'Создай сценарий видео', result: 'Детальный сценарий' }
    ]
  }
];

interface UseCasesProps {
  onStartChat: () => void;
  language?: Language;
}

const UseCases = ({ onStartChat, language = 'ru' }: UseCasesProps) => {
  const t = getTranslations(language).useCases;
  
  const useCasesData = [
    {
      category: t.students,
      description: t.studentsDesc,
      icon: 'GraduationCap',
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      category: t.developers,
      description: t.developersDesc,
      icon: 'Code',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      category: t.business,
      description: t.businessDesc,
      icon: 'Briefcase',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      category: t.creative,
      description: t.creativeDesc,
      icon: 'Palette',
      gradient: 'from-emerald-500 to-teal-600'
    }
  ];
  
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.1),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(168,85,247,0.1),transparent)]" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-20 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6 backdrop-blur-sm">
            <Icon name="Target" size={18} className="text-indigo-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              {t.title}
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {t.title}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {useCasesData.map((useCase, index) => (
            <Card 
              key={index}
              className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 animate-scale-in backdrop-blur-sm shadow-xl hover:shadow-2xl group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform`}>
                  <Icon name={useCase.icon as any} size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">{useCase.category}</h3>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">{useCase.description}</p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="p-12 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30 backdrop-blur-sm shadow-2xl inline-block">
            <div className="max-w-2xl">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-2xl">
                <Icon name="Rocket" size={40} className="text-white" />
              </div>
              <Button 
                size="lg"
                onClick={onStartChat}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-12 py-6 text-xl font-bold rounded-2xl shadow-2xl shadow-indigo-500/50 hover:shadow-indigo-500/70 transition-all duration-300 hover:scale-110"
              >
                <Icon name="MessageCircle" size={28} className="mr-3" />
                {t.startNow}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UseCases;