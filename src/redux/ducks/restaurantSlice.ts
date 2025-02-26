import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Restaurant {
  id: number;
  name: string;
}

interface RestaurantState {
  selectedRestaurant: Restaurant | null;
}

const initialState: RestaurantState = {
  selectedRestaurant: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",
  initialState,
  reducers: {
    setRestaurant: (state, action: PayloadAction<Restaurant>) => {
      state.selectedRestaurant = action.payload;
    },
    removeRestaurant: (state) => {
      state.selectedRestaurant = null;
    },
  },
});

export const { setRestaurant, removeRestaurant } = restaurantSlice.actions;

export default restaurantSlice.reducer;
