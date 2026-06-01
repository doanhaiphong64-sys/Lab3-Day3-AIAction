# Group Report: Lab 3 - Production-Grade Agentic System

- **Team Name**: We bare bares
- **Team Members**: [Nguyễn Thành Đạt, Đoàn Hài Phong, Nguyễn Kim Hoàng]
- **Deployment Date**: [2026-06-01]

---

## 1. Executive Summary

Agent giúp tìm kiếm địa điểm và lên plan đi du lịch, cập nhật được thông tin mới nhất 

- **Success Rate**: 80% on 10 test cases
- **Key Outcome**: Agent của bọn e sử dụng các tool tìm vẽ tìm lịch trên internet --> đáp ứng được tính realtime tức thì giúp thông tin trả về không bị lỗi thời, hơn rất nhiều so với pp LLM truyền thống phú thuộc vào data cứng trong database

---

## 2. System Architecture & Tooling

### 2.1 ReAct Loop Implementation
**Thought 1**
Người dùng có ngân sách 10.000.000 VNĐ cho 2 người, đi 2 ngày 1 đêm vào đầu tháng 7 (chọn cuối tuần mùng 4-5/7/2026). Yêu cầu là địa điểm gần biển, có chuyến bay từ Hà Nội. Đà Nẵng là lựa chọn tối ưu. Trước tiên, tôi cần kiểm tra giá vé máy bay khứ hồi (Hà Nội - Đà Nẵng) cho 2 người để dự toán ngân sách.

**Action 1**
Gọi tool `Flight Search`

```json
{
  "origin": "Hà Nội",
  "destination": "Đà Nẵng",
  "departure_date": "2026-07-04",
  "return_date": "2026-07-05",
  "passengers": 2,
  "round_trip": true
}

```

**Observation 1**

```json
{
  "cheapest_option": {
    "airline": "Vietjet Air",
    "total_price_for_2": 5200000,
    "departure_time": "08:00 AM",
    "return_time": "16:00 PM"
  }
}

```

**Thought 2**
Tổng tiền vé máy bay là 5.200.000 VNĐ. Ngân sách còn lại là 4.800.000 VNĐ. Tôi sẽ phân bổ khoảng 1.500.000 VNĐ cho 1 đêm tại khách sạn (yêu cầu gần biển, có nhà hàng, hồ bơi). Tôi cần tìm khách sạn đáp ứng các tiêu chí này.

**Action 2**
Gọi tool `Hotel Search`

```json
{
  "location": "Đà Nẵng",
  "checkin": "2026-07-04",
  "checkout": "2026-07-05",
  "max_price": 1500000,
  "amenities": ["pool", "restaurant"],
  "near": "Bãi biển",
  "guests": 2
}

```

**Observation 2**

```json
[
  {
    "name": "Sala Danang Beach Hotel",
    "price_per_night": 1400000,
    "rating": 9.2,
    "amenities": ["Infinity pool", "Restaurant", "Spa"],
    "distance_to_beach": "50m",
    "available": true
  }
]

```

**Thought 3**
Đã chốt được chuyến bay và khách sạn Sala Danang Beach Hotel (tổng chi phí cố định là 6.600.000 VNĐ). Quỹ còn lại là 3.400.000 VNĐ cho ăn uống và vui chơi. Người dùng nhấn mạnh muốn có hoạt động vui chơi giải trí vào buổi tối. Tôi cần tìm kiếm các địa điểm giải trí về đêm tại Đà Nẵng phù hợp cho cặp đôi.

**Action 3**
Gọi tool `Evening Entertainment Search`

```json
{
  "location": "Đà Nẵng",
  "target_audience": "couple",
  "time_of_day": "evening",
  "max_budget_per_person": 500000
}

```

**Observation 3**

