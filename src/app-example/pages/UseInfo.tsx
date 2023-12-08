"use client";

import * as React from "react";
import { useInfo } from "../../../esm";

export const UseInfo: React.FC = () => {
  const { status, error, result } = useInfo();

  if (status === "loading") {
    return <p>Fetching board info...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  if (status === "success") {
    return (
      <div>
        <p>Current board info</p>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  }
};
