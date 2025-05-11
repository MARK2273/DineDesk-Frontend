import Modal from "@dine-desk/Common/Components/Modal";
import { APP_BASE_URL } from "@dine-desk/constants/credentials";
import QRCode from "react-qr-code";
import { useRef } from "react";
import Button from "@dine-desk/Common/Components/Button";

interface ViewQRModalProps {
  open: boolean;
  onClose: () => void;
  id?: string;
  menuName?: string;
}

const ViewQR: React.FC<ViewQRModalProps> = ({
  id,
  open,
  onClose,
  menuName,
}) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrValue = `${APP_BASE_URL}/view-menu/${id}`;

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `DineDesk_${menuName || `Menu_${id}`}_QR.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Modal open={open} onClose={onClose} title="Menu QR Code" width="sm">
      <div className="flex flex-col items-center p-6 space-y-6">
        {menuName && (
          <h3 className="text-lg font-medium text-gray-800 text-center">
            {menuName}
          </h3>
        )}

        <div
          ref={qrRef}
          className="p-4 bg-white rounded-lg border-2 border-gray-200 shadow-sm"
        >
          <QRCode
            value={qrValue}
            size={180}
            bgColor="#ffffff"
            fgColor="#111827"
            level="H" // High error correction
          />
        </div>

        <div className="w-full space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Menu Link</p>
            <p className="text-sm text-gray-700 break-all font-mono">
              {qrValue}
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Button
              variant="filled"
              onClick={handleDownload}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Download QR
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-300 hover:bg-gray-50"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewQR;
