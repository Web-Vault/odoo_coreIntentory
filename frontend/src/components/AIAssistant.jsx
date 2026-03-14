import React, { useState, useRef, useEffect } from 'react';

const AIAssistant = ({ replies, defaultReply }) => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm BrewIQ's AI. Ask me about stock levels, demand forecasts, waste risks, or reorder suggestions — in plain English." }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const msgsEndRef = useRef(null);

  const scrollToBottom = () => {
    msgsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleAsk = (q) => {
    if (!q.trim()) return;
    
    setMessages(prev => [...prev, { role: 'u', text: q }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = replies[q] || defaultReply;
      setMessages(prev => [...prev, { role: 'ai', text: reply }]);
    }, 1300);
  };

  const handleSubmit = (e) => {
    if (e.key === 'Enter') {
      handleAsk(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="chat-container" style={{ marginTop: '14px' }}>
      <div className="chat-hd">
        <div className="chat-ai-dot"></div>
        <div className="chat-hd-txt">BrewIQ AI Assistant</div>
        <div className="chat-hd-sub">Natural language inventory intelligence</div>
      </div>
      <div className="chat-msgs">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'u' ? 'msg-u' : 'msg-ai'}>
            {msg.text}
          </div>
        ))}
        {isTyping && (
          <div className="msg-ai">
            <div className="typing-dots"><span></span><span></span><span></span></div>
          </div>
        )}
        <div ref={msgsEndRef} />
      </div>
      <div className="chat-chips">
        {Object.keys(replies).map((q, idx) => (
          <div key={idx} className="chip" onClick={() => handleAsk(q)}>
            {q}
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          className="chat-inp"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleSubmit}
          placeholder="Ask anything about your inventory..."
        />
        <div className="tb-btn primary" onClick={() => { handleAsk(inputValue); setInputValue(''); }}>
          Ask ↗
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
