import React from "react";
import Repeater from "../Repeater";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, count = 1 }) => {
  return (
    <Repeater count={count}>
      <div
        className={`relative bg-gray-200 rounded-md overflow-hidden animate-pulse ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer"></div>
      </div>
    </Repeater>
  );
};

export default Skeleton;
