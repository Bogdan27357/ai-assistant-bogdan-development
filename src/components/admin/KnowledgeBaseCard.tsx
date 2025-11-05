import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface KnowledgeBaseCardProps {
  knowledgeBase: string;
  onKnowledgeBaseChange: (value: string) => void;
}

const KnowledgeBaseCard = ({ knowledgeBase, onKnowledgeBaseChange }: KnowledgeBaseCardProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Icon name="Database" size={24} />
          База знаний
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Label htmlFor="knowledgeBase" className="text-white mb-2">
          Документация и справочная информация (поддерживает Markdown)
        </Label>
        <Textarea
          id="knowledgeBase"
          value={knowledgeBase}
          onChange={(e) => onKnowledgeBaseChange(e.target.value)}
          className="bg-slate-800 border-slate-600 text-white min-h-[300px] font-mono text-sm"
          placeholder="Введите базу знаний в формате Markdown..."
        />
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseCard;
