
export function RStudioView() {
  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '2px',
        background: '#2d2d30',
      }}
    >
      <div
        style={{
          background: '#1e1e1e',
          padding: '12px',
          overflow: 'auto',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ fontSize: '12px', color: '#808080', marginBottom: '8px' }}>script.R</div>
        <pre
          style={{
            margin: 0,
            fontFamily: 'ui-monospace, monospace',
            fontSize: '13px',
            color: '#d4d4d4',
          }}
        >
          {`# R script on HPC
x <- c(1, 2, 3, 4, 5)
y <- x^2

plot(x, y, type = "l")

# Summary
summary(lm(y ~ x))`}
        </pre>
      </div>
      <div
        style={{
          background: '#1e1e1e',
          padding: '12px',
          overflow: 'auto',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ fontSize: '12px', color: '#808080', marginBottom: '8px' }}>Console</div>
        <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: '13px', color: '#d4d4d4' }}>
          <div>
            <span style={{ color: '#4ec9b0' }}>&gt; </span>
            <span>x &lt;- c(1, 2, 3, 4, 5)</span>
          </div>
          <div>
            <span style={{ color: '#4ec9b0' }}>&gt; </span>
            <span>summary(lm(y ~ x))</span>
          </div>
          <div style={{ color: '#808080', marginTop: '8px' }}>
            Call: lm(formula = y ~ x)
            <br />
            Coefficients: (Intercept) x
            <br />
            -5.0 5.0
          </div>
          <div style={{ marginTop: '8px' }}>
            <span style={{ color: '#4ec9b0' }}>&gt; </span>
            <span style={{ color: '#6a9955' }}>█</span>
          </div>
        </div>
      </div>
      <div
        style={{
          gridColumn: '1 / -1',
          background: '#252526',
          padding: '12px',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          gap: '24px',
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#808080', marginBottom: '8px' }}>Environment</div>
          <div style={{ fontSize: '13px', color: '#d4d4d4' }}>
            x: num [1:5] 1 2 3 4 5
            <br />
            y: num [1:5] 1 4 9 16 25
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', color: '#808080', marginBottom: '8px' }}>Plots</div>
          <div
            style={{
              width: '100%',
              height: 120,
              background: '#1e1e1e',
              border: '1px dashed #3c3c3c',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#808080',
              fontSize: '12px',
            }}
          >
            Plot placeholder
          </div>
        </div>
      </div>
    </div>
  );
}
