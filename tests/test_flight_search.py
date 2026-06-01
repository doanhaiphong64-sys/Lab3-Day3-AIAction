#.venv/bin/python -m pytest tests/test_flight_search.py -si

import json
from src.tools.flight_search import flight_search


def test_flight_search():
    r = flight_search("Hà Nội", "Đà Nẵng", "2026-07-04", return_date="2026-07-05", passengers=2)
    print("\n" + json.dumps(r, ensure_ascii=False, indent=2))
    assert isinstance(r, list) and len(r) > 0
