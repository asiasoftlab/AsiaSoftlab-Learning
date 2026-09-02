"use client";

import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Bot, User } from "lucide-react";
import { api } from "@/lib/api";
import ReactMarkdown from "react-markdown";

interface AiAssistantProps {
  courseId?: string;
  activeLessonId?: string;
}

interface Message {
  role: "user" | "model";
  text: string;
}

export default function AiAssistant({ courseId, activeLessonId }: AiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hi! I'm your AI Assistant. Ask me anything about this platform or course!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-chat', handleOpen);
    return () => window.removeEventListener('open-ai-chat', handleOpen);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message immediately
    const newMessages: Message[] = [...messages, { role: "user", text: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const historyToSend = newMessages.slice(1, -1);
      const response = await api.post("/ai/chat", {courseId, lessonId: activeLessonId, message: userMessage, history: historyToSend});
      setMessages(prev => [...prev, { role: "model", text: response.data.reply }]);
    } catch (error) {
      console.error("AI Chat error:", error);
      setMessages(prev => [...prev, { 
        role: "model", 
        text: "Sorry, I'm having trouble connecting right now. Make sure the API key is configured correctly in the backend!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-18 w-18 bg-brand-600 hover:bg-brand-700 text-white rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110 z-50 cursor-pointer overflow-hidden p-0"
        >
          <img src="/Courses/AI.webp" alt="AI Assistant" className="h-full w-full object-cover" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-brand-600 p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-2">
              <img src="/Courses/AI.webp" alt="AI" className="h-9 w-9 rounded-full object-cover" />
              <h3 className="font-bold">AI Course Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white hover:bg-white/20 p-1 rounded transition-colors cursor-pointer">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 min-h-[300px] max-h-[400px] space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "model" && (
                  <img src="/Courses/AI.webp" alt="AI" className="h-8 w-8 rounded-full object-cover shrink-0" />
                )}
                <div 
                  className={`p-3 rounded-xl max-w-[80%] text-sm prose prose-sm ${
                    msg.role === "user" 
                    ? "bg-brand-600 text-white rounded-br-sm prose-invert" 
                    : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    msg.text
                  ) : (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 justify-start">
                <img src="/Courses/AI.webp" alt="AI" className="h-8 w-8 rounded-full object-cover shrink-0" />
                <div className="bg-white border border-slate-200 p-3 rounded-xl rounded-bl-sm flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-brand-600" />
                  <span className="text-xs text-slate-500 font-medium">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 shrink-0">
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1 pr-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about this course..."
                className="w-full max-h-32 min-h-[40px] bg-transparent resize-none outline-none text-sm p-2 text-slate-700"
                rows={1}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="h-8 w-8 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-lg flex items-center justify-center shrink-0 mb-1 transition-colors cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
