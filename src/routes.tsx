import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Students from "./pages/Students";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "quiz", element: <Quiz /> },
      { path: "students", element: <Students /> },
    ],
  },
]); 