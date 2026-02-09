import { Loader2 } from 'lucide-react';

export default function Loading({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 absolute animate-ping"></div>
        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
          <Loader2 className="animate-spin text-white" size={40} strokeWidth={3} />
        </div>
      </div>
      <p className="text-gray-700 font-semibold mt-6 text-lg">{message}</p>
      <div className="flex gap-1 mt-3">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
