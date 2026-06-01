import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Xin chào! Tôi là trợ lý ảo của TravelHub. Tôi có thể giúp gì cho chuyến đi của bạn?', isBot: true },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const currentMessage = message;
    // Add user message
    const userMsg = { id: Date.now().toString(), text: currentMessage, isBot: false };
    setMessages(prev => [...prev, userMsg]);
    setMessage('');
    
    // Add loading indicator
    const loadingId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: loadingId, text: 'Đang suy nghĩ...', isBot: true }]);

    // Call Local Phi-3 API with Streaming
    import('../gemini').then(async ({ streamMessage }) => {
      await streamMessage(currentMessage, (chunk) => {
        // Replace loading message with streaming reply
        setMessages(prev => prev.map(msg => 
          msg.id === loadingId ? { ...msg, text: chunk } : msg
        ));
      });
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-slate-200 w-80 sm:w-96 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-300" 
          style={{ height: '500px', maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm">TravelHub Assistant</h3>
                <p className="text-xs text-blue-100 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400"></span> Trực tuyến
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.isBot 
                  ? 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm' 
                  : 'bg-blue-600 text-white rounded-tr-sm shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="relative flex items-center">
              <input 
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
              />
              <button 
                type="submit"
                disabled={!message.trim()}
                className="absolute right-2 p-2 text-blue-600 hover:bg-blue-50 rounded-full disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* FAB */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-600/30 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 animate-bounce group"
          style={{ animationIterationCount: 2 }}
        >
          <MessageCircle className="w-6 h-6 group-hover:hidden" />
          <Bot className="w-6 h-6 hidden group-hover:block" />
        </button>
      )}
    </div>
  );
};
