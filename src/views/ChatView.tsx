import { useState, useCallback } from 'react';
import { Send, Trash2 } from 'lucide-react';

const placeholderMessages = [
  { role: 'assistant' as const, text: 'I can help you search and analyze your data on the HPC. Try asking about your files, datasets, or request an analysis.' },
];

/** Simulated Dockerfile for Python 3 (used when user asks e.g. "Create docker for python 3") */
export const SIMULATED_PYTHON3_DOCKERFILE = `FROM python:3-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

CMD ["python", "main.py"]
`;

function isDockerForPythonRequest(text: string): boolean {
  const t = text.trim().toLowerCase();
  return (
    (t.includes('docker') && (t.includes('python') || t.includes('python3'))) ||
    (t.includes('python') && t.includes('docker'))
  );
}

export interface ChatViewProps {
  /** When true (e.g. "Build new app" flow), show no initial messages */
  startEmpty?: boolean;
  /** Called when user asks for a Dockerfile; simulated content is injected into VSCode (no model) */
  onSimulatedDockerfileRequest?: (content: string) => void;
}

export function ChatView({ startEmpty, onSimulatedDockerfileRequest }: ChatViewProps) {
  const [input, setInput] = useState('');
  const initialMessages = startEmpty ? [] : placeholderMessages;
  const [conversationMessages, setConversationMessages] = useState<
    Array<{ role: 'user' | 'assistant'; text: string }>
  >([]);
  const messages = [...initialMessages, ...conversationMessages];

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setInput('');
    setConversationMessages((prev) => [...prev, { role: 'user', text }]);
    if (isDockerForPythonRequest(text)) {
      setConversationMessages((prev) => [
        ...prev,
        { role: 'assistant', text: "I've created a Dockerfile for Python 3 in the editor." },
      ]);
      onSimulatedDockerfileRequest?.(SIMULATED_PYTHON3_DOCKERFILE);
    } else {
      setConversationMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'This is a simulated response. In the full app, an AI would answer here. Try "Create docker for python 3" to see the Dockerfile flow.',
        },
      ]);
    }
  }, [input, onSimulatedDockerfileRequest]);

  const handleClear = useCallback(() => {
    setConversationMessages([]);
    setInput('');
  }, []);

  const canClear = conversationMessages.length > 0;

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-main)',
      }}
    >
      {canClear && (
        <div
          style={{
            flexShrink: 0,
            padding: '6px 16px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={handleClear}
            title="Clear chat"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 10px',
              background: 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: 'var(--text-secondary)',
              fontSize: '13px',
              cursor: 'pointer',
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
            <Trash2 size={14} />
            Clear chat
          </button>
        </div>
      )}
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
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Search for data, build app or start a pipeline"
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
            onClick={handleSend}
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
