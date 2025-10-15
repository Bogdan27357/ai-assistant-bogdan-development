import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface VoiceSettingsProps {
  voiceSettings: {
    enabled: boolean;
    welcomeMessage: string;
    agentId: string;
    voiceModel: string;
  };
  setVoiceSettings: (settings: any) => void;
  onSave: () => void;
}

const VoiceSettings = ({ voiceSettings, setVoiceSettings, onSave }: VoiceSettingsProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Настройки голосового помощника</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div>
            <Label className="text-white font-semibold">Включить голосового помощника</Label>
            <p className="text-sm text-slate-400">Показывать виджет на сайте</p>
          </div>
          <Switch
            checked={voiceSettings.enabled}
            onCheckedChange={checked => setVoiceSettings({ ...voiceSettings, enabled: checked })}
          />
        </div>

        <div>
          <Label htmlFor="welcomeMessage" className="text-white mb-2">Приветственное сообщение</Label>
          <Textarea
            id="welcomeMessage"
            value={voiceSettings.welcomeMessage}
            onChange={e => setVoiceSettings({ ...voiceSettings, welcomeMessage: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="agentId" className="text-white mb-2">ElevenLabs Agent ID</Label>
          <Input
            id="agentId"
            value={voiceSettings.agentId}
            onChange={e => setVoiceSettings({ ...voiceSettings, agentId: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="voiceModel" className="text-white mb-2">Модель голоса</Label>
          <Input
            id="voiceModel"
            value={voiceSettings.voiceModel}
            onChange={e => setVoiceSettings({ ...voiceSettings, voiceModel: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>

        <Button onClick={onSave} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Icon name="Save" size={18} className="mr-2" />
          Сохранить настройки помощника
        </Button>
      </div>
    </Card>
  );
};

export default VoiceSettings;
