'use client';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<{ sender: string; text: string; createdAt?: string }[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const newSocket = io('https://shop-smart-api-production.up.railway.app');
    setSocket(newSocket);

    newSocket.emit('join_room', 'support_room');

    // Load persisted history from Neon on join
    newSocket.on('chat_history', (history: any[]) => {
      setMessages(history.map(m => ({ sender: m.sender, text: m.text, createdAt: m.createdAt })));
    });

    newSocket.on('receive_message', (msg: any) => {
      setMessages(prev => [...prev, { sender: msg.sender, text: msg.text, createdAt: msg.createdAt }]);
    });

    return () => { newSocket.close(); };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    
    const msg = { sender: 'Customer', text: input, room: 'support_room' };
    socket.emit('send_message', msg);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="glass w-80 h-96 rounded-2xl flex flex-col overflow-hidden animate-slide-up shadow-2xl shadow-indigo-500/20 border border-indigo-500/30">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white flex justify-between items-center">
            <div className="font-bold">Live Support</div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-300">✕</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#0a0a0f]/90">
            {messages.length === 0 && <div className="text-gray-500 text-xs text-center my-auto">Send a message to chat with Admin</div>}
            {messages.map((m, i) => (
              <div key={i} className={`p-2 px-3 rounded-xl max-w-[80%] text-sm ${m.sender === 'Customer' ? 'bg-indigo-600 text-white self-end rounded-tr-none' : 'bg-white/10 text-gray-200 self-start rounded-tl-none'}`}>
                {m.text}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t border-white/10 bg-[#13131a] flex gap-2">
            <input 
              value={input} onChange={e => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
            />
            <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500 transition-colors">
              ➤
            </button>
          </form>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/40 hover:scale-110 transition-transform animate-bounce"
        >
          💬
        </button>
      )}
    </div>
  );
}
