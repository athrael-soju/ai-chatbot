// steps.ts

import { Database, FileText, Settings, Zap } from 'lucide-react';

export const steps = [
  {
    title: 'Set up your providers',
    description:
      'Configure processing/chunking, vector DB, reranking, and embedding',
    icon: Database,
    options: {
      processing: ['Option 1', 'Option 2', 'Option 3'],
      vectorDB: ['Option A', 'Option B', 'Option C'],
      reranking: ['Choice 1', 'Choice 2', 'Choice 3'],
      embedding: ['Type 1', 'Type 2', 'Type 3'],
    },
  },
  {
    title: 'Configure your processing settings',
    description: 'Set up the processing parameters for your pipeline',
    icon: FileText,
    options: {
      parameter1: ['Low', 'Medium', 'High'],
      parameter2: ['Fast', 'Balanced', 'Thorough'],
    },
  },
  {
    title: 'Configure your chunking settings',
    description: 'Set up the chunking parameters for your pipeline',
    icon: Settings,
    options: {
      chunkSize: ['Small', 'Medium', 'Large'],
      overlap: ['None', 'Minimal', 'Moderate', 'Significant'],
    },
  },
  {
    title: 'Configure your retrieval settings',
    description: 'Set up the retrieval parameters for your pipeline',
    icon: Zap,
    options: {
      method: ['BM25', 'TF-IDF', 'Semantic'],
      topK: ['5', '10', '20', '50'],
    },
  },
];
