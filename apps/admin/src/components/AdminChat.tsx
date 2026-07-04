'use client';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function AdminChat() {
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
    
    const msg = { sender: 'Admin', text: input, room: 'support_room' };
    socket.emit('send_message', msg);
    setInput('');
  };

  return (
    <div className="glass-card flex flex-col h-[500px]">
      <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-4">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <h3 className="text-lg font-bold text-white">Live Support Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2">
        {messages.length === 0 && <div className="text-gray-500 text-sm text-center my-auto">No active chats</div>}
        {messages.map((m, i) => (
          <div key={i} className={`p-3 rounded-xl max-w-[80%] text-sm ${m.sender === 'Admin' ? 'bg-violet-600/30 text-violet-100 self-end border border-violet-500/30 rounded-tr-none' : 'bg-white/5 text-gray-300 self-start border border-white/10 rounded-tl-none'}`}>
            <div className="text-xs text-gray-500 mb-1">{m.sender}</div>
            {m.text}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="mt-4 pt-4 border-t border-white/10 flex gap-2">
        <input 
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Reply to customer..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-violet-500"
        />
        <button type="submit" className="bg-violet-600 text-white px-4 rounded-xl hover:bg-violet-500 transition-colors font-medium text-sm">
          Send
        </button>
      </form>
    </div>
  );
}
