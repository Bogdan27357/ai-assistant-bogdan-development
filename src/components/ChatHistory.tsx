import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  model: string;
}

const ChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const saved = localStorage.getItem('chat_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      const sessionsWithDates = parsed.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      }));
      setSessions(sessionsWithDates);
    } else {
      const demoSessions: ChatSession[] = [
        {
          id: '1',
          title: 'Помощь с кодом Python',
          createdAt: new Date(Date.now() - 86400000 * 2),
          updatedAt: new Date(Date.now() - 86400000 * 2),
          tags: ['код', 'python'],
          model: 'GPT-4',
          messages: [
            {
              id: 'm1',
              role: 'user',
              content: 'Как сделать HTTP запрос в Python?',
              timestamp: new Date(Date.now() - 86400000 * 2)
            },
            {
              id: 'm2',
              role: 'assistant',
              content: 'Используйте библиотеку requests:\n\nimport requests\nresponse = requests.get("https://api.example.com")\nprint(response.json())',
              timestamp: new Date(Date.now() - 86400000 * 2)
            }
          ]
        },
        {
          id: '2',
          title: 'Планирование проекта',
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(Date.now() - 86400000),
          tags: ['бизнес', 'планирование'],
          model: 'Claude',
          messages: [
            {
              id: 'm3',
              role: 'user',
              content: 'Помоги составить план запуска стартапа',
              timestamp: new Date(Date.now() - 86400000)
            },
            {
              id: 'm4',
              role: 'assistant',
              content: '1. Исследование рынка\n2. MVP разработка\n3. Тестирование\n4. Запуск\n5. Маркетинг',
              timestamp: new Date(Date.now() - 86400000)
            }
          ]
        },
        {
          id: '3',
          title: 'Рецепт пиццы',
          createdAt: new Date(),
          updatedAt: new Date(),
          tags: ['кулинария'],
          model: 'GPT-3.5',
          messages: [
            {
              id: 'm5',
              role: 'user',
              content: 'Как приготовить домашнюю пиццу?',
              timestamp: new Date()
            }
          ]
        }
      ];
      setSessions(demoSessions);
      saveSessions(demoSessions);
    }
  };

  const saveSessions = (sessionsToSave: ChatSession[]) => {
    localStorage.setItem('chat_sessions', JSON.stringify(sessionsToSave));
  };

  const deleteSession = (sessionId: string) => {
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    saveSessions(updated);
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
    }
    toast.success('Диалог удален');
  };

  const exportSession = (session: ChatSession, format: 'txt' | 'json' | 'pdf' | 'md') => {
    let content = '';
    let mimeType = 'text/plain';
    const extension = format;

    switch (format) {
      case 'txt':
        content = `${session.title}\n${'-'.repeat(50)}\n\n`;
        session.messages.forEach(msg => {
          content += `[${msg.role.toUpperCase()}] ${msg.timestamp.toLocaleString()}\n`;
          content += `${msg.content}\n\n`;
        });
        break;

      case 'json':
        content = JSON.stringify(session, null, 2);
        mimeType = 'application/json';
        break;

      case 'md':
        content = `# ${session.title}\n\n`;
        content += `**Создано:** ${session.createdAt.toLocaleString()}\n`;
        content += `**Модель:** ${session.model}\n`;
        content += `**Теги:** ${session.tags.join(', ')}\n\n`;
        content += `---\n\n`;
        session.messages.forEach(msg => {
          content += `### ${msg.role === 'user' ? '👤 Пользователь' : '🤖 Ассистент'}\n`;
          content += `*${msg.timestamp.toLocaleString()}*\n\n`;
          content += `${msg.content}\n\n`;
        });
        break;

      case 'pdf':
        toast.info('PDF экспорт в разработке. Используйте Markdown.');
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/\s+/g, '_')}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Экспортировано в ${format.toUpperCase()}`);
  };

  const exportAll = (format: 'json') => {
    const content = JSON.stringify(sessions, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_chats_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Все диалоги экспортированы');
  };

  const getAllTags = () => {
    const tags = new Set<string>();
    sessions.forEach(s => s.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  };

  const filteredSessions = sessions
    .filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesTag = filterTag === 'all' || s.tags.includes(filterTag);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return b.updatedAt.getTime() - a.updatedAt.getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  const clearAllHistory = () => {
    if (confirm('Удалить всю историю диалогов? Это действие необратимо.')) {
      setSessions([]);
      setSelectedSession(null);
      localStorage.removeItem('chat_sessions');
      toast.success('История очищена');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Icon name="History" size={40} className="text-violet-400" />
            История диалогов
          </h1>
          <p className="text-slate-400">Просматривайте и экспортируйте прошлые беседы</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-slate-900/50 border-slate-700 p-4">
              <div className="space-y-3">
                <div className="relative">
                  <Icon
                    name="Search"
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск по диалогам..."
                    className="bg-slate-800 border-slate-700 pl-10"
                  />
                </div>

                <Select value={filterTag} onValueChange={setFilterTag}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue placeholder="Фильтр по тегам" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="all">Все теги</SelectItem>
                    {getAllTags().map(tag => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="date">По дате</SelectItem>
                    <SelectItem value="title">По названию</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    onClick={() => exportAll('json')}
                    className="flex-1 bg-violet-600 hover:bg-violet-700"
                    size="sm"
                  >
                    <Icon name="Download" size={14} className="mr-1" />
                    Экспорт всех
                  </Button>
                  <Button
                    onClick={clearAllHistory}
                    variant="destructive"
                    size="sm"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-medium">Диалоги</h3>
                <Badge variant="secondary">{filteredSessions.length}</Badge>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
                {filteredSessions.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="MessageSquareX" size={48} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-sm text-slate-500">Диалоги не найдены</p>
                  </div>
                ) : (
                  filteredSessions.map(session => (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
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
                                exportSession(session, 'txt');
                              }}
                              className="text-white hover:bg-slate-700"
                            >
                              <Icon name="FileText" size={14} className="mr-2" />
                              TXT
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                exportSession(session, 'md');
                              }}
                              className="text-white hover:bg-slate-700"
                            >
                              <Icon name="FileCode" size={14} className="mr-2" />
                              Markdown
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                exportSession(session, 'json');
                              }}
                              className="text-white hover:bg-slate-700"
                            >
                              <Icon name="Braces" size={14} className="mr-2" />
                              JSON
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSession(session.id);
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
          </div>

          <div className="lg:col-span-2">
            {selectedSession ? (
              <Card className="bg-slate-900/50 border-slate-700 p-6">
                <div className="mb-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedSession.title}</h2>
                      <div className="flex gap-4 text-sm text-slate-400">
                        <span>Модель: {selectedSession.model}</span>
                        <span>Создано: {selectedSession.createdAt.toLocaleString()}</span>
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
                          onClick={() => exportSession(selectedSession, 'txt')}
                          className="text-white hover:bg-slate-700 cursor-pointer"
                        >
                          <Icon name="FileText" size={16} className="mr-2" />
                          Экспорт в TXT
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => exportSession(selectedSession, 'md')}
                          className="text-white hover:bg-slate-700 cursor-pointer"
                        >
                          <Icon name="FileCode" size={16} className="mr-2" />
                          Экспорт в Markdown
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => exportSession(selectedSession, 'json')}
                          className="text-white hover:bg-slate-700 cursor-pointer"
                        >
                          <Icon name="Braces" size={16} className="mr-2" />
                          Экспорт в JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => exportSession(selectedSession, 'pdf')}
                          className="text-white hover:bg-slate-700 cursor-pointer"
                        >
                          <Icon name="FileText" size={16} className="mr-2" />
                          Экспорт в PDF (скоро)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedSession.tags.map(tag => (
                      <Badge key={tag} className="bg-violet-600">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin pr-2">
                  {selectedSession.messages.map(message => (
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
            ) : (
              <Card className="bg-slate-900/50 border-slate-700 p-12">
                <div className="text-center">
                  <Icon name="MessageSquare" size={64} className="text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Выберите диалог</h3>
                  <p className="text-slate-400">
                    Выберите диалог из списка слева для просмотра
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;