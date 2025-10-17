import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';

interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  features: string[];
}

interface AIModelsSectionProps {
  darkMode: boolean;
  aiModels: AIModel[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const AIModelsSection = ({ darkMode, aiModels, selectedCategory, onCategoryChange }: AIModelsSectionProps) => {
  const categories = [
    { id: 'all', label: 'Все', icon: 'Grid3x3' },
    { id: 'text', label: 'Текст', icon: 'MessageSquare' },
    { id: 'image', label: 'Изображения', icon: 'Image' },
    { id: 'video', label: 'Видео', icon: 'Video' },
    { id: 'audio', label: 'Аудио', icon: 'Headphones' }
  ];

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
          Нейросети
        </h2>
        <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-8`}>
          Работа с текстом, изображениями, видео и аудио
        </p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              className={selectedCategory === cat.id 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                : darkMode 
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                  : 'border-slate-300 text-slate-700 hover:bg-slate-100'
              }
            >
              <Icon name={cat.icon as any} size={16} className="mr-2" />
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {aiModels
          .filter(model => selectedCategory === 'all' || model.category === selectedCategory)
          .map((model) => (
            <Card
              key={model.id}
              className={`${
                darkMode 
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                  : 'bg-white border-slate-200 hover:border-slate-300'
              } transition-all hover:scale-105 cursor-pointer backdrop-blur-sm`}
            >
              <CardContent className="p-6">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center mb-4`}>
                  <Icon name={model.icon as any} size={28} className="text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  {model.name}
                </h3>
                <p className={`text-xs mb-3 ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                  {model.provider}
                </p>
                <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {model.description}
                </p>
                <div className="space-y-2">
                  {model.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Icon name="Check" size={14} className="text-green-500" />
                      <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </section>
  );
};

export default AIModelsSection;