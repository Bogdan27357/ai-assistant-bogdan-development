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