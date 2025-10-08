import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';

const Footer = () => {
  return (
    <footer className="py-16 px-6 border-t border-slate-800 bg-slate-950/50 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl">
        {/* О нас секция */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold text-white mb-8 text-center">О нас</h3>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Богдан Копаев */}
            <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-slate-800 border-purple-500/30">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-purple-500/50">
                  <img 
                    src="https://cdn.poehali.dev/files/5fc6fcd5-6e3d-43da-853e-c5244ae6d026.png" 
                    alt="Богдан Копаев"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Богдан Копаев</h4>
                <p className="text-purple-400 font-semibold mb-3">Создатель</p>
                <p className="text-gray-400 text-sm mb-4">Агент отдела дополнительного обслуживания пассажиров, Аэропорт Пулково</p>
                <a
                  href="https://t.me/Bogdan2733"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
                >
                  <Icon name="Send" size={18} />
                  @Bogdan2733
                </a>
              </div>
            </Card>

            {/* Андрей Пашков */}
            <Card className="p-6 bg-gradient-to-br from-pink-900/50 to-slate-800 border-pink-500/30">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-pink-500/50">
                  <img 
                    src="https://cdn.poehali.dev/files/b273b4f3-9e5a-4903-9a20-079f3956ace6.png" 
                    alt="Андрей Пашков"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Андрей Пашков</h4>
                <p className="text-pink-400 font-semibold mb-3">Заместитель создателя</p>
                <p className="text-gray-400 text-sm mb-4">Агент отдела дополнительного обслуживания пассажиров, Аэропорт Пулково</p>
                <a
                  href="https://t.me/suvarchikk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-pink-600 to-pink-700 text-white font-semibold hover:scale-105 transition-transform shadow-lg"
                >
                  <Icon name="Send" size={18} />
                  @suvarchikk
                </a>
              </div>
            </Card>
          </div>

          {/* История */}
          <div className="mt-8 max-w-4xl mx-auto">
            <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <p className="text-gray-300 leading-relaxed text-center">
                Работая в отделе дополнительного обслуживания пассажиров аэропорта Пулково, мы ежедневно сталкивались 
                с тысячами вопросов от путешественников. Каждый день приходилось повторять одну и ту же информацию 
                десяткам людей: расписание рейсов, правила регистрации, услуги аэропорта. 
                <br/><br/>
                Однажды, после особенно напряженной смены, мы задумались: "А что если создать интеллектуального 
                помощника, который мог бы мгновенно отвечать на все эти вопросы?" Так родилась идея Богдана — 
                ИИ-помощника, который объединяет профессиональный опыт сотрудников аэропорта с возможностями 
                искусственного интеллекта.
                <br/><br/>
                Мы вложили весь наш опыт работы с людьми, понимание их потребностей и стремление помогать в создание 
                этого проекта. Богдан — это не просто чат-бот, это наша попытка сделать мир удобнее и доступнее 
                для каждого.
              </p>
            </Card>
          </div>
        </div>

        {/* Документы и ссылки */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <Icon name="FileText" size={16} className="mr-2" />
                Условия использования
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Условия использования</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-gray-300">
                <p><strong>1. Принятие условий</strong></p>
                <p>Используя платформу "Богдан", вы соглашаетесь с настоящими условиями использования.</p>
                
                <p><strong>2. Использование сервиса</strong></p>
                <p>Сервис предоставляется "как есть" для персонального и коммерческого использования. Вы обязуетесь использовать платформу законным образом.</p>
                
                <p><strong>3. Ограничение ответственности</strong></p>
                <p>Мы не несем ответственности за точность ответов ИИ-помощника. Вся информация носит рекомендательный характер.</p>
                
                <p><strong>4. Интеллектуальная собственность</strong></p>
                <p>Все права на платформу принадлежат создателям. Запрещено копирование и распространение без разрешения.</p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <Icon name="Shield" size={16} className="mr-2" />
                Политика конфиденциальности
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Политика конфиденциальности</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-gray-300">
                <p><strong>1. Сбор данных</strong></p>
                <p>Мы собираем только необходимую информацию: историю чатов, загруженные файлы, API ключи (в зашифрованном виде).</p>
                
                <p><strong>2. Использование данных</strong></p>
                <p>Данные используются исключительно для работы ИИ-помощника и улучшения качества сервиса.</p>
                
                <p><strong>3. Защита данных</strong></p>
                <p>Мы применяем современные методы шифрования для защиты ваших данных. API ключи хранятся в зашифрованном виде.</p>
                
                <p><strong>4. Передача третьим лицам</strong></p>
                <p>Мы не передаем ваши данные третьим лицам без вашего согласия, за исключением случаев, предусмотренных законом.</p>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" className="text-gray-400 hover:text-white">
                <Icon name="Scale" size={16} className="mr-2" />
                Лицензия
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Лицензионное соглашение</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-gray-300">
                <p><strong>Лицензия MIT</strong></p>
                <p>Copyright © 2025 Богдан Копаев, Андрей Пашков</p>
                
                <p>Настоящим предоставляется бесплатное разрешение любому лицу, получившему копию данного программного обеспечения, использовать его без ограничений, включая права на использование, копирование, изменение, объединение, публикацию, распространение, сублицензирование и/или продажу копий программного обеспечения.</p>
                
                <p><strong>Условия:</strong></p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Уведомление об авторских правах должно быть включено во все копии</li>
                  <li>Программное обеспечение предоставляется "как есть"</li>
                  <li>Авторы не несут ответственности за любые претензии</li>
                </ul>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Копирайт */}
        <div className="text-center pt-8 border-t border-slate-800">
          <p className="text-gray-500 text-sm">
            © 2025 Богдан. Создано с ❤️ в Аэропорту Пулково
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;