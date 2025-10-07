const API_URLS = {
  gemini: 'https://functions.poehali.dev/115c6576-1517-4c2e-a0a3-7f3b5958db06',
  llama: 'https://functions.poehali.dev/c158551d-e67d-4da9-a077-86c7aac3884f',
  gigachat: 'https://functions.poehali.dev/24b1e4ee-8de7-46f0-8c12-cc937d4e9a8e',
  saveMessage: 'https://functions.poehali.dev/6ff4ff7a-3331-40ce-ba16-7fd13be4e583',
  getHistory: 'https://functions.poehali.dev/aa1d79d8-9887-428e-87c1-cda250564de1',
  saveApiKey: 'https://functions.poehali.dev/b0e342c5-4500-4f08-b50e-c4ce3a3e4437',
  getApiKeys: 'https://functions.poehali.dev/e03e0273-c62e-43a4-876d-1580d86866fa'
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}

export const sendMessageToAI = async (
  model: 'gemini' | 'llama' | 'gigachat',
  message: string,
  sessionId: string
): Promise<string> => {
  const url = API_URLS[model];
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      session_id: sessionId
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get AI response');
  }

  const data = await response.json();
  return data.response;
};

export const saveMessageToDB = async (
  sessionId: string,
  model: string,
  role: 'user' | 'assistant',
  content: string
): Promise<void> => {
  await fetch(API_URLS.saveMessage, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      model,
      role,
      content
    })
  });
};

export const getChatHistory = async (sessionId: string): Promise<ChatMessage[]> => {
  const response = await fetch(`${API_URLS.getHistory}?session_id=${sessionId}`);
  
  if (!response.ok) {
    throw new Error('Failed to get chat history');
  }

  const data = await response.json();
  return data.messages;
};

export const generateSessionId = (): string => {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const saveApiKey = async (
  modelId: string,
  apiKey: string,
  enabled: boolean
): Promise<void> => {
  const response = await fetch(API_URLS.saveApiKey, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model_id: modelId,
      api_key: apiKey,
      enabled
    })
  });

  if (!response.ok) {
    throw new Error('Failed to save API key');
  }
};

export const getApiKeys = async (): Promise<Array<{model_id: string, enabled: boolean, has_key: boolean}>> => {
  const response = await fetch(API_URLS.getApiKeys);
  
  if (!response.ok) {
    throw new Error('Failed to get API keys');
  }

  const data = await response.json();
  return data.keys;
};