# Báo Cáo Cá Nhân: Lab 3 - Chatbot vs ReAct Agent

- **Họ và Tên**: Nguyễn Thành Đạt
- **Mã Sinh Viên**: [2A202600831]
- **Ngày**: 2026-06-01

---

## I. Đóng Góp Kỹ Thuật (15 Điểm)

### Các module đã triển khai
- `src/tools/flight_search.py` - Tool tìm kiếm chuyến bay
- `src/tools/hotel_search.py` - Tool tìm kiếm khách sạn
- `src/agent/agent.py` - Cải thiện ReAct loop và xử lý lỗi

### Các đoạn code nổi bật

**1. Công cụ tìm kiếm chuyến bay**
```python
def flight_search(origin: str, destination: str, departure_date: str, 
                  return_date: str, passengers: int, round_trip: bool = True):
    """
    Tìm kiếm chuyến bay với các tham số đầu vào
    Returns: JSON với thông tin chuyến bay rẻ nhất
    """
    # Validate input parameters
    if not all([origin, destination, departure_date]):
        raise ValueError("Missing required parameters")
    
    # Call external API hoặc mock data
    results = search_flights_api(origin, destination, departure_date, 
                                  return_date, passengers, round_trip)
    
    return {
        "cheapest_option": {
            "airline": results[0]["airline"],
            "total_price_for_2": results[0]["price"] * passengers,
            "departure_time": results[0]["departure"],
            "return_time": results[0]["return"]
        }
    }
```

**2. Cải thiện vòng lặp ReAct**
```python
def react_loop(self, user_input: str, max_iterations: int = 5):
    """
    Triển khai vòng lặp Thought-Action-Observation
    """
    for i in range(max_iterations):
        # Tạo Thought (Suy nghĩ)
        thought = self.llm.generate(f"Thought: {context}")
        
        # Phân tích Action (Hành động)
        action = self.parse_action(thought)
        if action is None:
            break  # Không cần hành động nào nữa
        
        # Thực thi Action và nhận Observation (Quan sát)
        try:
            observation = self.execute_tool(action)
        except Exception as e:
            observation = f"Lỗi: {str(e)}"
            self.logger.error(f"Thực thi tool thất bại: {e}")
        
        # Thêm vào context cho vòng lặp tiếp theo
        context += f"\nObservation: {observation}"
    
    return self.generate_final_answer(context)
```

### Tài liệu kỹ thuật
Code của tôi tương tác với vòng lặp ReAct theo cách:
1. **Các công cụ (Tools)** được đăng ký vào agent thông qua phương thức `register_tool()`
2. Khi agent phân tích được `Action: flight_search(...)`, nó gọi hàm tương ứng
3. Kết quả trả về được định dạng thành JSON và đưa vào khối `Observation`
4. Agent sử dụng observation này để quyết định bước tiếp theo trong khối `Thought`

---

## II. Nghiên Cứu Tình Huống Gỡ Lỗi (10 Điểm)

### Mô tả vấn đề
Agent bị kẹt trong vòng lặp vô hạn khi người dùng hỏi: "Tôi muốn đi du lịch Đà Nẵng"

**Nhật ký từ `logs/2026-06-01.log`:**
```json
{
  "thoi_gian": "2026-06-01T15:23:45",
  "vong_lap": 1,
  "suy_nghi": "Người dùng muốn đi Đà Nẵng nhưng thiếu thông tin về ngày, ngân sách",
  "hanh_dong": "flight_search",
  "tham_so": {"origin": null, "destination": "Đà Nẵng", "departure_date": null},
  "trang_thai": "lỗi",
  "loi": "Thiếu tham số bắt buộc: origin"
}
{
  "thoi_gian": "2026-06-01T15:23:47",
  "vong_lap": 2,
  "suy_nghi": "Tôi cần tìm chuyến bay đến Đà Nẵng",
  "hanh_dong": "flight_search",
  "tham_so": {"origin": null, "destination": "Đà Nẵng", "departure_date": null},
  "trang_thai": "lỗi",
  "loi": "Thiếu tham số bắt buộc: origin"
}
```

### Chẩn đoán
**Nguyên nhân:**
1. LLM không được hướng dẫn rõ ràng về việc **hỏi lại người dùng** khi thiếu thông tin
2. Prompt không có ví dụ về cách xử lý đầu vào không đầy đủ
3. Agent cứ thử lại cùng một hành động với cùng tham số lỗi

