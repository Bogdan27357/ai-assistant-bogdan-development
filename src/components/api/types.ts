export interface APIKey {
  id: string;
  name: string;
  key: string;
  created: Date;
  lastUsed?: Date;
  requests: number;
  isActive: boolean;
}

export interface Endpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
}

export type CodeLanguage = 'curl' | 'javascript' | 'python';
