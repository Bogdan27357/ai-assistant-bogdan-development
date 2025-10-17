import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';
import OpenRouterChat from '@/components/OpenRouterChat';

const aiModels = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Самая мощная модель для сложных задач',
    icon: 'Zap',
    color: 'from-green-500 to-emerald-600',
    category: 'text',
    features: ['Анализ изображений', 'Длинный контекст', 'Высокая точность']
  },
  {
    id: 'claude-3.5',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Отлично подходит для написания текстов',
    icon: 'FileText',
    color: 'from-purple-500 to-indigo-600',
    category: 'text',
    features: ['200K контекст', 'Творческое письмо', 'Анализ кода']
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Быстрая и эффективная модель',
    icon: 'Sparkles',
    color: 'from-blue-500 to-cyan-600',
    category: 'text',
    features: ['Мультимодальность', 'Скорость', 'Поиск в реальном времени']
  },
  {
    id: 'llama-3',
    name: 'Llama 3',
    provider: 'Meta',
    description: 'Открытая модель для разработчиков',
    icon: 'Code',
    color: 'from-orange-500 to-red-600',
    category: 'text',
    features: ['Open Source', 'Настройка', 'Безопасность']
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    provider: 'Midjourney',
    description: 'Генерация художественных изображений',
    icon: 'Image',
    color: 'from-pink-500 to-rose-600',
    category: 'image',
    features: ['Высокое качество', 'Художественный стиль', 'V6 модель']
  },
  {
    id: 'dall-e',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    description: 'Создание изображений по описанию',
    icon: 'Palette',
    color: 'from-yellow-500 to-orange-600',
    category: 'image',
    features: ['Точность описания', 'Высокое разрешение', 'Безопасность']
  },
  {
    id: 'runway',
    name: 'Runway Gen-2',
    provider: 'Runway',
    description: 'Генерация и редактирование видео',
    icon: 'Video',
    color: 'from-cyan-500 to-blue-600',
    category: 'video',
    features: ['Text-to-Video', 'Image-to-Video', 'Редактирование']
  },
  {
    id: 'sora',
    name: 'Sora',
    provider: 'OpenAI',
    description: 'Создание реалистичных видео',
    icon: 'Film',
    color: 'from-indigo-500 to-purple-600',
    category: 'video',
    features: ['60 секунд видео', 'Реализм', 'Физика движения']
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    provider: 'ElevenLabs',
    description: 'Синтез и клонирование голоса',
    icon: 'Mic',
    color: 'from-violet-500 to-fuchsia-600',
    category: 'audio',
    features: ['Озвучка текста', 'Клонирование', '29 языков']
  },
  {
    id: 'whisper',
    name: 'Whisper',
    provider: 'OpenAI',
    description: 'Распознавание речи и транскрибация',
    icon: 'AudioLines',
    color: 'from-emerald-500 to-teal-600',
    category: 'audio',
    features: ['99+ языков', 'Субтитры', 'Высокая точность']
  },
  {
    id: 'stable-audio',
    name: 'Stable Audio',
    provider: 'Stability AI',
    description: 'Генерация музыки и звуковых эффектов',
    icon: 'Music',
    color: 'from-red-500 to-pink-600',
    category: 'audio',
    features: ['До 3 минут', 'Коммерческое использование', 'Любой жанр']
  },
  {
    id: 'photoshop-ai',
    name: 'Photoshop AI',
    provider: 'Adobe',
    description: 'Редактирование фото с помощью AI',
    icon: 'Wand2',
    color: 'from-blue-600 to-indigo-700',
    category: 'image',
    features: ['Generative Fill', 'Удаление объектов', 'Расширение границ']
  }
];

const teamMembers = [
  {
    name: 'Алексей Иванов',
    role: 'Основатель & CEO',
    avatar: '👨‍💼',
    description: 'Эксперт в области AI с 10-летним опытом',
    social: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'Мария Петрова',
    role: 'CTO',
    avatar: '👩‍💻',
    description: 'Бывший инженер Google, специалист по ML',
    social: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'Дмитрий Сидоров',
    role: 'Head of Product',
    avatar: '👨‍🎨',
    description: 'Создатель продуктов для миллионов пользователей',
    social: { linkedin: '#', twitter: '#' }
  },
  {
    name: 'Анна Козлова',
    role: 'Head of AI Research',
    avatar: '👩‍🔬',
    description: 'PhD в Computer Science, автор 20+ публикаций',
    social: { linkedin: '#', twitter: '#' }
  }
];

const features = [
  {
    icon: 'Bot',
    title: 'Множество моделей',
    description: 'Доступ к GPT-4, Claude, Gemini и другим в одном месте'
  },
  {
    icon: 'Zap',
    title: 'Быстрый ответ',
    description: 'Моментальная обработка запросов без задержек'
  },
  {
    icon: 'Shield',
    title: 'Безопасность',
    description: 'Ваши данные защищены и не используются для обучения'
  },
  {
    icon: 'Sparkles',
    title: 'Умный выбор',
    description: 'Автоматический подбор лучшей модели для вашей задачи'
  }
];

