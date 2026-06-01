from typing import Dict, Any, List, Callable, Optional


class ToolRegistry:
    """
    SKELETON: A registry for managing tools available to the ReAct Agent.
    
    Students should register their custom tools here. Each tool is defined by:
    - name: A unique identifier (e.g., "check_stock")
    - description: A detailed description that helps the LLM understand when/how to use it
    - function: The actual Python function to execute
    
    Example usage:
        registry = ToolRegistry()
        registry.register(
            name="check_stock",
            description="Check the available stock quantity for a given item. Takes item_name (str) as argument.",
            function=check_stock_fn
        )
        tools = registry.get_tool_specs()  # Pass this to ReActAgent
    """

    def __init__(self):
        self._tools: Dict[str, Dict[str, Any]] = {}

    def register(self, name: str, description: str, function: Callable) -> None:
        """
        Register a new tool.

        Args:
            name: Unique name for the tool (e.g., "check_stock").
            description: Detailed description of what the tool does, 
                         its parameters, and return values. 
                         The LLM relies on this to decide when to use the tool.
            function: The Python callable to execute when this tool is invoked.
        """
        self._tools[name] = {
            "name": name,
            "description": description,
            "function": function,
        }

    def execute(self, tool_name: str, *args, **kwargs) -> str:
        """
        Execute a registered tool by name.

        Args:
            tool_name: The name of the tool to execute.
            *args, **kwargs: Arguments to pass to the tool function.

        Returns:
            The string result of the tool execution.

        Raises:
            ValueError: If the tool is not found in the registry.
        """
        if tool_name not in self._tools:
            raise ValueError(f"Tool '{tool_name}' not found. Available tools: {list(self._tools.keys())}")
        
        result = self._tools[tool_name]["function"](*args, **kwargs)
        return str(result)

    def get_tool_specs(self) -> List[Dict[str, str]]:
        """
        Get tool specifications for passing to the ReActAgent.
        
        Returns:
            A list of dicts with 'name' and 'description' keys.
        """
        return [
            {"name": t["name"], "description": t["description"]}
            for t in self._tools.values()
        ]

    def get_tool_function(self, tool_name: str) -> Optional[Callable]:
        """Get the function associated with a tool name."""
        tool = self._tools.get(tool_name)
        return tool["function"] if tool else None

    def list_tools(self) -> List[str]:
        """List all registered tool names."""
        return list(self._tools.keys())


# =============================================================================
# TODO: Define your custom tools below
# =============================================================================
import re
from duckduckgo_search import DDGS

def search_web(query: str) -> str:
    """
    Tìm kiếm thông tin trên web. Trả về kết quả chi tiết để AI có đủ thông tin phân tích.
    """
    try:
        results = DDGS().text(query, max_results=3)
        if not results:
            return "Không tìm thấy kết quả nào trên web."
        
        snippets = []
        for i, res in enumerate(results):
            title = res.get('title', '').strip()
            body = res.get('body', '').strip()
            body = re.sub(r'\s+', ' ', body)
            if len(body) > 1000:
                body = body[:1000] + "..."
            snippets.append(f"Kết quả {i+1}: {title} - {body}")
            
        return "\n".join(snippets)
    except Exception as e:
        return f"Lỗi khi tìm kiếm trên web: {e}"


