import React from 'react';
import { Plane, Calendar } from 'lucide-react';
import { ViewState } from '../types';

interface NavbarProps {
    currentView: ViewState;
    setView: (view: ViewState) => void;
    onOpenAuth: (view: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onOpenAuth }) => {
    return (
        <header className="bg-white sticky top-0 z-50 border-b border-slate-200/60 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div 
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => setView('home')}
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Plane className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <span className="text-2xl font-bold text-blue-900 tracking-tight">TravelHub</span>
                    </div>

                    {/* Nav actions */}
                    <div className="flex items-center gap-8">
                        <nav className="flex items-center gap-6">
                            <button 
                                onClick={() => setView('itinerary')}
                                className={`flex items-center gap-2 pb-1 transition-all ${
                                    currentView === 'itinerary' 
                                    ? 'text-blue-600 font-semibold border-b-2 border-blue-600' 
                                    : 'text-slate-500 hover:text-blue-600 font-medium'
                                }`}
                            >
                                <span>Lịch trình</span>
                            </button>
                        </nav>
                        
                        <div className="flex items-center gap-3 border-l border-slate-200 pl-8">
                            <button 
                                onClick={() => onOpenAuth('login')}
                                className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-100 rounded-md transition-all text-sm"
                            >
                                Đăng nhập
                            </button>
                            <button 
                                onClick={() => onOpenAuth('register')}
                                className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm xl hover:bg-blue-700 transition-all text-sm"
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};
