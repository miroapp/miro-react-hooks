import React, { createContext, FC } from "react";
import { Miro } from "@mirohq/websdk-types";

export type MiroContextType = {
  miro: Miro;
};

export const MiroContext = createContext<MiroContextType>();

export const MiroProvider: FC<MiroContextType> = ({ children, miro }) => {
  return <MiroContext.Provider value={{ miro }}>{children}</MiroContext.Provider>;
};
