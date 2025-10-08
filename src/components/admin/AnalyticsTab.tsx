import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useEffect, useState } from 'react';
import { perform_sql_query } from '@/lib/api';

interface ModelStats {
  model_id: string;
  total_messages: number;
  unique_sessions: number;
  first_used: string;
  last_used: string;
}

const AnalyticsTab = () => {
  const [stats, setStats] = useState<ModelStats[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const result = await perform_sql_query(`
        SELECT 
          model_id,
          COUNT(*) as total_messages,
          COUNT(DISTINCT session_id) as unique_sessions,
          MIN(created_at) as first_used,
          MAX(created_at) as last_used
        FROM chat_messages
        WHERE role = 'assistant'
        GROUP BY model_id
      `);
      
      setStats(result as ModelStats[]);
      const total = result.reduce((sum: number, stat: any) => sum + Number(stat.total_messages), 0);
      setTotalMessages(total);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const modelNames: Record<string, string> = {
    gemini: 'Gemini 2.0',
    llama: 'Llama 3.3',
    deepseek: 'DeepSeek V3',
    gigachat: 'GigaChat Pro'
  };

  const modelColors: Record<string, string> = {
    gemini: 'from-blue-900/50 to-blue-800/50 border-blue-700/50',
    llama: 'from-purple-900/50 to-purple-800/50 border-purple-700/50',
    deepseek: 'from-violet-900/50 to-violet-800/50 border-violet-700/50',
    gigachat: 'from-green-900/50 to-green-800/50 border-green-700/50'
  };

  const modelIconColors: Record<string, string> = {
    gemini: 'text-blue-400 bg-blue-500/20',
    llama: 'text-purple-400 bg-purple-500/20',
    deepseek: 'text-violet-400 bg-violet-500/20',
    gigachat: 'text-green-400 bg-green-500/20'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader" size={32} className="text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 border-indigo-700/50">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-indigo-500/20 flex items-center justify-center">
            <Icon name="MessageSquare" size={32} className="text-indigo-400" />
          </div>
          <div>
            <p className="text-sm text-gray-400">Всего ответов ИИ</p>
            <p className="text-4xl font-bold text-white">{totalMessages.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Общая статистика по всем моделям</p>
          </div>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {stats.map((stat) => (
          <Card 
            key={stat.model_id} 
            className={`p-6 bg-gradient-to-br ${modelColors[stat.model_id] || modelColors.gemini} animate-scale-in hover:scale-105 transition-transform duration-300`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${modelIconColors[stat.model_id] || modelIconColors.gemini} flex items-center justify-center`}>
                  <Icon name="Brain" size={24} className={modelIconColors[stat.model_id]?.split(' ')[0] || 'text-blue-400'} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{modelNames[stat.model_id] || stat.model_id}</h3>
                  <p className="text-xs text-gray-400">Модель ИИ</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Всего ответов</span>
                <span className="text-xl font-bold text-white">{Number(stat.total_messages).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Уникальных сессий</span>
                <span className="text-xl font-bold text-white">{Number(stat.unique_sessions).toLocaleString()}</span>
              </div>

              <div className="pt-3 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Первое использование</span>
                  <span className="text-gray-400">{new Date(stat.first_used).toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-gray-500">Последнее использование</span>
                  <span className="text-gray-400">{new Date(stat.last_used).toLocaleDateString('ru-RU')}</span>
                </div>
              </div>

              <div className="pt-3">
                <div className="w-full bg-slate-700/30 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      stat.model_id === 'gemini' ? 'from-blue-500 to-cyan-500' :
                      stat.model_id === 'llama' ? 'from-purple-500 to-pink-500' :
                      stat.model_id === 'deepseek' ? 'from-violet-500 to-purple-500' :
                      'from-green-500 to-emerald-500'
                    }`}
                    style={{ width: `${(Number(stat.total_messages) / totalMessages) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {((Number(stat.total_messages) / totalMessages) * 100).toFixed(1)}% от общего
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {stats.length === 0 && (
        <Card className="p-12 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700/50">
          <div className="text-center">
            <Icon name="BarChart3" size={48} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">Нет данных</h3>
            <p className="text-gray-500">Статистика появится после первых запросов к моделям</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsTab;
