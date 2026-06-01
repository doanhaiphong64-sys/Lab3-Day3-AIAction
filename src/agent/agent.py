import os
import re
from typing import List, Dict, Any, Optional
from src.core.llm_provider import LLMProvider
from src.telemetry.logger import logger

class ReActAgent:
    """
    A ReAct-style Agent that follows the Thought-Action-Observation loop.
    """
    
    def __init__(self, llm: LLMProvider, registry: Any = None, max_steps: int = 5):
        self.llm = llm
        self.registry = registry
        self.tools = registry.get_tool_specs() if registry else []
        self.max_steps = max_steps

    def get_system_prompt(self) -> str:
        tool_descriptions = "\n".join([f"- {t['name']}: {t['description']}" for t in self.tools])
        return f"""Bạn là một AI Agent thông minh của TravelHub Vietnam.
Bạn CÓ THỂ sử dụng các công cụ sau đây để tìm kiếm thông tin nếu cần:
{tool_descriptions}

LUÔN LUÔN tuân theo định dạng suy luận sau đây một cách chính xác:
Suy nghĩ: Suy nghĩ của bạn về việc cần làm tiếp theo.
Công cụ: tên_công_cụ
Tham số: tham số truyền vào công cụ
Kết quả: (Kết quả từ công cụ sẽ được hệ thống điền tự động)

--- VÍ DỤ ---
User: Thời tiết Đà Lạt hôm nay thế nào?
Suy nghĩ: Tôi cần tìm thông tin thời tiết Đà Lạt hôm nay trên mạng.
Công cụ: search_web
Tham số: thời tiết Đà Lạt hôm nay
Kết quả: Result 1: Dự báo thời tiết Đà Lạt hôm nay có mưa rào...
Suy nghĩ: Tôi đã có đủ thông tin.
Trả lời: Dạ, theo thông tin mới nhất thì thời tiết Đà Lạt hôm nay có mưa rào, bạn nhớ mang ô nhé!
--- HẾT VÍ DỤ ---

QUAN TRỌNG: 
1. TUYỆT ĐỐI KHÔNG TỰ BỊA RA GIÁ VÉ MÁY BAY HAY GIÁ KHÁCH SẠN. Bạn PHẢI DÙNG CÔNG CỤ (như search_flights, search_hotels, search_web) trước khi trả lời.
2. Nếu người dùng hỏi về chuyến bay (vd: "từ Hà Nội đến Nha Trang"), BẮT BUỘC dùng công cụ search_flights.

Khi bạn đã có đủ thông tin để trả lời, hoặc câu hỏi không cần công cụ, BẮT BUỘC dùng định dạng:
Suy nghĩ: Tôi đã có câu trả lời cuối cùng.
Trả lời: Câu trả lời tiếng Việt gửi cho người dùng.
"""

    def run(self, user_input: str) -> str:
        logger.log_event("AGENT_START", {"input": user_input, "model": self.llm.model_name})
        
        current_prompt = f"User: {user_input}\n"
        steps = 0

        while steps < self.max_steps:
            # Generate LLM response
            result = self.llm.generate(current_prompt, system_prompt=self.get_system_prompt())
            content = result.get("content", "").strip()
            
            current_prompt += f"{content}\n"
            
            # Parse Action and Action Input first, robustly
            action_match = re.search(r"(?:Công cụ|Action|Tên của công cụ|Công cụ sử dụng):\s*(\w+)", content, re.IGNORECASE)
            action_input_match = re.search(r"(?:Tham số|Action Input|Input của công cụ|Input):\s*(.+)", content, re.IGNORECASE)

            # If there's a valid tool call, prioritize it even if Trả lời is present
            if action_match and action_input_match:
                pass # will be handled below
            elif "Trả lời:" in content:
                final_answer = content.split("Trả lời:")[-1].strip()
                logger.log_event("AGENT_END", {"steps": steps})
                return final_answer
            
            if action_match and action_input_match:
            
            if action_match and action_input_match:
                tool_name = action_match.group(1).strip()
                tool_input = action_input_match.group(1).strip().strip("\"'")
                
                # Execute tool
                observation = self._execute_tool(tool_name, tool_input)
                current_prompt += f"Kết quả: {observation}\n"
            else:
                # If the AI failed to format, just force it to stop
                # Clean up any leftover tags
                cleaned = re.sub(r"^(?:Suy nghĩ|Thought|Thông sử):\s*", "", content, flags=re.IGNORECASE).strip()
                return cleaned

            steps += 1
            
        logger.log_event("AGENT_END", {"steps": steps})
        return "Xin lỗi, tôi đã mất quá nhiều thời gian suy nghĩ. Hãy thử hỏi lại nhé!"

    def _execute_tool(self, tool_name: str, args: str) -> str:
        """
        Helper method to execute tools by name using the registry.
        """
        if not self.registry:
            return "Error: No tools registered."
        try:
            return self.registry.execute(tool_name, args)
        except Exception as e:
            return f"Error executing {tool_name}: {e}"
