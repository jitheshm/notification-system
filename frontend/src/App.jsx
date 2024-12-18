import { createContext, useState } from "react";
// import "./App.css";
import AuthComponent from "./components/Auth";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router";

export const AuthContext = createContext({
  auth: false,
  setAuth: () => {},
});

function App() {
  const [authStatus, setAuthStatus] = useState(false);

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthContext.Provider
          value={{ auth: authStatus, setAuth: setAuthStatus }}
        >
          {authStatus ? null : <AuthComponent />}
        </AuthContext.Provider>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
