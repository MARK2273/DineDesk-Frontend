// import NoImageFound from "../../../assets/svg/NoImageFound";
import React, { ImgHTMLAttributes, useState } from "react";

type imgPathType = string | File;

interface ImageProps {
  imgPath: imgPathType;
  serverPath?: boolean;
  width?: number;
  height?: number;
  className?: string;
  imageClassName?: string;
  alt?: string;
  imgAttribute?: ImgHTMLAttributes<HTMLImageElement>;
  onClick?: any;
  firstName?: string;
  lastName?: string;
  intialclassName?: string;
}

const Image: React.FC<ImageProps> = ({
  imgPath,
  width,
  height,
  className,
  imageClassName,
  alt,
  imgAttribute,
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);
  const getFilePath = (path: imgPathType | undefined) => {
    if (path instanceof File) {
      try {
        return URL.createObjectURL(path);
      } catch {
        setHasError(true);
        return null;
      }
    }
    if (typeof path === "string") {
      return path;
    }
    return null;
  };
  const renderFallback = () => {
    // Render "no data found" placeholder
    return (
      <img
        {...imgAttribute}
        height={height}
        width={width}
        // src={NoImageFound}
        alt={alt}
        className={`max-w-full max-h-full ${imageClassName}`}
        onClick={() => onClick}
      />
    );
  };

  const filePath = imgPath && !hasError ? getFilePath(imgPath) : null;
  return (
    <div className={className}>
      {filePath && !hasError ? (
        <img
          {...imgAttribute}
          height={height}
          width={width}
          src={getFilePath(imgPath) || ""}
          alt={alt}
          className={`max-w-full max-h-full ${imageClassName}`}
          onClick={() => onClick}
        />
      ) : (
        renderFallback()
      )}
    </div>
  );
};

export default Image;
