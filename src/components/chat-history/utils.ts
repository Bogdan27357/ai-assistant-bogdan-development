import { ChatSession, ExportFormat } from './types';
import { toast } from 'sonner';

export const loadSessionsFromStorage = (): ChatSession[] | null => {
  const saved = localStorage.getItem('chat_sessions');
  if (saved) {
    const parsed = JSON.parse(saved);
    return parsed.map((s: any) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
      messages: s.messages.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }))
    }));
  }
  return null;
};

export const saveSessionsToStorage = (sessions: ChatSession[]) => {
  localStorage.setItem('chat_sessions', JSON.stringify(sessions));
};

export const getDemoSessions = (): ChatSession[] => {
  return [
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
};

export const exportSessionToFile = (session: ChatSession, format: ExportFormat) => {
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

export const exportAllSessions = (sessions: ChatSession[]) => {
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

export const getAllTags = (sessions: ChatSession[]): string[] => {
  const tags = new Set<string>();
  sessions.forEach(s => s.tags.forEach(t => tags.add(t)));
  return Array.from(tags);
};

export const filterAndSortSessions = (
  sessions: ChatSession[],
  searchQuery: string,
  filterTag: string,
  sortBy: 'date' | 'title'
): ChatSession[] => {
  return sessions
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
};
