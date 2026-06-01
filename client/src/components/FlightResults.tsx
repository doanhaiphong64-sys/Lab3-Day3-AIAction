import React from 'react';
import { Flight, SearchCriteria } from '../types';
import { MOCK_FLIGHTS } from '../data';
import { formatVND } from '../utils';
import { Plane, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

interface FlightResultsProps {
  criteria: SearchCriteria;
  onBook: (flight: Flight) => void;
}

export const FlightResults: React.FC<FlightResultsProps> = ({ criteria, onBook }) => {
  const flights = MOCK_FLIGHTS(criteria.origin || '', criteria.destination || '');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Kết quả tìm kiếm vé máy bay</h2>
        <div className="flex items-center gap-3 text-slate-600 font-medium">
          <span>{criteria.origin || 'Hà Nội'}</span>
          <ArrowRight className="w-4 h-4 text-blue-500" />
          <span>{criteria.destination || 'TP. Hồ Chí Minh'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2"></span>
          <span>{criteria.date ? new Date(criteria.date).toLocaleDateString('vi-VN') : 'Mọi lúc'}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mx-2"></span>
          <span>{criteria.guests || 1} Hành khách</span>
        </div>
      </div>

      <div className="space-y-4">
        {flights.map((flight) => (
          <div key={flight.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Airline Info */}
            <div className="flex items-center gap-4 w-full md:w-1/4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Plane className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-800">{flight.airline}</p>
                <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> An toàn
                </p>
              </div>
            </div>

            {/* Time Info */}
            <div className="flex items-center justify-between w-full md:w-2/4 px-4 relative">
              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">{flight.departTime}</p>
                <p className="text-sm text-slate-500">{flight.origin}</p>
              </div>
              
              <div className="flex-1 px-4 flex flex-col items-center">
                <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Bay thẳng</p>
                <div className="relative w-full flex items-center">
                   <div className="w-2 h-2 rounded-full border-2 border-blue-200 bg-white z-10" />
                   <div className="h-px bg-slate-200 flex-1 relative">
                      <Plane className="w-4 h-4 text-slate-300 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2" />
                   </div>
                   <div className="w-2 h-2 rounded-full bg-blue-500 z-10" />
                </div>
              </div>

              <div className="text-center">
                <p className="text-xl font-bold text-slate-800">{flight.arriveTime}</p>
                <p className="text-sm text-slate-500">{flight.destination}</p>
              </div>
            </div>

            {/* Price & Action */}
            <div className="w-full md:w-1/4 flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 text-right">
              <div className="text-left md:text-right">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Giá vé</p>
                <p className="text-2xl font-bold text-orange-500">{formatVND(flight.price)}</p>
                <p className="text-xs text-slate-400 mt-1">/ khách</p>
              </div>
              <button 
                onClick={() => onBook(flight)}
                className="mt-0 md:mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors min-w-[120px] shadow-sm"
              >
                Chọn
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
