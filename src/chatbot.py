import os
from typing import Optional
from src.core.llm_provider import LLMProvider
from src.telemetry.logger import logger


class Chatbot:
    """
    SKELETON: A simple LLM Chatbot baseline (no tools, no reasoning loop).
    
    This serves as the BASELINE to compare against the ReAct Agent.
    The chatbot can only generate responses from the LLM directly,
    without access to external tools or multi-step reasoning.
    
    Key Limitation: Cannot perform multi-step tasks like:
    - "Find the cheapest price and calculate total cost with 10% tax"
    - "Check stock, apply coupon, and calculate shipping"
    """

    def __init__(self, llm: LLMProvider):
        self.llm = llm
        self.conversation_history = []

    def get_system_prompt(self) -> str:
        """
        System prompt for the chatbot.
        Unlike the Agent, this has NO tool descriptions or ReAct format instructions.
        """
        return """You are a helpful assistant. Answer the user's questions to the best of your ability.
If you don't know something, say so honestly. Do not make up information."""

    def chat(self, user_input: str) -> str:
        """
        Send a message to the chatbot and get a response.
        
        This is a simple single-turn interaction:
        User -> LLM -> Response (no tools, no reasoning loop).

        Args:
            user_input: The user's message.

        Returns:
            The chatbot's response string.
        """
        logger.log_event("CHATBOT_REQUEST", {
            "input": user_input,
            "model": self.llm.model_name,
        })

        try:
            result = self.llm.generate(
                prompt=user_input,
                system_prompt=self.get_system_prompt()
            )

            response_text = result.get("content", "")
            
            # Track conversation history
            self.conversation_history.append({
                "role": "user",
                "content": user_input
            })
            self.conversation_history.append({
                "role": "assistant",
                "content": response_text
            })

            logger.log_event("CHATBOT_RESPONSE", {
                "output": response_text[:200],  # Log first 200 chars
                "usage": result.get("usage", {}),
                "latency_ms": result.get("latency_ms", 0),
                "provider": result.get("provider", "unknown"),
            })

            return response_text

        except Exception as e:
            logger.error(f"Chatbot error: {e}")
            return f"Error: {e}"

    def stream_chat(self, user_input: str):
        """
        Stream a chatbot response token by token.
        
        Yields:
            Individual tokens of the response.
        """
        logger.log_event("CHATBOT_STREAM_START", {"input": user_input})
        
        try:
            for token in self.llm.stream(
                prompt=user_input,
                system_prompt=self.get_system_prompt()
            ):
                yield token
        except Exception as e:
            logger.error(f"Chatbot stream error: {e}")
            yield f"Error: {e}"

    def reset(self):
        """Clear conversation history."""
        self.conversation_history = []
        logger.log_event("CHATBOT_RESET", {})


if __name__ == "__main__":
    """
    Quick test: Run the chatbot directly.
    Usage: python -m src.chatbot
    """
    from dotenv import load_dotenv
    load_dotenv()

    provider_name = os.getenv("DEFAULT_PROVIDER", "local")

    if provider_name == "local":
        from src.core.local_provider import LocalProvider
        model_path = os.getenv("LOCAL_MODEL_PATH", "./models/Phi-3-mini-4k-instruct-q4.gguf")
        llm = LocalProvider(model_path=model_path)
    else:
        print(f"Provider '{provider_name}' not yet implemented. Use 'local' or implement your own.")
        exit(1)

    bot = Chatbot(llm=llm)
    
    print("=" * 60)
    print("  Simple Chatbot (Baseline) - No Tools, No ReAct")
    print("  Type 'quit' to exit")
    print("=" * 60)

    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in ("quit", "exit", "q"):
            break
        if not user_input:
            continue
        
        print("Bot: ", end="", flush=True)
        for token in bot.stream_chat(user_input):
            print(token, end="", flush=True)
        print()
