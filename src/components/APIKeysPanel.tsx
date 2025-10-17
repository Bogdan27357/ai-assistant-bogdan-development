import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { apiServices, type APIService } from '@/data/apiServices';

interface APIKeysPanelProps {
  darkMode: boolean;
}

const APIKeysPanel = ({ darkMode }: APIKeysPanelProps) => {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedKeys = localStorage.getItem('api_keys');
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    }
  }, []);

  const handleSaveKey = (serviceId: string, key: string) => {
    const newKeys = { ...apiKeys, [serviceId]: key };
    setApiKeys(newKeys);
    localStorage.setItem('api_keys', JSON.stringify(newKeys));
  };

  const handleDeleteKey = (serviceId: string) => {
    const newKeys = { ...apiKeys };
    delete newKeys[serviceId];
    setApiKeys(newKeys);
    localStorage.setItem('api_keys', JSON.stringify(newKeys));
  };

  const toggleShowKey = (serviceId: string) => {
    setShowKey(prev => ({ ...prev, [serviceId]: !prev[serviceId] }));
  };

  const filteredServices = selectedCategory === 'all' 
    ? apiServices 
    : apiServices.filter(s => s.category === selectedCategory);

  const categories = [
    { id: 'all', name: 'Все', icon: 'Grid3x3' },
    { id: 'text', name: 'Текст', icon: 'FileText' },
    { id: 'image', name: 'Изображения', icon: 'Image' },
    { id: 'video', name: 'Видео', icon: 'Video' },
    { id: 'audio', name: 'Аудио', icon: 'Music' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Управление API ключами
          </h1>
          <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Добавьте ключи для работы с нейросетями
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              className={selectedCategory === cat.id 
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white' 
                : darkMode ? 'text-slate-300 border-slate-700 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'}
            >
              <Icon name={cat.icon} size={18} className="mr-2" />
              {cat.name}
            </Button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`p-6 rounded-xl border ${
                darkMode 
                  ? 'bg-slate-900/50 border-slate-800' 
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {service.name}
                    </h3>
                    <span className={`text-sm px-2 py-1 rounded ${
                      darkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {service.provider}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {service.description}
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    💰 {service.pricing}
                  </p>
                </div>

                <div className="flex flex-col gap-2 lg:w-96">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className={darkMode ? 'border-slate-700 text-slate-300' : ''}
                      onClick={() => window.open(service.apiUrl, '_blank')}
                    >
                      <Icon name="Key" size={16} className="mr-2" />
                      Получить ключ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className={darkMode ? 'border-slate-700 text-slate-300' : ''}
                      onClick={() => window.open(service.docsUrl, '_blank')}
                    >
                      <Icon name="Book" size={16} className="mr-2" />
                      Документация
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type={showKey[service.id] ? 'text' : 'password'}
                        placeholder={`Введите ${service.keyName}`}
                        value={apiKeys[service.id] || ''}
                        onChange={(e) => handleSaveKey(service.id, e.target.value)}
                        className={darkMode ? 'bg-slate-800 border-slate-700 text-white' : ''}
                      />
                      <button
                        onClick={() => toggleShowKey(service.id)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                          darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        <Icon name={showKey[service.id] ? 'EyeOff' : 'Eye'} size={16} />
                      </button>
                    </div>
                    {apiKeys[service.id] && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={() => handleDeleteKey(service.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    )}
                  </div>
                  
                  {apiKeys[service.id] && (
                    <p className="text-xs text-green-500 flex items-center gap-1">
                      <Icon name="CheckCircle" size={14} />
                      Ключ сохранён
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={`mt-8 p-6 rounded-xl border ${
          darkMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
        }`}>
          <div className="flex gap-3">
            <Icon name="AlertCircle" size={24} className="text-amber-500 flex-shrink-0" />
            <div>
              <h4 className={`font-semibold mb-2 ${darkMode ? 'text-amber-400' : 'text-amber-900'}`}>
                Безопасность
              </h4>
              <p className={`text-sm ${darkMode ? 'text-amber-300/80' : 'text-amber-800'}`}>
                API ключи хранятся локально в вашем браузере и не передаются на сервер. 
                Никогда не делитесь ключами с другими людьми.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIKeysPanel;
