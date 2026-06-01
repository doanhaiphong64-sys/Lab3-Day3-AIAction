import React from 'react';
import { ItineraryItem } from '../types';
import { Plane, Building, MapPin, Calendar, Clock, Trash2, CheckCircle2 } from 'lucide-react';
import { formatVND } from '../utils';

interface ItineraryProps {
  items: ItineraryItem[];
  onRemove: (id: string) => void;
}

export const Itinerary: React.FC<ItineraryProps> = ({ items, onRemove }) => {

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-10 h-10 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Lịch trình của bạn đang trống</h2>
        <p className="text-slate-500">Hãy bắt đầu tìm kiếm và đưa các chuyến bay, khách sạn vào kế hoạch của bạn.</p>
      </div>
    );
  }

  // Sort by booking date descending
  const sortedItems = [...items].sort((a, b) => new Date(b.bookedAt).getTime() - new Date(a.bookedAt).getTime());

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Lịch trình của tôi</h2>
        <p className="text-slate-600 mt-2">Quản lý các chuyến bay và khách sạn bạn đã đặt.</p>
      </div>

      <div className="space-y-4">
        {sortedItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row gap-6 relative">
            
            {/* Delete Button */}
            <button 
              onClick={() => onRemove(item.id)}
              className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-2 rounded-lg transition-colors"
              title="Xóa khỏi lịch trình"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Icon Column */}
            <div className="shrink-0">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                item.type === 'flight' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {item.type === 'flight' ? <Plane className="w-7 h-7" /> : <Building className="w-7 h-7" />}
              </div>
            </div>

            {/* Content Column */}
            <div className="flex-1 w-full pl-0 sm:pl-2">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                  item.type === 'flight' ? 'text-blue-600' : 'text-emerald-600'
                }`}>
                  {item.type === 'flight' ? 'Chuyến bay' : 'Khách sạn'}
                </span>
                <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                  • Đặt lúc: {new Date(item.bookedAt).toLocaleString('vi-VN')}
                </span>
                {item.status === 'paid' && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" /> Đã thanh toán
                  </span>
                )}
                {item.status === 'pending' && (
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    <Clock className="w-3 h-3" /> Chờ thanh toán
                  </span>
                )}
              </div>

              {item.type === 'flight' && item.flight && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {item.flight.origin} → {item.flight.destination}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Khởi hành</p>
                      <p className="text-slate-800 font-bold flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" /> {item.flight.departTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1 font-bold">Đến nơi</p>
                      <p className="text-slate-800 font-bold flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-400" /> {item.flight.arriveTime}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-600 font-medium">{item.flight.airline}</span>
                    <span className="font-bold text-slate-800">{formatVND(item.flight.price)}</span>
                  </div>
                </div>
              )}

              {item.type === 'hotel' && item.hotel && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {item.hotel.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-600 mt-2 mb-4">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{item.hotel.location}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-slate-600 font-medium flex items-center gap-2">
                      <div className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded font-bold">
                        {item.hotel.rating} Sao
                      </div>
                    </span>
                    <span className="font-bold text-slate-800">{formatVND(item.hotel.price)} / đêm</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
