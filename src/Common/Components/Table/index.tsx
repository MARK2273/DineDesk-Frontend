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
import { useState } from "react";
import Icon from "../Icon";
import NoDataFound from "../NoDataFound";
import Skeleton from "../Skeleton/Skeleton";

interface CommonTableProps<T> {
  data: T[];
  columns: ColumnDef<T, T[keyof T]>[];
  isLoading?: boolean;
}

export const CustomTable = <T,>({
  data,
  columns,
  isLoading,
}: CommonTableProps<T>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection] = useState<RowSelectionState>({});

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

  return (
    <div className="rounded-lg shadow-lg overflow-hidden bg-white">
      <table className="w-full border border-gray-200 rounded-lg">
        <thead className="bg-gray-100 border-b border-gray-300">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="text-left text-gray-700">
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-4 text-sm font-semibold uppercase tracking-wide cursor-pointer select-none hover:text-gray-900 transition"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center justify-between">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {header.column.getCanSort() && (
                      <Icon
                        name={
                          header.column.getIsSorted() === "asc"
                            ? "ascSorting"
                            : header.column.getIsSorted() === "desc"
                            ? "descSorting"
                            : "sorting"
                        }
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        {/* Table Body */}
        <tbody className="text-gray-800">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-b border-gray-200">
                {columns.map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <Skeleton className="h-6 w-20 bg-gray-300 rounded-md" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4 text-sm text-gray-700">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-10 text-center">
                <NoDataFound />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
export * from "./hook/index";
