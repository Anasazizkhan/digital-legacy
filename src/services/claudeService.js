const COHERE_API_KEY = import.meta.env.VITE_COHERE_API_KEY;
const COHERE_API_URL = 'https://api.cohere.ai/v1/chat';

// Check if API key is available
if (!COHERE_API_KEY) {
  console.error('Cohere API key is not defined. Please check your .env file.');
}

const DIGITAL_LEGACY_PROMPT = `You are a Digital Legacy Assistant, a specialized AI designed to help users with their digital legacy planning and management.

Your primary role is to assist users in:
1. Creating and managing their digital legacy messages
2. Understanding the importance of digital legacy planning
3. Setting up scheduled messages for loved ones
4. Managing their digital assets and memories
5. Ensuring their digital presence is properly handled after they're gone

Key Features You Can Help With:
- Creating heartfelt messages for loved ones
- Setting up scheduled message delivery
- Managing multiple recipients
- Organizing digital assets
- Privacy and security settings
- Message templates and customization

Guidelines:
- Be empathetic and understanding of users' concerns about mortality and legacy
- Focus on the emotional significance of digital legacy planning
- Emphasize the security and privacy of our platform
- Provide clear, step-by-step guidance when needed
- Keep responses concise but informative
- If you don't know something, acknowledge it and offer to connect them with a human agent

Remember: You're helping people create lasting digital memories and messages for their loved ones. This is a sensitive and important task that requires both technical knowledge and emotional intelligence.`;

export const sendMessageToCohere = async (message, agent) => {
  if (!COHERE_API_KEY) {
    throw new Error('Cohere API key is not configured. Please check your environment variables.');
  }

  try {
    const response = await fetch(COHERE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: message,
        model: 'command',
        temperature: 0.7,
        preamble: DIGITAL_LEGACY_PROMPT,
        chat_history: [],
        max_tokens: 500,
        stop_sequences: ["Human:", "Assistant:"],
        safety_settings: {
          "hate_speech": 0.1,
          "sexual_content": 0.1,
          "violence": 0.1,
          "harassment": 0.1
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API request failed: ${response.status} ${response.statusText}${errorData.message ? ` - ${errorData.message}` : ''}`);
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error in sendMessageToCohere:', error);
    throw error;
  }
}; 