"use client";

import * as React from "react";

import { UseCurrentUser } from "./pages/UserCurrentUser";
import { Index } from "./pages/Index";
import { Miro } from "./pages/UseMiro";
import { UseInfo } from "./pages/UseInfo";
import { UseOnlineUsers } from "./pages/UseOnlineUsers";
import { UseSelectedItems } from "./pages/UseSelectedItems";
import { UseViewport } from "./pages/UseViewport";
import { UseStorage } from "./pages/UseStorage";
import { UseSession } from "./pages/UseSession";

export const routes = [
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
  {
    path: "/use-storage",
    element: <UseStorage />,
  },
  {
    path: "/use-session",
    element: <UseSession />,
  },
];
