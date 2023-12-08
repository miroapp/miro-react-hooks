"use client";

import * as React from "react";
import { useMiro } from "../../../esm";

export const Miro: React.FC = () => {
  const miro = useMiro();

  return <pre>{JSON.stringify(miro, null, 2)}</pre>;
};
