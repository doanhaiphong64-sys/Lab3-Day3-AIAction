from ._web import web_search


def evening_entertainment_search(location, near=None, target_audience=None, max_budget_per_person=None):
    q = f"hoạt động vui chơi giải trí buổi tối {location}"
    if near:
        q += f" gần {near}"
    if target_audience:
        q += f" cho {target_audience}"
    return web_search(q)


TOOL = {
    "name": "evening_entertainment_search",
    "description": "Tìm hoạt động vui chơi giải trí buổi tối. Nếu đã chọn khách sạn, truyền tên khách sạn vào `near` để chỉ tìm địa điểm gần đó. Args: location, near, target_audience, max_budget_per_person.",
    "func": evening_entertainment_search,
}
