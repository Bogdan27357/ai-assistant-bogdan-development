import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const AnalyticsTab = () => {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="p-6 bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 border-indigo-700/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Icon name="MessageSquare" size={24} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Всего запросов</p>
            <p className="text-3xl font-bold text-white">1,234</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-900/50 to-purple-800/50 border-purple-700/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Icon name="Clock" size={24} className="text-purple-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Среднее время ответа</p>
            <p className="text-3xl font-bold text-white">1.2с</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 border-emerald-700/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Icon name="TrendingUp" size={24} className="text-emerald-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Точность ответов</p>
            <p className="text-3xl font-bold text-white">98%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsTab;
