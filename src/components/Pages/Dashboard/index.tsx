import React from "react";
// import {
//   // Line,
//   BarChart,
//   Bar,
//   PieChart,
//   Pie,
//   Cell,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   // AreaChart,
//   // Area,
// } from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingBagIcon,
  ClockIcon,
  // ExclamationTriangleIcon,
  UsersIcon,
  ChartBarIcon,
  // CalendarIcon,
  // TableCellsIcon,
  CurrencyDollarIcon,
  ScaleIcon,
} from "@heroicons/react/24/outline";
import { useGetDashboard } from "@dine-desk/api/dashboard";
import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import { RootState } from "@dine-desk/redux/store";
import { useSelector } from "react-redux";

const getIconByTitle = (title: string) => {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("revenue") || lowerTitle.includes("sales")) {
    return <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />;
  }
  if (lowerTitle.includes("order") && lowerTitle.includes("active")) {
    return <ClockIcon className="h-6 w-6 text-orange-600" />;
  }
  if (lowerTitle.includes("order") || lowerTitle.includes("orders")) {
    return <ShoppingBagIcon className="h-6 w-6 text-blue-600" />;
  }
  if (lowerTitle.includes("customer")) {
    return <UsersIcon className="h-6 w-6 text-purple-600" />;
  }
  if (lowerTitle.includes("avg") || lowerTitle.includes("average")) {
    return <ChartBarIcon className="h-6 w-6 text-green-600" />;
  }

  // Default icon
  return <ChartBarIcon className="h-6 w-6 text-gray-600" />;
};

const SummaryCard = ({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change?: { value: string; positive: boolean } | null;
  icon?: React.ReactNode;
}) => {
  // Use provided icon or get one based on title
  const cardIcon = icon || getIconByTitle(title);

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-blue-50">{cardIcon}</div>
      </div>
      {change && (
        <div
          className={`mt-2 text-sm flex items-center ${
            change.positive ? "text-green-600" : "text-red-600"
          }`}
        >
          {change.positive ? (
            <ArrowUpIcon className="h-4 w-4" />
          ) : (
            <ArrowDownIcon className="h-4 w-4" />
          )}
          <span className="ml-1">{change.value}</span>
        </div>
      )}
    </div>
  );
};

// const revenueData = [
//   { name: "Mon", revenue: 4000, orders: 24 },
//   { name: "Tue", revenue: 3000, orders: 18 },
//   { name: "Wed", revenue: 5000, orders: 30 },
//   { name: "Thu", revenue: 2780, orders: 16 },
//   { name: "Fri", revenue: 1890, orders: 12 },
//   { name: "Sat", revenue: 7390, orders: 42 },
//   { name: "Sun", revenue: 5490, orders: 35 },
// ];

// const orderStatusData = [
//   { name: "Completed", value: 400 },
//   { name: "Preparing", value: 300 },
//   { name: "Pending", value: 200 },
//   { name: "Cancelled", value: 50 },
// ];

// const topItemsData = [
//   { name: "Margherita Pizza", sales: 45, revenue: 3600 },
//   { name: "Garlic Bread", sales: 38, revenue: 1520 },
//   { name: "Pasta Alfredo", sales: 32, revenue: 2560 },
//   { name: "Tiramisu", sales: 25, revenue: 1250 },
//   { name: "Caesar Salad", sales: 18, revenue: 1260 },
// ];

// const hourlyTraffic = [
//   { hour: "11 AM", customers: 20 },
//   { hour: "12 PM", customers: 45 },
//   { hour: "1 PM", customers: 60 },
//   { hour: "2 PM", customers: 30 },
//   { hour: "6 PM", customers: 55 },
//   { hour: "7 PM", customers: 80 },
//   { hour: "8 PM", customers: 65 },
//   { hour: "9 PM", customers: 40 },
// ];

// const staffPerformance = [
//   { staff: "John", orders: 42, upselling: 18 },
//   { staff: "Sarah", orders: 38, upselling: 15 },
//   { staff: "Mike", orders: 35, upselling: 12 },
//   { staff: "Emma", orders: 28, upselling: 8 },
// ];

// const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const selectedRestaurant = useSelector(
    (state: RootState) => state.restaurant?.selectedRestaurant
  );

  const restaurantId = selectedRestaurant?.id;

  const { data: dashboardData, isLoading } = useGetDashboard(
    restaurantId ?? ""
    // {
    //   startDate: "2023-10-01",
    //   endDate: "2025-10-31",
    //   timeRange: "custom",
    // }
  );

  return isLoading ? (
    <SectionLoader />
  ) : (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Restaurant Dashboard
      </h1>

      {/* Summary Cards - Expanded */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryData.map((card, index) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            icon={card.icon}
          />
        ))}
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {dashboardData?.summaryData?.map((card: any, index: any) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
            // You can add icons based on the card title if needed
            icon={
              card.title === "Revenue" ? (
                <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />
              ) : card.title === "Orders" ? (
                <ShoppingBagIcon className="h-6 w-6 text-green-500" />
              ) : (
                <ScaleIcon className="h-6 w-6 text-purple-500" />
              )
            }
          />
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="gap-6 mb-6">
        {/* <div className="bg-white rounded-lg shadow p-4 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Weekly Performance</h2>
            <div className="flex items-center text-sm">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>Last 7 Days</span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                <Tooltip />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3B82F6"
                  fill="#93C5FD"
                  name="Revenue ($)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  stroke="#10B981"
                  name="Orders"
                  dot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div> */}

        {/* Category Performance */}
      </div>

      {/* Second Row */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Order Status Distribution
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {orderStatusData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} orders`, "Count"]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Hourly Customer Traffic
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyTraffic}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="customers" fill="#82ca9d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Staff Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={staffPerformance}
                layout="vertical"
                margin={{ left: 30, right: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type="number" />
                <YAxis dataKey="staff" type="category" width={80} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="orders"
                  name="Orders Served"
                  fill="#8884d8"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="upselling"
                  name="Upsells"
                  fill="#82ca9d"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div> */}

      {/* Bottom Row */}
      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Top Selling Items</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topItemsData}
                layout="vertical"
                margin={{ left: 30, right: 20 }}
                barCategoryGap={10}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip
                  formatter={(value, name) =>
                    name === "sales"
                      ? [`${value} orders`, "Quantity Sold"]
                      : [`$${value}`, "Revenue"]
                  }
                />
                <Legend />
                <Bar
                  dataKey="sales"
                  name="Quantity Sold"
                  fill="#8884d8"
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#82ca9d"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Inventory Alerts</h2>
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-3" />
              <div>
                <p className="font-medium">Low Stock: Mozzarella Cheese</p>
                <p className="text-sm text-gray-600">
                  Only 2kg remaining (reorder at 5kg)
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-3" />
              <div>
                <p className="font-medium">Out of Stock: Basil Leaves</p>
                <p className="text-sm text-gray-600">Order immediately</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-3" />
              <div>
                <p className="font-medium">Low Stock: Tomato Sauce</p>
                <p className="text-sm text-gray-600">
                  3 bottles remaining (reorder at 6)
                </p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <TableCellsIcon className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">5 items nearing reorder point</p>
                <p className="text-sm text-gray-600">
                  View full inventory report
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;
