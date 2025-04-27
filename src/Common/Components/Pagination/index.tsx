import { Table } from "@tanstack/react-table";
import clsx from "clsx";
import Icon from "../Icon";

interface PaginationProps<T> {
  table: Table<T>;
  currentPage: number;
  totalPages: number;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
}

export const Pagination = <T,>({
  table,
  currentPage,
  totalPages,
  setCurrentPage,
}: PaginationProps<T>) => {
  const handlePageChange = (pageIndex: number) => {
    table.setPageIndex(pageIndex);
    if (setCurrentPage) setCurrentPage(pageIndex + 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      table.setPageIndex(currentPage);
      if (setCurrentPage) setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      table.setPageIndex(currentPage - 2);
      if (setCurrentPage) setCurrentPage(currentPage - 1);
    }
  };

  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2)
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="mt-2 flex items-center justify-end gap-2 sm:gap-6">
      <div className="flex items-center gap-2 md:gap-5">
        {/* Previous button */}
        <div
          className={clsx(
            "cursor-pointer",
            currentPage <= 1 && "opacity-50 !cursor-not-allowed"
          )}
        >
          <Icon name="paginationLeftarrow" onClick={handlePreviousPage} />
        </div>

        <ul className="hidden md:flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <li
              key={index}
              onClick={() =>
                page !== "..." && handlePageChange(Number(page) - 1)
              }
              className={clsx(
                "flex items-center justify-center rounded-md text-sm font-semibold w-9 h-9",
                page === "..." && "cursor-default text-gray-400",
                page !== "..." &&
                  currentPage !== page &&
                  "cursor-pointer hover:bg-gray-200",
                currentPage === page && "bg-blue-600 text-white cursor-default"
              )}
            >
              <button disabled={page === "..."}>{page}</button>
            </li>
          ))}
        </ul>

        <ul className="block md:hidden">
          <li className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-600 text-white text-sm font-semibold">
            {currentPage}
          </li>
        </ul>

        <div
          className={clsx(
            "cursor-pointer",
            currentPage >= totalPages && "opacity-50 !cursor-not-allowed"
          )}
        >
          <Icon name="paginationRightarrow" onClick={handleNextPage} />
        </div>
      </div>
    </div>
  );
};

export default Pagination;
