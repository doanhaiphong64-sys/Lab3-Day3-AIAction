import React from 'react';
import { X, CreditCard, CalendarPlus, Plane, Building } from 'lucide-react';
import { Flight, Hotel } from '../types';
import { formatVND } from '../utils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: { type: 'flight'; flight: Flight } | { type: 'hotel'; hotel: Hotel } | null;
  onConfirm: (status: 'paid' | 'pending') => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, bookingData, onConfirm }) => {
  if (!isOpen || !bookingData) return null;

  const isFlight = bookingData.type === 'flight';
  const item = isFlight ? bookingData.flight : bookingData.hotel;
  const title = isFlight ? 'Xác nhận đặt vé máy bay' : 'Xác nhận đặt phòng khách sạn';
  const price = isFlight ? bookingData.flight.price : bookingData.hotel.price;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8">
            {isFlight ? (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <Plane className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{bookingData.flight.airline}</h3>
                    <p className="text-sm text-slate-500">{bookingData.flight.origin} → {bookingData.flight.destination}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm text-slate-600 border-t border-slate-200 pt-3 mt-3">
                  <span>Khởi hành: <strong>{bookingData.flight.departTime}</strong></span>
                  <span>Đến nơi: <strong>{bookingData.flight.arriveTime}</strong></span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start gap-4 mb-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <img src={bookingData.hotel.image} alt="Hotel" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 mb-1 leading-tight">{bookingData.hotel.name}</h3>
                    <p className="text-sm text-slate-500 line-clamp-1">{bookingData.hotel.location}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <span className="text-slate-600 font-medium">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-orange-500">{formatVND(price)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={() => {
                onConfirm('pending');
                onClose();
              }}
              className="flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 rounded-lg transition-colors"
            >
              <CalendarPlus className="w-5 h-5" />
              Thêm vào lịch trình
            </button>
            <button 
              onClick={() => {
                onConfirm('paid');
                onClose();
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-sm"
            >
              <CreditCard className="w-5 h-5" />
              Thanh toán ngay
            </button>
          </div>
          
          <p className="text-center text-xs text-slate-400 mt-6">
            Bằng việc tiếp tục, bạn đồng ý với Điều khoản dịch vụ & Chính sách bảo mật của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
};
