// Temporary utility to setup API key
export async function setupDeepSeekKey() {
  const apiKey = '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';
  const saveKeyUrl = 'https://functions.poehali.dev/b0e342c5-4500-4f08-b50e-c4ce3a3e4437';
  
  try {
    const response = await fetch(saveKeyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model_id: 'deepseek-r1t2',
        api_key: apiKey,
        enabled: true
      })
    });
    
    const data = await response.json();
    console.log('DeepSeek key setup result:', data);
    return data;
  } catch (error) {
    console.error('Failed to setup key:', error);
    throw error;
  }
}
