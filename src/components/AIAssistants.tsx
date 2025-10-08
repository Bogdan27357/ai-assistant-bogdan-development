import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Assistant {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  color: string;
  capabilities: string[];
  examples: string[];
}

const AIAssistants = () => {
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [task, setTask] = useState('');
  const [result, setResult] = useState('');
  const [generating, setGenerating] = useState(false);

  const assistants: Assistant[] = [
    {
      id: 'copywriter',
      name: 'Копирайтер',
      role: 'Эксперт по продающим текстам',
      description: 'Создаю цепляющие тексты, которые продают',
      icon: 'PenTool',
      color: 'from-orange-500 to-red-600',
      capabilities: [
        'Продающие тексты для лендингов',
        'Рекламные объявления',
        'Email-рассылки',
        'Слоганы и заголовки',
        'Описания товаров',
        'Посты для соцсетей'
      ],
      examples: [
        'Напиши продающий текст для онлайн-курса по маркетингу',
        'Создай 5 вариантов слогана для кофейни',
        'Напиши описание товара для интернет-магазина'
      ]
    },
    {
      id: 'smm',
      name: 'SMM-менеджер',
      role: 'Специалист по соцсетям',
      description: 'Планирую контент и веду соцсети',
      icon: 'Share2',
      color: 'from-pink-500 to-rose-600',
      capabilities: [
        'Контент-планы на месяц',
        'Тексты для постов',
        'Идеи для Reels и Stories',
        'Хештеги и геолокации',
        'Конкурсы и розыгрыши',
        'Анализ конкурентов'
      ],
      examples: [
        'Создай контент-план на месяц для бренда одежды',
        'Напиши 10 постов для Instagram косметики',
        'Придумай механику конкурса для продвижения'
      ]
    },
    {
      id: 'programmer',
      name: 'Программист',
      role: 'Senior разработчик',
      description: 'Пишу чистый и эффективный код',
      icon: 'Code',
      color: 'from-green-500 to-emerald-600',
      capabilities: [
        'Написание кода на любых языках',
        'Рефакторинг и оптимизация',
        'Отладка и исправление багов',
        'Code review',
        'Архитектурные решения',
        'Документация и тесты'
      ],
      examples: [
        'Напиши REST API на Python для блога',
        'Оптимизируй этот SQL запрос',
        'Создай React компонент для формы регистрации'
      ]
    },
    {
      id: 'analyst',
      name: 'Бизнес-аналитик',
      role: 'Эксперт по анализу данных',
      description: 'Анализирую данные и даю рекомендации',
      icon: 'BarChart3',
      color: 'from-blue-500 to-cyan-600',
      capabilities: [
        'SWOT-анализ',
        'Анализ конкурентов',
        'Финансовое моделирование',
        'Маркетинговые исследования',
        'Прогнозирование трендов',
        'Бизнес-планы'
      ],
      examples: [
        'Проведи SWOT-анализ для моего стартапа',
        'Создай финансовую модель на 3 года',
        'Проанализируй рынок доставки еды'
      ]
    },
    {
      id: 'translator',
      name: 'Переводчик',
      role: 'Лингвист-полиглот',
      description: 'Перевожу тексты с сохранением стиля',
      icon: 'Languages',
      color: 'from-purple-500 to-indigo-600',
      capabilities: [
        'Перевод на 100+ языков',
        'Технические тексты',
        'Художественные тексты',
        'Локализация интерфейсов',
        'Адаптация слоганов',
        'Вычитка переводов'
      ],
      examples: [
        'Переведи этот текст на английский с учетом контекста',
        'Адаптируй слоган для китайского рынка',
        'Локализуй описание приложения на 5 языков'
      ]
    },
    {
      id: 'teacher',
      name: 'Преподаватель',
      role: 'Педагог-методист',
      description: 'Объясняю сложное простыми словами',
      icon: 'GraduationCap',
      color: 'from-yellow-500 to-amber-600',
      capabilities: [
        'Объяснение сложных тем',
        'Решение задач',
        'Подготовка к экзаменам',
        'Создание учебных планов',
        'Тесты и задания',
        'Конспекты и шпаргалки'
      ],
      examples: [
        'Объясни квантовую физику простыми словами',
        'Реши эту задачу по математике пошагово',
        'Создай план подготовки к ЕГЭ по химии'
      ]
    }
  ];

  const handleGenerate = async () => {
    if (!task.trim()) {
      toast.error('Опишите задачу');
      return;
    }

    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const responses: Record<string, string> = {
        copywriter: `📝 ПРОДАЮЩИЙ ТЕКСТ

🎯 Заголовок:
"Освойте маркетинг за 30 дней и увеличьте продажи в 2 раза"

💎 Описание:
Забудьте про скучную теорию! Наш онлайн-курс — это:
✅ Практика с первого дня
✅ Реальные кейсы из вашей ниши
✅ Поддержка наставника 24/7
✅ Гарантия результата или возврат денег

🎁 Бонусы:
• Шаблоны 50 продающих текстов
• Доступ к закрытому комьюнити
• Сертификат о прохождении

⚡️ Только 3 дня: скидка 50%!

👉 Записаться на курс`,

        smm: `📅 КОНТЕНТ-ПЛАН НА МЕСЯЦ

Неделя 1: Знакомство с брендом
• ПН: История создания бренда (карусель)
• СР: Behind the scenes производства (Reels)
• ПТ: Знакомство с командой (Stories)

Неделя 2: Продуктовая линейка
• ПН: Топ-5 хитов сезона (пост с фото)
• СР: Как выбрать размер (полезный Reels)
• ПТ: Новинка недели (Stories + ссылка)

Неделя 3: Вовлечение
• ПН: Опрос "Какой цвет круче?" (Stories)
• СР: Конкурс с призом (пост + правила)
• ПТ: UGC от клиентов (Reels)

Неделя 4: Продажи
• ПН: Скидка дня -30% (Stories)
• СР: Подборка образов (карусель)
• ПТ: Flash sale (пост + таймер)`,

        programmer: `// REST API для блога на Python (FastAPI)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

app = FastAPI(title="Blog API")

class Post(BaseModel):
    id: Optional[int] = None
    title: str
    content: str
    author: str
    created_at: Optional[datetime] = None
    
posts_db = []

@app.get("/posts", response_model=List[Post])
async def get_posts(skip: int = 0, limit: int = 10):
    """Получить список постов"""
    return posts_db[skip:skip + limit]

@app.get("/posts/{post_id}", response_model=Post)
async def get_post(post_id: int):
    """Получить пост по ID"""
    for post in posts_db:
        if post.id == post_id:
            return post
    raise HTTPException(status_code=404, detail="Post not found")

@app.post("/posts", response_model=Post)
async def create_post(post: Post):
    """Создать новый пост"""
    post.id = len(posts_db) + 1
    post.created_at = datetime.now()
    posts_db.append(post)
    return post

@app.put("/posts/{post_id}")
async def update_post(post_id: int, updated_post: Post):
    """Обновить пост"""
    for i, post in enumerate(posts_db):
        if post.id == post_id:
            posts_db[i] = updated_post
            return updated_post
    raise HTTPException(status_code=404, detail="Post not found")

@app.delete("/posts/{post_id}")
async def delete_post(post_id: int):
    """Удалить пост"""
    for i, post in enumerate(posts_db):
        if post.id == post_id:
            posts_db.pop(i)
            return {"message": "Post deleted"}
    raise HTTPException(status_code=404, detail="Post not found")`,

        analyst: `📊 SWOT-АНАЛИЗ СТАРТАПА

💪 STRENGTHS (Сильные стороны):
• Инновационный продукт с уникальным УТП
• Опытная команда (10+ лет в индустрии)
• Низкая себестоимость производства
• Гибкая бизнес-модель
• Готовая клиентская база (1000 pre-orders)

⚠️ WEAKNESSES (Слабые стороны):
• Ограниченный маркетинговый бюджет
• Зависимость от одного поставщика
• Малая узнаваемость бренда
• Отсутствие патентной защиты
• Небольшая команда поддержки

🎯 OPPORTUNITIES (Возможности):
• Рост рынка на 25% в год
• Низкая конкуренция в нише
• Возможность выхода на международный рынок
• Партнерство с крупными ритейлерами
• Грантовая поддержка стартапов

⛔ THREATS (Угрозы):
• Появление крупных конкурентов
• Изменение законодательства
• Экономический кризис
• Рост цен на сырье
• Технологическое устаревание

📈 РЕКОМЕНДАЦИИ:
1. Диверсифицировать поставщиков
2. Инвестировать в маркетинг (20% бюджета)
3. Оформить патентную защиту
4. Развивать онлайн-каналы продаж
5. Создать программу лояльности`
      };

      const response = responses[selectedAssistant?.id || ''] || 
        `Результат работы ассистента "${selectedAssistant?.name}":\n\n${task}`;

      setResult(response);
      toast.success('Готово!');
    } catch (error) {
      toast.error('Ошибка генерации');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6 backdrop-blur-sm">
            <Icon name="Users" size={20} className="text-indigo-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              AI Ассистенты
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Команда AI экспертов
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Специализированные ассистенты для решения любых задач
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {assistants.map((assistant, index) => (
            <Card
              key={assistant.id}
              className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-indigo-500/50 cursor-pointer transition-all backdrop-blur-xl animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedAssistant(assistant)}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${assistant.color} flex items-center justify-center mb-4`}>
                <Icon name={assistant.icon as any} size={32} className="text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">{assistant.name}</h3>
              <p className="text-indigo-400 text-sm mb-3">{assistant.role}</p>
              <p className="text-gray-400 text-sm mb-4">{assistant.description}</p>

              <div className="space-y-2 mb-4">
                <p className="text-xs text-gray-500 font-semibold">Возможности:</p>
                {assistant.capabilities.slice(0, 3).map((cap, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <Icon name="Check" size={14} className="text-green-400 mt-0.5 shrink-0" />
                    <span className="text-gray-400 text-xs">{cap}</span>
                  </div>
                ))}
              </div>

              <Button className={`w-full bg-gradient-to-r ${assistant.color} hover:opacity-90`}>
                <Icon name="ArrowRight" size={16} className="mr-2" />
                Начать работу
              </Button>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedAssistant} onOpenChange={() => setSelectedAssistant(null)}>
          <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedAssistant && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-3xl flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedAssistant.color} flex items-center justify-center`}>
                      <Icon name={selectedAssistant.icon as any} size={24} className="text-white" />
                    </div>
                    {selectedAssistant.name}
                  </DialogTitle>
                  <p className="text-indigo-400">{selectedAssistant.role}</p>
                </DialogHeader>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Что умею:</h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {selectedAssistant.capabilities.map((cap, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Icon name="CheckCircle" size={16} className="text-green-400 mt-0.5 shrink-0" />
                          <span className="text-gray-300 text-sm">{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Примеры задач:</h4>
                    <div className="space-y-2">
                      {selectedAssistant.examples.map((example, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          className="w-full justify-start border-slate-700 text-left h-auto py-3"
                          onClick={() => setTask(example)}
                        >
                          <Icon name="Lightbulb" size={16} className="mr-2 shrink-0" />
                          <span className="text-sm">{example}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Ваша задача:</h4>
                    <Textarea
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                      placeholder="Опишите что нужно сделать..."
                      className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={generating || !task}
                    className={`w-full bg-gradient-to-r ${selectedAssistant.color} hover:opacity-90 py-6 text-lg`}
                  >
                    {generating ? (
                      <><Icon name="Loader2" size={24} className="mr-2 animate-spin" />Работаю...</>
                    ) : (
                      <><Icon name="Sparkles" size={24} className="mr-2" />Выполнить задачу</>
                    )}
                  </Button>

                  {result && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-400 mb-2">Результат:</h4>
                      <div className="bg-slate-950 border border-slate-700 rounded-lg p-4">
                        <pre className="text-gray-300 text-sm whitespace-pre-wrap font-sans">{result}</pre>
                      </div>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(result);
                          toast.success('Результат скопирован!');
                        }}
                        variant="outline"
                        className="w-full mt-3 border-slate-700"
                      >
                        <Icon name="Copy" size={16} className="mr-2" />
                        Копировать результат
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AIAssistants;
