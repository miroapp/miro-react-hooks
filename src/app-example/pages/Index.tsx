"use client";

import * as React from "react";
import { Link } from "react-router-dom";
import { routes } from "../routes";

const readable = (path: string) => path.split("/").pop();

export const Index: React.FC = () => {
  return (
    <main>
      <ul>
        {routes.map((route) => (
          <li key={route.path}>
            <Link to={route.path}>{readable(route.path)}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
};
