import { useState } from 'react';
import { Language } from '@/lib/i18n';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface InteractiveDemoProps {
  onStartChat: () => void;
  language: Language;
}

const InteractiveDemo = ({ onStartChat, language }: InteractiveDemoProps) => {
  const [activeTab, setActiveTab] = useState('text');

  const content = {
    ru: {
      title: 'Попробуйте сами',
      subtitle: 'Интерактивная демонстрация возможностей',
      tryButton: 'Попробовать бесплатно',
      tabs: {
        text: 'Текст',
        vision: 'Зрение',
        image: 'Изображения',
        video: 'Видео'
      },
      demos: {
        text: {
          title: 'Текстовые модели',
          examples: [
            'Напиши функцию на Python для сортировки массива',
            'Создай маркетинговый текст для нового продукта',
            'Переведи на английский: "Как дела?"'
          ]
        },
        vision: {
          title: 'Анализ изображений',
          examples: [
            'Опиши что на этом изображении',
            'Найди все объекты на фото',
            'Оцени качество этой фотографии'
          ]
        },
        image: {
          title: 'Генерация изображений',
          examples: [
            'Создай футуристический город на закате',
            'Нарисуй милого робота-помощника',
            'Сгенерируй абстрактный паттерн'
          ]
        },
        video: {
          title: 'Генерация видео',
          examples: [
            'Создай видео: волны на пляже',
            'Сделай анимацию летящей птицы',
            'Сгенерируй плавный переход цветов'
          ]
        }
      }
    },
    en: {
      title: 'Try It Yourself',
      subtitle: 'Interactive demonstration of capabilities',
      tryButton: 'Try for Free',
      tabs: {
        text: 'Text',
        vision: 'Vision',
        image: 'Images',
        video: 'Video'
      },
      demos: {
        text: {
          title: 'Text Models',
          examples: [
            'Write a Python function to sort an array',
            'Create marketing text for a new product',
            'Translate to Russian: "How are you?"'
          ]
        },
        vision: {
          title: 'Image Analysis',
          examples: [
            'Describe what is in this image',
            'Find all objects in the photo',
            'Evaluate the quality of this photo'
          ]
        },
        image: {
          title: 'Image Generation',
          examples: [
            'Create a futuristic city at sunset',
            'Draw a cute robot assistant',
            'Generate an abstract pattern'
          ]
        },
        video: {
          title: 'Video Generation',
          examples: [
            'Create video: waves on the beach',
            'Make an animation of a flying bird',
            'Generate a smooth color transition'
          ]
        }
      }
    }
  };

  const t = content[language];
  const currentDemo = t.demos[activeTab as keyof typeof t.demos];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
      
      <div className="relative container mx-auto px-6">
        <div className="text-center mb-16 space-y-4 animate-fade-in">
          <h2 className="text-5xl md:text-6xl font-bold text-white">
            {t.title}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="text" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=inactive]:bg-slate-800/50 py-4 rounded-xl text-white border border-slate-700"
              >
                <Icon name="MessageSquare" size={20} className="mr-2" />
                {t.tabs.text}
              </TabsTrigger>
              <TabsTrigger 
                value="vision" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=inactive]:bg-slate-800/50 py-4 rounded-xl text-white border border-slate-700"
              >
                <Icon name="Eye" size={20} className="mr-2" />
                {t.tabs.vision}
              </TabsTrigger>
              <TabsTrigger 
                value="image" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=inactive]:bg-slate-800/50 py-4 rounded-xl text-white border border-slate-700"
              >
                <Icon name="Image" size={20} className="mr-2" />
                {t.tabs.image}
              </TabsTrigger>
              <TabsTrigger 
                value="video" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=inactive]:bg-slate-800/50 py-4 rounded-xl text-white border border-slate-700"
              >
                <Icon name="Video" size={20} className="mr-2" />
                {t.tabs.video}
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-8 animate-fade-in">
              <Card className="p-8 bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm border-slate-700/50">
                <h3 className="text-2xl font-bold text-white mb-6">{currentDemo.title}</h3>
                
                <div className="space-y-4">
                  {currentDemo.examples.map((example, index) => (
                    <button
                      key={index}
                      onClick={onStartChat}
                      className="w-full text-left p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-slate-600 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300 group-hover:text-white transition-colors">
                          {example}
                        </span>
                        <Icon name="ArrowRight" size={20} className="text-gray-500 group-hover:text-white transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-center">
                  <Button
                    onClick={onStartChat}
                    size="lg"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-4 rounded-xl"
                  >
                    <Icon name="Sparkles" size={20} className="mr-2" />
                    {t.tryButton}
                  </Button>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