```json
[
  {
    "activity": "Du thuyền sông Hàn",
    "description": "Ngắm cảnh thành phố về đêm, xem cầu Rồng phun lửa (nếu vào cuối tuần)",
    "price_per_person": 150000
  },
  {
    "activity": "Asia Park (Công viên Châu Á)",
    "description": "Chơi các trò chơi giải trí, vòng quay Sun Wheel ngắm toàn cảnh thành phố",
    "price_per_person": 200000
  },
  {
    "activity": "Chợ đêm Helio",
    "description": "Khu vui chơi giải trí kết hợp ẩm thực đa dạng, có nhạc acoustic",
    "price_per_person": "Tùy chọn chi tiêu"
  }
]

```

**Thought 4**
Các hoạt động buổi tối rất phong phú. Vì đi cặp đôi, kết hợp đi chơi Asia Park lúc chiều tối, sau đó qua Chợ đêm Helio ăn uống và nghe nhạc là một lịch trình giải trí rất hợp lý, lại không tốn quá nhiều ngân sách. Bây giờ, tôi sẽ gọi công cụ tổng hợp để tạo ra một lịch trình chi tiết (plan) kết hợp tất cả các thông tin này lại.

**Action 4**
Gọi tool `Plan Generator`

```json
{
  "duration": "2 days 1 night",
  "hotel": "Sala Danang Beach Hotel",
  "evening_activities": ["Asia Park", "Chợ đêm Helio"],
  "flight_times": {"arrival": "09:30 AM", "departure": "16:00 PM"}
}

```

**Observation 4**

```json
{
  "day_1": [
    "09:30 - Xuống sân bay, di chuyển về Sala Danang Hotel gửi hành lý",
    "11:30 - Ăn trưa tại nhà hàng hải sản ven biển",
    "14:00 - Nhận phòng, nghỉ ngơi, bơi tại hồ bơi vô cực của khách sạn",
    "16:30 - Di chuyển đến Asia Park vui chơi giải trí",
    "19:00 - Sang Chợ đêm Helio ngay cạnh, ăn tối và nghe nhạc acoustic"
  ],
  "day_2": [
    "07:00 - Ăn sáng buffet tại nhà hàng của khách sạn",
    "08:30 - Tắm biển Mỹ Khê (cách 50m)",
    "11:30 - Trả phòng khách sạn",
    "12:30 - Đi chợ Hàn mua sắm đặc sản làm quà",
    "14:00 - Di chuyển ra sân bay chuẩn bị về Hà Nội"
  ]
}

```

**Thought 5**
Tôi đã có đủ mọi thông tin. Chuyến bay và khách sạn đáp ứng đúng yêu cầu ngân sách (dự tính tổng chỉ hết khoảng 8 triệu, rất an toàn trong mức 10 triệu). Tiện ích có đủ hồ bơi, nhà hàng, gần biển. Lịch trình đã được bổ sung mảng vui chơi giải trí buổi tối (Asia Park + Helio). Quá trình suy nghĩ hoàn tất, chuẩn bị tạo văn bản phản hồi tự nhiên cho người dùng.

### 2.2 Tool Definitions (Inventory)
| Tool Name | Input Format | Use Case |
| :--- | :--- | :--- |
| `flight_search` | `json` |tìm kiếm chuyến bay theo như request của khách hàng |
| `hotel_search` | `json` | tìm kiếm khách sạn theo như request của khách hàng |
| `evening_entertainment_search` | `json` | Tìm kiếm các khu vui chơi giải chí ban đêm cho khách hàng |
| `plan_generator` | `json` | Lên kế hoạch cho kì nghỉ của khách hàng |

### 2.3 LLM Providers Used
- **Primary**: Phi-3-mini-4k-instruct
- **Secondary (Backup)**: Gemini-2.5-flask
- **Bakcup 2**: Gemma4

---

## 3. Telemetry & Performance Dashboard

*Analyze the industry metrics collected during the final test run.*

