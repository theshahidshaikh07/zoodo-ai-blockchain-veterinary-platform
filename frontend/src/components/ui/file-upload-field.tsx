'use client';

import * as React from 'react';
import { X, UploadCloud } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadFieldProps {
  label: string;
  name: string;
  value: File | null;
  onChange: (name: string, file: File | null) => void;
  required?: boolean;
  helperText?: string;
  accept?: string;
  className?: string;
}

const FileUploadField = React.forwardRef<HTMLInputElement, FileUploadFieldProps>((
  {
    label,
    name,
    value,
    onChange,
    required = false,
    helperText,
    accept = 'image/*,application/pdf',
    className,
    ...props
  },
  ref,
) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    onChange(name, file);
  };

  const handleClearFile = () => {
    onChange(name, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="flex items-center space-x-2">
        <Input
          id={name}
          name={name}
          type="file"
          ref={(e) => {
            if (fileInputRef) (fileInputRef.current as any) = e;
            if (ref) {
              if (typeof ref === 'function') ref(e);
              else ref.current = e;
            }
          }}
          onChange={handleFileChange}
          className="hidden" // Hide the default file input
          accept={accept}
          {...props}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 justify-start h-10"
        >
          <UploadCloud className="mr-2 h-4 w-4" />
          {value ? value.name : 'Choose file'}
        </Button>
        {value && (
          <Button type="button" variant="ghost" size="icon" onClick={handleClearFile}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {helperText && <p className="text-xs text-muted-foreground ml-2">{helperText}</p>}
    </div>
  );
});

FileUploadField.displayName = 'FileUploadField';

export { FileUploadField };
