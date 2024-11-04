import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { FileTable } from './FileTable';
import { FileUploader } from './FileUploader';
import { SearchBar } from './SearchBar';

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
  const [files, setFiles] = useState<File[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof File>('uploadDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isUploading, setIsUploading] = useState(false);
  const [canReturnToSettings, setCanReturnToSettings] = useState(false);

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
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1 mr-4">
              <SearchBar
                searchTerm={searchTerm}
                onSearchTermChange={setSearchTerm}
              />
            </div>
            <div className="flex space-x-2">
              <FileUploader
                onFileUpload={handleFileUpload}
                isUploading={isUploading}
              />
              <Button
                variant="outline"
                onClick={onClose}
                disabled={!canReturnToSettings}
              >
                <ArrowLeft className="mr-2 size-4" />
                Return to Settings
              </Button>
            </div>
          </div>
          <FileTable
            files={filteredFiles}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onProcessFile={handleProcessFile}
            onDeleteFile={handleDeleteFile}
          />
        </CardContent>
        <CardFooter>
          <div>{files.length} file(s) uploaded</div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
