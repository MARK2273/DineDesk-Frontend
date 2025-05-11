import { PropsWithChildren, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import clsx from "clsx";
import Header from "./Header";

type AppLayoutProps = PropsWithChildren;

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
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
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gradient-to-br from-yellow-50/20 via-white to-yellow-100/20">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
