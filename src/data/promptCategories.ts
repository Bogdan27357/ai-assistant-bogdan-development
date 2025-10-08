export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  prompt: string;
  icon: string;
  category: string;
  variables?: string[];
}

export interface PromptCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  prompts: PromptTemplate[];
}

export const promptCategories: PromptCategory[] = [
  {
    id: 'business',
    name: 'Бизнес',
    icon: 'Briefcase',
    color: 'from-blue-500 to-cyan-500',
    prompts: [
      {
        id: 'business-plan',
        title: 'Бизнес-план',
        description: 'Создать структурированный бизнес-план',
        prompt: 'Создай подробный бизнес-план для стартапа в сфере {отрасль}. Включи: анализ рынка, целевую аудиторию, конкурентов, маркетинговую стратегию и финансовые прогнозы на 3 года.',
        icon: 'FileText',
        category: 'business',
        variables: ['отрасль']
      },
      {
        id: 'email-pitch',
        title: 'Коммерческое письмо',
        description: 'Написать убедительное письмо клиенту',
        prompt: 'Напиши профессиональное коммерческое письмо для {тип_клиента} с предложением {продукт/услуга}. Сделай акцент на выгодах и призови к действию.',
        icon: 'Mail',
        category: 'business',
        variables: ['тип_клиента', 'продукт/услуга']
      },
      {
        id: 'swot-analysis',
        title: 'SWOT-анализ',
        description: 'Провести SWOT-анализ компании',
        prompt: 'Проведи SWOT-анализ для компании в сфере {отрасль}. Опиши сильные и слабые стороны, возможности и угрозы.',
        icon: 'TrendingUp',
        category: 'business',
        variables: ['отрасль']
      },
      {
        id: 'presentation',
        title: 'Структура презентации',
        description: 'Создать план презентации',
        prompt: 'Создай структуру презентации на тему "{тема}" для {аудитория}. Предложи 10-12 слайдов с ключевыми тезисами.',
        icon: 'Monitor',
        category: 'business',
        variables: ['тема', 'аудитория']
      }
    ]
  },
  {
    id: 'code',
    name: 'Программирование',
    icon: 'Code',
    color: 'from-purple-500 to-pink-500',
    prompts: [
      {
        id: 'debug-code',
        title: 'Отладка кода',
        description: 'Найти и исправить ошибку в коде',
        prompt: 'Вот мой код на {язык}:\n\n```\n{код}\n```\n\nНайди ошибку, объясни причину и предложи исправленный вариант.',
        icon: 'Bug',
        category: 'code',
        variables: ['язык', 'код']
      },
      {
        id: 'explain-code',
        title: 'Объяснить код',
        description: 'Разобрать код построчно',
        prompt: 'Объясни подробно, что делает этот код на {язык}:\n\n```\n{код}\n```\n\nРазбери построчно для новичка.',
        icon: 'BookOpen',
        category: 'code',
        variables: ['язык', 'код']
      },
      {
        id: 'write-function',
        title: 'Написать функцию',
        description: 'Создать функцию по описанию',
        prompt: 'Напиши функцию на {язык}, которая {описание_задачи}. Добавь комментарии и примеры использования.',
        icon: 'FileCode',
        category: 'code',
        variables: ['язык', 'описание_задачи']
      },
      {
        id: 'optimize-code',
        title: 'Оптимизировать код',
        description: 'Улучшить производительность',
        prompt: 'Оптимизируй этот код на {язык} для лучшей производительности:\n\n```\n{код}\n```\n\nОбъясни изменения.',
        icon: 'Zap',
        category: 'code',
        variables: ['язык', 'код']
      }
    ]
  },
  {
    id: 'content',
    name: 'Контент',
    icon: 'PenTool',
    color: 'from-green-500 to-emerald-500',
    prompts: [
      {
        id: 'blog-post',
        title: 'Статья для блога',
        description: 'Написать SEO-статью',
        prompt: 'Напиши статью на тему "{тема}" объемом {слов_количество} слов. Включи: заголовок, введение, 3-5 подзаголовков с абзацами, заключение. Оптимизируй под SEO.',
        icon: 'FileText',
        category: 'content',
        variables: ['тема', 'слов_количество']
      },
      {
        id: 'social-media',
        title: 'Пост для соцсетей',
        description: 'Создать пост для Instagram/VK',
        prompt: 'Создай пост для {платформа} на тему "{тема}". Добавь эмодзи, хештеги и призыв к действию. Длина: {символов}.',
        icon: 'Share2',
        category: 'content',
        variables: ['платформа', 'тема', 'символов']
      },
      {
        id: 'email-newsletter',
        title: 'Email-рассылка',
        description: 'Написать письмо для рассылки',
        prompt: 'Напиши email для рассылки подписчикам {ниша} на тему "{тема}". Сделай увлекательно, добавь CTA.',
        icon: 'Mail',
        category: 'content',
        variables: ['ниша', 'тема']
      },
      {
        id: 'product-description',
        title: 'Описание товара',
        description: 'Написать продающее описание',
        prompt: 'Напиши продающее описание для товара "{название_товара}" в категории {категория}. Подчеркни преимущества и характеристики.',
        icon: 'ShoppingCart',
        category: 'content',
        variables: ['название_товара', 'категория']
      }
    ]
  },
  {
    id: 'learning',
    name: 'Обучение',
    icon: 'GraduationCap',
    color: 'from-orange-500 to-red-500',
    prompts: [
      {
        id: 'explain-topic',
        title: 'Объяснить тему',
        description: 'Простое объяснение сложной темы',
        prompt: 'Объясни тему "{тема}" простым языком, как для {уровень} (новичок/студент/специалист). Используй аналогии и примеры.',
        icon: 'Lightbulb',
        category: 'learning',
        variables: ['тема', 'уровень']
      },
      {
        id: 'create-quiz',
        title: 'Создать тест',
        description: 'Тест для проверки знаний',
        prompt: 'Создай тест на {вопросов_количество} вопросов по теме "{тема}". Каждый вопрос с 4 вариантами ответа и пояснением.',
        icon: 'CheckSquare',
        category: 'learning',
        variables: ['вопросов_количество', 'тема']
      },
      {
        id: 'study-plan',
        title: 'План обучения',
        description: 'Составить учебный план',
        prompt: 'Составь план обучения по теме "{тема}" на {недель} недель. Разбей на модули с конкретными задачами.',
        icon: 'Calendar',
        category: 'learning',
        variables: ['тема', 'недель']
      },
      {
        id: 'cheat-sheet',
        title: 'Шпаргалка',
        description: 'Краткая справка по теме',
        prompt: 'Создай краткую шпаргалку по теме "{тема}". Основные понятия, формулы, примеры — все на одной странице.',
        icon: 'FileText',
        category: 'learning',
        variables: ['тема']
      }
    ]
  },
  {
    id: 'creative',
    name: 'Креатив',
    icon: 'Sparkles',
    color: 'from-violet-500 to-purple-500',
    prompts: [
      {
        id: 'brainstorm-ideas',
        title: 'Идеи для проекта',
        description: 'Сгенерировать креативные идеи',
        prompt: 'Предложи 10 креативных идей для {тип_проекта} в сфере {сфера}. Опиши каждую в 1-2 предложениях.',
        icon: 'Lightbulb',
        category: 'creative',
        variables: ['тип_проекта', 'сфера']
      },
      {
        id: 'storytelling',
        title: 'Сторителлинг',
        description: 'Создать захватывающую историю',
        prompt: 'Напиши короткую историю (300 слов) на тему "{тема}" в стиле {жанр}. Создай яркий сюжет с неожиданным финалом.',
        icon: 'Book',
        category: 'creative',
        variables: ['тема', 'жанр']
      },
      {
        id: 'slogan',
        title: 'Слоган / Название',
        description: 'Придумать запоминающийся слоган',
        prompt: 'Предложи 15 вариантов слогана для {тип_бизнеса} "{название}". Сделай их краткими, запоминающимися и уникальными.',
        icon: 'MessageCircle',
        category: 'creative',
        variables: ['тип_бизнеса', 'название']
      },
      {
        id: 'video-script',
        title: 'Сценарий видео',
        description: 'Написать сценарий для YouTube',
        prompt: 'Напиши сценарий для видео на YouTube длительностью {минут} минут на тему "{тема}". Включи: хук, основную часть, призыв к действию.',
        icon: 'Video',
        category: 'creative',
        variables: ['минут', 'тема']
      }
    ]
  }
];

export const getAllPrompts = (): PromptTemplate[] => {
  return promptCategories.flatMap(category => category.prompts);
};

export const getPromptById = (id: string): PromptTemplate | undefined => {
  return getAllPrompts().find(prompt => prompt.id === id);
};

export const getPromptsByCategory = (categoryId: string): PromptTemplate[] => {
  const category = promptCategories.find(cat => cat.id === categoryId);
  return category?.prompts || [];
};
