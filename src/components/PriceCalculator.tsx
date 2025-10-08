import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

const PriceCalculator = () => {
  const [services, setServices] = useState({
    consultation: false,
    development: false,
    support: false,
    training: false
  });
  const [duration, setDuration] = useState(1);

  const prices = {
    consultation: 5000,
    development: 50000,
    support: 10000,
    training: 15000
  };

  const calculateTotal = () => {
    let total = 0;
    if (services.consultation) total += prices.consultation;
    if (services.development) total += prices.development;
    if (services.support) total += prices.support * duration;
    if (services.training) total += prices.training;
    return total;
  };

  const servicesList = [
    { id: 'consultation', name: 'Консультация по ИИ', price: prices.consultation, icon: 'MessageSquare' },
    { id: 'development', name: 'Разработка ИИ-помощника', price: prices.development, icon: 'Cpu' },
    { id: 'support', name: 'Техническая поддержка (мес.)', price: prices.support, icon: 'Headphones' },
    { id: 'training', name: 'Обучение персонала', price: prices.training, icon: 'GraduationCap' }
  ];

  return (
    <section className="py-20 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Калькулятор стоимости
          </h2>
          <p className="text-gray-400 text-lg">
            Рассчитайте примерную стоимость услуг онлайн
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6">Выберите услуги</h3>
            <div className="space-y-4">
              {servicesList.map((service) => (
                <label
                  key={service.id}
                  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all ${
                    services[service.id as keyof typeof services]
                      ? 'bg-indigo-500/20 border-2 border-indigo-500'
                      : 'bg-slate-800/50 border-2 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={services[service.id as keyof typeof services]}
                    onChange={(e) => setServices({ ...services, [service.id]: e.target.checked })}
                    className="w-5 h-5 accent-indigo-500"
                  />
                  <Icon name={service.icon as any} size={24} className="text-indigo-400" />
                  <div className="flex-1">
                    <div className="text-white font-semibold">{service.name}</div>
                    <div className="text-gray-400 text-sm">{service.price.toLocaleString()} ₽</div>
                  </div>
                </label>
              ))}
            </div>

            {services.support && (
              <div className="mt-6 p-4 bg-slate-800/50 rounded-xl border-2 border-slate-700">
                <label className="block text-white font-semibold mb-3">
                  Количество месяцев поддержки: {duration}
                </label>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>1 мес</span>
                  <span>12 мес</span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-8 bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border-2 border-indigo-500/40">
            <h3 className="text-2xl font-bold text-white mb-6">Итого</h3>
            
            <div className="space-y-3 mb-6">
              {services.consultation && (
                <div className="flex justify-between text-gray-300">
                  <span>Консультация</span>
                  <span>{prices.consultation.toLocaleString()} ₽</span>
                </div>
              )}
              {services.development && (
                <div className="flex justify-between text-gray-300">
                  <span>Разработка</span>
                  <span>{prices.development.toLocaleString()} ₽</span>
                </div>
              )}
              {services.support && (
                <div className="flex justify-between text-gray-300">
                  <span>Поддержка ({duration} мес.)</span>
                  <span>{(prices.support * duration).toLocaleString()} ₽</span>
                </div>
              )}
              {services.training && (
                <div className="flex justify-between text-gray-300">
                  <span>Обучение</span>
                  <span>{prices.training.toLocaleString()} ₽</span>
                </div>
              )}
            </div>

            <div className="border-t border-indigo-500/30 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-white">Общая сумма:</span>
                <span className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {calculateTotal().toLocaleString()} ₽
                </span>
              </div>
            </div>

            <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 text-lg">
              <Icon name="Send" size={20} className="mr-2" />
              Отправить заявку
            </Button>

            <p className="text-gray-400 text-sm text-center mt-4">
              * Точная стоимость определяется после консультации
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;
