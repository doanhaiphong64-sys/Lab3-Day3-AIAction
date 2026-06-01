import sys
from dotenv import load_dotenv
from src.core.provider_factory import get_provider
from src.agent.agent import ReActAgent
from src.tools import TOOLS


def main():
    load_dotenv()
    llm = get_provider()
    agent = ReActAgent(llm, TOOLS)

    query = " ".join(sys.argv[1:]) or input("Nhập yêu cầu: ")
    print(f"\n[Provider: {llm.model_name}]\n")
    print(agent.run(query))


if __name__ == "__main__":
    main()
