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
        className={`relative bg-Primary-100-opacity-90 rounded overflow-hidden ${className}`}
      >
        <span className="absolute top-2/4 -translate-y-2/4 h-[200%] w-24 bg-white/70 blur-lg animate-skeleton -skew-x-[25deg] "></span>
      </div>
    </Repeater>
  );
};

export default Skeleton;
