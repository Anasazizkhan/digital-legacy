const COHERE_API_KEY = 'GyFVii8yFhUixax69nJaWrgGpJIGqxxB9FHFtMkB';
const COHERE_API_URL = 'https://api.cohere.ai/v1/chat';

export async function sendMessageToCohere(message) {
  try {
    const response = await fetch(COHERE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${COHERE_API_KEY}`
      },
      body: JSON.stringify({
        message: message,
        model: 'command',
        temperature: 0.7,
        max_tokens: 1000,
        stream: false,
        chat_history: [],
        prompt_truncation: 'AUTO',
        connectors: []
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Cohere');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Cohere API error:', error);
    throw error;
  }
} 