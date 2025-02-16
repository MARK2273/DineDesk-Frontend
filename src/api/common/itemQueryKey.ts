export const itemQueryKeyMap = {
  getItem: ({ id, params }: { id?: string | number; params?: object } = {}) =>
    ["getItem", id, params].filter((item) => item !== undefined),
  itemList: (menuId?: string, params?: object) =>
    ["itamList", menuId, params].filter((item) => item !== undefined),
};
