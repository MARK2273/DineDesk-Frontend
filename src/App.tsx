import QueryProvider from "./api/QueryProvider";
import Route from "./routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./index.css";

const App = () => {
  return (
    <QueryProvider>
      <ToastContainer />
      <Route />
    </QueryProvider>
  );
};

export default App;
