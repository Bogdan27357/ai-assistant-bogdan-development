import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface Project {
  title: string;
  description: string;
  category: string;
  image: string;
  stats: { label: string; value: string }[];
}

const PortfolioGallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');

  const projects: Project[] = [
    {
      title: 'ИИ-помощник для интернет-магазина',
      description: 'Автоматизация ответов на 90% вопросов клиентов. Интеграция с CRM и системой оплаты.',
      category: 'E-commerce',
      image: '🛒',
      stats: [
        { label: 'Конверсия', value: '+45%' },
        { label: 'Время ответа', value: '<5 сек' },
        { label: 'Обращений/день', value: '2000+' }
      ]
    },
    {
      title: 'Виртуальный консультант для клиники',
      description: 'Запись на прием, консультации по симптомам, напоминания о приеме.',
      category: 'Медицина',
      image: '⚕️',
      stats: [
        { label: 'Пациентов', value: '500+/мес' },
        { label: 'Удовлетворенность', value: '98%' },
        { label: 'Экономия времени', value: '15 ч/день' }
      ]
    },
    {
      title: 'Чат-бот для образования',
      description: 'Помощь студентам 24/7, ответы на вопросы по расписанию, курсам и заданиям.',
      category: 'Образование',
      image: '📚',
      stats: [
        { label: 'Студентов', value: '1200+' },
        { label: 'Вопросов/день', value: '800+' },
        { label: 'Точность', value: '95%' }
      ]
    },
    {
      title: 'ИИ для банковских услуг',
      description: 'Консультации по кредитам, картам, переводам. Интеграция с банковской системой.',
      category: 'Финансы',
      image: '🏦',
      stats: [
        { label: 'Клиентов', value: '5000+' },
        { label: 'Безопасность', value: '100%' },
        { label: 'Обработка', value: '24/7' }
      ]
    },
    {
      title: 'Ассистент для HR-отдела',
      description: 'Подбор кандидатов, ответы на вопросы сотрудников, автоматизация HR-процессов.',
      category: 'HR',
      image: '👥',
      stats: [
        { label: 'Резюме/месяц', value: '300+' },
        { label: 'Экономия времени', value: '70%' },
        { label: 'Качество подбора', value: '92%' }
      ]
    },
    {
      title: 'Поддержка для SaaS платформы',
      description: 'Техническая поддержка пользователей, обучение работе с сервисом, FAQ.',
      category: 'IT',
      image: '💻',
      stats: [
        { label: 'Пользователей', value: '10000+' },
        { label: 'Решено', value: '85%' },
        { label: 'NPS', value: '9.2/10' }
      ]
    }
  ];

  const categories = ['Все', ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects =
    selectedCategory === 'Все'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Наши проекты
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Более 50 успешных внедрений ИИ-помощников
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-slate-800 text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, idx) => (
            <Card
              key={idx}
              className="group bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden hover:scale-105"
            >
              <div className="p-6">
                <div className="text-6xl mb-4 text-center">{project.image}</div>
                
                <div className="mb-2">
                  <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-semibold">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>

                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700">
                  {project.stats.map((stat, statIdx) => (
                    <div key={statIdx} className="text-center">
                      <div className="text-indigo-400 font-bold text-lg">{stat.value}</div>
                      <div className="text-gray-500 text-xs mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <Card className="p-12 text-center bg-slate-900/50 border-slate-700">
            <Icon name="Folder" size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              Проектов в категории "{selectedCategory}" пока нет
            </p>
          </Card>
        )}
      </div>
    </section>
  );
};

export default PortfolioGallery;
