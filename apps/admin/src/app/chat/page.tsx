'use client';
import AdminChat from '../../components/AdminChat';

export default function ChatPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black text-white">Live Support Chat</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time customer conversations powered by Socket.io + Neon PostgreSQL</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AdminChat />
        </div>
        <div className="space-y-4">
          <div className="glass-card">
            <h3 className="font-bold text-white mb-4">📊 Chat Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Room</span><span className="text-indigo-400 font-mono">support_room</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Protocol</span><span className="text-green-400">Socket.io</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Persistence</span><span className="text-blue-400">Neon PostgreSQL</span></div>
              <div className="flex justify-between"><span className="text-gray-500">History</span><span className="text-gray-300">Last 50 messages</span></div>
            </div>
          </div>
          <div className="glass-card">
            <h3 className="font-bold text-white mb-3">💡 How to Test</h3>
            <ol className="space-y-2 text-sm text-gray-400 list-decimal list-inside">
              <li>Open the customer store at <a href="http://localhost:3000" className="text-indigo-400 underline" target="_blank">localhost:3000</a></li>
              <li>Click the 💬 chat bubble (bottom-right)</li>
              <li>Type a message as a customer</li>
              <li>Watch it appear here in real-time!</li>
              <li>Reply from here and it appears on the customer side</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
