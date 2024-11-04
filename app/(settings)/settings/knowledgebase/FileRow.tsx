import { motion } from 'framer-motion';
import { CheckCircle, Clock, RefreshCw, Trash2, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TableCell } from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface File {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
  status: 'uploading' | 'uploaded' | 'processing' | 'processed' | 'error';
  progress: number; 
}

interface FileRowProps {
  file: File;
  onProcessFile: (id: string) => void;
  onDeleteFile: (id: string) => void;
}

export function FileRow({ file, onProcessFile, onDeleteFile }: FileRowProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusIcon = (status: File['status'], progress: number) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return (
          <div className="relative size-5">
            <Clock className="size-5 text-blue-500 animate-pulse" />
            <svg className="absolute top-0 left-0 size-5">
              <circle
                cx="10"
                cy="10"
                r="8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={50}
                strokeDashoffset={50 - progress / 2}
                className="text-blue-500"
                transform="rotate(-90 10 10)"
              />
            </svg>
          </div>
        );
      case 'uploaded':
        return <Clock className="size-5 text-gray-500" />;
      case 'processed':
        return <CheckCircle className="size-5 text-green-500" />;
      case 'error':
        return <XCircle className="size-5 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <motion.tr
      key={file.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <TableCell>{file.name}</TableCell>
      <TableCell>{formatFileSize(file.size)}</TableCell>
      <TableCell>{file.type}</TableCell>
      <TableCell>{file.uploadDate.toLocaleString()}</TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex items-center space-x-2">
                {getStatusIcon(file.status, file.progress)}
                <span className="capitalize">{file.status}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {file.status === 'uploading' || file.status === 'processing'
                ? `${file.progress}% complete`
                : `${file.status.charAt(0).toUpperCase() + file.status.slice(1)}`}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onProcessFile(file.id)}
            disabled={file.status !== 'uploaded'}
          >
            <RefreshCw className="size-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDeleteFile(file.id)}
            disabled={
              file.status === 'uploading' || file.status === 'processing'
            }
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </TableCell>
    </motion.tr>
  );
}
