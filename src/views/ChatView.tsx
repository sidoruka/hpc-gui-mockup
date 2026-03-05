import { useState } from 'react';
import { Send } from 'lucide-react';

const placeholderMessages = [
  { role: 'assistant' as const, text: 'I can help you search and analyze your data on the HPC. Try asking about your files, datasets, or request an analysis.' },
];

export interface ChatViewProps {
  /** When true (e.g. "Build new app" flow), show no initial messages */
  startEmpty?: boolean;
}

export function ChatView({ startEmpty }: ChatViewProps) {
  const [input, setInput] = useState('');
  const messages = startEmpty ? [] : placeholderMessages;

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
        {messages.map((msg, i) => (
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
          width: '100%',
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data or request an analysis..."
            rows={4}
            style={{
              width: '100%',
              minHeight: 96,
              padding: '10px 14px 40px 14px',
              background: 'var(--bg-search)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              lineHeight: 1.5,
              outline: 'none',
              resize: 'vertical',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            title="Send"
            style={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              width: 28,
              height: 28,
              padding: 0,
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-hover)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
