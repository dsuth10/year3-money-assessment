import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Landing from "./pages/Landing";
// import Home from "./pages/Home";
// import Quiz from "./pages/Quiz";
// import Students from "./pages/Students";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Landing /> },
      // Temporarily comment out other routes to test landing page
      // { path: "home", element: <Home /> },
      // { path: "quiz", element: <Quiz /> },
      // { path: "students", element: <Students /> },
    ],
  },
]); 