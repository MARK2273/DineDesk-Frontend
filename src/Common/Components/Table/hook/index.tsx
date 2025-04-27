// import { transformSorting } from "@emr-web/common/helper";
import { UseQueryResult } from "@tanstack/react-query";
import { Row, SortingState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface GeneralTableHookProps<Data, QueryParams> {
  apiCall: (
    queryParams: QueryParams,
    id?: string | number | undefined
  ) => UseQueryResult<
    {
      data: Data;
      total: number | string;
      currentPage: number | string;
      [key: string]:
        | string
        | number
        | Data
        | { [key: string]: string | number };
    },
    Error
  >;
  isDashboard?: boolean;
  initialQueryParams: QueryParams;
  defaultPage?: number;
  defaultPageSize?: number;
  // transformSorting?: (sorting: SortingState | undefined) => any;
  id?: string | number | undefined;
}

export const useTableManagement = <Data, QueryParams>({
  apiCall,
  initialQueryParams,
  id,
  defaultPage = 1,
  defaultPageSize = 10,
}: GeneralTableHookProps<Data, QueryParams>) => {
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [searchQuery, setSearchQuery] = useState("");
  const [_, setDebouncedQuery] = useState("");
  const [selectedRow, setSelectedRow] = useState<Row<Data>[]>();
  const [sorting, setSorting] = useState<SortingState>([]);
  // Debounce the search input
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchQuery]);

  // API call with current state
  const apiData = apiCall(
    // {
    //   ...initialQueryParams,
    //   page: currentPage,
    //   limit: isDashboard ? 5 : pageSize,
    //   search: debouncedQuery,
    //   // ...(transformSorting && sorting && { order: transformSorting(sorting) })
    // },
    { ...initialQueryParams, page: currentPage, limit: pageSize },
    id
  );

  return {
    apiData,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    selectedRow,
    setSelectedRow,
    searchQuery,
    setSearchQuery,
    sorting,
    setSorting,
  };
};

export default useTableManagement;
