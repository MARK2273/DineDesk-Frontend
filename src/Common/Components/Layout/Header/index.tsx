import { useEffect, useState } from "react";
import CustomSelect, { OptionType } from "../../FormField/CustomSelect";
import { useGetRestaurantList } from "@dine-desk/api/restaurant";
import SectionLoader from "../../Loader/Spinner";
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

  const { data, isLoading, dataUpdatedAt } = useGetRestaurantList();

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

  // useEffect(() => {
  //   const storedRestaurantId = storage.getItem("restaurantId");

  //   if (storedRestaurantId && data) {
  //     const existingRestaurant = data.find(
  //       (option: OptionType) => option.value === storedRestaurantId
  //     );

  //     if (existingRestaurant) {
  //       dispatch(
  //         setRestaurant({
  //           id: +existingRestaurant.value,
  //           name: existingRestaurant.label,
  //         })
  //       );
  //       setSelectedOption(existingRestaurant);
  //     } else {
  //       dispatch(removeRestaurant());
  //       setSelectedOption(null);
  //       storage.removeItem("restaurantId");
  //     }
  //   }
  // }, [dataUpdatedAt, dispatch]);

  useEffect(() => {
    if (!data || data.length === 0) {
      // No restaurants returned from API
      dispatch(removeRestaurant());
      setSelectedOption(null);
      storage.removeItem("restaurantId");
      return;
    }

    const storedRestaurantId = storage.getItem("restaurantId");
    console.log("Stored Restaurant ID:", storedRestaurantId);
    console.log("Data:", data);

    if (storedRestaurantId) {
      const existingRestaurant = data.find(
        (option: OptionType) => option.value.toString() === storedRestaurantId
      );

      if (existingRestaurant) {
        // Valid restaurant ID in storage, restore it
        dispatch(
          setRestaurant({
            id: +existingRestaurant.value,
            name: existingRestaurant.label,
          })
        );
        setSelectedOption(existingRestaurant);
      } else {
        // Invalid restaurant ID in storage
        dispatch(removeRestaurant());
        setSelectedOption(null);
        storage.removeItem("restaurantId");
      }
    } else {
      // No stored ID — select first restaurant
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
  }, [dataUpdatedAt, data, dispatch]);

  if (isLoading) {
    return <SectionLoader />;
  }

  return (
    <header className="bg-white shadow-md flex items-center justify-between px-6 py-4">
      <h1 className="text-lg font-semibold">
        {routeData?.headerName || "Dashboard"}
      </h1>
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
