import CustomTable from "@dine-desk/Common/Components/Table";
import { useOrderManagement } from "./hooks";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        // className="bg-white rounded-xl shadow-sm  border-gray-200 overflow-hidden"
      >
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
            typeof totalRows === "string" ? parseInt(totalRows, 10) : totalRows
          }
          className="border-0"
          rowClassName="hover:bg-yellow-50"
        />
      </motion.div>
    </motion.div>
  );
};

export default Order;
