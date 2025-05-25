import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  UsersIcon,
  ChartBarIcon,
  ScaleIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { useGetDashboard } from "@dine-desk/api/dashboard";
import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import { RootState } from "@dine-desk/redux/store";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import Icon from "@dine-desk/Common/Components/Icon";
import DateRangePicker, {
  DateRange,
} from "@dine-desk/Common/Components/FormField/DateRangePicker";

const colors = {
  primary: "#4F46E5", // Soft indigo
  secondary: "#10B981", // Muted teal
  accent: "#F59E0B", // Warm amber (for highlights)
  neutral: "#6B7280", // Cool gray
  background: "#F9FAFB", // Very light gray
  card: "#FFFFFF", // White
  success: "#34D399", // Soft green
  warning: "#FBBF24", // Light amber
};

// Summary Card Component
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
  const cardIcon = icon || getIconByTitle(title);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-lg shadow-xs border border-gray-100 p-4 hover:shadow-sm transition-all duration-200 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className="text-xl font-semibold mt-1 text-gray-700">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
          {cardIcon}
        </div>
      </div>
      {change && (
        <div
          className={`mt-2 text-xs font-medium flex items-center ${
            change.positive ? "text-green-500" : "text-rose-500"
          }`}
        >
          {change.positive ? (
            <ArrowUpIcon className="h-3 w-3" />
          ) : (
            <ArrowDownIcon className="h-3 w-3" />
          )}
          <span className="ml-1">{change.value}</span>
        </div>
      )}
    </motion.div>
  );
};

const Dashboard = () => {
  const selectedRestaurant = useSelector(
    (state: RootState) => state.restaurant?.selectedRestaurant
  );
  const restaurantId = selectedRestaurant?.id;

  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const getApiParams = () => {
    if (dateRange.startDate && dateRange.endDate) {
      return {
        timeRange: "custom",
        startDate: dateRange.startDate.toISOString().split("T")[0],
        endDate: dateRange.endDate.toISOString().split("T")[0],
      };
    }
    return {}; // Return empty object when no dates are selected
  };

  const {
    data: dashboardData,
    isLoading,
    refetch,
  } = useGetDashboard(restaurantId ?? "", getApiParams());

  const dailyStats =
    dashboardData?.dailyStats?.map((stat: any) => ({
      date: stat.date.split("-").pop(),
      revenue: stat.revenue,
      orders: parseInt(stat.orders),
    })) || [];

  const topItems =
    dashboardData?.topItems?.map((item: any) => ({
      name: item.itemName,
      sales: parseInt(item.totalSold),
    })) || [];

  const hourlyStats =
    dashboardData?.hourlyStats?.map((stat: any) => ({
      hour: `${stat.hour}:00`,
      orders: parseInt(stat.orders),
    })) || [];

  const completeHourlyStats = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0");
    const existingHour = hourlyStats.find((h: any) => h.hour.startsWith(hour));
    return existingHour || { hour: `${hour}:00`, orders: 0 };
  });

  useEffect(() => {
    if (restaurantId && dateRange.startDate && dateRange.endDate) {
      refetch();
    }
  }, [dateRange.startDate, dateRange.endDate, restaurantId, refetch]);

  return isLoading ? (
    <SectionLoader />
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto min-h-screen"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {dashboardData?.summaryData?.map((card: any, index: any) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
          />
        ))}
        <SummaryCard
          title="Top Seller"
          value={topItems[0]?.name || "N/A"}
          icon={<FireIcon className="h-4 w-4 text-amber-500" />}
        />
      </div>

      {/* Daily Performance */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col gap-5"
      >
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={(range) => {
            setDateRange(range);
          }}
          isClearable={true}
        />
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-xs border border-gray-100 p-4 mb-6"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-medium text-gray-700">
              Daily Performance
            </h2>
            {/* <span className="text-xs text-gray-400">All Time</span> */}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyStats}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="date"
                  tick={{ fill: colors.neutral, fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fill: colors.neutral, fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fill: colors.neutral, fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#E5E7EB",
                    borderRadius: "6px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#6366F1"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#10B981"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#colorOrders)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Top Items */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-xs border border-gray-100 p-4"
        >
          <h2 className="text-base font-medium mb-3 text-gray-700">
            Top Menu Items
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topItems}
                layout="vertical"
                margin={{ left: 30, right: 20 }}
                barCategoryGap={8}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  type="number"
                  tick={{ fill: colors.neutral, fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={80}
                  tick={{ fill: colors.neutral, fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#E5E7EB",
                    borderRadius: "6px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
                <Bar
                  dataKey="sales"
                  name="Quantity Sold"
                  fill="#8B5CF6"
                  radius={[0, 3, 3, 0]}
                  barSize={12}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Hourly Traffic */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-xs border border-gray-100 p-4"
        >
          <h2 className="text-base font-medium mb-3 text-gray-700">
            Hourly Orders
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completeHourlyStats}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="hour"
                  tick={{ fill: colors.neutral, fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: colors.neutral, fontSize: 12 }}
                  axisLine={{ stroke: "#E5E7EB" }}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    borderColor: "#E5E7EB",
                    borderRadius: "6px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill="#EC4899"
                  radius={[3, 3, 0, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

function getIconByTitle(title: string): React.ReactNode {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("revenue") || lowerTitle.includes("sales")) {
    return <Icon name="revenue" className="h-4 w-4 text-amber-500" />;
  }
  if (lowerTitle.includes("order") && lowerTitle.includes("active")) {
    return <Icon name="shopingBag" className="h-4 w-4 text-amber-500" />;
  }
  if (lowerTitle.includes("order") || lowerTitle.includes("orders")) {
    return <Icon name="shopingBag" className="h-4 w-4 text-amber-500" />;
  }
  if (lowerTitle.includes("customer")) {
    return <UsersIcon className="h-4 w-4 text-teal-500" />;
  }
  if (lowerTitle.includes("avg") || lowerTitle.includes("average")) {
    return <ChartBarIcon className="h-4 w-4 text-indigo-300" />;
  }
  if (lowerTitle.includes("top") || lowerTitle.includes("best")) {
    return <FireIcon className="h-4 w-4 text-amber-500" />;
  }

  return <ScaleIcon className="h-4 w-4 text-gray-400" />;
}

export default Dashboard;
