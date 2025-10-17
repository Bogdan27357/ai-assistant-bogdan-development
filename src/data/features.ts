export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
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
