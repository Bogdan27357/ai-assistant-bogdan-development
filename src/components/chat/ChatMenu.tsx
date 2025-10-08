import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { Language, languages, getTranslations } from '@/lib/i18n';
import { toast } from 'sonner';

interface ChatMenuProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onTranslate: (text: string, from: Language, to: Language) => void;
}

const ChatMenu = ({ language, onLanguageChange, onTranslate }: ChatMenuProps) => {
  const [open, setOpen] = useState(false);
  const [translateFrom, setTranslateFrom] = useState<Language>('en');
  const [translateTo, setTranslateTo] = useState<Language>('ru');
  const [translateText, setTranslateText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const t = getTranslations(language).chat;

  const handleTranslate = async () => {
    if (!translateText.trim()) {
      toast.error(t.enterText);
      return;
    }

    setIsTranslating(true);
    setTranslatedText('');
    try {
      const prompt = `Translate the following text from ${languages[translateFrom].name} to ${languages[translateTo].name}. Only provide the translation, nothing else:\n\n${translateText}`;
      
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
      toast.success('Translated!');
    } catch (error) {
      toast.error('Translation error');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-600 text-gray-400 hover:text-white"
        >
          <Icon name="Menu" size={16} className="mr-2" />
          {t.menu}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-slate-900 border-slate-700 text-white w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="text-white">{t.menu}</SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="translator" className="mt-6">
          <TabsList className="bg-slate-800 border border-slate-700 w-full">
            <TabsTrigger value="translator" className="data-[state=active]:bg-indigo-600 flex-1">
              <Icon name="Languages" size={16} className="mr-2" />
              {t.translator}
            </TabsTrigger>
            <TabsTrigger value="language" className="data-[state=active]:bg-indigo-600 flex-1">
              <Icon name="Globe" size={16} className="mr-2" />
              {t.languageSettings}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="translator" className="space-y-4 mt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white mb-2 block">{t.translateFrom}</Label>
                  <Select value={translateFrom} onValueChange={(v) => setTranslateFrom(v as Language)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {Object.entries(languages).map(([code, lang]) => (
                        <SelectItem key={code} value={code} className="text-white">
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white mb-2 block">{t.translateTo}</Label>
                  <Select value={translateTo} onValueChange={(v) => setTranslateTo(v as Language)}>
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {Object.entries(languages).map(([code, lang]) => (
                        <SelectItem key={code} value={code} className="text-white">
                          {lang.flag} {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white mb-2 block">{t.enterText}</Label>
                <Textarea
                  value={translateText}
                  onChange={(e) => setTranslateText(e.target.value)}
                  placeholder={t.enterText}
                  className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                />
              </div>

              <Button
                onClick={handleTranslate}
                disabled={isTranslating || !translateText.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 w-full"
              >
                <Icon name="Languages" size={18} className="mr-2" />
                {isTranslating ? 'Translating...' : t.translate}
              </Button>

              {translatedText && (
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <Label className="text-white mb-2 block">Translation:</Label>
                  <p className="text-gray-300">{translatedText}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="language" className="space-y-4 mt-6">
            <div>
              <Label className="text-white mb-3 block text-lg">{t.interfaceLanguage}</Label>
              <div className="space-y-2">
                {Object.entries(languages).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => {
                      onLanguageChange(code as Language);
                      toast.success(`${t.interfaceLanguage}: ${lang.name}`);
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