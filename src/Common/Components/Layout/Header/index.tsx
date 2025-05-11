import { useEffect, useState } from "react";
import CustomSelect, { OptionType } from "../../FormField/CustomSelect";
import { useGetRestaurantList } from "@dine-desk/api/restaurant";
import { MultiValue, SingleValue } from "react-select";
import { storageHelper } from "@dine-desk/helper/storageHelper";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@dine-desk/redux/store";
import {
  removeRestaurant,
  setRestaurant,
} from "@dine-desk/redux/ducks/restaurantSlice";
import { matchPath, useLocation } from "react-router-dom";
import { ROUTES } from "@dine-desk/constants/RoutePath";

const Header = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const storage = storageHelper("session");
  const routeData = Object.values(ROUTES).find((route) =>
    matchPath(route.path, location.pathname)
  );

  const { data, dataUpdatedAt, isLoading } = useGetRestaurantList();
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);

  const handleSelectChange = (
    newValue: MultiValue<OptionType> | SingleValue<OptionType>
  ) => {
    if (newValue === null) {
      storage.removeItem("restaurantId");
      dispatch(removeRestaurant());
      setSelectedOption(null);
      return;
    }

    const selected = newValue as OptionType;
    storage.setItem("restaurantId", selected.value);
    dispatch(setRestaurant({ id: +selected.value, name: selected.label }));
    setSelectedOption(selected);
  };

  useEffect(() => {
    if (!data || data.length === 0) {
      dispatch(removeRestaurant());
      setSelectedOption(null);
      storage.removeItem("restaurantId");
      return;
    }

    const storedRestaurantId = storage.getItem("restaurantId");
    if (storedRestaurantId) {
      const existingRestaurant = data.find(
        (option: OptionType) => option.value.toString() === storedRestaurantId
      );

      if (existingRestaurant) {
        dispatch(
          setRestaurant({
            id: +existingRestaurant.value,
            name: existingRestaurant.label,
          })
        );
        setSelectedOption(existingRestaurant);
      } else {
        dispatch(removeRestaurant());
        setSelectedOption(null);
        storage.removeItem("restaurantId");
      }
    } else {
      const firstRestaurant = data[0];
      dispatch(
        setRestaurant({
          id: +firstRestaurant.value,
          name: firstRestaurant.label,
        })
      );
      setSelectedOption(firstRestaurant);
      storage.setItem("restaurantId", firstRestaurant.value);
    }
  }, [dataUpdatedAt, dispatch]);

  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        <div className="flex items-center gap-4">
          {/* Mobile sidebar toggle */}

          <h1 className="text-xl font-semibold text-gray-800">
            {routeData?.headerName || "Dashboard"}
          </h1>
        </div>

        <div className="w-64">
          <CustomSelect
            options={data}
            value={selectedOption}
            onChange={handleSelectChange}
            placeholder="Choose Restaurant"
            isClearable={true}
            isDisabled={false}
            isLoading={isLoading}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
