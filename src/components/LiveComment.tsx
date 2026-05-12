import { useState, useEffect, useRef } from 'react';
import { database } from '../lib/firebase';
import { ref, push, onValue } from 'firebase/database';
import { MessageCircle, X, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Comment {
  id: string;
  name: string;
  content: string;
  timestamp: number;
}

export function LiveComment() {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const commentsRef = ref(database, 'comments');
    const unsubscribe = onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const commentsList = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          name: val.name,
          content: val.content,
          timestamp: val.timestamp,
        })).sort((a, b) => a.timestamp - b.timestamp);
        setComments(commentsList);
      } else {
        setComments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, isOpen]);

  const handleSend = async () => {
    if (!name.trim() || !content.trim()) return;
    
    setIsSending(true);
    try {
      const commentsRef = ref(database, 'comments');
      await push(commentsRef, {
        name: name.trim(),
        content: content.trim(),
        timestamp: Date.now()
      });
      setContent('');
    } catch (error) {
      console.error("Error sending comment:", error);
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-[5.5rem] right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 z-40 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-[5.5rem] right-6 w-[350px] sm:w-[400px] h-[500px] max-h-[75vh] bg-white rounded-3xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden"
          >
            <div className="bg-blue-600 p-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Live Comments</h3>
                  <p className="text-xs text-blue-100">Diskusi Publik</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-blue-500 text-blue-100 hover:text-white rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 custom-scrollbar">
              {comments.length === 0 ? (
                <div className="text-center text-gray-500 flex flex-col items-center justify-center h-full opacity-60">
                  <MessageCircle className="w-8 h-8 mb-2" />
                  <p className="text-sm">Jadilah yang pertama berkomentar!</p>
                </div>
              ) : (
                comments.map((msg) => (
                  <div key={msg.id} className="flex flex-col gap-1 items-start bg-white p-3 rounded-2xl rounded-tl-sm border border-gray-100 shadow-sm w-[85%]">
                    <div className="flex items-center gap-2 mb-1 w-full relative">
                      <div className="font-bold text-xs text-blue-700 truncate max-w-[80%]">{msg.name}</div>
                      <span className="text-[10px] text-gray-400 font-medium ml-auto">{formatDate(msg.timestamp)}</span>
                    </div>
                    <div className="text-sm text-gray-800 break-words w-full">
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex flex-col gap-2">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={30}
                placeholder="Nama Anda..."
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all text-gray-900"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ketik komentar..."
                  className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-sm transition-all text-gray-900 placeholder-gray-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!content.trim() || !name.trim() || isSending}
                  className="p-3 bg-blue-600 text-white rounded-xl shadow-sm hover:bg-blue-700 active:scale-95 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none transition-all shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
