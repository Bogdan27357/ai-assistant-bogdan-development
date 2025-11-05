export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: 'Bot',
    title: 'YandexGPT',
    description: 'Мощная нейросеть от Яндекса для генерации текстов и анализа данных'
  },
  {
    icon: 'Sparkles',
    title: 'ГигаЧат',
    description: 'Российская нейросеть от Сбера с поддержкой русского языка'
  },
  {
    icon: 'Shield',
    title: 'Безопасность данных',
    description: 'Все данные обрабатываются на территории РФ с соблюдением законодательства'
  },
  {
    icon: 'Zap',
    title: 'Быстрая интеграция',
    description: 'Простое API для подключения к вашим проектам и сервисам'
  }
];