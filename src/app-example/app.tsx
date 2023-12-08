"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { MiroProvider } from "../../esm";

import { UseCurrentUser } from "./pages/UserCurrentUser";
import { Index } from "./pages/Index";
import { Miro } from "./pages/UseMiro";
import { UseInfo } from "./pages/UseInfo";
import { UseOnlineUsers } from "./pages/UseOnlineUsers";
import { UseSelectedItems } from "./pages/UseSelectedItems";
import { UseViewport } from "./pages/UseViewport";

const router = createBrowserRouter([
  {
    path: "/app.html",
    element: <Index />,
  },
  {
    path: "/miro",
    element: <Miro />,
  },
  {
    path: "/use-current-user",
    element: <UseCurrentUser />,
  },
  {
    path: "/use-info",
    element: <UseInfo />,
  },
  {
    path: "/use-online-users",
    element: <UseOnlineUsers />,
  },
  {
    path: "/use-selected-items",
    element: <UseSelectedItems />,
  },
  {
    path: "/use-viewport",
    element: <UseViewport />,
  },
]);

const App = () => {
  return (
    <React.StrictMode>
      <MiroProvider>
        <RouterProvider router={router} />
      </MiroProvider>
    </React.StrictMode>
  );
};

const container = document.getElementById("root")!;
const root = createRoot(container);
root.render(<App />);
