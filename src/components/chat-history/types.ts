export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  model: string;
}

export type ExportFormat = 'txt' | 'json' | 'pdf' | 'md';
export type SortOption = 'date' | 'title';
