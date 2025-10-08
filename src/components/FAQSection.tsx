import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      category: 'Общие вопросы',
      question: 'Что такое ИИ-помощник?',
      answer: 'ИИ-помощник - это интеллектуальная система, которая автоматически отвечает на вопросы клиентов, используя искусственный интеллект и машинное обучение.'
    },
    {
      category: 'Общие вопросы',
      question: 'Какие языки поддерживает ИИ-помощник?',
      answer: 'Наши ИИ-помощники поддерживают русский и английский языки. Возможно добавление дополнительных языков под заказ.'
    },
    {
      category: 'Стоимость',
      question: 'Сколько стоит разработка ИИ-помощника?',
      answer: 'Стоимость зависит от сложности проекта и начинается от 50 000₽ за базовую версию. Точная цена определяется после бесплатной консультации.'
    },
    {
      category: 'Стоимость',
      question: 'Есть ли абонентская плата?',
      answer: 'Да, техническая поддержка и хостинг составляют 10 000₽ в месяц. В стоимость включены: мониторинг 24/7, обновления и консультации.'
    },
    {
      category: 'Разработка',
      question: 'Сколько времени занимает разработка?',
      answer: 'Базовый ИИ-помощник разрабатывается за 2-4 недели. Сложные проекты с интеграциями могут занять до 2-3 месяцев.'
    },
    {
      category: 'Разработка',
      question: 'Можно ли интегрировать ИИ с нашей CRM?',
      answer: 'Да, мы интегрируем ИИ-помощников с популярными CRM-системами: Битрикс24, amoCRM, Salesforce и другими.'
    },
    {
      category: 'Техподдержка',
      question: 'Какая техническая поддержка предоставляется?',
      answer: 'Мы предоставляем круглосуточный мониторинг, исправление ошибок в течение 4 часов, регулярные обновления и консультации по использованию.'
    },
    {
      category: 'Техподдержка',
      question: 'Как быстро отвечает техподдержка?',
      answer: 'Среднее время ответа - 15 минут в рабочие часы (9:00-18:00 МСК). Критические проблемы решаются в течение 1-4 часов.'
    },
    {
      category: 'Безопасность',
      question: 'Как защищены данные клиентов?',
      answer: 'Мы используем шифрование SSL/TLS, храним данные на серверах в России, соблюдаем 152-ФЗ о персональных данных.'
    },
    {
      category: 'Безопасность',
      question: 'Соответствуете ли вы требованиям безопасности?',
      answer: 'Да, наши решения соответствуют требованиям 152-ФЗ, GDPR. Доступна интеграция с вашими системами безопасности.'
    }
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Частые вопросы
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Найдите ответы на популярные вопросы
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Icon
              name="Search"
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по вопросам..."
              className="w-full pl-12 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {searchQuery && (
          <div className="mb-6 text-center">
            <p className="text-gray-400">
              Найдено результатов: <span className="text-white font-bold">{filteredFAQs.length}</span>
            </p>
          </div>
        )}

        <div className="space-y-8">
          {categories.map((category) => {
            const categoryFAQs = filteredFAQs.filter((faq) => faq.category === category);
            if (categoryFAQs.length === 0) return null;

            return (
              <div key={category}>
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Icon name="Folder" size={24} className="text-indigo-400" />
                  {category}
                </h3>
                <div className="space-y-3">
                  {categoryFAQs.map((faq, idx) => {
                    const globalIndex = faqs.indexOf(faq);
                    const isOpen = openIndex === globalIndex;

                    return (
                      <Card
                        key={globalIndex}
                        className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-indigo-500/50 transition-colors overflow-hidden"
                      >
                        <button
                          onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                          className="w-full p-6 text-left flex items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <Icon
                              name="HelpCircle"
                              size={20}
                              className="text-indigo-400 mt-1 flex-shrink-0"
                            />
                            <span className="text-white font-semibold text-lg">
                              {faq.question}
                            </span>
                          </div>
                          <Icon
                            name={isOpen ? 'ChevronUp' : 'ChevronDown'}
                            size={24}
                            className="text-gray-400 flex-shrink-0"
                          />
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-6 pt-0">
                            <div className="pl-8 border-l-2 border-indigo-500/30">
                              <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {filteredFAQs.length === 0 && (
          <Card className="p-12 text-center bg-slate-900/50 border-slate-700">
            <Icon name="Search" size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">
              По запросу "{searchQuery}" ничего не найдено
            </p>
            <p className="text-gray-500 mt-2">Попробуйте изменить поисковый запрос</p>
          </Card>
        )}
      </div>
    </section>
  );
};

export default FAQSection;
