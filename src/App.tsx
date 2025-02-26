import QueryProvider from "./api/QueryProvider";
import { Provider } from "react-redux";
import Route from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./redux/store";

const App = () => {
  return (
    <Provider store={store}>
      <QueryProvider>
        <ToastContainer />
        <Route />
      </QueryProvider>
    </Provider>
  );
};

export default App;
