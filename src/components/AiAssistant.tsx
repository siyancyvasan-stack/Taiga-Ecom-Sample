import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, Minimize2, ArrowUpRight, ShoppingCart } from 'lucide-react';
import { Product, Message } from '../types';

interface AiAssistantProps {
  currentProduct?: Product | null;
  onAddToCart?: (p: Product, color: string, size: string, qty: number) => void;
}

export default function AiAssistant({ currentProduct, onAddToCart }: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      senderName: 'Daraz Smart AI',
      text: "🙏 Ayubowan! I am your Daraz Smart Assistant. I can help you search for deals, compare prices, check warranties, or help you add products directly to your cart in Sri Lankan Rupees (LKR)! How can I help you today, Machan?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input;
    setInput('');

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Send message history to our secure server API endpoint
      const response = await fetch('/api/chat-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          contextProduct: currentProduct || null
        })
      });

      const data = await response.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        senderName: 'Daraz Smart AI',
        text: data.text || "I'm sorry, I had trouble processing that request. Please try again in a moment!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        sender: 'system',
        text: "🔌 Connection timeout. Please check that the server is online. In the meantime, feel free to try again!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Shortcut deal finder helper
  const handleTriggerShortcut = (query: string) => {
    setInput(query);
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 z-50 font-sans flex flex-col items-end" id="ai-assistant-widget">
      
      {/* 1. Expandable Chat box window */}
      {isOpen && (
        <div className="w-[340px] md:w-[380px] h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-3 animate-fade-in-up">
          
          {/* Header segment styled with Daraz orange-red gradient */}
          <div className="bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-white">
                <Sparkles size={16} className="animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-none flex items-center gap-1">
                  Daraz Smart AI
                  <span className="h-2 w-2 rounded-full bg-green-400 inline-block animate-pulse" />
                </h3>
                <span className="text-[10px] text-orange-100 font-medium">LKR Deal Expert & Assistant</span>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-white cursor-pointer"
            >
              <Minimize2 size={16} />
            </button>
          </div>

          {/* Context Banner: Displays if user is looking at a specific product details screen */}
          {currentProduct && (
            <div className="bg-orange-50/70 border-b border-orange-100 p-2 text-[10px] text-gray-700 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-1.5 truncate">
                <Bot size={13} className="text-[#F85606]" />
                <span className="truncate font-semibold">Answering queries about: <b>{currentProduct.title}</b></span>
              </div>
              {onAddToCart && (
                <button
                  onClick={() => onAddToCart(currentProduct, currentProduct.colors[0], currentProduct.sizes[0], 1)}
                  className="bg-[#F85606] text-white font-black px-2 py-0.5 rounded text-[8px] flex items-center gap-0.5 hover:bg-[#FF6600]"
                >
                  <ShoppingCart size={9} /> Add to Cart
                </button>
              )}
            </div>
          )}

          {/* Messages Window Scroll frame */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50/30">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                {/* Sender Name block */}
                {m.senderName && (
                  <span className="text-[9px] text-gray-400 font-bold mb-0.5 ml-2 uppercase">
                    {m.senderName}
                  </span>
                )}

                {/* Bubble */}
                <div 
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-sm ${m.sender === 'user' ? 'bg-[#F85606] text-white rounded-tr-none' : m.sender === 'system' ? 'bg-amber-100 border border-amber-200 text-amber-800 rounded-tl-none font-bold' : 'bg-white border text-gray-800 rounded-tl-none'}`}
                >
                  {m.text}
                </div>

                {/* Timestamp */}
                <span className="text-[8px] text-gray-400 mt-0.5 mr-1 ml-1">{m.timestamp}</span>
              </div>
            ))}

            {/* Simulated loading indicator */}
            {isLoading && (
              <div className="flex flex-col items-start animate-pulse">
                <span className="text-[9px] text-gray-400 font-bold mb-0.5 ml-2 uppercase">Daraz Smart AI</span>
                <div className="bg-white border rounded-2xl rounded-tl-none px-4 py-2 text-xs flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F85606] animate-bounce" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F85606] animate-bounce [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F85606] animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>

          {/* Shortcut Quick-Queries Footer */}
          <div className="px-3 py-1.5 border-t border-gray-100 bg-white overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5 shrink-0">
            <button
              onClick={() => handleTriggerShortcut("What are the best deals in Sri Lanka?")}
              className="text-[10px] bg-gray-100 hover:bg-orange-50 hover:text-[#F85606] text-gray-600 px-2 py-1 rounded-full font-bold cursor-pointer"
            >
              🔥 Hot Deals
            </button>
            <button
              onClick={() => handleTriggerShortcut("Give me a discount calculation")}
              className="text-[10px] bg-gray-100 hover:bg-orange-50 hover:text-[#F85606] text-gray-600 px-2 py-1 rounded-full font-bold cursor-pointer"
            >
              🧮 Discount Calculator
            </button>
            <button
              onClick={() => handleTriggerShortcut("Show me official Samsung details")}
              className="text-[10px] bg-gray-100 hover:bg-orange-50 hover:text-[#F85606] text-gray-600 px-2 py-1 rounded-full font-bold cursor-pointer"
            >
              📱 Samsung Galaxy
            </button>
          </div>

          {/* Input text submit form */}
          <form onSubmit={handleSendMessage} className="p-2 border-t border-gray-100 flex bg-white gap-1.5 shrink-0">
            <input
              type="text"
              placeholder="Ask AI shopping helper..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#F85606] disabled:opacity-50"
              id="ai-assistant-input"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white p-2 rounded-xl hover:opacity-95 transition-all disabled:opacity-40 shrink-0 cursor-pointer"
            >
              <Send size={14} />
            </button>
          </form>

        </div>
      )}

      {/* 2. Primary Circle launcher button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-12 rounded-full bg-gradient-to-r from-[#F85606] to-[#FF6600] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all hover:rotate-6 cursor-pointer"
        id="ai-assistant-toggle-btn"
      >
        {isOpen ? <X size={20} /> : <Sparkles size={20} className="animate-spin-slow" />}
      </button>

    </div>
  );
}