**Tại sao LLM làm vậy?**
- Model bị "fixated" (cố định) vào việc gọi tool ngay lập tức thay vì phân tích xem có đủ thông tin không
- Không có cơ chế để agent "lùi lại" và yêu cầu làm rõ

### Giải pháp
**1. Cập nhật System Prompt:**
```python
SYSTEM_PROMPT = """
...
QUY TẮC QUAN TRỌNG:
- Nếu đầu vào của người dùng thiếu thông tin quan trọng (ngày, ngân sách, điểm xuất phát), 
  ĐỪNG gọi tools với tham số null/rỗng
- Thay vào đó, sử dụng Action: ask_user("Bạn cần thông tin gì?")
- Ví dụ:
  Thought: Người dùng muốn đi Đà Nẵng nhưng không nói rõ xuất phát từ đâu và ngày nào
  Action: ask_user("Bạn muốn đi từ thành phố nào và vào ngày nào ạ?")
"""
```

**2. Thêm kiểm tra trong tool:**
```python
def flight_search(origin, destination, departure_date, **kwargs):
    if not origin or not departure_date:
        return {
            "loi": "Thiếu thông tin bắt buộc",
            "goi_y": "Hỏi người dùng về thành phố xuất phát và ngày khởi hành"
        }
```

**3. Thêm bộ ngắt mạch (circuit breaker):**
```python
if iteration > 2 and action == previous_action and observation.startswith("Lỗi"):
    return "Tôi cần thêm thông tin từ bạn. Vui lòng cung cấp: ..."
```

**Kết quả:** Sau khi sửa, agent không còn bị vòng lặp và biết hỏi lại người dùng khi thiếu thông tin.

---

## III. Nhận Xét Cá Nhân: Chatbot vs ReAct (10 Điểm)

### 1. Khả năng suy luận
**Khối Thought (Suy nghĩ) giúp agent như thế nào?**
- **Chatbot**: Trả lời trực tiếp dựa trên nhận dạng mẫu, không có quá trình suy nghĩ rõ ràng
  - Ví dụ: "Đà Nẵng có nhiều khách sạn đẹp như..." (câu trả lời chung chung)
  
- **ReAct Agent**: Có quá trình suy luận từng bước
  ```
  Suy nghĩ 1: Cần kiểm tra giá vé máy bay trước để biết còn bao nhiêu ngân sách
  Hành động 1: flight_search(...)
  Quan sát 1: Vé hết 5.2 triệu
  Suy nghĩ 2: Còn 4.8 triệu, đủ cho khách sạn 1.5 triệu và ăn uống
  ```
  
**Lợi ích:**
- Minh bạch: Người dùng thấy được agent đang "suy nghĩ" gì
- Dễ gỡ lỗi: Dễ dàng tìm lỗi ở bước nào trong chuỗi suy nghĩ
- Linh hoạt: Agent có thể thay đổi kế hoạch dựa trên quan sát

### 2. Độ tin cậy
**Trường hợp Agent tệ hơn Chatbot:**

| Tình huống | Chatbot | Agent | Lý do Agent tệ hơn |
|------------|---------|-------|-------------------|
| "Thủ đô Việt Nam là gì?" | "Hà Nội" (tức thì) | Gọi công cụ tìm kiếm → chậm 2s | Quá mức cần thiết, không cần tool |
| "Kể chuyện cười" | Kể ngay | Cố gọi tool "joke_search" → thất bại | Không phải mọi nhiệm vụ đều cần tool |
| Đầu vào mơ hồ | Trả lời chung chung nhưng nhanh | Thử lại nhiều lần → hết thời gian | Agent quá "cố gắng" tìm tool phù hợp |

**Kết luận:** Agent vượt trội ở **suy luận nhiều bước** và **dữ liệu thời gian thực**, nhưng yếu ở **câu hỏi đơn giản về sự thật** (chi phí không cần thiết).

### 3. Vai trò của Quan sát (Observation)
**Observation ảnh hưởng đến bước tiếp theo như thế nào?**

