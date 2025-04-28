import CustomTable from "@dine-desk/Common/Components/Table";
import { useOrderManagement } from "./hooks";

const Order = () => {
  const {
    columns,
    data,
    isDataLoading,
    setCurrentPage,
    currentPage,
    totalRows,
  } = useOrderManagement();
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full overflow-x-auto">
        <div className="min-w-[300px]">
          <CustomTable
            data={data}
            columns={columns}
            isLoading={isDataLoading}
            setCurrentPage={setCurrentPage}
            currentPage={
              typeof currentPage === "string"
                ? parseInt(currentPage, 10)
                : currentPage
            }
            totalRows={
              typeof totalRows === "string"
                ? parseInt(totalRows, 10)
                : totalRows
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Order;
