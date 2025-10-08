import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import SessionFilters from './chat-history/SessionFilters';
import SessionList from './chat-history/SessionList';
import SessionDetail from './chat-history/SessionDetail';
import { ChatSession, SortOption, ExportFormat } from './chat-history/types';
import {
  loadSessionsFromStorage,
  saveSessionsToStorage,
  getDemoSessions,
  exportSessionToFile,
  exportAllSessions,
  getAllTags,
  filterAndSortSessions
} from './chat-history/utils';
import { perform_sql_query } from '@/lib/api';

const ChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const saved = loadSessionsFromStorage();
    if (saved) {
      setSessions(saved);
    } else {
      const demoSessions = getDemoSessions();
      setSessions(demoSessions);
      saveSessionsToStorage(demoSessions);
    }
  };

  const deleteSession = (sessionId: string) => {
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    saveSessionsToStorage(updated);
    if (selectedSession?.id === sessionId) {
      setSelectedSession(null);
    }
    toast.success('Диалог удален');
  };

  const exportSession = (session: ChatSession, format: ExportFormat) => {
    exportSessionToFile(session, format);
  };

  const handleExportAll = () => {
    exportAllSessions(sessions);
  };

  const clearAllHistory = () => {
    if (confirm('Удалить всю историю диалогов? Это действие необратимо.')) {
      setSessions([]);
      setSelectedSession(null);
      localStorage.removeItem('chat_sessions');
      toast.success('История очищена');
    }
  };

  const availableTags = getAllTags(sessions);
  const filteredSessions = filterAndSortSessions(sessions, searchQuery, filterTag, sortBy);

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
            <SessionFilters
              searchQuery={searchQuery}
              filterTag={filterTag}
              sortBy={sortBy}
              availableTags={availableTags}
              onSearchChange={setSearchQuery}
              onFilterTagChange={setFilterTag}
              onSortByChange={setSortBy}
              onExportAll={handleExportAll}
              onClearAll={clearAllHistory}
            />

            <SessionList
              sessions={filteredSessions}
              selectedSession={selectedSession}
              onSelectSession={setSelectedSession}
              onDeleteSession={deleteSession}
              onExportSession={exportSession}
            />
          </div>

          <div className="lg:col-span-2">
            <SessionDetail
              session={selectedSession}
              onExportSession={exportSession}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;