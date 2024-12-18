import { createContext, useState } from "react";
// import "./App.css";
import AuthComponent from "./components/Auth";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/admin/Dashboard";

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
          {authStatus ? <Dashboard /> : <AuthComponent />}
        </AuthContext.Provider>
      ),
    },
    {
      path: "/admin",
      element: <AdminDashboard />,
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
