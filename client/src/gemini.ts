/**
 * Local AI Service for TravelHub ChatWidget.
 * Connects to the local Python Flask API running the Phi-3 model.
 */

const API_URL = 'http://127.0.0.1:5000/api';

/**
 * Send a message to the local Phi-3 API and get a response.
 */
export async function sendMessage(userMessage: string): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      if (response.status === 503) {
        return '⚠️ Hệ thống AI (Phi-3) đang khởi động hoặc chưa tải xong model. Vui lòng kiểm tra Python server.';
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || 'Xin lỗi, tôi không thể xử lý yêu cầu này.';

  } catch (error: any) {
    console.error('Local API error:', error);
    return `Lỗi kết nối từ Frontend: ${error.message || error}`;
  }
}

/**
 * Send a message to the local Phi-3 API and stream the response.
 */
export async function streamMessage(userMessage: string, onUpdate: (chunk: string) => void): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/chat_stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      if (response.status === 503) {
        return '⚠️ Hệ thống AI (Phi-3) đang khởi động hoặc chưa tải xong model. Vui lòng kiểm tra Python server.';
      }
      throw new Error(`API error: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('ReadableStream not supported in this browser.');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            return fullText;
          }
          if (data.startsWith('[ERROR]')) {
            return fullText + '\n\n' + data;
          }
          
          fullText += data;
          onUpdate(fullText);
        }
      }
    }
    
    return fullText;

  } catch (error: any) {
    console.error('Local API streaming error:', error);
    return `Lỗi kết nối từ Frontend: ${error.message || error}`;
  }
}
