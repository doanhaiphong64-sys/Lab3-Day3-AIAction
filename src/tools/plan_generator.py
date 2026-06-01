def plan_generator(duration, hotel=None, evening_activities=None, flight_times=None):
    """Tổng hợp dữ liệu các bước trước thành 1 lịch trình. Không gọi web."""
    return {
        "duration": duration,
        "hotel": hotel,
        "evening_activities": evening_activities or [],
        "flight_times": flight_times or {},
    }


TOOL = {
    "name": "plan_generator",
    "description": "Tổng hợp chuyến bay, khách sạn và hoạt động đã chọn thành một lịch trình. Args: duration, hotel, evening_activities, flight_times.",
    "func": plan_generator,
}
