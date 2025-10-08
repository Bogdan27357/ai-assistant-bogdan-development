import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import { Language, languages, getTranslations } from '@/lib/i18n';
import { translatorLanguages, getPopularLanguages } from '@/lib/translatorLanguages';
import { voices } from '@/lib/tts';
import { toast } from 'sonner';

interface ChatMenuProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  voiceEnabled: boolean;
  onVoiceToggle: () => void;
  selectedVoice: string;
  onVoiceChange: (voiceId: string) => void;
}

const ChatMenu = ({ language, onLanguageChange, voiceEnabled, onVoiceToggle, selectedVoice, onVoiceChange }: ChatMenuProps) => {
  const [open, setOpen] = useState(false);
  const [translateFrom, setTranslateFrom] = useState<string>('en');
  const [translateTo, setTranslateTo] = useState<string>('ru');
  const [translateText, setTranslateText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [searchLang, setSearchLang] = useState('');

  const t = getTranslations(language).chat;

  const handleTranslate = async () => {
    if (!translateText.trim()) {
      toast.error('Введите текст для перевода');
      return;
    }

    setIsTranslating(true);
    setTranslatedText('');
    try {
      const fromLang = translatorLanguages[translateFrom]?.name || translateFrom;
      const toLang = translatorLanguages[translateTo]?.name || translateTo;
      const prompt = `Translate from ${fromLang} to ${toLang}. Only translation:\n\n${translateText}`;
      
      const response = await fetch('https://functions.poehali.dev/115c6576-1517-4c2e-a0a3-7f3b5958db06', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          session_id: `translate-${Date.now()}`,
          model_id: 'gemini'
        })
      });

      if (!response.ok) throw new Error('Translation failed');
      
      const data = await response.json();
      setTranslatedText(data.response);
      toast.success('Переведено!');
    } catch (error) {
      toast.error('Ошибка перевода');
    } finally {
      setIsTranslating(false);
    }
  };

  const filteredLanguages = Object.entries(translatorLanguages).filter(([code, lang]) =>
    searchLang === '' ||
    lang.name.toLowerCase().includes(searchLang.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchLang.toLowerCase())
  );

  const popularLanguages = getPopularLanguages();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="border-slate-600 text-gray-400 hover:text-white">
          <Icon name="Menu" size={16} className="mr-2" />
          {t.menu}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-slate-900 border-slate-700 text-white w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-white">{t.menu}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="translator" className="mt-6">
          <TabsList className="bg-slate-800 border border-slate-700 grid grid-cols-3">
            <TabsTrigger value="translator" className="data-[state=active]:bg-indigo-600">
              <Icon name="Languages" size={14} className="mr-1" />
              Переводчик
            </TabsTrigger>
            <TabsTrigger value="voice" className="data-[state=active]:bg-indigo-600">
              <Icon name="Volume2" size={14} className="mr-1" />
              Озвучка
            </TabsTrigger>
            <TabsTrigger value="language" className="data-[state=active]:bg-indigo-600">
              <Icon name="Globe" size={14} className="mr-1" />
              Язык
            </TabsTrigger>
          </TabsList>

          <TabsContent value="translator" className="space-y-4 mt-6">
            <div className="space-y-4">
              <Input
                placeholder="Поиск языка..."
                value={searchLang}
                onChange={(e) => setSearchLang(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">С языка</Label>
                  <Select value={translateFrom} onValueChange={setTranslateFrom}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 max-h-[300px]">
                      <div className="px-2 py-1 text-xs text-gray-400 font-semibold">Популярные</div>
                      {popularLanguages.map(code => {
                        const lang = translatorLanguages[code];
                        return (
                          <SelectItem key={code} value={code} className="text-white">
                            {lang.flag} {lang.nativeName}
                          </SelectItem>
                        );
                      })}
                      <div className="px-2 py-1 text-xs text-gray-400 font-semibold mt-2">Все языки</div>
                      {filteredLanguages.slice(0, 50).map(([code, lang]) => (
                        <SelectItem key={code} value={code} className="text-white">
                          {lang.flag} {lang.nativeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white mb-2 block">На язык</Label>
                  <Select value={translateTo} onValueChange={setTranslateTo}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 max-h-[300px]">
                      <div className="px-2 py-1 text-xs text-gray-400 font-semibold">Популярные</div>
                      {popularLanguages.map(code => {
                        const lang = translatorLanguages[code];
                        return (
                          <SelectItem key={code} value={code} className="text-white">
                            {lang.flag} {lang.nativeName}
                          </SelectItem>
                        );
                      })}
                      <div className="px-2 py-1 text-xs text-gray-400 font-semibold mt-2">Все языки</div>
                      {filteredLanguages.slice(0, 50).map(([code, lang]) => (
                        <SelectItem key={code} value={code} className="text-white">
                          {lang.flag} {lang.nativeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">Текст</Label>
                <Textarea
                  value={translateText}
                  onChange={(e) => setTranslateText(e.target.value)}
                  placeholder="Введите текст для перевода..."
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                />
              </div>

              <Button
                onClick={handleTranslate}
                disabled={isTranslating || !translateText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 w-full"
              >
                <Icon name="Languages" size={18} className="mr-2" />
                {isTranslating ? 'Перевожу...' : 'Перевести'}
              </Button>

              {translatedText && (
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <Label className="text-white mb-2 block">Перевод:</Label>
                  <p className="text-gray-300 whitespace-pre-wrap">{translatedText}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="voice" className="space-y-4 mt-6">
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
              <div>
                <Label className="text-white font-semibold">Озвучка ответов</Label>
                <p className="text-sm text-gray-400">Автоматически озвучивать ответы ИИ</p>
              </div>
              <Switch checked={voiceEnabled} onCheckedChange={onVoiceToggle} />
            </div>

            <div>
              <Label className="text-white mb-3 block">Выберите голос</Label>
              <div className="space-y-2">
                {voices.map(voice => (
                  <button
                    key={voice.id}
                    onClick={() => onVoiceChange(voice.id)}
                    className={`w-full p-3 rounded-lg border transition-all text-left ${
                      selectedVoice === voice.id
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{voice.name}</div>
                        <div className="text-xs text-gray-400">{voice.description}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{voice.gender === 'male' ? '♂' : '♀'}</span>
                        {selectedVoice === voice.id && (
                          <Icon name="Check" size={18} className="text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-4 mt-6">
            <div>
              <Label className="text-white mb-3 block text-lg">Язык интерфейса</Label>
              <div className="space-y-2">
                {Object.entries(languages).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => {
                      onLanguageChange(code as Language);
                      toast.success(`Язык: ${lang.name}`);
                    }}
                    className={`w-full p-3 rounded-lg border transition-all flex items-center gap-3 ${
                      language === code
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-gray-300 hover:bg-slate-750'
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {language === code && (
                      <Icon name="Check" size={18} className="ml-auto text-white" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default ChatMenu;
