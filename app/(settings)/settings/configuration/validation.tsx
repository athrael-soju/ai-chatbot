// validation.ts

import { z } from 'zod';

export const configurationSchema = z.object({
  processing: z.string().nonempty({ message: 'Processing is required' }),
  vectorDB: z.string().nonempty({ message: 'Vector DB is required' }),
  reranking: z.string().nonempty({ message: 'Reranking is required' }),
  embedding: z.string().nonempty({ message: 'Embedding is required' }),
  parameter1: z.string().nonempty({ message: 'Parameter1 is required' }),
  parameter2: z.string().nonempty({ message: 'Parameter2 is required' }),
  chunkSize: z.string().nonempty({ message: 'Chunk size is required' }),
  overlap: z.string().nonempty({ message: 'Overlap is required' }),
  method: z.string().nonempty({ message: 'Method is required' }),
  topK: z.string().nonempty({ message: 'TopK is required' }),
});

export type ConfigurationFormData = z.infer<typeof configurationSchema>;
