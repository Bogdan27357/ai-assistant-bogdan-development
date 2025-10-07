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
  const [sourceLang, setSourceLang] = useState('auto');
  const [loading, setLoading] = useState(false);

  const [ttsText, setTtsText] = useState('');
  const [ttsLang, setTtsLang] = useState('ru-RU');
  const [audioUrl, setAudioUrl] = useState('');

  const [summaryText, setSummaryText] = useState('');
  const [summaryResult, setSummaryResult] = useState('');
  const [summaryLength, setSummaryLength] = useState('medium');

  const [sentimentText, setSentimentText] = useState('');
  const [sentimentResult, setSentimentResult] = useState<any>(null);

  const languages = [
    { code: 'auto', name: 'Автоопределение' },
    { code: 'ru', name: 'Русский' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' }
  ];

  const handleTranslate = async () => {
    if (!translatorText.trim()) {
      toast.error('Введите текст для перевода');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/ai-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'translate',
          text: translatorText,
          params: {
            target_lang: targetLang,
            source_lang: sourceLang
          }
        })
      });

      const data = await response.json();
      setTranslatedText(data.result);
      toast.success('Текст переведен!');
    } catch (error) {
      toast.error('Ошибка перевода');
    } finally {
      setLoading(false);
    }
  };

  const handleTextToSpeech = async () => {
    if (!ttsText.trim()) {
      toast.error('Введите текст для озвучки');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/ai-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'tts',
          text: ttsText,
          params: {
            lang: ttsLang
          }
        })
      });

      const data = await response.json();
      const audio = `data:audio/mp3;base64,${data.result}`;
      setAudioUrl(audio);
      toast.success('Аудио создано!');
    } catch (error) {
      toast.error('Ошибка создания аудио');
    } finally {
      setLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!summaryText.trim()) {
      toast.error('Введите текст для краткого содержания');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/ai-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'summarize',
          text: summaryText,
          params: {
            length: summaryLength
          }
        })
      });

      const data = await response.json();
      setSummaryResult(data.result);
      toast.success('Краткое содержание готово!');
    } catch (error) {
      toast.error('Ошибка создания краткого содержания');
    } finally {
      setLoading(false);
    }
  };

  const handleSentiment = async () => {
    if (!sentimentText.trim()) {
      toast.error('Введите текст для анализа');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/ai-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'sentiment',
          text: sentimentText
        })
      });

      const data = await response.json();
      setSentimentResult(data.result);
      toast.success('Анализ завершен!');
    } catch (error) {
      toast.error('Ошибка анализа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-black text-white mb-2">🛠️ ИИ Инструменты</h1>
          <p className="text-gray-400">Мощные инструменты для работы с текстом, голосом и изображениями</p>
        </div>

        <Tabs defaultValue="translator" className="space-y-6">
          <TabsList className="bg-slate-900 border border-slate-700 flex-wrap h-auto">
            <TabsTrigger value="translator" className="data-[state=active]:bg-indigo-600">
              <Icon name="Languages" size={16} className="mr-2" />
              Переводчик
            </TabsTrigger>
            <TabsTrigger value="tts" className="data-[state=active]:bg-indigo-600">
              <Icon name="Volume2" size={16} className="mr-2" />
              Озвучка
            </TabsTrigger>
            <TabsTrigger value="summary" className="data-[state=active]:bg-indigo-600">
              <Icon name="FileText" size={16} className="mr-2" />
              Краткое содержание
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="data-[state=active]:bg-indigo-600">
              <Icon name="Smile" size={16} className="mr-2" />
              Анализ тональности
            </TabsTrigger>
          </TabsList>

          <TabsContent value="translator">
            <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Icon name="Languages" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Переводчик текста</h3>
                  <p className="text-gray-400 text-sm">Перевод на 50+ языков с помощью ИИ</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-white text-sm mb-2 block">Исходный язык</label>
                  <Select value={sourceLang} onValueChange={setSourceLang}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-white text-sm mb-2 block">Целевой язык</label>
                  <Select value={targetLang} onValueChange={setTargetLang}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.filter(l => l.code !== 'auto').map(lang => (
                        <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Textarea
                  value={translatorText}
                  onChange={(e) => setTranslatorText(e.target.value)}
                  placeholder="Введите текст для перевода..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[150px]"
                />
                
                <Button 
                  onClick={handleTranslate} 
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 w-full"
                >
                  {loading ? 'Перевод...' : 'Перевести'}
                </Button>

                {translatedText && (
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <label className="text-white text-sm mb-2 block font-semibold">Результат:</label>
                    <p className="text-white">{translatedText}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tts">
            <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Icon name="Volume2" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Озвучка текста</h3>
                  <p className="text-gray-400 text-sm">Преобразование текста в естественную речь</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-white text-sm mb-2 block">Язык озвучки</label>
                <Select value={ttsLang} onValueChange={setTtsLang}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ru-RU">Русский</SelectItem>
                    <SelectItem value="en-US">English (US)</SelectItem>
                    <SelectItem value="en-GB">English (UK)</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                    <SelectItem value="fr-FR">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Textarea
                  value={ttsText}
                  onChange={(e) => setTtsText(e.target.value)}
                  placeholder="Введите текст для озвучки..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[150px]"
                />
                
                <Button 
                  onClick={handleTextToSpeech} 
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 w-full"
                >
                  {loading ? 'Создание аудио...' : 'Озвучить'}
                </Button>

                {audioUrl && (
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <label className="text-white text-sm mb-2 block font-semibold">Аудио:</label>
                    <audio controls src={audioUrl} className="w-full" />
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="summary">
            <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Icon name="FileText" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Краткое содержание</h3>
                  <p className="text-gray-400 text-sm">Автоматическое создание резюме текста</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-white text-sm mb-2 block">Длина резюме</label>
                <Select value={summaryLength} onValueChange={setSummaryLength}>
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Короткое (2-3 предложения)</SelectItem>
                    <SelectItem value="medium">Среднее (5-7 предложений)</SelectItem>
                    <SelectItem value="long">Длинное (10-15 предложений)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Textarea
                  value={summaryText}
                  onChange={(e) => setSummaryText(e.target.value)}
                  placeholder="Введите длинный текст для создания краткого содержания..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[200px]"
                />
                
                <Button 
                  onClick={handleSummarize} 
                  disabled={loading}
                  className="bg-emerald-600 hover:bg-emerald-700 w-full"
                >
                  {loading ? 'Создание резюме...' : 'Создать резюме'}
                </Button>

                {summaryResult && (
                  <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <label className="text-white text-sm mb-2 block font-semibold">Резюме:</label>
                    <p className="text-white">{summaryResult}</p>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="sentiment">
            <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Icon name="Smile" size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Анализ тональности</h3>
                  <p className="text-gray-400 text-sm">Определение эмоционального окраса текста</p>
                </div>
              </div>

              <div className="space-y-4">
                <Textarea
                  value={sentimentText}
                  onChange={(e) => setSentimentText(e.target.value)}
                  placeholder="Введите текст для анализа эмоций..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[150px]"
                />
                
                <Button 
                  onClick={handleSentiment} 
                  disabled={loading}
                  className="bg-amber-600 hover:bg-amber-700 w-full"
                >
                  {loading ? 'Анализ...' : 'Анализировать'}
                </Button>

                {sentimentResult && (
                  <div className="p-6 rounded-lg bg-slate-800/50 border border-slate-700 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`px-4 py-2 rounded-full font-bold ${
                        sentimentResult.sentiment === 'positive' ? 'bg-green-500/20 text-green-400' :
                        sentimentResult.sentiment === 'negative' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {sentimentResult.sentiment === 'positive' ? '😊 Позитивно' :
                         sentimentResult.sentiment === 'negative' ? '😞 Негативно' :
                         '😐 Нейтрально'}
                      </div>
                      <div className="text-white font-mono">
                        Оценка: {(sentimentResult.score * 100).toFixed(0)}%
                      </div>
                    </div>
                    
                    {sentimentResult.emotions && sentimentResult.emotions.length > 0 && (
                      <div>
                        <label className="text-white text-sm mb-2 block font-semibold">Эмоции:</label>
                        <div className="flex flex-wrap gap-2">
                          {sentimentResult.emotions.map((emotion: string, idx: number) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-slate-700 text-gray-300 text-sm">
                              {emotion}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="text-white text-sm mb-2 block font-semibold">Объяснение:</label>
                      <p className="text-gray-300">{sentimentResult.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AITools;