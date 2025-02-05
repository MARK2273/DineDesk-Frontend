import { PropsWithChildren, useEffect, useState } from "react";
import Sidebar from "./Sidebar";

type AppLayoutProps = PropsWithChildren;

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1200);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1200);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex bg-Gray-300 h-screen">
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div
        className={`relative h-full ml-auto transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "w-[calc(100%-66px)] xl:w-[calc(100%-255px)]"
            : "w-[calc(100%-66px)]"
        }`}
      >
        <div className="px-4 md:px-26px py-4 sm:py-5 h-[calc(100%-60px)] sm:h-[calc(100%-80px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
