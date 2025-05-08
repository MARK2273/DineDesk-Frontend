// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   ArrowUpIcon,
//   ArrowDownIcon,
//   ShoppingBagIcon,
//   ClockIcon,
//   UsersIcon,
//   ChartBarIcon,
//   CurrencyDollarIcon,
//   ScaleIcon,
//   FireIcon,
// } from "@heroicons/react/24/outline";
// import { useGetDashboard } from "@dine-desk/api/dashboard";
// import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
// import { RootState } from "@dine-desk/redux/store";
// import { useSelector } from "react-redux";

// // Define the SummaryCard component
// const SummaryCard = ({
//   title,
//   value,
//   change,
//   icon,
// }: {
//   title: string;
//   value: string;
//   change?: { value: string; positive: boolean } | null;
//   icon?: React.ReactNode;
// }) => {
//   const cardIcon = icon || getIconByTitle(title);

//   return (
//     <div className="bg-white rounded-lg shadow p-4 flex flex-col">
//       <div className="flex justify-between items-start">
//         <div>
//           <p className="text-sm font-medium text-gray-500">{title}</p>
//           <p className="text-2xl font-bold mt-1">{value}</p>
//         </div>
//         <div className="p-2 rounded-lg bg-blue-50">{cardIcon}</div>
//       </div>
//       {change && (
//         <div
//           className={`mt-2 text-sm flex items-center ${
//             change.positive ? "text-green-600" : "text-red-600"
//           }`}
//         >
//           {change.positive ? (
//             <ArrowUpIcon className="h-4 w-4" />
//           ) : (
//             <ArrowDownIcon className="h-4 w-4" />
//           )}
//           <span className="ml-1">{change.value}</span>
//         </div>
//       )}
//     </div>
//   );
// };

// const Dashboard = () => {
//   const selectedRestaurant = useSelector(
//     (state: RootState) => state.restaurant?.selectedRestaurant
//   );
//   const restaurantId = selectedRestaurant?.id;

//   const { data: dashboardData, isLoading } = useGetDashboard(
//     restaurantId ?? ""
//   );

//   if (isLoading) return <SectionLoader />;

//   // Prepare data for charts
//   const dailyStats =
//     dashboardData?.dailyStats?.map((stat: any) => ({
//       date: stat.date.split("-").pop(), // Show just the day
//       revenue: stat.revenue,
//       orders: parseInt(stat.orders),
//     })) || [];

//   const topItems =
//     dashboardData?.topItems?.map((item: any) => ({
//       name: item.itemName,
//       sales: parseInt(item.totalSold),
//     })) || [];

//   const hourlyStats =
//     dashboardData?.hourlyStats?.map((stat: any) => ({
//       hour: `${stat.hour}:00`,
//       orders: parseInt(stat.orders),
//     })) || [];

//   // Fill in missing hours with zero values
//   const completeHourlyStats = Array.from({ length: 24 }, (_, i) => {
//     const hour = i.toString().padStart(2, "0");
//     const existingHour = hourlyStats.find((h: any) => h.hour.startsWith(hour));
//     return existingHour || { hour: `${hour}:00`, orders: 0 };
//   });

//   return (
//     <div className="container mx-auto px-4 py-6">
//       {/* Summary Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//         {dashboardData?.summaryData?.map((card: any, index: any) => (
//           <SummaryCard
//             key={index}
//             title={card.title}
//             value={card.value}
//             change={card.change}
//           />
//         ))}
//         {/* Additional summary card for top items */}
//         <SummaryCard
//           title="Top Selling Item"
//           value={topItems[0]?.name || "N/A"}
//           icon={<FireIcon className="h-6 w-6 text-red-500" />}
//         />
//       </div>

