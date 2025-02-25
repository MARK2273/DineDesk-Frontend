import { useState, useEffect } from "react";
import CustomSelect, { OptionType } from "../../FormField/CustomSelect";
import { useGetRestaurantList } from "@dine-desk/api/restaurant";
import SectionLoader from "../../Loader/Spinner";
import { MultiValue, SingleValue } from "react-select";
import { storageHelper } from "@dine-desk/helper/storageHelper";

const Header = () => {
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const storage = storageHelper("session");
  const { data, isLoading, dataUpdatedAt } = useGetRestaurantList();

  const handleSelectChange = (
    newValue: MultiValue<OptionType> | SingleValue<OptionType>
  ) => {
    storage.setItem("restaurantId", (newValue as OptionType)?.value);
    setSelectedOption(newValue as OptionType | null);
  };

  useEffect(() => {
    if (
      selectedOption &&
      !data?.some((option: OptionType) => option.value === selectedOption.value)
    ) {
      setSelectedOption(null);
      storage.removeItem("restaurantId");
    }
  }, [selectedOption, storage, dataUpdatedAt]);

  if (isLoading) {
    return <SectionLoader />;
  }

  return (
    <header className="bg-white shadow-md flex items-center justify-between px-6 py-4">
      <h1 className="text-lg font-semibold">Dine Desk Dashboard</h1>
      <CustomSelect
        options={data}
        value={selectedOption}
        onChange={handleSelectChange}
        placeholder="Choose Restaurant"
        isClearable={true}
        isDisabled={false}
      />
    </header>
  );
};

export default Header;
