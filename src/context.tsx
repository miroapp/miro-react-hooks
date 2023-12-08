import React, { createContext, FC, PropsWithChildren } from "react";
import { Miro } from "@mirohq/websdk-types";

export type MiroContextType = {
  miro?: Miro;
};

export const MiroContext = createContext<MiroContextType>({});

export const MiroProvider: FC<PropsWithChildren<MiroContextType>> = ({ children, miro }) => {
  const miroInstance = miro ?? globalThis.miro;
  return <MiroContext.Provider value={{ miro: miroInstance }}>{children}</MiroContext.Provider>;
};
