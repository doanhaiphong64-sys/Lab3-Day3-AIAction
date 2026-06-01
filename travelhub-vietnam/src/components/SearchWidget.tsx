import React, { useState } from 'react';
import { Plane, Building, MapPin, Calendar as CalendarIcon, Users, Search } from 'lucide-react';
import { SearchCriteria } from '../types';

interface SearchWidgetProps {
  onSearch: (type: 'flights' | 'hotels', criteria: SearchCriteria) => void;
}

export const SearchWidget: React.FC<SearchWidgetProps> = ({ onSearch }) => {
  const [tab, setTab] = useState<'flights' | 'hotels'>('flights');
  const [origin, setOrigin] = useState('Hà Nội');
  const [destination, setDestination] = useState('Đà Nẵng');
  const [date, setDate] = useState('2024-06-15');
  const [guests, setGuests] = useState(2);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(tab, { origin, destination, date, guests });
  };

  return (
    <div className="w-full max-w-4xl mx-auto -mt-24 relative z-10 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 border border-slate-100">
        
        {/* Tabs */}
        <div className="flex gap-6 mb-6 border-b border-slate-200">
          <button
            onClick={() => setTab('flights')}
            className={`flex items-center gap-2 pb-3 font-semibold transition-all ${
              tab === 'flights' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            Vé máy bay
          </button>
          <button
            onClick={() => setTab('hotels')}
            className={`flex items-center gap-2 pb-3 font-semibold transition-all ${
              tab === 'hotels' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            Khách sạn
          </button>
        </div>

        {/* Forms */}
        <form onSubmit={handleSearch} className="space-y-4">
          {tab === 'flights' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative col-span-1 md:col-span-1 border border-slate-200 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ĐIỂM ĐI</label>
                <div className="flex items-center gap-2">
                  <Plane className="w-4 h-4 text-slate-400 -rotate-45" />
                  <input 
                    type="text" 
                    value={origin} 
                    onChange={e => setOrigin(e.target.value)}
                    className="w-full text-slate-800 font-medium focus:outline-none bg-transparent" 
                    placeholder="Chọn điểm đi" 
                    required
                  />
                </div>
              </div>

              <div className="relative col-span-1 md:col-span-1 border border-slate-200 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ĐIỂM ĐẾN</label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={destination} 
                    onChange={e => setDestination(e.target.value)}
                    className="w-full text-slate-800 font-medium focus:outline-none bg-transparent" 
                    placeholder="Chọn điểm đến" 
                    required
                  />
                </div>
              </div>

              <div className="relative col-span-1 border border-slate-200 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">NGÀY ĐI</label>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full text-slate-800 font-medium focus:outline-none bg-transparent" 
                    required
                  />
                </div>
              </div>

              <div className="relative col-span-1 border border-slate-200 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">HÀNH KHÁCH</label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    min="1" 
                    value={guests}
                    onChange={e => setGuests(parseInt(e.target.value))}
                    className="w-full text-slate-800 font-medium focus:outline-none bg-transparent" 
                    required
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative col-span-1 md:col-span-1 border border-slate-200 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">ĐIỂM ĐẾN</label>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    value={destination} 
                    onChange={e => setDestination(e.target.value)}
                    className="w-full text-slate-800 font-medium focus:outline-none bg-transparent" 
                    placeholder="Thành phố, địa điểm" 
                    required
                  />
                </div>
              </div>

              <div className="relative col-span-1 border border-slate-200 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">NHẬN PHÒNG</label>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-slate-400" />
                  <input 
                    type="date" 
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full text-slate-800 font-medium focus:outline-none bg-transparent" 
                    required
                  />
                </div>
              </div>

              <div className="relative col-span-1 border border-slate-200 rounded-md p-3 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">SỐ KHÁCH</label>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <input 
                    type="number" 
                    min="1" 
                    value={guests}
                    onChange={e => setGuests(parseInt(e.target.value))}
                    className="w-full text-slate-800 font-medium focus:outline-none bg-transparent" 
                    required
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-3 rounded-lg font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Search className="w-5 h-5" />
              Tìm kiếm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
