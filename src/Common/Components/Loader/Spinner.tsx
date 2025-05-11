const SectionLoader = ({
  className = "",
  size = "h-12 w-12",
  backdrop = true,
}: {
  className?: string;
  size?: string;
  backdrop?: boolean;
}) => {
  return (
    <div
      className={`absolute inset-0 ${
        backdrop ? "bg-white/30 backdrop-blur-xs" : ""
      } z-[9] flex items-center justify-center ${className}`}
    >
      <span
        className={`relative border-[3px] border-yellow-100 border-t-yellow-400 rounded-full block animate-spin ${size}`}
        style={{
          animationDuration: "0.8s",
          animationTimingFunction: "cubic-bezier(0.5, 0.1, 0.25, 1)",
        }}
      />
    </div>
  );
};

export default SectionLoader;
