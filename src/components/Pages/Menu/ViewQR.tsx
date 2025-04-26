import Modal from "@dine-desk/Common/Components/Modal";
import { APP_BASE_URL } from "@dine-desk/constants/credentials";
import QRCode from "react-qr-code";
import { useRef } from "react";
import Button from "@dine-desk/Common/Components/Button";

interface ViewQRModalProps {
  open: boolean;
  onClose: () => void;
  id?: string;
}

const ViewQR: React.FC<ViewQRModalProps> = ({ id, open, onClose }) => {
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
      downloadLink.download = `QR_Code_${id}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="View Menu"
      width="sm"
      ParentClassName="!bg-opacity-50"
      TitleClassname="!text-gray-900 font-semibold"
    >
      <div className="flex flex-col items-center justify-center p-6 gap-4">
        {/* QR Code */}
        <div ref={qrRef} className="p-4 bg-white rounded-lg shadow-md border">
          <QRCode value={qrValue} size={180} />
        </div>

        {/* Link Display */}
        <p className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-md break-all">
          {qrValue}
        </p>

        {/* Buttons */}
        <div className="flex gap-4">
          <Button
            variant="filled"
            title="Download QR"
            onClick={handleDownload}
            className="px-4 py-2 cursor-pointer text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
          />
          <Button
            variant="filled"
            title="Close"
            onClick={onClose}
            className="px-4 py-2 cursor-pointer text-white bg-gray-600 rounded-lg shadow hover:bg-gray-700 transition"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ViewQR;
