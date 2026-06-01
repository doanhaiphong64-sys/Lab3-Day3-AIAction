/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewState, SearchCriteria, Flight, Hotel, ItineraryItem, Room, Destination } from './types';
import { Navbar } from './components/Navbar';
import { SearchWidget } from './components/SearchWidget';
import { FlightResults } from './components/FlightResults';
import { HotelResults } from './components/HotelResults';
import { Itinerary } from './components/Itinerary';
import { AuthModal } from './components/AuthModal';
import { ChatWidget } from './components/ChatWidget';
import { HotelDetail } from './components/HotelDetail';
import { DestinationDetail } from './components/DestinationDetail';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { FEATURED_DESTINATIONS, MOCK_HOTELS } from './data';
import { ArrowRight, Star } from 'lucide-react';
import { formatVND } from './utils';

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({});
  
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);

  const [bookingModalState, setBookingModalState] = useState<{
    isOpen: boolean;
    data: { type: 'flight'; flight: Flight } | { type: 'hotel'; hotel: Hotel } | null;
  }>({ isOpen: false, data: null });

  const [itinerary, setItinerary] = useState<ItineraryItem[]>(() => {
    const saved = localStorage.getItem('travelhub_itinerary');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage when itinerary changes
  useEffect(() => {
    localStorage.setItem('travelhub_itinerary', JSON.stringify(itinerary));
  }, [itinerary]);

  const handleSearch = (type: 'flights' | 'hotels', criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    setView(type === 'flights' ? 'flight_results' : 'hotel_results');
  };

  const handleBookFlight = (flight: Flight) => {
    setBookingModalState({
      isOpen: true,
      data: { type: 'flight', flight }
    });
  };

  const handleBookHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setView('hotel_detail');
  };

  const handleBookRoom = (hotel: Hotel, room: Room) => {
    setBookingModalState({
      isOpen: true,
      data: { type: 'hotel', hotel: { ...hotel, price: room.price, name: `${hotel.name} - ${room.name}` } }
    });
  };

  const confirmBooking = (status: 'paid' | 'pending') => {
    if (!bookingModalState.data) return;

    let newItem: ItineraryItem;
    if (bookingModalState.data.type === 'flight') {
      newItem = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'flight',
        flight: bookingModalState.data.flight,
        bookedAt: new Date().toISOString(),
        status
      };
    } else {
      newItem = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'hotel',
        hotel: bookingModalState.data.hotel,
        bookedAt: new Date().toISOString(),
        status
      };
    }

    setItinerary([...itinerary, newItem]);
    setView('itinerary');
  };

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestination(dest);
    setView('destination_detail');
  };

  const handleRemoveItem = (id: string) => {
    setItinerary(itinerary.filter(i => i.id !== id));
  };

  const handleOpenAuth = (type: 'login' | 'register') => {
    setAuthView(type);
    setIsAuthOpen(true);
  };

  if (view === 'admin_dashboard') {
    return <AdminDashboard onExit={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen font-sans bg-slate-50 flex flex-col">
      <Navbar currentView={view} setView={setView} onOpenAuth={handleOpenAuth} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialView={authView} />
      <BookingModal 
        isOpen={bookingModalState.isOpen} 
        onClose={() => setBookingModalState({ isOpen: false, data: null })} 
        bookingData={bookingModalState.data}
        onConfirm={confirmBooking}
      />
      <ChatWidget />
      
      <main className="flex-grow">
        {/* Dynamic Hero Section based on View */}
        {view === 'home' && (
          <div className="relative">
            {/* Hero Banner */}
            <div 
              className="h-[400px] bg-blue-600 bg-cover bg-center relative"
              style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2070)' }}
            >
              <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent"></div>
              
              <div className="relative z-10 max-w-4xl mx-auto px-4 pt-24 text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Khám phá thế giới cùng TravelHub
                </h1>
                <p className="text-lg text-white/90 font-medium drop-shadow-md">
                  Đặt vé máy bay, phòng khách sạn và trải nghiệm tuyệt vời.
                </p>
              </div>
            </div>

            {/* Search Widget Component mounts overlapping the hero banner */}
            <SearchWidget onSearch={handleSearch} />
            
            {/* Featured Destinations & Hotels */}
            <div className="max-w-5xl mx-auto px-8 py-16">
              
              {/* Destinations */}
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Điểm đến thịnh hành</h2>
                  <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    Xem tất cả <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {FEATURED_DESTINATIONS.map(dest => (
                    <div 
                      key={dest.id} 
                      className="group cursor-pointer rounded-2xl overflow-hidden relative aspect-square shadow-sm"
                      onClick={() => handleSelectDestination(dest)}
                    >
                      <img 
                        src={dest.image} 
                        alt={dest.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-5 w-full">
                        <h3 className="text-xl font-bold text-white mb-1">{dest.name}</h3>
                        <p className="text-white/80 text-sm font-medium">{dest.deals} ưu đãi chuyến bay</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promoted Hotels */}
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-slate-800">Khách sạn được yêu thích</h2>
                  <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
                    Khám phá thêm <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {MOCK_HOTELS('').slice(0, 2).map(hotel => (
                     <div 
                       key={hotel.id} 
                       className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row group cursor-pointer"
                       onClick={() => handleBookHotel(hotel)}
                     >
                       <div className="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                         <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                       </div>
                       <div className="p-5 sm:w-3/5 flex flex-col justify-between">
                         <div>
                           <div className="flex items-center justify-between mb-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{hotel.location}</span>
                             <div className="flex items-center gap-1 text-yellow-500">
                               <Star className="w-3.5 h-3.5 fill-current" />
                               <span className="text-xs font-bold text-slate-700">{hotel.rating}.0</span>
                             </div>
                           </div>
                           <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">{hotel.name}</h3>
                         </div>
                         <div className="text-right mt-4">
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Bắt đầu từ</p>
                           <p className="text-xl font-bold text-orange-500">{formatVND(hotel.price)}</p>
                         </div>
                       </div>
                     </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        )}

        <div className="pb-16 pt-8">
          {view === 'flight_results' && (
            <FlightResults criteria={searchCriteria} onBook={handleBookFlight} />
          )}

          {view === 'hotel_results' && (
            <HotelResults criteria={searchCriteria} onBook={handleBookHotel} />
          )}

          {view === 'hotel_detail' && selectedHotel && (
            <HotelDetail 
              hotel={selectedHotel} 
              onBack={() => setView('hotel_results')} 
              onBookRoom={handleBookRoom} 
            />
          )}

          {view === 'destination_detail' && selectedDestination && (
            <DestinationDetail 
              destination={selectedDestination} 
              onBack={() => setView('home')}
              onSearchFlights={(dest) => handleSearch('flights', { destination: dest })}
              onSearchHotels={(dest) => handleSearch('hotels', { destination: dest })}
            />
          )}

          {view === 'itinerary' && (
            <Itinerary items={itinerary} onRemove={handleRemoveItem} />
          )}
        </div>
      </main>
      
      <footer className="bg-slate-900 text-slate-400 px-8 py-4 flex flex-col sm:flex-row items-center justify-between text-xs mt-auto">
        <div className="flex gap-6 mb-4 sm:mb-0">
          <span>&copy; {new Date().getFullYear()} TravelHub Vietnam</span>
          <a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a>
          <a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a>
          <a href="#" className="hover:text-white transition-colors">Hỗ trợ khách hàng</a>
          <button onClick={() => setView('admin_dashboard')} className="hover:text-white transition-colors font-bold text-blue-400">Admin Dashboard</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Hệ thống ổn định
          </div>
          <div className="bg-slate-800 px-2 py-1 rounded text-white font-mono uppercase tracking-tighter">
            v2.4.1-STABLE
          </div>
        </div>
      </footer>
    </div>
  );
}
