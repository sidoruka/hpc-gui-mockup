import { Play, Box } from 'lucide-react';

export type RunStatus = 'SUCCESS' | 'STOPPED' | 'FAILURE' | 'RUNNING';

export interface PipelineRun {
  id: string;
  runId: number;
  pipelineName: string;
  project: string;
  startedAt: string;
  estimatedPrice: number;
  status: RunStatus;
}

const MOCK_RUNNING: PipelineRun[] = [
  {
    id: 'run-601166',
    runId: 601166,
    pipelineName: 'nf-core-rnaseq',
    project: 'DiscoBio-M100',
    startedAt: '2025-02-17, 19:15:00',
    estimatedPrice: 2.5,
    status: 'RUNNING',
  },
];

/** Number of currently running pipelines; used e.g. for the left-pane "Runs" badge. */
export const runningPipelinesCount = MOCK_RUNNING.length;

const MOCK_HISTORY: PipelineRun[] = [
  {
    id: 'run-601165',
    runId: 601165,
    pipelineName: 'nf-core-rnaseq',
    project: 'DiscoBio-M100',
    startedAt: '2025-02-17, 19:09:20',
    estimatedPrice: 0.01,
    status: 'STOPPED',
  },
  {
    id: 'run-597550',
    runId: 597550,
    pipelineName: 'nf-core-sarek',
    project: 'TestProject10',
    startedAt: '2025-02-05, 16:10:38',
    estimatedPrice: 0.01,
    status: 'SUCCESS',
  },
  {
    id: 'run-597537',
    runId: 597537,
    pipelineName: 'nf-core-rnaseq',
    project: 'DiscoBio-M100',
    startedAt: '2025-02-05, 15:32:15',
    estimatedPrice: 10.4,
    status: 'STOPPED',
  },
  {
    id: 'run-597510',
    runId: 597510,
    pipelineName: 'nf-core-rnafusion',
    project: 'DiscoBio-M100',
    startedAt: '2025-02-05, 13:35:30',
    estimatedPrice: 0.01,
    status: 'SUCCESS',
  },
  {
    id: 'run-597508',
    runId: 597508,
    pipelineName: 'nf-core-ampliseq',
    project: 'Breast-Cancer',
    startedAt: '2025-02-05, 13:32:53',
    estimatedPrice: 0.01,
    status: 'SUCCESS',
  },
  {
    id: 'run-597507',
    runId: 597507,
    pipelineName: 'nf-core-sarek',
    project: '10x-Lung-Cancer',
    startedAt: '2025-02-05, 13:32:32',
    estimatedPrice: 0.01,
    status: 'SUCCESS',
  },
  {
    id: 'run-597506',
    runId: 597506,
    pipelineName: 'nf-core-rnaseq',
    project: 'DiscoBio-M100',
    startedAt: '2025-02-05, 13:32:04',
    estimatedPrice: 16.43,
    status: 'SUCCESS',
  },
  {
    id: 'run-597505',
    runId: 597505,
    pipelineName: 'nf-core-sarek',
    project: '10x-Lung-Cancer',
    startedAt: '2025-02-05, 13:28:54',
    estimatedPrice: 0.01,
    status: 'FAILURE',
  },
];

const statusStyle: Record<RunStatus, { bg: string; color: string }> = {
  SUCCESS: { bg: 'var(--run-status-success)', color: '#fff' },
  STOPPED: { bg: 'var(--run-status-stopped)', color: '#fff' },
  FAILURE: { bg: 'var(--run-status-failure)', color: '#fff' },
  RUNNING: { bg: 'var(--run-status-running)', color: '#fff' },
};

function RunRow({ run }: { run: PipelineRun }) {
  const status = statusStyle[run.status];
  return (
    <div
      style={{
        padding: '12px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <span
          style={{
            color: 'var(--accent-pipelines)',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {run.pipelineName} (#{run.runId})
        </span>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            padding: '2px 8px',
            borderRadius: '4px',
            background: status.bg,
            color: status.color,
            flexShrink: 0,
          }}
        >
          {run.status}
        </span>
      </div>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          background: 'var(--bg-hover)',
          padding: '2px 8px',
          borderRadius: '4px',
          width: 'fit-content',
        }}
      >
        <Box size={12} color="var(--text-secondary)" />
        {run.project}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
        Started on: {run.startedAt}
        {' · '}
        Estimated price: $ {run.estimatedPrice.toFixed(2)}
      </div>
    </div>
  );
}

export function RunsView() {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-main)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          background: 'var(--bg-search)',
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Play size={20} color="var(--text-secondary)" />
          <h1
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            Runs history
          </h1>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {MOCK_RUNNING.length > 0 && (
          <div style={{ flexShrink: 0 }}>
            <div
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                background: 'var(--bg-sidebar)',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              Currently running
            </div>
            {MOCK_RUNNING.map((run) => (
              <RunRow key={run.id} run={run} />
            ))}
          </div>
        )}
        <div style={{ flexShrink: 0 }}>
          <div
            style={{
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--text-secondary)',
              background: 'var(--bg-sidebar)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            History
          </div>
          {MOCK_HISTORY.map((run) => (
            <RunRow key={run.id} run={run} />
          ))}
        </div>
      </div>
    </div>
  );
}
