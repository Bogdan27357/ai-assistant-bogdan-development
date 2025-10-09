import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ApiConfig {
  enabled: boolean;
  apiKey: string;
}

interface Model {
  id: string;
  name: string;
  provider: string;
  icon: string;
  color: string;
  description: string;
  status: string;
  features: string[];
  apiDocsUrl?: string;
}

interface ApiKeyCardProps {
  model: Model;
  index: number;
  config: ApiConfig;
  testing: boolean;
  testResult: { success: boolean; message: string } | null;
  onToggle: (modelId: string) => void;
  onSaveKey: (modelId: string) => void;
  onUpdateApiKey: (modelId: string, value: string) => void;
  onTestApi: (modelId: string) => void;
}

const ApiKeyCard = ({
  model,
  index,
  config,
  testing,
  testResult,
  onToggle,
  onSaveKey,
  onUpdateApiKey,
  onTestApi
}: ApiKeyCardProps) => {
  return (
    <Card 
      className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 animate-scale-in"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${model.color} flex items-center justify-center cursor-help`}>
                  <Icon name={model.icon as any} size={28} className="text-white" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="bg-slate-800 border-slate-700 max-w-xs">
                <p className="text-sm font-semibold text-white mb-1">{model.name}</p>
                <p className="text-xs text-gray-400 mb-2">{model.description}</p>
                <div className="flex flex-wrap gap-1">
                  {model.features.map((feature, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 rounded bg-slate-700/50 text-gray-300">
                      {feature}
                    </span>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div>
            <p className="text-xs text-gray-500 mb-1">{model.provider}</p>
            <h3 className="text-xl font-bold text-white mb-1">{model.name}</h3>
            <p className="text-gray-400 text-xs mb-2">{model.description}</p>
            <div className="flex flex-wrap gap-2">
              {model.features.map((feature, idx) => (
                <span key={idx} className="text-xs px-2 py-1 rounded-md bg-slate-800/50 text-gray-400">
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="px-3 py-1 rounded-full text-xs font-semibold" style={{
            background: model.status === 'FREE' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)',
            color: model.status === 'FREE' ? '#10b981' : '#6366f1'
          }}>
            {model.status}
          </div>
          <div className="flex items-center gap-3">
            <Label htmlFor={`toggle-${model.id}`} className="text-sm text-gray-400">
              {config.enabled ? 'Включена' : 'Отключена'}
            </Label>
            <Switch
              id={`toggle-${model.id}`}
              checked={config.enabled}
              onCheckedChange={() => onToggle(model.id)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30">
          <p className="text-sm text-indigo-300">
            <Icon name="Info" size={14} className="inline mr-1" />
            Один ключ даёт доступ ко всем платным AI моделям на платформе
          </p>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor={`api-${model.id}`} className="text-white">
              API Ключ
            </Label>
            {model.apiDocsUrl && (
              <a 
                href={model.apiDocsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Icon name="ExternalLink" size={12} />
                Получить ключ
              </a>
            )}
          </div>
          <div className="flex gap-3">
            <Input
              id={`api-${model.id}`}
              type="password"
              value={config.apiKey}
              onChange={(e) => onUpdateApiKey(model.id, e.target.value)}
              placeholder="Введите API ключ..."
              className="bg-slate-800 border-slate-700 text-white"
            />
            <Button
              onClick={() => onSaveKey(model.id)}
              disabled={!config.apiKey}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Icon name="Save" size={18} className="mr-2" />
              Сохранить
            </Button>
            <Button
              onClick={() => onTestApi(model.id)}
              disabled={!config.apiKey || testing}
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-800"
            >
              {testing ? (
                <>
                  <Icon name="Loader" size={18} className="mr-2 animate-spin" />
                  Тестирую...
                </>
              ) : (
                <>
                  <Icon name="Play" size={18} className="mr-2" />
                  Тест
                </>
              )}
            </Button>
          </div>
        </div>

        {testResult && (
          <div className={`p-4 rounded-xl border ${
            testResult.success 
              ? 'bg-emerald-500/10 border-emerald-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <p className={`text-sm ${
              testResult.success ? 'text-emerald-300' : 'text-red-300'
            }`}>
              {testResult.message}
            </p>
          </div>
        )}



        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${config.enabled ? 'bg-emerald-400' : 'bg-gray-600'}`} />
          <span className="text-gray-400">
            Статус: {config.enabled ? 'Активна' : 'Неактивна'}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ApiKeyCard;