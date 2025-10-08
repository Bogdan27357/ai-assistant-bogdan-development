import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { Endpoint } from './types';

interface APITesterProps {
  endpoints: Endpoint[];
  selectedEndpoint: string;
  testRequest: string;
  testResponse: string;
  onSelectEndpoint: (id: string) => void;
  onRequestChange: (value: string) => void;
  onTest: () => void;
}

const APITester = ({
  endpoints,
  selectedEndpoint,
  testRequest,
  testResponse,
  onSelectEndpoint,
  onRequestChange,
  onTest
}: APITesterProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium text-white mb-2 block">Endpoint</label>
        <select
          value={selectedEndpoint}
          onChange={(e) => onSelectEndpoint(e.target.value)}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white"
        >
          {endpoints.map(ep => (
            <option key={ep.id} value={ep.id}>
              {ep.method} {ep.path}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-white mb-2 block">Тело запроса (JSON)</label>
        <Textarea
          value={testRequest}
          onChange={(e) => onRequestChange(e.target.value)}
          placeholder='{\n  "message": "Привет!",\n  "model": "gpt-4"\n}'
          className="bg-slate-800 border-slate-700 font-mono text-sm min-h-32"
        />
      </div>

      <Button onClick={onTest} className="w-full bg-emerald-600 hover:bg-emerald-700">
        <Icon name="Play" size={16} className="mr-2" />
        Отправить запрос
      </Button>

      {testResponse && (
        <div>
          <label className="text-sm font-medium text-white mb-2 block">Ответ</label>
          <div className="bg-slate-800 rounded-lg p-4 max-h-64 overflow-auto scrollbar-thin">
            <pre className="text-xs text-emerald-400 font-mono">
              {testResponse}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default APITester;
