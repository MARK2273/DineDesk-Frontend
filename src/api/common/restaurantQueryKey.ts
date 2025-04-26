export const restaurantQueryKeyMap = {
  restaurantList: (params?: object) =>
    ["restaurantList", params].filter((item) => item !== undefined),
  restaurant: (id: string | number | undefined) => {
    return ["restaurant", id].filter((item) => item !== undefined);
  },
  // getOrder: ({ id, params }: { id?: string | number; params?: object } = {}) =>
  //   ["getOrder", id, params].filter((item) => item !== undefined),
  // orderPracticeList: (params?: object) =>
  //   ["orderPracticeList", params].filter((item) => item !== undefined),
};
