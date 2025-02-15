import QueryProvider from "./api/QueryProvider";
import Route from "./routes";
// import "./index.css";

const App = () => {
  return (
    <QueryProvider>
      <Route />
    </QueryProvider>
  );
};

export default App;
