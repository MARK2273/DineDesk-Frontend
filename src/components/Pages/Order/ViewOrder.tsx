
import { useGetOrderDetails } from "@dine-desk/api/order";
import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import NotFound from "@dine-desk/Common/Components/NotFound";
import { formatDate } from "@dine-desk/helper";
import { useParams } from "react-router-dom";

const ViewOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();

  if (!orderId) {
    return <NotFound path="/" />;
  }

  const { data, isLoading, isError } = useGetOrderDetails(orderId);

  if (isLoading) {
    return <SectionLoader />;
  }

  if (isError || !data) {
    return <NotFound path="/" />;
  }

  const { orderDate, items, totalPrice, status } = data;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalItems = items.reduce(
    (acc: number, item: any) => acc + item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8 min-h-screen">
      {/* Order Overview */}
      <div className="bg-white shadow-lg rounded-3xl p-8 border border-blue-100">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-blue-900 mb-2">
              Order #{orderId}
            </h1>
            <p className="text-gray-500 text-sm">
              Placed on: {formatDate(orderDate)}
            </p>
          </div>
          <div className="text-right mt-6 md:mt-0">
            <span
              className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getStatusStyle(
                status
              )} shadow`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base text-gray-700">
          <div className="flex flex-col bg-blue-50 rounded-2xl p-4">
            <span className="text-sm text-gray-500 mb-1">Total Items</span>
            <span className="font-semibold text-blue-900">{totalItems}</span>
          </div>
          <div className="flex flex-col bg-blue-50 rounded-2xl p-4">
            <span className="text-sm text-gray-500 mb-1">Total Amount</span>
            <span className="font-semibold text-blue-900">₹ {totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white shadow-lg rounded-3xl p-8 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Ordered Items</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100 text-blue-900 text-sm uppercase tracking-wide">
                <th className="p-4">#</th>
                <th className="p-4">Item Name</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Price (₹)</th>
                <th className="p-4">Subtotal (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, index: number) => (
                <tr
                  key={item.id}
                  className="border-t border-blue-100 hover:bg-blue-50 transition-all duration-200"
                >
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4 font-medium">{item.itemName}</td>
                  <td className="p-4">{item.quantity}</td>
                  <td className="p-4">₹ {item.price}</td>
                  <td className="p-4">₹ {item.price * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewOrder;
