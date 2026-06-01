"""
Main entry point for Lab 3: Chatbot vs ReAct Agent.

Usage:
    # Run the chatbot baseline
    python -m src.main --mode chatbot

    # Run the ReAct agent
    python -m src.main --mode agent

    # Specify a provider
    python -m src.main --mode agent --provider local
"""
import os
import argparse
from dotenv import load_dotenv

from src.telemetry.logger import logger


def create_provider(provider_name: str, model_name: str = None):
    """
    Factory function to create an LLM provider based on name.

    Args:
        provider_name: One of "openai", "google", "local".
        model_name: Optional model name override.

    Returns:
        An LLMProvider instance.
    """
    if provider_name == "local":
        from src.core.local_provider import LocalProvider
        model_path = os.getenv("LOCAL_MODEL_PATH", "./models/Phi-3-mini-4k-instruct-q4.gguf")
        return LocalProvider(model_path=model_path)
    
    # TODO: Implement OpenAI and Gemini providers
    # elif provider_name == "openai":
    #     from src.core.openai_provider import OpenAIProvider
    #     api_key = os.getenv("OPENAI_API_KEY")
    #     model = model_name or os.getenv("DEFAULT_MODEL", "gpt-4o")
    #     return OpenAIProvider(api_key=api_key, model=model)
    #
    # elif provider_name == "google":
    #     from src.core.gemini_provider import GeminiProvider
    #     api_key = os.getenv("GEMINI_API_KEY")
    #     return GeminiProvider(api_key=api_key)

    else:
        raise ValueError(
            f"Unknown provider: '{provider_name}'. "
            f"Supported: 'local'. TODO: Implement 'openai', 'google'."
        )


def run_chatbot(provider):
    """Run the simple chatbot (no tools, no ReAct)."""
    from src.chatbot import Chatbot

    bot = Chatbot(llm=provider)

    print("=" * 60)
    print("  MODE: Simple Chatbot (Baseline)")
    print(f"  Provider: {provider}")
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


def run_agent(provider):
    """Run the ReAct Agent (with tools and reasoning loop)."""
    from src.agent.agent import ReActAgent

    # TODO: Register your tools here
    # from src.tools.tool_registry import ToolRegistry
    # registry = ToolRegistry()
    # registry.register("check_stock", "...", check_stock_fn)
    # tools = registry.get_tool_specs()

    tools = []  # Empty for now - students implement tools

    agent = ReActAgent(llm=provider, tools=tools, max_steps=5)

    print("=" * 60)
    print("  MODE: ReAct Agent")
    print(f"  Provider: {provider}")
    print(f"  Tools: {[t['name'] for t in tools] if tools else 'None (implement your tools!)'}")
    print("  Type 'quit' to exit")
    print("=" * 60)

    while True:
        user_input = input("\nYou: ").strip()
        if user_input.lower() in ("quit", "exit", "q"):
            break
        if not user_input:
            continue

        response = agent.run(user_input)
        print(f"Agent: {response}")


def main():
    load_dotenv()

    parser = argparse.ArgumentParser(description="Lab 3: Chatbot vs ReAct Agent")
    parser.add_argument(
        "--mode",
        choices=["chatbot", "agent"],
        default="chatbot",
        help="Run mode: 'chatbot' for baseline or 'agent' for ReAct (default: chatbot)"
    )
    parser.add_argument(
        "--provider",
        choices=["openai", "google", "local"],
        default=None,
        help="LLM provider to use (default: from .env DEFAULT_PROVIDER)"
    )
    parser.add_argument(
        "--model",
        default=None,
        help="Model name override (default: from .env DEFAULT_MODEL)"
    )

    args = parser.parse_args()

    # Determine provider
    provider_name = args.provider or os.getenv("DEFAULT_PROVIDER", "local")
    
    logger.log_event("APP_START", {
        "mode": args.mode,
        "provider": provider_name,
    })

    try:
        provider = create_provider(provider_name, args.model)
        
        if args.mode == "chatbot":
            run_chatbot(provider)
        else:
            run_agent(provider)

    except FileNotFoundError as e:
        print(f"\n❌ Model file not found: {e}")
        print("   Please download the model and place it in the models/ directory.")
        print("   See README.md for instructions.")
    except Exception as e:
        logger.error(f"Application error: {e}")
        print(f"\n❌ Error: {e}")
    finally:
        logger.log_event("APP_END", {})


if __name__ == "__main__":
    main()
