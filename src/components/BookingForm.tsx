import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { useState } from 'react';
import { toast } from 'sonner';

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: '',
    date: '',
    time: '',
    message: ''
  });

  const services = [
    'Консультация по ИИ',
    'Разработка ИИ-помощника',
    'Техническая поддержка',
    'Обучение персонала'
  ];

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
    setFormData({
      name: '',
      phone: '',
      email: '',
      service: '',
      date: '',
      time: '',
      message: ''
    });
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-900 to-indigo-950">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Бронирование встречи
          </h2>
          <p className="text-gray-400 text-lg">
            Выберите удобное время для консультации
          </p>
        </div>

        <Card className="p-8 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  <Icon name="User" size={18} className="inline mr-2" />
                  Ваше имя *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Иван Иванов"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  <Icon name="Phone" size={18} className="inline mr-2" />
                  Телефон *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="+7 (999) 123-45-67"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                <Icon name="Mail" size={18} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="example@mail.ru"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                <Icon name="Briefcase" size={18} className="inline mr-2" />
                Услуга *
              </label>
              <select
                required
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value="">Выберите услугу</option>
                {services.map((service) => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  <Icon name="Calendar" size={18} className="inline mr-2" />
                  Дата *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  <Icon name="Clock" size={18} className="inline mr-2" />
                  Время *
                </label>
                <select
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="">Выберите время</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                <Icon name="MessageSquare" size={18} className="inline mr-2" />
                Дополнительная информация
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                placeholder="Расскажите подробнее о вашем проекте..."
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-6 text-lg"
            >
              <Icon name="Send" size={20} className="mr-2" />
              Отправить заявку
            </Button>

            <p className="text-gray-400 text-sm text-center">
              * Обязательные поля для заполнения
            </p>
          </form>
        </Card>
      </div>
    </section>
  );
};

export default BookingForm;
