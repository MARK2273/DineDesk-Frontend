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
    <div className="flex flex-col gap-4">
      {label && <label className="font-semibold text-gray-700">{label}</label>}
      {files.length === 0 && (
        <div
          onClick={() => inputRef.current?.click()}
          className="flex items-center justify-center px-6 py-4 border-2 border-dashed border-blue-500 rounded-lg cursor-pointer transition-all hover:bg-blue-50"
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
      {showPreview && files.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-2">
          {files.map((file, index) => (
            <Preview
              key={index}
              file={file}
              onCancel={() => removeFile(index)}
            />
          ))}
        </div>
      )}
      {isMulti && files.length > 0 && (
        <Button
          type="button"
          className=" text-sm font-medium text-red-500"
          onClick={() => setFiles([])}
          title="Clear All"
          variant="none"
        />
      )}
    </div>
  );
};

export default FileUpload;
