import { AnimatePresence } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { FileRow } from './FileRow';

interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  status: 'uploading' | 'uploaded' | 'processing' | 'processed' | 'error';
  progress: number;
}

interface FileTableProps {
  files: File[];
  sortColumn: keyof File;
  sortDirection: 'asc' | 'desc';
  onSort: (column: keyof File) => void;
  onProcessFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

export function FileTable({
  files,
  onSort,
  onProcessFile,
  onDeleteFile,
}: FileTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead onClick={() => onSort('name')} className="cursor-pointer">
            Name <ArrowUpDown className="inline-block size-4 ml-1" />
          </TableHead>
          <TableHead onClick={() => onSort('size')} className="cursor-pointer">
            Size <ArrowUpDown className="inline-block size-4 ml-1" />
          </TableHead>
          <TableHead onClick={() => onSort('type')} className="cursor-pointer">
            Type <ArrowUpDown className="inline-block size-4 ml-1" />
          </TableHead>
          <TableHead
            onClick={() => onSort('uploadDate')}
            className="cursor-pointer"
          >
            Upload Date <ArrowUpDown className="inline-block size-4 ml-1" />
          </TableHead>
          <TableHead
            onClick={() => onSort('status')}
            className="cursor-pointer"
          >
            Status <ArrowUpDown className="inline-block size-4 ml-1" />
          </TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <AnimatePresence>
          {files.map((file) => (
            <FileRow
              key={file.id}
              file={file}
              onProcessFile={onProcessFile}
              onDeleteFile={onDeleteFile}
            />
          ))}
        </AnimatePresence>
      </TableBody>
    </Table>
  );
}
