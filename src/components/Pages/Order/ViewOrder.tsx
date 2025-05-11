import { useGetOrderDetails } from "@dine-desk/api/order";
import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import NotFound from "@dine-desk/Common/Components/NotFound";
import { formatDate, getStatusColor } from "@dine-desk/helper";
import { useParams } from "react-router-dom";
import Button from "@dine-desk/Common/Components/Button";
import { ROUTES } from "@dine-desk/constants/RoutePath";
import clsx from "clsx";

const ViewOrder = () => {
  const { orderId } = useParams<{ orderId: string }>();

  if (!orderId) {
    return <NotFound path={ROUTES.ORDER.path} />;
  }

  const { data, isLoading, isError } = useGetOrderDetails(orderId);

  if (isLoading) {
    return <SectionLoader className="min-h-[60vh]" />;
  }

  if (isError || !data) {
    return <NotFound path={ROUTES.ORDER.path} />;
  }

  const { orderDate, items, totalPrice, status, customerName, tableNumber } =
    data;

  const totalItems = items.reduce(
    (acc: any, item: any) => acc + item.quantity,
    0
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header and Back Button */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          // icon="arrowLeft"
          className="border-gray-300"
        >
          Back to Orders
        </Button>
        <div className="flex items-center space-x-2">
          <span
            className={clsx(
              "px-3 py-1 rounded-full text-sm font-medium",
              getStatusColor(status)
            )}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      </div>

      {/* Order Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Order #{orderId}
            </h1>
            <p className="text-gray-500">Placed on {formatDate(orderDate)}</p>
          </div>
          <div className="mt-4 md:mt-0">
            {/* <Button
              variant="filled"
              onClick={() => {}}
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Print Receipt
            </Button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Customer</p>
            <p className="font-medium text-gray-800">
              {customerName || "Walk-in"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Table</p>
            <p className="font-medium text-gray-800">
              {tableNumber || "Takeaway"}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Total Amount</p>
            <p className="text-xl font-bold text-gray-800">₹{totalPrice}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Ordered Items ({totalItems})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {item.image && (
                        <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-100 mr-4">
                          <img
                            src={item.image}
                            alt={item.itemName}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.itemName}
                        </div>
                        {item.notes && (
                          <div className="text-xs text-gray-500 mt-1">
                            {item.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                    ₹{item.price}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td
                  colSpan={3}
                  className="px-6 py-4 text-right text-sm font-medium text-gray-500 uppercase"
                >
                  Total
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                  ₹{totalPrice}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Order Actions */}
      {/* <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          className="border-gray-300"
          title="Cancel Order"
        />
        <Button
          variant="filled"
          className="bg-yellow-600 hover:bg-yellow-700"
          title="Update Status"
        />
      </div> */}
    </div>
  );
};

export default ViewOrder;
