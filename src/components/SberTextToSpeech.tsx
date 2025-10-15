import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SberTextToSpeech = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Natalia');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const voices = [
    { value: 'Natalia', label: 'Наталья (женский)' },
    { value: 'Boris', label: 'Борис (мужской)' },
    { value: 'Marfa', label: 'Марфа (женский)' },
    { value: 'Taras', label: 'Тарас (мужской)' },
    { value: 'Alexandra', label: 'Александра (женский)' },
    { value: 'Sergey', label: 'Сергей (мужской)' },
  ];

  const generateSpeech = async () => {
    if (!text.trim()) {
      toast.error('Введите текст для озвучки');
      return;
    }

    setIsGenerating(true);
    
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      const response = await fetch('https://functions.poehali.dev/635b67d6-9fa9-48be-9773-7f015d8d7ad1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, voice }),
      });

      const data = await response.json();

      if (data.success && data.audio) {
        const audioBlob = base64ToBlob(data.audio, 'audio/ogg');
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        toast.success('Аудио готово!');
      } else if (data.error) {
        if (data.error.includes('not configured')) {
          toast.error('Необходимо добавить SBER_SALUTE_SPEECH_TOKEN в секреты');
        } else {
          toast.error(`Ошибка: ${data.error}`);
        }
      }
    } catch (error) {
      console.error('Ошибка генерации:', error);
      toast.error('Ошибка при генерации речи');
    } finally {
      setIsGenerating(false);
    }
  };

  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const downloadAudio = () => {
    if (audioUrl) {
      const a = document.createElement('a');
      a.href = audioUrl;
      a.download = `speech-${Date.now()}.ogg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success('Аудио скачано');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-slate-200 dark:border-slate-700 shadow-xl">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="Volume2" size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-xl">Синтез речи</h2>
              <p className="text-white/80 text-sm">Озвучка текста голосом</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Выберите голос
            </label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger className="w-full bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                <SelectValue placeholder="Выберите голос" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600">
                {voices.map((v) => (
                  <SelectItem 
                    key={v.value} 
                    value={v.value}
                    className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Текст для озвучки
            </label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Введите текст, который нужно озвучить..."
              className="min-h-32 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
              disabled={isGenerating}
            />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {text.length} символов
            </p>
          </div>

          <Button
            onClick={generateSpeech}
            disabled={!text.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-6 text-lg"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Генерация...
              </>
            ) : (
              <>
                <Icon name="Wand2" size={24} className="mr-2" />
                Озвучить текст
              </>
            )}
          </Button>

          {audioUrl && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Icon name="Music" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Готово!</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Ваше аудио готово к прослушиванию</p>
                  </div>
                </div>
                <audio
                  src={audioUrl}
                  controls
                  className="w-full"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={downloadAudio}
                  variant="outline"
                  className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <Icon name="Download" size={18} className="mr-2" />
                  Скачать
                </Button>
                <Button
                  onClick={() => {
                    setText('');
                    setAudioUrl(null);
                  }}
                  variant="outline"
                  className="flex-1 border-slate-300 dark:border-slate-600"
                >
                  <Icon name="RotateCcw" size={18} className="mr-2" />
                  Очистить
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default SberTextToSpeech;
