export const orderQueryKeyMap = {
  orderList: (params?: object) =>
    ["orderList", params].filter((item) => item !== undefined),
  order: (id: string | number | undefined) => {
    return ["order", id].filter((item) => item !== undefined);
  },
};
