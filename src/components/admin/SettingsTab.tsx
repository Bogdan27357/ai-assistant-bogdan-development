import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';

const SettingsTab = () => {
  return (
    <Card className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <h3 className="text-2xl font-bold text-white mb-6">Общие настройки</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
          <div>
            <h4 className="text-white font-semibold mb-1">Автосохранение чата</h4>
            <p className="text-sm text-gray-400">Сохранять историю переписки автоматически</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
          <div>
            <h4 className="text-white font-semibold mb-1">Темная тема</h4>
            <p className="text-sm text-gray-400">Использовать темное оформление интерфейса</p>
          </div>
          <Switch defaultChecked />
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50">
          <div>
            <h4 className="text-white font-semibold mb-1">Уведомления</h4>
            <p className="text-sm text-gray-400">Получать уведомления о новых сообщениях</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>
    </Card>
  );
};

export default SettingsTab;
