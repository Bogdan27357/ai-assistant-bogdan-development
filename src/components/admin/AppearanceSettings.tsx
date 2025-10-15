import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface AppearanceSettingsProps {
  siteSettings: {
    siteName: string;
    tagline: string;
    description: string;
    heroButtonText: string;
    darkMode: boolean;
    showFooter: boolean;
    showScrollToTop: boolean;
    mainColor: string;
    accentColor: string;
  };
  setSiteSettings: (settings: any) => void;
  onSave: () => void;
}

const AppearanceSettings = ({ siteSettings, setSiteSettings, onSave }: AppearanceSettingsProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Настройки внешнего вида</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div>
            <Label className="text-white font-semibold">Тёмная тема</Label>
            <p className="text-sm text-slate-400">Включить тёмный режим по умолчанию</p>
          </div>
          <Switch
            checked={siteSettings.darkMode}
            onCheckedChange={checked => setSiteSettings({ ...siteSettings, darkMode: checked })}
          />
        </div>

        <div>
          <Label htmlFor="mainColor" className="text-white mb-2">Основной цвет</Label>
          <div className="flex gap-3">
            <Input
              id="mainColor"
              type="color"
              value={siteSettings.mainColor}
              onChange={e => setSiteSettings({ ...siteSettings, mainColor: e.target.value })}
              className="w-20 h-12 bg-slate-800 border-slate-600"
            />
            <Input
              value={siteSettings.mainColor}
              onChange={e => setSiteSettings({ ...siteSettings, mainColor: e.target.value })}
              className="flex-1 bg-slate-800 border-slate-600 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="accentColor" className="text-white mb-2">Акцентный цвет</Label>
          <div className="flex gap-3">
            <Input
              id="accentColor"
              type="color"
              value={siteSettings.accentColor}
              onChange={e => setSiteSettings({ ...siteSettings, accentColor: e.target.value })}
              className="w-20 h-12 bg-slate-800 border-slate-600"
            />
            <Input
              value={siteSettings.accentColor}
              onChange={e => setSiteSettings({ ...siteSettings, accentColor: e.target.value })}
              className="flex-1 bg-slate-800 border-slate-600 text-white"
            />
          </div>
        </div>

        <Button onClick={onSave} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Icon name="Save" size={18} className="mr-2" />
          Сохранить настройки вида
        </Button>
      </div>
    </Card>
  );
};

export default AppearanceSettings;
