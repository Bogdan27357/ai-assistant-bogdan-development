import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

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
}

const UseCases = ({ onStartChat }: UseCasesProps) => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-black mb-4 text-white">
            Как использовать Богдана
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Реальные примеры задач, которые решает наш ИИ-помощник каждый день
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => (
            <Card 
              key={index}
              className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center`}>
                  <Icon name={useCase.icon as any} size={32} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">{useCase.category}</h3>
              </div>

              <div className="space-y-4">
                {useCase.examples.map((example, i) => (
                  <div 
                    key={i}
                    className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <Icon name="MessageSquare" size={16} className="text-indigo-400 mt-1" />
                      <p className="text-gray-300 font-medium">{example.task}</p>
                    </div>
                    <div className="flex items-start gap-3 ml-7">
                      <Icon name="Sparkles" size={16} className="text-purple-400 mt-1" />
                      <p className="text-gray-400 text-sm">{example.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={onStartChat}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold rounded-2xl shadow-lg"
          >
            <Icon name="Rocket" size={24} className="mr-2" />
            Попробовать сейчас
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
