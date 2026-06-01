from ._web import web_search


def flight_search(origin, destination, departure_date, return_date=None, passengers=1):
    q = f"giá vé máy bay {origin} đi {destination} ngày {departure_date}"
    if return_date:
        q += f" khứ hồi về {return_date}"
    return web_search(q)


TOOL = {
    "name": "flight_search",
    "description": "Tìm thông tin giá vé máy bay giữa 2 thành phố vào ngày cụ thể. Args: origin, destination, departure_date, return_date, passengers.",
    "func": flight_search,
}
