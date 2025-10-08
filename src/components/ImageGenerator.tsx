import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: number;
  favorite: boolean;
  style: string;
  size: string;
}

interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  prompt: string;
  icon: string;
}

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [imageSize, setImageSize] = useState('1024x1024');
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const styles = [
    { id: 'realistic', name: 'Реалистичный', icon: 'Camera' },
    { id: 'anime', name: 'Аниме', icon: 'Sparkles' },
    { id: 'digital-art', name: 'Цифровое искусство', icon: 'Palette' },
    { id: 'oil-painting', name: 'Масляная живопись', icon: 'Brush' },
    { id: '3d-render', name: '3D рендер', icon: 'Box' },
    { id: 'pixel-art', name: 'Пиксель-арт', icon: 'Grid3x3' },
    { id: 'watercolor', name: 'Акварель', icon: 'Droplet' },
    { id: 'sketch', name: 'Скетч', icon: 'Pencil' }
  ];

  const sizes = [
    { id: '512x512', name: '512×512 (быстро)' },
    { id: '768x768', name: '768×768 (средне)' },
    { id: '1024x1024', name: '1024×1024 (качество)' },
    { id: '1024x768', name: '1024×768 (пейзаж)' },
    { id: '768x1024', name: '768×1024 (портрет)' }
  ];

  const promptTemplates: PromptTemplate[] = [
    { id: '1', name: 'Портрет', category: 'Люди', prompt: 'professional portrait photo, beautiful lighting, detailed face, high quality', icon: 'User' },
    { id: '2', name: 'Пейзаж', category: 'Природа', prompt: 'beautiful landscape, mountains, sunset, dramatic sky, highly detailed', icon: 'Mountain' },
    { id: '3', name: 'Город', category: 'Архитектура', prompt: 'cyberpunk city, neon lights, night scene, futuristic buildings, rain', icon: 'Building' },
    { id: '4', name: 'Фэнтези', category: 'Фантастика', prompt: 'fantasy landscape, magical forest, mystical atmosphere, ethereal lighting', icon: 'Wand2' },
    { id: '5', name: 'Животное', category: 'Природа', prompt: 'cute animal, detailed fur, professional photography, natural habitat', icon: 'Rabbit' },
    { id: '6', name: 'Абстракция', category: 'Искусство', prompt: 'abstract art, vibrant colors, geometric shapes, modern design', icon: 'Shapes' },
    { id: '7', name: 'Космос', category: 'Фантастика', prompt: 'space scene, nebula, stars, planets, cosmic colors, high detail', icon: 'Rocket' },
    { id: '8', name: 'Еда', category: 'Предметы', prompt: 'food photography, professional lighting, appetizing, high detail', icon: 'UtensilsCrossed' }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('image_history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const saveToHistory = (image: GeneratedImage) => {
    const updated = [image, ...history];
    setHistory(updated);
    localStorage.setItem('image_history', JSON.stringify(updated));
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Введите описание изображения');
      return;
    }

    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const demoImages = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4',
        'https://images.unsplash.com/photo-1635322966219-b75ed372eb01',
        'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e',
        'https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d'
      ];

      const randomImage = demoImages[Math.floor(Math.random() * demoImages.length)];

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: prompt,
        imageUrl: randomImage,
        timestamp: Date.now(),
        favorite: false,
        style: selectedStyle,
        size: imageSize
      };

      saveToHistory(newImage);
      setSelectedImage(newImage);
      toast.success('Изображение создано!');
    } catch (error) {
      toast.error('Ошибка генерации изображения');
    } finally {
      setGenerating(false);
    }
  };

  const toggleFavorite = (id: string) => {
    const updated = history.map(img =>
      img.id === id ? { ...img, favorite: !img.favorite } : img
    );
    setHistory(updated);
    localStorage.setItem('image_history', JSON.stringify(updated));
  };

  const deleteImage = (id: string) => {
    const updated = history.filter(img => img.id !== id);
    setHistory(updated);
    localStorage.setItem('image_history', JSON.stringify(updated));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
    toast.success('Изображение удалено');
  };

  const downloadImage = (image: GeneratedImage) => {
    const link = document.createElement('a');
    link.href = image.imageUrl;
    link.download = `generated-${image.id}.jpg`;
    link.click();
    toast.success('Изображение скачано!');
  };

  const useTemplate = (template: PromptTemplate) => {
    setPrompt(template.prompt);
    toast.success(`Шаблон "${template.name}" применен`);
  };

  const clearHistory = () => {
    if (confirm('Очистить всю историю генераций?')) {
      setHistory([]);
      localStorage.removeItem('image_history');
      setSelectedImage(null);
      toast.success('История очищена');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-24 pb-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6 backdrop-blur-sm">
            <Icon name="Image" size={20} className="text-purple-400" />
            <span className="text-sm font-medium bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
              AI Генератор изображений
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Создавайте шедевры с ИИ
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Превратите текст в потрясающие изображения за секунды
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Icon name="Wand2" size={24} className="text-purple-400" />
                Создать изображение
              </h2>

              <div className="space-y-4">
                <div>
                  <Label className="text-white mb-2">Описание изображения</Label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Опишите что вы хотите увидеть... Например: красивый закат над океаном, пальмы, яркие цвета"
                    className="bg-slate-800/50 border-slate-700 text-white min-h-[120px]"
                  />
                </div>

                <div>
                  <Label className="text-white mb-2">Негативный промпт (необязательно)</Label>
                  <Input
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="Что не должно быть на изображении..."
                    className="bg-slate-800/50 border-slate-700 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white mb-2">Стиль</Label>
                    <Select value={selectedStyle} onValueChange={setSelectedStyle}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        {styles.map(style => (
                          <SelectItem key={style.id} value={style.id} className="text-white">
                            {style.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-2">Размер</Label>
                    <Select value={imageSize} onValueChange={setImageSize}>
                      <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-700">
                        {sizes.map(size => (
                          <SelectItem key={size.id} value={size.id} className="text-white">
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={generating || !prompt}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-6 text-lg"
                >
                  {generating ? (
                    <>
                      <Icon name="Loader2" size={24} className="mr-2 animate-spin" />
                      Генерация...
                    </>
                  ) : (
                    <>
                      <Icon name="Sparkles" size={24} className="mr-2" />
                      Создать изображение
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {selectedImage && (
              <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">Результат</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleFavorite(selectedImage.id)}
                      variant="outline"
                      size="sm"
                      className="border-slate-700"
                    >
                      <Icon name={selectedImage.favorite ? "Heart" : "Heart"} size={18} className={selectedImage.favorite ? "text-red-500" : ""} />
                    </Button>
                    <Button
                      onClick={() => downloadImage(selectedImage)}
                      variant="outline"
                      size="sm"
                      className="border-slate-700"
                    >
                      <Icon name="Download" size={18} />
                    </Button>
                  </div>
                </div>
                <img
                  src={selectedImage.imageUrl}
                  alt={selectedImage.prompt}
                  className="w-full rounded-lg mb-4"
                />
                <p className="text-gray-400 text-sm">{selectedImage.prompt}</p>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-slate-700/50 backdrop-blur-xl">
              <Tabs defaultValue="templates" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-800/50">
                  <TabsTrigger value="templates">Шаблоны</TabsTrigger>
                  <TabsTrigger value="history">
                    История ({history.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="templates" className="space-y-2 max-h-[600px] overflow-y-auto">
                  {promptTemplates.map(template => (
                    <Card
                      key={template.id}
                      className="p-3 bg-slate-800/50 border-slate-700 hover:border-purple-500/50 cursor-pointer transition-all"
                      onClick={() => useTemplate(template)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shrink-0">
                          <Icon name={template.icon as any} size={20} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium text-sm">{template.name}</h4>
                          <p className="text-gray-500 text-xs">{template.category}</p>
                        </div>
                        <Icon name="ChevronRight" size={16} className="text-gray-500" />
                      </div>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="history" className="space-y-2 max-h-[600px] overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="text-center py-8">
                      <Icon name="ImageOff" size={48} className="text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-500">История пуста</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-gray-400">Всего: {history.length}</p>
                        <Button
                          onClick={clearHistory}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Icon name="Trash2" size={14} className="mr-1" />
                          Очистить
                        </Button>
                      </div>
                      {history.map(image => (
                        <Card
                          key={image.id}
                          className="p-2 bg-slate-800/50 border-slate-700 hover:border-purple-500/50 cursor-pointer transition-all"
                          onClick={() => setSelectedImage(image)}
                        >
                          <div className="flex gap-3">
                            <img
                              src={image.imageUrl}
                              alt={image.prompt}
                              className="w-16 h-16 rounded object-cover shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm truncate">{image.prompt}</p>
                              <p className="text-gray-500 text-xs">
                                {new Date(image.timestamp).toLocaleDateString('ru')}
                              </p>
                            </div>
                            <div className="flex flex-col gap-1">
                              {image.favorite && (
                                <Icon name="Heart" size={14} className="text-red-500" />
                              )}
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteImage(image.id);
                                }}
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                              >
                                <Icon name="X" size={14} className="text-gray-500" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </>
                  )}
                </TabsContent>
              </Tabs>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border-purple-500/30 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <Icon name="Lightbulb" size={20} className="text-purple-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-medium text-sm mb-1">Советы</h4>
                  <ul className="text-gray-300 text-xs space-y-1">
                    <li>• Используйте детальные описания</li>
                    <li>• Указывайте стиль и освещение</li>
                    <li>• Добавляйте качественные теги</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;
