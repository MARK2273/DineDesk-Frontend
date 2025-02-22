export const storageHelper = (type: "session" | "local" = "session") => {
  const setItem = (key: string, value: any) => {
    if (type === "session") {
      sessionStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  };
  const getItem = (key: string) => {
    if (type === "session") {
      return sessionStorage.getItem(key);
    } else {
      return localStorage.getItem(key);
    }
  };
  const removeItem = (key: string) => {
    if (type === "session") {
      sessionStorage.removeItem(key);
    } else {
      localStorage.removeItem(key);
    }
  };
  const clear = () => {
    if (type === "session") {
      sessionStorage.clear();
    } else {
      localStorage.clear();
    }
  };
  return {
    setItem,
    getItem,
    removeItem,
    clear,
  };
};
