"use client";

import * as React from "react";
import { Link } from "react-router-dom";

export const Index: React.FC = () => {
  return (
    <main>
      <ul>
        <li>
          <Link to={`/miro`}>useMiro</Link>
        </li>
        <li>
          <Link to={`/use-current-user`}>useCurrentUser</Link>
        </li>
        <li>
          <Link to={`/use-info`}>useInfo</Link>
        </li>
        <li>
          <Link to={`/use-online-users`}>useOnlineUsers</Link>
        </li>
        <li>
          <Link to={`/use-selected-items`}>useSelectedItems</Link>
        </li>
        <li>
          <Link to={`/use-viewport`}>useViewport</Link>
        </li>
      </ul>
    </main>
  );
};
