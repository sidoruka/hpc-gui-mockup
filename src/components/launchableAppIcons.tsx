import type { LucideIcon } from 'lucide-react';
import { FlaskConical, ScanSearch, Atom, Dna, Layers } from 'lucide-react';

export const launchableAppIconMap: Record<string, LucideIcon> = {
  flask: FlaskConical,
  microscope: ScanSearch,
  atom: Atom,
  dna: Dna,
  cells: Layers,
};
