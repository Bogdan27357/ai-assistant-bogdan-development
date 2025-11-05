import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface ModelSelectionCardProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const ModelSelectionCard = ({ selectedModel, onModelChange }: ModelSelectionCardProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Icon name="Bot" size={24} />
          Модель ИИ
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedModel} onValueChange={onModelChange}>
          <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
            <SelectValue placeholder="Выберите модель" />
          </SelectTrigger>
          <SelectContent className="bg-slate-800 border-slate-700 text-white">
            <SelectItem value="anthropic/claude-3.5-sonnet">Anthropic: Claude 3.5 Sonnet</SelectItem>
            <SelectItem value="anthropic/claude-3-opus">Anthropic: Claude 3 Opus</SelectItem>
            <SelectItem value="anthropic/claude-3-sonnet">Anthropic: Claude 3 Sonnet</SelectItem>
            <SelectItem value="openai/gpt-4o">OpenAI: GPT-4o</SelectItem>
            <SelectItem value="openai/gpt-4o-mini">OpenAI: GPT-4o Mini</SelectItem>
            <SelectItem value="openai/o1-mini">OpenAI: O1 Mini</SelectItem>
            <SelectItem value="openai/o1-preview">OpenAI: O1 Preview</SelectItem>
            <SelectItem value="google/gemini-pro-1.5">Google: Gemini Pro 1.5</SelectItem>
            <SelectItem value="google/gemini-flash-1.5">Google: Gemini Flash 1.5</SelectItem>
            <SelectItem value="x-ai/grok-beta">xAI: Grok Beta</SelectItem>
            <SelectItem value="meta-llama/llama-3.1-8b-instruct">Meta: Llama 3.1 8B</SelectItem>
            <SelectItem value="meta-llama/llama-3.1-70b-instruct">Meta: Llama 3.1 70B</SelectItem>
            <SelectItem value="meta-llama/llama-3.1-405b-instruct">Meta: Llama 3.1 405B</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default ModelSelectionCard;
