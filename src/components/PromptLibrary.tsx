import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface PromptTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  icon: string;
  color: string;
  author: string;
  likes: number;
  uses: number;
  tags: string[];
  isCustom?: boolean;
}

const PromptLibrary = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [customTemplates, setCustomTemplates] = useState<PromptTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    category: 'business',
    description: '',
    prompt: '',
    tags: ''
  });

  const categories = [
    { id: 'all', name: 'Все', icon: 'Grid3x3' },
    { id: 'business', name: 'Бизнес', icon: 'Briefcase' },
    { id: 'education', name: 'Учеба', icon: 'GraduationCap' },
    { id: 'creative', name: 'Креатив', icon: 'Palette' },
    { id: 'code', name: 'Код', icon: 'Code' },
    { id: 'marketing', name: 'Маркетинг', icon: 'TrendingUp' },
    { id: 'writing', name: 'Письмо', icon: 'PenTool' },
    { id: 'analysis', name: 'Анализ', icon: 'BarChart3' }
  ];

  const defaultTemplates: PromptTemplate[] = [
    {
      id: '1',
      title: 'Бизнес-план стартапа',
      category: 'business',
      description: 'Создание подробного бизнес-плана для стартапа',
      prompt: 'Создай подробный бизнес-план для стартапа в сфере [ОТРАСЛЬ]. Включи: анализ рынка, целевую аудиторию, конкурентов, стратегию развития, финансовую модель на 3 года, маркетинговый план и ключевые метрики успеха.',
      icon: 'Rocket',
      color: 'from-blue-500 to-cyan-600',
      author: 'Библиотека',
      likes: 234,
      uses: 1250,
      tags: ['бизнес', 'стартап', 'планирование']
    },
    {
      id: '2',
      title: 'Резюме статьи/книги',
      category: 'education',
      description: 'Краткое изложение основных идей',
      prompt: 'Прочитай следующий текст и создай структурированное резюме: основные тезисы, ключевые выводы, практические рекомендации. Текст: [ВСТАВЬ ТЕКСТ]',
      icon: 'BookOpen',
      color: 'from-purple-500 to-pink-600',
      author: 'Библиотека',
      likes: 189,
      uses: 890,
      tags: ['учеба', 'анализ', 'резюме']
    },
    {
      id: '3',
      title: 'Копирайт для продукта',
      category: 'creative',
      description: 'Продающий текст для товара или услуги',
      prompt: 'Напиши продающий текст для [ПРОДУКТ/УСЛУГА]. Включи: цепляющий заголовок, описание выгод (не характеристик), решение проблем клиента, социальное доказательство, призыв к действию. Целевая аудитория: [ЦА]. Тон: [СТИЛЬ].',
      icon: 'Megaphone',
      color: 'from-orange-500 to-red-600',
      author: 'Библиотека',
      likes: 456,
      uses: 2100,
      tags: ['маркетинг', 'копирайт', 'продажи']
    },
    {
      id: '4',
      title: 'Рефакторинг кода',
      category: 'code',
      description: 'Улучшение качества и читаемости кода',
      prompt: 'Проанализируй следующий код на [ЯЗЫК] и предложи рефакторинг: улучши читаемость, оптимизируй производительность, добавь комментарии, исправь потенциальные баги, примени лучшие практики. Код: [ВСТАВЬ КОД]',
      icon: 'Code2',
      color: 'from-green-500 to-emerald-600',
      author: 'Библиотека',
      likes: 678,
      uses: 3400,
      tags: ['код', 'рефакторинг', 'оптимизация']
    },
    {
      id: '5',
      title: 'Контент-план для соцсетей',
      category: 'marketing',
      description: 'План публикаций на месяц',
      prompt: 'Создай контент-план на месяц для [БРЕНД/КОМПАНИЯ] в соцсетях [ПЛАТФОРМЫ]. Ниша: [НИША]. Цель: [ЦЕЛЬ]. Включи: темы постов, типы контента (рилс, карусели, сторис), частоту публикаций, лучшее время, идеи для вовлечения.',
      icon: 'Calendar',
      color: 'from-pink-500 to-rose-600',
      author: 'Библиотека',
      likes: 892,
      uses: 4200,
      tags: ['SMM', 'контент', 'соцсети']
    },
    {
      id: '6',
      title: 'Email-рассылка',
      category: 'marketing',
      description: 'Продающее письмо для рассылки',
      prompt: 'Напиши email для рассылки о [ПРОДУКТ/АКЦИЯ]. Структура: тема письма (интригующая, до 50 символов), приветствие, проблема клиента, решение через продукт, выгоды, социальное доказательство, призыв к действию. Тон: [ДРУЖЕСКИЙ/ДЕЛОВОЙ].',
      icon: 'Mail',
      color: 'from-indigo-500 to-blue-600',
      author: 'Библиотека',
      likes: 345,
      uses: 1890,
      tags: ['email', 'маркетинг', 'продажи']
    },
    {
      id: '7',
      title: 'Решение задачи',
      category: 'education',
      description: 'Пошаговое решение с объяснениями',
      prompt: 'Реши следующую задачу пошагово с подробными объяснениями каждого действия. Укажи формулы, покажи промежуточные вычисления, дай итоговый ответ. Задача: [ВСТАВЬ ЗАДАЧУ]',
      icon: 'Calculator',
      color: 'from-cyan-500 to-teal-600',
      author: 'Библиотека',
      likes: 567,
      uses: 2800,
      tags: ['учеба', 'математика', 'решение']
    },
    {
      id: '8',
      title: 'SWOT-анализ',
      category: 'analysis',
      description: 'Анализ сильных и слабых сторон',
      prompt: 'Проведи SWOT-анализ для [КОМПАНИЯ/ПРОЕКТ/ИДЕЯ]. Определи: Strengths (сильные стороны), Weaknesses (слабости), Opportunities (возможности), Threats (угрозы). Дай рекомендации по каждому пункту.',
      icon: 'Target',
      color: 'from-violet-500 to-purple-600',
      author: 'Библиотека',
      likes: 234,
      uses: 1100,
      tags: ['анализ', 'бизнес', 'стратегия']
    },
    {
      id: '9',
      title: 'Креативная концепция',
      category: 'creative',
      description: 'Идея для рекламной кампании',
      prompt: 'Разработай креативную концепцию для рекламной кампании [ПРОДУКТ/БРЕНД]. Целевая аудитория: [ЦА]. Ключевое сообщение: [СООБЩЕНИЕ]. Включи: большую идею, слоган, визуальный стиль, каналы коммуникации, механику вовлечения.',
      icon: 'Lightbulb',
      color: 'from-yellow-500 to-orange-600',
      author: 'Библиотека',
      likes: 445,
      uses: 1950,
      tags: ['креатив', 'реклама', 'идея']
    },
    {
      id: '10',
      title: 'API документация',
      category: 'code',
      description: 'Техническая документация для API',
      prompt: 'Создай документацию для API эндпоинта. Включи: описание назначения, HTTP метод, URL, параметры запроса (обязательные/опциональные), формат тела запроса, примеры запросов, возможные ответы (успех/ошибки), коды статусов. Эндпоинт: [ОПИСАНИЕ]',
      icon: 'FileCode',
      color: 'from-emerald-500 to-green-600',
      author: 'Библиотека',
      likes: 234,
      uses: 980,
      tags: ['код', 'документация', 'API']
    }
  ];

  useEffect(() => {
    setTemplates(defaultTemplates);
    const saved = localStorage.getItem('custom_prompts');
    if (saved) {
      setCustomTemplates(JSON.parse(saved));
    }
  }, []);

  const filteredTemplates = [...templates, ...customTemplates].filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = () => {
    if (!newTemplate.title || !newTemplate.prompt) {
      toast.error('Заполните название и промпт');
      return;
    }

    const template: PromptTemplate = {
      id: Date.now().toString(),
      title: newTemplate.title,
      category: newTemplate.category,
      description: newTemplate.description,
      prompt: newTemplate.prompt,
      icon: 'Star',
      color: 'from-indigo-500 to-purple-600',
      author: 'Вы',
      likes: 0,
      uses: 0,
      tags: newTemplate.tags.split(',').map(t => t.trim()).filter(Boolean),
      isCustom: true
    };

    const updated = [...customTemplates, template];
    setCustomTemplates(updated);
    localStorage.setItem('custom_prompts', JSON.stringify(updated));
    
    setNewTemplate({ title: '', category: 'business', description: '', prompt: '', tags: '' });
    setIsCreateDialogOpen(false);
    toast.success('Шаблон создан!');
  };

  const copyPrompt = (prompt: string, title: string) => {
    navigator.clipboard.writeText(prompt);
    toast.success(`Промпт "${title}" скопирован!`);
  };

  const deleteTemplate = (id: string) => {
    const updated = customTemplates.filter(t => t.id !== id);
    setCustomTemplates(updated);
    localStorage.setItem('custom_prompts', JSON.stringify(updated));
    toast.success('Шаблон удален');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6 backdrop-blur-sm">
            <Icon name="Library" size={20} className="text-purple-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              Библиотека промптов
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Готовые промпты для любых задач
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Профессиональные шаблоны для бизнеса, учебы, креатива и разработки
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск промптов..."
                className="pl-10 bg-slate-900/50 border-slate-700 text-white"
              />
            </div>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                <Icon name="Plus" size={18} className="mr-2" />
                Создать промпт
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl">Создать свой шаблон</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Название</Label>
                  <Input
                    value={newTemplate.title}
                    onChange={(e) => setNewTemplate({...newTemplate, title: e.target.value})}
                    placeholder="Например: Анализ конкурентов"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label>Категория</Label>
                  <Select value={newTemplate.category} onValueChange={(v) => setNewTemplate({...newTemplate, category: v})}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {categories.filter(c => c.id !== 'all').map(cat => (
                        <SelectItem key={cat.id} value={cat.id} className="text-white">
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Описание</Label>
                  <Input
                    value={newTemplate.description}
                    onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                    placeholder="Краткое описание промпта"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <div>
                  <Label>Промпт</Label>
                  <Textarea
                    value={newTemplate.prompt}
                    onChange={(e) => setNewTemplate({...newTemplate, prompt: e.target.value})}
                    placeholder="Текст промпта... Используйте [ПЕРЕМЕННЫЕ] для подстановки"
                    className="bg-slate-800 border-slate-700 text-white min-h-[150px]"
                  />
                </div>
                <div>
                  <Label>Теги (через запятую)</Label>
                  <Input
                    value={newTemplate.tags}
                    onChange={(e) => setNewTemplate({...newTemplate, tags: e.target.value})}
                    placeholder="маркетинг, анализ, стратегия"
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                </div>
                <Button onClick={handleCreateTemplate} className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                  Создать шаблон
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-slate-700 flex-wrap h-auto">
            {categories.map(cat => (
              <TabsTrigger
                key={cat.id}
                value={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600"
              >
                <Icon name={cat.icon as any} size={16} className="mr-2" />
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <Card
                key={template.id}
                className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-purple-500/50 transition-all backdrop-blur-xl animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center shrink-0`}>
                    <Icon name={template.icon as any} size={24} className="text-white" />
                  </div>
                  {template.isCustom && (
                    <Button
                      onClick={() => deleteTemplate(template.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                    >
                      <Icon name="Trash2" size={16} />
                    </Button>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{template.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{template.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {template.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-gray-400">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Icon name="User" size={12} />
                    {template.author}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Icon name="Heart" size={12} />
                      {template.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Play" size={12} />
                      {template.uses}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => copyPrompt(template.prompt, template.title)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  size="sm"
                >
                  <Icon name="Copy" size={16} className="mr-2" />
                  Копировать промпт
                </Button>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <Icon name="Search" size={64} className="text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Промптов не найдено</p>
              <p className="text-gray-500 text-sm">Попробуйте изменить запрос или категорию</p>
            </div>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default PromptLibrary;
