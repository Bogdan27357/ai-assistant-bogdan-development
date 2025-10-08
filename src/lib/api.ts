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
  model: 'gemini' | 'llama' | 'deepseek' | 'qwen' | 'mistral' | 'claude',
  message: string,
  sessionId: string,
  files?: { name: string; type: string; size: number; content: string }[],
  conversationHistory?: ChatMessage[],
  onChunk?: (chunk: string) => void
): Promise<{ response: string; usedModel: string }> => {
  const allModels: Array<'gemini' | 'llama' | 'deepseek' | 'qwen' | 'mistral' | 'claude'> = [
    'gemini', 'llama', 'deepseek', 'qwen', 'mistral', 'claude'
  ];
  const startIndex = allModels.indexOf(model as any);
  const attempts = startIndex >= 0 
    ? [...allModels.slice(startIndex), ...allModels.slice(0, startIndex)]
    : allModels;
  
  let lastError: Error | null = null;
  
  for (const currentModel of attempts) {
    try {
      const url = API_URLS.gemini; // Единая точка входа для всех моделей
      
      // Если есть файлы, добавляем их содержимое к сообщению
      let enhancedMessage = message;
      if (files && files.length > 0) {
        const filesContent = files.map(f => {
          try {
            const decoded = atob(f.content);
            return `\n\n--- Файл: ${f.name} ---\n${decoded}\n--- Конец файла ---`;
          } catch (e) {
            return `\n\n--- Файл: ${f.name} (не удалось прочитать) ---`;
          }
        }).join('\n');
        
        enhancedMessage = `${message}\n\n📎 Загруженные файлы для анализа:${filesContent}`;
      }
      
      console.log(`Попытка отправить запрос через модель: ${currentModel}`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: enhancedMessage,
          session_id: sessionId,
          model_id: currentModel,
          conversation_history: conversationHistory || [],
          stream: !!onChunk
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      // Если есть callback для streaming, обрабатываем поток
      if (onChunk && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const dataStr = line.slice(6);
              if (dataStr.trim() === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(dataStr);
                const content = parsed.choices?.[0]?.delta?.content || '';
                if (content) {
                  fullResponse += content;
                  onChunk(content);
                }
              } catch (e) {
                // Пропускаем невалидный JSON
              }
            }
          }
        }
        
        return { response: fullResponse, usedModel: currentModel };
      }
      
      const data = await response.json();
      
      // Уведомляем если модель переключилась
      if (currentModel !== model) {
        console.warn(`✅ Переключено на модель ${currentModel} (основная ${model} недоступна)`);
      }
      
      return { response: data.response, usedModel: currentModel };
    } catch (error) {
      lastError = error as Error;
      console.warn(`❌ Модель ${currentModel} недоступна: ${lastError.message}`);
      continue;
    }
  }
  
  throw lastError || new Error('Все модели недоступны. Проверьте API ключи в админ-панели.');
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
    console.error('Failed to load chat history');
    return [];
  }

  const data = await response.json();
  return (data.messages || []).map((msg: any) => ({
    role: msg.role,
    content: msg.content,
    model: msg.model
  }));
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

export const perform_sql_query = async (query: string): Promise<any[]> => {
  const response = await fetch('https://functions.poehali.dev/perform-sql-query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error('Failed to execute query');
  }

  const data = await response.json();
  return data.results || [];
};

export const uploadToKnowledgeBase = async (
  fileName: string,
  fileContent: string,
  fileType: string
): Promise<void> => {
  const response = await fetch('https://functions.poehali.dev/e8e81e65-be99-4706-a45d-ed27249c7bc8', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file_name: fileName,
      file_content: fileContent,
      file_type: fileType
    })
  });

  if (!response.ok) {
    throw new Error('Failed to upload to knowledge base');
  }
};

export const getKnowledgeBaseFiles = async (): Promise<Array<{
  id: number;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}>> => {
  const response = await fetch('https://functions.poehali.dev/e8e81e65-be99-4706-a45d-ed27249c7bc8');
  
  if (!response.ok) {
    throw new Error('Failed to get knowledge base files');
  }

  const data = await response.json();
  return data.files || [];
};

export const deleteFromKnowledgeBase = async (fileId: number): Promise<void> => {
  const response = await fetch(`https://functions.poehali.dev/e8e81e65-be99-4706-a45d-ed27249c7bc8?id=${fileId}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('Failed to delete from knowledge base');
  }
};