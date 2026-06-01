import React, { useState } from 'react';
import { X, Mail, Lock, User } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState<'login' | 'register'>(initialView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {view === 'login' ? 'Đăng nhập vào TravelHub' : 'Tạo tài khoản mới'}
            </h2>
            <p className="text-slate-500 text-sm">
              {view === 'login' 
                ? 'Chào mừng bạn trở lại, hệ thống đã sẵn sàng.'
                : 'Tham gia với chúng tôi để nhận ưu đãi du lịch tốt nhất.'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
            {view === 'register' && (
              <div className="relative">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Họ và tên</label>
                <div className="relative border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all px-3 py-2">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Nguyễn Văn A" className="w-full text-sm font-medium focus:outline-none bg-transparent" required />
                    </div>
                </div>
              </div>
            )}

            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
              <div className="relative border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all px-3 py-2">
                  <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <input type="email" placeholder="email@example.com" className="w-full text-sm font-medium focus:outline-none bg-transparent" required />
                  </div>
              </div>
            </div>

            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mật khẩu</label>
              <div className="relative border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all px-3 py-2">
                  <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-400" />
                      <input type="password" placeholder="••••••••" className="w-full text-sm font-medium focus:outline-none bg-transparent" required />
                  </div>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-6 shadow-sm"
            >
              {view === 'login' ? 'Đăng nhập' : 'Đăng ký'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-500">
              {view === 'login' ? 'Chưa có tài khoản? ' : 'Đã có tài khoản? '}
            </span>
            <button 
              onClick={() => setView(view === 'login' ? 'register' : 'login')}
              className="text-blue-600 font-bold hover:underline"
            >
              {view === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
