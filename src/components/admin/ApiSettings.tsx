import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const ApiSettings = () => {
  const [apiKeys, setApiKeys] = useState({
    elevenlabsKey: '',
    openrouterKey: '',
  });

  const handleUpdateApiKey = async (keyType: 'elevenlabs' | 'openrouter') => {
    const keyValue = keyType === 'elevenlabs' ? apiKeys.elevenlabsKey : apiKeys.openrouterKey;
    
    if (!keyValue.trim()) {
      toast.error('Введите API ключ');
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/b0e342c5-4500-4f08-b50e-c4ce3a3e4437', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key_type: keyType,
          api_key: keyValue
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success(`${keyType === 'elevenlabs' ? 'ElevenLabs' : 'OpenRouter'} API ключ обновлён`);
        if (keyType === 'elevenlabs') {
          setApiKeys({ ...apiKeys, elevenlabsKey: '' });
        } else {
          setApiKeys({ ...apiKeys, openrouterKey: '' });
        }
      } else {
        toast.error(data.error || 'Ошибка обновления ключа');
      }
    } catch (error) {
      toast.error('Ошибка соединения с сервером');
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Управление API ключами</h2>
      
      <div className="space-y-6">
        <div className="p-4 bg-amber-900/20 border border-amber-700/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Icon name="AlertTriangle" size={20} className="text-amber-400 mt-0.5" />
            <div>
              <p className="text-amber-200 text-sm font-semibold mb-1">Важная информация о безопасности</p>
              <p className="text-amber-300/80 text-xs">
                API ключи хранятся в защищённой базе данных. После обновления поле очищается автоматически.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="elevenlabsKey" className="text-white mb-2 flex items-center gap-2">
              <Icon name="Mic" size={16} />
              ElevenLabs API Key
            </Label>
            <div className="flex gap-2">
              <Input
                id="elevenlabsKey"
                type="password"
                value={apiKeys.elevenlabsKey}
                onChange={e => setApiKeys({ ...apiKeys, elevenlabsKey: e.target.value })}
                placeholder="sk_*********************"
                className="bg-slate-800 border-slate-600 text-white flex-1"
              />
              <Button 
                onClick={() => handleUpdateApiKey('elevenlabs')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Icon name="Upload" size={18} className="mr-2" />
                Обновить
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-1">Используется для голосового помощника</p>
          </div>

          <div>
            <Label htmlFor="openrouterKey" className="text-white mb-2 flex items-center gap-2">
              <Icon name="MessageSquare" size={16} />
              OpenRouter API Key
            </Label>
            <div className="flex gap-2">
              <Input
                id="openrouterKey"
                type="password"
                value={apiKeys.openrouterKey}
                onChange={e => setApiKeys({ ...apiKeys, openrouterKey: e.target.value })}
                placeholder="sk-or-v1-*********************"
                className="bg-slate-800 border-slate-600 text-white flex-1"
              />
              <Button 
                onClick={() => handleUpdateApiKey('openrouter')}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <Icon name="Upload" size={18} className="mr-2" />
                Обновить
              </Button>
            </div>
            <p className="text-xs text-slate-400 mt-1">Используется для чат-бота</p>
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 rounded-lg">
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Icon name="Info" size={16} className="text-blue-400" />
            Где взять API ключи?
          </h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <span><strong>ElevenLabs:</strong> elevenlabs.io → Settings → API Keys</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 font-bold">•</span>
              <span><strong>OpenRouter:</strong> openrouter.ai → Keys → Create Key</span>
            </li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default ApiSettings;
