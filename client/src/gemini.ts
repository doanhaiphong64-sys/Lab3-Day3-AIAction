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
    
  } catch (error) {
    console.error('Local API error:', error);
    return getFallbackResponse(userMessage);
  }
}

/**
 * Smart fallback responses when API is unavailable (Server down)
 */
function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('đà nẵng')) {
    return '🏖️ Đà Nẵng đang có 215 ưu đãi! Bạn có thể khám phá Bà Nà Hills, Cầu Rồng, và bán đảo Sơn Trà.';
  }
  if (lower.includes('phú quốc')) {
    return '🌴 Phú Quốc - Đảo ngọc với 142 ưu đãi! VinWonders, Grand World và Bãi Sao đang chờ bạn.';
  }
  if (lower.includes('đà lạt')) {
    return '🌸 Đà Lạt thành phố ngàn hoa có 89 ưu đãi! Thung lũng Tình Yêu, Hồ Tuyền Lâm rất đẹp.';
  }
  if (lower.includes('nha trang')) {
    return '🏝️ Nha Trang có 174 ưu đãi đang chờ! Vinpearl Land, Hòn Mun là điểm đến tuyệt vời.';
  }

  return '🔌 Lỗi kết nối: Không thể kết nối tới Python Server (http://127.0.0.1:5000). Vui lòng chạy lệnh: python src/api_server.py';
}
