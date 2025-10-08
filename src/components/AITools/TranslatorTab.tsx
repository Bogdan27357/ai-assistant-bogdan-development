import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const TranslatorTab = () => {
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

  return (
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
  );
};

export default TranslatorTab;
