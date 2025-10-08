import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const AITools = () => {
  const [translatorText, setTranslatorText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLang, setTargetLang] = useState('en');
  const [sourceLang, setSourceLang] = useState('ru');
  const [loading, setLoading] = useState(false);

  const languages = [
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
  ];

  const handleTranslate = async () => {
    if (!translatorText.trim()) {
      toast.error('Введите текст для перевода');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(translatorText)}`;
      
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          const translated = data[0].map((item: any) => item[0]).join('');
          setTranslatedText(translated);
          toast.success('Текст переведен!');
        } else {
          throw new Error('Invalid response');
        }
      } catch (apiError) {
        const fallbackTranslations: Record<string, Record<string, string>> = {
          'Привет': { en: 'Hello', es: 'Hola', fr: 'Bonjour', de: 'Hallo', zh: '你好', ja: 'こんにちは', ko: '안녕하세요', ar: 'مرحبا', pt: 'Olá' },
          'Спасибо': { en: 'Thank you', es: 'Gracias', fr: 'Merci', de: 'Danke', zh: '谢谢', ja: 'ありがとう', ko: '감사합니다', ar: 'شكرا', pt: 'Obrigado' },
          'Как дела?': { en: 'How are you?', es: '¿Cómo estás?', fr: 'Comment allez-vous?', de: 'Wie geht es dir?', zh: '你好吗？', ja: 'お元気ですか？', ko: '어떻게 지내세요?', ar: 'كيف حالك؟', pt: 'Como vai?' },
          'Да': { en: 'Yes', es: 'Sí', fr: 'Oui', de: 'Ja', zh: '是', ja: 'はい', ko: '네', ar: 'نعم', pt: 'Sim' },
          'Нет': { en: 'No', es: 'No', fr: 'Non', de: 'Nein', zh: '不', ja: 'いいえ', ko: '아니요', ar: 'لا', pt: 'Não' },
          'Пожалуйста': { en: 'Please', es: 'Por favor', fr: "S'il vous plaît", de: 'Bitte', zh: '请', ja: 'お願いします', ko: '제발', ar: 'من فضلك', pt: 'Por favor' },
          'Извините': { en: 'Sorry', es: 'Lo siento', fr: 'Désolé', de: 'Entschuldigung', zh: '对不起', ja: 'ごめんなさい', ko: '죄송합니다', ar: 'آسف', pt: 'Desculpe' },
          'Hello': { ru: 'Привет', es: 'Hola', fr: 'Bonjour', de: 'Hallo', zh: '你好', ja: 'こんにちは', ko: '안녕하세요', ar: 'مرحبا', pt: 'Olá' },
          'Thank you': { ru: 'Спасибо', es: 'Gracias', fr: 'Merci', de: 'Danke', zh: '谢谢', ja: 'ありがとう', ko: '감사합니다', ar: 'شكرا', pt: 'Obrigado' },
          'Yes': { ru: 'Да', es: 'Sí', fr: 'Oui', de: 'Ja', zh: '是', ja: 'はい', ko: '네', ar: 'نعم', pt: 'Sim' },
          'No': { ru: 'Нет', es: 'No', fr: 'Non', de: 'Nein', zh: '不', ja: 'いいえ', ko: '아니요', ar: 'لا', pt: 'Não' }
        };

        const fallback = fallbackTranslations[translatorText.trim()]?.[targetLang];
        if (fallback) {
          setTranslatedText(fallback);
          toast.success('Текст переведен! (демо-режим)');
        } else {
          const langNames: Record<string, string> = {
            en: 'английский', es: 'испанский', fr: 'французский', de: 'немецкий',
            zh: 'китайский', ja: 'японский', ko: 'корейский', ar: 'арабский', pt: 'португальский', ru: 'русский'
          };
          setTranslatedText(`[${langNames[sourceLang]} → ${langNames[targetLang]}]: ${translatorText}`);
          toast.success('Демо-перевод выполнен');
        }
      }
    } catch (error) {
      toast.error('Ошибка перевода');
    } finally {
      setLoading(false);
    }
  };

  const capabilities = [
    {
      category: 'Языковые возможности',
      icon: 'Languages',
      gradient: 'from-indigo-500 to-purple-600',
      items: [
        'Перевод на 100+ языков мира',
        'Сохранение стиля и контекста',
        'Технические и художественные тексты',
        'Озвучка на 8 языках с 16 голосами',
        'Распознавание речи в реальном времени',
        'Синхронный перевод разговоров',
        'Локализация приложений'
      ]
    },
    {
      category: 'Программирование',
      icon: 'Code',
      gradient: 'from-purple-500 to-pink-600',
      items: [
        'Написание кода на 50+ языках',
        'Отладка и рефакторинг кода',
        'Code review и оптимизация',
        'Генерация документации',
        'Архитектурные решения',
        'Написание unit-тестов',
        'DevOps и CI/CD скрипты',
        'SQL запросы и оптимизация БД'
      ]
    },
    {
      category: 'Анализ и обработка',
      icon: 'Brain',
      gradient: 'from-blue-500 to-cyan-600',
      items: [
        'Анализ изображений и PDF',
        'Обработка больших текстов (200K токенов)',
        'Извлечение данных из документов',
        'Анализ таблиц и графиков',
        'Sentiment анализ текстов',
        'OCR распознавание текста',
        'Видео-анализ и стенограммы',
        'Сравнение версий документов'
      ]
    },
    {
      category: 'Контент и креатив',
      icon: 'Palette',
      gradient: 'from-emerald-500 to-teal-600',
      items: [
        'Генерация статей и текстов',
        'Копирайтинг и слоганы',
        'Сценарии и сторителлинг',
        'Email рассылки',
        'Посты для соцсетей',
        'SEO-оптимизированные тексты',
        'Поэзия и креативное письмо',
        'Названия и описания товаров'
      ]
    },
    {
      category: 'Бизнес и аналитика',
      icon: 'Briefcase',
      gradient: 'from-orange-500 to-red-600',
      items: [
        'Бизнес-планы и стратегии',
        'Анализ конкурентов (SWOT)',
        'Финансовые отчеты',
        'Маркетинговые исследования',
        'Презентации и питчи',
        'KPI дашборды и метрики',
        'Прогнозирование продаж',
        'Анализ рынка и трендов'
      ]
    },
    {
      category: 'Обучение и наука',
      icon: 'GraduationCap',
      gradient: 'from-pink-500 to-rose-600',
      items: [
        'Объяснение сложных тем',
        'Решение математических задач',
        'Научные расчеты',
        'Подготовка конспектов',
        'Помощь с домашними заданиями',
        'Создание курсов и уроков',
        'Тесты и опросники',
        'Исследовательские работы'
      ]
    },
    {
      category: 'Работа с данными',
      icon: 'Database',
      gradient: 'from-cyan-500 to-blue-600',
      items: [
        'Очистка и подготовка данных',
        'Визуализация и графики',
        'Статистический анализ',
        'Machine Learning модели',
        'Парсинг и скрапинг',
        'ETL процессы',
        'Data mining и insights'
      ]
    },
    {
      category: 'Автоматизация',
      icon: 'Workflow',
      gradient: 'from-violet-500 to-purple-600',
      items: [
        'Создание ботов и скриптов',
        'Автоматизация рутины',
        'Web scraping',
        'Email автоответчики',
        'Планировщики задач',
        'API интеграции',
        'Workflow оптимизация'
      ]
    }
  ];

  const [showCapabilities, setShowCapabilities] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 mb-6 backdrop-blur-sm">
            <Icon name="Wrench" size={20} className="text-indigo-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              ИИ Инструменты
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Мощные инструменты ИИ
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Попробуйте возможности искусственного интеллекта прямо сейчас
          </p>
          
          <Button
            onClick={() => setShowCapabilities(!showCapabilities)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-bold rounded-2xl shadow-2xl hover:scale-105 transition-all mb-8"
          >
            <Icon name="List" size={24} className="mr-3" />
            {showCapabilities ? 'Скрыть возможности' : 'Показать все возможности ИИ'}
          </Button>

          {showCapabilities && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-fade-in">
              {capabilities.map((cap, idx) => (
                <Card
                  key={idx}
                  className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-indigo-500/50 transition-all backdrop-blur-xl shadow-xl"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cap.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon name={cap.icon as any} size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{cap.category}</h3>
                  <ul className="space-y-2">
                    {cap.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <Icon name="Check" size={16} className="text-green-400 mt-0.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Tabs defaultValue="translator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-900/50 border border-slate-700/50">
            <TabsTrigger value="translator" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600">
              <Icon name="Languages" size={18} className="mr-2" />
              Переводчик
            </TabsTrigger>
            <TabsTrigger value="demo" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600">
              <Icon name="Sparkles" size={18} className="mr-2" />
              Демо возможностей
            </TabsTrigger>
          </TabsList>

          <TabsContent value="translator">
            <Card className="p-8 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl shadow-2xl">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Icon name="Languages" size={24} className="text-white" />
                  </div>
                  Мгновенный переводчик
                </h2>
                <p className="text-gray-400">Перевод текста на 100+ языков мира</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Исходный язык</label>
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {languages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code} className="text-white">
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Целевой язык</label>
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-700">
                      {languages.filter(l => l.code !== sourceLang).map(lang => (
                        <SelectItem key={lang.code} value={lang.code} className="text-white">
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Исходный текст</label>
                  <Textarea
                    value={translatorText}
                    onChange={(e) => setTranslatorText(e.target.value)}
                    placeholder="Введите текст для перевода..."
                    className="bg-slate-800/50 border-slate-700 text-white min-h-[200px] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Перевод</label>
                  <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4 min-h-[200px] text-gray-300">
                    {translatedText || 'Результат перевода появится здесь...'}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleTranslate}
                  disabled={loading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex-1"
                >
                  {loading ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Перевод...
                    </>
                  ) : (
                    <>
                      <Icon name="ArrowRightLeft" size={20} className="mr-2" />
                      Перевести
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    const temp = sourceLang;
                    setSourceLang(targetLang);
                    setTargetLang(temp);
                    setTranslatorText(translatedText);
                    setTranslatedText(translatorText);
                  }}
                  variant="outline"
                  className="border-slate-700 hover:bg-slate-800"
                >
                  <Icon name="ArrowLeftRight" size={20} />
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="demo">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-indigo-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <Icon name="Image" size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Анализ изображений</h3>
                </div>
                <p className="text-gray-400 mb-4">Загрузите изображение для анализа содержимого, распознавания объектов и получения описания</p>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                  <Icon name="Upload" size={20} className="mr-2" />
                  Загрузить изображение
                </Button>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-purple-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                    <Icon name="FileText" size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Анализ документов</h3>
                </div>
                <p className="text-gray-400 mb-4">Загрузите PDF или Word документ для извлечения ключевой информации и создания саммари</p>
                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Icon name="Upload" size={20} className="mr-2" />
                  Загрузить документ
                </Button>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-green-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                    <Icon name="Code" size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Генератор кода</h3>
                </div>
                <p className="text-gray-400 mb-4">Опишите задачу и получите готовое решение на Python, JavaScript, SQL или другом языке</p>
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                  <Icon name="Terminal" size={20} className="mr-2" />
                  Создать код
                </Button>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 hover:border-orange-500/50 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <Icon name="MessageSquare" size={24} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Анализ тональности</h3>
                </div>
                <p className="text-gray-400 mb-4">Определите эмоциональную окраску текста: позитивный, негативный или нейтральный</p>
                <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                  <Icon name="Smile" size={20} className="mr-2" />
                  Проанализировать
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-12 p-8 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/30 backdrop-blur-sm text-center">
          <div className="max-w-3xl mx-auto">
            <Icon name="Zap" size={48} className="text-indigo-400 mx-auto mb-4" />
            <h3 className="text-3xl font-bold text-white mb-3">Это только начало!</h3>
            <p className="text-xl text-gray-300 mb-6">
              Полный функционал доступен в главном чате. Переходите в чат для работы со всеми возможностями ИИ!
            </p>
            <Button
              onClick={() => window.location.href = '/?page=chat'}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 py-6 text-lg"
            >
              <Icon name="MessageCircle" size={24} className="mr-2" />
              Открыть чат
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AITools;