const Index = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const storedTheme = localStorage.getItem('darkMode');
    if (storedTheme !== null) {
      setDarkMode(storedTheme === 'true');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-b from-white via-slate-50 to-white'
    }`}>
      {/* Header */}
      <header className={`border-b ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-white/50'} backdrop-blur-lg sticky top-0 z-50`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Icon name="Bot" size={24} className="text-white" />
              </div>
              <div>
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  AI Hub
                </h1>
                <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Агрегатор нейросетей
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={toggleDarkMode}
                variant="ghost"
                size="icon"
                className={darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}
              >
                <Icon name={darkMode ? 'Sun' : 'Moon'} size={20} />
              </Button>
              <Button
                onClick={() => setShowChat(!showChat)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <Icon name="MessageSquare" size={18} className="mr-2" />
                {showChat ? 'На главную' : 'Начать общение'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {showChat ? (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <Button
              onClick={() => setShowChat(false)}
              variant="ghost"
              className={`mb-4 ${darkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              <Icon name="ArrowLeft" size={18} className="mr-2" />
              Назад
            </Button>
            <OpenRouterChat />
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block mb-6">
                <div className={`px-4 py-2 rounded-full ${darkMode ? 'bg-indigo-500/10 text-indigo-400' : 'bg-indigo-100 text-indigo-700'} text-sm font-medium`}>
                  🚀 Все популярные нейросети в одном месте
                </div>
              </div>
              
              <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Агрегатор
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"> нейросетей</span>
              </h1>
              
              <p className={`text-xl md:text-2xl mb-10 ${darkMode ? 'text-slate-300' : 'text-slate-600'} max-w-3xl mx-auto`}>
                Используйте GPT-4, Claude, Gemini и другие AI-модели в едином интерфейсе. 
                Без VPN и лишних подписок.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => setShowChat(true)}
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-8 py-6"
                >
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Попробовать бесплатно
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className={`text-lg px-8 py-6 ${darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                >
                  <Icon name="Play" size={20} className="mr-2" />
                  Посмотреть демо
                </Button>
              </div>
            </div>
          </section>

          {/* AI Models Grid */}
          <section className="container mx-auto px-4 py-20">
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Доступные модели
              </h2>
              <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-8`}>
                Выбирайте лучшую нейросеть для каждой задачи
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {[
                  { id: 'all', label: 'Все', icon: 'Grid3x3' },
                  { id: 'text', label: 'Текст', icon: 'MessageSquare' },
                  { id: 'image', label: 'Изображения', icon: 'Image' },
                  { id: 'video', label: 'Видео', icon: 'Video' },
                  { id: 'audio', label: 'Аудио', icon: 'Headphones' }
                ].map((cat) => (
                  <Button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
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

          {/* About Us Section */}
          <section className="container mx-auto px-4 py-20">
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                О нас
              </h2>
              <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'} max-w-3xl mx-auto`}>
                Команда экспертов, объединенных одной целью — сделать искусственный интеллект доступным каждому
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto mb-16">
              {teamMembers.map((member, idx) => (
                <Card
                  key={idx}
                  className={`${
                    darkMode 
                      ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  } transition-all hover:scale-105`}
                >
                  <CardContent className="p-6 text-center">
                    <div className="text-6xl mb-4">{member.avatar}</div>
                    <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {member.name}
                    </h3>
                    <p className={`text-sm mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} font-medium`}>
                      {member.role}
                    </p>
                    <p className={`text-sm mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {member.description}
                    </p>
                    <div className="flex justify-center gap-3">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                      >
                        <Icon name="Linkedin" size={18} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}
                      >
                        <Icon name="Twitter" size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className={`py-20 ${darkMode ? 'bg-slate-900/30' : 'bg-slate-50/50'}`}>
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Почему выбирают нас
                </h2>
                <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Преимущества работы с AI Hub
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {features.map((feature, idx) => (
                  <div key={idx} className="text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4`}>
                      <Icon name={feature.icon as any} size={28} className="text-white" />
                    </div>
                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4 py-20">
            <div className={`max-w-4xl mx-auto rounded-3xl p-12 text-center ${
              darkMode 
                ? 'bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-800' 
                : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200'
            }`}>
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Начните работу с AI прямо сейчас
              </h2>
              <p className={`text-lg mb-8 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Бесплатный доступ ко всем моделям. Без регистрации.
              </p>
              <Button
                onClick={() => setShowChat(true)}
                size="lg"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg px-10 py-6"
              >
                <Icon name="Rocket" size={20} className="mr-2" />
                Начать общение
              </Button>
            </div>
          </section>

          {/* Footer */}
          <footer className={`border-t ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'} py-8`}>
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Icon name="Bot" size={18} className="text-white" />
                  </div>
                  <span className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    AI Hub
                  </span>
                </div>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  © 2024 AI Hub. Все нейросети в одном месте.
                </p>
                <div className="flex gap-4">
                  <a href="#" className={`text-sm ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                    Политика
                  </a>
                  <a href="#" className={`text-sm ${darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}>
                    Условия
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Index;