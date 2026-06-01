import React from 'react';
import { Destination } from '../types';
import { ArrowLeft, MapPin, Compass, Camera } from 'lucide-react';

interface DestinationDetailProps {
  destination: Destination;
  onBack: () => void;
  onSearchFlights: (dest: string) => void;
  onSearchHotels: (dest: string) => void;
}

export const DestinationDetail: React.FC<DestinationDetailProps> = ({ destination, onBack, onSearchFlights, onSearchHotels }) => {
  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Hero Banner */}
      <div 
        className="w-full h-[500px] relative bg-slate-900"
      >
        <div className="absolute inset-0">
          <img src={destination.image} alt={destination.name} className="w-full h-full object-cover opacity-60" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
        
        <div className="absolute top-8 left-8 z-10">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm transition-all text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-400 mb-4">
                <MapPin className="w-5 h-5" />
                <span className="font-bold tracking-widest uppercase text-sm">Điểm đến nổi bật</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">{destination.name}</h1>
              <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
                {destination.description || 'Khám phá vẻ đẹp kỳ diệu và văn hóa độc đáo của địa phương.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Compass className="w-6 h-6 text-blue-600" /> Trải nghiệm không thể bỏ lỡ
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destination.topAttractions?.map((attr, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <Camera className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-slate-700">{attr}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
             <div className="relative z-10">
               <h3 className="text-2xl font-bold mb-2">Sẵn sàng khám phá {destination.name}?</h3>
               <p className="text-blue-100 mb-8 max-w-md">Lên kế hoạch ngay hôm nay để nhận được mức giá tốt nhất cho chuyến bay và khách sạn.</p>
               
               <div className="flex flex-col sm:flex-row gap-4">
                 <button 
                  onClick={() => onSearchFlights(destination.name)}
                  className="bg-white text-blue-600 hover:bg-slate-50 font-bold py-3 px-6 rounded-lg transition-colors shadow-lg"
                 >
                   Tìm vé máy bay
                 </button>
                 <button 
                  onClick={() => onSearchHotels(destination.name)}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-colors border border-blue-500 shadow-lg"
                 >
                   Tìm khách sạn
                 </button>
               </div>
             </div>
             <div className="absolute right-[-10%] top-[-10%] w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 pb-4 border-b border-slate-200 text-lg">Thông tin du lịch</h3>
            <div className="space-y-6">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Thời tiết lý tưởng</span>
                <span className="font-medium text-slate-700">Tháng 3 - Tháng 8</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Phương tiện di chuyển</span>
                <span className="font-medium text-slate-700">Máy bay, Taxi, Xe máy thuê</span>
              </div>
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Ưu đãi hiện có</span>
                <span className="font-bold text-orange-500">{destination.deals} chương trình khuyến mãi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
