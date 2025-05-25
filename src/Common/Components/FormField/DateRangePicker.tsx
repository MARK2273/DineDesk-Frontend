import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface CustomDateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (range: DateRange) => void;
  label?: string;
  className?: string;
  isClearable?: boolean;
}

const DateRangePicker: React.FC<CustomDateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  label = "Select Date Range",
  className = "",
  isClearable = true,
}) => {
  const [range, setRange] = useState<[Date | null, Date | null]>([
    startDate,
    endDate,
  ]);

  useEffect(() => {
    setRange([startDate, endDate]);
  }, [startDate, endDate]);

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setRange([start, end]);
    // if (start && end) {
    onChange({ startDate: start, endDate: end });
    // }
  };

  return (
    <div className={`custom-date-range-picker ${className}`}>
      {label && <label className="block mb-1 font-medium">{label}</label>}
      <DatePicker
        selectsRange
        startDate={range[0]}
        endDate={range[1]}
        onChange={handleChange}
        isClearable={isClearable}
        placeholderText="Select date range"
        className={`w-full px-4 pr-14 py-2 border rounded-md bg-Gray-400 border-solid !border-Gray-300 text-gray-600 placeholder:text-Gray-600 focus:outline-Primary-400 focus:outline-1 truncate ${className}`}
      />
    </div>
  );
};

export default DateRangePicker;
