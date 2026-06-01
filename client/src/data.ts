import { Flight, Hotel, Destination, Room } from '../types';

export const FEATURED_DESTINATIONS: Destination[] = [
  { 
    id: 'd1', 
    name: 'Đà Nẵng', 
    image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    deals: 215,
    description: 'Thành phố biển xinh đẹp với những bãi cát trắng mịn, cầu Rồng độc đáo và ẩm thực phong phú. Phù hợp cho những kỳ nghỉ dưỡng cùng gia đình.',
    topAttractions: ['Bà Nà Hills', 'Bán đảo Sơn Trà', 'Cầu Rồng', 'Ngũ Hành Sơn', 'Cù lao Chàm']
  },
  { 
    id: 'd2', 
    name: 'Phú Quốc', 
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    deals: 142,
    description: 'Đảo ngọc Phú Quốc mang đến trải nghiệm du lịch biển đảo tuyệt vời với những rạn san hô rực rỡ, bãi tắm đẹp và các khu vui chơi giải trí đẳng cấp.',
    topAttractions: ['VinWonders Phú Quốc', 'Grand World', 'Bãi Sao', 'Nhà tù Phú Quốc']
  },
  { 
    id: 'd3', 
    name: 'Đà Lạt', 
    image: 'https://images.unsplash.com/photo-1598375806283-e18e3beab6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    deals: 89,
    description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm, những đồi thông thơ mộng và các kiến trúc mang đậm dấu ấn Pháp cổ kính.',
    topAttractions: ['Thung lũng Tình Yêu', 'Hồ Tuyền Lâm', 'Đỉnh Langbiang', 'Chợ đêm Đà Lạt']
  },
  { 
    id: 'd4', 
    name: 'Nha Trang', 
    image: 'https://images.unsplash.com/photo-1582236814986-e9df25eed7b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', 
    deals: 174,
    description: 'Nổi tiếng với vịnh biển đẹp nhất thế giới, Nha Trang hấp dẫn du khách bởi những bãi tắm trải dài, dịch vụ lặn biển và các khu resort sang trọng.',
    topAttractions: ['Vinpearl Land', 'Hòn Mun', 'Tháp Bà Ponagar', 'Chợ Đầm']
  },
];

export const MOCK_FLIGHTS = (origin: string, dest: string): Flight[] => [
  {
    id: 'f1', 
    airline: 'Vietnam Airlines', 
    origin: origin || 'Hà Nội', 
    destination: dest || 'TP. Hồ Chí Minh',
    departTime: '08:00', 
    arriveTime: '10:15', 
    price: 1500000
  },
  {
    id: 'f2', 
    airline: 'VietJet Air', 
    origin: origin || 'Hà Nội', 
    destination: dest || 'TP. Hồ Chí Minh',
    departTime: '11:20', 
    arriveTime: '13:30', 
    price: 950000
  },
  {
    id: 'f3', 
    airline: 'Bamboo Airways', 
    origin: origin || 'Hà Nội', 
    destination: dest || 'TP. Hồ Chí Minh',
    departTime: '15:00', 
    arriveTime: '17:10', 
    price: 1350000
  },
  {
    id: 'f4', 
    airline: 'Vietnam Airlines', 
    origin: origin || 'Hà Nội', 
    destination: dest || 'TP. Hồ Chí Minh',
    departTime: '19:30', 
    arriveTime: '21:45', 
    price: 1200000
  }
];

const mockRooms: Room[] = [
  {
    id: 'r1',
    name: 'Phòng Superior Double',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Superior',
    bedType: '1 Giường đôi',
    maxGuests: 2,
    price: 1100000,
    amenities: ['Wifi miễn phí', 'Điều hòa', 'Phòng tắm riêng', 'TV hướng cáp', 'Minibar']
  },
  {
    id: 'r2',
    name: 'Phòng Deluxe Ocean View',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Deluxe',
    bedType: '1 Giường King',
    maxGuests: 2,
    price: 1850000,
    amenities: ['View biển', 'Wifi miễn phí', 'Ban công', 'Bồn tắm', 'Phục vụ bữa sáng']
  },
  {
    id: 'r3',
    name: 'Suite Gia đình',
    image: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Suite',
    bedType: '1 Giường King & 2 Giường đơn',
    maxGuests: 4,
    price: 3200000,
    amenities: ['View toàn cảnh', 'Không gian rộng rãi', 'Phòng khách riêng', 'Bồn tắm massage', 'Wifi miễn phí']
  }
];

export const MOCK_HOTELS = (location: string): Hotel[] => [
  {
    id: 'h1', 
    name: 'Vinpearl Luxury Hotel', 
    location: location || 'Đà Nẵng', 
    rating: 5, 
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Khu nghi dưỡng cao cấp với kiến trúc hiện đại, tọa lạc ngay bên bãi biển tuyệt đẹp. Tận hưởng dịch vụ 5 sao với hồ bơi vô cực, nhà hàng ẩm thực quốc tế và spa thư giãn.',
    amenities: ['Hồ bơi vô cực', 'Spa & Massage', 'Phòng Gym', 'Nhà hàng 5 sao', 'Đưa đón sân bay', 'Wifi miễn phí'],
    rooms: mockRooms.map(r => ({ ...r, price: r.price * 1.5 }))
  },
  {
    id: 'h2', 
    name: 'Mường Thanh Holiday Resort', 
    location: location || 'Đà Nẵng', 
    rating: 4, 
    price: 1100000,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c0d588fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c0d588fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Mang đến không gian nghỉ dưỡng truyền thống pha lẫn sự hiện đại. Khách sạn có các tiện ích đầy đủ phù hợp cho kỳ nghỉ dài ngày cùng người thân.',
    amenities: ['Bãi đỗ xe', 'Hồ bơi ngoài trời', 'Buffet sáng', 'Quầy bar', 'Wifi miễn phí'],
    rooms: mockRooms
  },
  {
    id: 'h3', 
    name: 'Sea View Boutique', 
    location: location || 'Đà Nẵng', 
    rating: 4, 
    price: 850000,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Thiết kế Boutique độc đáo, các phòng đều có tầm nhìn ra biển yên tĩnh, lý tưởng cho những cặp đôi mong muốn sự riêng tư và lãng mạn.',
    amenities: ['View biển', 'Phòng tắm sang trọng', 'Dịch vụ phòng 24/7', 'Wifi miễn phí'],
    rooms: mockRooms.map(r => ({ ...r, price: r.price * 0.8 }))
  },
  {
    id: 'h4', 
    name: 'InterContinental Resort', 
    location: location || 'Đà Nẵng', 
    rating: 5, 
    price: 5400000,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Trải nghiệm đỉnh cao của sự sang trọng, ẩn mình giữa bán đảo Sơn Trà nguyên sơ. Phục vụ chuyên biệt đẳng cấp quốc tế.',
    amenities: ['Bãi biển riêng', 'Sân Golf', 'Helipad', 'Nhà hàng Michelin', 'Dịch vụ Butler', 'Spa hạng sang'],
    rooms: mockRooms.map(r => ({ ...r, price: r.price * 2.5 }))
  }
];
