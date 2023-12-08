"use client";

import * as React from "react";
import { useStorage } from "../../../esm";

export const UseStorage: React.FC = () => {
  const { status, result, error, set, remove } = useStorage("react-hooks", "example");

  if (status === "loading") {
    return <p>Fetching values...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  const handleSetValue = async () => {
    await set("Just changed from the app");
  };

  const handleRemoveValue = async () => {
    await remove();
  };

  if (status === "success") {
    return (
      <div>
        <p>Current value:</p>
        <pre>{JSON.stringify(result, null, 2)}</pre>
        <button onClick={handleSetValue}>Set value</button>
        <button disabled={!result} onClick={handleRemoveValue}>
          Remove value
        </button>
      </div>
    );
  }
};