//       {/* Daily Performance Chart */}
//       <div className="bg-white rounded-lg shadow p-4 mb-6">
//         <h2 className="text-lg font-semibold mb-4">Daily Performance</h2>
//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={dailyStats}>
//               <CartesianGrid strokeDasharray="3 3" vertical={false} />
//               <XAxis dataKey="date" />
//               <YAxis yAxisId="left" orientation="left" />
//               <YAxis yAxisId="right" orientation="right" />
//               <Tooltip />
//               <Legend />
//               <Bar
//                 yAxisId="left"
//                 dataKey="revenue"
//                 name="Revenue ($)"
//                 fill="#3B82F6"
//                 radius={[4, 4, 0, 0]}
//               />
//               <Bar
//                 yAxisId="right"
//                 dataKey="orders"
//                 name="Orders"
//                 fill="#10B981"
//                 radius={[4, 4, 0, 0]}
//               />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Bottom Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Top Selling Items */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <h2 className="text-lg font-semibold mb-4">Top Selling Items</h2>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart
//                 data={topItems}
//                 layout="vertical"
//                 margin={{ left: 30, right: 20 }}
//                 barCategoryGap={10}
//               >
//                 <CartesianGrid
//                   strokeDasharray="3 3"
//                   horizontal={true}
//                   vertical={false}
//                 />
//                 <XAxis type="number" />
//                 <YAxis dataKey="name" type="category" width={100} />
//                 <Tooltip />
//                 <Legend />
//                 <Bar
//                   dataKey="sales"
//                   name="Quantity Sold"
//                   fill="#8884d8"
//                   radius={[0, 4, 4, 0]}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Hourly Traffic */}
//         <div className="bg-white rounded-lg shadow p-4">
//           <h2 className="text-lg font-semibold mb-4">Hourly Order Traffic</h2>
//           <div className="h-80">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={completeHourlyStats}>
//                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                 <XAxis dataKey="hour" />
//                 <YAxis />
//                 <Tooltip />
//                 <Bar
//                   dataKey="orders"
//                   name="Orders"
//                   fill="#82ca9d"
//                   radius={[4, 4, 0, 0]}
//                 />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// function getIconByTitle(title: string): React.ReactNode {
//   const lowerTitle = title.toLowerCase();

//   if (lowerTitle.includes("revenue") || lowerTitle.includes("sales")) {
//     return <CurrencyDollarIcon className="h-6 w-6 text-blue-600" />;
//   }
//   if (lowerTitle.includes("order") && lowerTitle.includes("active")) {
//     return <ClockIcon className="h-6 w-6 text-orange-600" />;
//   }
//   if (lowerTitle.includes("order") || lowerTitle.includes("orders")) {
//     return <ShoppingBagIcon className="h-6 w-6 text-blue-600" />;
//   }
//   if (lowerTitle.includes("customer")) {
//     return <UsersIcon className="h-6 w-6 text-purple-600" />;
//   }
//   if (lowerTitle.includes("avg") || lowerTitle.includes("average")) {
//     return <ChartBarIcon className="h-6 w-6 text-green-600" />;
//   }
//   if (lowerTitle.includes("top") || lowerTitle.includes("best")) {
//     return <FireIcon className="h-6 w-6 text-red-500" />;
//   }

//   // Default icon
//   return <ScaleIcon className="h-6 w-6 text-gray-600" />;
// }

// export default Dashboard;

"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ShoppingBagIcon,
  ClockIcon,
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  FireIcon,
} from "@heroicons/react/24/outline";
import { useGetDashboard } from "@dine-desk/api/dashboard";
import SectionLoader from "@dine-desk/Common/Components/Loader/Spinner";
import { RootState } from "@dine-desk/redux/store";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

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
      className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold text-gray-500">{title}</p>
          <p className="text-3xl font-bold mt-1 text-gray-800">{value}</p>
        </div>
        <div className="p-2 rounded-xl bg-blue-100">{cardIcon}</div>
      </div>
      {change && (
        <div
          className={`mt-3 text-sm font-medium flex items-center ${
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
    </motion.div>
  );
};

const Dashboard = () => {
  const selectedRestaurant = useSelector(
    (state: RootState) => state.restaurant?.selectedRestaurant
  );
  const restaurantId = selectedRestaurant?.id;

  const { data: dashboardData, isLoading } = useGetDashboard(
    restaurantId ?? ""
  );

  if (isLoading) return <SectionLoader />;

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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {dashboardData?.summaryData?.map((card: any, index: any) => (
          <SummaryCard
            key={index}
            title={card.title}
            value={card.value}
            change={card.change}
          />
        ))}
        <SummaryCard
          title="Top Selling Item"
          value={topItems[0]?.name || "N/A"}
          icon={<FireIcon className="h-6 w-6 text-red-500" />}
        />
      </div>

      {/* Daily Performance */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6 mb-10"
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Daily Performance
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                name="Revenue ($)"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                yAxisId="right"
                dataKey="orders"
                name="Orders"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Items */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Top Selling Items
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topItems}
                layout="vertical"
                margin={{ left: 30, right: 20 }}
                barCategoryGap={10}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="sales"
                  name="Quantity Sold"
                  fill="#8884d8"
                  radius={[0, 4, 4, 0]}
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
          className="bg-white rounded-xl shadow-md p-6"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Hourly Order Traffic
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={completeHourlyStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="orders"
                  name="Orders"
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
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
  if (lowerTitle.includes("top") || lowerTitle.includes("best")) {
    return <FireIcon className="h-6 w-6 text-red-500" />;
  }

  return <ScaleIcon className="h-6 w-6 text-gray-600" />;
}

export default Dashboard;
