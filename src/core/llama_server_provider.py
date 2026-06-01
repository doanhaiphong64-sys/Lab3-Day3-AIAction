import time
import requests
from typing import Dict, Any, Optional, Generator
from src.core.llm_provider import LLMProvider

class LlamaServerProvider(LLMProvider):
    """
    LLM Provider that connects to a local Llama Server via HTTP API (OpenAI format).
    This bypasses the need for llama-cpp-python which can be difficult to build on Windows.
    """
    def __init__(self, api_url: str = "http://127.0.0.1:8080/v1"):
        super().__init__(model_name="LlamaServer-Phi3")
        self.api_url = api_url

    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        start_time = time.time()
        
        messages = []
        if system_prompt:
            messages.append({"role": "system", "content": system_prompt})
        messages.append({"role": "user", "content": prompt})

        payload = {
            "model": "phi-3",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 1024,
            "stop": ["Observation:", "Observation", "\nObservation", "Kết quả:", "\nKết quả:", "Kết quả", "\nKết quả"]
        }

        try:
            response = requests.post(f"{self.api_url}/chat/completions", json=payload, timeout=120)
            response.raise_for_status()
            result = response.json()
            
            content = result["choices"][0]["message"]["content"].strip()
            usage = result.get("usage", {})
            
        except Exception as e:
            content = f"Llama Server Error: {e}"
            usage = {}

        end_time = time.time()
        latency_ms = int((end_time - start_time) * 1000)

        return {
            "content": content,
            "usage": usage,
            "latency_ms": latency_ms,
            "provider": "llama-server"
        }

    def stream(self, prompt: str, system_prompt: Optional[str] = None) -> Generator[str, None, None]:
        # Simple non-streaming fallback for now
        res = self.generate(prompt, system_prompt)
        yield res["content"]
