import { Table } from "@tanstack/react-table";
import clsx from "clsx";
import Icon from "../Icon";
import Button from "../Button";

interface PaginationProps<T> {
  table: Table<T>;
  currentPage: number;
  totalPages: number;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
  showPageNumbers?: boolean;
}

export const Pagination = <T,>({
  table,
  currentPage,
  totalPages,
  setCurrentPage,
  className = "",
  showPageNumbers = true,
}: PaginationProps<T>) => {
  const handlePageChange = (pageIndex: number) => {
    table.setPageIndex(pageIndex);
    if (setCurrentPage) setCurrentPage(pageIndex + 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 2);
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
    <div className={clsx("flex items-center justify-between mt-4", className)}>
      <div className="flex items-center gap-2">
        <div
          className={clsx(
            "cursor-pointer",
            currentPage <= 1 && "opacity-50 !cursor-not-allowed"
          )}
        >
          <Icon name="paginationLeftarrow" onClick={handlePreviousPage} />
        </div>
        {showPageNumbers && (
          <div className="hidden sm:flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <Button
                key={index}
                variant={currentPage === page ? "filled" : "outline"}
                size="sm"
                className={clsx(
                  "!px-3 min-w-[2.25rem] bg-amber-400",
                  page === "..." && "!bg-transparent !border-transparent"
                )}
                onClick={() =>
                  page !== "..." && handlePageChange(Number(page) - 1)
                }
                disabled={page === "..."}
              >
                {page}
              </Button>
            ))}
          </div>
        )}

        {showPageNumbers && (
          <div className="sm:hidden flex items-center">
            <Button
              variant="filled"
              size="sm"
              className="!px-3 min-w-[2.25rem]"
              disabled
            >
              {currentPage}
            </Button>
          </div>
        )}

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
