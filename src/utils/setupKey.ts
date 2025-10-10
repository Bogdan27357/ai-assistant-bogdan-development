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