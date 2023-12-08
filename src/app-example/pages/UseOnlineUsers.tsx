"use client";

import * as React from "react";
import { useOnlineUsers } from "../../../esm";

export const UseOnlineUsers: React.FC = () => {
  const { status, result, error } = useOnlineUsers();

  if (status === "loading") {
    return <p>Fetching online users...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  if (status === "success") {
    return (
      <div>
        <p>Online users</p>
        <ul>
          {result.map((user) => (
            <li key={user.id}>
              #{user.id} - {user.name}
            </li>
          ))}
        </ul>
      </div>
    );
  }
};
