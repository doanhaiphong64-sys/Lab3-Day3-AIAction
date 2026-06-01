import os
import time
import json
import requests
from typing import Dict, Any, Optional, Generator
from src.core.llm_provider import LLMProvider


class OllamaProvider(LLMProvider):
    """LLM Provider backed by a local Ollama server."""

    def __init__(self, model_name: str = "phi3-local", host: Optional[str] = None):
        super().__init__(model_name)
        self.host = host or os.getenv("OLLAMA_HOST", "http://localhost:11434")

    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        start = time.time()
        payload = {"model": self.model_name, "prompt": prompt, "stream": False}
        if system_prompt:
            payload["system"] = system_prompt
        r = requests.post(f"{self.host}/api/generate", json=payload)
        r.raise_for_status()
        data = r.json()
        latency_ms = int((time.time() - start) * 1000)

        prompt_tokens = data.get("prompt_eval_count", 0)
        completion_tokens = data.get("eval_count", 0)
        return {
            "content": data.get("response", "").strip(),
            "usage": {
                "prompt_tokens": prompt_tokens,
                "completion_tokens": completion_tokens,
                "total_tokens": prompt_tokens + completion_tokens,
            },
            "latency_ms": latency_ms,
            "provider": "ollama",
        }

    def stream(self, prompt: str, system_prompt: Optional[str] = None) -> Generator[str, None, None]:
        payload = {"model": self.model_name, "prompt": prompt, "stream": True}
        if system_prompt:
            payload["system"] = system_prompt
        with requests.post(f"{self.host}/api/generate", json=payload, stream=True) as r:
            r.raise_for_status()
            for line in r.iter_lines():
                if line:
                    token = json.loads(line).get("response", "")
                    if token:
                        yield token
