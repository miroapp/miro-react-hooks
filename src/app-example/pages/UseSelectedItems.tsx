"use client";

import * as React from "react";
import { useSelectedItems } from "../../../esm";

export const UseSelectedItems: React.FC = () => {
  const { status, result, error } = useSelectedItems();

  if (status === "loading") {
    return <p>Fetching selected items...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  if (status === "success") {
    return (
      <div>
        <p>Selected items:</p>
        <ul>
          {result.map((item) => (
            <li key={item.id}>
              #{item.id} - {item.type}
            </li>
          ))}
        </ul>
      </div>
    );
  }
};
