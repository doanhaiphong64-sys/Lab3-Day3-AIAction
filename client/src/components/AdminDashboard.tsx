import React, { useState } from 'react';
import { LayoutDashboard, ShoppingCart, Building, Plane, Users, Settings, ArrowUpRight, ArrowDownRight, Bell, Search, Menu, CheckCircle2, Clock, Plus, Edit2, Trash2, ArrowLeft, Upload, Image as ImageIcon } from 'lucide-react';
import { formatVND } from '../utils';
import { Hotel, Room } from '../types';
import { MOCK_HOTELS } from '../data';

export const AdminDashboard: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hotelsList, setHotelsList] = useState<Hotel[]>(MOCK_HOTELS(''));
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const stats = [
    { title: 'Tổng doanh thu (Tháng)', value: formatVND(1250000000), trend: '+15.2%', isPositive: true },
    { title: 'Lượt đặt vé máy bay', value: '1,245', trend: '+5.4%', isPositive: true },
    { title: 'Lượt đặt phòng', value: '854', trend: '-2.1%', isPositive: false },
    { title: 'Người dùng mới', value: '3,210', trend: '+12.5%', isPositive: true },
  ];

  const recentBookings = [
    { id: 'BK-001', user: 'Nguyễn Văn A', item: 'Vé máy bay SGN-HAN', date: '24/10/2023', amount: 1500000, status: 'paid' },
    { id: 'BK-002', user: 'Trần Thị B', item: 'Khách sạn Vinpearl Đà Nẵng', date: '24/10/2023', amount: 3200000, status: 'pending' },
    { id: 'BK-003', user: 'Lê Hoàng C', item: 'Vé máy bay DAD-SGN', date: '23/10/2023', amount: 1250000, status: 'paid' },
    { id: 'BK-004', user: 'Phạm Văn D', item: 'Khách sạn Sea View', date: '23/10/2023', amount: 850000, status: 'paid' },
    { id: 'BK-005', user: 'Hoàng Thị E', item: 'Vé máy bay HAN-PQC', date: '22/10/2023', amount: 2100000, status: 'pending' },
  ];

  const handleAddRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRoom: Room = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      bedType: formData.get('bedType') as string,
      maxGuests: Number(formData.get('maxGuests')),
      price: Number(formData.get('price')),
      image: previewImages[0] || (formData.get('image') as string) || 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      images: previewImages.length > 0 ? previewImages : [],
      amenities: ['Wifi', 'Điều hòa', 'TV']
    };
    
    if (selectedHotel) {
      const updatedHotel = { ...selectedHotel, rooms: [...(selectedHotel.rooms || []), newRoom] };
      setHotelsList(hotelsList.map(h => h.id === selectedHotel.id ? updatedHotel : h));
      setSelectedHotel(updatedHotel);
      setIsAddingRoom(false);
    }
  };

  const handleUpdateRoom = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRoom || !selectedHotel) return;
    const formData = new FormData(e.currentTarget);
    const updatedRoom: Room = {
      ...editingRoom,
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      bedType: formData.get('bedType') as string,
      maxGuests: Number(formData.get('maxGuests')),
      price: Number(formData.get('price')),
      image: previewImages[0] || (formData.get('image') as string) || editingRoom.image,
      images: previewImages.length > 0 ? previewImages : editingRoom.images || [],
    };
    
    const updatedHotel = { 
      ...selectedHotel, 
      rooms: selectedHotel.rooms?.map(r => r.id === updatedRoom.id ? updatedRoom : r) 
    };
    setHotelsList(hotelsList.map(h => h.id === selectedHotel.id ? updatedHotel : h));
    setSelectedHotel(updatedHotel);
    setEditingRoom(null);
  };

  const handleDeleteRoom = (roomId: string) => {
    if (!selectedHotel) return;
    if (window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      const updatedHotel = { 
        ...selectedHotel, 
        rooms: selectedHotel.rooms?.filter(r => r.id !== roomId) 
      };
      setHotelsList(hotelsList.map(h => h.id === selectedHotel.id ? updatedHotel : h));
      setSelectedHotel(updatedHotel);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      files.slice(0, 4 - previewImages.length).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          setPreviewImages(prev => {
            if (prev.length < 4) return [...prev, event.target?.result as string];
            return prev;
          });
        };
        reader.readAsDataURL(file);
      });
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setPreviewImages(previewImages.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col hidden md:flex shrink-0 border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white tracking-tight">Travel<span className="text-blue-500">Hub</span> Admin</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
            { id: 'bookings', label: 'Đơn đặt', icon: ShoppingCart },
            { id: 'flights', label: 'Quản lý chuyến bay', icon: Plane },
            { id: 'hotels', label: 'Quản lý khách sạn', icon: Building },
            { id: 'users', label: 'Khách hàng', icon: Users },
            { id: 'settings', label: 'Cài đặt', icon: Settings },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={onExit}
             className="w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-lg text-sm font-bold transition-colors"
           >
             Trở về trang web
           </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none w-64 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-auto p-4 md:p-8 bg-slate-50">
          <div className="max-w-6xl mx-auto space-y-6">
            
            {activeTab === 'dashboard' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h1>
                    <p className="text-slate-500 text-sm mt-1">Xin chào Admin, đây là tình hình kinh doanh hôm nay.</p>
                  </div>
                  <div className="flex gap-2">
                    <select className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 text-slate-700">
                      <option>30 ngày qua</option>
                      <option>Tháng này</option>
                      <option>Năm nay</option>
                    </select>
                  </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="text-slate-500 text-sm font-medium mb-2">{stat.title}</h3>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold text-slate-800">{stat.value}</span>
                        <span className={`flex items-center text-xs font-bold ${stat.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                          {stat.isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Bookings Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Giao dịch gần đây</h3>
                    <button className="text-blue-600 text-sm font-medium hover:underline">Xem tất cả</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50/50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-6 py-3">Mã Đơn</th>
                          <th className="px-6 py-3">Khách Hàng</th>
                          <th className="px-6 py-3">Dịch Vụ</th>
                          <th className="px-6 py-3">Ngày Đặt</th>
                          <th className="px-6 py-3 text-right">Số Tiền</th>
                          <th className="px-6 py-3">Trạng Thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentBookings.map((bk, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono font-medium text-slate-600">{bk.id}</td>
                            <td className="px-6 py-4 font-medium text-slate-800">{bk.user}</td>
                            <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{bk.item}</td>
                            <td className="px-6 py-4 text-slate-500">{bk.date}</td>
                            <td className="px-6 py-4 text-right font-medium text-slate-800">{formatVND(bk.amount)}</td>
                            <td className="px-6 py-4">
                              {bk.status === 'paid' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold bg-emerald-50 text-emerald-600">
                                  <CheckCircle2 className="w-3 h-3" /> Đã thanh toán
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold bg-amber-50 text-amber-600">
                                  <Clock className="w-3 h-3" /> Chờ thanh toán
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">Quản lý Đơn đặt</h2>
                  <div className="flex gap-2">
                    <select className="bg-white border border-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-blue-500 text-slate-700">
                      <option>Tất cả trạng thái</option>
                      <option>Đã thanh toán</option>
                      <option>Chờ thanh toán</option>
                      <option>Đã hủy</option>
                    </select>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50/50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-6 py-3">Mã Đơn</th>
                          <th className="px-6 py-3">Khách Hàng</th>
                          <th className="px-6 py-3">Dịch Vụ</th>
                          <th className="px-6 py-3">Ngày Đặt</th>
                          <th className="px-6 py-3 text-right">Số Tiền</th>
                          <th className="px-6 py-3">Trạng Thái</th>
                          <th className="px-6 py-3">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recentBookings.map((bk, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono font-medium text-slate-600">{bk.id}</td>
                            <td className="px-6 py-4 font-medium text-slate-800">{bk.user}</td>
                            <td className="px-6 py-4 text-slate-600 truncate max-w-[200px]">{bk.item}</td>
                            <td className="px-6 py-4 text-slate-500">{bk.date}</td>
                            <td className="px-6 py-4 text-right font-medium text-slate-800">{formatVND(bk.amount)}</td>
                            <td className="px-6 py-4">
                              {bk.status === 'paid' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold bg-emerald-50 text-emerald-600">
                                  <CheckCircle2 className="w-3 h-3" /> Đã thanh toán
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest font-bold bg-amber-50 text-amber-600">
                                  <Clock className="w-3 h-3" /> Chờ thanh toán
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <button className="text-blue-600 font-medium text-xs hover:underline bg-blue-50 px-3 py-1.5 rounded">Chi tiết</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'flights' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">Quản lý Chuyến bay</h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm">
                    + Thêm chuyến bay
                  </button>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50/50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-6 py-3">Chuyến/Hãng</th>
                          <th className="px-6 py-3">Hành Trình</th>
                          <th className="px-6 py-3">Ngày Tóm Tắt</th>
                          <th className="px-6 py-3 text-right">Giá Cơ Bản</th>
                          <th className="px-6 py-3">Trạng Thái</th>
                          <th className="px-6 py-3">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800 text-sm">VN-241</div>
                            <div className="text-xs text-slate-500">Vietnam Airlines</div>
                          </td>
                          <td className="px-6 py-4 font-medium text-slate-700">SGN → HAN</td>
                          <td className="px-6 py-4 text-slate-600">08:00 - 10:15</td>
                          <td className="px-6 py-4 text-right font-medium text-slate-800">{formatVND(1500000)}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-bold">Hoạt động</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="text-blue-600 hover:bg-blue-50 px-2 py-1 rounded">Sửa</button>
                              <button className="text-red-600 hover:bg-red-50 px-2 py-1 rounded">Xóa</button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hotels' && (
              <div className="space-y-6">
                {!selectedHotel ? (
                  <>
                     <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-slate-800">Quản lý Khách sạn</h2>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm">
                        + Thêm khách sạn
                      </button>
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                       <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                          <thead className="bg-slate-50/50 text-slate-500 font-medium">
                            <tr>
                              <th className="px-6 py-3">Tên Khách Sạn</th>
                              <th className="px-6 py-3">Địa Điểm</th>
                              <th className="px-6 py-3">Hạng Sao</th>
                              <th className="px-6 py-3 text-right">Số Phòng</th>
                              <th className="px-6 py-3">Thao Tác</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {hotelsList.map(hotel => (
                              <tr key={hotel.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-slate-800">{hotel.name}</td>
                                <td className="px-6 py-4 font-medium text-slate-700">{hotel.location}</td>
                                <td className="px-6 py-4 text-orange-400">{'★'.repeat(hotel.rating)}</td>
                                <td className="px-6 py-4 text-right font-medium text-slate-800">{hotel.rooms?.length || 0}</td>
                                <td className="px-6 py-4">
                                   <div className="flex items-center gap-2">
                                    <button 
                                      onClick={() => setSelectedHotel(hotel)}
                                      className="text-white bg-slate-800 hover:bg-slate-700 font-medium px-3 py-1.5 rounded transition-colors"
                                    >
                                      Quản lý Phòng
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => { setSelectedHotel(null); setIsAddingRoom(false); setEditingRoom(null); }}
                          className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-800">Quản lý Phòng</h2>
                          <p className="text-slate-500 text-sm">{selectedHotel.name}</p>
                        </div>
                      </div>
                      {!isAddingRoom && !editingRoom && (
                        <button 
                          onClick={() => { setIsAddingRoom(true); setPreviewImages([]); }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors shadow-sm flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" /> Thêm phòng mới
                        </button>
                      )}
                    </div>

                    {isAddingRoom || editingRoom ? (
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-4xl">
                        <h3 className="text-lg font-bold text-slate-800 mb-6">
                          {isAddingRoom ? 'Thêm phòng mới' : 'Sửa thông tin phòng'}
                        </h3>
                        
                        <div className="flex flex-col md:flex-row gap-8">
                          {/* Form Section */}
                          <div className="flex-1">
                            <form id="room-form" onSubmit={isAddingRoom ? handleAddRoom : handleUpdateRoom} className="space-y-4">
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Tên phòng</label>
                                <input name="name" type="text" defaultValue={editingRoom?.name || ''} required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Loại phòng</label>
                                  <input name="type" type="text" defaultValue={editingRoom?.type || ''} required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Loại giường</label>
                                  <input name="bedType" type="text" defaultValue={editingRoom?.bedType || ''} required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Số khách tối đa</label>
                                  <input name="maxGuests" type="number" min="1" defaultValue={editingRoom?.maxGuests || 2} required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div>
                                  <label className="block text-sm font-bold text-slate-700 mb-1">Giá mỗi đêm (VND)</label>
                                  <input name="price" type="number" min="0" defaultValue={editingRoom?.price || 1000000} required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Hoặc nhập URL hình ảnh</label>
                                <input 
                                  name="image" 
                                  type="url" 
                                  value={previewImages[0] || ''}
                                  onChange={(e) => setPreviewImages([e.target.value, ...previewImages.slice(1)])}
                                  className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                                  placeholder="https://..." 
                                />
                              </div>
                            </form>
                          </div>

                          {/* Image Preview Section */}
                          <div className="w-full md:w-80 shrink-0 flex flex-col">
                            <label className="block text-sm font-bold text-slate-700 mb-1">Ảnh xem trước (Tối đa 4)</label>
                            
                            <div className="grid grid-cols-2 gap-2 mb-1">
                              {/* Danh sách ảnh đã tải lên */}
                              {previewImages.map((imgUrl, idx) => (
                                <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-50">
                                  <img 
                                    src={imgUrl} 
                                    alt={`Preview ${idx + 1}`} 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=L%E1%BB%97i+%E1%BA%A3nh'; }}
                                  />
                                  <button 
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}

                              {/* Nút thêm ảnh */}
                              {previewImages.length < 4 && (
                                <div className="border border-slate-300 border-dashed rounded-lg aspect-video bg-slate-50 relative overflow-hidden group flex flex-col items-center justify-center transition-colors hover:bg-slate-100 hover:border-blue-400">
                                  <div className="text-center p-2">
                                    <ImageIcon className="w-6 h-6 text-slate-300 mx-auto mb-1 group-hover:text-blue-500 transition-colors" />
                                    <span className="text-xs font-medium text-slate-500 group-hover:text-blue-600">Thêm ảnh</span>
                                  </div>
                                  <label className="absolute inset-0 cursor-pointer">
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-end gap-3">
                          <button 
                            type="button"
                            onClick={() => { setIsAddingRoom(false); setEditingRoom(null); setPreviewImages([]); }}
                            className="text-slate-600 font-bold hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors"
                          >
                            Hủy
                          </button>
                          <button 
                            type="submit"
                            form="room-form"
                            className="bg-blue-600 text-white font-bold hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors shadow-sm"
                          >
                            Lưu cấu hình
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50/50 text-slate-500 font-medium">
                              <tr>
                                <th className="px-6 py-3">Phòng</th>
                                <th className="px-6 py-3">Loại Giường</th>
                                <th className="px-6 py-3 text-center">Khách Tối Đa</th>
                                <th className="px-6 py-3 text-right">Giá</th>
                                <th className="px-6 py-3">Thao Tác</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {selectedHotel.rooms?.length ? (
                                selectedHotel.rooms.map(room => (
                                  <tr key={room.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded overflow-hidden shadow-sm shrink-0">
                                          <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                          <div className="font-bold text-slate-800">{room.name}</div>
                                          <div className="text-xs text-slate-500">{room.type}</div>
                                        </div>
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{room.bedType}</td>
                                    <td className="px-6 py-4 text-center text-slate-600">{room.maxGuests}</td>
                                    <td className="px-6 py-4 text-right font-medium text-slate-800">{formatVND(room.price)}</td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-2">
                                        <button 
                                          onClick={() => { setEditingRoom(room); setPreviewImages(room.images?.length ? room.images : (room.image ? [room.image] : [])); }}
                                          className="text-blue-600 bg-blue-50 hover:bg-blue-100 p-1.5 rounded transition-colors"
                                          title="Sửa"
                                        >
                                          <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button 
                                          onClick={() => handleDeleteRoom(room.id)}
                                          className="text-red-600 bg-red-50 hover:bg-red-100 p-1.5 rounded transition-colors"
                                          title="Xóa"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                    Chưa có phòng nào. Hãy thêm phòng mới.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">Quản lý Khách hàng</h2>
                </div>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50/50 text-slate-500 font-medium">
                        <tr>
                          <th className="px-6 py-3">Khách Hàng</th>
                          <th className="px-6 py-3">Email</th>
                          <th className="px-6 py-3">Ngày Tham Gia</th>
                          <th className="px-6 py-3 text-right">Tổng Đã Tiêu</th>
                          <th className="px-6 py-3">Trạng Thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">Nguyễn Văn A</td>
                          <td className="px-6 py-4 text-slate-600">nguyenvana_demo@example.com</td>
                          <td className="px-6 py-4 text-slate-500">20/01/2023</td>
                          <td className="px-6 py-4 text-right font-medium text-slate-800">{formatVND(8500000)}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-bold">Đang HĐ</span>
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-800">Trần Thị B</td>
                          <td className="px-6 py-4 text-slate-600">tranthib_demo@example.com</td>
                          <td className="px-6 py-4 text-slate-500">15/05/2023</td>
                          <td className="px-6 py-4 text-right font-medium text-slate-800">{formatVND(3200000)}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded bg-emerald-50 text-emerald-600 text-xs font-bold">Đang HĐ</span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 min-h-[500px]">
                <h2 className="text-xl font-bold text-slate-800 mb-6">Cài đặt hệ thống</h2>
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tên ứng dụng</label>
                    <input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" defaultValue="TravelHub" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Email liên hệ</label>
                    <input type="email" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" defaultValue="support@travelhub.vn" />
                  </div>
                  <div className="pt-4">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">Lưu cài đặt</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
