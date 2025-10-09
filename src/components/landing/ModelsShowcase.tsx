import { Language } from '@/lib/i18n';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ModelsShowcaseProps {
  language: Language;
}

const ModelsShowcase = ({ language }: ModelsShowcaseProps) => {
  const content = {
    ru: {
      title: 'Библиотека моделей',
      subtitle: '15 специализированных моделей для любых задач',
      categories: [
        {
          name: 'Текстовые модели',
          icon: 'MessageSquare',
          color: 'from-blue-500 to-cyan-500',
          models: [
            { name: 'Быстрый', desc: 'Мгновенные ответы', speed: 'Высокая' },
            { name: 'Программист', desc: 'Генерация кода', speed: 'Высокая' },
            { name: 'Творец', desc: 'Креативный контент', speed: 'Средняя' },
            { name: 'Логик', desc: 'Аналитика и рассуждения', speed: 'Средняя' },
            { name: 'Полиглот', desc: 'Переводы', speed: 'Высокая' },
            { name: 'Универсал', desc: 'Все задачи', speed: 'Средняя' }
          ]
        },
        {
          name: 'Визуальные модели',
          icon: 'Eye',
          color: 'from-purple-500 to-pink-500',
          models: [
            { name: 'Визор Быстрый', desc: 'Анализ изображений', speed: 'Высокая' },
            { name: 'Визор Детальный', desc: 'Глубокий анализ', speed: 'Средняя' },
            { name: 'Визор Эксперт', desc: 'Экспертная оценка', speed: 'Низкая' }
          ]
        },
        {
          name: 'Художники',
          icon: 'Image',
          color: 'from-green-500 to-emerald-500',
          models: [
            { name: 'Художник Быстрый', desc: 'Быстрая генерация', speed: 'Высокая' },
            { name: 'Художник Детальный', desc: 'Качественные изображения', speed: 'Средняя' }
          ]
        },
        {
          name: 'Режиссёры',
          icon: 'Video',
          color: 'from-orange-500 to-red-500',
          models: [
            { name: 'Режиссёр 5с', desc: 'Короткое видео', speed: 'Средняя' },
            { name: 'Режиссёр 5с HD', desc: 'HD качество', speed: 'Низкая' },
            { name: 'Режиссёр 10с', desc: 'Длинное видео', speed: 'Низкая' }
          ]
        }
      ]
    },
    en: {
      title: 'Model Library',
      subtitle: '15 specialized models for any task',
      categories: [
        {
          name: 'Text Models',
          icon: 'MessageSquare',
          color: 'from-blue-500 to-cyan-500',
          models: [
            { name: 'Fast', desc: 'Instant responses', speed: 'High' },
            { name: 'Coder', desc: 'Code generation', speed: 'High' },
            { name: 'Creator', desc: 'Creative content', speed: 'Medium' },
            { name: 'Analyst', desc: 'Analytics & reasoning', speed: 'Medium' },
            { name: 'Translator', desc: 'Translations', speed: 'High' },
            { name: 'Universal', desc: 'All tasks', speed: 'Medium' }
          ]
        },
        {
          name: 'Vision Models',
          icon: 'Eye',
          color: 'from-purple-500 to-pink-500',
          models: [
            { name: 'Vision Fast', desc: 'Image analysis', speed: 'High' },
            { name: 'Vision Detailed', desc: 'Deep analysis', speed: 'Medium' },
            { name: 'Vision Expert', desc: 'Expert evaluation', speed: 'Low' }
          ]
        },
        {
          name: 'Artists',
          icon: 'Image',
          color: 'from-green-500 to-emerald-500',
          models: [
            { name: 'Artist Fast', desc: 'Quick generation', speed: 'High' },
            { name: 'Artist Detailed', desc: 'Quality images', speed: 'Medium' }
          ]
        },
        {
          name: 'Directors',
          icon: 'Video',
          color: 'from-orange-500 to-red-500',
          models: [
            { name: 'Director 5s', desc: 'Short video', speed: 'Medium' },
            { name: 'Director 5s HD', desc: 'HD quality', speed: 'Low' },
            { name: 'Director 10s', desc: 'Long video', speed: 'Low' }
          ]
        }
      ]
    }
  };

  const t = content[language];

  const getSpeedColor = (speed: string) => {
    if (speed === 'Высокая' || speed === 'High') return 'bg-green-500/20 text-green-400 border-green-500/50';
    if (speed === 'Средняя' || speed === 'Medium') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
    return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
  };

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-purple-950/30 to-indigo-950/30" />
      
      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-white">
            {t.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="space-y-12 max-w-7xl mx-auto">
          {t.categories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="space-y-6 animate-slide-up" style={{ animationDelay: `${categoryIndex * 0.2}s` }}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                  <Icon name={category.icon as any} size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white">{category.name}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.models.map((model, modelIndex) => (
                  <Card
                    key={modelIndex}
                    className="group relative p-6 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-lg`} />
                    
                    <div className="relative space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xl font-bold text-white">
                          {model.name}
                        </h4>
                        <Badge className={`${getSpeedColor(model.speed)} border`}>
                          {model.speed}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-400">
                        {model.desc}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelsShowcase;
