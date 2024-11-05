'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Trash2,
  RefreshCw,
  ArrowUpDown,
  Search,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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

interface KnowledgebaseProps {
  onClose: () => void;
}

export function Knowledgebase({ onClose }: KnowledgebaseProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof File>('uploadDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isUploading, setIsUploading] = useState(false);
  const [canReturnToSettings, setCanReturnToSettings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const filesPerPage = 5;

  useEffect(() => {
    const hasProcessedFile = files.some((file) => file.status === 'processed');
    setCanReturnToSettings(hasProcessedFile);
  }, [files]);

  const simulateFileUpload = (file: File) => {
    const uploadInterval = setInterval(() => {
      setFiles((prevFiles) =>
        prevFiles.map((f) =>
          f.id === file.id
            ? { ...f, progress: Math.min(f.progress + 10, 100) }
            : f
        )
      );
    }, 200);

    setTimeout(
      () => {
        clearInterval(uploadInterval);
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.id === file.id ? { ...f, status: 'uploaded', progress: 100 } : f
          )
        );
      },
      2000 + Math.random() * 1000
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      setIsUploading(true);
      const newFiles: File[] = Array.from(fileList).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        status: 'uploading',
        progress: 0,
      }));

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
      newFiles.forEach(simulateFileUpload);

      setTimeout(
        () => {
          setIsUploading(false);
        },
        2000 + newFiles.length * 500
      );
    }
  };

  const handleProcessFile = (id: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id ? { ...file, status: 'processing', progress: 0 } : file
      )
    );

    const processInterval = setInterval(() => {
      setFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === id
            ? { ...file, progress: Math.min(file.progress + 10, 100) }
            : file
        )
      );
    }, 200);

    setTimeout(
      () => {
        clearInterval(processInterval);
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file.id === id
              ? { ...file, status: 'processed', progress: 100 }
              : file
          )
        );
      },
      2000 + Math.random() * 1000
    );
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  const handleSort = (column: keyof File) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedFiles = [...files].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredFiles = sortedFiles.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages =
    filteredFiles.length > 0
      ? Math.ceil(filteredFiles.length / filesPerPage)
      : 0;
  const paginatedFiles = filteredFiles.slice(
    (currentPage - 1) * filesPerPage,
    currentPage * filesPerPage
  );

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>File Management</CardTitle>
          <CardDescription>
            Upload and manage your knowledgebase files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <div className="w-full md:w-1/2">
              <Input
                type="text"
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileUpload}
                multiple
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="mr-2 size-4" />
                Upload Files
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={files.length > 0 && !canReturnToSettings}
              >
                <ArrowLeft className="mr-2 size-4" />
                Return to Settings
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => handleSort('name')}
                  className="cursor-pointer"
                >
                  Name <ArrowUpDown className="inline-block size-4 ml-1" />
                </TableHead>
                <TableHead
                  onClick={() => handleSort('size')}
                  className="cursor-pointer hidden sm:table-cell"
                >
                  Size <ArrowUpDown className="inline-block size-4 ml-1" />
                </TableHead>
                <TableHead
                  onClick={() => handleSort('type')}
                  className="cursor-pointer hidden md:table-cell"
                >
                  Type <ArrowUpDown className="inline-block size-4 ml-1" />
                </TableHead>
                <TableHead
                  onClick={() => handleSort('uploadDate')}
                  className="cursor-pointer hidden lg:table-cell"
                >
                  Upload Date{' '}
                  <ArrowUpDown className="inline-block size-4 ml-1" />
                </TableHead>
                <TableHead
                  onClick={() => handleSort('status')}
                  className="cursor-pointer"
                >
                  Status <ArrowUpDown className="inline-block size-4 ml-1" />
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFiles.length > 0 ? (
                paginatedFiles.map((file) => (
                  <motion.tr
                    key={file.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <TableCell className="font-medium">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="truncate max-w-[150px] block">
                            {file.name}
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>{file.name}</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatFileSize(file.size)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="truncate max-w-[100px] block">
                            {file.type.length > 10
                              ? `${file.type.slice(0, 10)}…`
                              : file.type}
                          </TooltipTrigger>
                          <TooltipContent>
                            <span>{file.type}</span>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {file.uploadDate.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(file.status, file.progress)}
                              <span className="capitalize hidden sm:inline">
                                {file.status}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {file.status === 'uploading' ||
                            file.status === 'processing'
                              ? `${file.progress}% complete`
                              : `${file.status.charAt(0).toUpperCase() + file.status.slice(1)}`}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleProcessFile(file.id)}
                          disabled={file.status !== 'uploaded'}
                        >
                          <RefreshCw className="size-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => handleDeleteFile(file.id)}
                          disabled={
                            file.status === 'uploading' ||
                            file.status === 'processing'
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No files available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>{files.length} file(s) uploaded</div>
          {totalPages > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
