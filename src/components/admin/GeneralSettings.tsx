import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

interface GeneralSettingsProps {
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

const GeneralSettings = ({ siteSettings, setSiteSettings, onSave }: GeneralSettingsProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700 p-6">
      <h2 className="text-xl font-bold text-white mb-6">Основные настройки сайта</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="siteName" className="text-white mb-2">Название сайта</Label>
          <Input
            id="siteName"
            value={siteSettings.siteName}
            onChange={e => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="tagline" className="text-white mb-2">Слоган</Label>
          <Input
            id="tagline"
            value={siteSettings.tagline}
            onChange={e => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-white mb-2">Описание (для SEO)</Label>
          <Textarea
            id="description"
            value={siteSettings.description}
            onChange={e => setSiteSettings({ ...siteSettings, description: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white min-h-[100px]"
          />
        </div>

        <div>
          <Label htmlFor="heroButton" className="text-white mb-2">Текст главной кнопки</Label>
          <Input
            id="heroButton"
            value={siteSettings.heroButtonText}
            onChange={e => setSiteSettings({ ...siteSettings, heroButtonText: e.target.value })}
            className="bg-slate-800 border-slate-600 text-white"
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div>
            <Label className="text-white font-semibold">Показывать футер</Label>
            <p className="text-sm text-slate-400">Отображение нижней части сайта</p>
          </div>
          <Switch
            checked={siteSettings.showFooter}
            onCheckedChange={checked => setSiteSettings({ ...siteSettings, showFooter: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
          <div>
            <Label className="text-white font-semibold">Кнопка "Наверх"</Label>
            <p className="text-sm text-slate-400">Показывать кнопку прокрутки вверх</p>
          </div>
          <Switch
            checked={siteSettings.showScrollToTop}
            onCheckedChange={checked => setSiteSettings({ ...siteSettings, showScrollToTop: checked })}
          />
        </div>

        <Button onClick={onSave} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <Icon name="Save" size={18} className="mr-2" />
          Сохранить основные настройки
        </Button>
      </div>
    </Card>
  );
};

export default GeneralSettings;
