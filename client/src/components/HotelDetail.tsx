import React, { useState } from 'react';
import { Hotel, Room } from '../types';
import { MapPin, Star, Wifi, Coffee, Waves, Check, ArrowLeft, Users, BedDouble } from 'lucide-react';
import { formatVND } from '../utils';

interface HotelDetailProps {
  hotel: Hotel;
  onBack: () => void;
  onBookRoom: (hotel: Hotel, room: Room) => void;
}

export const HotelDetail: React.FC<HotelDetailProps> = ({ hotel, onBack, onBookRoom }) => {
  const [activeImage, setActiveImage] = useState(hotel.image);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header & Breadcrumb */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại kết quả tìm kiếm
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-1 rounded uppercase tracking-widest">Khách sạn</span>
            <div className="flex items-center text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < hotel.rating ? 'fill-current' : 'text-slate-200'}`} />
              ))}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">{hotel.name}</h1>
          <p className="flex items-center gap-1.5 text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" /> {hotel.location}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Giá từ</p>
          <p className="text-3xl font-bold text-orange-500">{formatVND(hotel.price)}</p>
          <p className="text-sm text-slate-500">/ đêm</p>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-12">
        <div className="lg:col-span-2 h-[400px] rounded-2xl overflow-hidden">
          <img src={activeImage} alt={hotel.name} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-[400px]">
          {(hotel.images || [hotel.image, hotel.image]).slice(0, 2).map((img, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl overflow-hidden h-full cursor-pointer border-2 ${activeImage === img ? 'border-blue-500' : 'border-transparent'}`}
              onClick={() => setActiveImage(img)}
            >
              <img src={img} alt={`${hotel.name} ${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Details layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* About */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Giới thiệu</h2>
            <p className="text-slate-600 leading-relaxed">{hotel.description || 'Đang cập nhật thông tin giới thiệu.'}</p>
          </section>

          {/* Amenities */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-slate-800 mb-4 pb-2 border-b border-slate-200">Tiện nghi nổi bật</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {hotel.amenities?.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-3 text-slate-600">
                  <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </span>
                  <span className="font-medium text-sm">{amenity}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Rooms */}
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6 pb-2 border-b border-slate-200">Các loại phòng</h2>
            <div className="space-y-6">
              {hotel.rooms?.map(room => (
                <div key={room.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto border-r border-slate-100">
                    <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6 md:w-2/3 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{room.name}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-1.5"><BedDouble className="w-4 h-4 text-slate-400"/> {room.bedType}</div>
                        <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-slate-400"/> Tối đa {room.maxGuests} khách</div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.map((am, i) => (
                           <span key={i} className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-600 rounded">
                             {am}
                           </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-6 pt-4 border-t border-slate-100">
                      <div>
                        <p className="text-2xl font-bold text-orange-500">{formatVND(room.price)}</p>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">/ Đêm</p>
                      </div>
                      <button 
                        onClick={() => onBookRoom(hotel, room)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                      >
                        Đặt ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4 pb-4 border-b border-slate-200">Thông tin hữu ích</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500">Nhận phòng</span>
                <span className="font-bold text-slate-800">Từ 14:00</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500">Trả phòng</span>
                <span className="font-bold text-slate-800">Trước 12:00</span>
              </li>
              <li className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-slate-500">Lễ tân</span>
                <span className="font-bold text-slate-800">24/7</span>
              </li>
              <li className="flex justify-between items-center pb-2">
                <span className="text-slate-500">Hủy phòng</span>
                <span className="font-bold text-emerald-600">Miễn phí trước 3 ngày</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
