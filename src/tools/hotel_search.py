from ._web import web_search


def hotel_search(location, checkin=None, checkout=None, max_price=None, amenities=None, near=None):
    q = f"khách sạn {location}"
    if near:
        q += f" gần {near}"
    if amenities:
        q += " " + " ".join(amenities)
    if max_price:
        q += f" giá dưới {max_price}"
    return web_search(q)


TOOL = {
    "name": "hotel_search",
    "description": "Tìm khách sạn theo địa điểm, giá tối đa, tiện ích và vị trí. Phải dùng cùng điểm đến và ngày với chuyến bay đã chọn: location = điểm đến của flight, checkin = ngày đi, checkout = ngày về. Args: location, checkin, checkout, max_price, amenities, near.",
    "func": hotel_search,
}
