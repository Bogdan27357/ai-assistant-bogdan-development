import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface Message {
  type: 'user' | 'bot';
  text: string;
}

interface SimpleConsultantProps {
  isOpen?: boolean;
}

const SimpleConsultant = ({ isOpen: initialOpen = false }: SimpleConsultantProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<Message[]>([
    { type: 'bot', text: 'Здравствуйте! Выберите вопрос из списка:' }
  ]);

  const templates = [
    {
      question: 'Какие услуги вы предоставляете?',
      answer: 'Мы предоставляем: консультации по ИИ, разработку ИИ-помощников, техническую поддержку и обучение персонала.'
    },
    {
      question: 'Сколько стоят ваши услуги?',
      answer: 'Консультация - от 5000₽, разработка ИИ-помощника - от 50000₽, поддержка - 10000₽/мес, обучение - 15000₽. Точная стоимость определяется после консультации.'
    },
    {
      question: 'Как долго длится разработка?',
      answer: 'Разработка базового ИИ-помощника занимает от 2 до 4 недель. Сложные проекты могут занять до 2-3 месяцев.'
    },
    {
      question: 'Работаете ли вы с регионами?',
      answer: 'Да, мы работаем по всей России. Консультации проводим онлайн, также возможны выездные встречи в Санкт-Петербурге и Москве.'
    },
    {
      question: 'Какая техподдержка предоставляется?',
      answer: 'Техподдержка включает: мониторинг работы системы 24/7, исправление ошибок, обновления и консультации по использованию.'
    },
    {
      question: 'Как забронировать консультацию?',
      answer: 'Заполните форму бронирования на сайте или напишите нам в Telegram, WhatsApp или ВКонтакте. Мы свяжемся с вами в течение часа!'
    }
  ];

  const handleTemplateClick = (template: typeof templates[0]) => {
    setMessages([
      ...messages,
      { type: 'user', text: template.question },
      { type: 'bot', text: template.answer }
    ]);
  };

  const handleReset = () => {
    setMessages([{ type: 'bot', text: 'Здравствуйте! Выберите вопрос из списка:' }]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-2xl hover:scale-110 transition-all duration-300 flex items-center justify-center hover:shadow-green-500/50"
      >
        <Icon name="MessageCircle" size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-32 right-8 z-40 w-96">
      <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-2xl">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="MessageCircle" size={20} className="text-white" />
            <h3 className="text-white font-bold">Онлайн-консультант</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.type === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700 text-gray-200'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {messages.length === 1 && (
            <div className="space-y-2 mt-4">
              {templates.map((template, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTemplateClick(template)}
                  className="w-full text-left px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors text-sm border border-slate-600 hover:border-green-500"
                >
                  {template.question}
                </button>
              ))}
            </div>
          )}

          {messages.length > 1 && (
            <div className="mt-4 flex gap-2">
              <Button
                onClick={handleReset}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white"
              >
                <Icon name="RotateCcw" size={16} className="mr-2" />
                Начать заново
              </Button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-gray-400 text-center">
            Выберите вопрос из списка для получения ответа
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SimpleConsultant;