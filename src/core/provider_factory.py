import os
from src.core.llm_provider import LLMProvider


def get_provider() -> LLMProvider:
    """Build an LLMProvider based on DEFAULT_PROVIDER in the environment."""
    provider = os.getenv("DEFAULT_PROVIDER", "ollama").lower()

    if provider == "openai":
        from src.core.openai_provider import OpenAIProvider
        return OpenAIProvider(os.getenv("DEFAULT_MODEL", "gpt-4o"), os.getenv("OPENAI_API_KEY"))
    if provider == "google":
        from src.core.gemini_provider import GeminiProvider
        return GeminiProvider(os.getenv("DEFAULT_MODEL", "gemini-1.5-flash"), os.getenv("GEMINI_API_KEY"))
    if provider == "local":
        from src.core.local_provider import LocalProvider
        return LocalProvider(os.getenv("LOCAL_MODEL_PATH", "./src/models/Phi-3-mini-4k-instruct-q4.gguf"))
    if provider == "ollama":
        from src.core.ollama_provider import OllamaProvider
        return OllamaProvider(os.getenv("OLLAMA_MODEL", "phi3-local"))

    raise ValueError(f"Unknown DEFAULT_PROVIDER: {provider}")
