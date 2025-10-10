const API_URLS = {
  chat: 'https://functions.poehali.dev/d6af8e44-8748-4611-a1ff-2f819acf245c',
  saveMessage: 'https://functions.poehali.dev/6ff4ff7a-3331-40ce-ba16-7fd13be4e583',
  getHistory: 'https://functions.poehali.dev/aa1d79d8-9887-428e-87c1-cda250564de1',
  saveApiKey: 'https://functions.poehali.dev/b0e342c5-4500-4f08-b50e-c4ce3a3e4437',
  getApiKeys: 'https://functions.poehali.dev/e03e0273-c62e-43a4-876d-1580d86866fa',
  videoGen: 'https://functions.poehali.dev/49a6f065-a362-4b49-9bf4-799295201103'
};

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  model?: string;
}

export const sendMessageToAI = async (
  model: 'gemini' | 'llama' | 'deepseek' | 'qwen' | 'mistral' | 'claude' | 'auto' | 'gemini-vision' | 'llama-vision' | 'qwen-vision' | 'flux' | 'dalle' | 'veo-3-fast' | 'kling-v2.1-standard' | 'hailuo-02-standard',
  message: string,
  sessionId: string,
  files?: { name: string; type: string; size: number; content: string }[],
  conversationHistory?: ChatMessage[],
  onChunk?: (chunk: string) => void
): Promise<{ response: string; usedModel: string; taskType?: string; videoUrl?: string }> => {
  // Проверяем, это видео-модель?
  const videoModels = ['veo-3-fast', 'kling-v2.1-standard', 'hailuo-02-standard'];
  if (videoModels.includes(model)) {
    try {
      const response = await fetch(API_URLS.videoGen, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: message,
          model: model
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      return {
        response: `🎬 Видео успешно сгенерировано!\n\n📹 [Смотреть видео](${result.video_url})`,
        usedModel: 'Режиссёр',
        taskType: 'Режиссёр',
        videoUrl: result.video_url
      };
    } catch (error: any) {
      throw new Error(error.message || 'Ошибка генерации видео');
    }
  }

  // Используем новую универсальную функцию chat
  const url = API_URLS.chat;
  
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
  
  // Отправка запроса к AI
  const requestPayload = {
    message: enhancedMessage,
    session_id: sessionId,
    model_id: model,
    conversation_history: conversationHistory || [],
    stream: !!onChunk
  };
  
  console.log('Sending request to AI:', { url, model, messageLength: enhancedMessage.length });
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Ошибка сети' }));
      console.error('Backend error:', response.status, error);
      throw new Error(error.error || `Ошибка сервера: ${response.status}`);
    }

    const data = await response.json();
    
    // Если есть callback для streaming, симулируем постепенный вывод
    if (onChunk && data.response) {
      const words = data.response.split(' ');
      for (let i = 0; i < words.length; i++) {
        const chunk = (i === 0 ? '' : ' ') + words[i];
        onChunk(chunk);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
    }
    
    return { 
      response: data.response, 
      usedModel: model,
      taskType: data.task_type
    };
  } catch (error: any) {
    console.error('API call failed:', error);
    throw error;
  }
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

export const getApiKeys = async (): Promise<Array<{model_id: string, enabled: boolean, api_key?: string}>> => {
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