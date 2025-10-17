export interface APIService {
  id: string;
  name: string;
  provider: string;
  category: 'text' | 'image' | 'video' | 'audio';
  apiUrl: string;
  docsUrl: string;
  pricing: string;
  description: string;
  keyName: string;
}

export const apiServices: APIService[] = [
  {
    id: 'openai',
    name: 'OpenAI API',
    provider: 'OpenAI',
    category: 'text',
    apiUrl: 'https://platform.openai.com/api-keys',
    docsUrl: 'https://platform.openai.com/docs',
    pricing: 'От $0.03 за 1K токенов',
    description: 'GPT-4o, DALL-E 3, Whisper',
    keyName: 'OPENAI_API_KEY'
  },
  {
    id: 'anthropic',
    name: 'Anthropic API',
    provider: 'Anthropic',
    category: 'text',
    apiUrl: 'https://console.anthropic.com/settings/keys',
    docsUrl: 'https://docs.anthropic.com',
    pricing: 'От $0.25 за 1M токенов',
    description: 'Claude 3.5 Sonnet',
    keyName: 'ANTHROPIC_API_KEY'
  },
  {
    id: 'google-ai',
    name: 'Google AI API',
    provider: 'Google',
    category: 'text',
    apiUrl: 'https://makersuite.google.com/app/apikey',
    docsUrl: 'https://ai.google.dev/docs',
    pricing: 'Бесплатно до 60 запросов/мин',
    description: 'Gemini Pro',
    keyName: 'GOOGLE_API_KEY'
  },
  {
    id: 'runway',
    name: 'Runway API',
    provider: 'Runway',
    category: 'video',
    apiUrl: 'https://app.runwayml.com/settings/api-keys',
    docsUrl: 'https://docs.runwayml.com',
    pricing: 'От $0.05 за секунду видео',
    description: 'Gen-2 видео генерация',
    keyName: 'RUNWAY_API_KEY'
  },
  {
    id: 'pika',
    name: 'Pika API',
    provider: 'Pika Labs',
    category: 'video',
    apiUrl: 'https://pika.art/settings',
    docsUrl: 'https://docs.pika.art',
    pricing: 'Beta доступ',
    description: 'Text-to-Video, Image-to-Video',
    keyName: 'PIKA_API_KEY'
  },
  {
    id: 'synthesia',
    name: 'Synthesia API',
    provider: 'Synthesia',
    category: 'video',
    apiUrl: 'https://www.synthesia.io/api',
    docsUrl: 'https://docs.synthesia.io',
    pricing: 'От $30/месяц',
    description: 'AI аватары для видео',
    keyName: 'SYNTHESIA_API_KEY'
  },
  {
    id: 'heygen',
    name: 'HeyGen API',
    provider: 'HeyGen',
    category: 'video',
    apiUrl: 'https://app.heygen.com/settings/api',
    docsUrl: 'https://docs.heygen.com',
    pricing: 'От $24/месяц',
    description: 'Говорящие аватары',
    keyName: 'HEYGEN_API_KEY'
  },
  {
    id: 'descript',
    name: 'Descript API',
    provider: 'Descript',
    category: 'video',
    apiUrl: 'https://www.descript.com/api',
    docsUrl: 'https://docs.descript.com',
    pricing: 'От $12/месяц',
    description: 'Редактирование видео через текст',
    keyName: 'DESCRIPT_API_KEY'
  },
  {
    id: 'fliki',
    name: 'Fliki API',
    provider: 'Fliki',
    category: 'video',
    apiUrl: 'https://fliki.ai/dashboard/api',
    docsUrl: 'https://docs.fliki.ai',
    pricing: 'От $8/месяц',
    description: 'Видео из текста с озвучкой',
    keyName: 'FLIKI_API_KEY'
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs API',
    provider: 'ElevenLabs',
    category: 'audio',
    apiUrl: 'https://elevenlabs.io/api',
    docsUrl: 'https://docs.elevenlabs.io',
    pricing: 'От $5/месяц',
    description: 'Синтез и клонирование голоса',
    keyName: 'ELEVENLABS_API_KEY'
  },
  {
    id: 'stability',
    name: 'Stability AI API',
    provider: 'Stability AI',
    category: 'image',
    apiUrl: 'https://platform.stability.ai/account/keys',
    docsUrl: 'https://platform.stability.ai/docs',
    pricing: 'От $10 за 1000 изображений',
    description: 'Stable Diffusion, Stable Audio',
    keyName: 'STABILITY_API_KEY'
  },
  {
    id: 'midjourney',
    name: 'Midjourney API',
    provider: 'Midjourney',
    category: 'image',
    apiUrl: 'https://www.midjourney.com/api',
    docsUrl: 'https://docs.midjourney.com',
    pricing: 'От $10/месяц',
    description: 'Художественная генерация изображений',
    keyName: 'MIDJOURNEY_API_KEY'
  }
];
