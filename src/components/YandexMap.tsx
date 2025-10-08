import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const YandexMap = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-slate-900 to-indigo-950">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Как нас найти
          </h2>
          <p className="text-gray-400 text-lg">
            Аэропорт Пулково, Санкт-Петербург
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="MapPin" size={28} className="text-indigo-400" />
              Контакты
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="Building" size={24} className="text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Адрес</h4>
                  <p className="text-gray-400">
                    Аэропорт Пулково<br />
                    Санкт-Петербург, Россия
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="Phone" size={24} className="text-green-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Телефон</h4>
                  <a href="tel:+79218572049" className="text-gray-400 hover:text-white transition-colors">
                    +7 (921) 857-20-49
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="Send" size={24} className="text-purple-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Мессенджеры</h4>
                  <div className="flex gap-3 mt-2">
                    <a
                      href="https://t.me/Bogdan2733"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm transition-colors"
                    >
                      Telegram
                    </a>
                    <a
                      href="https://wa.me/79218572049"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm transition-colors"
                    >
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon name="Clock" size={24} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">Режим работы</h4>
                  <p className="text-gray-400">
                    Онлайн консультации: 24/7<br />
                    Личные встречи: по договоренности
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-0 bg-slate-900 border-slate-700 overflow-hidden">
            <div className="relative w-full h-[500px]">
              <iframe
                src="https://yandex.ru/map-widget/v1/?ll=30.262503,59.800279&z=15&l=map&pt=30.262503,59.800279,pm2rdm"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                className="rounded-lg"
              />
            </div>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Работаем со всей Россией онлайн. Личные встречи в Санкт-Петербурге и Москве.
          </p>
        </div>
      </div>
    </section>
  );
};

export default YandexMap;
