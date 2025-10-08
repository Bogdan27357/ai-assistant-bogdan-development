import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { APIKey } from './types';

interface APIKeyManagerProps {
  apiKeys: APIKey[];
  newKeyName: string;
  onNewKeyNameChange: (name: string) => void;
  onGenerateKey: () => void;
  onDeleteKey: (id: string) => void;
  onToggleKey: (id: string) => void;
  onCopyToClipboard: (text: string) => void;
}

const APIKeyManager = ({
  apiKeys,
  newKeyName,
  onNewKeyNameChange,
  onGenerateKey,
  onDeleteKey,
  onToggleKey,
  onCopyToClipboard
}: APIKeyManagerProps) => {
  return (
    <div className="space-y-6">
      <Card className="bg-slate-900/50 border-slate-700 p-6">
        <h3 className="text-lg font-bold text-white mb-4">API Ключи</h3>
        
        <div className="space-y-3 mb-4">
          <Input
            value={newKeyName}
            onChange={(e) => onNewKeyNameChange(e.target.value)}
            placeholder="Название ключа"
            className="bg-slate-800 border-slate-700"
          />
          <Button onClick={onGenerateKey} className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Icon name="Plus" size={16} className="mr-2" />
            Создать новый ключ
          </Button>
        </div>

        <div className="space-y-3">
          {apiKeys.map(key => (
            <div key={key.id} className="bg-slate-800 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="text-white font-medium mb-1">{key.name}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-xs text-emerald-400 font-mono bg-slate-900 px-2 py-1 rounded">
                      {key.key}
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onCopyToClipboard(key.key)}
                      className="h-6 w-6 p-0"
                    >
                      <Icon name="Copy" size={12} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{key.requests.toLocaleString()} запросов</span>
                    <span>•</span>
                    <span>{key.created.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <Switch
                    checked={key.isActive}
                    onCheckedChange={() => onToggleKey(key.id)}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteKey(key.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Icon name="Trash2" size={14} className="text-red-400" />
                  </Button>
                </div>
              </div>
              <Badge variant={key.isActive ? "default" : "secondary"} className="text-xs">
                {key.isActive ? '🟢 Активен' : '🔴 Отключен'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30 p-6">
        <h3 className="text-lg font-bold text-white mb-3">📊 Лимиты</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex justify-between">
            <span>Запросов в день:</span>
            <span className="font-semibold">10,000</span>
          </div>
          <div className="flex justify-between">
            <span>Использовано:</span>
            <span className="font-semibold">2,340</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '23.4%' }} />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default APIKeyManager;
