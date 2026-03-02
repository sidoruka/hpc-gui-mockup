import { useState, useMemo } from 'react';
import { Search, Workflow, User } from 'lucide-react';

export type PipelineLanguage = 'nextflow' | 'python' | 'snakemake';
export type PipelineType = 'wgs' | 'rnaseq' | 'scrna';

export interface NgPipeline {
  id: string;
  name: string;
  description: string;
  owner: string;
  language: PipelineLanguage;
  type: PipelineType;
}

const MOCK_PIPELINES: NgPipeline[] = [
  {
    id: '1',
    name: 'nf-core-sarek',
    description:
      'Analysis pipeline to detect germline or somatic variants (pre-processing, variant calling and annotation) from WGS / targeted sequencing.',
    owner: 'Sidoruk Aleksandr',
    language: 'nextflow',
    type: 'wgs',
  },
  {
    id: '2',
    name: 'nf-core-mag',
    description: 'Assembly and binning of metagenomes from short and long reads.',
    owner: 'Sidoruk Aleksandr',
    language: 'nextflow',
    type: 'wgs',
  },
  {
    id: '3',
    name: 'nf-core-chipseq',
    description: 'ChIP-seq peak calling, QC and differential analysis.',
    owner: 'jane_doe',
    language: 'nextflow',
    type: 'rnaseq',
  },
  {
    id: '4',
    name: 'nf-core-ampliseq',
    description: 'Amplicon sequencing (e.g. 16S) with taxonomic and functional profiling.',
    owner: 'jane_doe',
    language: 'nextflow',
    type: 'scrna',
  },
  {
    id: '5',
    name: 'nf-core-nano',
    description: 'Nanopore sequencing QC, assembly and polishing.',
    owner: 'Sidoruk Aleksandr',
    language: 'nextflow',
    type: 'wgs',
  },
  {
    id: '6',
    name: 'nf-core-methylseq',
    description: 'Bisulfite sequencing methylation calling and differential analysis.',
    owner: 'alex_smith',
    language: 'snakemake',
    type: 'rnaseq',
  },
  {
    id: '7',
    name: 'scrna-pipeline',
    description: 'Single-cell RNA-seq processing, clustering and marker detection.',
    owner: 'alex_smith',
    language: 'python',
    type: 'scrna',
  },
  {
    id: '8',
    name: 'rnaseq-dge',
    description: 'Bulk RNA-seq differential gene expression with DESeq2 and edgeR.',
    owner: 'jane_doe',
    language: 'snakemake',
    type: 'rnaseq',
  },
];

const OWNER_OPTIONS = ['All', 'Sidoruk Aleksandr', 'jane_doe', 'alex_smith'];
const LANGUAGE_OPTIONS: { value: '' | PipelineLanguage; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'nextflow', label: 'Nextflow' },
  { value: 'python', label: 'Python' },
  { value: 'snakemake', label: 'Snakemake' },
];
const TYPE_OPTIONS: { value: '' | PipelineType; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'wgs', label: 'WGS' },
  { value: 'rnaseq', label: 'RNA-seq' },
  { value: 'scrna', label: 'scRNA' },
];

export function AllPipelinesView() {
  const [search, setSearch] = useState('');
  const [ownerFilter, setOwnerFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState<PipelineLanguage | ''>('');
  const [typeFilter, setTypeFilter] = useState<PipelineType | ''>('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_PIPELINES.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      if (ownerFilter !== 'All' && p.owner !== ownerFilter) return false;
      if (languageFilter && p.language !== languageFilter) return false;
      if (typeFilter && p.type !== typeFilter) return false;
      return true;
    });
  }, [search, ownerFilter, languageFilter, typeFilter]);

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
          borderBottom: '1px solid var(--border-subtle)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          <Workflow size={22} color="var(--text-secondary)" />
          <h1
            style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 600,
              color: 'var(--text-primary)',
            }}
          >
            Pipelines
          </h1>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              flex: '1 1 280px',
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              background: 'var(--bg-search)',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Search size={18} color="var(--text-secondary)" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                minWidth: 0,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '14px',
              }}
            />
          </div>
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            style={{
              padding: '10px 12px',
              background: 'var(--bg-search)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              minWidth: '140px',
              cursor: 'pointer',
            }}
            aria-label="Filter by owner"
          >
            <option value="All">Owner</option>
            {OWNER_OPTIONS.filter((o) => o !== 'All').map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter((e.target.value || '') as PipelineLanguage | '')}
            style={{
              padding: '10px 12px',
              background: 'var(--bg-search)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              minWidth: '140px',
              cursor: 'pointer',
            }}
            aria-label="Filter by language"
          >
            {LANGUAGE_OPTIONS.map(({ value, label }) => (
              <option key={value || 'all'} value={value}>
                {value ? label : 'Language'}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter((e.target.value || '') as PipelineType | '')}
            style={{
              padding: '10px 12px',
              background: 'var(--bg-search)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '14px',
              minWidth: '120px',
              cursor: 'pointer',
            }}
            aria-label="Filter by type"
          >
            {TYPE_OPTIONS.map(({ value, label }) => (
              <option key={value || 'all'} value={value}>
                {value ? label : 'Type'}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {filtered.map((pipeline, index) => (
            <div
              key={pipeline.id}
              style={{
                padding: '16px 0',
                borderBottom:
                  index < filtered.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: 'var(--accent-launch)',
                    marginBottom: '6px',
                  }}
                >
                  {pipeline.name}
                </div>
                <p
                  style={{
                    margin: '0 0 10px',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.45,
                  }}
                >
                  {pipeline.description}
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '10px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <User size={14} />
                  <span>{pipeline.owner}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      background: 'var(--bg-hover)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {TYPE_OPTIONS.find((o) => o.value === pipeline.type)?.label ?? pipeline.type}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      background: 'var(--bg-hover)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {LANGUAGE_OPTIONS.find((o) => o.value === pipeline.language)?.label ??
                      pipeline.language}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                  type="button"
                  onClick={() => {}}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--accent-shell)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Run
                </button>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p
            style={{
              margin: 0,
              padding: '32px 0',
              color: 'var(--text-secondary)',
              fontSize: '14px',
            }}
          >
            No pipelines match your search or filters.
          </p>
        )}
      </div>
    </div>
  );
}
