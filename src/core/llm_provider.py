from abc import ABC, abstractmethod
from typing import Dict, Any, Optional, Generator


class LLMProvider(ABC):
    """
    Abstract Base Class for all LLM providers.
    Defines the interface that all providers (OpenAI, Gemini, Local) must implement.
    
    This enables the Provider Pattern: swap between different LLMs
    without changing the agent or chatbot logic.
    """

    def __init__(self, model_name: str):
        self._model_name = model_name

    @property
    def model_name(self) -> str:
        """Returns the name/identifier of the model being used."""
        return self._model_name

    @abstractmethod
    def generate(self, prompt: str, system_prompt: Optional[str] = None) -> Dict[str, Any]:
        """
        Generate a complete response from the LLM.

        Args:
            prompt: The user's input prompt.
            system_prompt: Optional system-level instructions for the model.

        Returns:
            A dictionary containing:
            - "content" (str): The generated text response.
            - "usage" (dict): Token usage statistics with keys:
                - "prompt_tokens" (int)
                - "completion_tokens" (int)
                - "total_tokens" (int)
            - "latency_ms" (int): Response time in milliseconds.
            - "provider" (str): Name of the provider (e.g., "openai", "gemini", "local").
        """
        pass

    @abstractmethod
    def stream(self, prompt: str, system_prompt: Optional[str] = None) -> Generator[str, None, None]:
        """
        Stream the response token by token from the LLM.

        Args:
            prompt: The user's input prompt.
            system_prompt: Optional system-level instructions for the model.

        Yields:
            Individual tokens/chunks of the generated response.
        """
        pass

    def __repr__(self) -> str:
        return f"{self.__class__.__name__}(model={self._model_name})"
