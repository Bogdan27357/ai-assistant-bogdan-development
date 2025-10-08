import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useState, useEffect } from 'react';

interface Review {
  name: string;
  position: string;
  company: string;
  rating: number;
  text: string;
  avatar: string;
}

const ReviewsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const reviews: Review[] = [
    {
      name: 'Александр Петров',
      position: 'CEO',
      company: 'ТехноСервис',
      rating: 5,
      text: 'Отличный сервис! ИИ-помощник помог автоматизировать 80% обращений клиентов. Окупился за 2 месяца.',
      avatar: '👨‍💼'
    },
    {
      name: 'Мария Иванова',
      position: 'Директор по маркетингу',
      company: 'Инновации Плюс',
      rating: 5,
      text: 'Профессиональная команда! Разработали ИИ-помощника под наши задачи. Клиенты довольны быстрыми ответами.',
      avatar: '👩‍💼'
    },
    {
      name: 'Дмитрий Смирнов',
      position: 'IT-директор',
      company: 'Цифровые Решения',
      rating: 5,
      text: 'Внедрение прошло гладко. Техподдержка на высоте - отвечают моментально. Рекомендую!',
      avatar: '👨‍💻'
    },
    {
      name: 'Елена Волкова',
      position: 'Владелец',
      company: 'Консалтинг Про',
      rating: 5,
      text: 'Наш бизнес вышел на новый уровень благодаря ИИ-ассистенту. Клиенты получают ответы 24/7.',
      avatar: '👩‍🔬'
    },
    {
      name: 'Сергей Козлов',
      position: 'Руководитель отдела',
      company: 'МедикаПлюс',
      rating: 5,
      text: 'Разработка заняла всего 3 недели. Результат превзошел ожидания - конверсия выросла на 40%!',
      avatar: '👨‍⚕️'
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-indigo-950 to-slate-900">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Отзывы клиентов
          </h2>
          <p className="text-gray-400 text-lg">
            Более 50 компаний доверяют нам автоматизацию с ИИ
          </p>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {reviews.map((review, idx) => (
                <div key={idx} className="w-full flex-shrink-0 px-4">
                  <Card className="p-8 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-indigo-500/30 backdrop-blur-xl mx-auto max-w-3xl">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="text-6xl">{review.avatar}</div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white">{review.name}</h4>
                        <p className="text-indigo-400 font-semibold">{review.position}</p>
                        <p className="text-gray-400 text-sm">{review.company}</p>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Icon key={i} name="Star" size={20} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-300 text-lg leading-relaxed italic">
                      "{review.text}"
                    </p>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl transition-all hover:scale-110 flex items-center justify-center"
          >
            <Icon name="ChevronLeft" size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl transition-all hover:scale-110 flex items-center justify-center"
          >
            <Icon name="ChevronRight" size={24} />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {reviews.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex
                  ? 'bg-indigo-500 w-8'
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsCarousel;
