import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChatSession } from './types';

interface SessionDetailProps {
  session: ChatSession | null;
  onExportSession: (session: ChatSession, format: 'txt' | 'md' | 'json' | 'pdf') => void;
}

const SessionDetail = ({ session, onExportSession }: SessionDetailProps) => {
  if (!session) {
    return (
      <Card className="bg-slate-900/50 border-slate-700 p-12">
        <div className="text-center">
          <Icon name="MessageSquare" size={64} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Выберите диалог</h3>
          <p className="text-slate-400">
            Выберите диалог из списка слева для просмотра
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700 p-6">
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{session.title}</h2>
            <div className="flex gap-4 text-sm text-slate-400">
              <span>Модель: {session.model}</span>
              <span>Создано: {session.createdAt.toLocaleString()}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-violet-600 hover:bg-violet-700">
                <Icon name="Download" size={16} className="mr-2" />
                Экспорт
                <Icon name="ChevronDown" size={14} className="ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700">
              <DropdownMenuItem
                onClick={() => onExportSession(session, 'txt')}
                className="text-white hover:bg-slate-700 cursor-pointer"
              >
                <Icon name="FileText" size={16} className="mr-2" />
                Экспорт в TXT
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExportSession(session, 'md')}
                className="text-white hover:bg-slate-700 cursor-pointer"
              >
                <Icon name="FileCode" size={16} className="mr-2" />
                Экспорт в Markdown
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExportSession(session, 'json')}
                className="text-white hover:bg-slate-700 cursor-pointer"
              >
                <Icon name="Braces" size={16} className="mr-2" />
                Экспорт в JSON
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onExportSession(session, 'pdf')}
                className="text-white hover:bg-slate-700 cursor-pointer"
              >
                <Icon name="FileText" size={16} className="mr-2" />
                Экспорт в PDF (скоро)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2">
          {session.tags.map(tag => (
            <Badge key={tag} className="bg-violet-600">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin pr-2">
        {session.messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-4 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-2xl p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  name={message.role === 'user' ? 'User' : 'Bot'}
                  size={16}
                  className="opacity-70"
                />
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleString()}
                </span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SessionDetail;
