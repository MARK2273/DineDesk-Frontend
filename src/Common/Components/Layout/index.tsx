import { PropsWithChildren, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import clsx from "clsx";
import Header from "./Header";

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
    <div className="flex bg-Gray-300 h-screen overflow-hidden">
      <Sidebar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div
        className={clsx(
          "relative flex flex-col h-full transition-all duration-300 ease-in-out",
          isSidebarOpen
            ? "ml-64 w-[calc(100%-64px)]"
            : "ml-16 w-[calc(100%-16px)]"
        )}
      >
        <div className="flex-shrink-0 z-10 bg-white shadow-md">
          <Header />
        </div>
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