**Ví dụ 1: Quan sát thành công**
```
Suy nghĩ 2: Cần tìm khách sạn với ngân sách 1.5 triệu
Hành động 2: hotel_search(max_price=1500000)
Quan sát 2: Tìm thấy "Sala Danang" - 1.4 triệu/đêm
Suy nghĩ 3: Tuyệt! Còn 3.4 triệu cho ăn uống. Giờ tìm hoạt động giải trí
```
→ Quan sát tích cực → Agent tiếp tục kế hoạch

**Ví dụ 2: Quan sát thất bại**
```
Suy nghĩ 2: Tìm khách sạn 5 sao với giá 500k
Hành động 2: hotel_search(rating=5, max_price=500000)
Quan sát 2: Không tìm thấy kết quả
Suy nghĩ 3: Giá quá thấp cho 5 sao. Tăng ngân sách lên 1.5 triệu
Hành động 3: hotel_search(rating=4, max_price=1500000)
```
→ Quan sát tiêu cực → Agent **điều chỉnh chiến lược**

**Nhận xét:** Observation là vòng phản hồi giúp agent **tự điều chỉnh**, điều mà Chatbot không có.

---

## IV. Cải Tiến Trong Tương Lai (5 Điểm)

### 1. Khả năng mở rộng
**Vấn đề hiện tại:** Agent chạy đồng bộ, mỗi lần gọi tool phải đợi tool trước hoàn thành.

**Giải pháp:**
```python
import asyncio

async def parallel_tool_execution(tools):
    """Gọi nhiều tools cùng lúc khi không phụ thuộc nhau"""
    tasks = [
        asyncio.create_task(flight_search(...)),
        asyncio.create_task(hotel_search(...))
    ]
    results = await asyncio.gather(*tasks)
    return results
```
**Lợi ích:** Giảm độ trễ từ 8s xuống 2s (như đã kiểm tra trong báo cáo nhóm)

### 2. An toàn
**Vấn đề:** Agent có thể gọi tool nguy hiểm hoặc tốn kém mà không có kiểm soát.

**Giải pháp: Agent giám sát**
```python
class SupervisorAgent:
    def audit_action(self, action, args):
        """Kiểm tra hành động trước khi thực thi"""
        if action == "book_flight" and args["price"] > 10000000:
            return {"approved": False, "reason": "Vượt quá giới hạn ngân sách"}
        
        if action == "delete_booking":
            return {"approved": False, "reason": "Cần xác nhận từ con người"}
        
        return {"approved": True}
```
**Lợi ích:** Tránh agent tự ý thực hiện hành động không thể đảo ngược

### 3. Hiệu suất
**Vấn đề:** Khi có 100+ tools, agent mất thời gian phân tích tool nào phù hợp.

**Giải pháp: Cơ sở dữ liệu Vector cho việc truy xuất Tool**
```python
from chromadb import Client

# Lập chỉ mục tất cả tools theo mô tả của chúng
tool_db = Client()
tool_db.add(
    documents=[tool.description for tool in all_tools],
    metadatas=[{"name": tool.name} for tool in all_tools],
    ids=[tool.id for tool in all_tools]
)

# Truy xuất các tools liên quan dựa trên câu hỏi người dùng
def get_relevant_tools(user_query, top_k=5):
    results = tool_db.query(query_texts=[user_query], n_results=top_k)
    return [get_tool_by_name(name) for name in results['metadatas']]
```
**Lợi ích:** Chỉ đưa 5 tools liên quan nhất vào prompt thay vì 100 tools → giảm chi phí token và tăng độ chính xác

### 4. Bộ nhớ dài hạn
**Giải pháp:**
```python
class AgentMemory:
    def __init__(self):
        self.user_preferences = {}  # Lưu sở thích người dùng
        self.past_bookings = []     # Lịch sử đặt chỗ
    
    def remember(self, key, value):
        self.user_preferences[key] = value
    
    def recall(self, key):
        return self.user_preferences.get(key)

# Sử dụng
memory.remember("preferred_airline", "Vietnam Airlines")
# Lần sau tự động ưu tiên hãng này
```

---

> **Tổng kết:** Lab này giúp tôi hiểu sâu về sự khác biệt giữa LLM đơn thuần và Agent có khả năng suy luận. Mô hình ReAct mạnh mẽ nhưng cần được thiết kế cẩn thận để tránh chi phí thừa và lỗi. Trong môi trường thực tế, cần kết hợp thêm giám sát, kiểm tra an toàn và tối ưu hóa để agent thực sự đáng tin cậy.
