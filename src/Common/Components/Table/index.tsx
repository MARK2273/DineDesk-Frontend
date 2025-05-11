import {
  ColumnDef,
  RowSelectionState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import Icon from "../Icon";
import NoDataFound from "../NoDataFound";
import Skeleton from "../Skeleton/Skeleton";
import Pagination from "../Pagination";
import clsx from "clsx";

interface CommonTableProps<T> {
  data: T[];
  columns: ColumnDef<T, T[keyof T]>[];
  isLoading?: boolean;
  totalRows?: number;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  currentPage?: number;
  showPagination?: boolean;
  className?: string;
  rowClassName?: string | ((row: T) => string);
  headerClassName?: string;
  emptyState?: React.ReactNode;
}

export const CustomTable = <T,>({
  data,
  columns,
  isLoading,
  totalRows,
  currentPage,
  setCurrentPage,
  showPagination = true,
  className,
  rowClassName,
  headerClassName,
  emptyState,
}: CommonTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection] = useState<RowSelectionState>({});
  const [prevPage, setPrevPage] = useState(currentPage);

  const tableRef = useRef<HTMLDivElement | null>(null);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, rowSelection },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    onSortingChange: setSorting,
  });

  useEffect(() => {
    if (prevPage !== currentPage) {
      setPrevPage(currentPage);
      if (tableRef.current) {
        tableRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [currentPage, data]);

  const totalPages = totalRows
    ? Math.ceil((totalRows || data?.length || 10) / 10)
    : 0;

  return (
    <div className={clsx("w-full flex flex-col", className)} ref={tableRef}>
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className={clsx("bg-gray-50", headerClassName)}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={clsx(
                      "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                      header.column.getCanSort() &&
                        "cursor-pointer hover:bg-gray-100"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center justify-between">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <span className="ml-2">
                          {/* <Icon
                            name={
                              header.column.getIsSorted() === "asc"
                                ? "chevronUp"
                                : header.column.getIsSorted() === "desc"
                                ? "chevronDown"
                                : "sort"
                            }
                            className="w-4 h-4 text-gray-400"
                          /> */}
                          <Icon
                            name={
                              header.column.getIsSorted() === "asc"
                                ? "ascSorting"
                                : header.column.getIsSorted() === "desc"
                                ? "descSorting"
                                : "sorting"
                            }
                          />
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      <Skeleton className="h-4 w-full" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={clsx(
                    "hover:bg-gray-50 transition-colors",
                    typeof rowClassName === "function"
                      ? rowClassName(row.original)
                      : rowClassName
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  {emptyState || <NoDataFound />}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPagination && currentPage && data?.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4 px-2">
          <div className="text-sm text-gray-600">
            Showing {table.getRowModel().rows.length} of{" "}
            {totalRows || data.length} items
          </div>
          <Pagination
            table={table}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
};

export default CustomTable;
export * from "./hook/index";
