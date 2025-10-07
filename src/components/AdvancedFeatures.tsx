import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const AdvancedFeatures = () => {
  const [temperature, setTemperature] = useState([0.7]);
  const [maxTokens, setMaxTokens] = useState([2048]);
  const [systemPrompt, setSystemPrompt] = useState('Ты — полезный ИИ-ассистент Богдан. Отвечай кратко и по делу.');

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-black text-white mb-2">Расширенные функции</h1>
          <p className="text-gray-400">Тонкая настройка работы ИИ моделей</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Icon name="Sliders" size={24} className="text-indigo-400" />
              Параметры генерации
            </h3>

            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white">Температура</Label>
                  <span className="text-sm text-indigo-400 font-mono">{temperature[0].toFixed(2)}</span>
                </div>
                <Slider
                  value={temperature}
                  onValueChange={setTemperature}
                  max={2}
                  min={0}
                  step={0.1}
                  className="mb-2"
                />
                <p className="text-xs text-gray-400">
                  Контролирует креативность ответов. Низкое значение = более предсказуемо, высокое = более творчески
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white">Максимум токенов</Label>
                  <span className="text-sm text-indigo-400 font-mono">{maxTokens[0]}</span>
                </div>
                <Slider
                  value={maxTokens}
                  onValueChange={setMaxTokens}
                  max={4096}
                  min={256}
                  step={256}
                  className="mb-2"
                />
                <p className="text-xs text-gray-400">
                  Ограничивает длину ответа модели
                </p>
              </div>

              <div>
                <Label className="text-white mb-2 block">Системный промпт</Label>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Введите системную инструкцию..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                />
                <p className="text-xs text-gray-400 mt-2">
                  Определяет поведение и стиль общения ИИ
                </p>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={() => toast.success('Параметры сохранены!')}
              >
                <Icon name="Save" size={18} className="mr-2" />
                Сохранить параметры
              </Button>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <Icon name="Sparkles" size={24} className="text-purple-400" />
              Специальные режимы
            </h3>

            <Tabs defaultValue="code" className="space-y-4">
              <TabsList className="bg-slate-800 border border-slate-700 w-full grid grid-cols-3">
                <TabsTrigger value="code" className="data-[state=active]:bg-indigo-600">
                  <Icon name="Code" size={16} className="mr-2" />
                  Код
                </TabsTrigger>
                <TabsTrigger value="creative" className="data-[state=active]:bg-indigo-600">
                  <Icon name="Lightbulb" size={16} className="mr-2" />
                  Креатив
                </TabsTrigger>
                <TabsTrigger value="analysis" className="data-[state=active]:bg-indigo-600">
                  <Icon name="FileText" size={16} className="mr-2" />
                  Анализ
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Terminal" size={18} className="text-blue-400" />
                    Режим программирования
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Оптимизирован для генерации и анализа кода
                  </p>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-400" />
                      Генерация кода на любых языках
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-400" />
                      Поиск и исправление ошибок
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-400" />
                      Рефакторинг и оптимизация
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-400" />
                      Объяснение сложных алгоритмов
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="creative" className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Palette" size={18} className="text-purple-400" />
                    Креативный режим
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Для создания оригинального контента
                  </p>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-purple-400" />
                      Написание статей и постов
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-purple-400" />
                      Генерация идей и концепций
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-purple-400" />
                      Сторителлинг и сценарии
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-purple-400" />
                      Маркетинговые тексты
                    </li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-800/50">
                  <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Search" size={18} className="text-emerald-400" />
                    Аналитический режим
                  </h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Глубокий анализ данных и текстов
                  </p>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      Анализ больших текстов
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      Извлечение ключевых идей
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      Сравнительный анализ
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full bg-emerald-400" />
                      Структурирование информации
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20">
              <div className="flex items-start gap-3">
                <Icon name="Info" size={20} className="text-indigo-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-300 mb-2">
                    <span className="font-semibold text-white">Мультимодальные возможности Gemini 2.0:</span>
                  </p>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li>• Анализ изображений и видео</li>
                    <li>• Распознавание речи</li>
                    <li>• Генерация описаний к медиа</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Icon name="Languages" size={20} className="text-blue-400" />
              </div>
              <h4 className="text-white font-bold">Перевод</h4>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Поддержка 100+ языков с высокой точностью перевода текстов
            </p>
            <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-400 hover:bg-blue-600/10">
              Попробовать
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Icon name="FileEdit" size={20} className="text-purple-400" />
              </div>
              <h4 className="text-white font-bold">Редактирование</h4>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Улучшение стиля, грамматики и структуры ваших текстов
            </p>
            <Button variant="outline" size="sm" className="w-full border-purple-600 text-purple-400 hover:bg-purple-600/10">
              Попробовать
            </Button>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border-emerald-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Icon name="BookOpen" size={20} className="text-emerald-400" />
              </div>
              <h4 className="text-white font-bold">Обучение</h4>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Объяснение сложных тем простым языком с примерами
            </p>
            <Button variant="outline" size="sm" className="w-full border-emerald-600 text-emerald-400 hover:bg-emerald-600/10">
              Попробовать
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeatures;
