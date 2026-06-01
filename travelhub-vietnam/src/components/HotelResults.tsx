import React from 'react';
import { Hotel, SearchCriteria } from '../types';
import { MOCK_HOTELS } from '../data';
import { formatVND } from '../utils';
import { MapPin, Star, Wifi, Coffee, Waves } from 'lucide-react';

interface HotelResultsProps {
  criteria: SearchCriteria;
  onBook: (hotel: Hotel) => void;
}

export const HotelResults: React.FC<HotelResultsProps> = ({ criteria, onBook }) => {
  const hotels = MOCK_HOTELS(criteria.destination || '');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Kết quả tìm kiếm khách sạn</h2>
        <div className="flex items-center gap-3 text-slate-600 font-medium">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span>{criteria.destination || 'Đà Nẵng'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2"></span>
          <span>{criteria.date ? new Date(criteria.date).toLocaleDateString('vi-VN') : 'Mọi lúc'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2"></span>
          <span>{criteria.guests || 2} Khách</span>
        </div>
      </div>

      <div className="space-y-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
            
            {/* Image */}
            <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden relative">
              <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-500" />
            </div>

            {/* Content */}
            <div className="p-6 w-full md:w-2/3 flex flex-col justify-between">
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 leading-tight">{hotel.name}</h3>
                  <div className="flex items-center gap-1 mt-2 text-sm text-slate-600">
                    <MapPin className="w-3.5 h-3.5" /> {hotel.location}
                  </div>
                  <div className="flex items-center mt-2 space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < hotel.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <div className="flex gap-4 mt-4 text-slate-500">
                    <div className="flex items-center gap-1 text-xs"><Wifi className="w-3.5 h-3.5" /> Wifi miễn phí</div>
                    <div className="flex items-center gap-1 text-xs"><Coffee className="w-3.5 h-3.5" /> Bao gồm bữa sáng</div>
                    <div className="flex items-center gap-1 text-xs"><Waves className="w-3.5 h-3.5" /> Hồ bơi</div>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Giá mỗi đêm</p>
                  <p className="text-2xl font-bold text-orange-500">{formatVND(hotel.price)}</p>
                  <p className="text-xs text-slate-400 mt-1">Đã bao gồm thuế</p>
                  
                  <button 
                    onClick={() => onBook(hotel)}
                    className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-sm"
                  >
                    Đặt phòng
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};
