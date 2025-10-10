import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { freeModels, freeImageModels } from './useApiKeyManagement';

const AITestTab = () => {
  const [chatPrompt, setChatPrompt] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [selectedChatModel, setSelectedChatModel] = useState('qwen');
  const [selectedImageModel, setSelectedImageModel] = useState('flux');
  const [chatResponse, setChatResponse] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const testChat = async () => {
    if (!chatPrompt.trim()) {
      toast.error('Введите промпт для чата');
      return;
    }

    setLoadingChat(true);
    setChatResponse('');

    try {
      const response = await fetch('https://functions.poehali.dev/d6af8e44-8748-4611-a1ff-2f819acf245c', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatPrompt,
          model_id: selectedChatModel
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setChatResponse(data.response || 'Нет ответа');
      toast.success('Ответ получен!');
    } catch (error: any) {
      toast.error(`Ошибка: ${error.message}`);
      setChatResponse(`Ошибка: ${error.message}`);
    } finally {
      setLoadingChat(false);
    }
  };

  const testImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Введите промпт для генерации фото');
      return;
    }

    setLoadingImage(true);
    setImageUrl('');

    try {
      const response = await fetch('https://functions.poehali.dev/49a6f065-a362-4b49-9bf4-799295201103', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          type: 'image',
          model: selectedImageModel
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setImageUrl(data.media_url || '');
      toast.success('Изображение сгенерировано!');
    } catch (error: any) {
      toast.error(`Ошибка: ${error.message}`);
    } finally {
      setLoadingImage(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-slate-900/50 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Icon name="MessageSquare" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Тест чата</h3>
            <p className="text-sm text-slate-400">Бесплатные AI модели (HuggingFace)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Выберите модель</label>
            <div className="grid grid-cols-2 gap-2">
              {freeModels.map((model) => (
                <Button
                  key={model.id}
                  variant={selectedChatModel === model.model ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedChatModel(model.model)}
                  className={selectedChatModel === model.model ? 'bg-blue-600' : 'border-slate-700'}
                >
                  <Icon name={model.icon as any} size={14} className="mr-1" />
                  {model.name.split(' ')[0]}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Ваш вопрос</label>
            <Textarea
              value={chatPrompt}
              onChange={(e) => setChatPrompt(e.target.value)}
              placeholder="Напиши короткое стихотворение про космос..."
              className="bg-slate-800 border-slate-700 text-white min-h-24"
            />
          </div>

          <Button
            onClick={testChat}
            disabled={loadingChat}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            {loadingChat ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Генерация...
              </>
            ) : (
              <>
                <Icon name="Send" size={16} className="mr-2" />
                Отправить
              </>
            )}
          </Button>

          {chatResponse && (
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-sm text-slate-400 mb-2">Ответ AI:</p>
              <p className="text-white whitespace-pre-wrap">{chatResponse}</p>
            </div>
          )}
        </div>
      </Card>

      <Card className="bg-slate-900/50 border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
            <Icon name="Image" size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Тест генерации фото</h3>
            <p className="text-sm text-slate-400">Бесплатно через Pollinations AI</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">Выберите стиль</label>
            <div className="grid grid-cols-2 gap-2">
              {freeImageModels.map((model) => (
                <Button
                  key={model.id}
                  variant={selectedImageModel === model.model ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedImageModel(model.model)}
                  className={selectedImageModel === model.model ? 'bg-pink-600' : 'border-slate-700'}
                >
                  <Icon name={model.icon as any} size={14} className="mr-1" />
                  {model.name.split(' ')[1]}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-white mb-2 block">Описание изображения</label>
            <Textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="A beautiful sunset over mountains, photorealistic..."
              className="bg-slate-800 border-slate-700 text-white min-h-24"
            />
          </div>

          <Button
            onClick={testImage}
            disabled={loadingImage}
            className="w-full bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700"
          >
            {loadingImage ? (
              <>
                <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                Генерация...
              </>
            ) : (
              <>
                <Icon name="Sparkles" size={16} className="mr-2" />
                Сгенерировать
              </>
            )}
          </Button>

          {imageUrl && (
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <img
                src={imageUrl}
                alt="Generated"
                className="w-full rounded-lg"
                onError={() => toast.error('Ошибка загрузки изображения')}
              />
              <a
                href={imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-400 hover:underline mt-2 block"
              >
                Открыть в новой вкладке
              </a>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AITestTab;