import React, { useState, useRef, useEffect } from "react";
import Button from "../Button";
import Preview from "./Preview";

interface FileUploadProps {
  label?: string;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  isMulti?: boolean;
  value?: (File | string)[];
  onChange?: (files: (File | string)[]) => void;
  onError?: (error: string) => void;
  showPreview?: boolean;
  error?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label = "Upload Files",
  allowedFileTypes = ["image/png", "image/jpeg", "application/pdf"],
  maxFileSize = 10 * 1024 * 1024,
  isMulti = false,
  value = [],
  onChange,
  onError,
  showPreview = true,
  error,
}) => {
  const [files, setFiles] = useState<(File | string)[]>(value || []);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (JSON.stringify(files) !== JSON.stringify(value)) {
      setFiles(value || []);
    }
  }, [value]);

  const processFiles = (selectedFiles: File[]) => {
    const validFiles: File[] = [];
    selectedFiles.forEach((file) => {
      if (!allowedFileTypes.includes(file.type)) {
        return onError?.(`Invalid file type: ${file.name}`);
      }
      if (file.size > maxFileSize) {
        return onError?.(`File ${file.name} exceeds size limit.`);
      }
      validFiles.push(file);
    });

    const newFiles = isMulti ? [...files, ...validFiles] : validFiles;
    setFiles(newFiles);
    onChange?.(newFiles);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(Array.from(event.target.files));
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onChange?.(updatedFiles);
  };

  return (
    <div className="flex flex-col w-full max-w-lg mx-auto">
      {label && (
        <label className="font-semibold text-gray-700 text-sm sm:text-base">
          {label}
        </label>
      )}

      {/* Upload Box */}
      {files.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center px-4 py-3 sm:px-6 sm:py-4 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer transition-all hover:bg-blue-50 text-center text-sm sm:text-base"
        >
          <span className="text-blue-500 font-medium">Click to upload</span>
        </div>
      )}

      <input
        type="file"
        multiple={isMulti}
        ref={inputRef}
        accept={allowedFileTypes.join(", ")}
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}

      {/* File Previews */}
      {showPreview && files.length > 0 && (
        <div className="">
          {files.map((file, index) => (
            <Preview
              key={index}
              file={file}
              onCancel={() => removeFile(index)}
            />
          ))}
        </div>
      )}

      {/* Clear All Button */}
      {isMulti && files.length > 0 && (
        <Button
          type="button"
          className="text-sm sm:text-base font-medium text-red-500"
          onClick={() => setFiles([])}
          title="Clear All"
          variant="none"
        />
      )}
    </div>
  );
};

export default FileUpload;