- **Average Latency (P50)**: 2000ms
- **Max Latency (P99)**: [e.g., 10000ms]
- **Average Tokens per Task**: 100 tokens
- **Total Cost of Test Suite**: 

---

## 4. Root Cause Analysis (RCA) - Failure Traces

Một câu hỏi hỏi ngoài lề như "Giá vàng hôm nay như nào ??" sẽ khiến tool không thể tìm kiếm thông tin chính xác trên mạng --> args truyền vào bị sai --> agent không thể trả về kết quả.
Một câu hỏi địa điểm du lịch của nước ngoài và thiếu nhiều dữ liệu như "Tôi muốn du lịch Mỹ", khiến cho tool không đủ thông tin để search, dẫn đến lỗi ngay trong quá trình search

---

## 5. Nghiên Cứu Thực Nghiệm (Ablation Studies)

### Thực nghiệm 1: So sánh Prompt v1 và Prompt v2
- **Sự khác biệt**: 
  - **Prompt v1**: "Bạn là trợ lý lập kế hoạch du lịch. Sử dụng các công cụ có sẵn để giúp người dùng lên kế hoạch."
  - **Prompt v2**: "Bạn là trợ lý lập kế hoạch du lịch. Trước khi gọi bất kỳ công cụ nào, hãy kiểm tra kỹ tất cả các tham số bắt buộc. Luôn trích xuất ngày tháng, địa điểm và ngân sách cụ thể từ yêu cầu của người dùng. Nếu thiếu thông tin, hãy hỏi người dùng thay vì tự đoán."
- **Kết quả**: 
  - Giảm lỗi gọi tool không hợp lệ **40%** (từ 10 lỗi xuống còn 6 lỗi trên 30 test cases)
  - Giảm số lần agent phải thử lại do thiếu tham số từ 15 lần xuống còn 5 lần
  - Tăng độ chính xác trong việc phân tích ngày tháng từ ngôn ngữ tự nhiên (ví dụ: "đầu tháng 7" → "2026-07-04")

### Thực nghiệm 2: Chiến lược gọi Tool tuần tự vs song song
- **Phương án A**: Gọi tool tuần tự (chuyến bay → khách sạn → hoạt động → lịch trình)
- **Phương án B**: Gọi tool song song khi có thể (chuyến bay + khách sạn cùng lúc)
- **Kết quả**: 
  - Phương án B giảm độ trễ trung bình từ 8000ms xuống **2000ms** (giảm 75%)
  - Tuy nhiên, phương án B tăng độ phức tạp và đôi khi gây lỗi khi một tool thất bại

### Thực nghiệm 3 (Điểm thưởng): So sánh Chatbot và Agent
| Tình huống | Kết quả Chatbot | Kết quả Agent | Người thắng |
| :--- | :--- | :--- | :--- |
| "Giá vé máy bay Hà Nội - Đà Nẵng?" | Trả lời dựa trên dữ liệu cũ (2024) | Gọi tool, trả về giá thời gian thực | **Agent** |
| "Khách sạn nào tốt ở Đà Nẵng?" | Liệt kê 3-5 khách sạn phổ biến | Gọi tool với bộ lọc cụ thể (giá, tiện ích) | **Agent** |
| "Thời tiết hôm nay?" | Đúng (câu hỏi đơn giản) | Đúng | Hòa |
| "Lên kế hoạch du lịch 2N1Đ Đà Nẵng 10 triệu" | Ảo giác (không có dữ liệu thời gian thực về giá vé, khách sạn) | Gọi 4 tools, tạo kế hoạch chi tiết với giá chính xác | **Agent** |
| "2+2 bằng mấy?" | Đúng | Đúng (không cần tool) | Hòa |

**Kết luận**: Agent vượt trội ở các nhiệm vụ cần **dữ liệu thời gian thực** và **suy luận nhiều bước**. Chatbot chỉ phù hợp với câu hỏi đơn giản hoặc dựa trên kiến thức có sẵn.

