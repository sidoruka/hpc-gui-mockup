import { useState } from 'react';

const paneHeaderStyle: React.CSSProperties = {
  background: '#252526',
  borderBottom: '1px solid var(--border-subtle)',
  padding: '4px 8px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  minHeight: 28,
  fontSize: 12,
  color: '#cccccc',
};

function PaneTabs({
  tabs,
  active,
  onSelect,
}: {
  tabs: string[];
  active: string;
  onSelect: (tab: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 2, flex: 1, minWidth: 0 }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onSelect(tab)}
          style={{
            padding: '4px 10px',
            border: 'none',
            borderBottom: active === tab ? `2px solid var(--accent-rstudio)` : '2px solid transparent',
            background: active === tab ? 'var(--bg-hover)' : 'transparent',
            color: active === tab ? '#fff' : '#9d9d9d',
            cursor: 'pointer',
            fontSize: 12,
            borderRadius: 2,
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export function RStudioView() {
  const [envTab, setEnvTab] = useState('Environment');
  const [outputTab, setOutputTab] = useState('Plots');

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#1e1e1e',
      }}
    >
      {/* Menu bar */}
      <div
        style={{
          ...paneHeaderStyle,
          borderBottom: '1px solid var(--border-subtle)',
          paddingLeft: 12,
        }}
      >
        <span style={{ marginRight: 16, color: '#e0e0e0' }}>File</span>
        <span style={{ marginRight: 16, color: '#e0e0e0' }}>Edit</span>
        <span style={{ marginRight: 16, color: '#e0e0e0' }}>View</span>
        <span style={{ marginRight: 16, color: '#e0e0e0' }}>Plots</span>
        <span style={{ marginRight: 16, color: '#e0e0e0' }}>Session</span>
        <span style={{ marginRight: 16, color: '#e0e0e0' }}>Build</span>
        <span style={{ marginRight: 16, color: '#e0e0e0' }}>Debug</span>
        <span style={{ marginRight: 16, color: '#e0e0e0' }}>Tools</span>
        <span style={{ color: '#e0e0e0' }}>Help</span>
      </div>

      {/* 4-pane layout */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 2,
          minHeight: 0,
          background: '#2d2d30',
        }}
      >
        {/* Top-left: Source */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: '#1e1e1e',
            border: '1px solid var(--border-subtle)',
            minHeight: 0,
          }}
        >
          <div style={paneHeaderStyle}>
            <PaneTabs tabs={['script.R']} active="script.R" onSelect={() => {}} />
            <button
              type="button"
              title="Run"
              style={{
                border: 'none',
                background: 'transparent',
                color: '#9d9d9d',
                cursor: 'pointer',
                padding: '2px 6px',
              }}
            >
              ▶
            </button>
            <button
              type="button"
              title="Source"
              style={{
                border: 'none',
                background: 'transparent',
                color: '#9d9d9d',
                cursor: 'pointer',
                padding: '2px 6px',
                fontSize: 11,
              }}
            >
              Source
            </button>
          </div>
          <pre
            style={{
              flex: 1,
              margin: 0,
              padding: '12px 16px',
              fontFamily: 'ui-monospace, "Fira Code", "Consolas", monospace',
              fontSize: 13,
              lineHeight: 1.5,
              overflow: 'auto',
              color: '#d4d4d4',
            }}
          >
            <span style={{ color: '#6a9955' }}># R script on HPC</span>
            {'\n'}
            <span style={{ color: '#9cdcfe' }}>x</span>
            <span style={{ color: '#d4d4d4' }}> &lt;- </span>
            <span style={{ color: '#4ec9b0' }}>c</span>
            <span style={{ color: '#d4d4d4' }}>(</span>
            <span style={{ color: '#b5cea8' }}>1</span>
            <span style={{ color: '#d4d4d4' }}>, </span>
            <span style={{ color: '#b5cea8' }}>2</span>
            <span style={{ color: '#d4d4d4' }}>, </span>
            <span style={{ color: '#b5cea8' }}>3</span>
            <span style={{ color: '#d4d4d4' }}>, </span>
            <span style={{ color: '#b5cea8' }}>4</span>
            <span style={{ color: '#d4d4d4' }}>, </span>
            <span style={{ color: '#b5cea8' }}>5</span>
            <span style={{ color: '#d4d4d4' }}>)</span>
            {'\n'}
            <span style={{ color: '#9cdcfe' }}>y</span>
            <span style={{ color: '#d4d4d4' }}> &lt;- x^</span>
            <span style={{ color: '#b5cea8' }}>2</span>
            {'\n\n'}
            <span style={{ color: '#4ec9b0' }}>plot</span>
            <span style={{ color: '#d4d4d4' }}>(x, y, type = </span>
            <span style={{ color: '#ce9178' }}>"l"</span>
            <span style={{ color: '#d4d4d4' }}>)</span>
            {'\n\n'}
            <span style={{ color: '#6a9955' }}># Summary</span>
            {'\n'}
            <span style={{ color: '#4ec9b0' }}>summary</span>
            <span style={{ color: '#d4d4d4' }}>(</span>
            <span style={{ color: '#4ec9b0' }}>lm</span>
            <span style={{ color: '#d4d4d4' }}>(y ~ x))</span>
            {'\n'}
            <span style={{ color: '#6a9955' }}>█</span>
          </pre>
        </div>

        {/* Top-right: Environment pane */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: '#1e1e1e',
            border: '1px solid var(--border-subtle)',
            minHeight: 0,
          }}
        >
          <div style={paneHeaderStyle}>
            <PaneTabs
              tabs={['Environment', 'History', 'Connections', 'Build', 'VCS', 'Tutorial']}
              active={envTab}
              onSelect={setEnvTab}
            />
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 8, fontSize: 12 }}>
            {envTab === 'Environment' && (
              <>
                <div style={{ color: '#808080', marginBottom: 6 }}>Global Environment</div>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#d4d4d4' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>Name</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>Type</th>
                      <th style={{ textAlign: 'left', padding: '4px 8px', fontWeight: 500 }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '4px 8px' }}>x</td>
                      <td style={{ padding: '4px 8px', color: '#808080' }}>num</td>
                      <td style={{ padding: '4px 8px', color: '#808080' }}>1 2 3 4 5</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '4px 8px' }}>y</td>
                      <td style={{ padding: '4px 8px', color: '#808080' }}>num</td>
                      <td style={{ padding: '4px 8px', color: '#808080' }}>1 4 9 16 25</td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
            {envTab !== 'Environment' && (
              <div style={{ color: '#808080' }}>No {envTab.toLowerCase()} data</div>
            )}
          </div>
        </div>

        {/* Bottom-left: Console */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: '#1e1e1e',
            border: '1px solid var(--border-subtle)',
            minHeight: 0,
          }}
        >
          <div style={paneHeaderStyle}>
            <PaneTabs tabs={['Console', 'Terminal', 'Background Jobs']} active="Console" onSelect={() => {}} />
          </div>
          <div
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '8px 12px',
              fontFamily: 'ui-monospace, "Fira Code", "Consolas", monospace',
              fontSize: 13,
              color: '#d4d4d4',
            }}
          >
            <div>
              <span style={{ color: '#4ec9b0' }}>&gt; </span>
              <span>x &lt;- c(1, 2, 3, 4, 5)</span>
            </div>
            <div>
              <span style={{ color: '#4ec9b0' }}>&gt; </span>
              <span>y &lt;- x^2</span>
            </div>
            <div>
              <span style={{ color: '#4ec9b0' }}>&gt; </span>
              <span>summary(lm(y ~ x))</span>
            </div>
            <div style={{ color: '#808080', marginTop: 8, whiteSpace: 'pre-wrap' }}>
              {`Call:
lm(formula = y ~ x)

Coefficients:
            Estimate Std. Error t value Pr(>|t|)
(Intercept)  -5.0000     0.7071  -7.071  0.00565 **
x             5.0000     0.2121  23.570  0.00016 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1`}
            </div>
            <div style={{ marginTop: 8 }}>
              <span style={{ color: '#4ec9b0' }}>&gt; </span>
              <span style={{ color: '#6a9955' }}>█</span>
            </div>
          </div>
        </div>

        {/* Bottom-right: Output (Files / Plots / Packages / Help) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            background: '#1e1e1e',
            border: '1px solid var(--border-subtle)',
            minHeight: 0,
          }}
        >
          <div style={paneHeaderStyle}>
            <PaneTabs
              tabs={['Files', 'Plots', 'Packages', 'Help', 'Viewer', 'Presentation']}
              active={outputTab}
              onSelect={setOutputTab}
            />
          </div>
          <div style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
            {outputTab === 'Plots' && (
              <div
                style={{
                  padding: 12,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fff',
                  margin: 8,
                  borderRadius: 4,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '80%',
                    height: '80%',
                    maxWidth: 320,
                    maxHeight: 200,
                    background: 'linear-gradient(to top, #276dc2 0%, #5a9fd4 50%, #87ceeb 100%)',
                    borderRadius: 4,
                    position: 'relative',
                  }}
                >
                  <svg
                    viewBox="0 0 200 120"
                    style={{ width: '100%', height: '100%', opacity: 0.9 }}
                    preserveAspectRatio="none"
                  >
                    <polyline
                      fill="none"
                      stroke="rgba(0,0,0,0.4)"
                      strokeWidth="2"
                      points="20,100 60,70 100,45 140,25 180,15"
                    />
                  </svg>
                </div>
              </div>
            )}
            {outputTab === 'Help' && (
              <div style={{ padding: 12, fontSize: 12, color: '#d4d4d4' }}>
                <div style={{ fontWeight: 600, marginBottom: 8, color: '#4ec9b0' }}>lm</div>
                <div style={{ color: '#808080', marginBottom: 8 }}>Fitting Linear Models</div>
                <div style={{ marginBottom: 8 }}>
                  <code style={{ background: '#2d2d30', padding: '2px 6px', borderRadius: 4 }}>lm(formula, data, ...)</code>
                </div>
                <div style={{ color: '#9d9d9d' }}>
                  Description: lm is used to fit linear models. It can be used to carry out regression...
                </div>
              </div>
            )}
            {outputTab === 'Files' && (
              <div style={{ padding: 8, fontSize: 12, color: '#808080' }}>
                <div style={{ marginBottom: 4 }}>../</div>
                <div style={{ marginBottom: 4 }}>my_project/</div>
                <div style={{ marginBottom: 4, color: '#d4d4d4' }}>script.R</div>
                <div style={{ marginBottom: 4 }}>data.csv</div>
              </div>
            )}
            {!['Plots', 'Help', 'Files'].includes(outputTab) && (
              <div style={{ padding: 12, color: '#808080', fontSize: 12 }}>No {outputTab.toLowerCase()} content</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
