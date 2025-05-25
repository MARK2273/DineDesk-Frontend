import DateRangePicker, {
  DateRange,
} from "@dine-desk/Common/Components/FormField/DateRangePicker";
import { useState } from "react";

const Report = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  return (
    <div className="max-w-md mx-auto mt-10">
      <DateRangePicker
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onChange={(range) => {
          setDateRange(range);
        }}
      />
    </div>
  );
};

export default Report;
