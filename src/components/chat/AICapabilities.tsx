import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const AICapabilities = () => {
  const capabilities = [
    {
      category: '💬 Текст и диалог',
      items: [
        { icon: 'MessageCircle', text: 'Умные беседы на любые темы' },
        { icon: 'Languages', text: 'Переводы на 100+ языков' },
        { icon: 'FileText', text: 'Анализ и обработка текстов' },
        { icon: 'BookOpen', text: 'Обучение и объяснения' },
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: '💻 Код и разработка',
      items: [
        { icon: 'Code', text: 'Написание кода на любых языках' },
        { icon: 'Bug', text: 'Отладка и исправление ошибок' },
        { icon: 'Terminal', text: 'Помощь с командами и скриптами' },
        { icon: 'Database', text: 'SQL запросы и работа с БД' },
      ],
      color: 'from-violet-500 to-purple-500'
    },
    {
      category: '🎨 Креатив и контент',
      items: [
        { icon: 'Feather', text: 'Написание статей и текстов' },
        { icon: 'BookText', text: 'Создание рассказов и историй' },
        { icon: 'Lightbulb', text: 'Генерация идей' },
        { icon: 'PenTool', text: 'Творческие тексты' },
      ],
      color: 'from-pink-500 to-rose-500'
    },
    {
      category: '👁️ Анализ и визуализация',
      items: [
        { icon: 'Image', text: 'Анализ изображений и фото' },
        { icon: 'ScanEye', text: 'Распознавание объектов' },
        { icon: 'BarChart', text: 'Обработка данных' },
        { icon: 'FileSearch', text: 'Анализ документов' },
      ],
      color: 'from-cyan-400 to-blue-500'
    },
    {
      category: '🧠 Специализации',
      items: [
        { icon: 'Calculator', text: 'Математика и расчёты' },
        { icon: 'Scale', text: 'Юридические вопросы' },
        { icon: 'Heart', text: 'Медицина и здоровье' },
        { icon: 'TrendingUp', text: 'Бизнес и финансы' },
      ],
      color: 'from-amber-500 to-orange-500'
    },
    {
      category: '🛠️ Инструменты',
      items: [
        { icon: 'Paperclip', text: 'Загрузка файлов и фото' },
        { icon: 'Image', text: 'Предпросмотр изображений' },
        { icon: 'Download', text: 'Экспорт истории чата' },
        { icon: 'Copy', text: 'Копирование ответов' },
      ],
      color: 'from-green-500 to-emerald-500'
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4 md:mb-6">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Icon name="Sparkles" size={20} className="text-white md:w-6 md:h-6" />
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold text-white">Возможности ИИ</h3>
          <p className="text-xs md:text-sm text-gray-400">Всё что может наш искусственный интеллект</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {capabilities.map((cap, idx) => (
          <div key={idx} className="group p-4 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-indigo-500/50 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cap.color} flex items-center justify-center`}>
                <span className="text-sm">{cap.category.split(' ')[0]}</span>
              </div>
              <h4 className="text-sm font-bold text-white">{cap.category.split(' ').slice(1).join(' ')}</h4>
            </div>
            <ul className="space-y-2">
              {cap.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                  <Icon name={item.icon as any} size={14} className="text-indigo-400 shrink-0 mt-0.5" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-4 md:mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-indigo-400 shrink-0" />
          <div className="text-xs md:text-sm text-gray-300">
            <p className="font-semibold text-white mb-1">💡 Умный режим работает автоматически</p>
            <p>Просто задайте вопрос — ИИ сам выберет нужную специализацию и модель для лучшего ответа. Никаких настроек не требуется!</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AICapabilities;