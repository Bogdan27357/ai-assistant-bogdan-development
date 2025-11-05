import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface SystemPromptCardProps {
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
}

const SystemPromptCard = ({ systemPrompt, onSystemPromptChange }: SystemPromptCardProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Icon name="MessageSquare" size={24} />
          Системный промпт
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="systemPrompt" className="text-white mb-2">
          Инструкции для ИИ-ассистента
        </Label>
        <Textarea
          id="systemPrompt"
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          className="bg-slate-800 border-slate-600 text-white min-h-[200px] font-mono text-sm"
          placeholder="Введите системный промпт для настройки поведения ассистента..."
        />
      </CardContent>
    </Card>
  );
};

export default SystemPromptCard;
