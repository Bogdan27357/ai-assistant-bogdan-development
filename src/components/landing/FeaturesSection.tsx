import { Language } from '@/lib/i18n';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface FeaturesSectionProps {
  language: Language;
}

const FeaturesSection = ({ language }: FeaturesSectionProps) => {
  const content = {
    ru: {
      title: 'Что умеет Богдан',
      features: [
        {
          icon: 'MessageSquare',
          title: 'Текст',
          description: 'Пишет, переводит, кодит',
          color: 'from-blue-500 to-cyan-500'
        },
        {
          icon: 'Image',
          title: 'Фото',
          description: 'Генерит и анализирует',
          color: 'from-purple-500 to-pink-500'
        },
        {
          icon: 'Video',
          title: 'Видео',
          description: 'Создает клипы 5-10 сек',
          color: 'from-green-500 to-emerald-500'
        }
      ]
    },
    en: {
      title: 'What Bogdan Can Do',
      features: [
        {
          icon: 'MessageSquare',
          title: 'Text',
          description: 'Writes, translates, codes',
          color: 'from-blue-500 to-cyan-500'
        },
        {
          icon: 'Image',
          title: 'Images',
          description: 'Generates & analyzes',
          color: 'from-purple-500 to-pink-500'
        },
        {
          icon: 'Video',
          title: 'Video',
          description: 'Creates 5-10 sec clips',
          color: 'from-green-500 to-emerald-500'
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section id="features" className="relative py-20 overflow-hidden">
      <div className="relative container mx-auto px-6 max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
          {t.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {t.features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl hover:border-slate-600 transition-all duration-300 hover:scale-105"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon name={feature.icon as any} size={32} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;