def search_flights(query: str) -> str:
    """
    Tìm kiếm các chuyến bay giữa hai thành phố ở Việt Nam.
    Tham số: 'nơi_đi, nơi_đến' (ví dụ: 'Hà Nội, Nha Trang' hoặc 'Hồ Chí Minh, Đà Nẵng').
    Cũng hỗ trợ các chuỗi mô tả như 'từ Hà Nội đến Nha Trang'.
    """
    origin = "Hà Nội"
    destination = "Nha Trang"
    
    if "," in query:
        parts = [p.strip() for p in query.split(",")]
        if len(parts) >= 2:
            origin = parts[0]
            destination = parts[1]
    else:
        match = re.search(r"(?:từ|đi từ)\s+(.*?)\s+(?:đến|đi đến|sang)\s+(.*)", query, re.IGNORECASE)
        if match:
            origin = match.group(1).strip()
            destination = match.group(2).strip()
        else:
            destination = query.strip()
            
    def normalize(s: str) -> str:
        s = s.lower().strip()
        s = re.sub(r"^(tp\.?|thành phố)\s+", "", s)
        if s in ["hà nội", "ha noi", "hn"]:
            return "Hà Nội"
        if s in ["nha trang", "nt"]:
            return "Nha Trang"
        if s in ["đà nẵng", "da nang", "dn"]:
            return "Đà Nẵng"
        if s in ["hồ chí minh", "ho chi minh", "tphcm", "sg", "sài gòn", "sai gon", "tp. hồ chí minh"]:
            return "TP. Hồ Chí Minh"
        if s in ["phú quốc", "phu quoc", "pq"]:
            return "Phú Quốc"
        if s in ["đà lạt", "da lat", "dl"]:
            return "Đà Lạt"
        return s.title()

    norm_origin = normalize(origin)
    norm_destination = normalize(destination)

    # Đảm bảo đồng bộ với dữ liệu trong data.ts
    flights = [
        {"airline": "Vietnam Airlines", "depart": "08:00", "arrive": "10:15", "price": 1500000},
        {"airline": "VietJet Air", "depart": "11:20", "arrive": "13:30", "price": 950000},
        {"airline": "Bamboo Airways", "depart": "15:00", "arrive": "17:10", "price": 1350000},
        {"airline": "Vietnam Airlines", "depart": "19:30", "arrive": "21:45", "price": 1200000},
    ]

    result_lines = [f"Danh sách chuyến bay từ {norm_origin} đến {norm_destination}:"]
    for idx, f in enumerate(flights):
        result_lines.append(
            f"{idx+1}. Hãng: {f['airline']} | Khởi hành: {f['depart']} - Đến nơi: {f['arrive']} | Giá vé: {f['price']:,} VND"
        )
    return "\n".join(result_lines)


def search_hotels(location: str) -> str:
    """
    Tìm kiếm khách sạn tại một điểm đến ở Việt Nam.
    Tham số: tên thành phố/địa điểm (ví dụ: 'Nha Trang' hoặc 'khách sạn ở Đà Nẵng').
    """
    loc = location.strip()
    match = re.search(r"(?:tại|ở|khách sạn ở|khách sạn tại)\s+(.*)", loc, re.IGNORECASE)
    if match:
        loc = match.group(1).strip()
        
    def normalize(s: str) -> str:
        s = s.lower().strip()
        s = re.sub(r"^(tp\.?|thành phố)\s+", "", s)
        if s in ["hà nội", "ha noi", "hn"]:
            return "Hà Nội"
        if s in ["nha trang", "nt"]:
            return "Nha Trang"
        if s in ["đà nẵng", "da nang", "dn"]:
            return "Đà Nẵng"
        if s in ["hồ chí minh", "ho chi minh", "tphcm", "sg", "sài gòn", "sai gon", "tp. hồ chí minh"]:
            return "TP. Hồ Chí Minh"
        if s in ["phú quốc", "phu quoc", "pq"]:
            return "Phú Quốc"
        if s in ["đà lạt", "da lat", "dl"]:
            return "Đà Lạt"
        return s.title()
        
    norm_loc = normalize(loc)
    
    # Đảm bảo đồng bộ với dữ liệu trong data.ts
    hotels = [
        {"name": "Vinpearl Luxury Hotel", "rating": 5, "price": 3200000},
        {"name": "Mường Thanh Holiday Resort", "rating": 4, "price": 1100000},
        {"name": "Sea View Boutique", "rating": 4, "price": 850000},
        {"name": "InterContinental Resort", "rating": 5, "price": 5400000},
    ]
    
    result_lines = [f"Danh sách khách sạn tại {norm_loc}:"]
    for idx, h in enumerate(hotels):
        result_lines.append(
            f"{idx+1}. {h['name']} | Đánh giá: {h['rating']} sao | Giá khởi điểm: {h['price']:,} VND/đêm"
        )
    return "\n".join(result_lines)


# Register default tools when creating a registry
def get_default_tools() -> ToolRegistry:
    registry = ToolRegistry()
    registry.register(
        name="search_web",
        description="Search the web for general or up-to-date information. Arguments: query (str) - the search query.",
        function=search_web
    )
    registry.register(
        name="search_flights",
        description="Tìm kiếm vé máy bay giữa các thành phố ở Việt Nam. Tham số: 'nơi_đi, nơi_đến' hoặc một mô tả chuyến bay (ví dụ: 'Hà Nội, Nha Trang'). Trả về các hãng bay, giờ bay và giá vé.",
        function=search_flights
    )
    registry.register(
        name="search_hotels",
        description="Tìm kiếm danh sách khách sạn tại một địa điểm ở Việt Nam. Tham số: tên địa điểm/thành phố (ví dụ: 'Nha Trang'). Trả về tên khách sạn, số sao và giá phòng khởi điểm.",
        function=search_hotels
    )
    return registry
