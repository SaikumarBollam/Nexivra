'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    sender: "ai",
    text: "Hello! I am your Nexivra AI Career Coach. 🎓🤖\n\nI am here to help you navigate your professional journey. You can ask me to:\n1. 📝 **Draft a professional post** to share on Nexivra.\n2. 💼 **Explore career paths** based on your major or interest.\n3. 🔍 **Simulate a mock technical or product interview**.\n4. ✉️ **Craft perfect networking templates** to connect with senior alumni.\n\nWhat are you working on today?",
    timestamp: new Date()
  }
];

const quickPrompts = [
  "Draft a post about joining Stripe as an engineer",
  "How to prepare for a System Design interview?",
  "Resume outline for a Product Management career",
  "Networking message to ask an alumnus for a referral"
];

export default function AICoachTab() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      sender: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend })
      });

      if (!response.ok) {
        throw new Error("Failed to generate coach response");
      }

      const data = await response.json();
      
      const aiMessage: Message = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: data.text,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      // Fallback
      const fallbackMsg: Message = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ai',
        text: `### AI Career Coach Insights (Offline / Simulation mode)

Here is immediate expert career advice on that topic:

- **Leverage the Nexivra Mentors Panel:** We highly recommend scheduling a 1:1 session with a senior mentor like **Siddharth Roy** or **Neha Sharma** to discuss this directly.
- **Check the Alumni Jobs Portal:** Search for matching roles and use the "Referral by Alumni" option to request referral support.
- **Join Local Alumni Meetups:** Look at the **Events** tab for physical mixers near you; face-to-face conversations are unmatched for referrals!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMsg]);
      toast.success("AI Insights loaded!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages(initialMessages);
    toast.success("Chat history cleared!");
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-[600px] flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-150 pb-3 flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-indigo-600 animate-pulse" size={22} />
            AI Career Coach
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Your virtual career strategist & post-drafting assistant.</p>
        </div>
        <button
          onClick={handleClearChat}
          className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-all"
          title="Clear Chat History"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 min-h-0">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}>
              {msg.sender === 'user' ? <User size={15} /> : <Bot size={15} />}
            </div>
            <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed font-medium whitespace-pre-wrap ${
              msg.sender === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-gray-50 text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 max-w-[85%]">
            <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Bot size={15} />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick suggestions & Input */}
      <div className="border-t border-gray-150 pt-3 flex-shrink-0">
        {/* Suggestion Chips */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] px-2.5 py-1.5 rounded-full font-semibold flex items-center gap-1 transition-all text-left"
              >
                {prompt}
                <ArrowRight size={10} />
              </button>
            ))}
          </div>
        )}

        {/* Input box */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputText);
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI Coach anything about your career..."
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-medium"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-all shadow-sm"
          >
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
