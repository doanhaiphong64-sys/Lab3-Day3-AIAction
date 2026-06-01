import os
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()
_client = None


def web_search(query: str, max_results: int = 5) -> list[dict]:
    """Search the web via Tavily. Returns list of {title, url, content}."""
    global _client
    if _client is None:
        key = os.getenv("TAVILY_API_KEY")
        if not key:
            return [{"error": "TAVILY_API_KEY chưa được set trong .env"}]
        _client = TavilyClient(api_key=key)
    try:
        results = _client.search(query, max_results=max_results)["results"]
        return [{"title": r["title"], "url": r["url"], "content": r["content"]} for r in results]
    except Exception as e:
        return [{"error": str(e)}]
