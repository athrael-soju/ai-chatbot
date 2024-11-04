import { Upload } from 'lucide-react';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export function FileUploader({ onFileUpload, isUploading }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={onFileUpload}
        multiple
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Upload className="mr-2 size-4" />
        Upload Files
      </Button>
    </>
  );
}
