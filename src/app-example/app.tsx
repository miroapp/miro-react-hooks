"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { MiroProvider } from "../../esm";
import { routes } from "./routes";

const router = createBrowserRouter(routes);

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
