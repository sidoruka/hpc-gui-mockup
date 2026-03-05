import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Bug, ChevronDown } from 'lucide-react';

type EditorLanguage = 'python' | 'shell' | 'dockerfile';

const LANGUAGE_OPTIONS: { value: EditorLanguage; label: string; monacoLanguage: string }[] = [
  { value: 'python', label: 'Python', monacoLanguage: 'python' },
  { value: 'shell', label: 'Shell', monacoLanguage: 'shell' },
  { value: 'dockerfile', label: 'Dockerfile', monacoLanguage: 'dockerfile' },
];

const DEFAULT_CODE: Record<EditorLanguage, string> = {
  python: `# VSCode session on HPC login node
# Edit this file — syntax highlighting, line numbers, full editor

def greet(name: str) -> str:
    return f"Hello, {name}!"

if __name__ == "__main__":
    message = greet("HPC")
    print(message)
`,
  shell: `#!/bin/bash
# VSCode session on HPC login node
# Edit this file — syntax highlighting, line numbers, full editor

greet() {
    echo "Hello, $1!"
}

message=$(greet "HPC")
echo "$message"
`,
  dockerfile: `# VSCode session on HPC login node
# Edit this file — syntax highlighting, line numbers, full editor

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`,
};

const toolbarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  padding: '6px 12px',
  background: 'var(--bg-sidebar, #252526)',
  borderBottom: '1px solid var(--border-subtle, #3c3c3c)',
  flexShrink: 0,
};

const toolbarBtn: React.CSSProperties = {
  padding: '6px 10px',
  border: '1px solid transparent',
  borderRadius: '4px',
  background: 'transparent',
  color: 'var(--text-secondary, #e0e0e0)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  fontSize: '13px',
};

const DEFAULT_LANGUAGE: EditorLanguage = 'python';

interface VSCodeViewProps {
  /** When opening via "Build new app", pass 'dockerfile' so Dockerfile is selected initially */
  initialLanguage?: EditorLanguage | null;
}

export function VSCodeView({ initialLanguage }: VSCodeViewProps) {
  const initial = initialLanguage && DEFAULT_CODE[initialLanguage] ? initialLanguage : DEFAULT_LANGUAGE;
  const [language, setLanguage] = useState<EditorLanguage>(initial);
  const [value, setValue] = useState(DEFAULT_CODE[initial]);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  const handleEditorChange = useCallback((newValue: string | undefined) => {
    setValue(newValue ?? '');
  }, []);

  const handleLanguageSelect = useCallback((lang: EditorLanguage) => {
    setLanguage(lang);
    setValue(DEFAULT_CODE[lang]);
    setLanguageDropdownOpen(false);
  }, []);

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        background: 'var(--bg-main, #1e1e1e)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={toolbarStyle}>
        <div style={{ position: 'relative', marginRight: 8 }}>
          <button
            type="button"
            onClick={() => setLanguageDropdownOpen((o) => !o)}
            style={{
              ...toolbarBtn,
              minWidth: 120,
              justifyContent: 'space-between',
            }}
            title="Select language"
          >
            <span>{LANGUAGE_OPTIONS.find((o) => o.value === language)?.label ?? language}</span>
            <ChevronDown size={14} style={{ opacity: languageDropdownOpen ? 1 : 0.7 }} />
          </button>
          {languageDropdownOpen && (
            <>
              <div
                role="presentation"
                style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                onClick={() => setLanguageDropdownOpen(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '100%',
                  marginTop: 4,
                  minWidth: '100%',
                  background: 'var(--bg-sidebar, #252526)',
                  border: '1px solid var(--border-subtle, #3c3c3c)',
                  borderRadius: '6px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                  padding: '4px 0',
                  zIndex: 20,
                }}
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleLanguageSelect(opt.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      background: language === opt.value ? 'var(--bg-hover, #2a2d2e)' : 'transparent',
                      color: 'var(--text-primary, #e0e0e0)',
                      cursor: 'pointer',
                      fontSize: 13,
                      textAlign: 'left',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'var(--bg-hover, #2a2d2e)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        language === opt.value ? 'var(--bg-hover, #2a2d2e)' : 'transparent';
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        <button type="button" style={toolbarBtn} title="Run">
          <Play size={16} />
          Run
        </button>
        <button type="button" style={toolbarBtn} title="Debug">
          <Bug size={16} />
          Debug
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Editor
          height="100%"
          defaultLanguage={LANGUAGE_OPTIONS.find((o) => o.value === language)?.monacoLanguage ?? 'python'}
          language={LANGUAGE_OPTIONS.find((o) => o.value === language)?.monacoLanguage ?? 'python'}
          value={value}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
            padding: { top: 16 },
            renderLineHighlight: 'all',
            folding: true,
            bracketPairColorization: { enabled: true },
            wordWrap: 'off',
          }}
        />
      </div>
    </div>
  );
}