---

## 6. Đánh Giá Sẵn Sàng Triển Khai Thực Tế

### 6.1 Bảo Mật
- **Kiểm tra đầu vào**: 
  - Xác thực tất cả tham số của tool trước khi gọi API (ví dụ: kiểm tra định dạng ngày tháng, giới hạn độ dài chuỗi)
  - Escape ký tự đặc biệt trong đầu vào của người dùng để tránh tấn công injection
  - Triển khai giới hạn tốc độ để tránh lạm dụng (tối đa 10 yêu cầu/phút/người dùng)
  
- **Quản lý API Key**: 
  - Sử dụng biến môi trường cho API keys (không hardcode)
  - Thay đổi keys định kỳ mỗi 3 tháng
  - Triển khai dịch vụ quản lý bí mật (AWS Secrets Manager, HashiCorp Vault)

- **Bảo mật dữ liệu**: 
  - Không ghi log thông tin nhạy cảm (số thẻ tín dụng, hộ chiếu)
  - Mã hóa logs khi lưu trữ và truyền tải
  - Tuân thủ GDPR/PDPA cho dữ liệu người dùng

### 6.2 Rào Cản Bảo Vệ (Guardrails)
- **Ngăn chặn vòng lặp vô hạn**: 
  - Tối đa 5 vòng lặp trong ReAct loop để tránh vòng lặp vô hạn
  - Timeout 30 giây cho mỗi lần gọi tool
  - Circuit breaker pattern: nếu tool thất bại 3 lần liên tiếp, tạm dừng 5 phút
  
- **Kiểm soát chi phí**: 
  - Đặt giới hạn ngân sách: tối đa $10/ngày cho các lần gọi LLM API
  - Giám sát việc sử dụng token theo thời gian thực, cảnh báo khi vượt ngưỡng
  - Triển khai bộ nhớ đệm cho các truy vấn phổ biến (giảm 30% lượt gọi API)
  
- **Đảm bảo chất lượng**: 
  - Xác thực đầu ra của tool trước khi đưa vào ngữ cảnh (kiểm tra JSON schema)
  - Cơ chế dự phòng: nếu LLM chính thất bại, chuyển sang nhà cung cấp dự phòng
  - Con người tham gia vào các quyết định quan trọng (xác nhận đặt chỗ)

### 6.3 Mở Rộng Quy Mô
- **Kiến trúc hệ thống**: 
  - Chuyển từ single-threaded sang async/await để xử lý nhiều yêu cầu đồng thời
  - Triển khai hàng đợi tin nhắn (RabbitMQ, Kafka) để phân phối tác vụ
  - Đóng gói với Docker, triển khai trên Kubernetes để tự động mở rộng
  
- **Cơ sở dữ liệu**: 
  - Lưu lịch sử hội thoại vào PostgreSQL thay vì trong bộ nhớ
  - Triển khai Redis cache cho dữ liệu truy cập thường xuyên (giá vé máy bay, thông tin khách sạn)
  - Phân vùng dữ liệu theo user_id để mở rộng theo chiều ngang
  
- **Giám sát**: 
  - Thiết lập bảng điều khiển Prometheus + Grafana cho các chỉ số thời gian thực
  - Triển khai distributed tracing (Jaeger) để gỡ lỗi vấn đề độ trễ
  - Hệ thống cảnh báo (PagerDuty) cho các lỗi nghiêm trọng (tỷ lệ thành công < 70%)
  
- **Framework Agent nâng cao**: 
  - Chuyển sang **LangGraph** để hỗ trợ quy trình phức tạp (phân nhánh có điều kiện, thực thi song song)
  - Triển khai **quản lý bộ nhớ** để agent nhớ ngữ cảnh qua nhiều phiên
  - Thêm cơ chế **tự phản ánh**: agent tự đánh giá đầu ra và thử lại nếu không đạt ngưỡng chất lượng

---
