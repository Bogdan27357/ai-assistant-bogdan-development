import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { CodeLanguage } from './types';
import { getCodeExample } from './codeExamples';

interface CodeExamplesProps {
  selectedEndpoint: string;
  selectedLanguage: CodeLanguage;
  apiKey: string;
  onLanguageChange: (language: CodeLanguage) => void;
  onCopyToClipboard: (text: string) => void;
}

const CodeExamples = ({
  selectedEndpoint,
  selectedLanguage,
  apiKey,
  onLanguageChange,
  onCopyToClipboard
}: CodeExamplesProps) => {
  const codeExample = getCodeExample(selectedEndpoint, selectedLanguage, apiKey);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <Button
          variant={selectedLanguage === 'curl' ? 'default' : 'outline'}
          onClick={() => onLanguageChange('curl')}
          size="sm"
        >
          cURL
        </Button>
        <Button
          variant={selectedLanguage === 'javascript' ? 'default' : 'outline'}
          onClick={() => onLanguageChange('javascript')}
          size="sm"
        >
          JavaScript
        </Button>
        <Button
          variant={selectedLanguage === 'python' ? 'default' : 'outline'}
          onClick={() => onLanguageChange('python')}
          size="sm"
        >
          Python
        </Button>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-white">Пример кода</label>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onCopyToClipboard(codeExample)}
          >
            <Icon name="Copy" size={14} className="mr-1" />
            Копировать
          </Button>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
          <pre className="text-xs text-slate-300 font-mono">
            {codeExample}
          </pre>
        </div>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Icon name="AlertTriangle" size={20} className="text-yellow-400 mt-0.5" />
          <div>
            <p className="text-sm text-white font-medium mb-1">Важно</p>
            <p className="text-xs text-slate-300">
              Никогда не публикуйте API ключи в публичных репозиториях.
              Используйте переменные окружения.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeExamples;
