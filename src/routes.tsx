import { createBrowserRouter, type RouteObject } from "react-router-dom";
import App from "./App";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Students from "./pages/Students";

// Define route configuration with proper TypeScript types
const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
    children: [
      { 
        index: true, 
        element: <Landing /> 
      },
      { 
        path: "home", 
        element: <Home /> 
      },
      { 
        path: "quiz", 
        element: <Quiz /> 
      },
      { 
        path: "students", 
        element: <Students /> 
      },
    ],
  },
];

export const router = createBrowserRouter(routes); 