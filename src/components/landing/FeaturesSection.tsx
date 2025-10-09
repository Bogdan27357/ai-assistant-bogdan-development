import { Language } from '@/lib/i18n';
import Icon from '@/components/ui/icon';
import { Card } from '@/components/ui/card';

interface FeaturesSectionProps {
  language: Language;
}

const FeaturesSection = ({ language }: FeaturesSectionProps) => {
  const content = {
    ru: {
      title: 'Возможности платформы',
      subtitle: 'Всё что нужно для работы с ИИ',
      features: [
        {
          icon: 'MessageSquare',
          title: 'Текстовые модели',
          description: 'Генерация текста, анализ, перевод и программирование с 6 специализированными моделями',
          color: 'from-blue-500 to-cyan-500'
        },
        {
          icon: 'Eye',
          title: 'Компьютерное зрение',
          description: 'Анализ изображений, распознавание объектов и сцен с 3 визуальными моделями',
          color: 'from-purple-500 to-pink-500'
        },
        {
          icon: 'Image',
          title: 'Генерация изображений',
          description: 'Создание уникальных изображений с 2 моделями генерации высокого качества',
          color: 'from-green-500 to-emerald-500'
        },
        {
          icon: 'Video',
          title: 'Генерация видео',
          description: 'Создание видеоконтента от 5 до 10 секунд с 3 видео-моделями',
          color: 'from-orange-500 to-red-500'
        },
        {
          icon: 'Zap',
          title: 'Быстрая обработка',
          description: 'Моментальные ответы и стриминг токенов для комфортной работы',
          color: 'from-yellow-500 to-amber-500'
        },
        {
          icon: 'Shield',
          title: 'Безопасность',
          description: 'Шифрование данных, контроль доступа и приватность пользователей',
          color: 'from-indigo-500 to-violet-500'
        }
      ]
    },
    en: {
      title: 'Platform Capabilities',
      subtitle: 'Everything you need to work with AI',
      features: [
        {
          icon: 'MessageSquare',
          title: 'Text Models',
          description: 'Text generation, analysis, translation, and programming with 6 specialized models',
          color: 'from-blue-500 to-cyan-500'
        },
        {
          icon: 'Eye',
          title: 'Computer Vision',
          description: 'Image analysis, object and scene recognition with 3 visual models',
          color: 'from-purple-500 to-pink-500'
        },
        {
          icon: 'Image',
          title: 'Image Generation',
          description: 'Create unique images with 2 high-quality generation models',
          color: 'from-green-500 to-emerald-500'
        },
        {
          icon: 'Video',
          title: 'Video Generation',
          description: 'Create video content from 5 to 10 seconds with 3 video models',
          color: 'from-orange-500 to-red-500'
        },
        {
          icon: 'Zap',
          title: 'Fast Processing',
          description: 'Instant responses and token streaming for comfortable work',
          color: 'from-yellow-500 to-amber-500'
        },
        {
          icon: 'Shield',
          title: 'Security',
          description: 'Data encryption, access control, and user privacy',
          color: 'from-indigo-500 to-violet-500'
        }
      ]
    }
  };

  const t = content[language];

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/30 to-transparent" />
      
      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-white">
            {t.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {t.features.map((feature, index) => (
            <Card
              key={index}
              className="group relative p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50 hover:border-slate-600 transition-all duration-500 hover:scale-105 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-lg`} />
              
              <div className="relative space-y-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <Icon name={feature.icon as any} size={28} className="text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-white">
                  {feature.title}
                </h3>
                
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
