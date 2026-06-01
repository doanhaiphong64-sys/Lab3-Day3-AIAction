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

# Example tool functions (uncomment and modify for your scenario):

# def check_stock(item_name: str) -> str:
#     """Check the available stock quantity for a given item."""
#     stock_data = {
#         "iphone": 50,
#         "macbook": 12,
#         "airpods": 200,
#     }
#     item = item_name.lower()
#     if item in stock_data:
#         return f"{item_name}: {stock_data[item]} units available."
#     return f"{item_name}: Not found in inventory."

# def get_discount(coupon_code: str) -> str:
#     """Get the discount percentage for a coupon code."""
#     coupons = {
#         "WINNER": 15,
#         "SAVE10": 10,
#         "VIP20": 20,
#     }
#     code = coupon_code.upper()
#     if code in coupons:
#         return f"Coupon '{code}': {coupons[code]}% discount."
#     return f"Coupon '{coupon_code}': Invalid or expired."

# def calc_shipping(weight: float, destination: str) -> str:
#     """Calculate shipping cost based on weight (kg) and destination city."""
#     base_rate = 15000  # VND per kg
#     city_multiplier = {
#         "hanoi": 1.0,
#         "hcm": 1.2,
#         "danang": 1.1,
#     }
#     dest = destination.lower()
#     multiplier = city_multiplier.get(dest, 1.5)
#     cost = weight * base_rate * multiplier
#     return f"Shipping {weight}kg to {destination}: {cost:,.0f} VND."
