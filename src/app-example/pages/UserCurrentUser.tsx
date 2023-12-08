"use client";

import * as React from "react";
import { useCurrentUser } from "../../../esm";

export const UseCurrentUser: React.FC = () => {
  const { status, result, error } = useCurrentUser();

  if (status === "loading") {
    return <p>Fetching user...</p>;
  }

  if (error) {
    return <p>Something went wrong</p>;
  }

  if (status === "success") {
    return <p>The current user is "{result?.name}"</p>;
  }
};
