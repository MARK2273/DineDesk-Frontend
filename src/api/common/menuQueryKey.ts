export const menuQueryKeyMap = {
  menuList: (params?: object) =>
    ["menuList", params].filter((item) => item !== undefined),
  menu: (id: string | number | undefined) => {
    return ["menu", id].filter((item) => item !== undefined);
  },
  // getOrder: ({ id, params }: { id?: string | number; params?: object } = {}) =>
  //   ["getOrder", id, params].filter((item) => item !== undefined),
  // orderPracticeList: (params?: object) =>
  //   ["orderPracticeList", params].filter((item) => item !== undefined),
};
