import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Endpoint } from './types';

interface APIDocumentationProps {
  endpoints: Endpoint[];
  onSelectEndpoint: (id: string) => void;
}

const APIDocumentation = ({ endpoints, onSelectEndpoint }: APIDocumentationProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-white mb-4">Доступные Endpoints</h3>
        <div className="space-y-3">
          {endpoints.map(endpoint => (
            <div
              key={endpoint.id}
              className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors cursor-pointer"
              onClick={() => onSelectEndpoint(endpoint.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-emerald-600">{endpoint.method}</Badge>
                    <code className="text-emerald-400 font-mono text-sm">{endpoint.path}</code>
                  </div>
                  <h4 className="text-white font-medium mb-1">{endpoint.name}</h4>
                  <p className="text-sm text-slate-400">{endpoint.description}</p>
                </div>
                <Icon name="ChevronRight" size={20} className="text-slate-500 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="Info" size={20} className="text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-white font-medium mb-1">Аутентификация</p>
            <p className="text-xs text-slate-300">
              Все запросы требуют заголовок <code className="bg-slate-800 px-1">Authorization: Bearer YOUR_API_KEY</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;
