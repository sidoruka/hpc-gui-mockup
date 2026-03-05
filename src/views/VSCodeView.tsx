import { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Play, Bug, ChevronDown, Package, Rocket } from 'lucide-react';

type EditorLanguage = 'python' | 'shell' | 'dockerfile';

const LANGUAGE_OPTIONS: { value: EditorLanguage; label: string; monacoLanguage: string }[] = [
  { value: 'python', label: 'Python', monacoLanguage: 'python' },
  { value: 'shell', label: 'Shell', monacoLanguage: 'shell' },
  { value: 'dockerfile', label: 'Dockerfile', monacoLanguage: 'dockerfile' },
];

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

const VALID_LANGUAGES: EditorLanguage[] = ['python', 'shell', 'dockerfile'];

interface VSCodeViewProps {
  /** When opening via "Build new app", pass 'dockerfile' so Dockerfile is selected initially */
  initialLanguage?: EditorLanguage | null;
  /** Injected content from Chat (e.g. simulated "Create docker for python 3") */
  injectedContent?: string;
  /** Called after injected content has been applied so parent can clear injection */
  onInjectedContentConsumed?: () => void;
}

export function VSCodeView({
  initialLanguage,
  injectedContent,
  onInjectedContentConsumed,
}: VSCodeViewProps) {
  const initial =
    initialLanguage && VALID_LANGUAGES.includes(initialLanguage) ? initialLanguage : DEFAULT_LANGUAGE;
  const [language, setLanguage] = useState<EditorLanguage>(initial);
  const [value, setValue] = useState('');
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  useEffect(() => {
    if (injectedContent != null && injectedContent !== '') {
      setValue(injectedContent);
      setLanguage('dockerfile');
      onInjectedContentConsumed?.();
    }
  }, [injectedContent, onInjectedContentConsumed]);

  const handleEditorChange = useCallback((newValue: string | undefined) => {
    setValue(newValue ?? '');
  }, []);

  const handleLanguageSelect = useCallback((lang: EditorLanguage) => {
    setLanguage(lang);
    setValue('');
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
        {language === 'dockerfile' ? (
          <>
            <button type="button" style={toolbarBtn} title="Build">
              <Package size={16} />
              Build
            </button>
            <button type="button" style={toolbarBtn} title="Deploy">
              <Rocket size={16} />
              Deploy
            </button>
          </>
        ) : (
          <>
            <button type="button" style={toolbarBtn} title="Run">
              <Play size={16} />
              Run
            </button>
            <button type="button" style={toolbarBtn} title="Debug">
              <Bug size={16} />
              Debug
            </button>
          </>
        )}
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
