import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

interface Quote {
  text: string;
  author: string;
  category: string;
}

const QuoteWidget = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);

  const quotes: Quote[] = [
    { text: 'Единственный способ сделать великую работу — любить то, что делаешь.', author: 'Стив Джобс', category: 'мотивация' },
    { text: 'Не важно, как медленно ты идёшь, главное — не останавливаться.', author: 'Конфуций', category: 'мудрость' },
    { text: 'Будущее принадлежит тем, кто верит в красоту своих мечтаний.', author: 'Элеонор Рузвельт', category: 'вдохновение' },
    { text: 'Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма.', author: 'Уинстон Черчилль', category: 'успех' },
    { text: 'Лучшее время посадить дерево было 20 лет назад. Второе лучшее время — сейчас.', author: 'Китайская пословица', category: 'действие' },
    { text: 'Не ждите. Время никогда не будет идеальным.', author: 'Наполеон Хилл', category: 'начинания' },
    { text: 'Образование — самое мощное оружие, которым можно изменить мир.', author: 'Нельсон Мандела', category: 'знание' },
    { text: 'Стремитесь не к успеху, а к ценностям, которые он дает.', author: 'Альберт Эйнштейн', category: 'ценности' },
    { text: 'Жизнь — это то, что происходит с вами, пока вы строите другие планы.', author: 'Джон Леннон', category: 'жизнь' },
    { text: 'Путь в тысячу миль начинается с первого шага.', author: 'Лао-цзы', category: 'начало' },
    { text: 'Верьте, что можете, и вы уже на полпути к цели.', author: 'Теодор Рузвельт', category: 'вера' },
    { text: 'Не бойтесь совершать ошибки. Бойтесь не учиться на них.', author: 'Генри Форд', category: 'обучение' },
    { text: 'Единственное ограничение наших завтрашних достижений — наши сегодняшние сомнения.', author: 'Франклин Рузвельт', category: 'сомнения' },
    { text: 'Успех обычно приходит к тем, кто слишком занят, чтобы его искать.', author: 'Генри Дэвид Торо', category: 'работа' },
    { text: 'Не считайте дни, делайте дни значимыми.', author: 'Мухаммед Али', category: 'время' },
    { text: 'Воображение важнее знания. Знание ограничено, воображение охватывает весь мир.', author: 'Альберт Эйнштейн', category: 'творчество' },
    { text: 'Если вы хотите построить корабль, не надо созывать людей, чтобы всё спланировать. Заставьте их мечтать о море.', author: 'Антуан де Сент-Экзюпери', category: 'лидерство' },
    { text: 'Счастье — это не цель. Это побочный продукт жизни, наполненной смыслом.', author: 'Элеонор Рузвельт', category: 'счастье' },
    { text: 'Делай что можешь, с тем что имеешь, там где ты есть.', author: 'Теодор Рузвельт', category: 'действие' },
    { text: 'Тот, кто никогда не ошибался, никогда не пробовал ничего нового.', author: 'Альберт Эйнштейн', category: 'смелость' },
    { text: 'Качество — это не случайность, это всегда результат высокого намерения.', author: 'Джон Рёскин', category: 'качество' },
    { text: 'Мы становимся тем, о чём постоянно думаем.', author: 'Эрл Найтингейл', category: 'мышление' },
    { text: 'Не говорите о своих планах — покажите результаты.', author: 'Неизвестный автор', category: 'дела' },
    { text: 'Перемены — это закон жизни. Те, кто смотрит только в прошлое или настоящее, обязательно упустят будущее.', author: 'Джон Кеннеди', category: 'перемены' },
    { text: 'Если ты можешь мечтать об этом, ты можешь это сделать.', author: 'Уолт Дисней', category: 'мечты' },
    { text: 'Нет ничего невозможного, само слово говорит "Я возможен".', author: 'Одри Хепбёрн', category: 'возможности' },
    { text: 'Не переживайте о неудачах. Переживайте о шансах, которые вы упускаете, не пытаясь.', author: 'Джек Кэнфилд', category: 'попытки' },
    { text: 'Всё, что вы можете вообразить — реально.', author: 'Пабло Пикассо', category: 'творчество' },
    { text: 'Невозможное — это то, что никто не делал до тех пор, пока кто-то не сделал это.', author: 'Альберт Эйнштейн', category: 'достижения' },
    { text: 'Иногда нужно сделать шаг назад, чтобы увидеть полную картину.', author: 'Неизвестный автор', category: 'перспектива' },
    { text: 'Лучший способ предсказать будущее — создать его.', author: 'Питер Друкер', category: 'будущее' },
    { text: 'Не бойтесь отказаться от хорошего ради великолепного.', author: 'Джон Рокфеллер', category: 'амбиции' },
    { text: 'Трудности часто подготавливают обычных людей к необычной судьбе.', author: 'К.С. Льюис', category: 'трудности' },
    { text: 'Действуйте так, будто то, что вы делаете, имеет значение. Оно имеет значение.', author: 'Уильям Джеймс', category: 'значимость' },
    { text: 'Падать — не значит проигрывать. Проигрывать — значит не вставать.', author: 'Неизвестный автор', category: 'упорство' },
    { text: 'Чем больше вы отдаёте, тем больше получаете обратно.', author: 'Брайан Трейси', category: 'щедрость' },
    { text: 'Ваше время ограничено, не тратьте его на чужую жизнь.', author: 'Стив Джобс', category: 'время' },
    { text: 'Сомнение убивает больше мечтаний, чем неудача когда-либо убьёт.', author: 'Сюзи Кассем', category: 'сомнения' },
    { text: 'Мастерство — это не конечная цель, а путь, по которому идёшь всю жизнь.', author: 'Миямото Мусаси', category: 'мастерство' },
    { text: 'Победитель — это просто мечтатель, который никогда не сдавался.', author: 'Нельсон Мандела', category: 'победа' },
    { text: 'Не важно, насколько медленно вы движетесь, если только вы не останавливаетесь.', author: 'Конфуций', category: 'движение' },
    { text: 'Если вы думаете, что можете, или думаете, что не можете — в любом случае вы правы.', author: 'Генри Форд', category: 'уверенность' },
    { text: 'Великие дела никогда не совершаются одним человеком. Их совершает команда.', author: 'Стив Джобс', category: 'команда' },
    { text: 'Инновация отличает лидера от последователя.', author: 'Стив Джобс', category: 'инновации' },
    { text: 'Единственный способ избежать критики — ничего не делать, ничего не говорить и быть никем.', author: 'Аристотель', category: 'критика' },
    { text: 'Цель без плана — просто желание.', author: 'Антуан де Сент-Экзюпери', category: 'планирование' },
    { text: 'Будьте переменой, которую хотите видеть в мире.', author: 'Махатма Ганди', category: 'изменения' },
    { text: 'Разум — не сосуд, который нужно наполнить, а огонь, который нужно зажечь.', author: 'Плутарх', category: 'обучение' },
    { text: 'Неважно, сколько раз ты упал. Важно, сколько раз ты поднялся.', author: 'Винс Ломбарди', category: 'стойкость' },
    { text: 'Если не можешь объяснить просто — значит, ты сам не понял до конца.', author: 'Альберт Эйнштейн', category: 'понимание' }
  ];

  const getDailyQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    return quotes[dayOfYear % quotes.length];
  };

  const getRandomQuote = () => {
    setLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    setQuote(getDailyQuote());
  }, []);

  const categoryIcons: Record<string, string> = {
    'мотивация': 'Flame',
    'мудрость': 'BookOpen',
    'вдохновение': 'Sparkles',
    'успех': 'TrendingUp',
    'действие': 'Zap',
    'начинания': 'Rocket',
    'знание': 'GraduationCap',
    'ценности': 'Heart',
    'жизнь': 'Sun',
    'начало': 'Flag',
    'вера': 'Star',
    'обучение': 'Brain',
    'сомнения': 'Shield',
    'работа': 'Briefcase',
    'время': 'Clock',
    'творчество': 'Palette',
    'лидерство': 'Crown',
    'счастье': 'Smile',
    'смелость': 'Award',
    'качество': 'CheckCircle',
    'мышление': 'Lightbulb',
    'дела': 'Target',
    'перемены': 'RefreshCw',
    'мечты': 'Cloud',
    'возможности': 'Unlock',
    'попытки': 'Play',
    'достижения': 'Trophy',
    'перспектива': 'Eye',
    'будущее': 'Compass',
    'амбиции': 'Mountain',
    'трудности': 'AlertTriangle',
    'значимость': 'Star',
    'упорство': 'Anchor',
    'щедрость': 'Gift',
    'мастерство': 'Gem',
    'победа': 'Medal',
    'движение': 'TrendingUp',
    'уверенность': 'ThumbsUp',
    'команда': 'Users',
    'инновации': 'Rocket',
    'критика': 'MessageSquare',
    'планирование': 'Map',
    'изменения': 'Repeat',
    'стойкость': 'Shield',
    'понимание': 'Key'
  };

  const categoryColors: Record<string, string> = {
    'мотивация': 'from-orange-500 to-red-600',
    'мудрость': 'from-blue-500 to-indigo-600',
    'вдохновение': 'from-purple-500 to-pink-600',
    'успех': 'from-green-500 to-emerald-600',
    'действие': 'from-yellow-500 to-orange-600',
    'начинания': 'from-indigo-500 to-purple-600',
    'знание': 'from-cyan-500 to-blue-600',
    'ценности': 'from-pink-500 to-red-600',
    'жизнь': 'from-amber-500 to-yellow-600',
    'начало': 'from-teal-500 to-cyan-600',
    'вера': 'from-violet-500 to-purple-600',
    'обучение': 'from-indigo-500 to-blue-600',
    'сомнения': 'from-slate-500 to-gray-600',
    'работа': 'from-blue-500 to-cyan-600',
    'время': 'from-purple-500 to-indigo-600',
    'творчество': 'from-pink-500 to-purple-600',
    'лидерство': 'from-yellow-500 to-amber-600',
    'счастье': 'from-green-500 to-teal-600',
    'смелость': 'from-red-500 to-orange-600',
    'качество': 'from-emerald-500 to-green-600',
    'мышление': 'from-indigo-500 to-violet-600',
    'дела': 'from-blue-500 to-indigo-600',
    'перемены': 'from-cyan-500 to-blue-600',
    'мечты': 'from-purple-500 to-indigo-600',
    'возможности': 'from-green-500 to-cyan-600',
    'попытки': 'from-orange-500 to-red-600',
    'достижения': 'from-yellow-500 to-orange-600',
    'перспектива': 'from-teal-500 to-blue-600',
    'будущее': 'from-indigo-500 to-purple-600',
    'амбиции': 'from-violet-500 to-purple-600',
    'трудности': 'from-slate-500 to-gray-600',
    'значимость': 'from-amber-500 to-yellow-600',
    'упорство': 'from-blue-500 to-cyan-600',
    'щедрость': 'from-pink-500 to-rose-600',
    'мастерство': 'from-purple-500 to-pink-600',
    'победа': 'from-green-500 to-emerald-600',
    'движение': 'from-cyan-500 to-teal-600',
    'уверенность': 'from-orange-500 to-amber-600',
    'команда': 'from-blue-500 to-indigo-600',
    'инновации': 'from-indigo-500 to-blue-600',
    'критика': 'from-red-500 to-pink-600',
    'планирование': 'from-teal-500 to-cyan-600',
    'изменения': 'from-green-500 to-teal-600',
    'стойкость': 'from-slate-500 to-zinc-600',
    'понимание': 'from-yellow-500 to-amber-600'
  };

  return (
    <Card className="bg-gradient-to-br from-purple-900/60 via-indigo-900/50 to-blue-900/40 border-2 border-purple-500/40 p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 animate-gradient-shift bg-[length:200%_200%]" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-black text-white flex items-center gap-2">
            <Icon name="Quote" size={28} className="text-purple-400" />
            Цитата дня
          </h3>
          <Button
            onClick={getRandomQuote}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="RefreshCw" size={16} />
            )}
          </Button>
        </div>

        {quote && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Icon name="Quote" size={40} className="text-purple-400/40 flex-shrink-0 mt-1" />
              <p className="text-2xl text-white leading-relaxed font-light italic">
                {quote.text}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-purple-400/20">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryColors[quote.category] || 'from-purple-500 to-indigo-600'} flex items-center justify-center`}>
                  <Icon name={(categoryIcons[quote.category] || 'Sparkles') as any} size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-400 capitalize">{quote.category}</p>
                  <p className="text-lg font-bold text-purple-300">— {quote.author}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default QuoteWidget;