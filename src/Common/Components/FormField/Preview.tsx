import { useState } from "react";
import Button from "../Button";
import Icon from "../Icon";
import Modal from "../Modal";

interface PreviewProps {
  file: File | string;
  onCancel?: () => void;
  basePath?: string;
  className?: string;
}

const Preview: React.FC<PreviewProps> = ({
  file,
  onCancel,
  basePath,
  className = "bg-gray-100 p-2 rounded-lg shadow flex items-center justify-between w-full",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isLocalFile = typeof file !== "string";
  const fileType = isLocalFile
    ? (file as File).type
    : file.split(".").pop()?.toLowerCase();
  const fileUrl = isLocalFile
    ? URL.createObjectURL(file as File)
    : basePath
    ? `${basePath}/${file}`
    : file;

  const renderFilePreview = () => {
    if (
      fileType?.startsWith("image") ||
      ["png", "jpg", "jpeg", "gif"].includes(fileType || "")
    ) {
      return (
        <img
          src={fileUrl}
          alt="Preview"
          className="max-w-full max-h-[80vh] md:max-h-[90vh] object-contain rounded-lg"
        />
      );
    }
    if (fileType === "pdf") {
      return (
        <iframe
          src={fileUrl}
          className="w-full h-[80vh] md:h-[90vh] rounded-lg"
          title="PDF Preview"
        />
      );
    }
    return <p className="text-gray-700 text-center">Unsupported file type</p>;
  };

  return (
    <div>
      <div
        className={`flex items-center justify-between space-x-2 ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        <Icon
          name={
            fileType?.startsWith("image")
              ? "chooseImage"
              : fileType === "pdf"
              ? "pdf"
              : "files"
          }
          className="text-Primary-500"
        />
        <span className="text-sm text-gray-700 truncate max-w-xs sm:max-w-sm md:max-w-md font-semibold">
          {isLocalFile ? (file as File).name : file.split("/").pop()}
        </span>
        {onCancel && (
          <Button
            onClick={onCancel}
            icon={<Icon name="close" />}
            variant="filled"
            className="text-gray-500 hover:text-red-600 !bg-transparent"
          />
        )}
      </div>

      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={
            isLocalFile
              ? (file as File).name
              : file.split("/").pop() || "File Preview"
          }
        >
          {renderFilePreview()}
        </Modal>
      )}
    </div>
  );
};

export default Preview;
