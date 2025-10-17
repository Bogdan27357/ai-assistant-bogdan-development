import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Card, CardContent } from '@/components/ui/card';

interface AIModalProps {
  darkMode: boolean;
  model: {
    id: string;
    name: string;
    provider: string;
    description: string;
    icon: string;
    color: string;
    category: string;
    features: string[];
    isFree?: boolean;
  } | null;
  onClose: () => void;
}

const AIModal = ({ darkMode, model, onClose }: AIModalProps) => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!model) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      if (model.category === 'text') {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY || 'sk-or-v1-demo'}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AI Models Showcase'
          },
          body: JSON.stringify({
            model: model.id,
            messages: [{ role: 'user', content: prompt }]
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || 'Ошибка OpenRouter API');
        }

        const data = await response.json();
        const resultText = data.choices?.[0]?.message?.content || 'Нет ответа';
        setResult(resultText);
      } else {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (model.category === 'image') {
          setResult('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop');
        } else if (model.category === 'audio') {
          setResult('🎵 Аудио файл будет доступен после настройки API ключей');
        } else if (model.category === 'video') {
          setResult('🎬 Видео будет доступно после настройки API ключей');
        } else {
          setResult(`Демо-результат для ${model.name}: ${prompt.substring(0, 100)}...`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <Card 
        className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${model.color} flex items-center justify-center`}>
                <Icon name={model.icon as any} size={32} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {model.name}
                  </h2>
                  {model.isFree && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white font-semibold">
                      FREE
                    </span>
                  )}
                </div>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {model.provider}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                {model.category === 'text' && 'Введите ваш запрос'}
                {model.category === 'image' && 'Опишите изображение'}
                {model.category === 'video' && 'Опишите видео'}
                {model.category === 'audio' && 'Введите текст для озвучки или описание аудио'}
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className={`w-full h-32 px-4 py-3 rounded-lg border ${
                  darkMode 
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                placeholder={
                  model.category === 'text' ? 'Например: Напиши статью о космосе...' :
                  model.category === 'image' ? 'Например: Космонавт на Марсе, реалистичный стиль...' :
                  model.category === 'video' ? 'Например: Полет над горами на закате...' :
                  'Например: Привет, как дела?'
                }
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || !prompt.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {loading ? (
                <>
                  <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Генерация...
                </>
              ) : (
                <>
                  <Icon name="Sparkles" size={18} className="mr-2" />
                  Сгенерировать
                </>
              )}
            </Button>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-500">
                <Icon name="AlertCircle" size={20} />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Результат:
              </h3>
              <div className={`p-4 rounded-lg border ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                {model.category === 'image' && result.startsWith('http') ? (
                  <img src={result} alt="Generated" className="w-full rounded-lg" />
                ) : model.category === 'audio' && result.startsWith('http') ? (
                  <audio controls className="w-full">
                    <source src={result} type="audio/mpeg" />
                  </audio>
                ) : model.category === 'video' && result.startsWith('http') ? (
                  <video controls className="w-full rounded-lg">
                    <source src={result} type="video/mp4" />
                  </video>
                ) : (
                  <p className={`whitespace-pre-wrap ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {result}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
              💡 {model.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {model.features.map((feature, idx) => (
                <span 
                  key={idx}
                  className={`text-xs px-3 py-1 rounded-full ${
                    darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIModal;