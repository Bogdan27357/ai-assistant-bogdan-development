export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  features: string[];
}

export const aiModels: AIModel[] = [
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
    id: 'pika',
    name: 'Pika',
    provider: 'Pika Labs',
    description: 'Создание и редактирование видео из текста и изображений',
    icon: 'Clapperboard',
    color: 'from-rose-500 to-pink-600',
    category: 'video',
    features: ['Text-to-Video', 'Image-to-Video', '3D анимация']
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    provider: 'Synthesia',
    description: 'Создание видео с AI аватарами',
    icon: 'Users',
    color: 'from-purple-500 to-violet-600',
    category: 'video',
    features: ['AI аватары', '120+ языков', 'Презентации']
  },
  {
    id: 'heygen',
    name: 'HeyGen',
    provider: 'HeyGen',
    description: 'Видео с говорящими аватарами',
    icon: 'UserCircle',
    color: 'from-blue-500 to-indigo-600',
    category: 'video',
    features: ['Клонирование лица', 'Перевод видео', '100+ аватаров']
  },
  {
    id: 'descript',
    name: 'Descript',
    provider: 'Descript',
    description: 'Редактирование видео через транскрибацию',
    icon: 'FileVideo',
    color: 'from-teal-500 to-cyan-600',
    category: 'video',
    features: ['Удаление пауз', 'Overdub', 'Удаление слов-паразитов']
  },
  {
    id: 'fliki',
    name: 'Fliki',
    provider: 'Fliki',
    description: 'Создание видео из текста с озвучкой',
    icon: 'PlayCircle',
    color: 'from-green-500 to-emerald-600',
    category: 'video',
    features: ['Text-to-Video', 'AI озвучка', '75+ языков']
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
    id: 'suno',
    name: 'Suno AI',
    provider: 'Suno',
    description: 'Создание полноценных песен с вокалом',
    icon: 'Radio',
    color: 'from-amber-500 to-orange-600',
    category: 'audio',
    features: ['Генерация вокала', 'Полные песни', 'Тексты и мелодия']
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