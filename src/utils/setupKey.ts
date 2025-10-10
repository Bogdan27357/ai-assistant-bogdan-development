// Temporary utility to setup API keys
export async function setupDeepSeekKey() {
  const saveKeyUrl = 'https://functions.poehali.dev/b0e342c5-4500-4f08-b50e-c4ce3a3e4437';
  
  const keys = [
    {
      model_id: 'mistral',
      api_key: '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',
      enabled: true
    },
    {
      model_id: 'deepseek-r1t2',
      api_key: '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',
      enabled: true
    }
  ];
  
  try {
    for (const key of keys) {
      const response = await fetch(saveKeyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(key)
      });
      
      const data = await response.json();
      console.log(`${key.model_id} key setup result:`, data);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Failed to setup keys:', error);
    throw error;
  }
}