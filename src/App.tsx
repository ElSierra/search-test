import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { Home } from "./home";
export const router = createBrowserRouter([
  {
    path: "/",
  
    element: (
      <Home/>
    ),
  },
 
]);

