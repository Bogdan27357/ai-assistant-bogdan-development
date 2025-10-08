import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Capability {
  category: string;
  icon: string;
  gradient: string;
  items: string[];
}

const capabilities: Capability[] = [
  {
    category: 'Языковые возможности',
    icon: 'Languages',
    gradient: 'from-indigo-500 to-purple-600',
    items: [
      'Перевод на 100+ языков мира',
      'Сохранение стиля и контекста',
      'Технические и художественные тексты',
      'Озвучка на 8 языках с 16 голосами',
      'Распознавание речи в реальном времени',
      'Синхронный перевод разговоров',
      'Локализация приложений'
    ]
  },
  {
    category: 'Программирование',
    icon: 'Code',
    gradient: 'from-purple-500 to-pink-600',
    items: [
      'Написание кода на 50+ языках',
      'Отладка и рефакторинг кода',
      'Code review и оптимизация',
      'Генерация документации',
      'Архитектурные решения',
      'Написание unit-тестов',
      'DevOps и CI/CD скрипты',
      'SQL запросы и оптимизация БД'
    ]
  },
  {
    category: 'Анализ и обработка',
    icon: 'Brain',
    gradient: 'from-blue-500 to-cyan-600',
    items: [
      'Анализ изображений и PDF',
      'Обработка больших текстов (200K токенов)',
      'Извлечение данных из документов',
      'Анализ таблиц и графиков',
      'Sentiment анализ текстов',
      'OCR распознавание текста',
      'Видео-анализ и стенограммы',
      'Сравнение версий документов'
    ]
  },
  {
    category: 'Контент и креатив',
    icon: 'Palette',
    gradient: 'from-emerald-500 to-teal-600',
    items: [
      'Генерация статей и текстов',
      'Копирайтинг и слоганы',
      'Сценарии и сторителлинг',
      'Email рассылки',
      'Посты для соцсетей',
      'SEO-оптимизированные тексты',
      'Поэзия и креативное письмо',
      'Названия и описания товаров'
    ]
  },
  {
    category: 'Бизнес и аналитика',
    icon: 'Briefcase',
    gradient: 'from-orange-500 to-red-600',
    items: [
      'Бизнес-планы и стратегии',
      'Анализ конкурентов (SWOT)',
      'Финансовые отчеты',
      'Маркетинговые исследования',
      'Презентации и питчи',
      'KPI дашборды и метрики',
      'Прогнозирование продаж',
      'Анализ рынка и трендов'
    ]
  },
  {
    category: 'Обучение и наука',
    icon: 'GraduationCap',
    gradient: 'from-pink-500 to-rose-600',
    items: [
      'Объяснение сложных тем',
      'Решение математических задач',
      'Научные расчеты',
      'Подготовка конспектов',
      'Помощь с домашними заданиями',
      'Создание курсов и уроков',
      'Тесты и опросники',
      'Исследовательские работы'
    ]
  },
  {
    category: 'Работа с данными',
    icon: 'Database',
    gradient: 'from-cyan-500 to-blue-600',
    items: [
      'Очистка и подготовка данных',
      'Визуализация и графики',
      'Статистический анализ',
      'Machine Learning модели',
      'Парсинг и скрапинг',
      'ETL процессы',
      'Data mining и insights'
    ]
  },
  {
    category: 'Автоматизация',
    icon: 'Workflow',
    gradient: 'from-violet-500 to-purple-600',
    items: [
      'Создание ботов и скриптов',
      'Автоматизация рутины',
      'Web scraping',
      'Email автоответчики',
      'Планировщики задач',
      'API интеграции',
      'Workflow оптимизация'
    ]
  }
];

interface CapabilitiesSectionProps {
  show: boolean;
}

const CapabilitiesSection = ({ show }: CapabilitiesSectionProps) => {
  if (!show) return null;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-fade-in">
      {capabilities.map((cap, idx) => (
        <Card
          key={idx}
          className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-indigo-500/50 transition-all backdrop-blur-xl shadow-xl"
        >
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cap.gradient} flex items-center justify-center mb-4 shadow-lg`}>
            <Icon name={cap.icon as any} size={28} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-4">{cap.category}</h3>
          <ul className="space-y-2">
            {cap.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                <Icon name="Check" size={16} className="text-green-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
};

export default CapabilitiesSection;
