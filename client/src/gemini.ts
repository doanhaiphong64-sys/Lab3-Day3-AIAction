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
