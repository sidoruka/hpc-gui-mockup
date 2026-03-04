import { useState } from 'react';
import { Send } from 'lucide-react';

const placeholderMessages = [
  { role: 'assistant' as const, text: 'I can help you search and analyze your data on the HPC. Try asking about your files, datasets, or request an analysis.' },
];

export function ChatView() {
  const [input, setInput] = useState('');

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-main)',
      }}
    >
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {placeholderMessages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'assistant' ? 'flex-start' : 'flex-end',
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: msg.role === 'assistant' ? 'var(--bg-active)' : 'var(--accent-chat)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              lineHeight: 1.5,
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your data or request an analysis..."
          style={{
            flex: 1,
            padding: '10px 14px',
            background: 'var(--bg-search)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            color: 'var(--text-primary)',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          type="button"
          style={{
            padding: '10px 14px',
            background: 'var(--accent-chat)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
