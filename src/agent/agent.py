import re
import json
from typing import List, Dict, Any
from src.core.llm_provider import LLMProvider
from src.telemetry.logger import logger
from src.telemetry.metrics import tracker


class ReActAgent:
    """A ReAct-style Agent following the Thought-Action-Observation loop."""

    def __init__(self, llm: LLMProvider, tools: List[Dict[str, Any]], max_steps: int = 10):
        self.llm = llm
        self.tools = tools
        self.max_steps = max_steps

    def get_system_prompt(self) -> str:
        tool_descriptions = "\n".join(
            [f"- {t['name']}: {t['description']}" for t in self.tools]
        )
        tool_names = ", ".join([t["name"] for t in self.tools])
        return f"""You are an intelligent assistant that solves tasks step by step using tools.
                Available tools:
                {tool_descriptions}

                Use EXACTLY this format, one step at a time:
                Thought: your reasoning about what to do next.
                Action: one of [{tool_names}]
                Action Input: a JSON object with the tool arguments.

                After each Action you will receive an Observation. Reuse facts from previous
                Observations (e.g. flight destination/dates -> hotel; chosen hotel -> nearby
                evening activities) to keep every step consistent.

                When you have enough information, respond with:
                Thought: I now have everything I need.
                Final Answer: your complete answer to the user."""

    def run(self, user_input: str) -> str:
        logger.log_event("AGENT_START", {"input": user_input, "model": self.llm.model_name})
        system_prompt = self.get_system_prompt()
        transcript = f"Question: {user_input}\n"

        for step in range(1, self.max_steps + 1):
            result = self.llm.generate(transcript, system_prompt=system_prompt)
            content = result["content"]
            tracker.track_request(
                result.get("provider", "unknown"),
                self.llm.model_name,
                result.get("usage", {}),
                result.get("latency_ms", 0),
            )

            # Stop at the first Observation the model may hallucinate.
            content = content.split("Observation:")[0].strip()
            logger.log_event("AGENT_STEP", {"step": step, "content": content})

            final = re.search(r"Final Answer:\s*(.*)", content, re.DOTALL)
            if final:
                answer = final.group(1).strip()
                logger.log_event("AGENT_END", {"steps": step, "status": "final_answer"})
                return answer

            action = re.search(r"Action:\s*(.+)", content)
            action_input = re.search(r"Action Input:\s*(\{.*\})", content, re.DOTALL)
            if not action:
                transcript += content + "\nObservation: Invalid format. Use Action + Action Input (JSON) or Final Answer.\n"
                continue

            tool_name = action.group(1).strip()
            args = action_input.group(1) if action_input else "{}"
            observation = self._execute_tool(tool_name, args)
            logger.log_event("TOOL_CALL", {"tool": tool_name, "args": args, "observation": observation})

            transcript += f"{content}\nObservation: {observation}\n"

        logger.log_event("AGENT_END", {"steps": self.max_steps, "status": "max_steps"})
        return "Đã đạt giới hạn số bước mà chưa có câu trả lời cuối cùng."

    def _execute_tool(self, tool_name: str, args: str) -> str:
        for tool in self.tools:
            if tool["name"] == tool_name:
                try:
                    kwargs = json.loads(args)
                    result = tool["func"](**kwargs)
                    return json.dumps(result, ensure_ascii=False)
                except Exception as e:
                    return f"Error executing {tool_name}: {e}"
        return f"Tool '{tool_name}' not found. Available: {[t['name'] for t in self.tools]}"
