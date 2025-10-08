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

interface SessionListProps {
  sessions: ChatSession[];
  selectedSession: ChatSession | null;
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onExportSession: (session: ChatSession, format: 'txt' | 'md' | 'json') => void;
}

const SessionList = ({
  sessions,
  selectedSession,
  onSelectSession,
  onDeleteSession,
  onExportSession
}: SessionListProps) => {
  return (
    <Card className="bg-slate-900/50 border-slate-700 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">Диалоги</h3>
        <Badge variant="secondary">{sessions.length}</Badge>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="MessageSquareX" size={48} className="text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500">Диалоги не найдены</p>
          </div>
        ) : (
          sessions.map(session => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedSession?.id === session.id
                  ? 'bg-violet-900/40 ring-2 ring-violet-500'
                  : 'bg-slate-800 hover:bg-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-sm font-medium text-white truncate flex-1">
                  {session.title}
                </h4>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                      <Icon name="MoreVertical" size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-800 border-slate-700">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportSession(session, 'txt');
                      }}
                      className="text-white hover:bg-slate-700"
                    >
                      <Icon name="FileText" size={14} className="mr-2" />
                      TXT
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportSession(session, 'md');
                      }}
                      className="text-white hover:bg-slate-700"
                    >
                      <Icon name="FileCode" size={14} className="mr-2" />
                      Markdown
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportSession(session, 'json');
                      }}
                      className="text-white hover:bg-slate-700"
                    >
                      <Icon name="Braces" size={14} className="mr-2" />
                      JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteSession(session.id);
                      }}
                      className="text-red-400 hover:bg-slate-700"
                    >
                      <Icon name="Trash2" size={14} className="mr-2" />
                      Удалить
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {session.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>{session.messages.length} сообщений</span>
                <span>{session.updatedAt.toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default SessionList;
